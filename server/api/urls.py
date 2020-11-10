from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from . import views

urlpatterns = [
    path('token/obtain/', views.MyTokenObtainPairView.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('users/create/', views.CreateUser.as_view(), name='create_user'),
    path('users/reset-password/', views.ChangePassword.as_view(), name='reset_password'),
    path('token/blacklist/', views.LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='token_blacklist'),
    path('users/activate/', views.ActivateUser.as_view(), name='activate_user'),
    path('organization/create/', views.CreateOrganization.as_view(), name='create_organization'),
    path('causes/get/', views.GetCauses.as_view(), name='get_causes'),
    path('events/get/', views.GetEvents.as_view(), name='get_events'),
    path('attendees/user_events/', views.GetAttendees.as_view(), name='get_attendees'),
    path('attendees/create/', views.AddAttendees.as_view(), name="add_attendees"),
    path('attendees/delete/', views.DeleteAttendees.as_view(), name="delete_attendees"),
    path('users/get/', views.GetUser.as_view(), name="get_user")
]