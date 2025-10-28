# timeline_feed/views.py
from rest_framework import viewsets
from django.db import models
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from .models import TimelineItem
from .serializers import TimelineItemSerializer


def role_check(user, attr_name):
    """
    Safe helper to evaluate role helpers that might be boolean attrs or methods.
    Returns True/False.
    """
    val = getattr(user, attr_name, None)
    if callable(val):
        try:
            return bool(val())
        except Exception:
            return False
    return bool(val)


class TimelineItemViewSet(viewsets.ModelViewSet):
    queryset = TimelineItem.objects.all()
    serializer_class = TimelineItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = TimelineItem.objects.all()

        # Unauthenticated users: only published
        if not user.is_authenticated:
            return qs.filter(status=TimelineItem.STATUS_PUBLISHED)

        # Admins & managers: see everything
        if user.is_superuser or role_check(user, "is_admin") or role_check(user, "is_manager"):
            return qs

        # Instructors (previously writers): published + their own items
        if role_check(user, "is_instructor") or role_check(user, "is_writer"):
            return qs.filter(models.Q(status=TimelineItem.STATUS_PUBLISHED) | models.Q(author=user))

        # Default: published only
        return qs.filter(status=TimelineItem.STATUS_PUBLISHED)

    def perform_create(self, serializer):
        user = self.request.user
        if not user or not user.is_authenticated:
            raise PermissionDenied("Authentication required to create timeline items.")

        # Role booleans
        is_admin = user.is_superuser or role_check(user, "is_admin")
        is_manager = role_check(user, "is_manager")
        is_instructor = role_check(user, "is_instructor") or role_check(user, "is_writer")

        if not (is_admin or is_manager or is_instructor):
            raise PermissionDenied("Only instructors, managers or admins can create timeline items.")

        # Save with author
        item = serializer.save(author=user)

        # If client requested PUBLISHED, only allow for admin/manager.
        requested_status = self.request.data.get("status")
        if requested_status == TimelineItem.STATUS_PUBLISHED:
            if is_admin or is_manager:
                # publish properly
                item.status = TimelineItem.STATUS_PUBLISHED
                item.published_at = timezone.now()
                item.save(update_fields=["status", "published_at"])
            else:
                # non-admins cannot publish directly — ensure DRAFT
                if item.status != TimelineItem.STATUS_DRAFT:
                    item.status = TimelineItem.STATUS_DRAFT
                    item.save(update_fields=["status"])

    def update(self, request, *args, **kwargs):
        # Allow publishing only to admins/managers via update
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        user = request.user
        requested_status = request.data.get("status", instance.status)

        is_admin_or_manager = user.is_superuser or role_check(user, "is_admin") or role_check(user, "is_manager")

        if requested_status == TimelineItem.STATUS_PUBLISHED and not is_admin_or_manager:
            raise PermissionDenied("Only admin or manager can publish a post.")

        if requested_status == TimelineItem.STATUS_PUBLISHED and instance.status != TimelineItem.STATUS_PUBLISHED:
            instance.published_at = timezone.now()
            instance.status = TimelineItem.STATUS_PUBLISHED
            instance.save(update_fields=["status", "published_at"])
            # proceed to let serializer return updated object to client
            # we still call super() to apply other updates if present
        return super().update(request, partial=partial, *args, **kwargs)
