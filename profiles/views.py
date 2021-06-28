from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from django.http import Http404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from quizes.models import Quiz
from quizes.serializers import QuizSerializer
from results.models import Result
from results.serializers import ResultSerializer

User = get_user_model()

from .serializers import UserSerializer

class UserListView(APIView):
    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(data=serializer.data)

@api_view(["GET"])
def UserDetailView(request, pk):
    # getting user
    try:
        user = User.objects.get(pk=pk)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user, many=False)
    # getting user quizes
    quizes = Quiz.objects.filter(author=user)
    quizes_serializer = QuizSerializer(quizes, many=True)
    # getting user results history
    results = Result.objects.filter(user=user).order_by("-date")
    results_serializer = ResultSerializer(results, many=True)
    # getting results statistic
    general_percents = 0
    quizes_list = []

    for result in results:
        general_percents += result.score
        quiz = Quiz.objects.get(pk=result.quiz.id)
        quiz_serilizer = QuizSerializer(quiz, many=False)
        quizes_list.append(quiz_serilizer.data)

    if (len(results) == 0):
        return Response(data={
            "user": serializer.data,
            "quizes": quizes_serializer.data,
            "results": "No result",
            "quizes_list": "No result",
            "medium_result": "No result",
        })
    elif (general_percents == 0):
        return Response(data={
            "user": serializer.data,
            "quizes": quizes_serializer.data,
            "results": results_serializer.data,
            "quizes_list": quizes_list,
            "medium_result": 0,
        })
    else:
        medium_result = general_percents / len(results)

    return Response(data={
            "user": serializer.data,
            "quizes": quizes_serializer.data,
            "results": results_serializer.data,
            "quizes_list": quizes_list,
            "medium_result": medium_result,
        })

class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })