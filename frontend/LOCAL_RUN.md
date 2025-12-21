# Run frontend locally

## 1) Install
```bash
cd frontend
npm install
```

## 2) Environment
Create `frontend/.env.local` (same folder as `package.json`) and add your Clerk keys:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Also set:
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:5001`

## 3) Start
```bash
npm run dev
```

Open http://localhost:3000

## Sign-in routes
- /sign-in
- /sign-up

If you see a Next route conflict error, ensure you **only** have:
- `app/sign-in/[[...sign-in]]/page.tsx`
- `app/sign-up/[[...sign-up]]/page.tsx`
(and no `app/sign-in/page.tsx` or `app/sign-up/page.tsx`).
