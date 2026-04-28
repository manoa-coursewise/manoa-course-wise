# Developer Guide: Manoa CourseWise

## System Architecture Overview

Manoa CourseWise is a full-stack application built for UH Mānoa to help students make informed course decisions through honest peer reviews.

### Technology Stack

- **Frontend**: Next.js 16.1.6 (React 19) with React-Bootstrap
- **Backend**: Node.js server-side rendering via Next.js App Router
- **Database**: Prisma 7.7.0 ORM + PostgreSQL
- **Database Hosting**: db.prisma.io (managed PostgreSQL)
- **Deployment**: Vercel (production) with local development environment

### Key Architecture Principles

1. **Single Source of Truth** — All course data lives in the Prisma database; no hardcoded course lists in code
2. **Server-Side Rendering** — Async server components fetch data directly from the database
3. **Shared Components** — One `CourseDetailView.tsx` component renders all course detail pages (prevents style drift)
4. **Type Safety** — TypeScript + Prisma type generation ensures compile-time safety
5. **No Separate API Layer** — Server components query Prisma directly (simpler architecture for this scale)

---

## Project Structure

```
final-project/
├── src/
│   ├── app/                                  # Next.js App Router
│   │   ├── page.tsx                          # Landing page (hero + stats)
│   │   ├── landing.css                       # Landing page styling
│   │   ├── globals.css                       # Global theme variables + base styles
│   │   ├── layout.tsx                        # Root layout (navbar, footer)
│   │   ├── courses/
│   │   │   ├── search/
│   │   │   │   ├── page.tsx                  # Async server component (queries Prisma)
│   │   │   │   └── search.css                # Search page styling
│   │   │   └── details/
│   │   │       ├── details.css               # Course detail styling
│   │   │       └── [courseId]/
│   │   │           └── [professor]/
│   │   │               └── page.tsx          # Dynamic route (renders CourseDetailView)
│   │   ├── auth/                             # Authentication pages
│   │   ├── dashboard/                        # User dashboard
│   │   └── ...                               # Other pages
│   │
│   ├── components/
│   │   ├── CourseDetailView.tsx              # ⭐ Shared detail template (all courses)
│   │   ├── CourseCard.tsx                    # Course card for list pages
│   │   ├── Navbar.tsx                        # Navigation bar
│   │   ├── Footer.tsx                        # Footer
│   │   └── ...                               # Other components
│   │
│   ├── lib/
│   │   ├── prisma.ts                         # Prisma client singleton
│   │   ├── dbActions.ts                      # Server actions (DB mutations)
│   │   ├── courseData.ts                     # Static course catalog (form dropdowns only)
│   │   └── validationSchemas.ts              # Yup validation schemas
│   │
│   ├── scripts/
│   │   └── importIcsCourses.ts               # CSV import script for bulk data
│   │
│   └── types/
│       └── styles.d.ts                       # TypeScript CSS module declarations
│
├── prisma/
│   ├── schema.prisma                         # Data model definition ⭐
│   ├── seed.ts                               # Database seeding script
│   └── migrations/                           # Auto-generated migration files
│
├── data/
│   └── ics-courses.csv                       # ICS course data (imported via npm run import:ics)
│
├── config/
│   └── settings.development.json             # App config (default users, etc.)
│
├── .env                                      # Local database connection (git-ignored)
├── .env.local                                # Remote database connection (git-ignored)
├── .env.example                              # Template for environment setup
│
├── tsconfig.json                             # TypeScript configuration
├── package.json                              # Dependencies + npm scripts
├── next.config.ts                            # Next.js configuration
│
└── README.md
```

---

## Data Model

The Prisma schema defines the core data structure. All relationships are enforced at the database level.

### Course Model

```prisma
model Course {
  id         Int         @id @default(autoincrement())
  classId    String      @unique              // e.g., "ICS 311"
  name       String                          // e.g., "Algorithms"
  professors Professor[]                     // One-to-many
  reviews    Review[]                        // One-to-many
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}
```

**Key Notes:**
- `classId` is unique (no duplicate courses)
- Automatically maintains `createdAt` and `updatedAt` timestamps
- Cascading deletes: removing a course removes all related professors and reviews

### Professor Model

```prisma
model Professor {
  id       Int      @id @default(autoincrement())
  name     String
  courseId Int
  course   Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  reviews  Review[]
  
  @@unique([courseId, name])                 // One name per course
  @@index([name])
}
```

