const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UsuarioModel = require("../models/usuarios.model");

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena, id_zona } = req.body;

    if (!nombre || !correo || !contrasena || !id_zona) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });
    }

    const usuarioExistente = await UsuarioModel.buscarUsuarioPorCorreo(correo);

    if (usuarioExistente) {
      return res.status(400).json({
        mensaje: "El correo ya se encuentra registrado",
      });
    }

    const contrasenaCifrada = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = await UsuarioModel.crearUsuario({
      nombre,
      correo,
      contrasena: contrasenaCifrada,
      rol: "ciudadano", // Los usuarios nuevos siempre se registran como ciudadanos
      id_zona,
    });

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: nuevoUsuario,
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({
      mensaje: "Error interno al registrar usuario",
    });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({
        mensaje: "Correo y contraseña son obligatorios",
      });
    }

    const usuario = await UsuarioModel.buscarUsuarioPorCorreo(correo);

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas",
      });
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas",
      });
    }

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo,
        rol: usuario.rol,
        id_zona: usuario.id_zona,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.json({
      mensaje: "Inicio de sesión correcto",
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        id_zona: usuario.id_zona,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({
      mensaje: "Error interno al iniciar sesión",
    });
  }
};

const obtenerPerfil = async (req, res) => {
  res.json({
    mensaje: "Perfil obtenido correctamente",
    usuario: req.usuario,
  });
};

// NUEVAS FUNCIONES PARA GESTIÓN DE ROLES

/**
 * Obtener todos los usuarios (Solo administradores)
 */
const obtenerTodosLosUsuarios = async (req, res) => {
  try {
    const usuarios = await UsuarioModel.obtenerTodosLosUsuarios();

    res.json({
      mensaje: "Usuarios obtenidos correctamente",
      total: usuarios.length,
      usuarios: usuarios.map((u) => ({
        id_usuario: u.id_usuario,
        nombre: u.nombre,
        correo: u.correo,
        rol: u.rol,
        id_zona: u.id_zona,
      })),
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({
      mensaje: "Error interno al obtener usuarios",
    });
  }
};

/**
 * Cambiar rol de un usuario (Solo administradores)
 */
const cambiarRolUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { rol } = req.body;

    // Validar que el rol sea válido
    const rolesValidos = ["ciudadano", "administrador"];
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({
        mensaje: `Rol inválido. Los roles permitidos son: ${rolesValidos.join(", ")}`,
      });
    }

    // Verificar que el usuario existe
    const usuario = await UsuarioModel.obtenerUsuarioPorId(id_usuario);
    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    // Actualizar el rol
    const usuarioActualizado = await UsuarioModel.actualizarRolUsuario(id_usuario, rol);

    res.json({
      mensaje: "Rol del usuario actualizado correctamente",
      usuario: {
        id_usuario: usuarioActualizado.id_usuario,
        nombre: usuarioActualizado.nombre,
        correo: usuarioActualizado.correo,
        rol: usuarioActualizado.rol,
        id_zona: usuarioActualizado.id_zona,
      },
    });
  } catch (error) {
    console.error("Error al cambiar rol:", error);
    res.status(500).json({
      mensaje: "Error interno al cambiar rol",
    });
  }
};

/**
 * Obtener usuarios por rol (Solo administradores)
 */
const obtenerUsuariosPorRol = async (req, res) => {
  try {
    const { rol } = req.params;

    const rolesValidos = ["ciudadano", "administrador"];
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({
        mensaje: `Rol inválido. Los roles permitidos son: ${rolesValidos.join(", ")}`,
      });
    }

    const usuarios = await UsuarioModel.obtenerUsuariosPorRol(rol);

    res.json({
      mensaje: `Usuarios con rol "${rol}" obtenidos correctamente`,
      total: usuarios.length,
      rol,
      usuarios: usuarios.map((u) => ({
        id_usuario: u.id_usuario,
        nombre: u.nombre,
        correo: u.correo,
        id_zona: u.id_zona,
      })),
    });
  } catch (error) {
    console.error("Error al obtener usuarios por rol:", error);
    res.status(500).json({
      mensaje: "Error interno al obtener usuarios",
    });
  }
};
// AGREGAR ESTA NUEVA FUNCIÓN al final antes del module.exports

/**
 * Crear primer administrador (solo si no existe ninguno)
 */
const crearPrimerAdmin = async (req, res) => {
  try {
    const { nombre, correo, contrasena, clave_secreta } = req.body;

    // Validar que la clave secreta sea correcta (la defines en .env)
    if (clave_secreta !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({
        mensaje: "Clave secreta inválida",
      });
    }

    // Verificar si ya existe algún administrador
    const adminExistente = await UsuarioModel.obtenerUsuariosPorRol("administrador");
    if (adminExistente.length > 0) {
      return res.status(400).json({
        mensaje: "Ya existe un administrador en el sistema",
      });
    }

    // Validar campos obligatorios
    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({
        mensaje: "Nombre, correo y contraseña son obligatorios",
      });
    }

    // Verificar si el correo ya existe
    const usuarioExistente = await UsuarioModel.buscarUsuarioPorCorreo(correo);
    if (usuarioExistente) {
      return res.status(400).json({
        mensaje: "El correo ya se encuentra registrado",
      });
    }

    // Cifrar contraseña
    const contrasenaCifrada = await bcrypt.hash(contrasena, 10);

    // Crear el primer admin sin id_zona (opcional para admin)
    const primerAdmin = await UsuarioModel.crearUsuario({
      nombre,
      correo,
      contrasena: contrasenaCifrada,
      rol: "administrador",
      id_zona: null,
    });

    res.status(201).json({
      mensaje: "Primer administrador creado correctamente",
      usuario: {
        id_usuario: primerAdmin.id_usuario,
        nombre: primerAdmin.nombre,
        correo: primerAdmin.correo,
        rol: primerAdmin.rol,
      },
    });
  } catch (error) {
    console.error("Error al crear primer admin:", error);
    res.status(500).json({
      mensaje: "Error interno al crear administrador",
    });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  obtenerTodosLosUsuarios,
  cambiarRolUsuario,
  obtenerUsuariosPorRol,
  crearPrimerAdmin,  // AGREGAR ESTA LÍNEA
};

