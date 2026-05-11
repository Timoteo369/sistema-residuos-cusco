const express = require("express");
const router = express.Router();

const UsuarioController = require("../controllers/usuarios.controller");

router.post("/registro", UsuarioController.registrarUsuario);
router.post("/login", UsuarioController.loginUsuario);

module.exports = router;