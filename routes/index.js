const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = () => {
    router.get('/', homeController.mostrarTrabajos);

    router.get('/vacantes/nueva', authController.verificarUsuario, vacantesController.formularioNuevaVacante);
    router.post('/vacantes/nueva', authController.verificarUsuario, vacantesController.validarVacante, vacantesController.agregarVacante);

    router.get('/vacantes/:url', vacantesController.mostrarVacante);
    router.post('/vacantes/:url', vacantesController.SubirCV, vacantesController.contactar);

    router.get('/vacantes/editar/:url', authController.verificarUsuario, vacantesController.formEditarVacante);
    router.post('/vacantes/editar/:url', authController.verificarUsuario, vacantesController.validarVacante, vacantesController.editarVacante);

    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta',usuariosController.validarRegistro, usuariosController.crearUsuario);

    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    router.get('/cerrar-sesion', authController.verificarUsuario, authController.cerrarSesion);

    router.get('/reestablecer-password', authController.formReestablecerPassword);
    router.post('/reestablecer-password', authController.enviarToken);

    router.get('/reestablecer-password/:token', authController.reestablecerPassword);
    router.post('/reestablecer-password/:token', authController.guardarPassword);

    router.get('/administracion', authController.verificarUsuario, authController.mostrarPanel);

    router.get('/editar-perfil', authController.verificarUsuario, usuariosController.formEditarPerfil);

    //router.post('/editar-perfil', authController.verificarUsuario, usuariosController.validarPerfil, usuariosController.editarPerfil);                                                            
    router.post('/editar-perfil', authController.verificarUsuario, usuariosController.subirImagen, usuariosController.editarPerfil);

    router.get('/candidatos/:id', authController.verificarUsuario, vacantesController.mostrarCandidatos);

    router.post('/buscador', vacantesController.buscarVacantes);

    return router;
}