from django.urls import path, include
from django.views.generic import TemplateView

  
urlpatterns = [ 
    path('api/', include('your_app.api.urls')),  # API endpoints for Django
    path('', TemplateView.as_view(template_name='index.html')),  # Serve your React app
]