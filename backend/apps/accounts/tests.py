from django.contrib.auth import get_user_model
from django.test import override_settings
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken


@override_settings(
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    PASSWORD_HASHERS=["django.contrib.auth.hashers.MD5PasswordHasher"],
)
class AuthRoleFlowTests(APITestCase):
    def test_admin_signup_persists_role_and_returns_role_in_jwt(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "full_name": "New Admin",
                "email": "new-admin@example.com",
                "password": "AdminPass123!",
                "confirm_password": "AdminPass123!",
                "role": "ADMIN",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["user"]["role"], "ADMIN")

        user = get_user_model().objects.get(email="new-admin@example.com")
        self.assertEqual(user.role, "ADMIN")

        token = AccessToken(response.data["access"])
        self.assertEqual(token["role"], "ADMIN")
        self.assertEqual(token["email"], "new-admin@example.com")

    def test_member_signup_remains_member(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "full_name": "Team Member",
                "email": "member@example.com",
                "password": "MemberPass123!",
                "confirm_password": "MemberPass123!",
                "role": "MEMBER",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["user"]["role"], "MEMBER")
        self.assertEqual(AccessToken(response.data["access"])["role"], "MEMBER")
