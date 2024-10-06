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

class LoginView(APIView):
    permission_classes = [AllowAny,]
    def post(self, request, format='json'):
        email = request.data["email"]
        password = request.data["password"]
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
                user = User.objects.create(email=email)
                user.set_password(password)  # Use set_password to hash the password
                user.save()
                access_token = AccessToken.for_user(user)
                refresh_token =RefreshToken.for_user(user)
                regybox_token = cookie_regybox
                return Response(
                    {"success": True, 
                     "message": ["You are now logged in!"],
                     "refresh_token": str(refresh_token),
                     "access_token": str(access_token),
                     "regybox_token": str(regybox_token)},
                    status=status.HTTP_200_OK,
                )
            

        if user.check_password(password) is False:
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
                regybox_token = cookie_regybox
                return Response(
                    {"success": True, 
                     "message": ["You are now logged in!"],
                     "refresh_token": str(refresh_token),
                     "access_token": str(access_token),
                     "regybox_token": str(regybox_token)},
                    status=status.HTTP_200_OK,
                )


class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    permission_classes = (permissions.AllowAny,)

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
        regybox_token = request.query_params.get("regybox_token")
        if regybox_token is None:
            return Response(
                {
                    "success": False,
                    "message": ["Invalid Token!"],
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
        return Response(status=status.HTTP_200_OK)
    

class GetClassesForTheDay(APIView):
    permission_classes = [IsAuthenticated]  # Exige autenticação

    def get(self, request):
        date = request.query_params.get("date")
        regybox_token = request.query_params.get("regybox_token")
        regybox_api = RegyBox_API()
        requested_date, classes_of_the_day = regybox_api.get_classes_for_the_day(date , cookie=regybox_token)
        print(classes_of_the_day)
        if requested_date is None:
            return Response(
                {
                    "success": False,
                    "message": ["Invalid Token!"],
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
        
        if requested_date != date:
            return Response(
                {
                    "success": False,
                    "message": ["Invalid Date!"],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        if len(classes_of_the_day) == 0:
            return Response(
                {
                    "success": False,
                    "message": ["No classes available for the day!"],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(classes_of_the_day, status=status.HTTP_200_OK)