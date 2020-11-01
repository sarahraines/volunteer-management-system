from django.db import models

class Cause(models.Model):
    name = models.CharField(max_length=128)
class Organization(models.Model):
    name = models.CharField(max_length=128)
    causes = models.ManyToManyField('Cause')
    description = models.TextField()

class FAQ(models.Model):
    question = models.CharField(max_length=256)
    answer = models.CharField(max_length=256)
