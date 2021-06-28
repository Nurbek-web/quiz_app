from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path("", views.QuizList.as_view()),
    path("<int:pk>/", views.QuizDetail.as_view()),
    path("<int:pk>/form/", views.QuizForm.as_view()),
    path("create/", views.CreateQuiz),
    path("<int:pk>/edit/", views.CreateQuestionForQuiz),
    path("<int:pk>/questions/", views.GetQuestionsAndAnswersOfQuiz),
    path("<int:pk>/answer/", views.CreateAnswerForQuestion),
    path("<int:pk>/isready/", views.IsReadyQuiz),
    path("<int:quiz_id>/question/<int:question_id>/delete/", views.DeleteQuestionOfQuiz),
    path("<int:quiz_id>/answer/<int:answer_id>/delete/", views.DeleteAnswerOfQuiz),
    path("<int:pk>/update/", views.UpdateQuizDetails),
]

urlpatterns = format_suffix_patterns(urlpatterns)