const express = require("express");
const router = express.Router();

const ResiduoController = require("../controllers/residuos.controller");
const { verificarToken } = require("../middlewares/auth.middleware");

router.get("/", verificarToken, ResiduoController.listarResiduos);
router.get("/tipo/:tipo", verificarToken, ResiduoController.listarResiduosPorTipo);
router.post("/", verificarToken, ResiduoController.crearResiduo);

module.exports = router;