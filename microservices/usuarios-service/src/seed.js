import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Estudiante from './models/Estudiante.js';
import Profesor from './models/Profesor.js';

dotenv.config();

// Mongo del contenedor está mapeado a 27017 en el host
const MONGODB_URI = process.env.MONGODB_URI_SEED || 'mongodb://localhost:27017/escolastico_usuarios_db';

// Datos de estudiantes (30) - AGREGAMOS MATRICULA
const estudiantesData = [
    { matricula: 'EST-000001', nombres: 'Juan Carlos', apellidos: 'Pérez García', email: 'juan.perez@escuela.com', telefono: '12345001', fechaNacimiento: '2010-03-15', grado: '1ro', seccion: 'A', genero: 'Masculino', nombreResponsable: 'María García', telefonoResponsable: '98765001', relacionResponsable: 'Madre' },
    { matricula: 'EST-000002', nombres: 'María José', apellidos: 'López Martínez', email: 'maria.lopez@escuela.com', telefono: '12345002', fechaNacimiento: '2010-05-22', grado: '1ro', seccion: 'A', genero: 'Femenino', nombreResponsable: 'Pedro López', telefonoResponsable: '98765002', relacionResponsable: 'Padre' },
    { matricula: 'EST-000003', nombres: 'Carlos Alberto', apellidos: 'Rodríguez Silva', email: 'carlos.rodriguez@escuela.com', telefono: '12345003', fechaNacimiento: '2010-07-10', grado: '1ro', seccion: 'B', genero: 'Masculino', nombreResponsable: 'Ana Silva', telefonoResponsable: '98765003', relacionResponsable: 'Madre' },
    { matricula: 'EST-000004', nombres: 'Ana Sofía', apellidos: 'González Torres', email: 'ana.gonzalez@escuela.com', telefono: '12345004', fechaNacimiento: '2010-02-18', grado: '1ro', seccion: 'B', genero: 'Femenino', nombreResponsable: 'Luis González', telefonoResponsable: '98765004', relacionResponsable: 'Padre' },
    { matricula: 'EST-000005', nombres: 'Luis Fernando', apellidos: 'Hernández Ruiz', email: 'luis.hernandez@escuela.com', telefono: '12345005', fechaNacimiento: '2009-11-25', grado: '2do', seccion: 'A', genero: 'Masculino', nombreResponsable: 'Carmen Ruiz', telefonoResponsable: '98765005', relacionResponsable: 'Madre' },
    { matricula: 'EST-000006', nombres: 'Carmen Elena', apellidos: 'Martínez Díaz', email: 'carmen.martinez@escuela.com', telefono: '12345006', fechaNacimiento: '2009-09-30', grado: '2do', seccion: 'A', genero: 'Femenino', nombreResponsable: 'José Martínez', telefonoResponsable: '98765006', relacionResponsable: 'Padre' },
    { matricula: 'EST-000007', nombres: 'Pedro Antonio', apellidos: 'Sánchez Morales', email: 'pedro.sanchez@escuela.com', telefono: '12345007', fechaNacimiento: '2009-06-14', grado: '2do', seccion: 'B', genero: 'Masculino', nombreResponsable: 'Laura Morales', telefonoResponsable: '98765007', relacionResponsable: 'Madre' },
    { matricula: 'EST-000008', nombres: 'Laura Patricia', apellidos: 'Ramírez Castro', email: 'laura.ramirez@escuela.com', telefono: '12345008', fechaNacimiento: '2009-04-08', grado: '2do', seccion: 'B', genero: 'Femenino', nombreResponsable: 'Roberto Ramírez', telefonoResponsable: '98765008', relacionResponsable: 'Padre' },
    { matricula: 'EST-000009', nombres: 'Roberto Miguel', apellidos: 'Flores Vargas', email: 'roberto.flores@escuela.com', telefono: '12345009', fechaNacimiento: '2008-12-20', grado: '3ro', seccion: 'A', genero: 'Masculino', nombreResponsable: 'Isabel Vargas', telefonoResponsable: '98765009', relacionResponsable: 'Madre' },
    { matricula: 'EST-000010', nombres: 'Isabel Cristina', apellidos: 'Torres Jiménez', email: 'isabel.torres@escuela.com', telefono: '12345010', fechaNacimiento: '2008-10-05', grado: '3ro', seccion: 'A', genero: 'Femenino', nombreResponsable: 'Manuel Torres', telefonoResponsable: '98765010', relacionResponsable: 'Padre' },
    { matricula: 'EST-000011', nombres: 'José Luis', apellidos: 'Moreno Ortiz', email: 'jose.moreno@escuela.com', telefono: '12345011', fechaNacimiento: '2008-08-17', grado: '3ro', seccion: 'B', genero: 'Masculino', nombreResponsable: 'Patricia Ortiz', telefonoResponsable: '98765011', relacionResponsable: 'Madre' },
    { matricula: 'EST-000012', nombres: 'Patricia Andrea', apellidos: 'Castro Romero', email: 'patricia.castro@escuela.com', telefono: '12345012', fechaNacimiento: '2008-03-22', grado: '3ro', seccion: 'B', genero: 'Femenino', nombreResponsable: 'Andrés Castro', telefonoResponsable: '98765012', relacionResponsable: 'Padre' },
    { matricula: 'EST-000013', nombres: 'Andrés Felipe', apellidos: 'Jiménez Rojas', email: 'andres.jimenez@escuela.com', telefono: '12345013', fechaNacimiento: '2007-11-11', grado: '4to', seccion: 'A', genero: 'Masculino', nombreResponsable: 'Diana Rojas', telefonoResponsable: '98765013', relacionResponsable: 'Madre' },
    { matricula: 'EST-000014', nombres: 'Diana Carolina', apellidos: 'Vargas Méndez', email: 'diana.vargas@escuela.com', telefono: '12345014', fechaNacimiento: '2007-09-28', grado: '4to', seccion: 'A', genero: 'Femenino', nombreResponsable: 'Fernando Vargas', telefonoResponsable: '98765014', relacionResponsable: 'Padre' },
    { matricula: 'EST-000015', nombres: 'Fernando José', apellidos: 'Ortiz Herrera', email: 'fernando.ortiz@escuela.com', telefono: '12345015', fechaNacimiento: '2007-07-19', grado: '4to', seccion: 'B', genero: 'Masculino', nombreResponsable: 'Mónica Herrera', telefonoResponsable: '98765015', relacionResponsable: 'Madre' },
    { matricula: 'EST-000016', nombres: 'Mónica Alejandra', apellidos: 'Rojas Fernández', email: 'monica.rojas@escuela.com', telefono: '12345016', fechaNacimiento: '2007-05-06', grado: '4to', seccion: 'B', genero: 'Femenino', nombreResponsable: 'Javier Rojas', telefonoResponsable: '98765016', relacionResponsable: 'Padre' },
    { matricula: 'EST-000017', nombres: 'Javier Eduardo', apellidos: 'Méndez Aguilar', email: 'javier.mendez@escuela.com', telefono: '12345017', fechaNacimiento: '2006-12-15', grado: '5to', seccion: 'A', genero: 'Masculino', nombreResponsable: 'Claudia Aguilar', telefonoResponsable: '98765017', relacionResponsable: 'Madre' },
    { matricula: 'EST-000018', nombres: 'Claudia Beatriz', apellidos: 'Herrera Delgado', email: 'claudia.herrera@escuela.com', telefono: '12345018', fechaNacimiento: '2006-10-24', grado: '5to', seccion: 'A', genero: 'Femenino', nombreResponsable: 'Ricardo Herrera', telefonoResponsable: '98765018', relacionResponsable: 'Padre' },
    { matricula: 'EST-000019', nombres: 'Ricardo Daniel', apellidos: 'Fernández Ramos', email: 'ricardo.fernandez@escuela.com', telefono: '12345019', fechaNacimiento: '2006-08-09', grado: '5to', seccion: 'B', genero: 'Masculino', nombreResponsable: 'Gabriela Ramos', telefonoResponsable: '98765019', relacionResponsable: 'Madre' },
    { matricula: 'EST-000020', nombres: 'Gabriela Nicole', apellidos: 'Aguilar Santos', email: 'gabriela.aguilar@escuela.com', telefono: '12345020', fechaNacimiento: '2006-06-03', grado: '5to', seccion: 'B', genero: 'Femenino', nombreResponsable: 'Miguel Aguilar', telefonoResponsable: '98765020', relacionResponsable: 'Padre' },
    { matricula: 'EST-000021', nombres: 'Miguel Ángel', apellidos: 'Delgado Guzmán', email: 'miguel.delgado@escuela.com', telefono: '12345021', fechaNacimiento: '2005-11-29', grado: '6to', seccion: 'A', genero: 'Masculino', nombreResponsable: 'Verónica Guzmán', telefonoResponsable: '98765021', relacionResponsable: 'Madre' },
    { matricula: 'EST-000022', nombres: 'Verónica Isabel', apellidos: 'Ramos Navarro', email: 'veronica.ramos@escuela.com', telefono: '12345022', fechaNacimiento: '2005-09-12', grado: '6to', seccion: 'A', genero: 'Femenino', nombreResponsable: 'Sergio Ramos', telefonoResponsable: '98765022', relacionResponsable: 'Padre' },
    { matricula: 'EST-000023', nombres: 'Sergio Alejandro', apellidos: 'Santos Cordero', email: 'sergio.santos@escuela.com', telefono: '12345023', fechaNacimiento: '2005-07-27', grado: '6to', seccion: 'B', genero: 'Masculino', nombreResponsable: 'Raquel Cordero', telefonoResponsable: '98765023', relacionResponsable: 'Madre' },
    { matricula: 'EST-000024', nombres: 'Raquel Fernanda', apellidos: 'Guzmán Peña', email: 'raquel.guzman@escuela.com', telefono: '12345024', fechaNacimiento: '2005-05-14', grado: '6to', seccion: 'B', genero: 'Femenino', nombreResponsable: 'Daniel Guzmán', telefonoResponsable: '98765024', relacionResponsable: 'Padre' },
    { matricula: 'EST-000025', nombres: 'Daniel Ernesto', apellidos: 'Navarro Campos', email: 'daniel.navarro@escuela.com', telefono: '12345025', fechaNacimiento: '2010-01-08', grado: '1ro', seccion: 'C', genero: 'Masculino', nombreResponsable: 'Lucía Campos', telefonoResponsable: '98765025', relacionResponsable: 'Madre' },
    { matricula: 'EST-000026', nombres: 'Lucía Valentina', apellidos: 'Cordero Vega', email: 'lucia.cordero@escuela.com', telefono: '12345026', fechaNacimiento: '2009-12-19', grado: '2do', seccion: 'C', genero: 'Femenino', nombreResponsable: 'Jorge Cordero', telefonoResponsable: '98765026', relacionResponsable: 'Padre' },
    { matricula: 'EST-000027', nombres: 'Jorge Alberto', apellidos: 'Peña Solís', email: 'jorge.pena@escuela.com', telefono: '12345027', fechaNacimiento: '2008-11-04', grado: '3ro', seccion: 'C', genero: 'Masculino', nombreResponsable: 'Silvia Solís', telefonoResponsable: '98765027', relacionResponsable: 'Madre' },
    { matricula: 'EST-000028', nombres: 'Silvia Mariana', apellidos: 'Campos Luna', email: 'silvia.campos@escuela.com', telefono: '12345028', fechaNacimiento: '2007-10-16', grado: '4to', seccion: 'C', genero: 'Femenino', nombreResponsable: 'Raúl Campos', telefonoResponsable: '98765028', relacionResponsable: 'Padre' },
    { matricula: 'EST-000029', nombres: 'Raúl Ignacio', apellidos: 'Vega Mora', email: 'raul.vega@escuela.com', telefono: '12345029', fechaNacimiento: '2006-09-21', grado: '5to', seccion: 'C', genero: 'Masculino', nombreResponsable: 'Teresa Mora', telefonoResponsable: '98765029', relacionResponsable: 'Madre' },
    { matricula: 'EST-000030', nombres: 'Teresa Guadalupe', apellidos: 'Solís Paredes', email: 'teresa.solis@escuela.com', telefono: '12345030', fechaNacimiento: '2005-08-07', grado: '6to', seccion: 'C', genero: 'Femenino', nombreResponsable: 'Héctor Solís', telefonoResponsable: '98765030', relacionResponsable: 'Padre' }
];

