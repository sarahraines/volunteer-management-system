from django.contrib import admin
from .models import User, Organization, Cause, Event, Attendee, Member

class UserAdmin(admin.ModelAdmin):
    model = User

class OrganizationAdmin(admin.ModelAdmin):
    model = Organization

class CauseAdmin(admin.ModelAdmin):
    model = Cause

class EventAdmin(admin.ModelAdmin):
	model = Event

class AttendeeAdmin(admin.ModelAdmin):
	model = Attendee

class MemberAdmin(admin.ModelAdmin):
	model = Member

admin.site.register(User, UserAdmin)
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(Cause, CauseAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(Attendee, AttendeeAdmin)
admin.site.register(Member, MemberAdmin)