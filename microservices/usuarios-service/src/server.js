import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import connectDB from './config/db.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import estudianteRoutes from './routes/estudianteRoutes.js';
import profesorRoutes from './routes/profesorRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Usuarios Service API',
            version: '1.0.0',
            description: 'Microservicio de gestión de estudiantes y profesores'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5001}`,
                description: 'Servidor local'
            }
        ]
    },
    apis: ['./src/routes/*.js', './src/models/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.get('/health', (req, res) => {
    res.json({
        service: 'usuarios-service',
        status: 'UP',
        timestamp: new Date().toISOString()
    });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/estudiantes', estudianteRoutes);
app.use('/profesores', profesorRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
    console.log(`[usuarios-service] Servidor corriendo en puerto ${PORT}`);
    console.log(`[usuarios-service] Documentación disponible en http://localhost:${PORT}/api-docs`);
});

process.on('unhandledRejection', (err) => {
    console.error('[usuarios-service] Error no manejado:', err);
    server.close(() => process.exit(1));
});

export default app;
