from django.urls import path

from .views import UserDetailView, UserListView, CustomAuthToken

urlpatterns = [
    path("", UserListView.as_view()),
    path("<int:pk>/", UserDetailView),
    path('api-token-auth/', CustomAuthToken.as_view())
]