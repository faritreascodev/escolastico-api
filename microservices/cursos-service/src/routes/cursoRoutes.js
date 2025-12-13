import express from 'express';
import {
    getCursos,
    getCursoPorId,
    crearCurso,
    actualizarCurso,
    eliminarCurso,
    getCursosPorGrado
} from '../controllers/cursoController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Curso:
 *       type: object
 *       required:
 *         - nombre
 *         - creditos
 *         - horasSemana
 *         - grado
 *         - area
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado del curso
 *         codigo:
 *           type: string
 *           description: Código único del curso (ej. MAT-001)
 *         nombre:
 *           type: string
 *           example: Matemáticas Básicas
 *         descripcion:
 *           type: string
 *           example: Introducción a las matemáticas para primer grado
 *         creditos:
 *           type: integer
 *           minimum: 1
 *           maximum: 6
 *           example: 4
 *         horasSemana:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *           example: 5
 *         grado:
 *           type: string
 *           enum: [1ro, 2do, 3ro, 4to, 5to, 6to]
 *           example: 1ro
 *         area:
 *           type: string
 *           enum: [Matemáticas, Lengua, Ciencias Naturales, Ciencias Sociales, Inglés, Arte, Educación Física, Tecnología]
 *           example: Matemáticas
 *         prerequisitos:
 *           type: array
 *           items:
 *             type: string
 *           description: Array de IDs de cursos prerequisitos
 *         estado:
 *           type: string
 *           enum: [ACTIVO, INACTIVO]
 *           default: ACTIVO
 */

/**
 * @swagger
 * /cursos:
 *   get:
 *     summary: Obtener todos los cursos
 *     tags: [Cursos]
 *     parameters:
 *       - in: query
 *         name: grado
 *         schema:
 *           type: string
 *           enum: [1ro, 2do, 3ro, 4to, 5to, 6to]
 *         description: Filtrar por grado
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *         description: Filtrar por área
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [ACTIVO, INACTIVO]
 *         description: Filtrar por estado
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de cursos
 */
router.get('/', getCursos);

/**
 * @swagger
 * /cursos/{id}:
 *   get:
 *     summary: Obtener curso por ID
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Curso encontrado
 *       404:
 *         description: Curso no encontrado
 */
router.get('/:id', getCursoPorId);

/**
 * @swagger
 * /cursos:
 *   post:
 *     summary: Crear nuevo curso
 *     tags: [Cursos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - creditos
 *               - horasSemana
 *               - grado
 *               - area
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               creditos:
 *                 type: integer
 *               horasSemana:
 *                 type: integer
 *               grado:
 *                 type: string
 *               area:
 *                 type: string
 *               prerequisitos:
 *                 type: array
 *                 items:
 *                   type: string
 *           example:
 *             nombre: Matemáticas Básicas
 *             descripcion: Introducción a las matemáticas
 *             creditos: 4
 *             horasSemana: 5
 *             grado: 1ro
 *             area: Matemáticas
 *     responses:
 *       201:
 *         description: Curso creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/', crearCurso);

/**
 * @swagger
 * /cursos/{id}:
 *   put:
 *     summary: Actualizar curso
 *     tags: [Cursos]
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
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       200:
 *         description: Curso actualizado
 *       404:
 *         description: Curso no encontrado
 */
router.put('/:id', actualizarCurso);

/**
 * @swagger
 * /cursos/{id}:
 *   delete:
 *     summary: Eliminar curso (soft delete)
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Curso eliminado
 *       404:
 *         description: Curso no encontrado
 */
router.delete('/:id', eliminarCurso);

/**
 * @swagger
 * /cursos/grado/{grado}:
 *   get:
 *     summary: Obtener cursos disponibles por grado
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: grado
 *         required: true
 *         schema:
 *           type: string
 *           enum: [1ro, 2do, 3ro, 4to, 5to, 6to]
 *     responses:
 *       200:
 *         description: Lista de cursos del grado
 */
router.get('/grado/:grado', getCursosPorGrado);

export default router;
