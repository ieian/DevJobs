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

    if (req.body.skills) {
        vacante.skills = req.body.skills.split(',');
    } else {
        console.error("El campo 'skills' no está definido en el cuerpo de la solicitud.");
        vacante.skills = []; // Asigna un valor por defecto o maneja el caso como prefieras
    }

    const nuevaVacante = await vacante.save();

    res.redirect(`/vacantes/${nuevaVacante.url}`);
}