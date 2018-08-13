from rest_framework import serializers
from . import models


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        fields = ('id', 'username', 'email',)
        model = models.User


class PictureSerializer(serializers.ModelSerializer):

    class Meta:
        fields = ('id', 'owner', 'date_created', 'title', 'location',
                  'description', 'location', 'up_votes_account', 'down_votes_account')
        model = models.Picture


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('picture_details', 'base64Image')
        model = models.Images


class VotesSerializer(serializers.ModelSerializer):

    class Meta:
        fields = '__all__'
        model = models.VotingHistory
