import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const CALIF_URI = process.env.MONGODB_URI_SEED || 'mongodb://localhost:27020/escolastico_calificaciones_db';
const MATRICULAS_URI = process.env.MATRICULAS_URI_SEED || 'mongodb://localhost:27019/escolastico_matriculas_db';

const PERIODO = '2025-I';

const runSeed = async () => {
    let matriculasConn;
    try {
        console.log(`[seed-calificaciones] Conectando a MongoDB calificaciones: ${CALIF_URI}`);
        await mongoose.connect(CALIF_URI);

        const Calificacion = mongoose.model(
            'CalificacionSeed',
            new mongoose.Schema(
                {
                    estudiante: mongoose.Schema.Types.ObjectId,
                    curso: mongoose.Schema.Types.ObjectId,
                    matriculaDetalle: mongoose.Schema.Types.ObjectId,
                    periodo: String,
                    parcial1: Number,
                    parcial2: Number,
                    examenFinal: Number
                },
                { timestamps: true }
            ),
            'calificacions' // pvto nombre, califaciones no vaaaa
        );
        // ===================================

        console.log('[seed-calificaciones] Limpiando colección calificaciones...');
        await Calificacion.deleteMany({});

        console.log(`[seed-calificaciones] Conectando a MongoDB matrículas: ${MATRICULAS_URI}`);
        matriculasConn = await mongoose.createConnection(MATRICULAS_URI).asPromise();

        const Matricula = matriculasConn.model(
            'MatriculaSeed',
            new mongoose.Schema({}, { strict: false }),
            'matriculas'
        );
        const MatriculaDetalle = matriculasConn.model(
            'MatriculaDetalleSeed',
            new mongoose.Schema({}, { strict: false }),
            'matriculadetalles'
        );

        const matriculas = await Matricula.find().limit(20);
        console.log(`[seed-calificaciones] Matrículas encontradas: ${matriculas.length}`);

        if (!matriculas.length) {
            console.log('[seed-calificaciones] No hay matrículas en la BD. Ejecuta primero el seed de matrículas.');
            return;
        }

        const calificaciones = [];

        for (const matricula of matriculas) {
            const detalles = await MatriculaDetalle.find({ matricula: matricula._id });
            console.log(`[seed-calificaciones] Matrícula ${matricula.numeroMatricula} - detalles: ${detalles.length}`);

            for (const det of detalles) {
                const parcial1 = Math.floor(Math.random() * 21) + 60; // 60–80
                const parcial2 = Math.floor(Math.random() * 21) + 60;
                const examenFinal = Math.floor(Math.random() * 21) + 60;

                const calificacion = await Calificacion.create({
                    estudiante: matricula.estudiante,
                    curso: det.curso,
                    matriculaDetalle: det._id,
                    periodo: PERIODO,
                    parcial1,
                    parcial2,
                    examenFinal
                });

                calificaciones.push(calificacion);
            }
        }

        console.log('==============================================');
        console.log('[seed-calificaciones] SEED COMPLETADO');
        console.log(`Calificaciones creadas: ${calificaciones.length}`);
        console.log('==============================================');
    } catch (error) {
        console.error('[seed-calificaciones] Error en seed:', error);
    } finally {
        if (matriculasConn) await matriculasConn.close();
        await mongoose.connection.close();
        process.exit(0);
    }
};

runSeed();
