import logging

from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import UserRole

logger = logging.getLogger(__name__)
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "full_name", "email", "role", "created_at")
        read_only_fields = ("id", "created_at")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=UserRole.choices, default=UserRole.MEMBER)

    class Meta:
        model = User
        fields = ("id", "full_name", "email", "password", "confirm_password", "role")
        read_only_fields = ("id",)

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        password = validated_data.pop("password")
        logger.debug("RegisterSerializer validated role=%s email=%s", validated_data.get("role"), validated_data.get("email"))
        user = User.objects.create_user(password=password, **validated_data)
        logger.debug("RegisterSerializer saved user_id=%s db_role=%s", user.id, user.role)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs["email"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account is disabled.")
        attrs["user"] = user
        return attrs


class RoleTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        token["full_name"] = user.full_name
        token["role"] = user.role
        logger.debug("JWT payload user_id=%s role=%s", user.id, user.role)
        return token
