const express = require("express");
const router = express.Router();

const UsuarioController = require("../controllers/usuarios.controller");
const { verificarToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/authorizacion.middleware");

// Rutas públicas
router.post("/registro", UsuarioController.registrarUsuario);
router.post("/login", UsuarioController.loginUsuario);
router.post("/crear-primer-admin", UsuarioController.crearPrimerAdmin);  // AGREGAR ESTA LÍNEA

// Rutas protegidas - Todos los usuarios autenticados
router.get("/perfil", verificarToken, UsuarioController.obtenerPerfil);

// Rutas protegidas - Solo administradores
router.get(
  "/",
  verificarToken,
  verificarRol(["administrador"]),
  UsuarioController.obtenerTodosLosUsuarios
);

router.put(
  "/:id_usuario/rol",
  verificarToken,
  verificarRol(["administrador"]),
  UsuarioController.cambiarRolUsuario
);

router.get(
  "/rol/:rol",
  verificarToken,
  verificarRol(["administrador"]),
  UsuarioController.obtenerUsuariosPorRol
);

module.exports = router;
