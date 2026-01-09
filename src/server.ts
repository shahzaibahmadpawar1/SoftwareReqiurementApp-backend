import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectsRouter from './routes/projects.routes';
import usersRouter from './routes/users.routes';
import pagesRouter from './routes/pages.routes';
import functionalitiesRouter from './routes/functionalities.routes';
import workflowsRouter from './routes/workflows.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS
const allowedOrigins = [
    'http://localhost:5173', // Local development
    process.env.FRONTEND_URL || '', // Production frontend
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/projects', projectsRouter);
app.use('/api/users', usersRouter);
app.use('/api/pages', pagesRouter);
app.use('/api/functionalities', functionalitiesRouter);
app.use('/api/workflows', workflowsRouter);

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Root route
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Software Requirements API',
        status: 'Running',
        documentation: '/api/docs' // Placeholder for future docs
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});

export default app;
