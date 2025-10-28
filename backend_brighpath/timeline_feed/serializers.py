# timeline_feed/serializers.py
from rest_framework import serializers
from django.conf import settings
from .models import TimelineItem
from django.contrib.auth import get_user_model

User = get_user_model()

class TimelineItemSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TimelineItem
        fields = ('id', 'title', 'content', 'author', 'status', 'created_at', 'updated_at', 'published_at')
        read_only_fields = ('id', 'author', 'created_at', 'updated_at', 'published_at')

    def get_author(self, obj):
        return {"id": obj.author.id, "username": obj.author.username, "role": getattr(obj.author, "role", None)}

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['author'] = request.user
        return super().create(validated_data)
