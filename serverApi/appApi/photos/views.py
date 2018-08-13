from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services import ApiServices


@csrf_exempt
@api_view(['POST'])
def game_request(request, format=None):
    # if not request.POST._mutable:
    #     request.POST._mutable = True
    action = request.data.get('action')
    data = request.data.copy()

    if not action:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if action == 'LOGIN':
        return ApiServices.login(data=data)
    elif action == 'REGISTER_USER':
        return ApiServices.register_user(data)
    elif action == 'SAVE_PICTURE':
        return ApiServices.save_picture(data=data)
    elif action == 'VOTE_PICTURE':
        return ApiServices.vote_picture(data)
    elif action == 'GET_PICTURES':
        return ApiServices.get_pictures(data=data)
    elif action == 'FETCH_IMAGES':
        return ApiServices.fetch_images(data=data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)

