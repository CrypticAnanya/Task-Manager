import logging

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer, RegisterSerializer, RoleTokenObtainPairSerializer, UserSerializer

logger = logging.getLogger(__name__)


def auth_payload(user):
    refresh = RoleTokenObtainPairSerializer.get_token(user)
    return {
        "user": UserSerializer(user).data,
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        logger.debug("Register payload email=%s role=%s", request.data.get("email"), request.data.get("role"))
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(auth_payload(user), status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        logger.debug("Login success user_id=%s role=%s", user.id, user.role)
        return Response(auth_payload(user))


class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.data.get("refresh")
        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
            except (AttributeError, TokenError):
                logger.info("Refresh token could not be blacklisted.")
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class UserListView(ListAPIView):
    serializer_class = UserSerializer
    pagination_class = None

    def get_queryset(self):
        return UserSerializer.Meta.model.objects.filter(is_active=True).order_by("full_name", "email")
