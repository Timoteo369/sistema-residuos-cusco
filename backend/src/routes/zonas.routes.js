const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM zonas ORDER BY id_zona ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener zonas:", error);
    res.status(500).json({
      mensaje: "Error al obtener zonas",
    });
  }
});

module.exports = router;