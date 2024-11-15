const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
const { body, validationResult } = require('express-validator');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina : 'Crea tu cuenta en devJobs',
        tagline : 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    })
}

exports.validarRegistro = [
    body('nombre').notEmpty().withMessage('El Nombre es obligatorio').escape(),
    body('email').isEmail().withMessage('El email debe ser válido').escape(),
    body('password').notEmpty().withMessage('El password no puede ir vacío').escape(),
    body('confirmar').notEmpty().withMessage('Confirmar password no puede ir vacío').escape(),
    body('confirmar').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('El password es diferente');
        }
        return true;
    }),

    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            req.flash('error', errores.mapped(error => error.msg));

            res.render('crear-cuenta', {
                nombrePagina: 'Crea tu cuenta en devJobs',
                tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
                mensajes: req.flash()
            });
            return;
        }
        next(); 
    }
];

exports.crearUsuario = async (req, res, next) => {
    const usuario = new Usuarios(req.body);

    const nuevoUsuario = await usuario.save();

    if(!nuevoUsuario) return next();

    res.redirect('/iniciar-sesion');
}