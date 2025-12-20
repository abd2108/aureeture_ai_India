# Run backend locally

## 1) Install
```bash
cd backend
npm install
```

## 2) Environment
Create `backend/.env` and set at minimum:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/aureetureai
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
```

## 3) Start
```bash
npm run dev
```

Health check: http://localhost:5001/health
