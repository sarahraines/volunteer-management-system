from django.db import models
from api.models import User, Cause, Organization
from django.conf import settings


class Event(models.Model):
    name = models.CharField(max_length=1000)
    virtual = models.BooleanField(default=True)
    location = models.CharField(max_length=1000)
    begindate = models.DateTimeField()
    enddate = models.DateTimeField()
    causes = models.ManyToManyField('Cause')
    description = models.TextField()
    organizations = models.ManyToManyField('Organization')
    REQUIRED_FIELDS = ['name', 'virtual']

class Attendee(models.Model):
    username = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    events = models.ManyToManyField('Event')