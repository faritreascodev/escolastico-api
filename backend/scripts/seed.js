import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Estudiante from '../models/Estudiante.js';
import Profesor from '../models/Profesor.js';
import Curso from '../models/Curso.js';
import Matricula from '../models/Matricula.js';
import MatriculaDetalle from '../models/MatriculaDetalle.js';
import Calificacion from '../models/Calificacion.js';
import Asistencia from '../models/Asistencia.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

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

const seedDatabase = async () => {
  try {
    console.log('Limpiando base de datos...');
    await Estudiante.deleteMany({});
    await Profesor.deleteMany({});
    await Curso.deleteMany({});
    await Matricula.deleteMany({});
    await MatriculaDetalle.deleteMany({});
    await Calificacion.deleteMany({});
    await Asistencia.deleteMany({});

    console.log('Creando estudiantes...');
    const estudiantes = await Estudiante.insertMany(estudiantesData);
    console.log(`${estudiantes.length} estudiantes creados`);

    console.log('Creando profesores...');
    const profesores = await Profesor.insertMany(profesoresData);
    console.log(`${profesores.length} profesores creados`);

    console.log('Creando cursos...');
    const cursos = await Curso.insertMany(cursosData);
    console.log(`${cursos.length} cursos creados`);

    console.log('Creando matrículas con relaciones...');
    const matriculas = [];
    const detalles = [];
    const calificaciones = [];
    const asistencias = [];

    // Crear matrículas para los primeros 20 estudiantes
    for (let i = 0; i < 20; i++) {
      const estudiante = estudiantes[i];
      const cursosDelGrado = cursos.filter(c => c.grado === estudiante.grado);
      
      const matricula = await Matricula.create({
        estudiante: estudiante._id,
        periodoAcademico: '2025-I',
        totalCreditos: cursosDelGrado.reduce((sum, c) => sum + c.creditos, 0),
        costoTotal: cursosDelGrado.length * 150,
        observaciones: `Matrícula período 2025-I`
      });
      matriculas.push(matricula);

      // Crear detalles de matrícula
      for (const curso of cursosDelGrado) {
        const profesor = profesores.find(p => p.especialidad.includes(curso.area)) || profesores[0];
        
        const detalle = await MatriculaDetalle.create({
          matricula: matricula._id,
          curso: curso._id,
          profesor: profesor._id,
          creditos: curso.creditos,
          costo: 150,
          horario: {
            dias: ['Lunes', 'Miércoles', 'Viernes'],
            horaInicio: '08:00',
            horaFin: '09:30'
          }
        });
        detalles.push(detalle);

        // Crear calificaciones
        const parcial1 = Math.floor(Math.random() * 30) + 70;
        const parcial2 = Math.floor(Math.random() * 30) + 70;
        const examenFinal = Math.floor(Math.random() * 30) + 70;
        
        const calificacion = await Calificacion.create({
          estudiante: estudiante._id,
          curso: curso._id,
          matriculaDetalle: detalle._id,
          periodo: '2025-I',
          parcial1,
          parcial2,
          examenFinal
        });
        calificaciones.push(calificacion);

        // Crear asistencias (últimos 10 días)
        for (let dia = 0; dia < 10; dia++) {
          const fecha = new Date();
          fecha.setDate(fecha.getDate() - dia);
          fecha.setHours(0, 0, 0, 0);
          
          const estados = ['PRESENTE', 'PRESENTE', 'PRESENTE', 'PRESENTE', 'AUSENTE', 'TARDANZA'];
          const estado = estados[Math.floor(Math.random() * estados.length)];
          
          const asistencia = await Asistencia.create({
            estudiante: estudiante._id,
            curso: curso._id,
            matriculaDetalle: detalle._id,
            fecha,
            estado,
            horaEntrada: estado === 'PRESENTE' ? '08:05' : undefined,
            periodo: '2025-I'
          });
          asistencias.push(asistencia);
        }
      }
    }

    console.log(`✓ ${matriculas.length} matrículas creadas`);
    console.log(`✓ ${detalles.length} detalles de matrícula creados`);
    console.log(`✓ ${calificaciones.length} calificaciones creadas`);
    console.log(`✓ ${asistencias.length} registros de asistencia creados`);

    console.log('\n==============================================');
    console.log('SEED COMPLETADO EXITOSAMENTE');
    console.log('==============================================');
    console.log(`Total de registros: ${estudiantes.length + profesores.length + cursos.length + matriculas.length + detalles.length + calificaciones.length + asistencias.length}`);
    console.log(`- Estudiantes: ${estudiantes.length}`);
    console.log(`- Profesores: ${profesores.length}`);
    console.log(`- Cursos: ${cursos.length}`);
    console.log(`- Matrículas: ${matriculas.length}`);
    console.log(`- Detalles matrícula: ${detalles.length}`);
    console.log(`- Calificaciones: ${calificaciones.length}`);
    console.log(`- Asistencias: ${asistencias.length}`);

  } catch (error) {
    console.error('Error en seed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Conexión cerrada');
    process.exit(0);
  }
};

connectDB().then(() => seedDatabase());
