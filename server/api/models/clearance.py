from django.db import models
from api.models import Organization, User
class OrgFile(models.Model):
    organization = models.ForeignKey(Organization, null=True, blank=True, on_delete=models.CASCADE)
    empty_form = models.FileField()
class UserFile(models.Model):
    org_file = models.ForeignKey(OrgFile, null=True, blank=True, on_delete=models.CASCADE)
    user = models.ForeignKey(User, null=False, blank=True, on_delete=models.CASCADE)
    filled_form = models.FileField()
