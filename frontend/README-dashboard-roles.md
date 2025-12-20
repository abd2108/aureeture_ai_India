# Multi-role Dashboard (Student, Mentor, Founder/Recruiter)

This document explains how the upgraded dashboard is structured, how to test role switching, and which files were changed in this refactor.

## How routing and roles work

- `/auth/select-role` and `/career-explorer` both act as entry points into the dashboard.
- On those pages, the user can choose:
  - **Student / Job Seeker**
  - **Mentor**
  - **Founder / Recruiter**
- After login (via Clerk), the app redirects to:
  - `GET /dashboard?role=student` → `/dashboard/student/overview`
  - `GET /dashboard?role=mentor` → `/dashboard/mentor/overview`
  - `GET /dashboard?role=founder` → `/dashboard/founder/overview`
- The file `app/dashboard/page.tsx` is a small client-side **traffic controller** that reads the `role` query parameter and routes accordingly.

All `/dashboard/**` routes share a common layout defined in `app/dashboard/layout.tsx`. This layout:

- Wraps content with `ProfileProvider` and `PathProvider` contexts.
- Enforces authentication with Clerk (`SignedIn` / `SignedOut` + `RedirectToSignIn`).
- Renders a persistent **left sidebar** and a **top navbar** for all dashboard pages.

## How to test role switching

1. **Start the dev server**
   - From `frontend/`, run `npm run dev` (or `pnpm dev` / `yarn dev` depending on your setup).

2. **Open the role selector**
   - Visit `http://localhost:3000/career-explorer` or `http://localhost:3000/auth/select-role`.

3. **Test Student / Job Seeker**
   - Click **“Student / Job Seeker”**.
   - If not signed in, complete the Clerk sign-in flow.
   - You should land on `/dashboard?role=student`, which immediately redirects to `/dashboard/student/overview`.
   - Verify:
     - Left sidebar shows **Profile, Dashboard, Mentors, Path Finder, Real-time Projects, Explore Opportunities, Referrals, Earnings**.
     - Top navbar shows the **Student / Job Seeker workspace** label.
     - The main overview page **no longer contains the “Recommended Mentors” box**; mentor content is dedicated to mentor-specific views.

4. **Test Mentor**
   - Return to `/career-explorer` or `/auth/select-role`.
   - Click **“Mentor”**.
   - After sign-in, you should land on `/dashboard?role=mentor` → `/dashboard/mentor/overview`.
   - Verify:
     - Sidebar only shows mentor-specific items (e.g., **Overview, Sessions**).
     - Top navbar label changes to **Mentor workspace**.
     - Student-only sections (e.g., referrals, explore opportunities) are not in this sidebar.

5. **Test Founder / Recruiter**
   - Again, visit `/career-explorer` or `/auth/select-role`.
   - Click **“Founder / Recruiter”**.
   - You should land on `/dashboard?role=founder` → `/dashboard/founder/overview`.
   - Verify:
     - Sidebar shows founder-specific items (e.g., **Overview, Talent Pool, Post Job**).
     - Top navbar label changes to **Founder / Recruiter workspace**.
     - Mentor/student-only entries do not appear in this sidebar.

6. **Access control**
   - Navigate directly to `/dashboard` or any `/dashboard/*` route **while signed out**.
   - You should be redirected to Clerk’s sign-in and returned to `/dashboard` after login.

7. **Responsiveness and keyboard navigation**
   - Resize the browser to mobile and desktop widths:
     - On mobile, the **top navbar remains**, while the sidebar is hidden (content is still accessible via direct routes).
     - On desktop, both **left sidebar** and **top navbar** are visible.
   - Use `Tab` / `Shift+Tab` to:
     - Focus the **top navbar brand** and **theme toggle**.
     - Move through all sidebar links. Each active link has `aria-current="page"` for screen readers.

## Key files changed in this refactor

- `app/dashboard/layout.tsx`
  - Reintroduced a **structured dashboard layout** with:
    - Left `DashboardSidebar`.
    - New `TopNavbar`.
    - Auth gating via Clerk.

- `app/dashboard/page.tsx`
  - Acts as a **role-based traffic controller** that redirects to:
    - `/dashboard/student/overview`
    - `/dashboard/mentor/overview`
    - `/dashboard/founder/overview`
    - Based on the `role` query parameter.

- `app/dashboard/student/overview/page.tsx`
  - Now contains the full **Student Personal Career Dashboard** UI directly in the page file (previously in `components/dashboard/PersonalCareerDashboard.tsx`).
  - The **“Recommended Mentors”** sidebar section has been removed so mentor content appears only in mentor-specific routes.

- `components/dashboard/DashboardSidebar.tsx`
  - Updated to be **role-aware**:
    - Detects role from the current pathname (`/dashboard/student`, `/dashboard/mentor`, `/dashboard/founder`).
    - Renders appropriate nav items per role.
  - Improved keyboard accessibility:
    - Uses `Link` elements directly for navigation (no nested buttons).
    - Adds `aria-current="page"` to the active link.

- `components/dashboard/TopNavbar.tsx` **(new)**
  - Provides a shared **top navbar** for all dashboard routes with:
    - Aureeture brand.
    - Role-specific workspace label (Student, Mentor, Founder/Recruiter).
    - Integrated `ThemeToggle`.

- `components/dashboard/PersonalCareerDashboard.tsx`
  - Removed, with its logic migrated into `app/dashboard/student/overview/page.tsx` to align with Next.js App Router best practices.

These changes restore a cohesive dashboard layout, ensure that mentor-specific content is scoped to the appropriate views, and provide a clear, testable multi-role experience across Student, Mentor, and Founder/Recruiter dashboards.


