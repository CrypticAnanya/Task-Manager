from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from apps.accounts.models import UserRole


class Command(BaseCommand):
    help = "Create or update the demo admin account used in the README."

    def handle(self, *args, **options):
        user_model = get_user_model()
        user, created = user_model.objects.get_or_create(
            email="admin@taskmanager.dev",
            defaults={
                "full_name": "Demo Admin",
                "role": UserRole.ADMIN,
                "is_staff": True,
            },
        )
        user.full_name = user.full_name or "Demo Admin"
        user.role = UserRole.ADMIN
        user.is_staff = True
        user.set_password("AdminPass123!")
        user.save(update_fields=["full_name", "role", "is_staff", "password"])

        action = "Created" if created else "Updated"
        self.stdout.write(self.style.SUCCESS(f"{action} admin@taskmanager.dev with ADMIN role."))
