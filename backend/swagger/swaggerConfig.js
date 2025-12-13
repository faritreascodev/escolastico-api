import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Escolástica - Sistema de Gestión Escolar',
      version: '1.0.0',
      description: 'API REST para gestión de sistema escolástico con CRUD completo, búsquedas, filtros y operaciones maestro-detalle',
      contact: {
        name: 'Farit Reasco',
        email: 'areasco1306nnca@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de desarrollo'
      }
    ],
    tags: [
      { name: 'Estudiantes', description: 'Gestión de estudiantes' },
      { name: 'Profesores', description: 'Gestión de profesores' },
      { name: 'Cursos', description: 'Gestión de cursos' },
      { name: 'Matriculas', description: 'Gestión de matrículas (maestro-detalle)' },
      { name: 'Calificaciones', description: 'Gestión de calificaciones' },
      { name: 'Asistencias', description: 'Registro y control de asistencias' }
    ]
  },
  apis: ['./routes/*.js', './models/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
