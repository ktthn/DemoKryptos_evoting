from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Election, Vote, Candidate
from .serializers import ElectionSerializer, CandidateSerializer, VoteSerializer
from .paillier import encrypt, decrypt, generate_keypair
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
import json
import hashlib
from phe import paillier
from .permissions import IsAdminOrReadOnly
from django.conf import settings

User = settings.AUTH_USER_MODEL


class ElectionViewSet(viewsets.ModelViewSet):
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer
    permission_classes = [IsAdminOrReadOnly]


class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    permission_classes = [IsAdminOrReadOnly]


class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        candidate_id = request.data.get("candidate")
        if not candidate_id:
            return Response(
                {"detail": "Candidate ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            candidate = Candidate.objects.get(id=candidate_id)
        except Candidate.DoesNotExist:
            return Response(
                {"detail": "Candidate not found."}, status=status.HTTP_404_NOT_FOUND
            )

        election = candidate.election
        if election.status == "closed":
            return Response(
                {"detail": "Voting is closed for this election."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        existing_vote = Vote.objects.filter(
            voter=request.user, election=election
        ).first()
        if existing_vote:
            return Response(
                {"detail": "You have already voted in this election."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        public_key_n = int.from_bytes(election.public_key_n, "big")
        public_key = paillier.PaillierPublicKey(public_key_n)

        encrypted_vote, r = encrypt(public_key, int(candidate_id))
        encrypted_vote_bytes = encrypted_vote.to_bytes(
            (encrypted_vote.bit_length() + 7) // 8, "big"
        )
        vote_hash = hashlib.sha256(encrypted_vote_bytes).hexdigest()

        vote = Vote(
            voter=request.user,
            encrypted_vote=encrypted_vote_bytes,
            hash=vote_hash,
            election=election,
        )
        vote.save()

        return Response(
            {
                "detail": "Vote cast successfully.",
                "encrypted_vote": encrypted_vote_bytes.hex(),
                "hash": vote_hash,
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAdminUser])
    def tally_votes(self, request):
        election_id = request.query_params.get("election_id")
        if not election_id:
            return Response({"error": "election_id is required"}, status=400)

        votes = Vote.objects.filter(candidate__election_id=election_id)
        encrypted_votes = [json.loads(vote.encrypted_vote) for vote in votes]
        encrypted_sum = homomorphic_add(encrypted_votes)
        decrypted_sum = decrypt_vote(
            json.dumps(
                {
                    "ciphertext": str(encrypted_sum.ciphertext()),
                    "exponent": encrypted_sum.exponent,
                }
            )
        )

        return Response({"total_votes": decrypted_sum})


@api_view(["GET"])
def get_public_key(request):
    public_key, _ = generate_keypair(512)
    return Response({"n": str(public_key[0]), "g": str(public_key[1])})


class CloseElectionView(APIView):
    def post(self, request, election_id):
        election = get_object_or_404(Election, id=election_id)

        election.status = "closed"
        election.save()

        private_key_p = int.from_bytes(election.private_key_p, "big")
        private_key_q = int.from_bytes(election.private_key_q, "big")
        public_key_n = int.from_bytes(election.public_key_n, "big")
        public_key = paillier.PaillierPublicKey(public_key_n)
        private_key = paillier.PaillierPrivateKey(
            public_key, private_key_p, private_key_q
        )

        results = {}
        candidates = Candidate.objects.filter(election=election)

        for candidate in candidates:
            total_votes = 0
            votes = Vote.objects.filter(election=election)
            for vote in votes:
                encrypted_vote_int = int.from_bytes(vote.encrypted_vote, "big")
                encrypted_vote = paillier.EncryptedNumber(
                    public_key, encrypted_vote_int
                )
                decrypted_vote = private_key.decrypt(encrypted_vote)
                if decrypted_vote == candidate.id:
                    total_votes += 1

            results[candidate.name] = total_votes

        return Response(results, status=status.HTTP_200_OK)


class ElectionCandidatesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, election_id):
        try:
            election = Election.objects.get(id=election_id)
        except Election.DoesNotExist:
            return Response(
                {"error": "Election not found"}, status=status.HTTP_404_NOT_FOUND
            )

        candidates = Candidate.objects.filter(election=election)
        serializer = CandidateSerializer(candidates, many=True)
        return Response(serializer.data)
