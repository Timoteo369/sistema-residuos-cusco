const express = require("express");
const cors = require("cors");
require("dotenv").config();

const zonasRoutes = require("./routes/zonas.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const horariosRoutes = require("./routes/horarios.routes");
const incidenciasRoutes = require("./routes/incidencias.routes");
const residuosRoutes = require("./routes/residuos.routes");

const app = express();

const corsOptions = process.env.FRONTEND_URL
  ? { origin: process.env.FRONTEND_URL }
  : {};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje:
      "API del Sistema de Gestion de Residuos Solidos en Cusco funcionando correctamente",
  });
});

app.use("/api/zonas", zonasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/horarios", horariosRoutes);
app.use("/api/incidencias", incidenciasRoutes);
app.use("/api/residuos", residuosRoutes);

if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Servidor backend ejecutandose en http://localhost:${PORT}`);
  });
}

module.exports = app;
