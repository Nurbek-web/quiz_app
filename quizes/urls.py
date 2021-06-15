from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path("", views.QuizList.as_view()),
    path("<int:pk>/", views.QuizDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)