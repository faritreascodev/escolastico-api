db = db.getSiblingDB('escolastico_db');

db.createCollection('estudiantes');
db.createCollection('profesores');
db.createCollection('cursos');
db.createCollection('matriculas');
db.createCollection('matriculadetalles');
db.createCollection('calificaciones');
db.createCollection('asistencias');

print('Base de datos y colecciones inicializadas');
