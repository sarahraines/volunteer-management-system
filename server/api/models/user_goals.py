from django.db import models
from api.models import User

class UserGoals(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    hours = models.IntegerField(null=True)
    begindate = models.DateField()
    enddate = models.DateField()
