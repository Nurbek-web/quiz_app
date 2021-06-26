from django.urls import path, include
from .views import (
    FacebookLogin,
    TwitterLogin,
    FacebookConnect,
    TwitterConnect,
    GithubConnect,
    GithubLogin
)

urlpatterns = [
    path('', include('rest_auth.urls')),
    path('registration/',
        include('rest_auth.registration.urls')),

    # Social Authentication routes
    path("rest-auth/facebook/", FacebookLogin.as_view(), name='fb_login'),
    path("rest-auth/twitter/", TwitterLogin.as_view(), name='twitter_login'),
    path('rest-auth/github/', GithubLogin.as_view(), name='github_login'),

    path('rest-auth/facebook/connect/', FacebookConnect.as_view(), name='fb_connect'),
    path('rest-auth/twitter/connect/', TwitterConnect.as_view(), name='twitter_connect'),
    path('rest-auth/github/connect/', GithubConnect.as_view(), name='github_connect'),
]