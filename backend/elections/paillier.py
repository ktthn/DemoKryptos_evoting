from phe import paillier
import random
from sympy import gcd


def generate_keypair(bits=2048):
    public_key, private_key = paillier.generate_paillier_keypair(n_length=bits)
    return public_key, private_key


def encrypt(public_key, plaintext):
    n = public_key.n
    g = public_key.g
    r = random.randint(1, n - 1)
    while gcd(r, n) != 1:
        r = random.randint(1, n - 1)

    c = (pow(g, plaintext, n**2) * pow(r, n, n**2)) % (n**2)
    return c, r


def decrypt(private_key, ciphertext):
    plaintext = private_key.decrypt(ciphertext)
    return plaintext

