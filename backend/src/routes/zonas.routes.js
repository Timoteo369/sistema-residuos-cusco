const express = require("express");
const router = express.Router();

const ZonaController = require("../controllers/zonas.controller");

router.get("/", ZonaController.listarZonas);

module.exports = router;