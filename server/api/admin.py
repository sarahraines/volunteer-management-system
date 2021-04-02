from django.contrib import admin
from .models import User, Organization, Cause, FAQ, Event, Attendee, Member, EventFeedback, Invitee, OrgFile, UserFile, UserSettings, UserGoals
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken

class UserAdmin(admin.ModelAdmin):
    model = User

    def BE_AWARE_NO_WARNING_clear_tokens_and_delete(self, request, queryset):
        users = queryset.values("id")
        OutstandingToken.objects.filter(user__id__in=users).delete()
        queryset.delete()

    actions = ["BE_AWARE_NO_WARNING_clear_tokens_and_delete"]

class OrganizationAdmin(admin.ModelAdmin):
    model = Organization

class CauseAdmin(admin.ModelAdmin):
    model = Cause
class FAQAdmin(admin.ModelAdmin):
    model = FAQ

class EventAdmin(admin.ModelAdmin):
	model = Event

class AttendeeAdmin(admin.ModelAdmin):
	model = Attendee

class MemberAdmin(admin.ModelAdmin):
	model = Member

class EventFeedbackAdmin(admin.ModelAdmin):
	model = EventFeedback
	
class OrgFileAdmin(admin.ModelAdmin):
	model = OrgFile

class UserFileAdmin(admin.ModelAdmin):
	model = UserFile

class InviteeAdmin(admin.ModelAdmin):
	model = EventFeedback

class UserSettingsAdmin(admin.ModelAdmin):
	model = UserSettings

class UserGoalsAdmin(admin.ModelAdmin):
	model = UserGoals

admin.site.register(User, UserAdmin)
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(Cause, CauseAdmin)
admin.site.register(FAQ, FAQAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(Attendee, AttendeeAdmin)
admin.site.register(Member, MemberAdmin)
admin.site.register(EventFeedback, EventFeedbackAdmin)
admin.site.register(Invitee, InviteeAdmin)
admin.site.register(OrgFile, OrgFileAdmin)
admin.site.register(UserFile, UserFileAdmin)
admin.site.register(UserSettings, UserSettingsAdmin)
admin.site.register(UserGoals, UserGoalsAdmin)