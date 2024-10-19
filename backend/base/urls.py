from django.urls import path
from django.views.generic import TemplateView
from .views import LoginView, ProtectedDataView, LogoutAndBlacklistRefreshTokenForUserView, GetClassesForTheDay, AddClassToScheduler, RemoveClassFromScheduler, RemoveClassFromRegybox, GetAlreadyEnrolledClasses, CustomTokenRefreshView

  
urlpatterns = [ 
    path("api/login", LoginView.as_view(), name="login"),
    path('api/blacklist', LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='blacklist'),
    path("api/protected", ProtectedDataView.as_view(), name="protected"),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name="token_refresh"),
    path('api/get-classes', GetClassesForTheDay.as_view(), name="classes"),
    path('api/add-class', AddClassToScheduler.as_view(), name="add_class"),
    path('api/remove-class', RemoveClassFromScheduler.as_view(), name="remove_class"),
    path('api/remove-class-from-regybox', RemoveClassFromRegybox.as_view(), name="remove_class_regybox"),
    path('api/get-enrolled-classes', GetAlreadyEnrolledClasses.as_view(), name="get_enrolled_classes"),
]