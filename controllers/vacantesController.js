const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const { body, validationResult } = require("express-validator");
const multer = require('multer');
const shortid = require('shortid');

exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante',{
        nombrePagina : 'Nueva Vacante',
        tagline : 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre : req.user.nombre,
        imagen : req.user.imagen
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
    const vacante = await Vacante.findOne({ url: req.params.url }).populate('autor').lean();
    
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
        nombrePagina : `Editar - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre : req.user.nombre,
        imagen : req.user.imagen
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

exports.validarVacante = async (req, res, next) => {
    const rules = [
        body("titulo").not().isEmpty().withMessage("Agrega el titulo de la Vacante").escape(),
        body("empresa").not().isEmpty().withMessage("Agrega la Empresa").escape(),
        body("ubicacion").not().isEmpty().withMessage("Agrega la ubicacion").escape(),
        body("contrato").not().isEmpty().withMessage("Selecciona el tipo de Contrato").escape(),
        body("skills").not().isEmpty().withMessage("Agrega por lo menos una habilidad").escape(),
      ];
      await Promise.all(rules.map((validation) => validation.run(req)));
      const errores = validationResult(req);

    if (!errores.isEmpty()) {
        req.flash('error', errores.array().map((error) => error.msg));
        res.render('nueva-vacante',{
            nombrePagina : 'Nueva Vacante',
            tagline : 'Llena el formulario y publica tu vacante',
            cerrarSesion: true,
            nombre : req.user.nombre,
            mensajes: req.flash(),
    });
    return;
  }
  next();
}

exports.eliminarVacante = async (req, res) => {
    const { id } =req.params;

    console.log(id);
}

exports.SubirCV = (req, res, next) => {
    upload (req, res, function(error) {
        if(error) {
            if(error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande: Maximo 150kb');
                } else {
                    req.flash('error', error.message);
                }
            } else {
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        } else {
            return next();
        }
    });
}

const configuracionMulter = {
    limits : { fileSize : 150000 },
    storage: fileStorage = multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, __dirname+'../../public/uploads/cv')
        },
        filename : (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if(file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Formato No Valido'), false);
        }
    }
}

const upload = multer(configuracionMulter).single('cv');

exports.contactar = async (req, res, next) => {
    const vacante = await Vacante.findOne({ url : req.params.url});

    if(!vacante) return next();

    const nuevoCandidato = {
        nombre : req.params.nombre,
        email : req.params.email,
        cv : req.file.filename
    }

    vacante.candidatos.push(nuevoCandidato);
    await vacante.save();

    req.flash('correrto', 'Se envio tu CV Correctamente');
    res.redirect('/');
}