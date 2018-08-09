from django.db import models

# Create your models here.


class User(models.Model):
    username = models.CharField(max_length=30)
    password = models.CharField(max_length=255)
    email = models.CharField(max_length=30)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username