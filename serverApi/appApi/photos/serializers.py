from rest_framework import serializers
from . import models


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        fields = ('username', 'email',)
        model = models.User


class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('id', 'owner', 'caption', 'date_created', 'title', 'description', 'location')
        model = models.Picture


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('imageId', 'base64Image')
        model = models.Images


class VotesSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.VotingHistory
