import mongoose from 'mongoose';
import Matricula from '../models/Matricula.js';
import MatriculaDetalle from '../models/MatriculaDetalle.js';
import Estudiante from '../models/Estudiante.js';
import Curso from '../models/Curso.js';
import Profesor from '../models/Profesor.js';

export const crearMatriculaCompleta = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { estudiante, periodoAcademico, cursos, observaciones } = req.body;
    
    const estudianteDoc = await Estudiante.findById(estudiante).session(session);
    if (!estudianteDoc) {
      throw new Error('Estudiante no encontrado');
    }
    
    if (estudianteDoc.estado !== 'ACTIVO') {
      throw new Error('El estudiante no está activo');
    }
    
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
      const curso = await Curso.findById(cursoData.cursoId).session(session);
      if (!curso) {
        throw new Error(`Curso ${cursoData.cursoId} no encontrado`);
      }
      
      if (curso.estado !== 'ACTIVO') {
        throw new Error(`El curso ${curso.nombre} no está activo`);
      }
      
      const profesor = await Profesor.findById(cursoData.profesorId).session(session);
      if (!profesor) {
        throw new Error(`Profesor ${cursoData.profesorId} no encontrado`);
      }
      
      if (profesor.estado !== 'ACTIVO') {
        throw new Error(`El profesor ${profesor.nombreCompleto} no está activo`);
      }
      
      const detalle = new MatriculaDetalle({
        matricula: matricula._id,
        curso: curso._id,
        profesor: profesor._id,
        horario: cursoData.horario,
        creditos: curso.creditos,
        costo: cursoData.costo
      });
      
      await detalle.save({ session });
      detallesCreados.push(detalle);
      
      totalCreditos += curso.creditos;
      costoTotal += cursoData.costo;
    }
    
    matricula.totalCreditos = totalCreditos;
    matricula.costoTotal = costoTotal;
    
    await matricula.save({ session });
    await session.commitTransaction();
    
    const matriculaCompleta = await Matricula.findById(matricula._id)
      .populate('estudiante', 'nombres apellidos matricula email')
      .populate({
        path: 'detalles',
        populate: [
          { path: 'curso', select: 'codigo nombre creditos area' },
          { path: 'profesor', select: 'nombres apellidos especialidad' }
        ]
      });
    
    res.status(201).json({
      success: true,
      message: 'Matrícula creada exitosamente',
      data: matriculaCompleta
    });
  } catch (error) {
    await session.abortTransaction();
    
    if (error.message.includes('no encontrado') || error.message.includes('no está')) {
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
      .populate('estudiante', 'nombres apellidos matricula grado seccion')
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
      .populate('estudiante')
      .populate({
        path: 'detalles',
        populate: [
          { path: 'curso' },
          { path: 'profesor', select: 'nombres apellidos especialidad email telefono' }
        ]
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
    ).populate('estudiante', 'nombres apellidos matricula');
    
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
    
    const detalles = await MatriculaDetalle.find({ matricula: id })
      .populate('curso', 'nombre area');
    
    const estadisticas = {
      totalCursos: detalles.length,
      cursosInscritos: detalles.filter(d => d.estado === 'INSCRITO').length,
      cursosRetirados: detalles.filter(d => d.estado === 'RETIRADO').length,
      totalCreditos: matricula.totalCreditos,
      costoTotal: matricula.costoTotal,
      porArea: {}
    };
    
    detalles.forEach(detalle => {
      const area = detalle.curso.area;
      if (!estadisticas.porArea[area]) {
        estadisticas.porArea[area] = { cursos: 0, creditos: 0 };
      }
      estadisticas.porArea[area].cursos++;
      estadisticas.porArea[area].creditos += detalle.creditos;
    });
    
    res.status(200).json({
      success: true,
      data: estadisticas
    });
  } catch (error) {
    next(error);
  }
};
