const ResiduoModel = require("../models/residuos.model");

const listarResiduos = async (req, res) => {
  try {
    const residuos = await ResiduoModel.obtenerResiduos();

    res.json({
      mensaje: "Residuos obtenidos correctamente",
      residuos,
    });
  } catch (error) {
    console.error("Error al listar residuos:", error);
    res.status(500).json({
      mensaje: "Error interno al listar residuos",
    });
  }
};

const listarResiduosPorTipo = async (req, res) => {
  try {
    const { tipo } = req.params;

    const tiposPermitidos = ["organico", "reciclable", "no_reciclable"];

    if (!tiposPermitidos.includes(tipo)) {
      return res.status(400).json({
        mensaje: "Tipo de residuo no válido",
      });
    }

    const residuos = await ResiduoModel.obtenerResiduosPorTipo(tipo);

    res.json({
      mensaje: "Residuos filtrados correctamente",
      tipo,
      residuos,
    });
  } catch (error) {
    console.error("Error al filtrar residuos:", error);
    res.status(500).json({
      mensaje: "Error interno al filtrar residuos",
    });
  }
};

const crearResiduo = async (req, res) => {
  try {
    const { nombre, tipo, descripcion } = req.body;

    if (!nombre || !tipo || !descripcion) {
      return res.status(400).json({
        mensaje: "Nombre, tipo y descripción son obligatorios",
      });
    }

    const tiposPermitidos = ["organico", "reciclable", "no_reciclable"];
    if (!tiposPermitidos.includes(tipo)) {
      return res.status(400).json({
        mensaje: "Tipo de residuo no válido",
      });
    }

    const nuevoResiduo = await ResiduoModel.registrarResiduo({
      nombre,
      tipo,
      descripcion,
    });

    res.status(201).json({
      mensaje: "Residuo registrado correctamente",
      residuo: nuevoResiduo,
    });
  } catch (error) {
    console.error("Error al registrar residuo:", error);
    res.status(500).json({
      mensaje: "Error interno al registrar residuo",
    });
  }
};

module.exports = {
  listarResiduos,
  listarResiduosPorTipo,
  crearResiduo,
};