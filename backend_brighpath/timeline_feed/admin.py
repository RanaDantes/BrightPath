# timeline_feed/admin.py
from django.contrib import admin
from .models import TimelineItem

@admin.register(TimelineItem)
class TimelineItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'author', 'status', 'published_at', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('title', 'content', 'author__username')
