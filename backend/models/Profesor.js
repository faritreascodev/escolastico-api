import mongoose from 'mongoose';

const profesorSchema = new mongoose.Schema({
  codigoEmpleado: {
    type: String,
    required: [true, 'El código de empleado es obligatorio'],
    unique: true,
    uppercase: true,
    trim: true
  },
  nombres: {
    type: String,
    required: [true, 'Los nombres son obligatorios'],
    trim: true,
    minlength: [2, 'Nombres debe tener mínimo 2 caracteres']
  },
  apellidos: {
    type: String,
    required: [true, 'Los apellidos son obligatorios'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido']
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    trim: true,
    match: [/^\d{8,10}$/, 'El teléfono debe tener entre 8 y 10 dígitos']
  },
  especialidad: [{
    type: String,
    enum: ['Matemáticas', 'Física', 'Química', 'Biología', 'Lengua', 'Literatura', 'Ciencias Naturales', 'Ciencias Sociales', 'Historia', 'Geografía', 'Inglés', 'Arte', 'Música', 'Educación Física', 'Tecnología', 'Computación']
  }],
  titulo: {
    type: String,
    required: [true, 'El título académico es obligatorio'],
    trim: true
  },
  fechaContratacion: {
    type: Date,
    required: [true, 'La fecha de contratación es obligatoria'],
    default: Date.now
  },
  salario: {
    type: Number,
    required: [true, 'El salario es obligatorio'],
    min: [0, 'El salario no puede ser negativo']
  },
  estado: {
    type: String,
    enum: ['ACTIVO', 'INACTIVO', 'LICENCIA', 'VACACIONES'],
    default: 'ACTIVO'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

profesorSchema.index({ estado: 1 });
profesorSchema.index({ especialidad: 1 });

profesorSchema.virtual('nombreCompleto').get(function() {
  return `${this.nombres} ${this.apellidos}`;
});

profesorSchema.pre('save', async function(next) {
  if (this.isNew && !this.codigoEmpleado) {
    const count = await mongoose.model('Profesor').countDocuments();
    this.codigoEmpleado = `PROF-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

profesorSchema.pre('save', function(next) {
  if (this.especialidad.length === 0) {
    return next(new Error('El profesor debe tener al menos una especialidad'));
  }
  next();
});

export default mongoose.model('Profesor', profesorSchema);
