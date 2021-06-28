from django.db.models import fields
from rest_framework.serializers import ModelSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

from .models import Quiz
from questions.models import Question, Answer

class QuizSerializer(ModelSerializer):

    class Meta:
        model = Quiz
        fields = '__all__'

class QuestionSerializer(ModelSerializer):

    class Meta:
        model = Question
        fields = '__all__'

class AnswerSerializer(ModelSerializer):

    class Meta:
        model = Answer
        fields = '__all__'

class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = "__all__"