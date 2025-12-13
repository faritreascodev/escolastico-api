import Estudiante from '../models/Estudiante.js';

export const getEstudiantes = async (req, res, next) => {
    try {
        const { nombre, grado, seccion, estado, page = 1, limit = 10, sort = 'apellidos' } = req.query;

        const filtros = {};
        if (nombre) {
            filtros.$or = [
                { nombres: { $regex: nombre, $options: 'i' } },
                { apellidos: { $regex: nombre, $options: 'i' } }
            ];
        }
        if (grado) filtros.grado = grado;
        if (seccion) filtros.seccion = seccion;
        if (estado) filtros.estado = estado;

        const estudiantes = await Estudiante.find(filtros)
            .select('-__v')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ [sort]: 1 })
            .lean();

        const total = await Estudiante.countDocuments(filtros);

        res.status(200).json({
            success: true,
            data: {
                estudiantes,
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

export const getEstudiantePorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const estudiante = await Estudiante.findById(id).select('-__v');

        if (!estudiante) {
            return res.status(404).json({
                success: false,
                error: 'Estudiante no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: estudiante
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                error: 'ID de estudiante inválido'
            });
        }
        next(error);
    }
};

export const crearEstudiante = async (req, res, next) => {
    try {
        const estudiante = await Estudiante.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Estudiante creado exitosamente',
            data: estudiante
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
            const campo = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                error: `El ${campo} ya está registrado`
            });
        }

        next(error);
    }
};

export const actualizarEstudiante = async (req, res, next) => {
    try {
        const { id } = req.params;

        const estudiante = await Estudiante.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!estudiante) {
            return res.status(404).json({
                success: false,
                error: 'Estudiante no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Estudiante actualizado exitosamente',
            data: estudiante
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

export const eliminarEstudiante = async (req, res, next) => {
    try {
        const { id } = req.params;

        const estudiante = await Estudiante.findByIdAndUpdate(
            id,
            { estado: 'INACTIVO' },
            { new: true }
        );

        if (!estudiante) {
            return res.status(404).json({
                success: false,
                error: 'Estudiante no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Estudiante eliminado exitosamente',
            data: estudiante
        });
    } catch (error) {
        next(error);
    }
};

export const getEstudiantesPorGradoSeccion = async (req, res, next) => {
    try {
        const { grado, seccion } = req.params;
        const estudiantes = await Estudiante.buscarPorGradoSeccion(grado, seccion);

        res.status(200).json({
            success: true,
            data: {
                grado,
                seccion,
                total: estudiantes.length,
                estudiantes
            }
        });
    } catch (error) {
        next(error);
    }
};

export const actualizarEstado = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!['ACTIVO', 'INACTIVO', 'SUSPENDIDO', 'EGRESADO'].includes(estado)) {
            return res.status(400).json({
                success: false,
                error: 'Estado inválido'
            });
        }

        const estudiante = await Estudiante.findByIdAndUpdate(
            id,
            { estado },
            { new: true, runValidators: true }
        );

        if (!estudiante) {
            return res.status(404).json({
                success: false,
                error: 'Estudiante no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Estado actualizado exitosamente',
            data: estudiante
        });
    } catch (error) {
        next(error);
    }
};
