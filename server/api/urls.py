from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from . import views

urlpatterns = [
    path('token/obtain/', views.MyTokenObtainPairView.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('users/create/', views.CreateUser.as_view(), name='create_user'),
    path('users/reset-password/', views.ChangePassword.as_view(), name='reset_password'),
    path('token/blacklist/', views.LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='token_blacklist'),
    path('organization/create/', views.CreateOrganization.as_view(), name='create_organization'),
    path('organization/faq/', views.UpdateFAQ.as_view(), name='update_faq'),
    path('organization/get-faq/', views.GetFAQ.as_view(), name='get_faq'),
    path('causes/get/', views.GetCauses.as_view(), name='get_causes'),
    path('admin/get-orgs/', views.GetAdminOrganizations.as_view(), name='get_admin_organizations'),
    path('events/get/', views.GetEvents.as_view(), name='get_events'),
    path('event/create/', views.CreateEvent.as_view(), name='create_event'),
    path('attendees/user_events/', views.GetAttendees.as_view(), name='get_attendees'),
    path('attendees/create/', views.AddAttendees.as_view(), name="add_attendees"),
    path('attendees/delete/', views.DeleteAttendees.as_view(), name="delete_attendees"),
    path('user/get-orgs/', views.GetOrgsFromMember.as_view(), name='get_orgs_from_member'),
]