**Key Notes:**
- Unique constraint: one professor name per course (no duplicate professor records)
- Foreign key to Course (enforces referential integrity)
- Indexed by name for fast lookups

### Review Model

```prisma
model Review {
  id            Int        @id @default(autoincrement())
  courseId      Int                         // Foreign key
  professorId   Int?                        // Optional (some reviews may not specify)
  userId        Int?                        // Optional (anonymous reviews allowed)
  
  // Rating metrics (1-5 scale)
  rating        Float                       // Derived: avg(difficulty, workload, clarity)
  difficulty    Float                       // 1 = Easy, 5 = Hard
  workload      Float                       // 1 = Light, 5 = Heavy
  clarity       Float                       // 1 = Unclear, 5 = Clear
  
  // Review content
  text          String                      // Review text (required)
  anonymous     Boolean    @default(false)
  tags          String[]   @default([])     // Array of tag names
  semesterTaken String?                     // e.g., "Spring 2025"
  
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  
  // Relations
  course        Course     @relation(fields: [courseId], references: [id], onDelete: Cascade)
  professor     Professor? @relation(fields: [professorId], references: [id])
  user          User?      @relation(fields: [userId], references: [id])
  
  @@index([courseId])
  @@index([userId])
  @@index([professorId])
}
```

**Key Notes:**
- `rating` is calculated when displaying (average of difficulty, workload, clarity)
- `userId` is optional to allow anonymous reviews
- `tags` is a string array storing tag names (not a relation table)
- Indexes on foreign keys for fast queries

### User Model

```prisma
model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  password String                           // bcrypt-hashed
  role     Role     @default(USER)          // USER or ADMIN
  reviews  Review[]
  createdAt DateTime @default(now())
}

enum Role {
  USER
  ADMIN
}
```

---

## Key Pages & Components

### Landing Page (`src/app/page.tsx`)

**Purpose:** Entry point showing platform overview

**Features:**
- Hero section with search bar
- Statistics (course count, review count, etc.)
- Featured courses carousel
- Call-to-action buttons

**CSS:** `src/app/landing.css` with white text on dark teal gradient

---

### Course Search/List (`src/app/courses/search/page.tsx`)

**Purpose:** Display all ICS courses with filtering/sorting

**How it works:**
1. Async server component (no client-side data fetching)
2. Queries Prisma: `course.findMany({ where: { classId: { startsWith: 'ICS ' } } })`
3. Maps results to `CourseCard` components
4. Each card links to dynamic route `/courses/details/[courseId]/[professor]`

**Key Code:**
```typescript
const courses = await prisma.course.findMany({
  where: { classId: { startsWith: 'ICS ' } },
  include: { professors: true, reviews: true }
});

// Calculate metrics for each course
courses.map(course => ({
  code: course.classId,
  title: course.name,
  avgRating: calculateAverage(course.reviews, 'rating'),
  // ... more props
}))
```

**CSS:** `src/app/courses/search/search.css` (dark background, high-contrast text)

---

### Course Detail Route (`src/app/courses/details/[courseId]/[professor]/page.tsx`)

**Purpose:** Dynamic route rendering detail page for any course

**How it works:**
1. Receives URL parameters: `courseId` (URL-encoded), `professor`
2. Decodes courseId: `decodeURIComponent(courseId)`
3. Queries Prisma: `course.findUnique({ where: { classId: decodedCourseId }, include: { professors: true, reviews: { include: { professor: true } } } })`
4. Passes course object to `<CourseDetailView course={course} />`

**Key Code:**
```typescript
export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string; professor: string }>;
}) {
  const { courseId } = await params;
  const decodedCourseId = decodeURIComponent(courseId);
  
  const course = await prisma.course.findUnique({
    where: { classId: decodedCourseId },
    include: {
      professors: true,
      reviews: { include: { professor: true } },
    },
  });

  if (!course) notFound();
  return <CourseDetailView course={course} />;
}
```

**CSS:** `src/app/courses/details/details.css` (dark teal gradient)

---

### Shared Detail Component (`src/components/CourseDetailView.tsx`)

**Purpose:** ⭐ **Single template rendering all course detail pages**

**Why this matters:**
- All 39 imported courses render through this one component
- Changes to course detail layout automatically apply to all courses
- Prevents style drift and duplication

