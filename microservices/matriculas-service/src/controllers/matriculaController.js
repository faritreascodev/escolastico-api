import mongoose from 'mongoose';
import Matricula from '../models/Matricula.js';
import MatriculaDetalle from '../models/MatriculaDetalle.js';

export const crearMatriculaCompleta = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { estudiante, periodoAcademico, cursos, observaciones } = req.body;

        if (!cursos || cursos.length === 0) {
            throw new Error('Debe incluir al menos un curso');
        }

        const matricula = new Matricula({
            estudiante,
            periodoAcademico,
            observaciones
        });

        let totalCreditos = 0;
        let costoTotal = 0;
        const detallesCreados = [];

        for (const cursoData of cursos) {
            const detalle = new MatriculaDetalle({
                matricula: matricula._id,
                curso: cursoData.cursoId,
                profesor: cursoData.profesorId,
                horario: cursoData.horario,
                creditos: cursoData.creditos || 3,
                costo: cursoData.costo
            });

            await detalle.save({ session });
            detallesCreados.push(detalle);

            totalCreditos += detalle.creditos;
            costoTotal += cursoData.costo;
        }

        matricula.totalCreditos = totalCreditos;
        matricula.costoTotal = costoTotal;

        await matricula.save({ session });
        await session.commitTransaction();

        const matriculaCompleta = await Matricula.findById(matricula._id)
            .populate({
                path: 'detalles'
            });

        res.status(201).json({
            success: true,
            message: 'Matrícula creada exitosamente',
            data: matriculaCompleta
        });
    } catch (error) {
        await session.abortTransaction();

        if (error.message.includes('no encontrado') || error.message.includes('no está') || error.message.includes('Debe incluir')) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        next(error);
    } finally {
        session.endSession();
    }
};

export const getMatriculas = async (req, res, next) => {
    try {
        const { estudiante, periodo, estado, page = 1, limit = 10 } = req.query;

        const filtros = {};
        if (estudiante) filtros.estudiante = estudiante;
        if (periodo) filtros.periodoAcademico = periodo;
        if (estado) filtros.estado = estado;

        const matriculas = await Matricula.find(filtros)
            .select('-__v')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ fechaMatricula: -1 });

        const total = await Matricula.countDocuments(filtros);

        res.status(200).json({
            success: true,
            data: {
                matriculas,
                paginacion: {
                    total,
                    pagina: parseInt(page),
                    limite: parseInt(limit),
                    totalPaginas: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getMatriculaPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const matricula = await Matricula.findById(id)
            .populate({
                path: 'detalles'
            });

        if (!matricula) {
            return res.status(404).json({
                success: false,
                error: 'Matrícula no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: matricula
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                error: 'ID de matrícula inválido'
            });
        }
        next(error);
    }
};

export const actualizarEstadoMatricula = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!['ACTIVA', 'SUSPENDIDA', 'CANCELADA', 'FINALIZADA'].includes(estado)) {
            return res.status(400).json({
                success: false,
                error: 'Estado inválido'
            });
        }

        const matricula = await Matricula.findByIdAndUpdate(
            id,
            { estado },
            { new: true, runValidators: true }
        );

        if (!matricula) {
            return res.status(404).json({
                success: false,
                error: 'Matrícula no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Estado actualizado exitosamente',
            data: matricula
        });
    } catch (error) {
        next(error);
    }
};

export const eliminarMatricula = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;

        await MatriculaDetalle.deleteMany({ matricula: id }, { session });

        const matricula = await Matricula.findByIdAndDelete(id, { session });

        if (!matricula) {
            throw new Error('Matrícula no encontrada');
        }

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: 'Matrícula eliminada exitosamente'
        });
    } catch (error) {
        await session.abortTransaction();

        if (error.message === 'Matrícula no encontrada') {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }

        next(error);
    } finally {
        session.endSession();
    }
};

export const getEstadisticasMatricula = async (req, res, next) => {
    try {
        const { id } = req.params;

        const matricula = await Matricula.findById(id);

        if (!matricula) {
            return res.status(404).json({
                success: false,
                error: 'Matrícula no encontrada'
            });
        }

        const detalles = await MatriculaDetalle.find({ matricula: id });

        const estadisticas = {
            totalCursos: detalles.length,
            cursosInscritos: detalles.filter(d => d.estado === 'INSCRITO').length,
            cursosRetirados: detalles.filter(d => d.estado === 'RETIRADO').length,
            totalCreditos: matricula.totalCreditos,
            costoTotal: matricula.costoTotal
        };

        res.status(200).json({
            success: true,
            data: estadisticas
        });
    } catch (error) {
        next(error);
    }
};
