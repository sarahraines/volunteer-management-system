from django.db import models
from django.conf import settings
from api.models import Organization
User = settings.AUTH_USER_MODEL

MEMBER_TYPES = (
    (0, 'Member'),
    (1, 'Admin')
)

MEMBER_STATUS = (
    (0, 'Active'),
    (1, 'Needs Review'),
)

INVITE_STATUS = (
    (10, 'Pending'),
    (11, 'Invitation Failed'),
    (12, 'Invitation Rejected'),
)

class Member(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, null=True, blank=True, on_delete=models.CASCADE)
    member_type = models.IntegerField(choices=MEMBER_TYPES)
    status = models.IntegerField(choices=MEMBER_STATUS, default=0)


class Invitee(models.Model):
    email = models.EmailField()
    organization = models.ForeignKey(Organization, null=True, blank=True, on_delete=models.CASCADE)
    member_type = models.IntegerField(choices=MEMBER_TYPES)
    status = models.IntegerField(choices=INVITE_STATUS, default=10)