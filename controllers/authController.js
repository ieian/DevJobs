const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect : '/administracion',
    failureRedirect : '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage : 'Ambos campos son obligatorios'
});

exports.verificarUsuario = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    
    res.redirect('/iniciar-sesion');
};

exports.mostrarPanel = async (req, res) => {
    const vacantes = await Vacante.find({ autor: req.user._id }).lean();;

    res.render('administracion', {
        nombrePagina : 'Panel de Administracion',
        tagline : 'Crea y administra tus vacantes desde aqui',
        cerrarSesion: true,
        nombre : req.user.nombre,
        vacantes
    })
};

exports.cerrarSesion = (req, res, next) => {
    req.logout(function(err){
        if(err) {
            return next(err);
        }
        req.flash('correcto', 'Cerraste Sescion Correctamente');
        return res.redirect('/iniciar-sesion')
    });
};