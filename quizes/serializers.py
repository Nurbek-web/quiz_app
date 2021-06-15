from django.db.models import fields
from rest_framework.serializers import ModelSerializer

from .models import Quiz

class QuizSerializer(ModelSerializer):

    class Meta:
        model = Quiz
        fields = '__all__'