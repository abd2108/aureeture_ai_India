// Unified server entry point
import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/database';
import { PORT } from './config';

dotenv.config();

// Connect to MongoDB
connectDB().catch(console.error);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
