from django.contrib import admin
from .models import User, Event, Cause

class UserAdmin(admin.ModelAdmin):
    model = User

class EventAdmin(admin.ModelAdmin):
    model = Event

class CauseAdmin(admin.ModelAdmin):
    model = Cause

admin.site.register(User, UserAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(Cause, CauseAdmin)