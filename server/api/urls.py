from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from . import views

urlpatterns = [
    path('token/obtain/', jwt_views.TokenObtainPairView.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('blacklist/', views.LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='blacklist'),
    path('user/create/', views.CreateUser.as_view(), name='create_user'),
    path('organization/create/', views.CreateOrganization.as_view(), name='create_organization'),
    path('causes/get/', views.GetCauses.as_view(), name='get_causes')
]