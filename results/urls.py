from django.urls import path
from .views import GetResults, PostResult

urlpatterns = [
    path("<int:pk>/", GetResults),
    path("create/", PostResult),
]