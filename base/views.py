from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from .Regybox_API import RegyBox_API
from django.http import JsonResponse

def serve_react_app(request):
    # Serve your React app's index.html file
    return render(request, 'index.html')  # Assuming 'index.html' is your React entry point