from django.contrib.auth import get_user_model
from django.test import override_settings
from rest_framework.test import APITestCase


@override_settings(
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    PASSWORD_HASHERS=["django.contrib.auth.hashers.MD5PasswordHasher"],
)
class ProjectPermissionTests(APITestCase):
    def setUp(self):
        self.admin = get_user_model().objects.create_user(
            email="admin@example.com",
            full_name="Admin User",
            password="AdminPass123!",
            role="ADMIN",
        )
        self.member = get_user_model().objects.create_user(
            email="member@example.com",
            full_name="Member User",
            password="MemberPass123!",
            role="MEMBER",
        )

    def test_admin_can_create_project_member_cannot(self):
        self.client.force_authenticate(self.admin)
        admin_response = self.client.post("/api/projects/", {"title": "Launch", "description": "Recruiter-ready", "member_ids": [self.member.id]}, format="json")
        self.assertEqual(admin_response.status_code, 201)

        self.client.force_authenticate(self.member)
        member_response = self.client.post("/api/projects/", {"title": "Blocked"}, format="json")
        self.assertEqual(member_response.status_code, 403)
