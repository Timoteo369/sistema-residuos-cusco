const pool = require("../config/db");

const crearIncidencia = async ({ descripcion, id_usuario, id_zona }) => {
  const result = await pool.query(
    `INSERT INTO incidencias (descripcion, id_usuario, id_zona)
     VALUES ($1, $2, $3)
     RETURNING id_incidencia, descripcion, fecha, estado, id_usuario, id_zona`,
    [descripcion, id_usuario, id_zona]
  );

  return result.rows[0];
};

const obtenerIncidencias = async () => {
  const result = await pool.query(
    `SELECT 
        i.id_incidencia,
        i.descripcion,
        i.fecha,
        i.estado,
        u.nombre AS ciudadano,
        z.nombre_zona,
        z.distrito
     FROM incidencias i
     INNER JOIN usuarios u ON i.id_usuario = u.id_usuario
     INNER JOIN zonas z ON i.id_zona = z.id_zona
     ORDER BY i.fecha DESC`
  );

  return result.rows;
};

module.exports = {
  crearIncidencia,
  obtenerIncidencias,
};