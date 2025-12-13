import Profesor from '../models/Profesor.js';

export const getProfesores = async (req, res, next) => {
    try {
        const { especialidad, estado, page = 1, limit = 10 } = req.query;

        const filtros = {};
        if (especialidad) filtros.especialidad = especialidad;
        if (estado) filtros.estado = estado;

        const profesores = await Profesor.find(filtros)
            .select('-__v')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ apellidos: 1, nombres: 1 });

        const total = await Profesor.countDocuments(filtros);

        res.status(200).json({
            success: true,
            data: {
                profesores,
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

export const getProfesorPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const profesor = await Profesor.findById(id).select('-__v');

        if (!profesor) {
            return res.status(404).json({
                success: false,
                error: 'Profesor no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: profesor
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                error: 'ID de profesor inválido'
            });
        }
        next(error);
    }
};

export const crearProfesor = async (req, res, next) => {
    try {
        const profesor = await Profesor.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Profesor creado exitosamente',
            data: profesor
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

export const actualizarProfesor = async (req, res, next) => {
    try {
        const { id } = req.params;

        const profesor = await Profesor.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!profesor) {
            return res.status(404).json({
                success: false,
                error: 'Profesor no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profesor actualizado exitosamente',
            data: profesor
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

export const eliminarProfesor = async (req, res, next) => {
    try {
        const { id } = req.params;

        const profesor = await Profesor.findByIdAndUpdate(
            id,
            { estado: 'INACTIVO' },
            { new: true }
        );

        if (!profesor) {
            return res.status(404).json({
                success: false,
                error: 'Profesor no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profesor eliminado exitosamente',
            data: profesor
        });
    } catch (error) {
        next(error);
    }
};
