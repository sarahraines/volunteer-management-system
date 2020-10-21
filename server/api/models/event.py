from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
import django.contrib.auth.validators
from django.db import models
from django.db.models import Max
from django.utils.translation import ugettext_lazy as _

class Cause(models.Model):
    name = models.CharField(max_length=128)

class Event(models.Model):
    name = models.CharField(max_length=1000)
    virtual = models.BooleanField(default=True)
    location = models.CharField(max_length=1000)
    begindate = models.DateTimeField()
    enddate = models.DateTimeField()
    causes = models.ManyToManyField('Cause')
    description = models.TextField()
    REQUIRED_FIELDS = ['name', 'virtual']
