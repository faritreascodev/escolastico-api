import mongoose from 'mongoose';

const calificacionSchema = new mongoose.Schema({
  estudiante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estudiante',
    required: [true, 'El estudiante es obligatorio']
  },
  curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: [true, 'El curso es obligatorio']
  },
  matriculaDetalle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MatriculaDetalle',
    required: [true, 'El detalle de matrícula es obligatorio']
  },
  periodo: {
    type: String,
    required: [true, 'El período es obligatorio']
  },
  parcial1: {
    type: Number,
    min: [0, 'Nota mínima es 0'],
    max: [100, 'Nota máxima es 100'],
    default: null
  },
  parcial2: {
    type: Number,
    min: [0, 'Nota mínima es 0'],
    max: [100, 'Nota máxima es 100'],
    default: null
  },
  examenFinal: {
    type: Number,
    min: [0, 'Nota mínima es 0'],
    max: [100, 'Nota máxima es 100'],
    default: null
  },
  notaFinal: {
    type: Number,
    min: [0, 'Nota mínima es 0'],
    max: [100, 'Nota máxima es 100'],
    default: null
  },
  estado: {
    type: String,
    enum: ['PENDIENTE', 'APROBADO', 'REPROBADO'],
    default: 'PENDIENTE'
  },
  observaciones: {
    type: String,
    trim: true,
    maxlength: [300, 'Las observaciones no pueden exceder 300 caracteres']
  }
}, {
  timestamps: true
});

calificacionSchema.index({ estudiante: 1, curso: 1, periodo: 1 }, { unique: true });

calificacionSchema.pre('save', function(next) {
  if (this.parcial1 !== null && this.parcial2 !== null && this.examenFinal !== null) {
    this.notaFinal = Math.round(
      (this.parcial1 * 0.30) + 
      (this.parcial2 * 0.30) + 
      (this.examenFinal * 0.40)
    );
    this.estado = this.notaFinal >= 70 ? 'APROBADO' : 'REPROBADO';
  } else {
    this.estado = 'PENDIENTE';
  }
  next();
});

calificacionSchema.statics.promedioEstudiante = async function(estudianteId, periodo) {
  const calificaciones = await this.find({
    estudiante: estudianteId,
    periodo,
    notaFinal: { $ne: null }
  });
  
  if (calificaciones.length === 0) return 0;
  
  const suma = calificaciones.reduce((acc, cal) => acc + cal.notaFinal, 0);
  return Math.round(suma / calificaciones.length);
};

export default mongoose.model('Calificacion', calificacionSchema);
