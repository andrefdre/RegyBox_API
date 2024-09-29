from django.urls import path 
from . import views 
  
urlpatterns = [ 
    path("", views.home, name="home"), 
    path("About/", views.about, name="about"), 
    path("FAQs/", views.faqs, name="faqs"),
    path('login/', views.login_view, name='login'),
]