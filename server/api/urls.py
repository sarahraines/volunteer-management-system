from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from . import views

urlpatterns = [
    path('token/obtain/', views.MyTokenObtainPairView.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('token/blacklist/', views.LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='token_blacklist'),
    path('organization/create/', views.CreateOrganization.as_view(), name='create_organization'),
    path('organization/get-faq/', views.GetFAQ.as_view(), name='get_faq'),
    path('organization/get-causes/', views.GetCausesByOrg.as_view(), name='get_org_causes'),
    path('organization/get-invites/', views.GetInvitesByOrg.as_view(), name='get_org_invites'),
    path('organization/get-members/', views.GetMembersFromOrg.as_view(), name='get_org_members'),
    path('causes/get/', views.GetCauses.as_view(), name='get_causes'),
    path('admin/get-orgs/', views.GetAdminOrganizations.as_view(), name='get_admin_organizations'),
    path('events/get/', views.GetEvents.as_view(), name='get_events'),
    path('events/get-by-org/', views.GetEventsByOrg.as_view(), name='get_events_by_org'),
    path('events/get-attendee-counts-by-event/', views.GetAttendeeCountsByEvent.as_view(), name='get-attendee-counts-by-event'),
    path('events/get-event-attendee-count/', views.GetEventAttendeeCount.as_view(), name='get-event-attendee-count'),
    path('events/get-register-status/', views.GetRegisterStatus.as_view(), name="get_register_status"),
    path('event/create/', views.CreateEvent.as_view(), name='create_event'),
    path('event/get-event-by-id/', views.GetEventById.as_view(), name='get-event-by-id'),
    path('event/get-attendees/', views.GetAttendees.as_view(), name='get_events'),
    path('eventFeedback/create/', views.CreateEventFeedback.as_view(), name='create_event'),
    path('eventFeedback/get-by-org/', views.GetEventFeedback.as_view(), name='get_by_org'),
    path('event/get-event-by-id/', views.GetEventById.as_view(), name='get-event-by-id'),
    path('events/count-for-org/', views.GetEventCountForOrg.as_view(), name='get_event_count_for_org'),
    path('attendees/create/', views.AddAttendee.as_view(), name="add_attendees"),
    path('attendees/delete/', views.DeleteAttendee.as_view(), name="delete_attendees"),
    path('attendees/get-volunteer-events/', views.GetVolunteerEvents.as_view(), name="get_volunteer_events"),
    path('invite/delete/', views.DeleteInvite.as_view(), name="delete_invite"),
    path('invite/validate/', views.validate_invite, name="validate_invite"),
    path('invite/accept/', views.AcceptInvite.as_view(), name="accept_invite"),
    path('invite/reject/', views.RejectInvite.as_view(), name="reject_invite"),
    path('events/get-avg-events-per-volunteer/', views.AverageEventsPerVolunteer.as_view(), name='get_avg_events_per_volunteer'),
    path('events/get-unique-attendees/', views.GetUniqueAttendees.as_view(), name='get_unique_attendees'),
    path('events/get-unique-volunteers-with-feedback/', views.GetUniqueVolunteersWithFeedback.as_view(), name='get_unique_volunteers_with_feedback'),
    path('member/create/', views.CreateMember.as_view(), name='create_member'),
    path('member/invite/', views.InviteMembers.as_view(), name='invite_members'),
    path('member/delete/', views.DeleteMember.as_view(), name='delete_member'),
    path('member/email/', views.EmailMembers.as_view(), name='email_members'),
    path('users/activate/', views.ActivateUser.as_view(), name='activate_user'),
    path('users/create/', views.CreateUser.as_view(), name='create_user'),
    path('users/create-from-invite/', views.CreateUserFromInvite.as_view(), name='create_user_from_invite'),
    path('users/reset-password/', views.ChangePassword.as_view(), name='reset_password'),
    path('users/forgot-password/', views.ForgotPassword.as_view(), name='forgot_password'),
    path('users/update/', views.UpdateUser.as_view(), name='update_user'),
    path('users/get/', views.GetUser.as_view(), name="get_user"),
    path('user/get-orgs/', views.GetOrgsFromMember.as_view(), name='get_orgs_from_member'),
    path('user/get-member/', views.GetMemberFromUser.as_view(), name='get_member_from_user'),
    path('user/submit-notification-settings/', views.SubmitNotificationSettings.as_view(), name='submit_notification_settings'),
    path('user/get-notification-settings/', views.GetNotificationSettings.as_view(), name='get_notification_settings'),
    path('faq/upsert/', views.UpsertFAQ.as_view(), name='upsert_faq'),
    path('faq/delete/', views.DeleteFAQ.as_view(), name='delete_faq'),
    path('clearances/upload-user-file', views.AddUserFile.as_view(), name='upload_user_file'),
    path('clearances/upload-org-file', views.AddOrgFile.as_view(), name='upload_org_file'),
    path('clearances/get-org-files/', views.GetOrgFiles.as_view(), name='get_org_files'),
    path('clearances/get-user-files/', views.GetUserFiles.as_view(), name='get_user_files'),
    path('clearances/get-user-files-for-org/', views.GetUserFilesForOrg.as_view(), name='get_user_files_for_org'),
    path('clearances/set-status-user-file/', views.SetStatusUserFile.as_view(), name='set_status_user_file'),
    path('analytics/volunteer-leaderboard/', views.VolunteerLeaderboard.as_view(), name='volunteer_leaderboard'),
    path('analytics/event-leaderboard/', views.EventLeaderboard.as_view(), name='event_leaderboard'),
    path('analytics/volunteer-breakdown/', views.VolunteerBreakdown.as_view(), name='volunteer_breakdown'),
    path('analytics/nonprofit-breakdown/', views.NonprofitBreakdown.as_view(), name='nonprofit_breakdown'),
    path('analytics/volunteer-event-leaderboard/', views.VolunteerEventLeaderboard.as_view(), name='volunteer_event_leaderboard'),
    path('analytics/volunteer-summary/', views.VolunteerSummary.as_view(), name='volunteer_summary'),
]