const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante',{
        nombrePagina : 'Nueva Vacante',
        tagline : 'Llena el formulario y publica tu vacante'
    })
}

exports.agregarVacante = async (req, res) => {
    const vacante = new Vacante(req.body);

    vacante.autor = req.user._id;

    vacante.skills = req.body.skills.split(',');

    const nuevaVacante = await vacante.save();

    res.redirect(`/vacantes/${nuevaVacante.url}`);
}

exports.mostrarVacante = async (req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url }).lean();

    if(!vacante) return next();

    res.render('vacante', {
        vacante,
        nombrePagina : vacante.titulo,
        barra: true
    })
}

exports.formEditarVacante = async (req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url }).lean();

    if(!vacante) return next();

    res.render('editar-vacante', {
        vacante,
        nombrePagina : `Editar - ${vacante.titulo}`
    })
}

exports.editarVacante = async (req, res) => {
    const vacanteAcualizada = req.body;

    vacanteAcualizada.skills = req.body.skills.split(',');

    const vacante = await Vacante.findOneAndUpdate({ url: req.params.url }, 
    vacanteAcualizada, {
        new: true,
        runValidators: true
    }).lean();

    res.redirect(`/vacantes/${vacante.url}`);
}