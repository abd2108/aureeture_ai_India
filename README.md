# AureetureAI - Complete Platform

A comprehensive career discovery and mentorship platform with full-stack integration.

## 🚀 Quick Start

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### Prerequisites
- Node.js 18+
- MongoDB
- Clerk account (for authentication)

### Installation

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration

# Frontend
cd ../frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Running

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

- **Backend**: Express.js API with MongoDB, Clerk authentication
- **Frontend**: Next.js 14 with TypeScript, Clerk authentication, Tailwind CSS

## 🔗 Key Features

- ✅ Complete authentication flow (Clerk integration)
- ✅ Role-based dashboards (Student, Mentor, Founder)
- ✅ Mentor session management
- ✅ Video conferencing (Agora integration)
- ✅ Profile management
- ✅ Contact forms and lead capture
- ✅ API client utilities
- ✅ Error handling and validation

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Complete setup guide
- [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) - Architecture details
- [WORKFLOW_DOCUMENTATION.md](./WORKFLOW_DOCUMENTATION.md) - Workflow documentation

## 🛠️ Tech Stack

**Backend:**
- Express.js
- MongoDB (Mongoose)
- Clerk (Authentication)
- TypeScript

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Clerk (Authentication)
- Framer Motion

## 📝 Environment Variables

See `.env.example` files in both `backend/` and `frontend/` directories.

## 🤝 Contributing

This is a complete, production-ready implementation. All routes, controllers, and integrations are fully functional.

## 📄 License

ISC


