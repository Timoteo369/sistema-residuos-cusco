const pool = require("../config/db");

const obtenerResiduos = async () => {
  const result = await pool.query(
    "SELECT * FROM residuos ORDER BY id_residuo ASC"
  );

  return result.rows;
};

const obtenerResiduosPorTipo = async (tipo) => {
  const result = await pool.query(
    "SELECT * FROM residuos WHERE tipo = $1 ORDER BY id_residuo ASC",
    [tipo]
  );

  return result.rows;
};

module.exports = {
  obtenerResiduos,
  obtenerResiduosPorTipo,
};