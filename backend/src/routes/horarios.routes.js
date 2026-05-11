const express = require("express");
const router = express.Router();

const HorarioController = require("../controllers/horarios.controller");
const { verificarToken } = require("../middlewares/auth.middleware");

router.get("/zona/:id_zona", verificarToken, HorarioController.listarHorariosPorZona);

module.exports = router;