**Sections rendered:**
1. **Header Card** — Course code, name, professors, rating, review count
2. **Metrics Grid** — Difficulty, Workload, Clarity averages
3. **Common Feedback** — Top 8 tags from all reviews
4. **Student Reviews** — List of reviews with details
5. **Sidebar** — Course schedule info, "Add to Schedule" button

**Key Logic:**
```typescript
export default async function CourseDetailView({ 
  course 
}: { 
  course: CourseWithRelations 
}) {
  // Calculate averages
  const avgDifficulty = reviews.reduce((sum, r) => sum + r.difficulty, 0) / reviews.length;
  const avgWorkload = reviews.reduce((sum, r) => sum + r.workload, 0) / reviews.length;
  const avgClarity = reviews.reduce((sum, r) => sum + r.clarity, 0) / reviews.length;
  
  // Aggregate tags
  const tagCounts = {};
  reviews.forEach(r => r.tags.forEach(tag => tagCounts[tag] = (tagCounts[tag] || 0) + 1));
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  
  // Render layout
  return (
    <div className="course-details-page">
      <div className="course-header-card">
        <h3>{course.classId}</h3>
        <h1>{course.name}</h1>
        <p className="course-professors">{course.professors.map(p => p.name).join(', ')}</p>
      </div>
      
      <div className="course-metrics">
        <div className="metric">
          <span className="metric-label">Difficulty</span>
          <span className="metric-value">{avgDifficulty.toFixed(1)}</span>
        </div>
        {/* ... more metrics ... */}
      </div>
      
      <div className="course-feedback">
        <h5 className="course-section-title">Common Student Feedback</h5>
        {topTags.map(([tag]) => <span className="badge">{tag}</span>)}
      </div>
      
      <div className="course-reviews">
        <h4 className="course-section-title">Student Reviews ({reviews.length})</h4>
        {reviews.map(review => <ReviewCard review={review} />)}
      </div>
    </div>
  );
}
```

---

## Common Development Tasks

### 1. Add New Courses to the Database

#### **Option A: CSV Import (Recommended for bulk data)**

1. Edit `data/ics-courses.csv`:
   ```csv
   course number,course name,instructor
   100,Digital Tools for the Information World,Michael-Brian C. Ogawa
   110P,Discrete Mathematics for Computer Science,Carleton Moore
   311,Algorithms,Kyle Berney
   ```

2. Run the import script:
   ```bash
   npm run import:ics
   ```

3. The script (`src/scripts/importIcsCourses.ts`):
   - Reads the CSV
   - Auto-prefixes "ICS " to course numbers
   - Upserts Course + Professor records
   - Deduplicates professor names per course

#### **Option B: Prisma Studio (Manual entry)**

```bash
npx prisma studio
```

- Opens GUI at `http://localhost:5555`
- Navigate to Course table
- Add records manually with classId (e.g., "ICS 311") and name
- Switch to Professor table and link them

---

### 2. Add a New Review Field

Example: Add a "Grading Fairness" metric.

**Step 1: Update Prisma Schema**

Edit `prisma/schema.prisma`:
```prisma
model Review {
  // ... existing fields ...
  gradingFairness Float      // New field: 1-5 scale
  // ... rest of model ...
}
```

**Step 2: Create Migration**

```bash
npx prisma migrate dev --name add_grading_fairness_field
```

This creates a migration file in `prisma/migrations/` and updates the database.

**Step 3: Update Validation Schema**

Edit `src/lib/validationSchemas.ts`:
```typescript
export const reviewFormSchema = Yup.object().shape({
  // ... existing fields ...
  gradingFairness: Yup.number()
    .min(1)
    .max(5)
    .required('Grading fairness rating is required'),
  // ... rest of schema ...
});
```

**Step 4: Update Review Form**

Edit `src/components/SubmitReviewForm.tsx`:
```tsx
<Form.Group className="mb-3">
  <Form.Label>Grading Fairness (1-5)</Form.Label>
  <Form.Select
    name="gradingFairness"
    value={formik.values.gradingFairness}
    onChange={formik.handleChange}
  >
    <option value="">Select...</option>
    {[1, 2, 3, 4, 5].map(n => (
      <option key={n} value={n}>{n} - {getGradingLabel(n)}</option>
    ))}
  </Form.Select>
</Form.Group>

function getGradingLabel(n: number): string {
  const labels = {
    1: 'Unfair grading',
    3: 'Neutral',
    5: 'Very fair grading'
  };
  return labels[n] || '';
}
```

