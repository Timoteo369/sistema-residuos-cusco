const HorarioModel = require("../models/horarios.model");

const listarHorariosPorZona = async (req, res) => {
  try {
    const { id_zona } = req.params;

    if (!id_zona) {
      return res.status(400).json({
        mensaje: "El id de la zona es obligatorio",
      });
    }

    const horarios = await HorarioModel.obtenerHorariosPorZona(id_zona);

    if (horarios.length === 0) {
      return res.status(404).json({
        mensaje: "No existen horarios registrados para esta zona",
      });
    }

    res.json({
      mensaje: "Horarios obtenidos correctamente",
      horarios,
    });
  } catch (error) {
    console.error("Error al obtener horarios:", error);
    res.status(500).json({
      mensaje: "Error interno al obtener horarios",
    });
  }
};

module.exports = {
  listarHorariosPorZona,
};