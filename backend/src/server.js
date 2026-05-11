const express = require("express");
const cors = require("cors");
require("dotenv").config();

const zonasRoutes = require("./routes/zonas.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const horariosRoutes = require("./routes/horarios.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "API del Sistema de Gestión de Residuos Sólidos en Cusco funcionando correctamente",
  });
});

app.use("/api/zonas", zonasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/horarios", horariosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor backend ejecutándose en http://localhost:${PORT}`);
});