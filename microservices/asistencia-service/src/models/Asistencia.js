import mongoose from 'mongoose';

const asistenciaSchema = new mongoose.Schema({
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
    fecha: {
        type: Date,
        required: [true, 'La fecha es obligatoria'],
        default: Date.now
    },
    estado: {
        type: String,
        required: [true, 'El estado de asistencia es obligatorio'],
        enum: {
            values: ['PRESENTE', 'AUSENTE', 'TARDANZA', 'JUSTIFICADO'],
            message: '{VALUE} no es un estado válido'
        },
        default: 'PRESENTE'
    },
    horaEntrada: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido']
    },
    observaciones: {
        type: String,
        trim: true,
        maxlength: [300, 'Las observaciones no pueden exceder 300 caracteres']
    },
    periodo: {
        type: String,
        required: [true, 'El período es obligatorio']
    }
}, {
    timestamps: true
});

asistenciaSchema.index({ estudiante: 1, curso: 1, fecha: 1 }, { unique: true });
asistenciaSchema.index({ fecha: -1 });
asistenciaSchema.index({ estado: 1 });

asistenciaSchema.pre('save', function (next) {
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);

    if (this.fecha > hoy) {
        return next(new Error('No se puede registrar asistencia para una fecha futura'));
    }
    next();
});

asistenciaSchema.statics.calcularPorcentajeAsistencia = async function (estudianteId, cursoId, periodo) {
    const asistencias = await this.find({
        estudiante: estudianteId,
        curso: cursoId,
        periodo
    });

    if (asistencias.length === 0) return 0;

    const presentes = asistencias.filter(a =>
        a.estado === 'PRESENTE' || a.estado === 'TARDANZA'
    ).length;

    return Math.round((presentes / asistencias.length) * 100);
};

asistenciaSchema.statics.reportePorFecha = async function (fecha, cursoId) {
    return this.find({ fecha, curso: cursoId })
        .sort({ 'estudiante.apellidos': 1 });
};

export default mongoose.model('Asistencia', asistenciaSchema);
