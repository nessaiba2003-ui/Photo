# ALBATROS

Premium full-stack booking, portfolio, pricing, and admin platform for a photographer, videographer, and video editor.

## Stack

- React + Vite frontend with responsive cinematic UI
- Spring Boot REST API with validation, JWT authentication, role-based admin authorization, and BCrypt password hashing
- PostgreSQL relational database via JPA entities and indexes
- Docker Compose for local infrastructure

## Local Development

1. Start PostgreSQL:

```bash
docker compose up postgres
```

2. Run the backend:

```bash
cd backend
mvn spring-boot:run
```

3. Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Docker Setup

```bash
docker compose up --build
```

Frontend: `http://localhost:8081`  
Backend: `http://localhost:8080/api`

## Vercel Frontend Deployment

This repository is a full-stack monorepo. Vercel should deploy only the React frontend.

The included `vercel.json` builds `frontend/` and publishes `frontend/dist`.

Recommended Vercel settings:

- Framework Preset: `Vite`
- Build Command: `npm --prefix frontend install && npm --prefix frontend run build`
- Output Directory: `frontend/dist`
- Environment Variable: `VITE_API_URL=https://your-api-domain.com/api`
- Do not add `ADMIN_BOOTSTRAP_PASSWORD`, `JWT_SECRET`, or database credentials to frontend/Vite/Vercel public variables.

The Spring Boot backend and PostgreSQL database should be deployed separately on a backend host such as Render, Railway, Fly.io, a VPS, or Docker on a production server.

## Render Backend Deployment

The included `render.yaml` provisions the Spring backend and a managed PostgreSQL database. In Render, create a new Blueprint from this repository, then enter these two values when requested:

- `ADMIN_BOOTSTRAP_PASSWORD`: the initial administrator password, entered only in Render's secret field.
- `CORS_ORIGINS`: the exact Vercel production URL, for example `https://photo-five-delta.vercel.app`.

After Render reports the API as live, copy its public URL and set Vercel's `VITE_API_URL` to `https://YOUR-RENDER-SERVICE.onrender.com/api`, then redeploy Vercel. Render's database URL is converted to Spring's JDBC format at startup; no database secret is committed to this repository.

Backend production secrets:

- `ADMIN_EMAIL=hamzaelbahi.orion@gmail.com`
- `ADMIN_BOOTSTRAP_PASSWORD` set as a server-side secret only
- `JWT_SECRET` set as a long random server-side secret
- `DATABASE_URL`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD` set only on the backend host
- `CORS_ORIGINS` should include the ALBATROS frontend URL and `https://h-portfolio-sepia.vercel.app` when the portfolio consumes the shared API.

## Default Admin

Seeded from environment variables:

- Email: `hamzaelbahi.orion@gmail.com`
- Password: set only as the server-side `ADMIN_BOOTSTRAP_PASSWORD` secret before the first backend startup.

The bootstrap password is hashed with BCrypt when the first admin is created. Do not commit it, expose it through frontend variables, or display it in the Admin UI. After the first login, change it from Admin -> Settings.

## Environment Variables

Copy `.env.example` and set production values:

- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_HOURS`
- `ADMIN_EMAIL`
- `ADMIN_BOOTSTRAP_PASSWORD`
- `CORS_ORIGINS`
- `VITE_API_URL`
- `UPLOAD_DIR`

## Database Schema

Main entities:

- `AdminUser`: secure dashboard access
- `Client`: contact profile and notes
- `PhotographyService`: public services
- `ServicePackage`: dynamic package content and pricing
- `PortfolioProject`: gallery/project metadata
- `PortfolioMedia`: photo/video project assets
- `Booking`: request workflow with reference number, status, payment, delivery, and notes
- `Availability`: blocked dates and time slots
- `Testimonial`: public reviews
- `Payment`: payment record
- `ClientGallery`: secure delivery/gallery links

Spring Boot creates and updates the schema automatically in development. For production, replace `spring.jpa.hibernate.ddl-auto=update` with migrations such as Flyway or Liquibase.

## Production Deployment

1. Provision PostgreSQL and set strong database credentials.
2. Set a long random `JWT_SECRET`.
3. Set `ADMIN_BOOTSTRAP_PASSWORD` as a server-side production secret before the first backend startup.
4. Set `CORS_ORIGINS` to the production frontend origin.
5. Build the backend container and frontend container.
6. Serve the frontend behind HTTPS.
7. Put the API behind HTTPS and a reverse proxy.
8. Change the bootstrap admin password from Admin -> Settings after first login.
9. Add object storage for uploaded portfolio and client gallery files.

## Implemented Features

- Public cinematic homepage, portfolio filters, services/pricing, about, testimonials, contact, and mobile social buttons
- Booking form with package selection, client details, summary, backend validation, unique reference, and pending status
- Moroccan dirham pricing calibrated for Rabat/Morocco market positioning
- Availability and double-booking protection for pending/confirmed sessions
- Client booking lookup page
- Admin login and dashboard overview
- Authenticated Admin Settings password-change form backed by `/api/admin/auth/change-password`
- Admin booking status management
- Admin endpoints for services, packages, portfolio, availability, clients, and testimonials
- Admin media upload endpoint for JPEG, PNG, WebP, MP4, and MOV files
- Public portfolio API available at `/api/public/portfolio` for a shared ALBATROS/portfolio data source
