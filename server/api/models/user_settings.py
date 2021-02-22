from django.db import models
from api.models import User

class UserSettings(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    email = models.BooleanField(default=True)
    text = models.BooleanField(default=False)
    phone_number = models.CharField(null=True, blank=True, max_length=10)