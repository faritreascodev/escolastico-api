import express from 'express';
import {
  getProfesores,
  getProfesorPorId,
  crearProfesor,
  actualizarProfesor,
  eliminarProfesor
} from '../controllers/profesorController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Profesor:
 *       type: object
 *       required:
 *         - nombres
 *         - apellidos
 *         - email
 *         - telefono
 *         - especialidad
 *         - titulo
 *         - salario
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado del profesor
 *         codigoEmpleado:
 *           type: string
 *           description: Código único del empleado (ej. PROF-0001)
 *         nombres:
 *           type: string
 *           example: María
 *         apellidos:
 *           type: string
 *           example: Rodríguez
 *         email:
 *           type: string
 *           format: email
 *           example: maria.rodriguez@school.com
 *         telefono:
 *           type: string
 *           example: "12345678"
 *         especialidad:
 *           type: array
 *           items:
 *             type: string
 *             enum: [Matemáticas, Lengua, Ciencias Naturales, Ciencias Sociales, Inglés, Arte, Educación Física, Tecnología]
 *           example: ["Matemáticas", "Física"]
 *         titulo:
 *           type: string
 *           example: Licenciada en Matemáticas
 *         fechaContratacion:
 *           type: string
 *           format: date
 *         salario:
 *           type: number
 *           example: 3000
 *         estado:
 *           type: string
 *           enum: [ACTIVO, INACTIVO, LICENCIA, VACACIONES]
 *           default: ACTIVO
 */

/**
 * @swagger
 * /api/profesores:
 *   get:
 *     summary: Obtener todos los profesores
 *     tags: [Profesores]
 *     parameters:
 *       - in: query
 *         name: especialidad
 *         schema:
 *           type: string
 *         description: Filtrar por especialidad
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [ACTIVO, INACTIVO, LICENCIA, VACACIONES]
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
 *     responses:
 *       200:
 *         description: Lista de profesores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     profesores:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Profesor'
 *                     paginacion:
 *                       type: object
 */
router.get('/', getProfesores);

/**
 * @swagger
 * /api/profesores/{id}:
 *   get:
 *     summary: Obtener profesor por ID
 *     tags: [Profesores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del profesor
 *     responses:
 *       200:
 *         description: Profesor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Profesor'
 *       404:
 *         description: Profesor no encontrado
 *       400:
 *         description: ID inválido
 */
router.get('/:id', getProfesorPorId);

/**
 * @swagger
 * /api/profesores:
 *   post:
 *     summary: Crear nuevo profesor
 *     tags: [Profesores]
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
 *               - telefono
 *               - especialidad
 *               - titulo
 *               - salario
 *             properties:
 *               nombres:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *               especialidad:
 *                 type: array
 *                 items:
 *                   type: string
 *               titulo:
 *                 type: string
 *               salario:
 *                 type: number
 *           example:
 *             nombres: María
 *             apellidos: Rodríguez
 *             email: maria.rodriguez@school.com
 *             telefono: "12345678"
 *             especialidad: ["Matemáticas", "Física"]
 *             titulo: Licenciada en Matemáticas
 *             salario: 3000
 *     responses:
 *       201:
 *         description: Profesor creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/', crearProfesor);

/**
 * @swagger
 * /api/profesores/{id}:
 *   put:
 *     summary: Actualizar profesor
 *     tags: [Profesores]
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
 *             $ref: '#/components/schemas/Profesor'
 *     responses:
 *       200:
 *         description: Profesor actualizado
 *       404:
 *         description: Profesor no encontrado
 *       400:
 *         description: Error de validación
 */
router.put('/:id', actualizarProfesor);

/**
 * @swagger
 * /api/profesores/{id}:
 *   delete:
 *     summary: Eliminar profesor (soft delete)
 *     tags: [Profesores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profesor eliminado
 *       404:
 *         description: Profesor no encontrado
 */
router.delete('/:id', eliminarProfesor);

export default router;
