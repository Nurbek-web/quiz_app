from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("quiz/", include("quizes.urls")),
    path("results/", include("results.urls")),
    path("profiles/", include("profiles.urls")), # User profiles
    path("auth/", include("auth.urls")), # Auth system
]