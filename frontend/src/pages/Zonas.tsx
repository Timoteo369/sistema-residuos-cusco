import { useEffect, useState } from "react";
import api from "../api/axios";

interface Zona {
  id_zona: number;
  nombre_zona: string;
  distrito: string;
  referencia: string;
}

function Zonas() {
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarZonas = async () => {
      try {
        const respuesta = await api.get("/zonas");
        setZonas(respuesta.data);
      } catch (error: any) {
        setMensaje(error.response?.data?.mensaje || "Error al cargar zonas");
      }
    };

    cargarZonas();
  }, []);

  return (
    <div className="dashboard">
      <section className="page-header">
        <h1>Zonas de recolección</h1>
        <p>
          Consulta las zonas registradas para organizar el servicio de recolección
          de residuos sólidos en la ciudad del Cusco.
        </p>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span>Total de zonas registradas</span>
          <strong>{zonas.length}</strong>
        </div>

        <div className="stat-card">
          <span>Ciudad</span>
          <strong>Cusco</strong>
        </div>

        <div className="stat-card">
          <span>Uso principal</span>
          <strong>Rutas</strong>
        </div>
      </section>

      <section className="content-card">
        <h2>Listado de zonas</h2>

        {mensaje && <p className="error">{mensaje}</p>}

        {zonas.length === 0 ? (
          <div className="empty-message">No hay zonas registradas.</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Zona</th>
                  <th>Distrito</th>
                  <th>Referencia</th>
                </tr>
              </thead>
              <tbody>
                {zonas.map((zona) => (
                  <tr key={zona.id_zona}>
                    <td>{zona.id_zona}</td>
                    <td>{zona.nombre_zona}</td>
                    <td>{zona.distrito}</td>
                    <td>{zona.referencia}</td>
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

export default Zonas;