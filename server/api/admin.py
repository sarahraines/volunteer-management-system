from django.contrib import admin
from .models import User, Organization, Cause, FAQ, Event, Attendee, Member, EventFeedback, Invitee, OrgFile, UserFile


class UserAdmin(admin.ModelAdmin):
    model = User

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
