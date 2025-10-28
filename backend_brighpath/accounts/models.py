# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_ADMIN = 'ADMIN'
    ROLE_MANAGER = 'MANAGER'
    ROLE_INSTRUCTOR = 'INSTRUCTOR'

    ROLE_CHOICES = [
        (ROLE_ADMIN, 'Admin'),
        (ROLE_MANAGER, 'Manager'),
        (ROLE_INSTRUCTOR, 'Instructor'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_INSTRUCTOR)

    def is_admin(self):
        return self.role == self.ROLE_ADMIN

    def is_manager(self):
        return self.role == self.ROLE_MANAGER

    def is_instructor(self):
        return self.role == self.ROLE_INSTRUCTOR
