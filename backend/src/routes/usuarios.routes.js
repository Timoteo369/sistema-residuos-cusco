const express = require("express");
const router = express.Router();

const UsuarioController = require("../controllers/usuarios.controller");
const { verificarToken } = require("../middlewares/auth.middleware");

router.post("/registro", UsuarioController.registrarUsuario);
router.post("/login", UsuarioController.loginUsuario);
router.get("/perfil", verificarToken, UsuarioController.obtenerPerfil);

module.exports = router;