from rest_framework.views import APIView
from django.http import Http404
from rest_framework.response import Response
from rest_framework import status

from .serializers import AnswerSerializer, QuizSerializer, QuestionSerializer
from quizes.models import Quiz
from questions.models import Answer

# GET, POST
class QuizList(APIView):
    def get(self, request, format=None):
        quizes = Quiz.objects.all()
        serializer = QuizSerializer(quizes, many=True)
        return Response(data=serializer.data)
    
    def post(self, request, format=None):
        serializer = QuizSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# GET, PUT, DELETE
class QuizDetail(APIView):
    """
    Retrieve, update or delete a snippet instance.
    """
    def get_object(self, pk):
        try:
            return Quiz.objects.get(pk=pk)
        except Quiz.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        quiz = self.get_object(pk)
        serializer = QuizSerializer(quiz)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        quiz = self.get_object(pk)
        serializer = QuizSerializer(quiz, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        quiz = self.get_object(pk)
        quiz.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class QuizForm(APIView):
    def get_object(self, pk):
        try:
            return Quiz.objects.get(pk=pk)
        except Quiz.DoesNotExist:
            raise Http404
    
    def get(self, request, pk, format=None):
        quiz = self.get_object(pk)
        questions = quiz.get_questions()
        if len(questions) > 1:
            question_serializer = QuestionSerializer(questions, many=True)
        else:
            question_serializer = QuestionSerializer(questions)
        answers = []
        for q in questions:
            answer = AnswerSerializer(data = q.get_answers(), many = True)
            if answer.is_valid():
                pass
            answers.append(answer.data)  
        quiz_serializer = QuizSerializer(quiz)
        return Response(data={
            "questions": question_serializer.data,
            "answers": answers,
            "quiz": quiz_serializer.data
        })