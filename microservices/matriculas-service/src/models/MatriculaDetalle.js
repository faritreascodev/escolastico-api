import mongoose from 'mongoose';

const matriculaDetalleSchema = new mongoose.Schema({
    matricula: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Matricula',
        required: [true, 'La matrícula es obligatoria']
    },
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Curso',
        required: [true, 'El curso es obligatorio']
    },
    profesor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profesor',
        required: [true, 'El profesor es obligatorio']
    },
    horario: {
        dias: [{
            type: String,
            enum: {
                values: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                message: '{VALUE} no es un día válido'
            }
        }],
        horaInicio: {
            type: String,
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido']
        },
        horaFin: {
            type: String,
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido']
        }
    },
    creditos: {
        type: Number,
        required: [true, 'Los créditos son obligatorios'],
        min: [1, 'Mínimo 1 crédito']
    },
    costo: {
        type: Number,
        required: [true, 'El costo es obligatorio'],
        min: [0, 'El costo no puede ser negativo']
    },
    estado: {
        type: String,
        enum: ['INSCRITO', 'RETIRADO', 'APROBADO', 'REPROBADO'],
        default: 'INSCRITO'
    }
}, {
    timestamps: true
});

matriculaDetalleSchema.index({ matricula: 1, curso: 1 }, { unique: true });
matriculaDetalleSchema.index({ profesor: 1 });

matriculaDetalleSchema.pre('save', async function (next) {
    if (this.isNew) {
        const existe = await mongoose.model('MatriculaDetalle').findOne({
            matricula: this.matricula,
            curso: this.curso
        });

        if (existe) {
            return next(new Error('Este curso ya está registrado en la matrícula'));
        }
    }
    next();
});

export default mongoose.model('MatriculaDetalle', matriculaDetalleSchema);
