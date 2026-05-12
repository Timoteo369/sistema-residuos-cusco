const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    // Verificar que el usuario existe (verificarToken debe estar antes)
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado",
      });
    }

    // Verificar si el rol del usuario está en los roles permitidos
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: "Acceso denegado. Rol insuficiente",
        rolActual: req.usuario.rol,
        rolesPermitidos,
      });
    }

    next();
  };
};

module.exports = {
  verificarRol,
};
