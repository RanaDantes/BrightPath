from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from rest_framework.decorators import api_view, permission_classes
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ProtectedUserCreateSerializer
)
from .tokens import account_activation_token

token_generator = PasswordResetTokenGenerator()
User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def AdminDataView(request):
    user = request.user
    if not (user.is_superuser or getattr(user, 'role', None) in ['ADMIN', 'MANAGER']):
        raise PermissionDenied("Only admins or managers can access this data.")

    total_users = User.objects.count()
    total_managers = User.objects.filter(role='MANAGER').count()
    total_instructors = User.objects.filter(role='INSTRUCTOR').count()

    return Response({
        "total_users": total_users,
        "total_managers": total_managers,
        "total_instructors": total_instructors,
    })


# ---------------- PUBLIC SIGNUP ----------------
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Send verification email
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = account_activation_token.make_token(user)
        activation_link = f"{settings.SITE_DOMAIN}/api/auth/verify-email/?uidb64={uidb64}&token={token}"

        subject = "Activate your account"
        message = f"Hi {user.username},\n\nClick the link to verify your email:\n\n{activation_link}\n\nIf you didn't request this, ignore."
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)

        return Response(
            {"detail": "User registered. Check email for verification link."},
            status=status.HTTP_201_CREATED
        )


# ---------------- EMAIL VERIFICATION ----------------
class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        uidb64 = request.query_params.get('uidb64')
        token = request.query_params.get('token')
        if not uidb64 or not token:
            return Response({"detail": "Missing uidb64 or token."}, status=400)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception:
            return Response({"detail": "Invalid link."}, status=400)

        if account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return redirect(f"http://localhost:3000/email-verified?success=true")

        return Response({"detail": "Invalid or expired token."}, status=400)


# ---------------- LOGIN ----------------
class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]


# ---------------- PROFILE ----------------
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# ---------------- LOGOUT ----------------
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({"detail": "Refresh token required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Logout successful."}, status=status.HTTP_200_OK)


# ---------------- PROTECTED USER CREATION ----------------
class ProtectedUserCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProtectedUserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        role = serializer.validated_data['role']

        # HIERARCHY CHECK
        user = request.user
        if user.is_superuser and role != User.ROLE_ADMIN:
            raise PermissionDenied("Superadmin can only create admins.")
        if user.is_admin() and role not in [User.ROLE_MANAGER, User.ROLE_WRITER]:
            raise PermissionDenied("Admins can only create managers or writers.")
        if user.is_manager() and role != User.ROLE_WRITER:
            raise PermissionDenied("Managers can only create writers.")

        # CREATE USER
        new_user = serializer.save()

        # Send verification email if inactive
        if not new_user.is_active:
            uidb64 = urlsafe_base64_encode(force_bytes(new_user.pk))
            token = account_activation_token.make_token(new_user)
            activation_link = f"{settings.SITE_DOMAIN}/api/auth/verify-email/?uidb64={uidb64}&token={token}"
            send_mail(
                "Activate your account",
                f"Click the link to verify your email: {activation_link}",
                settings.DEFAULT_FROM_EMAIL,
                [new_user.email],
                fail_silently=False,
            )

        return Response(
            {"detail": f"{role} created successfully. Verification email sent if required."},
            status=status.HTTP_201_CREATED
        )


# ---------------- FORGOT PASSWORD ----------------
class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "No user with this email."}, status=status.HTTP_400_BAD_REQUEST)

        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)
        reset_link = f"http://localhost:3000/reset-password?uidb64={uidb64}&token={token}"


        send_mail(
            "Reset Your Password",
            f"Click this link to reset your password:\n\n{reset_link}",
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

        return Response({"detail": "Password reset email sent."}, status=status.HTTP_200_OK)


# ---------------- RESET PASSWORD ----------------
class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uidb64 = request.data.get("uidb64")
        token = request.data.get("token")
        new_password = request.data.get("password")

        if not uidb64 or not token or not new_password:
            return Response({"detail": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception:
            return Response({"detail": "Invalid link."}, status=status.HTTP_400_BAD_REQUEST)

        if not token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"detail": "Password reset successful."}, status=status.HTTP_200_OK)
