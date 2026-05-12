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

const obtenerTodosUsuarios = async (rolFiltro) => {
  let query = "SELECT id_usuario, nombre, correo, rol, id_zona FROM usuarios";
  const params = [];

  if (rolFiltro) {
    query += " WHERE rol = $1";
    params.push(rolFiltro);
  }

  query += " ORDER BY id_usuario DESC";

  const result = await pool.query(query, params);
  return result.rows;
};

const actualizarRolUsuario = async (id_usuario, nuevo_rol) => {
  const result = await pool.query(
    "UPDATE usuarios SET rol = $1 WHERE id_usuario = $2 RETURNING id_usuario, nombre, correo, rol, id_zona",
    [nuevo_rol, id_usuario]
  );
  return result.rows[0];
};

module.exports = {
  buscarUsuarioPorCorreo,
  crearUsuario,
  obtenerTodosUsuarios,
  actualizarRolUsuario,
};