// Datos de profesores (15)
const profesoresData = [
    { codigoEmpleado: 'PROF-0001', nombres: 'María Elena', apellidos: 'Rodríguez Paz', email: 'mrodriguez@escuela.com', telefono: '55512001', especialidad: ['Matemáticas', 'Ciencias Naturales'], titulo: 'Licenciada en Matemáticas', salario: 3500 },
    { codigoEmpleado: 'PROF-0002', nombres: 'Carlos Andrés', apellidos: 'García López', email: 'cgarcia@escuela.com', telefono: '55512002', especialidad: ['Lengua', 'Literatura'], titulo: 'Licenciado en Letras', salario: 3200 },
    { codigoEmpleado: 'PROF-0003', nombres: 'Ana Lucía', apellidos: 'Martínez Flores', email: 'amartinez@escuela.com', telefono: '55512003', especialidad: ['Ciencias Naturales', 'Biología'], titulo: 'Licenciada en Biología', salario: 3300 },
    { codigoEmpleado: 'PROF-0004', nombres: 'Roberto Carlos', apellidos: 'Hernández Ruiz', email: 'rhernandez@escuela.com', telefono: '55512004', especialidad: ['Ciencias Sociales', 'Historia'], titulo: 'Licenciado en Historia', salario: 3100 },
    { codigoEmpleado: 'PROF-0005', nombres: 'Patricia Isabel', apellidos: 'González Méndez', email: 'pgonzalez@escuela.com', telefono: '55512005', especialidad: ['Inglés'], titulo: 'Licenciada en Idiomas', salario: 3400 },
    { codigoEmpleado: 'PROF-0006', nombres: 'Fernando José', apellidos: 'López Torres', email: 'flopez@escuela.com', telefono: '55512006', especialidad: ['Arte', 'Música'], titulo: 'Licenciado en Artes', salario: 2900 },
    { codigoEmpleado: 'PROF-0007', nombres: 'Claudia Andrea', apellidos: 'Sánchez Castro', email: 'csanchez@escuela.com', telefono: '55512007', especialidad: ['Educación Física'], titulo: 'Licenciada en Educación Física', salario: 2800 },
    { codigoEmpleado: 'PROF-0008', nombres: 'Miguel Antonio', apellidos: 'Ramírez Vargas', email: 'mramirez@escuela.com', telefono: '55512008', especialidad: ['Tecnología', 'Computación'], titulo: 'Ingeniero en Sistemas', salario: 3600 },
    { codigoEmpleado: 'PROF-0009', nombres: 'Laura Sofía', apellidos: 'Torres Jiménez', email: 'ltorres@escuela.com', telefono: '55512009', especialidad: ['Matemáticas'], titulo: 'Ingeniera Matemática', salario: 3400 },
    { codigoEmpleado: 'PROF-0010', nombres: 'Jorge Luis', apellidos: 'Flores Moreno', email: 'jflores@escuela.com', telefono: '55512010', especialidad: ['Lengua'], titulo: 'Licenciado en Comunicación', salario: 3000 },
    { codigoEmpleado: 'PROF-0011', nombres: 'Diana Carolina', apellidos: 'Castro Ortiz', email: 'dcastro@escuela.com', telefono: '55512011', especialidad: ['Ciencias Naturales'], titulo: 'Licenciada en Química', salario: 3200 },
    { codigoEmpleado: 'PROF-0012', nombres: 'Andrés Felipe', apellidos: 'Moreno Rojas', email: 'amoreno@escuela.com', telefono: '55512012', especialidad: ['Ciencias Sociales'], titulo: 'Licenciado en Sociología', salario: 3100 },
    { codigoEmpleado: 'PROF-0013', nombres: 'Mónica Alejandra', apellidos: 'Vargas Herrera', email: 'mvargas@escuela.com', telefono: '55512013', especialidad: ['Inglés'], titulo: 'Licenciada en Lenguas Extranjeras', salario: 3300 },
    { codigoEmpleado: 'PROF-0014', nombres: 'Ricardo Daniel', apellidos: 'Jiménez Delgado', email: 'rjimenez@escuela.com', telefono: '55512014', especialidad: ['Arte'], titulo: 'Licenciado en Diseño', salario: 2900 },
    { codigoEmpleado: 'PROF-0015', nombres: 'Gabriela Nicole', apellidos: 'Ortiz Fernández', email: 'gortiz@escuela.com', telefono: '55512015', especialidad: ['Educación Física'], titulo: 'Licenciada en Deporte', salario: 2800 }
];

const runSeed = async () => {
    try {
        console.log(`[seed-usuarios] Conectando a MongoDB: ${MONGODB_URI}`);
        await mongoose.connect(MONGODB_URI);

        console.log('[seed-usuarios] Limpiando colecciones...');
        await Estudiante.deleteMany({});
        await Profesor.deleteMany({});

        console.log('[seed-usuarios] Insertando estudiantes...');
        const estudiantes = await Estudiante.insertMany(estudiantesData);
        console.log(`✓ ${estudiantes.length} estudiantes creados`);

        console.log('[seed-usuarios] Insertando profesores...');
        const profesores = await Profesor.insertMany(profesoresData);
        console.log(`✓ ${profesores.length} profesores creados`);

        console.log('[seed-usuarios] SEED COMPLETADO');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('[seed-usuarios] Error en seed:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

runSeed();
