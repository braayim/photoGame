from rest_framework import serializers
from . import models


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        fields = ('username', 'email', 'date_created', 'date_updated',)
        model = models.User