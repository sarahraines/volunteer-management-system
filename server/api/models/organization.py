from django.db import models
from api.models import User


class Cause(models.Model):
    name = models.CharField(max_length=128)


class Organization(models.Model):
    name = models.CharField(max_length=128)
    causes = models.ManyToManyField('Cause')
    description = models.TextField()
    members = models.ManyToManyField(User, through='Member')
    email = models.EmailField(max_length=256)
    website = models.CharField(max_length=256)
    phone = models.CharField(max_length=32)
    address = models.TextField()


class FAQ(models.Model):
    question = models.TextField()
    answer = models.TextField()
    is_public = models.BooleanField(default=False)
    org_id = models.ForeignKey(Organization, null=True, blank=True, on_delete=models.CASCADE)
