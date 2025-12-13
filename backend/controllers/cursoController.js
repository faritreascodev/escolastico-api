import Curso from '../models/Curso.js';

export const getCursos = async (req, res, next) => {
  try {
    const { grado, area, estado, page = 1, limit = 10 } = req.query;
    
    const filtros = {};
    if (grado) filtros.grado = grado;
    if (area) filtros.area = area;
    if (estado) filtros.estado = estado;
    
    const cursos = await Curso.find(filtros)
      .populate('prerequisitos', 'codigo nombre')
      .select('-__v')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ grado: 1, area: 1 });
    
    const total = await Curso.countDocuments(filtros);
    
    res.status(200).json({
      success: true,
      data: {
        cursos,
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

export const getCursoPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const curso = await Curso.findById(id)
      .populate('prerequisitos', 'codigo nombre creditos')
      .select('-__v');
    
    if (!curso) {
      return res.status(404).json({
        success: false,
        error: 'Curso no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: curso
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'ID de curso inválido'
      });
    }
    next(error);
  }
};

export const crearCurso = async (req, res, next) => {
  try {
    const curso = await Curso.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Curso creado exitosamente',
      data: curso
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
        error: 'El código del curso ya está registrado'
      });
    }
    
    next(error);
  }
};

export const actualizarCurso = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const curso = await Curso.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('prerequisitos', 'codigo nombre');
    
    if (!curso) {
      return res.status(404).json({
        success: false,
        error: 'Curso no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Curso actualizado exitosamente',
      data: curso
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

export const eliminarCurso = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const curso = await Curso.findByIdAndUpdate(
      id,
      { estado: 'INACTIVO' },
      { new: true }
    );
    
    if (!curso) {
      return res.status(404).json({
        success: false,
        error: 'Curso no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Curso eliminado exitosamente',
      data: curso
    });
  } catch (error) {
    next(error);
  }
};

export const getCursosPorGrado = async (req, res, next) => {
  try {
    const { grado } = req.params;
    const cursos = await Curso.cursosDisponiblesPorGrado(grado);
    
    res.status(200).json({
      success: true,
      data: {
        grado,
        total: cursos.length,
        cursos
      }
    });
  } catch (error) {
    next(error);
  }
};
