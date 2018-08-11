from django.db import transaction
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from . import models
from . import serializers


@csrf_exempt
@api_view(['POST'])
def game_request(request, format=None):
    action = request.data.get('action')
    data = request.data

    if not action:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if action == 'LOGIN':
        return login(data=data)
    elif action == 'REGISTER_USER':
        return register_user(data)
    elif action == 'GET_PICTURES':
        return get_pictures(data=data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


def login(data):
    try:
        user = models.User.objects.get(username=data.get('username'))
    except models.User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = serializers.UserSerializer(user)
    return Response(serializer.data)


def register_user(data):
    serializer = serializers.UserSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def save_picture(data):
    pictureSerializer = serializers.PictureSerializer(data=data)
    imageSerializer = serializers.ImageSerializer(data=data)
    if pictureSerializer.is_valid() and imageSerializer.is_valid():
        with transaction.atomic():
            pictureSerializer.save()
            imageSerializer.save()
            return Response(pictureSerializer.data, status=status.HTTP_201_CREATED)
    return Response(pictureSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

def get_pictures(data):
    return Response(data)
