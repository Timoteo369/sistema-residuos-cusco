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

// NUEVAS FUNCIONES

/**
 * Obtener todos los usuarios
 */
const obtenerTodosLosUsuarios = async () => {
  const result = await pool.query(
    `SELECT id_usuario, nombre, correo, rol, id_zona 
     FROM usuarios 
     ORDER BY nombre ASC`
  );

  return result.rows;
};

/**
 * Obtener usuario por ID
 */
const obtenerUsuarioPorId = async (id_usuario) => {
  const result = await pool.query(
    "SELECT * FROM usuarios WHERE id_usuario = $1",
    [id_usuario]
  );

  return result.rows[0];
};

/**
 * Actualizar rol del usuario
 */
const actualizarRolUsuario = async (id_usuario, rol) => {
  const result = await pool.query(
    `UPDATE usuarios 
     SET rol = $1 
     WHERE id_usuario = $2
     RETURNING id_usuario, nombre, correo, rol, id_zona`,
    [rol, id_usuario]
  );

  return result.rows[0];
};

/**
 * Obtener usuarios por rol específico
 */
const obtenerUsuariosPorRol = async (rol) => {
  const result = await pool.query(
    `SELECT id_usuario, nombre, correo, rol, id_zona 
     FROM usuarios 
     WHERE rol = $1 
     ORDER BY nombre ASC`,
    [rol]
  );

  return result.rows;
};

module.exports = {
  buscarUsuarioPorCorreo,
  crearUsuario,
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  actualizarRolUsuario,
  obtenerUsuariosPorRol,
};
