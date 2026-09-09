# HireFlow

HireFlow is a full-stack Job Portal Management System. It helps Job Seekers discover and apply for jobs, Recruiters manage companies and candidates, and Admins supervise platform users and job listings.

## Features

- Public landing page with Login and Register actions.
- Job Seeker profile, profile image, resume upload, job search, applications, and application status tracking.
- Recruiter profile and company management, job posting, job editing, and applicant review.
- Admin dashboard with live platform statistics, user block/unblock actions, and job activate/deactivate actions.
- JWT authentication and role-based authorization for `JobSeeker`, `Recruiter`, and `Admin`.
- Cloudinary storage for profile images, company logos, and resumes.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 8, React Router, Tailwind CSS 4, Axios |
| Backend | ASP.NET Core Web API, .NET 10 |
| Database | SQL Server with Entity Framework Core 10 |
| Authentication | JWT Bearer tokens |
| Password security | PBKDF2 hashing |
| File storage | Cloudinary |

## Project structure

```text
HireFlow/
├── HireFlow-Client/     # React + Vite frontend
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── routes/
│       └── services/
├── HireFlow-Server/     # ASP.NET Core backend
│   ├── HireFlow.slnx
│   └── HireFlow/
│       ├── Controllers/
│       ├── DTOs/
│       ├── Data/
│       ├── Models/
│       ├── Services/
│       ├── Middleware/
│       └── Program.cs
└── README.md
```

## Prerequisites

- Node.js 20 or later (Node 22 LTS recommended)
- .NET 10 SDK
- SQL Server or SQL Server Express
- Cloudinary account and product environment

## Configure the backend

Go to the backend project:

```powershell
cd HireFlow-Server\HireFlow
```

Configure `ConnectionStrings:DefaultConnection` in `appsettings.json` for your SQL Server instance. Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=HireFlowDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Set Cloudinary credentials with user secrets instead of committing secrets:

```powershell
dotnet user-secrets set "Cloudinary:CloudName" "YOUR_CLOUD_NAME"
dotnet user-secrets set "Cloudinary:ApiKey" "YOUR_API_KEY"
dotnet user-secrets set "Cloudinary:ApiSecret" "YOUR_API_SECRET"
```

Use a unique production value for `Jwt:Key` before deployment.

## Run the backend

From `HireFlow-Server\HireFlow`:

```powershell
dotnet restore
dotnet ef database update
dotnet run
```

The local API starts at:

```text
https://localhost:7221
```

## Configure and run the frontend

Create or update `HireFlow-Client/.env`:

```env
VITE_API_BASE_URL=https://localhost:7221/api
```

Then run the frontend:

```powershell
cd ..\..\HireFlow-Client
npm install
npm run dev
```

If PowerShell blocks `npm.ps1`, use `npm.cmd run dev` instead.

Open [http://localhost:5173](http://localhost:5173).

## Main routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | HireFlow landing page |
| `/login` | Public | Sign in |
| `/register` | Public | Job Seeker or Recruiter registration |
| `/jobseeker/dashboard` | JobSeeker | Job Seeker workspace |
| `/recruiter/dashboard` | Recruiter | Recruiter workspace |
| `/admin/dashboard` | Admin | Statistics dashboard |
| `/admin/users` | Admin | User block/unblock management |
| `/admin/jobs` | Admin | Job activate/deactivate management |

## Admin account

When the API starts and no Admin exists, it creates this account:

```text
Email:    admin@hireflow.com
Password: Admin@12345
```

Log in at [http://localhost:5173/login](http://localhost:5173/login). Admin users are redirected to `/admin/dashboard`.

Admin registration is intentionally unavailable. Change the seeded Admin password before deploying.

## API overview

| Area | Base route |
| --- | --- |
| Authentication | `/api/auth` |
| Job Seekers | `/api/jobseekers` |
| Recruiters | `/api/recruiters` |
| Companies | `/api/companies` |
| Jobs | `/api/jobs` |
| Applications | `/api/applications` |
| Admin | `/api/admin` |

### Admin endpoints

All Admin endpoints require a Bearer token with the `Admin` role.

```text
GET   /api/admin/stats
GET   /api/admin/users
PATCH /api/admin/users/{userId}/block
PATCH /api/admin/users/{userId}/unblock
GET   /api/admin/jobs
PATCH /api/admin/jobs/{jobId}/activate
PATCH /api/admin/jobs/{jobId}/deactivate
```

## Useful commands

```powershell
# Frontend
cd HireFlow-Client
npm run dev
npm run build
npm run lint

# Backend
cd HireFlow-Server\HireFlow
dotnet build
dotnet ef database update
dotnet run
```

 
