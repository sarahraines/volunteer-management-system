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
    instructions = models.TextField()
    attendee_cap = models.IntegerField()
    REQUIRED_FIELDS = ['name', 'virtual']

class Attendee(models.Model):
    username = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    events = models.ManyToManyField('Event')

class EventFeedback(models.Model):
    username = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, null=True, blank=True, on_delete=models.CASCADE)
    overall = models.CharField(max_length=50)
    satisfaction = models.CharField(max_length=50)
    likely = models.CharField(max_length=50)
    expectations = models.CharField(max_length=50)
    future = models.CharField(max_length=50)
    better = models.CharField(max_length=3000)
    experience = models.CharField(max_length=3000)
    REQUIRED_FIELDS = ['username', 'event', 'overall', 'satisfaction', 'likely', 'expectations', 'future', 'better', 'expectations']