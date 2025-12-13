import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import connectDB from './config/db.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import matriculaRoutes from './routes/matriculaRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Matriculas Service API',
            version: '1.0.0',
            description: 'Microservicio de gestión de matrículas'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5003}`,
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
        service: 'matriculas-service',
        status: 'UP',
        timestamp: new Date().toISOString()
    });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/matriculas', matriculaRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5003;
const server = app.listen(PORT, () => {
    console.log(`[matriculas-service] Servidor corriendo en puerto ${PORT}`);
    console.log(`[matriculas-service] Documentación disponible en http://localhost:${PORT}/api-docs`);
});

process.on('unhandledRejection', (err) => {
    console.error('[matriculas-service] Error no manejado:', err);
    server.close(() => process.exit(1));
});

export default app;
