import express from 'express';
import cors from 'cors';
import routes from './routes';
import { initializeDatabase } from './database';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase()
  .then(() => {
    console.log('✅ Database initialized');
  })
  .catch((error) => {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  });

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Idea Garden API is running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
});
