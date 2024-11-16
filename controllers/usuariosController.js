const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const shortid = require('shortid');

exports.subirImagen = (req, res, next) => {
    upload (req, res, function(error) {
        if(error) {
            if(error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande: Maximo 100kb')
                } else {
                    req.flash('error', error.message);
                }
            } else {
                req.flash('error', error.message);
            }
            res.redirect('/administracion');
            return;
        } else {
            return next();
        }
    });
}

const configuracionMulter = {
    limits : { fileSize : 100000 },
    storage: fileStorage = multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, __dirname+'../../public/uploads/perfiles')
        },
        filename : (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Formato No Valido'), false);
        }
    }
}

const upload = multer(configuracionMulter).single('imagen');

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
        usuario: req.user.toObject(),
        cerrarSesion: true,
        nombre : req.user.nombre,
    });
}

exports.editarPerfil = async (req, res) => {
    const usuario = await Usuarios.findById(req.user._id);

    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    if(req.body.password) {
        usuario.password = req.body.password
    }

    if(req.file) {
        usuario.imagen = req.file.filename;
    }

    await usuario.save();

    req.flash('correcto', 'Cambios Guardados Correctamente');

    res.redirect('/administracion');
}

exports.validarPerfil = async (req, res, next) => {
    const rules = [
        body('nombre').not().isEmpty().withMessage('El nombre es obligatorio').escape(),
        body('email').isEmail().withMessage('El email es obligatorio').normalizeEmail()
    ];
 
    await Promise.all(rules.map(validation => validation.run(req)));
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        req.flash('error', errores.array().map(error => error.msg));
        res.render('editar-perfil', {
            nombrePagina: 'Edita tu perfil en DevJobs',
            usuario: req.user.toObject(),
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes: req.flash()
        })
        return;
    }
 
    next();
}