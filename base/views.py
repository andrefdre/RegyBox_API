from django.shortcuts import render
from django.contrib.auth.models import User
from .Regybox_API import RegyBox_API
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status , permissions
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken, TokenError
from .models import User, Token
from django.contrib.auth.hashers import make_password

def serve_react_app(request):
    # Serve your React app's index.html file
    return render(request, 'index.html')  # Assuming 'index.html' is your React entry point

SALT = "8b4f6b2cc1868d75ef79e5cfb8779c11b6a374bf0fce05b485581bf4e1e25b96c8c2855015de8449"

class LoginView(APIView):
    permission_classes = [AllowAny,]
    def post(self, request, format='json'):
        message = []
        email = request.data["email"]
        password = request.data["password"]
        print(f"Received email: {email}, password: {password}")
        hashed_password = make_password(password=password, salt=SALT)
        regybox_api = RegyBox_API()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = None

        if user is None:
            cookie_regybox = regybox_api.login(148, email, password)
            if cookie_regybox is None:
                return Response(
                    {
                        "success": False,
                        "message": ["Invalid Login Credentials!"],
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            else:
                user = User.objects.create(email=email, password=hashed_password)
                access_token = AccessToken.for_user(user)
                refresh_token =RefreshToken.for_user(user)
                return Response(
                    {"success": True, 
                     "message": ["You are now logged in!"],
                     "refresh_token": str(refresh_token),
                     "access_token": str(access_token),},
                    status=status.HTTP_200_OK,
                )
            

        if user.password != hashed_password:
            return Response(
                {
                    "success": False,
                    "message": ["Invalid Login Credentials!"],
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if user is not None:
            cookie_regybox = regybox_api.login(148, email, password)
            if cookie_regybox is None:
                return Response(
                    {
                        "success": False,
                        "message": ["Invalid Login Credentials!"],
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            else:
                access_token = AccessToken.for_user(user)
                refresh_token =RefreshToken.for_user(user)
                return Response(
                    {"success": True, 
                     "message": ["You are now logged in!"],
                     "refresh_token": str(refresh_token),
                     "access_token": str(access_token),},
                    status=status.HTTP_200_OK,
                )


class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST) 
                

class ProtectedDataView(APIView):
    permission_classes = [IsAuthenticated]  # Exige autenticação

    def get(self, request):
        # Aqui você pode acessar request.user para obter o usuário autenticado
        print(f"User: {request.user}")  # Verifique o que está a ser retornado

        return Response(status=status.HTTP_200_OK)