from cryptography.fernet import Fernet

def encrypt_password(password: str, encryption_key: str) -> str:
    """Encrypt the password using the provided Fernet symmetric encryption key."""
    fernet = Fernet(encryption_key.encode())
    encrypted_password = fernet.encrypt(password.encode())
    return encrypted_password.decode()

def decrypt_password(encrypted_password: str, encryption_key: str) -> str:
    """Decrypt the encrypted password using the provided key."""
    fernet = Fernet(encryption_key.encode())
    decrypted_password = fernet.decrypt(encrypted_password.encode())
    return decrypted_password.decode()