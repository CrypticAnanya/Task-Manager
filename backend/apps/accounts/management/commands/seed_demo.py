from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from apps.accounts.models import UserRole


class Command(BaseCommand):
    help = "Create demo accounts for local review."

    def handle(self, *args, **options):
        User = get_user_model()
        admin, created = User.objects.update_or_create(
            email="admin@taskmanager.dev",
            defaults={
                "full_name": "Demo Admin",
                "role": UserRole.ADMIN,
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
            },
        )
        admin.set_password("AdminPass123!")
        admin.save()

        member, _ = User.objects.update_or_create(
            email="member@taskmanager.dev",
            defaults={
                "full_name": "Demo Member",
                "role": UserRole.MEMBER,
                "is_staff": False,
                "is_superuser": False,
                "is_active": True,
            },
        )
        member.set_password("MemberPass123!")
        member.save()

        verb = "Created" if created else "Updated"
        self.stdout.write(self.style.SUCCESS(f"{verb} demo admin admin@taskmanager.dev / AdminPass123!"))
