from django.contrib import admin
from .models import User, Organization, Cause, FAQ

class UserAdmin(admin.ModelAdmin):
    model = User

class OrganizationAdmin(admin.ModelAdmin):
    model = Organization

class CauseAdmin(admin.ModelAdmin):
    model = Cause
class FAQAdmin(admin.ModelAdmin):
    model = FAQ

admin.site.register(User, UserAdmin)
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(Cause, CauseAdmin)
admin.site.register(FAQ, FAQAdmin)