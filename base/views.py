from django.shortcuts import render
from django.contrib.auth.models import User
from .Regybox_API import RegyBox_API
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import User, Token
from django.contrib.auth.hashers import make_password

def serve_react_app(request):
    # Serve your React app's index.html file
    return render(request, 'index.html')  # Assuming 'index.html' is your React entry point

SALT = "8b4f6b2cc1868d75ef79e5cfb8779c11b6a374bf0fce05b485581bf4e1e25b96c8c2855015de8449"
URL = "http://localhost:3000"


class LoginView(APIView):
    def post(self, request, format=None):
        email = request.data["email"]
        password = request.data["password"]
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
                        "message": "Invalid Login Credentials!",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                user = User.objects.create(email=email, password=hashed_password)
                return Response(
                    {"success": True, "message": "You are now logged in!"},
                    status=status.HTTP_200_OK,
                )
        if user is None or user.password != hashed_password:
            return Response(
                {
                    "success": False,
                    "message": "Invalid Login Credentials!",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"success": True, "message": "You are now logged in!"},
                status=status.HTTP_200_OK,
            )