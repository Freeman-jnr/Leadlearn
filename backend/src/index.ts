import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import dashboardRoutes from './routes/dashboard.routes';
import courseRoutes from './routes/course.routes';
import notificationRoutes from './routes/notification.routes';
import liveClassRoutes from './routes/live-class.routes';
import messageRoutes from './routes/message.routes';
import marketplaceRoutes from './routes/marketplace.routes';
import assignmentRoutes from './routes/assignment.routes';
import reviewRoutes from './routes/review.routes';
import lessonRoutes from './routes/lesson.routes';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:4000')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10mb' }));

// Swagger setup
const swaggerPath = path.resolve(process.cwd(), 'swagger.json');
if (fs.existsSync(swaggerPath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Swagger UI loaded at /api-docs');
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/live-classes', liveClassRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/lessons', lessonRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
