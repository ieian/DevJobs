const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
const { body, validationResult } = require('express-validator');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina : 'Crea tu cuenta en devJobs',
        tagline : 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    })
}

//volver al video 220 para terminar esto si es necesario
exports.validarRegistro = (req, res, next) => {
    req.checkBody('nombre', 'El nombre es obligatorio').noEmpty();

    const errores = res.vadationErrors();

    console.log(errores);

    return;
}

exports.crearUsuario = async (req, res, next) => {
    const usuario = new Usuarios(req.body);

    const nuevoUsuario = await usuario.save();

    if(!nuevoUsuario) return next();

    res.redirect('/iniciar-sesion');
}