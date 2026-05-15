# Team Task Manager

Modern full-stack team task manager with Django REST Framework, JWT authentication, role-based access control, React, TypeScript, Tailwind CSS, and Railway deployment support.

## Highlights

- Email/password auth with JWT access and refresh tokens.
- Role-based access control for `ADMIN` and `MEMBER`.
- Fixed admin signup flow: selected role is sent by React, accepted by DRF, saved to the database, returned in auth responses, embedded in JWT claims, and persisted in frontend auth state.
- Projects, task tracking, assignment, overdue indicators, search, dashboard metrics, and analytics charts.
- Responsive SaaS-style interface with dark/light mode, glass panels, soft shadows, transitions, skeletons, toast notifications, Lucide icons, and Recharts.
- PostgreSQL-ready backend with environment variables, WhiteNoise, Gunicorn, and Railway config.

## Screenshots

Add screenshots after running the app:

- `docs/screenshots/dashboard.png`
- `docs/screenshots/tasks.png`
- `docs/screenshots/signup-admin.png`

## Tech Stack

Backend: Django 5, Django REST Framework, SimpleJWT, PostgreSQL, django-filter, WhiteNoise, Gunicorn.

Frontend: React, Vite, TypeScript, Tailwind CSS, Axios, React Router, React Hook Form, Zod, Framer Motion, Lucide React, Recharts.

## Demo Credentials

Run `python manage.py seed_demo` to create:

- Admin: `admin@taskmanager.dev` / `AdminPass123!`
- Member: `member@taskmanager.dev` / `MemberPass123!`

## Local Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r backend/requirements.txt
```

Create `backend/.env` from `backend/.env.example`. For quick local SQLite testing:

```env
DATABASE_URL=sqlite:///db.sqlite3
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Run the backend:

```bash
cd backend
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## PostgreSQL Environment

Use either `DATABASE_URL` or individual values:

```env
SECRET_KEY=use-a-long-random-secret
DEBUG=False
ALLOWED_HOSTS=your-domain.railway.app
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
CSRF_TRUSTED_ORIGINS=https://your-frontend-domain.com
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
```

## API Reference

Auth:

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `GET /api/auth/me/`
- `GET /api/auth/users/`

Projects:

- `GET /api/projects/`
- `POST /api/projects/` admin only
- `PUT /api/projects/{id}/` admin only
- `DELETE /api/projects/{id}/` admin only

Tasks:

- `GET /api/tasks/`
- `POST /api/tasks/` admin only
- `PUT /api/tasks/{id}/` admin only
- `DELETE /api/tasks/{id}/` admin only

Dashboard:

- `GET /api/dashboard/`

## RBAC Verification

Expected admin signup payload:

```json
{
  "full_name": "John Admin",
  "email": "john@test.com",
  "password": "Password123!",
  "confirm_password": "Password123!",
  "role": "ADMIN"
}
```

Expected response includes:

```json
{
  "user": {
    "email": "john@test.com",
    "role": "ADMIN"
  }
}
```

The access token also includes `role: "ADMIN"`, and the React auth provider persists that returned user role to localStorage.

## Railway Deployment

1. Create a Railway project.
2. Add a PostgreSQL service.
3. Deploy this repository as the backend service.
4. Set environment variables: `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`, and Railway's `DATABASE_URL`.
5. Railway uses the root `Procfile`/`railway.json` to run migrations, collect static files, and start Gunicorn.

For a separate frontend service, deploy `frontend/` and set:

```env
VITE_API_URL=https://your-backend.railway.app/api
```

## Verification

Completed locally:

- `python manage.py check`
- `python manage.py migrate` with SQLite override
- Admin signup RBAC endpoint test: response role `ADMIN`, token role `ADMIN`, admin route status `200`
- Member signup RBAC endpoint test: response role `MEMBER`, token role `MEMBER`, admin write route status `403`
- `npm run build`
