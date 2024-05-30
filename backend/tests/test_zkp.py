import pytest
from phe import paillier
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient


# Fixtures and test setup
@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def admin_user(db):
    User = get_user_model()
    user, created = User.objects.get_or_create(
        username='admin',
        defaults={'email': 'admin@example.com', 'password': 'password123'}
    )
    if created or not user.is_active:
        user.set_password('password123')
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save()
    return user


@pytest.fixture
def admin_token(api_client, admin_user):
    # Assuming '/api/token/' is the correct endpoint to retrieve a token
    api_client.force_authenticate(user=admin_user)
    response = api_client.get('/api/token/', format='json')
    assert response.status_code == 200, "Token retrieval failed"
    return response.data['token']


@pytest.fixture
def authenticated_client(api_client, admin_token):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + admin_token)
    return api_client


# Crypto test for Paillier encryption and decryption
@pytest.mark.crypto
def test_paillier_encryption_decryption():
    # Generate Paillier keypair using the phe library
    public_key, private_key = paillier.generate_paillier_keypair()

    # Example plaintext
    m = 6
    print("m is", m)

    # Encrypt the plaintext using the Paillier public key
    encrypted_number = public_key.encrypt(m)

    # Decrypt the ciphertext using the Paillier private key
    decrypted_number = private_key.decrypt(encrypted_number)

    # Verify that decryption of the encrypted number gives back the original number
    assert decrypted_number == m, "Decryption did not return the original plaintext"


# Registering custom pytest mark to avoid warnings
def pytest_configure(config):
    config.addinivalue_line(
        "markers", "crypto: mark test as part of the cryptographic functionalities."
    )
