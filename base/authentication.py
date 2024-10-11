# your_app/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import User
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

class CustomJWTAuthentication(JWTAuthentication):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Set user_id_claim based on SIMPLE_JWT settings
        self.user_id_claim = settings.SIMPLE_JWT.get('USER_ID_CLAIM', 'user_id')  # Default to 'user_id' if not set

    def get_user(self, validated_token):
        user_id = validated_token[self.user_id_claim]  # Use the user_id_claim from settings
        # Change this line to search by a different field (e.g., 'email')

        try:
            user = User.objects.get(email=user_id)
            if user is None:
                raise AuthenticationFailed('No such user', 404)
        except User.DoesNotExist:
            raise AuthenticationFailed('No such user', 404)

        return user
    
    # Add a method to authenticate the refresh token
    def authenticate_refresh_token(self, refresh_token):
        # Decode the refresh token
        try:
            validated_token = RefreshToken(refresh_token)
            # Validate the token and get the user
            return self.get_user(validated_token)
        except Exception as e:
            raise AuthenticationFailed(f"Invalid refresh token: {str(e)}")