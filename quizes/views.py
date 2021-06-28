from rest_framework import permissions
from rest_framework.views import APIView
from django.http import Http404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .serializers import AnswerSerializer, QuizSerializer, QuestionSerializer, UserSerializer
from quizes.models import Quiz
from questions.models import Answer, Question

# GET, POST
class QuizList(APIView):
    def get(self, request, format=None):
        quizes = Quiz.objects.all().order_by("-date")
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
        question_serializer = QuestionSerializer(questions, many=True)
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

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def CreateQuiz(request):
    # Getting user
    user = request.user

    # Creating quiz
    data = request.data # Getting request data of sended POST request
    Quiz.objects.create(
        author = user,
        name = data["name"],
        topic = data["topic"],  
        time = data["time"],
        required_score_to_pass = data["required_score_to_pass"],
        difficulty = data["difficulty"]
    )
    return Response(status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def CreateQuestionForQuiz(request, pk):
    # getting requesting user
    user = request.user
    # getting quiz
    quiz = Quiz.objects.get(pk=pk)
    # getting request

    # checking author
    if (quiz.author != user):
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    # getting request data
    data = request.data

    # creating question
    Question.objects.create(
        text = data["text"],
        quiz = quiz
    )

    return Response(status=status.HTTP_201_CREATED)

@api_view(["POST", "GET"])
@permission_classes([IsAuthenticated])
def GetQuestionsAndAnswersOfQuiz(request, pk):
    # getting requesting user
    user = request.user
    # getting quiz
    quiz = Quiz.objects.get(pk=pk)

    # checking author
    if (quiz.author != user):
        return Response(status=status.HTTP_403_FORBIDDEN)

    # getting questions
    questions = quiz.get_questions()
    question_serializer = QuestionSerializer(questions, many=True)

    # getting answers of questions
    answers = []
    for q in questions:
        answer = AnswerSerializer(data = q.get_answers(), many = True)
        if answer.is_valid():
            pass
        answers.append(answer.data)  

    return Response(data={
        "answers": answers,
        "questions": question_serializer.data
        })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def CreateAnswerForQuestion(request, pk):
    # getting requesting user
    user = request.user
    # getting quiz
    quiz = Quiz.objects.get(pk=pk)
    # getting request

    # checking author
    if (quiz.author != user):
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    # getting request data
    data = request.data

    # getting question
    question = Question.objects.get(pk=data["question"])

    # creating answer
    Answer.objects.create(
        question = question,
        text = data["text"],
        correct = data["correct"],
    )

    return Response(status=status.HTTP_201_CREATED)

@api_view(["GET"])
def IsReadyQuiz(request, pk):
    # getting quiz
    quiz = Quiz.objects.get(pk=pk)

    # getting questions
    questions = quiz.get_questions()

    # getting answers of questions    
    if (len(questions) < 1):
        return Response(data=False)

    for q in questions:
        answers = q.get_answers()
        if (len(answers) < 1):
            return Response(data=False)
        # answer = AnswerSerializer(data = q.get_answers(), many = True) 
    return Response(data=True)

@api_view(["DELETE"])
def DeleteQuestionOfQuiz(request, question_id, quiz_id):
    # getting quiz
    quiz = Quiz.objects.get(pk=quiz_id)
     # checking author
    if (quiz.author != request.user):
        return Response(status=status.HTTP_403_FORBIDDEN)
    # getting question
    question = Question.objects.get(id=question_id)
    # deleting question
    question.delete()
    return Response(data=True, status=status.HTTP_200_OK)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def DeleteAnswerOfQuiz(request, answer_id, quiz_id):
    # getting quiz
    quiz = Quiz.objects.get(id=quiz_id)
    # getting requesting user
    user = request.user
     # checking author
    if (quiz.author != user):
        return Response(status=status.HTTP_403_FORBIDDEN)
    answer = Answer.objects.get(id=answer_id)
    # deleting answer
    answer.delete()
    return Response(data=True, status=status.HTTP_200_OK)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def UpdateQuizDetails(request, pk):
    # getting quiz
    quiz = Quiz.objects.get(pk=pk)
    # getting user'
    user = request.user
    if (quiz.author != user):
        return Response(status=status.HTTP_403_FORBIDDEN)
    data = request.data
    
    # updating details of quiz
    quiz.author = request.user
    quiz.name = data["name"]
    quiz.topic = data["topic"]
    quiz.time = data["time"]
    quiz.required_score_to_pass = data["required_score_to_pass"]
    quiz.difficulty = data["difficulty"]

    quiz.save()

    return Response("Quiz was successfully updated!", status=status.HTTP_202_ACCEPTED)