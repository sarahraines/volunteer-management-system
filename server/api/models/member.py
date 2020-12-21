from django.db import models
from django.conf import settings
from api.models import Organization
User = settings.AUTH_USER_MODEL

MEMBER_TYPES = (
    (0, 'Member'),
    (1, 'Admin')
)

STATUS_TYPES = (
    (0, 'Active'),
    (1, 'Pending'),
    (2, 'Needs Review'),
    (3, 'Invitation Failed'),
    (4, 'Invitation Expired')

)

class Member(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, null=True, blank=True, on_delete=models.CASCADE)
    member_type = models.IntegerField(choices=MEMBER_TYPES)
    status = models.IntegerField(choices=STATUS_TYPES)