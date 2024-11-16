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
    body('email').isEmail().withMessage('El email debe ser válido').normalizeEmail(),
    body('password').notEmpty().withMessage('El password no debe ir vacío').escape(),
    body('confirmar').notEmpty().withMessage('Confirmar password no debe ir vacío').escape()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('El password es diferente');
            }
            return true;
        }),

    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            req.flash('error', errores.array().map((error) => error.msg));

            res.render('crear-cuenta', {
                nombrePagina: 'Crea tu cuenta en devJobs',
                tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
                mensajes: req.flash(),
            });
            return;
        }
        next();
    }
];

exports.crearUsuario = async (req,res) => {
    const usuario = await new Usuarios(req.body);
 
    try{
        await usuario.save();
        res.redirect('/iniciar-sesion');
    }catch(error){
        req.flash('error', error);
        res.redirect('/crear-cuenta');
    }
}

exports.formIniciarSesion = (req,res) =>  {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar sesion en devJobs',
    });
}

exports.formEditarPerfil = (req, res) => {
    res.render('editar-perfil', {
        nombrePagina: 'Edita tu perfil en devJobs',
        usuario: req.user.toObject()
    });
}