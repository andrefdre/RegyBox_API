from django.urls import path
from django.views.generic import TemplateView
from .views import LoginView

  
urlpatterns = [ 
    path("api/login", LoginView.as_view(), name="login"),
    path('', TemplateView.as_view(template_name='index.html')),  # Serve your React app
]