import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { testConnection } from './config/database.js';
import { createSocketServer } from './socket/socket.js';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import reelRoutes from './routes/reelRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api/health', async (_req, res) => {
  try {
    await testConnection();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

const server = createSocketServer(app);

const syncDatabase = async () => {
  try {
    await testConnection();
    await sequelize.sync({ alter: false });
    console.log('✅ Database synced');
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    process.exit(1);
  }
};

server.listen(PORT, async () => {
  await syncDatabase();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
