import Calificacion from '../models/Calificacion.js';

export const crearCalificacion = async (req, res, next) => {
  try {
    const calificacion = await Calificacion.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Calificación registrada exitosamente',
      data: calificacion
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
        error: 'Ya existe una calificación para este estudiante en este curso y período'
      });
    }
    
    next(error);
  }
};

export const getCalificaciones = async (req, res, next) => {
  try {
    const { estudiante, curso, periodo, page = 1, limit = 10 } = req.query;
    
    const filtros = {};
    if (estudiante) filtros.estudiante = estudiante;
    if (curso) filtros.curso = curso;
    if (periodo) filtros.periodo = periodo;
    
    const calificaciones = await Calificacion.find(filtros)
      .populate('estudiante', 'nombres apellidos matricula')
      .populate('curso', 'codigo nombre creditos')
      .select('-__v')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'estudiante.apellidos': 1 });
    
    const total = await Calificacion.countDocuments(filtros);
    
    res.status(200).json({
      success: true,
      data: {
        calificaciones,
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

export const actualizarCalificacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const calificacion = await Calificacion.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('estudiante', 'nombres apellidos')
     .populate('curso', 'codigo nombre');
    
    if (!calificacion) {
      return res.status(404).json({
        success: false,
        error: 'Calificación no encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Calificación actualizada exitosamente',
      data: calificacion
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

export const getPromedioEstudiante = async (req, res, next) => {
  try {
    const { estudianteId, periodo } = req.query;
    
    if (!estudianteId || !periodo) {
      return res.status(400).json({
        success: false,
        error: 'Estudiante y período son requeridos'
      });
    }
    
    const promedio = await Calificacion.promedioEstudiante(estudianteId, periodo);
    
    const calificaciones = await Calificacion.find({
      estudiante: estudianteId,
      periodo,
      notaFinal: { $ne: null }
    }).populate('curso', 'codigo nombre');
    
    res.status(200).json({
      success: true,
      data: {
        estudianteId,
        periodo,
        promedio,
        totalCursos: calificaciones.length,
        calificaciones
      }
    });
  } catch (error) {
    next(error);
  }
};
