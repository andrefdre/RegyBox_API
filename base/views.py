from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.contrib.auth.models import User
from .Regybox_API import RegyBox_API
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import login_required

def serve_react_app(request):
    # Serve your React app's index.html file
    return render(request, 'index.html')  # Assuming 'index.html' is your React entry point


@api_view(['POST'])
def login_view(request):
    regybox_api = RegyBox_API()
    email = request.data.get('email')
    password = request.data.get('password')
    errors = []
    if not email:
        errors.append('Email is required')
    if not password:
        errors.append('Password is required')

    user_cookie = regybox_api.login(148,email, password)

    if user_cookie:
        user = authenticate(request, username=email, password=password)
        if user is None:
            user = User.objects.create_user(email, email, password)
            user = authenticate(request, username=email, password=password)
    else:
        user = None

    if user is not None:
        return Response({'message': 'Login successful!' , 'token': user_cookie}, status=status.HTTP_200_OK)
    else:
        errors.append("Invalid email or password.")
        return Response({'error': errors}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@login_required  # Ensure the user is logged in
def check_auth(request):
    # This view checks if the user is authenticated
    return Response({'status': 'success', 'message': 'User is authenticated.'})

class LogoutView(APIView):
     permission_classes = (IsAuthenticated,)
     def post(self, request):
          
          try:
               refresh_token = request.data["refresh_token"]
               token = RefreshToken(refresh_token)
               token.blacklist()
               return Response(status=status.HTTP_205_RESET_CONTENT)
          except Exception as e:
               return Response(status=status.HTTP_400_BAD_REQUEST)