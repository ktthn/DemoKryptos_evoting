import pytest
from elections.paillier import generate_keypair, encrypt


def verify_zkp(public_key, ciphertext, r, plaintext):
    n, g = public_key
    c = (pow(g, plaintext, n**2) * pow(r, n, n**2)) % (n**2)
    return c == ciphertext


@pytest.mark.crypto
def test_paillier_zkp():
    pk, sk = generate_keypair(
        16
    )

    m = 6
    print("m is " + str(m))

    ciphertext, r = encrypt(pk, m)

    is_valid = verify_zkp((pk.n, pk.g), ciphertext, r, m)
    assert is_valid
