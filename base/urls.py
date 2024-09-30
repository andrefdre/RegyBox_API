from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from django.views.generic import TemplateView
from .views import login_view , check_auth, LogoutView

  
urlpatterns = [ 
    path('token/', 
          jwt_views.TokenObtainPairView.as_view(), 
          name ='token_obtain_pair'),
    path('token/refresh/', 
          jwt_views.TokenRefreshView.as_view(), 
          name ='token_refresh'),
    path('', TemplateView.as_view(template_name='index.html')),  # Serve your React app
    path('api/login/', login_view, name='login'),
    path('logout/', LogoutView.as_view(), name ='logout')
    path('api/auth/check/', check_auth, name='check_auth'),
]