import Asistencia from '../models/Asistencia.js';

export const registrarAsistencia = async (req, res, next) => {
    try {
        const { estudiante, curso, matriculaDetalle, fecha, estado, horaEntrada, observaciones, periodo } = req.body;

        const asistencia = await Asistencia.create({
            estudiante,
            curso,
            matriculaDetalle,
            fecha,
            estado,
            horaEntrada,
            observaciones,
            periodo
        });

        res.status(201).json({
            success: true,
            message: 'Asistencia registrada exitosamente',
            data: asistencia
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const mensajes = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: 'Error de validación',
                detalles: mensajes
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Ya existe un registro de asistencia para este estudiante en esta fecha y curso'
            });
        }

        next(error);
    }
};

export const getAsistencias = async (req, res, next) => {
    try {
        const { estudiante, curso, fecha, estado, periodo, page = 1, limit = 10 } = req.query;

        const filtros = {};
        if (estudiante) filtros.estudiante = estudiante;
        if (curso) filtros.curso = curso;
        if (fecha) {
            const fechaInicio = new Date(fecha);
            fechaInicio.setHours(0, 0, 0, 0);
            const fechaFin = new Date(fecha);
            fechaFin.setHours(23, 59, 59, 999);
            filtros.fecha = { $gte: fechaInicio, $lte: fechaFin };
        }
        if (estado) filtros.estado = estado;
        if (periodo) filtros.periodo = periodo;

        const asistencias = await Asistencia.find(filtros)
            .select('-__v')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ fecha: -1 });

        const total = await Asistencia.countDocuments(filtros);

        res.status(200).json({
            success: true,
            data: {
                asistencias,
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

export const actualizarAsistencia = async (req, res, next) => {
    try {
        const { id } = req.params;

        const asistencia = await Asistencia.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!asistencia) {
            return res.status(404).json({
                success: false,
                error: 'Asistencia no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Asistencia actualizada exitosamente',
            data: asistencia
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const mensajes = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: 'Error de validación',
                detalles: mensajes
            });
        }
        next(error);
    }
};

export const reporteAsistenciaPorFecha = async (req, res, next) => {
    try {
        const { fecha, cursoId } = req.query;

        if (!fecha || !cursoId) {
            return res.status(400).json({
                success: false,
                error: 'Fecha y curso son requeridos'
            });
        }

        const fechaBusqueda = new Date(fecha);
        const asistencias = await Asistencia.reportePorFecha(fechaBusqueda, cursoId);

        const resumen = {
            total: asistencias.length,
            presentes: asistencias.filter(a => a.estado === 'PRESENTE').length,
            ausentes: asistencias.filter(a => a.estado === 'AUSENTE').length,
            tardanzas: asistencias.filter(a => a.estado === 'TARDANZA').length,
            justificados: asistencias.filter(a => a.estado === 'JUSTIFICADO').length
        };

        res.status(200).json({
            success: true,
            data: {
                fecha,
                resumen,
                asistencias
            }
        });
    } catch (error) {
        next(error);
    }
};

export const calcularPorcentajeAsistencia = async (req, res, next) => {
    try {
        const { estudianteId, cursoId, periodo } = req.query;

        if (!estudianteId || !cursoId || !periodo) {
            return res.status(400).json({
                success: false,
                error: 'Estudiante, curso y período son requeridos'
            });
        }

        const porcentaje = await Asistencia.calcularPorcentajeAsistencia(
            estudianteId,
            cursoId,
            periodo
        );

        res.status(200).json({
            success: true,
            data: {
                estudianteId,
                cursoId,
                periodo,
                porcentajeAsistencia: porcentaje
            }
        });
    } catch (error) {
        next(error);
    }
};
