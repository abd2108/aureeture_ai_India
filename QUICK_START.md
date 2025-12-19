# 🚀 Quick Start Guide - Fully Working Site

Your AureetureAI platform is **100% complete and functional**. Follow these steps to get it running.

## ⚡ 3-Step Setup

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### Step 2: Configure Environment Variables

#### Backend (`backend/.env`)
```env
# Required
MONGODB_URI=mongodb://localhost:27017/aureetureai
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
FRONTEND_URL=http://localhost:3000

# Optional (for video sessions)
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_app_certificate
```

#### Frontend (`frontend/.env.local`)
```env
# Required
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key

# Optional (for video sessions)
NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id
```

### Step 3: Start Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# ✅ Backend running on http://localhost:5001

# Terminal 2 - Frontend
cd frontend
npm run dev
# ✅ Frontend running on http://localhost:3000
```

## ✅ Verification

1. **Backend Health Check**: Visit `http://localhost:5001/health` → Should show `{"status":"UP"}`
2. **Frontend**: Visit `http://localhost:3000` → Should show landing page
3. **Career Explorer**: Click "Career Explorer" → Select role → Login/Signup → Dashboard loads

## 🎯 What's Working

- ✅ **Authentication**: Clerk login/signup with role selection
- ✅ **Dashboards**: Student, Mentor, Founder dashboards fully functional
- ✅ **Mentor Sessions**: Create, view, join video sessions
- ✅ **Video Sessions**: Agora integration (with credentials)
- ✅ **Profile Management**: Create and update profiles
- ✅ **Forms**: Contact, leads, enterprise demo submissions
- ✅ **API Integration**: All frontend-backend communication working
- ✅ **Database**: MongoDB models and connections configured

## 🔧 Troubleshooting

### "Failed to fetch" Error
- ✅ **Fixed**: Improved error handling and network detection
- Check: Backend is running (`http://localhost:5001/health`)
- Check: `NEXT_PUBLIC_API_BASE_URL` matches backend URL
- Check: CORS settings in backend `.env` (`FRONTEND_URL`)

### Video Session Issues
- ✅ **Fixed**: Added `agora-rtc-sdk-ng` dependency
- ✅ **Fixed**: Improved error messages
- Check: Agora credentials in both `.env` files
- Check: Browser permissions for camera/microphone

### Database Connection
- Check: MongoDB is running
- Check: `MONGODB_URI` is correct
- Check: Database user has proper permissions

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Detailed setup guide
- [AGORA_SETUP_COMPLETE.md](./AGORA_SETUP_COMPLETE.md) - Video session setup
- [AGORA_IMPLEMENTATION.md](./AGORA_IMPLEMENTATION.md) - Agora implementation details

## 🎉 You're Ready!

Your site is **fully functional**. Just add your credentials and start using it!

---

**Last Updated**: All fixes applied, dependencies added, error handling improved.


