from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("quiz/", include("quizes.urls")),
    path("profiles/", include("profiles.urls")),
    path('auth/', include('rest_auth.urls')),
    path('auth/registration/',
        include('rest_auth.registration.urls')),
]