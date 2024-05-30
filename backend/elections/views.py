from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Election, Vote, Candidate
from .serializers import ElectionSerializer, CandidateSerializer, VoteSerializer
from django.shortcuts import get_object_or_404
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

        candidate = get_object_or_404(Candidate, id=candidate_id)
        election = candidate.election
        if election.status == "closed":
            return Response(
                {"detail": "Voting is closed for this election."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if Vote.objects.filter(voter=request.user, election=election).exists():
            return Response(
                {"detail": "You have already voted in this election."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Using the phe library to encrypt the vote
        public_key = paillier.PaillierPublicKey(n=int.from_bytes(election.public_key_n, 'big'))
        encrypted_vote = public_key.encrypt(int(candidate_id))
        encrypted_vote_bytes = encrypted_vote.ciphertext().to_bytes(
            (encrypted_vote.ciphertext().bit_length() + 7) // 8, 'big'
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
            return Response({"error": "election_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        election = get_object_or_404(Election, id=election_id)
        votes = Vote.objects.filter(election=election)

        private_key = paillier.PaillierPrivateKey(
            public_key=paillier.PaillierPublicKey(n=int.from_bytes(election.public_key_n, 'big')),
            p=int.from_bytes(election.private_key_p, 'big'),
            q=int.from_bytes(election.private_key_q, 'big')
        )
        total_votes = sum(private_key.decrypt(
            paillier.EncryptedNumber(private_key.public_key, int.from_bytes(vote.encrypted_vote, 'big'))) for vote in
            votes)

        return Response({"total_votes": total_votes})


@api_view(["GET"])
def get_public_key(request):
    public_key, _ = paillier.generate_paillier_keypair(n_length=2048)
    return Response({"n": str(public_key.n)})

@api_view(['GET'])
def has_voted(request, election_id):
    has_voted = Vote.objects.filter(voter=request.user, election_id=election_id).exists()
    return Response({'hasVoted': has_voted})

class CloseElectionView(APIView):
    def post(self, request, election_id):
        election = get_object_or_404(Election, id=election_id)
        election.status = "closed"
        election.save()

        private_key = paillier.PaillierPrivateKey(
            public_key=paillier.PaillierPublicKey(n=int.from_bytes(election.public_key_n, 'big')),
            p=int.from_bytes(election.private_key_p, 'big'),
            q=int.from_bytes(election.private_key_q, 'big')
        )

        results = {}
        candidates = Candidate.objects.filter(election=election)

        for candidate in candidates:
            total_votes = 0
            votes = Vote.objects.filter(election=election)
            for vote in votes:
                encrypted_vote_int = int.from_bytes(vote.encrypted_vote, "big")
                encrypted_vote = paillier.EncryptedNumber(
                    private_key.public_key, encrypted_vote_int
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
