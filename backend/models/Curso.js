import mongoose from 'mongoose';

const cursoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: [true, 'El código del curso es obligatorio'],
    unique: true,
    uppercase: true,
    trim: true
  },
  nombre: {
    type: String,
    required: [true, 'El nombre del curso es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre debe tener mínimo 3 caracteres']
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción debe tener máximo 500 caracteres']
  },
  creditos: {
    type: Number,
    required: [true, 'Los créditos son obligatorios'],
    min: [1, 'Mínimo 1 crédito'],
    max: [6, 'Máximo 6 créditos'],
    validate: {
      validator: Number.isInteger,
      message: 'Los créditos deben ser un número entero'
    }
  },
  horasSemana: {
    type: Number,
    required: [true, 'Las horas por semana son obligatorias'],
    min: [1, 'Mínimo 1 hora semanal'],
    max: [10, 'Máximo 10 horas semanales']
  },
  grado: {
    type: String,
    required: [true, 'El grado es obligatorio'],
    enum: {
      values: ['1ro', '2do', '3ro', '4to', '5to', '6to'],
      message: '{VALUE} no es un grado válido'
    }
  },
  area: {
    type: String,
    required: [true, 'El área es obligatoria'],
    enum: {
      values: ['Matemáticas', 'Lengua', 'Ciencias Naturales', 'Ciencias Sociales', 'Inglés', 'Arte', 'Educación Física', 'Tecnología'],
      message: '{VALUE} no es un área válida'
    }
  },
  prerequisitos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso'
  }],
  estado: {
    type: String,
    enum: ['ACTIVO', 'INACTIVO'],
    default: 'ACTIVO'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

cursoSchema.index({ grado: 1, area: 1 });
cursoSchema.index({ estado: 1 });

cursoSchema.pre('save', async function(next) {
  if (this.isNew && !this.codigo) {
    const areaAbrev = this.area.substring(0, 3).toUpperCase();
    const count = await mongoose.model('Curso').countDocuments({ area: this.area });
    this.codigo = `${areaAbrev}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

cursoSchema.statics.cursosDisponiblesPorGrado = function(grado) {
  return this.find({ grado, estado: 'ACTIVO' }).sort({ area: 1, nombre: 1 });
};

export default mongoose.model('Curso', cursoSchema);
