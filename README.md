# Better Auth Next.js Template

A full-featured Next.js auth starter built with `better-auth`, Prisma, PostgreSQL, Upstash Redis, Resend email templates, and Uploadthing.

## What this template includes

- Email/password authentication with email verification
- Password reset flow via email
- Social login with GitHub and Google
- Two-factor authentication (2FA) using email OTP
- Profile update and avatar upload using Uploadthing
- Role-based access control with `user` and `admin`
- Prisma + PostgreSQL database setup
- Redis-backed cooldowns and rate limiting via Upstash
- Custom transactional emails with `@react-email/components`
- Next.js App Router route handlers for auth and file upload

## Built with

- `next` 16
- `react` 19
- `typescript`
- `better-auth`
- `prisma`
- `@prisma/adapter-pg`
- `@upstash/redis`
- `resend`
- `uploadthing`
- `tailwindcss` 4

## Getting started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start the local database

```bash
pnpm db:up
```

This project includes a `docker-compose.yml` service for PostgreSQL.

### 3. Configure environment variables

Create a `.env` file in the project root with the values below.

```env
DATABASE_URL=postgresql://admin:admin@localhost:5432/code

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000 # Base URL of your app

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

RESEND_API_KEY=
EMAIL_FROM=onboarding@resend.dev # Use Resend's default sender, or replace with a verified email/domain from resend.dev

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

UPLOADTHING_TOKEN=
```

> If you do not want email sending in development, you can still run the app, but email verification, password reset, and OTP delivery require a valid Resend API key.

### 4. Generate Prisma client and apply migrations

```bash
pnpm db:generate
pnpm db:migrate
```

If you need a clean database reset:

```bash
pnpm db:reset
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

- `pnpm dev` — start Next.js development server
- `pnpm build` — build production assets
- `pnpm start` — run the production server
- `pnpm lint` — run ESLint
- `pnpm db:up` — start PostgreSQL with Docker Compose
- `pnpm db:down` — stop the database
- `pnpm db:generate` — generate Prisma client
- `pnpm db:migrate` — run Prisma migrations
- `pnpm db:studio` — open Prisma Studio
- `pnpm db:seed` — seed the database
- `pnpm db:reset` — reset local database and migrations

## App routes and features

- `/sign-in` — sign in with email/password or social providers
- `/sign-up` — register with email/password
- `/request-password` — request a password reset email
- `/reset-password` — reset password using the emailed token
- `/two-factor` — verify email OTP after 2FA is enabled
- `/update-profile` — authenticated profile and settings page
- `/api/auth/*` — `better-auth` route handler for auth operations
- `/api/uploadthing/*` — secure file upload API route

## Auth stack details

- `lib/auth/auth.ts` configures `better-auth` with:
  - Prisma adapter for PostgreSQL
  - email/password auth and email verification
  - GitHub and Google social login
  - password reset email flow
  - 2FA email OTP support
  - username generation and admin roles

- `lib/db.ts` configures Prisma client with `@prisma/adapter-pg`
- `lib/redis.ts` connects to Upstash Redis for cooldowns
- `lib/email/` contains templates for verification, OTP, and reset emails

## Customization

- Modify auth behavior in `lib/auth/auth.ts`
- Adjust email templates in `lib/email/*` and `components/email/*`
- Extend user model fields in `prisma/schema.prisma`
- Update 2FA and rate-limit settings in the `better-auth` config
- Add additional auth pages or dashboard routes using the App Router

## Notes

- Uses Next.js App Router with server components and route handlers
- Profile update and file upload routes are secured for authenticated users
- `authIsRequired` and `authIsNotRequired` helpers guard protected pages

## License

MIT
