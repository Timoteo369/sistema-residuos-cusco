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
      rol: "ciudadano",
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

const listarUsuarios = async (req, res) => {
  try {
    const { rol } = req.query;
    const usuarios = await UsuarioModel.obtenerTodosUsuarios(rol);
    res.json({ usuarios });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ mensaje: "Error al obtener la lista de usuarios" });
  }
};

const cambiarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (!['ciudadano', 'administrador'].includes(rol)) {
      return res.status(400).json({ mensaje: "Rol inválido" });
    }

    const usuarioActualizado = await UsuarioModel.actualizarRolUsuario(id, rol);

    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({
      mensaje: "Rol actualizado correctamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    res.status(500).json({ mensaje: "Error al actualizar el rol del usuario" });
  }
};

const crearUsuarioAdmin = async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol, id_zona } = req.body;

    if (!nombre || !correo || !contrasena || !rol || !id_zona) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });
    }

    if (!['ciudadano', 'administrador'].includes(rol)) {
      return res.status(400).json({ mensaje: "Rol inválido" });
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
      rol,
      id_zona,
    });

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: nuevoUsuario,
    });
  } catch (error) {
    console.error("Error al registrar usuario por admin:", error);
    res.status(500).json({
      mensaje: "Error interno al registrar usuario",
    });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  listarUsuarios,
  cambiarRol,
  crearUsuarioAdmin,
};