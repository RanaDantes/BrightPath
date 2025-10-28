# accounts/urls.py
from django.urls import path
from .views import (
    AdminDataView,
    ProtectedUserCreateView,
    RegisterView,
    VerifyEmailView,
    ProfileView,
    CustomTokenObtainPairView,
    LogoutView,
    ForgotPasswordView,
    ResetPasswordView,
)

urlpatterns = [
    path('admin/data/', AdminDataView, name='admin-data'),
    path('user/create/', ProtectedUserCreateView.as_view(), name='protected-user-create'),
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
]