**Step 5: Update CourseDetailView Component**

Edit `src/components/CourseDetailView.tsx`:
```tsx
// Calculate average
const avgGradingFairness = reviews.length 
  ? reviews.reduce((sum, r) => sum + r.gradingFairness, 0) / reviews.length 
  : 0;

// Add to metrics display
<div className="metric">
  <span className="metric-label">Grading Fairness</span>
  <span className="metric-value">{avgGradingFairness.toFixed(1)}</span>
</div>
```

**Step 6: Commit and Deploy**

```bash
git add -A
git commit -m "Add grading fairness field to course reviews"
git push origin <feature-branch>
# Create PR on GitHub, merge after review
```

Vercel auto-deploys and runs the migration on production.

---

### 3. Deploy Changes to Production

**Workflow:**

1. **Commit locally**:
   ```bash
   git add -A
   git commit -m "Descriptive message about your changes"
   ```

2. **Push to a feature branch**:
   ```bash
   git push -u origin <feature-branch>
   ```

3. **Create Pull Request** on GitHub:
   - Go to repository
   - GitHub prompts: "Compare & pull request"
   - Add description of changes
   - Request review from team members

4. **Merge to main** (after approval):
   - Vercel automatically builds and deploys from main
   - Watch build progress in Vercel dashboard

5. **Database Migrations**:
   - Vercel runs `npm run vercel-build`, which includes `prisma migrate deploy`
   - Migrations execute in order on production database
   - ⚠️ **Always test migrations locally first**

---

### 4. Run Development Server Locally

#### **Initial Setup**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/manoa-coursewise/manoa-course-wise.git
   cd manoa-course-wise
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment files**:

   Create `.env` (local database):
   ```
   DATABASE_URL="postgresql://[user]:[password]@localhost:5432/mydb"
   AUTH_SECRET=[generate-random-string]
   AUTH_URL=http://localhost:3000
   ```

   Create `.env.local` (remote database, optional):
   ```
   PRISMA_DATABASE_URL="postgresql://[user]:[password]@db.prisma.io:5432/postgres"
   AUTH_SECRET=[same-as-.env]
   ```

4. **Set up database**:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start dev server**:
   ```bash
   npm run dev
   ```

6. **Access the app**:
   - Navigate to `http://localhost:3000`
   - Landing page loads with your local database

#### **Daily Development**

```bash
cd final-project
npm run dev
```

Then navigate to `http://localhost:3000` in your browser.

---

### 5. Seed Test Data

Populate the local database with test courses, users, and reviews:

```bash
npm run seed
```

This runs `prisma/seed.ts`, which:
- Creates default users (admin, user, etc.)
- Creates default "stuff" items (sample data)
- Seeds all ICS courses from `src/lib/courseData.ts`
- Seeds sample reviews for courses like ICS 311

---

### 6. Debug Database Issues

#### **Browse Database**

```bash
npx prisma studio
```

Opens GUI at `http://localhost:5555` to inspect/edit tables.

#### **Check Migration Status**

```bash
npx prisma migrate status
```

Shows which migrations have been applied.

#### **Reset Local Database** (⚠️ Destructive)

```bash
npx prisma migrate reset
```

Clears everything and re-runs all migrations + seed.

#### **Verify Database Connection**

```bash
node -e "console.log(process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || 'NOT SET')"
```

---

## Environment Variables Reference

### Local Development (`.env`)

```
DATABASE_URL=postgresql://[user]:[password]@localhost:5432/mydb
AUTH_SECRET=[random-32-char-string]
AUTH_URL=http://localhost:3000
```

### Production (`.env.local`, set in Vercel Dashboard)

```
POSTGRES_PRISMA_URL=postgresql://[user]:[password]@db.prisma.io:5432/postgres
PRISMA_DATABASE_URL=postgresql://[user]:[password]@db.prisma.io:5432/postgres
AUTH_SECRET=[same-as-local]
AUTH_URL=https://yourproductiondomain.com
```

---

## Key Files Reference

