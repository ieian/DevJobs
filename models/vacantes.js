const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slugify = require('slugify');
const shortid = require('shortid');

const vacantesSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: 'El nombre de la vacante es obligatorio',
        trim: true
    },
    empresa: {
        type: String,
        trim: true
    },
    ubicacion: {
        type: String,
        required: 'La ubicacion de obligatoria',
        trim: true
    },
    salario: {
        type: String,
        default: '0',
        trim: true
    },
    contrato: {
        type: String,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        lowercase: true
    },
    skills: [String],
    candidatos: [{
        nombre: String,
        email: String,
        cv: String
    }]
});

vacantesSchema.pre('save', function(next) {
    const url = slugify(this.titulo, { lower: true });
    this.url = `${url}-${shortid.generate()}`;

    next();
});

module.exports = mongoose.model('Vacante', vacantesSchema);
