[![ci-nextjs-application-template](https://github.com/ics-software-engineering/nextjs-application-template/actions/workflows/ci.yml/badge.svg)](https://github.com/ics-software-engineering/nextjs-application-template/actions/workflows/ci.yml)

For details, please see http://ics-software-engineering.github.io/nextjs-application-template/.

## Installation

1. **Install PostgreSQL** and create a database for your app:
	```bash
	createdb nextjs-application-template
	```

2. **Clone this template** (or use the "Use this template" button on GitHub to create your own repo).

3. **Install dependencies:**
	```bash
	npm install
	```

4. **Create your .env file:**
	- Copy `sample.env` to `.env` and update the `DATABASE_URL` to match your PostgreSQL setup.

5. **Run database migrations:**
	```bash
	npx prisma migrate dev
	```

6. **Generate Prisma client:**
	```bash
	npx prisma generate
	```

7. **Seed the database:**
	```bash
	npm run seed
	```

8. **Start the development server:**
	```bash
	npm run dev
	```

The app will be available at [http://localhost:3000](http://localhost:3000).

See the [template documentation](http://ics-software-engineering.github.io/nextjs-application-template/) for more details and walkthroughs.

## Course and Review Database Setup

This project now models:

1. `Course`: class id (`classId`), class name (`name`), professors, and reviews.
2. `Professor`: each professor tied to a specific course.
3. `Review`: tied to a course and (optionally) to both professor and user.
4. `User`: can own many reviews.

### Local migration + seed

1. Ensure `DATABASE_URL` is set in `.env`.
2. Create and apply migration:
	```bash
	npx prisma migrate dev --name add-course-professor-review-relations
	```
3. Regenerate client:
	```bash
	npx prisma generate
	```
4. Seed users, classes, and professors:
	```bash
	npm run seed
	```

## Deployable To Vercel

1. Create a managed Postgres database (recommended: Vercel Postgres, Neon, Supabase, or Railway).
2. In Vercel Project Settings -> Environment Variables, set:
	- `DATABASE_URL`
	- `AUTH_SECRET`
	- `NEXTAUTH_SECRET`
3. In Vercel Build & Development Settings, set Build Command to:
	```bash
	npm run vercel-build
	```
	This runs:
	- `prisma generate`
	- `prisma migrate deploy`
	- `next build`
4. Deploy from your main branch.

### Notes

- `prisma migrate deploy` is safe for CI/CD and production deploys.
- Use `npx prisma studio` locally to verify Course/Professor/Review relations.

## Playwright CI Stability Note

We addressed a cross-browser Playwright flake that appeared in CI for authenticated routes.

- Symptom: tests intermittently redirected from protected pages (for example, `/list`) to `/auth/signin`, mostly in WebKit/Firefox.
- Root cause: the old auth fixture reused persisted cookie files across parallel browser projects, and signin used client-side routing immediately after `signIn({ redirect: false })`, which could race session persistence.
- Fix: tests now authenticate fresh per browser context in `tests/auth-utils.ts`, and successful signin performs a full-page navigation to `/dashboard` in `src/app/auth/signin/page.tsx`.

If this flake reappears, run:

```bash
npm run lint
npm run playwright
```
