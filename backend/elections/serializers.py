from rest_framework import serializers
from .models import Election, Candidate, Vote
from phe import paillier

class ElectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = "__all__"

    def create(self, validated_data):
        public_key, private_key = paillier.generate_paillier_keypair(n_length=2048)
        validated_data["public_key_n"] = public_key.n.to_bytes(
            (public_key.n.bit_length() + 7) // 8, "big"
        )
        validated_data["private_key_p"] = private_key.p.to_bytes(
            (private_key.p.bit_length() + 7) // 8, "big"
        )
        validated_data["private_key_q"] = private_key.q.to_bytes(
            (private_key.q.bit_length() + 7) // 8, "big"
        )
        return super().create(validated_data)


class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = "__all__"


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ["candidate", "encrypted_vote", "hash", "election"]
        read_only_fields = ["encrypted_vote", "hash"]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["voter"] = request.user
        validated_data.pop("candidate_id")
        return super().create(validated_data)
