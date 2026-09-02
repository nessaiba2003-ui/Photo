# LensCraft Studio

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

## Default Admin

Seeded from environment variables:

- Email: `admin@lenscraft.local`
- Password: `ChangeMe123!`

Change these before deploying.

## Environment Variables

Copy `.env.example` and set production values:

- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_HOURS`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
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
3. Set `CORS_ORIGINS` to the production frontend origin.
4. Build the backend container and frontend container.
5. Serve the frontend behind HTTPS.
6. Put the API behind HTTPS and a reverse proxy.
7. Replace seeded admin credentials immediately.
8. Add object storage for uploaded portfolio and client gallery files.

## Implemented Features

- Public cinematic homepage, portfolio filters, services/pricing, about, testimonials, contact, and mobile social buttons
- Booking form with package selection, client details, summary, backend validation, unique reference, and pending status
- Availability and double-booking protection for pending/confirmed sessions
- Client booking lookup page
- Admin login and dashboard overview
- Admin booking status management
- Admin endpoints for services, packages, portfolio, availability, clients, and testimonials
- Admin media upload endpoint for JPEG, PNG, WebP, MP4, and MOV files
