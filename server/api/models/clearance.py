from django.db import models
from api.models import Organization, User

class OrgFile(models.Model):
    organization = models.ForeignKey(Organization, null=True, blank=True, on_delete=models.CASCADE)
    empty_form = models.FileField(upload_to='empty_form')

class UserFile(models.Model):
    org_file = models.ForeignKey(OrgFile, null=True, blank=True, on_delete=models.CASCADE)
    user = models.ForeignKey(User, null=False, blank=True, on_delete=models.CASCADE)
    filled_form = models.FileField(upload_to='filled_form')
    status = models.CharField(max_length=20)

