const pool = require("../config/db");

const obtenerHorariosPorZona = async (id_zona) => {
  const result = await pool.query(
    `SELECT 
        h.id_horario,
        h.dia,
        h.hora_inicio,
        h.hora_fin,
        z.nombre_zona,
        z.distrito,
        r.nombre AS residuo,
        r.tipo AS tipo_residuo
     FROM horarios h
     INNER JOIN zonas z ON h.id_zona = z.id_zona
     INNER JOIN residuos r ON h.id_residuo = r.id_residuo
     WHERE h.id_zona = $1
     ORDER BY h.id_horario ASC`,
    [id_zona]
  );

  return result.rows;
};

module.exports = {
  obtenerHorariosPorZona,
};