const express = require("express");
const router = express.Router();

const UsuarioController = require("../controllers/usuarios.controller");
const { verificarToken, verificarRol } = require("../middlewares/auth.middleware");

router.post("/registro", UsuarioController.registrarUsuario);
router.post("/login", UsuarioController.loginUsuario);
router.get("/perfil", verificarToken, UsuarioController.obtenerPerfil);

// Rutas de administrador
router.get("/", verificarToken, verificarRol(['administrador']), UsuarioController.listarUsuarios);
router.put("/:id/rol", verificarToken, verificarRol(['administrador']), UsuarioController.cambiarRol);
router.post("/admin-registro", verificarToken, verificarRol(['administrador']), UsuarioController.crearUsuarioAdmin);

module.exports = router;