import mongoose from 'mongoose';

const estudianteSchema = new mongoose.Schema({
    matricula: {
        type: String,
        required: [true, 'La matrícula es obligatoria'],
        unique: true,
        uppercase: true,
        trim: true
    },
    nombres: {
        type: String,
        required: [true, 'Los nombres son obligatorios'],
        trim: true,
        minlength: [2, 'Nombres debe tener mínimo 2 caracteres'],
        maxlength: [100, 'Nombres debe tener máximo 100 caracteres']
    },
    apellidos: {
        type: String,
        required: [true, 'Los apellidos son obligatorios'],
        trim: true,
        minlength: [2, 'Apellidos debe tener mínimo 2 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido']
    },
    telefono: {
        type: String,
        trim: true,
        match: [/^\d{8,10}$/, 'El teléfono debe tener entre 8 y 10 dígitos']
    },
    fechaNacimiento: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria'],
        validate: {
            validator: function (fecha) {
                return fecha < new Date();
            },
            message: 'La fecha de nacimiento debe ser anterior a hoy'
        }
    },
    direccion: {
        calle: { type: String, trim: true },
        ciudad: { type: String, trim: true },
        departamento: { type: String, trim: true },
        codigoPostal: { type: String, trim: true }
    },
    grado: {
        type: String,
        required: [true, 'El grado es obligatorio'],
        enum: {
            values: ['1ro', '2do', '3ro', '4to', '5to', '6to'],
            message: '{VALUE} no es un grado válido'
        }
    },
    seccion: {
        type: String,
        required: [true, 'La sección es obligatoria'],
        uppercase: true,
        enum: {
            values: ['A', 'B', 'C', 'D'],
            message: '{VALUE} no es una sección válida'
        }
    },
    genero: {
        type: String,
        enum: {
            values: ['Masculino', 'Femenino', 'Otro'],
            message: '{VALUE} no es un género válido'
        }
    },
    estado: {
        type: String,
        enum: ['ACTIVO', 'INACTIVO', 'SUSPENDIDO', 'EGRESADO'],
        default: 'ACTIVO'
    },
    nombreResponsable: { type: String, trim: true },
    telefonoResponsable: { type: String, trim: true },
    relacionResponsable: {
        type: String,
        enum: ['Padre', 'Madre', 'Tutor', 'Otro']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

estudianteSchema.index({ grado: 1, seccion: 1 });
estudianteSchema.index({ estado: 1 });
estudianteSchema.index({ email: 1 });

estudianteSchema.virtual('nombreCompleto').get(function () {
    return `${this.nombres} ${this.apellidos}`;
});

estudianteSchema.virtual('edad').get(function () {
    if (!this.fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(this.fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
});

estudianteSchema.pre('save', async function (next) {
    if (this.isNew && !this.matricula) {
        const count = await mongoose.model('Estudiante').countDocuments();
        this.matricula = `EST-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

estudianteSchema.statics.buscarPorGradoSeccion = function (grado, seccion) {
    return this.find({ grado, seccion, estado: 'ACTIVO' }).sort({ apellidos: 1, nombres: 1 });
};

export default mongoose.model('Estudiante', estudianteSchema);
