import { useEffect, useState } from "react";
import api from "../api/axios";

interface Incidencia {
  id_incidencia: number;
  descripcion: string;
  fecha: string;
  estado: string;
  ciudadano: string;
  nombre_zona: string;
  distrito: string;
}

function Incidencias() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const [descripcion, setDescripcion] = useState("");
  const [idZona, setIdZona] = useState(usuario.id_zona || "");
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"error" | "success">("success");
  const [cargando, setCargando] = useState(false);

  const cargarIncidencias = async () => {
    try {
      const respuesta = await api.get("/incidencias");
      setIncidencias(respuesta.data.incidencias);
    } catch (error: any) {
      setTipoMensaje("error");
      setMensaje(error.response?.data?.mensaje || "Error al cargar incidencias");
    }
  };

  useEffect(() => {
    cargarIncidencias();
  }, []);

  const registrarIncidencia = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      await api.post("/incidencias", {
        descripcion,
        id_zona: Number(idZona),
      });

      setTipoMensaje("success");
      setMensaje("Incidencia registrada correctamente.");

      setDescripcion("");
      cargarIncidencias();
    } catch (error: any) {
      setTipoMensaje("error");
      setMensaje(error.response?.data?.mensaje || "Error al registrar incidencia");
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const claseEstado = (estado: string) => {
    if (estado === "pendiente") return "badge badge-pendiente";
    if (estado === "en_proceso") return "badge badge-en-proceso";
    return "badge badge-atendida";
  };

  return (
    <div className="dashboard">
      <section className="page-header">
        <h1>Incidencias ciudadanas</h1>
        <p>
          Reporta problemas relacionados con acumulación de residuos, retrasos del
          camión recolector o zonas no atendidas.
        </p>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span>Total de incidencias</span>
          <strong>{incidencias.length}</strong>
        </div>

        <div className="stat-card">
          <span>Zona del ciudadano</span>
          <strong>{usuario.id_zona}</strong>
        </div>

        <div className="stat-card">
          <span>Estado inicial</span>
          <strong>Pendiente</strong>
        </div>
      </section>

      <section className="content-card">
        <h2>Registrar nueva incidencia</h2>

        <form className="form-grid" onSubmit={registrarIncidencia}>
          <div>
            <label>Zona asignada</label>
            <input
              type="number"
              value={idZona}
              onChange={(e) => setIdZona(e.target.value)}
              placeholder="ID de zona"
            />
          </div>

          <div>
            <label>Descripción de la incidencia</label>
            <textarea
              placeholder="Ejemplo: Hay acumulación de basura cerca del mercado de la zona."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <button type="submit" disabled={cargando}>
            {cargando ? "Registrando..." : "Registrar incidencia"}
          </button>
        </form>

        {mensaje && <p className={tipoMensaje}>{mensaje}</p>}
      </section>

      <section className="content-card">
        <h2>Incidencias registradas</h2>

        {incidencias.length === 0 ? (
          <div className="empty-message">No existen incidencias registradas.</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descripción</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Ciudadano</th>
                  <th>Zona</th>
                  <th>Distrito</th>
                </tr>
              </thead>
              <tbody>
                {incidencias.map((incidencia) => (
                  <tr key={incidencia.id_incidencia}>
                    <td>{incidencia.id_incidencia}</td>
                    <td>{incidencia.descripcion}</td>
                    <td>{formatearFecha(incidencia.fecha)}</td>
                    <td>
                      <span className={claseEstado(incidencia.estado)}>
                        {incidencia.estado}
                      </span>
                    </td>
                    <td>{incidencia.ciudadano}</td>
                    <td>{incidencia.nombre_zona}</td>
                    <td>{incidencia.distrito}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Incidencias;