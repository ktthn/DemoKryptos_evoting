from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("elections/", include("elections.urls")),
    path("users/", include("user_management.urls")),
]
