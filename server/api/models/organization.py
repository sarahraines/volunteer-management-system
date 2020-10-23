from django.db import models

class Cause(models.Model):
    name = models.CharField(max_length=128)

class Organization(models.Model):
    name = models.CharField(max_length=128)
    causes = models.ManyToManyField('Cause')
    description = models.TextField()
