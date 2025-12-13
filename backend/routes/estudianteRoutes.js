import express from 'express';
import {
  getEstudiantes,
  getEstudiantePorId,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
  getEstudiantesPorGradoSeccion,
  actualizarEstado
} from '../controllers/estudianteController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Estudiante:
 *       type: object
 *       required:
 *         - nombres
 *         - apellidos
 *         - email
 *         - fechaNacimiento
 *         - grado
 *         - seccion
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado del estudiante
 *         matricula:
 *           type: string
 *           description: Matrícula única del estudiante (ej. EST-000001)
 *         nombres:
 *           type: string
 *           example: Juan Carlos
 *         apellidos:
 *           type: string
 *           example: Pérez García
 *         email:
 *           type: string
 *           format: email
 *           example: juan.perez@example.com
 *         telefono:
 *           type: string
 *           example: "12345678"
 *         fechaNacimiento:
 *           type: string
 *           format: date
 *           example: "2010-05-15"
 *         direccion:
 *           type: object
 *           properties:
 *             calle:
 *               type: string
 *             ciudad:
 *               type: string
 *             departamento:
 *               type: string
 *             codigoPostal:
 *               type: string
 *         grado:
 *           type: string
 *           enum: [1ro, 2do, 3ro, 4to, 5to, 6to]
 *           example: 1ro
 *         seccion:
 *           type: string
 *           enum: [A, B, C, D]
 *           example: A
 *         genero:
 *           type: string
 *           enum: [Masculino, Femenino, Otro]
 *         estado:
 *           type: string
 *           enum: [ACTIVO, INACTIVO, SUSPENDIDO, EGRESADO]
 *           default: ACTIVO
 *         nombreResponsable:
 *           type: string
 *         telefonoResponsable:
 *           type: string
 *         relacionResponsable:
 *           type: string
 *           enum: [Padre, Madre, Tutor, Otro]
 */

/**
 * @swagger
 * /api/estudiantes:
 *   get:
 *     summary: Obtener todos los estudiantes con filtros y paginación
 *     tags: [Estudiantes]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Buscar por nombre o apellido
 *       - in: query
 *         name: grado
 *         schema:
 *           type: string
 *           enum: [1ro, 2do, 3ro, 4to, 5to, 6to]
 *         description: Filtrar por grado
 *       - in: query
 *         name: seccion
 *         schema:
 *           type: string
 *           enum: [A, B, C, D]
 *         description: Filtrar por sección
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [ACTIVO, INACTIVO, SUSPENDIDO, EGRESADO]
 *         description: Filtrar por estado
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Elementos por página
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: apellidos
 *         description: Campo por el cual ordenar
 *     responses:
 *       200:
 *         description: Lista de estudiantes con paginación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     estudiantes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Estudiante'
 *                     paginacion:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         pagina:
 *                           type: integer
 *                         limite:
 *                           type: integer
 *                         totalPaginas:
 *                           type: integer
 */
router.get('/', getEstudiantes);

/**
 * @swagger
 * /api/estudiantes/{id}:
 *   get:
 *     summary: Obtener estudiante por ID
 *     tags: [Estudiantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante
 *     responses:
 *       200:
 *         description: Estudiante encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Estudiante'
 *       404:
 *         description: Estudiante no encontrado
 *       400:
 *         description: ID inválido
 */
router.get('/:id', getEstudiantePorId);

/**
 * @swagger
 * /api/estudiantes:
 *   post:
 *     summary: Crear nuevo estudiante
 *     tags: [Estudiantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombres
 *               - apellidos
 *               - email
 *               - fechaNacimiento
 *               - grado
 *               - seccion
 *             properties:
 *               nombres:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *               direccion:
 *                 type: object
 *               grado:
 *                 type: string
 *               seccion:
 *                 type: string
 *               genero:
 *                 type: string
 *               nombreResponsable:
 *                 type: string
 *               telefonoResponsable:
 *                 type: string
 *               relacionResponsable:
 *                 type: string
 *           example:
 *             nombres: Juan Carlos
 *             apellidos: Pérez García
 *             email: juan.perez@example.com
 *             telefono: "12345678"
 *             fechaNacimiento: "2010-05-15"
 *             grado: 1ro
 *             seccion: A
 *             genero: Masculino
 *     responses:
 *       201:
 *         description: Estudiante creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/', crearEstudiante);

/**
 * @swagger
 * /api/estudiantes/{id}:
 *   put:
 *     summary: Actualizar estudiante
 *     tags: [Estudiantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estudiante'
 *     responses:
 *       200:
 *         description: Estudiante actualizado exitosamente
 *       404:
 *         description: Estudiante no encontrado
 *       400:
 *         description: Error de validación
 */
router.put('/:id', actualizarEstudiante);

/**
 * @swagger
 * /api/estudiantes/{id}:
 *   delete:
 *     summary: Eliminar estudiante (soft delete - cambia estado a INACTIVO)
 *     tags: [Estudiantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estudiante eliminado exitosamente
 *       404:
 *         description: Estudiante no encontrado
 */
router.delete('/:id', eliminarEstudiante);

/**
 * @swagger
 * /api/estudiantes/grado/{grado}/seccion/{seccion}:
 *   get:
 *     summary: Obtener estudiantes por grado y sección
 *     tags: [Estudiantes]
 *     parameters:
 *       - in: path
 *         name: grado
 *         required: true
 *         schema:
 *           type: string
 *           enum: [1ro, 2do, 3ro, 4to, 5to, 6to]
 *       - in: path
 *         name: seccion
 *         required: true
 *         schema:
 *           type: string
 *           enum: [A, B, C, D]
 *     responses:
 *       200:
 *         description: Lista de estudiantes del grado y sección especificados
 */
router.get('/grado/:grado/seccion/:seccion', getEstudiantesPorGradoSeccion);

/**
 * @swagger
 * /api/estudiantes/{id}/estado:
 *   patch:
 *     summary: Actualizar solo el estado del estudiante
 *     tags: [Estudiantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [ACTIVO, INACTIVO, SUSPENDIDO, EGRESADO]
 *           example:
 *             estado: EGRESADO
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *       400:
 *         description: Estado inválido
 *       404:
 *         description: Estudiante no encontrado
 */
router.patch('/:id/estado', actualizarEstado);

export default router;
