import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import { initializeDatabase } from './database';

// Load environment variables from .env file, overriding system variables
dotenv.config({ override: true });

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
  
  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  OpenAI API key not found. Related ideas feature will be disabled.');
    console.log('   Set OPENAI_API_KEY environment variable to enable semantic search.');
  } else {
    console.log('✅ OpenAI API key configured. Related ideas feature enabled.');
  }
});
