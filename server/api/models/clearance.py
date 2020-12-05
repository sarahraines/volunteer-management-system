from django.db import models
from api.models import Organization


class OrgFile(models.Model):
    organizations = models.ForeignKey(Organization, null=True, blank=True, on_delete=models.CASCADE)
    empty_form = models.FileField()

class UserFile(models.Model):
    org_file = models.ForeignKey(OrgFile, null=True, blank=True, on_delete=models.CASCADE)
    filled_form = models.FileField()
