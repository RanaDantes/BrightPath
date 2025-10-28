# project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),  # our accounts app endpoints
    path('api/timeline_feed/', include('timeline_feed.urls')),
]
