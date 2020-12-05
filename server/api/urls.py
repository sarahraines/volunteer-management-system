from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from . import views

urlpatterns = [
    path('token/obtain/', views.MyTokenObtainPairView.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('token/blacklist/', views.LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='token_blacklist'),
    path('organization/create/', views.CreateOrganization.as_view(), name='create_organization'),
    path('organization/get-faq/', views.GetFAQ.as_view(), name='get_faq'),
    path('organization/get-info/', views.GetOrgInfo.as_view(), name='get_org_info'),
    path('causes/get/', views.GetCauses.as_view(), name='get_causes'),
    path('admin/get-orgs/', views.GetAdminOrganizations.as_view(), name='get_admin_organizations'),
    path('events/get/', views.GetEvents.as_view(), name='get_events'),
    path('events/get-by-org/', views.GetEventsByOrg.as_view(), name='get_events_by_org'),
    path('event/create/', views.CreateEvent.as_view(), name='create_event'),
    path('attendees/user_events/', views.GetAttendees.as_view(), name='get_attendees'),
    path('attendees/create/', views.AddAttendees.as_view(), name="add_attendees"),
    path('attendees/delete/', views.DeleteAttendees.as_view(), name="delete_attendees"),
    path('member/create/', views.CreateMember.as_view(), name='create_member'),
    path('users/activate/', views.ActivateUser.as_view(), name='activate_user'),
    path('users/create/', views.CreateUser.as_view(), name='create_user'),
    path('users/reset-password/', views.ChangePassword.as_view(), name='reset_password'),
    path('users/forgot-password/', views.ForgotPassword.as_view(), name='forgot_password'),
    path('users/update/', views.UpdateUser.as_view(), name='update_user'),
    path('users/get/', views.GetUser.as_view(), name="get_user"),
    path('user/get-orgs/', views.GetOrgsFromMember.as_view(), name='get_orgs_from_member'),
    path('user/get-member/', views.GetMemberFromUser.as_view(), name='get_member_from_user'),
    path('faq/upsert/', views.UpsertFAQ.as_view(), name='upsert_faq'),
    path('faq/delete/', views.DeleteFAQ.as_view(), name='delete_faq'),
    path('clearances/upload-user-file', views.AddUserFile.as_view(), name='upload_user_file'),
    path('clearances/upload-org-file', views.AddOrgFile.as_view(), name='upload_org_file')
]