const pool = require("../config/db");

const obtenerZonas = async () => {
  const result = await pool.query("SELECT * FROM zonas ORDER BY id_zona ASC");
  return result.rows;
};

module.exports = {
  obtenerZonas,
};