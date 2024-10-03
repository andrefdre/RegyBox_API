from django.urls import path
from django.views.generic import TemplateView
from .views import LoginView, ProtectedDataView, LogoutAndBlacklistRefreshTokenForUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView 

  
urlpatterns = [ 
    path("api/login", LoginView.as_view(), name="login"),
    path('blacklist/', LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='blacklist'),
    path("api/protected", ProtectedDataView.as_view(), name="protected"),
    path('api/token/', TokenObtainPairView.as_view(), name ="token_obtain_pair"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
    path('', TemplateView.as_view(template_name='index.html')),  # Serve your React app
]