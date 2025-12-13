import express from 'express';
import {
  crearMatriculaCompleta,
  getMatriculas,
  getMatriculaPorId,
  actualizarEstadoMatricula,
  eliminarMatricula,
  getEstadisticasMatricula
} from '../controllers/matriculaController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Matricula:
 *       type: object
 *       required:
 *         - estudiante
 *         - periodoAcademico
 *         - cursos
 *       properties:
 *         _id:
 *           type: string
 *         numeroMatricula:
 *           type: string
 *           example: MAT-2025-000001
 *         estudiante:
 *           type: string
 *           description: ID del estudiante
 *         periodoAcademico:
 *           type: string
 *           enum: [2025-I, 2025-II, 2026-I, 2026-II]
 *           example: 2025-I
 *         fechaMatricula:
 *           type: string
 *           format: date
 *         estado:
 *           type: string
 *           enum: [ACTIVA, SUSPENDIDA, CANCELADA, FINALIZADA]
 *           default: ACTIVA
 *         totalCreditos:
 *           type: number
 *           example: 12
 *         costoTotal:
 *           type: number
 *           example: 500
 *         observaciones:
 *           type: string
 *     MatriculaDetalle:
 *       type: object
 *       properties:
 *         cursoId:
 *           type: string
 *           description: ID del curso
 *         profesorId:
 *           type: string
 *           description: ID del profesor
 *         costo:
 *           type: number
 *           example: 150
 *         horario:
 *           type: object
 *           properties:
 *             dias:
 *               type: array
 *               items:
 *                 type: string
 *                 enum: [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado]
 *               example: ["Lunes", "Miércoles", "Viernes"]
 *             horaInicio:
 *               type: string
 *               example: "08:00"
 *             horaFin:
 *               type: string
 *               example: "09:30"
 */

/**
 * @swagger
 * /api/matriculas:
 *   post:
 *     summary: Crear matrícula completa (maestro-detalle con transacción)
 *     tags: [Matriculas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estudiante
 *               - periodoAcademico
 *               - cursos
 *             properties:
 *               estudiante:
 *                 type: string
 *                 description: ID del estudiante
 *               periodoAcademico:
 *                 type: string
 *                 enum: [2025-I, 2025-II, 2026-I, 2026-II]
 *               observaciones:
 *                 type: string
 *               cursos:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/MatriculaDetalle'
 *           example:
 *             estudiante: "673b1234567890abcdef1234"
 *             periodoAcademico: "2025-I"
 *             observaciones: "Matrícula regular"
 *             cursos:
 *               - cursoId: "673b5678901234abcdef5678"
 *                 profesorId: "673b9012345678abcdef9012"
 *                 costo: 150
 *                 horario:
 *                   dias: ["Lunes", "Miércoles", "Viernes"]
 *                   horaInicio: "08:00"
 *                   horaFin: "09:30"
 *     responses:
 *       201:
 *         description: Matrícula creada exitosamente
 *       400:
 *         description: Error de validación o datos incorrectos
 */
router.post('/', crearMatriculaCompleta);

/**
 * @swagger
 * /api/matriculas:
 *   get:
 *     summary: Obtener todas las matrículas
 *     tags: [Matriculas]
 *     parameters:
 *       - in: query
 *         name: estudiante
 *         schema:
 *           type: string
 *         description: Filtrar por ID de estudiante
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *         description: Filtrar por período académico
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [ACTIVA, SUSPENDIDA, CANCELADA, FINALIZADA]
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
 *         description: Lista de matrículas
 */
router.get('/', getMatriculas);

/**
 * @swagger
 * /api/matriculas/{id}:
 *   get:
 *     summary: Obtener matrícula por ID con detalles completos
 *     tags: [Matriculas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matrícula encontrada con todos sus detalles
 *       404:
 *         description: Matrícula no encontrada
 */
router.get('/:id', getMatriculaPorId);

/**
 * @swagger
 * /api/matriculas/{id}/estado:
 *   patch:
 *     summary: Actualizar estado de matrícula
 *     tags: [Matriculas]
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
 *                 enum: [ACTIVA, SUSPENDIDA, CANCELADA, FINALIZADA]
 *           example:
 *             estado: FINALIZADA
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       400:
 *         description: Estado inválido
 *       404:
 *         description: Matrícula no encontrada
 */
router.patch('/:id/estado', actualizarEstadoMatricula);

/**
 * @swagger
 * /api/matriculas/{id}:
 *   delete:
 *     summary: Eliminar matrícula y sus detalles (cascada con transacción)
 *     tags: [Matriculas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matrícula eliminada
 *       404:
 *         description: Matrícula no encontrada
 */
router.delete('/:id', eliminarMatricula);

/**
 * @swagger
 * /api/matriculas/{id}/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de una matrícula
 *     tags: [Matriculas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estadísticas de la matrícula
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCursos:
 *                   type: integer
 *                 cursosInscritos:
 *                   type: integer
 *                 cursosRetirados:
 *                   type: integer
 *                 totalCreditos:
 *                   type: number
 *                 costoTotal:
 *                   type: number
 *                 porArea:
 *                   type: object
 */
router.get('/:id/estadisticas', getEstadisticasMatricula);

export default router;
