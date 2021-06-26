from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated

from quizes.models import Quiz
from .serializers import ResultSerializer
from .models import Result
User = get_user_model()

@api_view(["GET"])
def GetResults(request, pk):
    results = Result.objects.filter(user=pk)
    results_serializer = ResultSerializer(results, many=True)
    return Response(results_serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def PostResult(request):
    # getting request data
    result = request.data
    Result.objects.create(
        user=User.objects.get(id=result["user"]),
        quiz = Quiz.objects.get(id=result["quiz"]),
        score = result["score"]
    )
    return Response(status=status.HTTP_201_CREATED)
