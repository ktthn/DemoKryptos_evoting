from django.db import models
from django.conf import settings
from phe import paillier
import hashlib
from .paillier import encrypt

User = settings.AUTH_USER_MODEL


class Election(models.Model):
    STATUS_CHOICES = [("open", "Open"), ("closed", "Closed")]

    title = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_elections"
    )
    public_key_n = models.BinaryField()
    private_key_p = models.BinaryField()
    private_key_q = models.BinaryField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="open")

    class Meta:
        verbose_name = "Election"
        ordering = ["start_date"]

    def __str__(self):
        return str(self.title)


class Candidate(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    election = models.ForeignKey(
        Election, on_delete=models.CASCADE, related_name="candidates"
    )

    class Meta:
        verbose_name = "Candidate"
        ordering = ["name"]

    def __str__(self):
        return str(self.name)


class Vote(models.Model):
    voter = models.ForeignKey(User, related_name="votes", on_delete=models.CASCADE)
    encrypted_vote = models.BinaryField()
    election = models.ForeignKey(
        Election, related_name="which_election", on_delete=models.CASCADE
    )
    hash = models.CharField(max_length=64)

    def save(self, *args, **kwargs):
        if not self.encrypted_vote:
            election = self.candidate.election
            public_key_n = int.from_bytes(election.public_key_n, "big")
            public_key = paillier.PaillierPublicKey(public_key_n)

            print(f"Public key used for encryption: n={public_key_n}")

            encrypted_vote, _ = encrypt(public_key, 1)
            self.encrypted_vote = encrypted_vote.to_bytes(
                (encrypted_vote.bit_length() + 7) // 8, "big"
            )
            self.hash = hashlib.sha256(self.encrypted_vote).hexdigest()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Vote"
        unique_together = ("voter", "hash")
        ordering = ["voter_id"]
