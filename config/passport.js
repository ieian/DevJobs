const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Usuarios = mongoose.model('Usuarios');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

passport.use(new localStrategy({
    usernameField : 'email',
    passwordField : 'password'
    }, async (email, password, done) =>{
        const usuario = await Usuarios.findOne({ email });
        if(!usuario) return done(null, false, {
            message: 'El Usuario no existe'
        });

        const verificarPass = usuario.compararPassword(password);
        if(!verificarPass) return done(null, false, {
            message: 'Password incorrecto'
        });

        return done(null, usuario);
}));

passport.serializeUser((usuario, done) => done(null, usuario._id));

passport.deserializeUser(async(id, done) => {
    const usuario = await Usuarios.findById(id).exec();
    return done(null, usuario);
});

module.exports = passport;