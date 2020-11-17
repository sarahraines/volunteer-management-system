from django.db import models
from django.conf import settings
from api.models import Organization
User = settings.AUTH_USER_MODEL

MEMBER_TYPES = (
        (0, 'Member'),
        (1, 'Admin')
    )

class Member(models.Model):
    username = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    organizations = models.ForeignKey(Organization, null=True, blank=True, on_delete=models.CASCADE)
    member_type = models.IntegerField(choices=MEMBER_TYPES)