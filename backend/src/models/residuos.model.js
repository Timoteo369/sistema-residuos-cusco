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

const registrarResiduo = async ({ nombre, tipo, descripcion }) => {
  const result = await pool.query(
    `INSERT INTO residuos (nombre, tipo, descripcion)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [nombre, tipo, descripcion]
  );

  return result.rows[0];
};

module.exports = {
  obtenerResiduos,
  obtenerResiduosPorTipo,
  registrarResiduo,
};