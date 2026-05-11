const ZonaModel = require("../models/zonas.model");

const listarZonas = async (req, res) => {
  try {
    const zonas = await ZonaModel.obtenerZonas();
    res.json(zonas);
  } catch (error) {
    console.error("Error al listar zonas:", error);
    res.status(500).json({
      mensaje: "Error al obtener zonas",
    });
  }
};

module.exports = {
  listarZonas,
};
