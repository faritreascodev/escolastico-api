import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Asistencia from './models/Asistencia.js';

dotenv.config();

// const MONGODB_URI = process.env.MONGODB_URI_SEED || 'mongodb://localhost:27021/escolastico_asistencia_db';
const MONGODB_URI = process.env.MONGODB_URI_SEED || 'mongodb://localhost:27020/escolastico_calificaciones_db';
const MATRICULAS_URI = process.env.MATRICULAS_URI_SEED || 'mongodb://localhost:27019/escolastico_matriculas_db';

const PERIODO = '2025-I';

const runSeed = async () => {
    try {
        console.log(`[seed-asistencias] Conectando a MongoDB asistencias: ${MONGODB_URI}`);
        await mongoose.connect(MONGODB_URI);

        console.log('[seed-asistencias] Limpiando colección asistencias...');
        await Asistencia.deleteMany({});

        console.log(`[seed-asistencias] Conectando a MongoDB matrículas: ${MATRICULAS_URI}`);
        const matriculasConn = await mongoose.createConnection(MATRICULAS_URI).asPromise();

        const Matricula = matriculasConn.model('Matricula', new mongoose.Schema({}, { strict: false }), 'matriculas');
        const MatriculaDetalle = matriculasConn.model('MatriculaDetalle', new mongoose.Schema({}, { strict: false }), 'matriculadetalles');

        const matriculas = await Matricula.find().limit(20);
        if (!matriculas.length) {
            console.log('[seed-asistencias] No hay matrículas en la BD. Ejecuta primero el seed de matrículas.');
            await matriculasConn.close();
            await mongoose.connection.close();
            process.exit(0);
        }

        const asistencias = [];
        const estadosPosibles = ['PRESENTE', 'PRESENTE', 'PRESENTE', 'PRESENTE', 'AUSENTE', 'TARDANZA'];

        for (const matricula of matriculas) {
            const detalles = await MatriculaDetalle.find({ matricula: matricula._id });

            for (const det of detalles) {
                for (let i = 0; i < 10; i++) {
                    const fecha = new Date();
                    fecha.setDate(fecha.getDate() - i);
                    fecha.setHours(0, 0, 0, 0);

                    const estado = estadosPosibles[Math.floor(Math.random() * estadosPosibles.length)];

                    const asistencia = await Asistencia.create({
                        estudiante: matricula.estudiante,
                        curso: det.curso,
                        matriculaDetalle: det._id,
                        fecha,
                        estado,
                        horaEntrada: estado === 'PRESENTE' ? '08:05' : undefined,
                        periodo: PERIODO,
                        observaciones: estado === 'AUSENTE' ? 'Falta injustificada' : undefined
                    });

                    asistencias.push(asistencia);
                }
            }
        }

        console.log('==============================================');
        console.log('[seed-asistencias] SEED COMPLETADO');
        console.log(`Asistencias creadas: ${asistencias.length}`);
        console.log('==============================================');

        await matriculasConn.close();
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('[seed-asistencias] Error en seed:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

runSeed();
