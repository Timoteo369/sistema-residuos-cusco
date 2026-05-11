const pool = require("../config/db");

const buscarUsuarioPorCorreo = async (correo) => {
  const result = await pool.query(
    "SELECT * FROM usuarios WHERE correo = $1",
    [correo]
  );

  return result.rows[0];
};

const crearUsuario = async ({ nombre, correo, contrasena, rol, id_zona }) => {
  const result = await pool.query(
    `INSERT INTO usuarios (nombre, correo, contrasena, rol, id_zona)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id_usuario, nombre, correo, rol, id_zona`,
    [nombre, correo, contrasena, rol, id_zona]
  );

  return result.rows[0];
};

module.exports = {
  buscarUsuarioPorCorreo,
  crearUsuario,
};