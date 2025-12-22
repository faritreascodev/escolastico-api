import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Curso from './models/Curso.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI_SEED || 'mongodb://localhost:27018/escolastico_cursos_db';

// Datos de cursos (36)
const cursosData = [
    { codigo: 'MAT-001', nombre: 'Matemáticas Básicas I', descripcion: 'Fundamentos de aritmética', creditos: 4, horasSemana: 5, grado: '1ro', area: 'Matemáticas' },
    { codigo: 'LEN-001', nombre: 'Lengua y Literatura I', descripcion: 'Lectura y escritura básica', creditos: 4, horasSemana: 5, grado: '1ro', area: 'Lengua' },
    { codigo: 'CIN-001', nombre: 'Ciencias Naturales I', descripcion: 'Introducción a las ciencias', creditos: 3, horasSemana: 4, grado: '1ro', area: 'Ciencias Naturales' },
    { codigo: 'CIS-001', nombre: 'Ciencias Sociales I', descripcion: 'Historia y geografía básica', creditos: 3, horasSemana: 4, grado: '1ro', area: 'Ciencias Sociales' },
    { codigo: 'ING-001', nombre: 'Inglés Básico I', descripcion: 'Introducción al inglés', creditos: 3, horasSemana: 3, grado: '1ro', area: 'Inglés' },
    { codigo: 'ART-001', nombre: 'Arte y Cultura I', descripcion: 'Expresión artística', creditos: 2, horasSemana: 2, grado: '1ro', area: 'Arte' },
    { codigo: 'MAT-002', nombre: 'Matemáticas Básicas II', descripcion: 'Geometría y fracciones', creditos: 4, horasSemana: 5, grado: '2do', area: 'Matemáticas' },
    { codigo: 'LEN-002', nombre: 'Lengua y Literatura II', descripcion: 'Comprensión lectora', creditos: 4, horasSemana: 5, grado: '2do', area: 'Lengua' },
    { codigo: 'CIN-002', nombre: 'Ciencias Naturales II', descripcion: 'Cuerpo humano', creditos: 3, horasSemana: 4, grado: '2do', area: 'Ciencias Naturales' },
    { codigo: 'CIS-002', nombre: 'Ciencias Sociales II', descripcion: 'Comunidad y sociedad', creditos: 3, horasSemana: 4, grado: '2do', area: 'Ciencias Sociales' },
    { codigo: 'ING-002', nombre: 'Inglés Básico II', descripcion: 'Conversación básica', creditos: 3, horasSemana: 3, grado: '2do', area: 'Inglés' },
    { codigo: 'EDF-002', nombre: 'Educación Física II', descripcion: 'Deportes y salud', creditos: 2, horasSemana: 3, grado: '2do', area: 'Educación Física' },
    { codigo: 'MAT-003', nombre: 'Matemáticas Intermedia I', descripcion: 'Álgebra básica', creditos: 5, horasSemana: 6, grado: '3ro', area: 'Matemáticas' },
    { codigo: 'LEN-003', nombre: 'Lengua y Literatura III', descripcion: 'Redacción y ortografía', creditos: 4, horasSemana: 5, grado: '3ro', area: 'Lengua' },
    { codigo: 'CIN-003', nombre: 'Ciencias Naturales III', descripcion: 'Física y química básica', creditos: 4, horasSemana: 5, grado: '3ro', area: 'Ciencias Naturales' },
    { codigo: 'CIS-003', nombre: 'Ciencias Sociales III', descripcion: 'Historia nacional', creditos: 3, horasSemana: 4, grado: '3ro', area: 'Ciencias Sociales' },
    { codigo: 'ING-003', nombre: 'Inglés Intermedio I', descripcion: 'Gramática y vocabulario', creditos: 3, horasSemana: 4, grado: '3ro', area: 'Inglés' },
    { codigo: 'TEC-003', nombre: 'Tecnología I', descripcion: 'Introducción a la computación', creditos: 2, horasSemana: 3, grado: '3ro', area: 'Tecnología' },
    { codigo: 'MAT-004', nombre: 'Matemáticas Intermedia II', descripcion: 'Ecuaciones y funciones', creditos: 5, horasSemana: 6, grado: '4to', area: 'Matemáticas' },
    { codigo: 'LEN-004', nombre: 'Lengua y Literatura IV', descripcion: 'Análisis literario', creditos: 4, horasSemana: 5, grado: '4to', area: 'Lengua' },
    { codigo: 'CIN-004', nombre: 'Ciencias Naturales IV', descripcion: 'Biología celular', creditos: 4, horasSemana: 5, grado: '4to', area: 'Ciencias Naturales' },
    { codigo: 'CIS-004', nombre: 'Ciencias Sociales IV', descripcion: 'Geografía económica', creditos: 3, horasSemana: 4, grado: '4to', area: 'Ciencias Sociales' },
    { codigo: 'ING-004', nombre: 'Inglés Intermedio II', descripcion: 'Lectura y escritura', creditos: 3, horasSemana: 4, grado: '4to', area: 'Inglés' },
    { codigo: 'TEC-004', nombre: 'Tecnología II', descripcion: 'Programación básica', creditos: 3, horasSemana: 4, grado: '4to', area: 'Tecnología' },
    { codigo: 'MAT-005', nombre: 'Matemáticas Avanzada I', descripcion: 'Trigonometría', creditos: 5, horasSemana: 6, grado: '5to', area: 'Matemáticas' },
    { codigo: 'LEN-005', nombre: 'Lengua y Literatura V', descripcion: 'Literatura universal', creditos: 4, horasSemana: 5, grado: '5to', area: 'Lengua' },
    { codigo: 'FIS-005', nombre: 'Física I', descripcion: 'Mecánica clásica', creditos: 5, horasSemana: 6, grado: '5to', area: 'Ciencias Naturales' },
    { codigo: 'QUI-005', nombre: 'Química I', descripcion: 'Química general', creditos: 4, horasSemana: 5, grado: '5to', area: 'Ciencias Naturales' },
    { codigo: 'ING-005', nombre: 'Inglés Avanzado I', descripcion: 'Conversación fluida', creditos: 4, horasSemana: 4, grado: '5to', area: 'Inglés' },
    { codigo: 'TEC-005', nombre: 'Tecnología III', descripcion: 'Desarrollo web', creditos: 3, horasSemana: 4, grado: '5to', area: 'Tecnología' },
    { codigo: 'MAT-006', nombre: 'Matemáticas Avanzada II', descripcion: 'Cálculo diferencial', creditos: 6, horasSemana: 7, grado: '6to', area: 'Matemáticas' },
    { codigo: 'LEN-006', nombre: 'Lengua y Literatura VI', descripcion: 'Redacción académica', creditos: 4, horasSemana: 5, grado: '6to', area: 'Lengua' },
    { codigo: 'FIS-006', nombre: 'Física II', descripcion: 'Electromagnetismo', creditos: 5, horasSemana: 6, grado: '6to', area: 'Ciencias Naturales' },
    { codigo: 'QUI-006', nombre: 'Química II', descripcion: 'Química orgánica', creditos: 5, horasSemana: 6, grado: '6to', area: 'Ciencias Naturales' },
    { codigo: 'ING-006', nombre: 'Inglés Avanzado II', descripcion: 'Inglés técnico', creditos: 4, horasSemana: 4, grado: '6to', area: 'Inglés' },
    { codigo: 'TEC-006', nombre: 'Tecnología IV', descripcion: 'Bases de datos', creditos: 3, horasSemana: 4, grado: '6to', area: 'Tecnología' }
];

const runSeed = async () => {
    try {
        console.log(`[seed-cursos] Conectando a MongoDB: ${MONGODB_URI}`);
        await mongoose.connect(MONGODB_URI);

        console.log('[seed-cursos] Limpiando colección cursos...');
        await Curso.deleteMany({});

        console.log('[seed-cursos] Insertando cursos...');
        const cursos = await Curso.insertMany(cursosData);
        console.log(`✓ ${cursos.length} cursos creados`);

        console.log('[seed-cursos] SEED COMPLETADO');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('[seed-cursos] Error en seed:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

runSeed();
