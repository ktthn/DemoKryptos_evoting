import pytest
import logging
from django.contrib.auth import get_user_model
from tests.constants import ADMIN_USERNAME, ADMIN_PASSWORD
from elections.models import Election, Candidate, Vote
from phe import paillier
from .logging_api_client import LoggingAPIClient  # Ensure this is correct
import unittest
from django.test import TestCase

User = get_user_model()

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


@pytest.fixture
def api_client():
    return LoggingAPIClient()


@pytest.fixture
def admin_user(db):
    # Ensure the admin user exists and is active
    user, created = User.objects.get_or_create(
        username=ADMIN_USERNAME, defaults={"email": "admin@example.com"}
    )
    if created or not user.is_active:
        user.set_password(ADMIN_PASSWORD)
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save()
    return user


@pytest.fixture
def admin_token(api_client, admin_user):
    response = api_client.post(
        "/users/login/",
        {"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD},
        format="json",
    )
    if response.status_code != 200:
        logger.error(f"Login failed: {response.status_code} - {response.data}")
    assert (
        response.status_code == 200
    ), f"Expected 200 OK, got {response.status_code} instead. Response data: {response.data}"
    return response.data["access"]


@pytest.fixture
def authenticated_client(api_client, admin_token):
    api_client.credentials(HTTP_AUTHORIZATION="Bearer " + admin_token)
    return api_client


@pytest.fixture
def election(db, admin_user):
    public_key, private_key = paillier.generate_paillier_keypair(n_length=2048)
    return Election.objects.create(
        title="Test Election",
        description="Test Description",
        start_date="2024-01-01T00:00:00Z",
        end_date="2024-12-31T23:59:59Z",
        created_by=admin_user,
        public_key_n=public_key.n.to_bytes((public_key.n.bit_length() + 7) // 8, "big"),
        private_key_p=private_key.p.to_bytes(
            (private_key.p.bit_length() + 7) // 8, "big"
        ),
        private_key_q=private_key.q.to_bytes(
            (private_key.q.bit_length() + 7) // 8, "big"
        ),
    )


@pytest.fixture
def candidate(db, election):
    return Candidate.objects.create(
        name="Test Candidate",
        description="Test Candidate Description",
        election=election,
    )


@pytest.mark.django_db
def test_create_vote(authenticated_client, candidate):
    response = authenticated_client.post(
        "/elections/votes/", {"candidate": candidate.id}, format="json"
    )
    assert response.status_code == 201
    assert Vote.objects.count() == 1
    vote = Vote.objects.first()
    assert vote.voter.username == ADMIN_USERNAME
    assert vote.encrypted_vote is not None
    assert vote.hash is not None


@pytest.mark.django_db
def test_create_vote_without_candidate(authenticated_client):
    response = authenticated_client.post("/elections/votes/", {}, format="json")
    assert response.status_code == 400
    assert response.data["detail"] == "Candidate ID is required."


@pytest.mark.django_db
def test_create_vote_with_invalid_candidate(authenticated_client):
    response = authenticated_client.post(
        "/elections/votes/", {"candidate": 999}, format="json"
    )
    assert response.status_code == 404
    assert str(response.data.get("detail")) == "No Candidate matches the given query."


@pytest.mark.django_db
def test_create_duplicate_vote(authenticated_client, candidate):
    response = authenticated_client.post(
        "/elections/votes/", {"candidate": candidate.id}, format="json"
    )
    response = authenticated_client.post(
        "/elections/votes/", {"candidate": candidate.id}, format="json"
    )
    assert response.status_code == 400
    assert response.data["detail"] == "You have already voted in this election."
    assert Vote.objects.count() == 1


@pytest.mark.django_db
def test_cannot_vote_after_election_closed(authenticated_client, candidate):
    election = candidate.election
    election.status = "closed"
    election.save()

    response = authenticated_client.post(
        "/elections/votes/", {"candidate": candidate.id}, format="json"
    )
    assert response.status_code == 400
    assert response.data["detail"] == "Voting is closed for this election."
    assert Vote.objects.count() == 0
