# timeline_feed/urls.py
from rest_framework.routers import DefaultRouter
from .views import TimelineItemViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'items', TimelineItemViewSet, basename='timelineitem')

urlpatterns = [
    path('', include(router.urls)),
]
