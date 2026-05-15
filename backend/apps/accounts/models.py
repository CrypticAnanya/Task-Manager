from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserRole(models.TextChoices):
    ADMIN = "ADMIN", "Admin"
    MEMBER = "MEMBER", "Member"


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email: str, password: str | None = None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address.")
        email = self.normalize_email(email)
        role = extra_fields.get("role") or UserRole.MEMBER
        if role not in UserRole.values:
            raise ValueError("Invalid user role.")
        extra_fields["role"] = role
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, password: str | None = None, **extra_fields):
        extra_fields.setdefault("role", UserRole.ADMIN)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("role") != UserRole.ADMIN:
            raise ValueError("Superusers must have ADMIN role.")
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superusers must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superusers must have is_superuser=True.")

        return self.create_user(email=email, password=password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    full_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.MEMBER)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    objects = UserManager()

    class Meta:
        ordering = ["full_name", "email"]

    def __str__(self) -> str:
        return self.email

    @property
    def is_admin_role(self) -> bool:
        return self.role == UserRole.ADMIN
