from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login

  
def home(request): 
    return render(request, "home.html") 
  
def faqs(request): 
    return render(request, "faqs.html") 
  
def about(request): 
    return render(request, "about.html")

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            return render(request, 'login.html', {'error': 'Credenciais inválidas'})
    return render(request, 'login.html')