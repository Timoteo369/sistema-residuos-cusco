const express = require("express");
const router = express.Router();

const IncidenciaController = require("../controllers/incidencias.controller");
const { verificarToken } = require("../middlewares/auth.middleware");

router.post("/", verificarToken, IncidenciaController.registrarIncidencia);
router.get("/", verificarToken, IncidenciaController.listarIncidencias);

module.exports = router;