import express from 'express';
import {
  crearCalificacion,
  getCalificaciones,
  actualizarCalificacion,
  getPromedioEstudiante
} from '../controllers/calificacionController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Calificacion:
 *       type: object
 *       required:
 *         - estudiante
 *         - curso
 *         - matriculaDetalle
 *         - periodo
 *       properties:
 *         _id:
 *           type: string
 *         estudiante:
 *           type: string
 *           description: ID del estudiante
 *         curso:
 *           type: string
 *           description: ID del curso
 *         matriculaDetalle:
 *           type: string
 *           description: ID del detalle de matrícula
 *         periodo:
 *           type: string
 *           example: 2025-I
 *         parcial1:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 85
 *         parcial2:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 90
 *         examenFinal:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 88
 *         notaFinal:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Calculada automáticamente (30% + 30% + 40%)
 *           example: 87
 *         estado:
 *           type: string
 *           enum: [PENDIENTE, APROBADO, REPROBADO]
 *           description: Calculado automáticamente (>=70 APROBADO)
 *         observaciones:
 *           type: string
 */

/**
 * @swagger
 * /api/calificaciones:
 *   post:
 *     summary: Crear/registrar calificación
 *     tags: [Calificaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estudiante
 *               - curso
 *               - matriculaDetalle
 *               - periodo
 *             properties:
 *               estudiante:
 *                 type: string
 *               curso:
 *                 type: string
 *               matriculaDetalle:
 *                 type: string
 *               periodo:
 *                 type: string
 *               parcial1:
 *                 type: number
 *               parcial2:
 *                 type: number
 *               examenFinal:
 *                 type: number
 *               observaciones:
 *                 type: string
 *           example:
 *             estudiante: "673b1234567890abcdef1234"
 *             curso: "673b5678901234abcdef5678"
 *             matriculaDetalle: "673c1234567890abcdef1234"
 *             periodo: "2025-I"
 *             parcial1: 85
 *             parcial2: 90
 *             examenFinal: 88
 *     responses:
 *       201:
 *         description: Calificación registrada exitosamente
 *       400:
 *         description: Error de validación o registro duplicado
 */
router.post('/', crearCalificacion);

/**
 * @swagger
 * /api/calificaciones:
 *   get:
 *     summary: Obtener todas las calificaciones
 *     tags: [Calificaciones]
 *     parameters:
 *       - in: query
 *         name: estudiante
 *         schema:
 *           type: string
 *         description: Filtrar por ID de estudiante
 *       - in: query
 *         name: curso
 *         schema:
 *           type: string
 *         description: Filtrar por ID de curso
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *         description: Filtrar por período
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
 *         description: Lista de calificaciones
 */
router.get('/', getCalificaciones);

/**
 * @swagger
 * /api/calificaciones/{id}:
 *   put:
 *     summary: Actualizar calificación
 *     tags: [Calificaciones]
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
 *             properties:
 *               parcial1:
 *                 type: number
 *               parcial2:
 *                 type: number
 *               examenFinal:
 *                 type: number
 *               observaciones:
 *                 type: string
 *           example:
 *             parcial1: 90
 *             parcial2: 95
 *             examenFinal: 92
 *     responses:
 *       200:
 *         description: Calificación actualizada (nota final recalculada)
 *       404:
 *         description: Calificación no encontrada
 */
router.put('/:id', actualizarCalificacion);

/**
 * @swagger
 * /api/calificaciones/promedio:
 *   get:
 *     summary: Obtener promedio de un estudiante en un período
 *     tags: [Calificaciones]
 *     parameters:
 *       - in: query
 *         name: estudianteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante
 *       - in: query
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *         description: Período académico
 *     responses:
 *       200:
 *         description: Promedio calculado del estudiante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estudianteId:
 *                   type: string
 *                 periodo:
 *                   type: string
 *                 promedio:
 *                   type: number
 *                 totalCursos:
 *                   type: integer
 *                 calificaciones:
 *                   type: array
 *       400:
 *         description: Faltan parámetros requeridos
 */
router.get('/promedio', getPromedioEstudiante);

export default router;
