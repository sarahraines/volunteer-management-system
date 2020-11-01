from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from . import views

urlpatterns = [
    path('token/obtain/', jwt_views.TokenObtainPairView.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('blacklist/', views.LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='blacklist'),
    path('user/create/', views.CreateUser.as_view(), name='create_user'),
    path('organization/create/', views.CreateOrganization.as_view(), name='create_organization'),
    path('organization/faq/', views.UpdateFAQ.as_view(), name='update_faq'),
    path('organization/get-faq/', views.GetFAQ.as_view(), name='get_faq'),
    path('causes/get/', views.GetCauses.as_view(), name='get_causes')
]