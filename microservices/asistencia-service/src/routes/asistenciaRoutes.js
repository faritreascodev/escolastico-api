import express from 'express';
import {
    registrarAsistencia,
    getAsistencias,
    actualizarAsistencia,
    reporteAsistenciaPorFecha,
    calcularPorcentajeAsistencia
} from '../controllers/asistenciaController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Asistencia:
 *       type: object
 *       required:
 *         - estudiante
 *         - curso
 *         - matriculaDetalle
 *         - fecha
 *         - estado
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
 *         fecha:
 *           type: string
 *           format: date
 *           example: "2025-12-13"
 *         estado:
 *           type: string
 *           enum: [PRESENTE, AUSENTE, TARDANZA, JUSTIFICADO]
 *           default: PRESENTE
 *         horaEntrada:
 *           type: string
 *           example: "08:15"
 *         observaciones:
 *           type: string
 *         periodo:
 *           type: string
 *           example: 2025-I
 */

/**
 * @swagger
 * /asistencias:
 *   post:
 *     summary: Registrar asistencia
 *     tags: [Asistencias]
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
 *               - fecha
 *               - estado
 *               - periodo
 *             properties:
 *               estudiante:
 *                 type: string
 *               curso:
 *                 type: string
 *               matriculaDetalle:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *               estado:
 *                 type: string
 *                 enum: [PRESENTE, AUSENTE, TARDANZA, JUSTIFICADO]
 *               horaEntrada:
 *                 type: string
 *               observaciones:
 *                 type: string
 *               periodo:
 *                 type: string
 *           example:
 *             estudiante: "673b1234567890abcdef1234"
 *             curso: "673b5678901234abcdef5678"
 *             matriculaDetalle: "673c1234567890abcdef1234"
 *             fecha: "2025-12-13"
 *             estado: PRESENTE
 *             horaEntrada: "08:15"
 *             periodo: "2025-I"
 *     responses:
 *       201:
 *         description: Asistencia registrada exitosamente
 *       400:
 *         description: Error de validación o registro duplicado
 */
router.post('/', registrarAsistencia);

/**
 * @swagger
 * /asistencias:
 *   get:
 *     summary: Obtener asistencias con filtros
 *     tags: [Asistencias]
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
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por fecha específica
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [PRESENTE, AUSENTE, TARDANZA, JUSTIFICADO]
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
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
 *         description: Lista de asistencias
 */
router.get('/', getAsistencias);

/**
 * @swagger
 * /asistencias/{id}:
 *   put:
 *     summary: Actualizar registro de asistencia
 *     tags: [Asistencias]
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
 *               estado:
 *                 type: string
 *                 enum: [PRESENTE, AUSENTE, TARDANZA, JUSTIFICADO]
 *               horaEntrada:
 *                 type: string
 *               observaciones:
 *                 type: string
 *           example:
 *             estado: JUSTIFICADO
 *             observaciones: "Presentó certificado médico"
 *     responses:
 *       200:
 *         description: Asistencia actualizada
 *       404:
 *         description: Asistencia no encontrada
 */
router.put('/:id', actualizarAsistencia);

/**
 * @swagger
 * /asistencias/reporte-fecha:
 *   get:
 *     summary: Reporte de asistencia por fecha y curso
 *     tags: [Asistencias]
 *     parameters:
 *       - in: query
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: cursoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reporte con resumen de asistencias
 *       400:
 *         description: Faltan parámetros requeridos
 */
router.get('/reporte-fecha', reporteAsistenciaPorFecha);

/**
 * @swagger
 * /asistencias/porcentaje:
 *   get:
 *     summary: Calcular porcentaje de asistencia de un estudiante
 *     tags: [Asistencias]
 *     parameters:
 *       - in: query
 *         name: estudianteId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: cursoId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Porcentaje de asistencia calculado
 *       400:
 *         description: Faltan parámetros requeridos
 */
router.get('/porcentaje', calcularPorcentajeAsistencia);

export default router;
