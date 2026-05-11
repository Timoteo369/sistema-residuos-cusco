const IncidenciaModel = require("../models/incidencias.model");

const registrarIncidencia = async (req, res) => {
  try {
    const { descripcion, id_zona } = req.body;
    const id_usuario = req.usuario.id_usuario;

    if (!descripcion || !id_zona) {
      return res.status(400).json({
        mensaje: "La descripción y la zona son obligatorias",
      });
    }

    const nuevaIncidencia = await IncidenciaModel.crearIncidencia({
      descripcion,
      id_usuario,
      id_zona,
    });

    res.status(201).json({
      mensaje: "Incidencia registrada correctamente",
      incidencia: nuevaIncidencia,
    });
  } catch (error) {
    console.error("Error al registrar incidencia:", error);
    res.status(500).json({
      mensaje: "Error interno al registrar incidencia",
    });
  }
};

const listarIncidencias = async (req, res) => {
  try {
    const incidencias = await IncidenciaModel.obtenerIncidencias();

    res.json({
      mensaje: "Incidencias obtenidas correctamente",
      incidencias,
    });
  } catch (error) {
    console.error("Error al listar incidencias:", error);
    res.status(500).json({
      mensaje: "Error interno al listar incidencias",
    });
  }
};

module.exports = {
  registrarIncidencia,
  listarIncidencias,
};