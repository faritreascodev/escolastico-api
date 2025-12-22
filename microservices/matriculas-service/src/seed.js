import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Matricula from './models/Matricula.js';
import MatriculaDetalle from './models/MatriculaDetalle.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI_SEED || 'mongodb://localhost:27019/escolastico_matriculas_db';

const PERIODO = '2025-I';
const COSTO_POR_CURSO = 150;

// Pequeños mocks locales de IDs de estudiantes, profesores y cursos
const estudiantesMock = Array.from({ length: 10 }).map((_, i) => ({
  _id: new mongoose.Types.ObjectId(),
  nombre: `Estudiante ${i + 1}`
}));

const profesoresMock = Array.from({ length: 5 }).map((_, i) => ({
  _id: new mongoose.Types.ObjectId(),
  nombre: `Profesor ${i + 1}`
}));

const cursosMock = [
  { _id: new mongoose.Types.ObjectId(), nombre: 'Matemáticas Básicas I', creditos: 4 },
  { _id: new mongoose.Types.ObjectId(), nombre: 'Lengua y Literatura I', creditos: 4 },
  { _id: new mongoose.Types.ObjectId(), nombre: 'Ciencias Naturales I', creditos: 3 },
  { _id: new mongoose.Types.ObjectId(), nombre: 'Ciencias Sociales I', creditos: 3 },
  { _id: new mongoose.Types.ObjectId(), nombre: 'Inglés Básico I', creditos: 3 }
];

const runSeed = async () => {
  try {
    console.log(`[seed-matriculas] Conectando a MongoDB: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);

    console.log('[seed-matriculas] Limpiando colecciones...');
    await Matricula.deleteMany({});
    await MatriculaDetalle.deleteMany({});

    const matriculas = [];
    const detalles = [];

    for (const estudiante of estudiantesMock) {
      const totalCreditos = cursosMock.reduce((sum, c) => sum + c.creditos, 0);
      const costoTotal = cursosMock.length * COSTO_POR_CURSO;

      const matricula = await Matricula.create({
        estudiante: estudiante._id,        // aquí solo guardas el ObjectId
        periodoAcademico: PERIODO,
        totalCreditos,
        costoTotal,
        observaciones: `Matrícula generada para el período ${PERIODO}`,
        estado: 'ACTIVA'
      });

      matriculas.push(matricula);

      for (const curso of cursosMock) {
        const profesor = profesoresMock[Math.floor(Math.random() * profesoresMock.length)];

        const detalle = await MatriculaDetalle.create({
          matricula: matricula._id,
          curso: curso._id,
          profesor: profesor._id,
          creditos: curso.creditos,
          costo: COSTO_POR_CURSO,
          horario: {
            dias: ['Lunes', 'Miércoles', 'Viernes'],
            horaInicio: '08:00',
            horaFin: '09:30'
          }
        });

        detalles.push(detalle);
      }
    }

    console.log('==============================================');
    console.log('[seed-matriculas] SEED COMPLETADO');
    console.log(`Matrículas creadas:        ${matriculas.length}`);
    console.log(`Detalles de matrícula:     ${detalles.length}`);
    console.log('==============================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[seed-matriculas] Error en seed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

runSeed();