| File | Purpose | Notes |
|------|---------|-------|
| `src/app/courses/search/page.tsx` | Course list | Async server component; queries Prisma for ICS courses |
| `src/app/courses/details/[courseId]/[professor]/page.tsx` | Dynamic detail route | Decodes URL, queries Prisma, renders CourseDetailView |
| `src/components/CourseDetailView.tsx` | ⭐ Shared detail template | All 39+ courses render through this component |
| `src/lib/dbActions.ts` | Server actions | DB mutations (addReview, updateUser, etc.) |
| `src/lib/prisma.ts` | Prisma client | Singleton for database connection |
| `prisma/schema.prisma` | Data model | Course, Professor, Review, User schemas |
| `src/scripts/importIcsCourses.ts` | CSV import script | Bulk course population from CSV |
| `data/ics-courses.csv` | Course data | Source data (39 ICS courses + instructors) |
| `prisma/seed.ts` | Database seeding | Creates test data, courses, reviews |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **CSS imports show red in editor** | Restart TypeScript server: Ctrl+Shift+P → "TypeScript: Restart TS Server" |
| **Build fails: "migration not applied"** | Run `npx prisma migrate deploy`, commit migration files, push to main |
| **Course detail page shows 404** | Verify course exists: `npx prisma studio` → check Course table for matching classId |
| **Review submission fails** | Check browser console; verify form validation in `validationSchemas.ts` |
| **Local database unreachable** | Ensure PostgreSQL running locally; verify DATABASE_URL in .env |
| **Vercel deployment fails** | Check Vercel build logs; ensure migrations are committed; verify .env.local vars in Vercel dashboard |
| **TypeScript errors on Prisma types** | Run `npx prisma generate` to regenerate Prisma client types |
| **"Cannot find module" errors** | Run `npm install`, then `npm run dev` (sometimes Next.js needs restart) |

---

## Testing Locally

### Manual Testing Checklist

- [ ] Course list page loads all ICS courses
- [ ] Course detail page displays metrics correctly
- [ ] Review submission form validates inputs
- [ ] Anonymous reviews don't show author name
- [ ] Tags appear correctly in reviews
- [ ] Common Feedback section shows top tags
- [ ] Metrics average correctly across reviews
- [ ] Professor names display for multi-professor courses

### Automated Testing

Currently no automated tests. To add:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

Then create test files:
```
src/components/__tests__/CourseDetailView.test.tsx
src/app/courses/search/__tests__/page.test.tsx
```

---

## Architecture Decisions

### Why Async Server Components?

- Simplifies data fetching (no separate API layer)
- Better performance (database query on server, HTML sent to client)
- Type-safe Prisma queries at compile time
- Easier deployment to Vercel (native support)

### Why One Detail Component?

- Prevents style drift across similar pages
- Single place to update course detail design
- Easy to add new fields (update CourseDetailView once)
- Reduces code duplication

### Why CSV for Data Import?

- Easier to bulk-populate from spreadsheets/PDFs
- Less error-prone than manual UI entry
- Version-controllable (committed to git)
- Repeatable process for future semesters

---

## Extending the System

### Add a New Page Type (e.g., Professor Profile)

1. Create route: `src/app/professors/[professorName]/page.tsx`
2. Query Prisma for professor + related courses/reviews
3. Create `ProfessorDetailView.tsx` component
4. Style with CSS similar to course pages
5. Commit and deploy

### Add a New Feature (e.g., Course Wishlist)

1. Update Prisma schema (add Wishlist model)
2. Create migration: `npx prisma migrate dev`
3. Add server action: `src/lib/dbActions.ts`
4. Create UI component using server action
5. Test locally
6. Commit and deploy

### Optimize Database Queries

If slow queries appear:

1. Check current queries in `CourseDetailView.tsx`
2. Use Prisma `include()` to eager-load relations
3. Add database indexes if needed
4. Monitor query performance in Vercel analytics

---

## Getting Help

- **GitHub Issues**: [manoa-coursewise/manoa-course-wise/issues](https://github.com/manoa-coursewise/manoa-course-wise/issues)
- **Code Questions**: Check comment threads in pull requests
- **Vercel Deployment**: Check build logs in Vercel dashboard
- **Database Issues**: Use `npx prisma studio` to inspect data
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)

---

**Last Updated:** April 2026  
**Version:** 1.0  
**Team:** Manoa CourseWise Development Team  
**Repository:** [GitHub: manoa-coursewise/manoa-course-wise](https://github.com/manoa-coursewise/manoa-course-wise)
