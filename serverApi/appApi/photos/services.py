from rest_framework import status
from rest_framework.response import Response
from . import models
from . import serializers


class ApiServices:

    """
    Login method: Checks if user with the given username exist, it will respond with that user's
    details if true else it will respond with a 404 error
    """
    @staticmethod
    def login(data):
            try:
                user = models.User.objects.get(username=data.get('username'))
            except models.User.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            serializer = serializers.UserSerializer(user)
            return Response(serializer.data)

    """
    Register User: validates request post data and saves it if true
    It returns a saved record with an id
    """
    @staticmethod
    def register_user(data):
        serializer = serializers.UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    """
    Saves both picture details and the image. It returns the saved picture details if every
    model is valid
    """
    @staticmethod
    def save_picture(data):
        picture_serializer = serializers.PictureSerializer(data=data)
        if picture_serializer.is_valid():
            picture_serializer.save()
            image = {}
            image['picture_details'] = picture_serializer.data.get('id');
            image['base64Image'] = data.get('base64Image')
            image_serializer = serializers.ImageSerializer(data=image)
            if image_serializer.is_valid():
                image_serializer.save()
            return Response(picture_serializer.data, status=status.HTTP_201_CREATED)
        return Response(picture_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    """
    It returns all the picture details records
    """
    @staticmethod
    def get_pictures(data):
        pictures = models.Picture.objects.all()
        return Response(serializers.PictureSerializer(pictures, many=True).data)

    """
    Fetches images for the picture details. If an id is specified, one image will be 
    returned else all images will be returned
    """
    @staticmethod
    def fetch_images(data):
        image_id = data.get('id')

        if not image_id:
            images = models.Images.objects.all()
            return Response(serializers.ImageSerializer(images, many=True).data)
        else:
            try:
                image = models.Images.objects.get(picture_details=image_id)
            except models.Images.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            serializer = serializers.ImageSerializer(image)
            return Response(serializer.data)

    """
    Voting logic: 
    1. User can not vote for own picture
    2. User can only have one vote per photo
    3. User can change vote on a photo from up to down ore the other way round
    """
    @staticmethod
    def vote_picture(data):
        picture_id = int(data.get('picture_id'))
        user_id = int(data.get('user_id'))
        in_vote_type = int(data.get('vote_type'))

        # Getting picture details obj to provide us with the voting ledger standing
        picture_obj = models.Picture.objects.get(id=picture_id)
        serialized_pic = serializers.PictureSerializer(picture_obj).data

        # If the the picture is own by the voting user return error. Owner can't vote for selt
        picture_owner = serialized_pic.get('owner', 0)
        if picture_owner == user_id:
            return Response(status.HTTP_404_NOT_FOUND)

        # Voting ledger up_votes and down_votes account as per now
        up_votes_count = serialized_pic.get('up_votes_account', 0)
        down_votes_count = serialized_pic.get('down_votes_account', 0)
        new_up_votes_count = up_votes_count
        new_down_votes_count = down_votes_count

        # If User already voted for this picture and rectifying the vote
        try:
            vote = models.VotingHistory.objects.get(picture_id=picture_id, user_id=user_id)
            serialized_vote = serializers.VotesSerializer(vote).data
            vote_type = serialized_vote.get('vote_type')
            if vote_type == in_vote_type:
                return Response(status.HTTP_404_NOT_FOUND)
            if in_vote_type == 0:
                new_up_votes_count = up_votes_count-1
                new_down_votes_count = down_votes_count+1
            elif in_vote_type == 1:
                new_up_votes_count = up_votes_count+1
                new_down_votes_count = down_votes_count-1
            # Before
            setattr(vote, 'up_votes_balance_before', up_votes_count)
            setattr(vote, 'down_votes_balance_before', down_votes_count)
            # After
            setattr(vote, 'up_votes_balance_after', new_up_votes_count)
            setattr(vote, 'down_votes_balance_after', new_down_votes_count)
            setattr(vote, 'vote_type', in_vote_type)
            vote.save()
        # If user if voting this picture for the first time
        except models.VotingHistory.DoesNotExist:
            if in_vote_type ==0:
                new_down_votes_count = down_votes_count+1
            elif in_vote_type == 1:
                new_up_votes_count = up_votes_count+1
            # Before
            data['up_votes_balance_before'] = up_votes_count
            data['down_votes_balance_before'] = down_votes_count
            # After
            data['up_votes_balance_after'] = new_up_votes_count
            data['down_votes_balance_after'] = new_down_votes_count

            vote_serializer = serializers.VotesSerializer(data=data)
            if vote_serializer.is_valid():
                vote_serializer.save()

        # Update the picture details that serve as our voting general ledger
        setattr(picture_obj, 'down_votes_account', new_down_votes_count)
        setattr(picture_obj, 'up_votes_account', new_up_votes_count)
        picture_obj.save()
        return Response(serializers.PictureSerializer(picture_obj).data)
