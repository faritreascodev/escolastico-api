import mongoose from 'mongoose';

const matriculaSchema = new mongoose.Schema({
    numeroMatricula: {
        type: String,
        unique: true,
        uppercase: true,
        trim: true
    },
    estudiante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estudiante',
        required: [true, 'El estudiante es obligatorio']
    },
    periodoAcademico: {
        type: String,
        required: [true, 'El período académico es obligatorio'],
        enum: {
            values: ['2025-I', '2025-II', '2026-I', '2026-II'],
            message: '{VALUE} no es un período válido'
        }
    },
    fechaMatricula: {
        type: Date,
        default: Date.now,
        required: true
    },
    estado: {
        type: String,
        enum: ['ACTIVA', 'SUSPENDIDA', 'CANCELADA', 'FINALIZADA'],
        default: 'ACTIVA'
    },
    totalCreditos: {
        type: Number,
        default: 0,
        min: [0, 'Los créditos no pueden ser negativos']
    },
    costoTotal: {
        type: Number,
        default: 0,
        min: [0, 'El costo no puede ser negativo']
    },
    observaciones: {
        type: String,
        trim: true,
        maxlength: [500, 'Las observaciones no pueden exceder 500 caracteres']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

matriculaSchema.virtual('detalles', {
    ref: 'MatriculaDetalle',
    localField: '_id',
    foreignField: 'matricula'
});

matriculaSchema.index({ estudiante: 1, periodoAcademico: 1 });
matriculaSchema.index({ estado: 1 });
matriculaSchema.index({ fechaMatricula: -1 });
matriculaSchema.index({ numeroMatricula: 1 }, { unique: true });

matriculaSchema.pre('save', async function (next) {
    if (this.isNew && !this.numeroMatricula) {
        const count = await mongoose.model('Matricula').countDocuments();
        const año = new Date().getFullYear();
        this.numeroMatricula = `MAT-${año}-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

matriculaSchema.pre('save', async function (next) {
    if (this.isNew) {
        const existe = await mongoose.model('Matricula').findOne({
            estudiante: this.estudiante,
            periodoAcademico: this.periodoAcademico,
            estado: 'ACTIVA'
        });

        if (existe) {
            return next(new Error('El estudiante ya tiene una matrícula activa en este período'));
        }
    }
    next();
});

export default mongoose.model('Matricula', matriculaSchema);
