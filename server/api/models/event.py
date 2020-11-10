from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL

class Event(models.Model):
    name = models.CharField(max_length=1000)
    virtual = models.BooleanField(default=True)
    location = models.CharField(max_length=1000)
    begindate = models.DateTimeField()
    enddate = models.DateTimeField()
    causes = models.CharField(max_length=1000)
    description = models.TextField()
    REQUIRED_FIELDS = ['name', 'virtual']

class Attendee(models.Model):
    username = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    events = models.ManyToManyField('Event')