import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { connectDB } from '@/config/db';
import { env } from '@/config/env';
import { errorHandler } from '@/middleware/errorHandler';
import { tenantMiddleware } from '@/middleware/tenant';
import { auditLog } from '@/middleware/audit';
import routes from '@/routes';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
});

app.set('io', io);

app.use(helmet());
app.use(compression());
app.use(cors({ origin: env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

app.use(tenantMiddleware);
app.use(auditLog('api_request', 'api'));

app.use('/api/v1', routes);

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join:chat', (chatId: string) => {
    socket.join(`chat:${chatId}`);
  });

  socket.on('leave:chat', (chatId: string) => {
    socket.leave(`chat:${chatId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const startServer = async () => {
  await connectDB();

  httpServer.listen(env.PORT || 5000, () => {
    console.log(`Server running on port ${env.PORT || 5000}`);
    console.log(`Environment: ${env.NODE_ENV}`);
  });
};

startServer();

export { app, httpServer, io };
