from django.db import models
from api.models import User, Cause, Organization
from django.conf import settings
from django_mysql.models import EnumField

class Event(models.Model):
    name = models.CharField(max_length=1000)
    virtual = models.BooleanField(default=True)
    location = models.CharField(max_length=1000)
    begindate = models.DateTimeField()
    enddate = models.DateTimeField()
    causes = models.ManyToManyField('Cause')
    description = models.TextField()
    organization = models.ForeignKey('Organization', on_delete=models.CASCADE)
    instructions = models.TextField(null=True)
    attendee_cap = models.IntegerField(null=True)
    image = models.ImageField(upload_to='events/', null=True)
    REQUIRED_FIELDS = ['name', 'virtual']

class Change(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    object_id = models.IntegerField()
    model = models.CharField(max_length=1000)
    column = models.CharField(max_length=1000)
    old_value = models.CharField(max_length=1000)
    new_value = models.CharField(max_length=1000)

class OrgFile(models.Model):
    organization = models.ForeignKey(Organization, null=True, blank=True, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, null=True, blank=True, on_delete=models.CASCADE)
    empty_form = models.FileField()

class UserFile(models.Model):
    org_file = models.ForeignKey(OrgFile, null=True, blank=True, on_delete=models.CASCADE)
    user = models.ForeignKey(User, null=False, blank=True, on_delete=models.CASCADE)
    filled_form = models.FileField()
    status = models.CharField(max_length=20)
    comment = models.CharField(max_length=200)

class Attendee(models.Model):
    username = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    events = models.ManyToManyField('Event')

class EventFeedback(models.Model):
    username = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, null=True, blank=True, on_delete=models.CASCADE)

    POOR = 1
    FAIR = 2
    AVERAGE = 3
    GOOD = 4
    EXCELLENT = 5

    OVERALL_CHOICES = (
      (POOR, "Poor"),
      (FAIR, "Fair"),
      (AVERAGE, "Average"),
      (GOOD, "Good"),
      (EXCELLENT, "Excellent")
    )

    overall = models.IntegerField(choices=OVERALL_CHOICES, default=POOR)

    VERY_DISSATISFIED = 1
    DISSATISFIED = 2
    NEUTRAL = 3
    SATISFIED = 4
    VERY_SATISFIED = 5

    SATISFACTION_CHOICES = (
      (VERY_DISSATISFIED, "Very Dissatisfied"),
      (DISSATISFIED, "Dissatisfied"),
      (NEUTRAL, "Neutral"),
      (SATISFIED, "Satisfied"),
      (VERY_SATISFIED, "Very Satisfied")
    )

    satisfaction = models.IntegerField(choices=SATISFACTION_CHOICES, default=VERY_DISSATISFIED)

    VERY_UNLIKELY = 1
    SOMEWHAT_UNLIKELY = 2
    NEUTRAL = 3
    SOMEWHAT_LIKELY = 4
    VERY_LIKELY = 5

    LIKELY_CHOICES = (
      (VERY_UNLIKELY, "Very Unlikely"),
      (SOMEWHAT_UNLIKELY, "Somewhat Unlikely"),
      (NEUTRAL, "Neutral"),
      (SOMEWHAT_LIKELY, "Somewhat Likely"),
      (VERY_LIKELY, "Very Likely")
    )

    likely = models.IntegerField(choices = LIKELY_CHOICES, default=VERY_UNLIKELY)

    expectations = models.CharField(max_length=3)
    future = models.CharField(max_length=3)

    better = models.CharField(max_length=3000)
    experience = models.CharField(max_length=3000)
    
    REQUIRED_FIELDS = ['username', 'event', 'overall', 'satisfaction', 'likely', 'expectations', 'future']