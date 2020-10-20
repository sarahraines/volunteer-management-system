from django.contrib import admin
from .models import User, Event

class UserAdmin(admin.ModelAdmin):
    model = User

class EventAdmin(admin.ModelAdmin):
    model = Event

admin.site.register(User, UserAdmin)
admin.site.register(Event, EventAdmin)