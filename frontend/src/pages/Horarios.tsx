import { useEffect, useState } from "react";
import api from "../api/axios";

interface Horario {
  id_horario: number;
  dia: string;
  hora_inicio: string;
  hora_fin: string;
  nombre_zona: string;
  distrito: string;
  residuo: string;
  tipo_residuo: string;
}

function Horarios() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarHorarios = async () => {
      try {
        const respuesta = await api.get(`/horarios/zona/${usuario.id_zona}`);
        setHorarios(respuesta.data.horarios);
      } catch (error: any) {
        setMensaje(error.response?.data?.mensaje || "Error al cargar horarios");
      }
    };

    cargarHorarios();
  }, [usuario.id_zona]);

  const claseTipo = (tipoResiduo: string) => {
    if (tipoResiduo === "organico") return "type-badge type-organico";
    if (tipoResiduo === "reciclable") return "type-badge type-reciclable";
    return "type-badge type-no-reciclable";
  };

  const textoTipo = (tipoResiduo: string) => {
    if (tipoResiduo === "organico") return "Orgánico";
    if (tipoResiduo === "reciclable") return "Reciclable";
    return "No reciclable";
  };

  return (
    <div className="dashboard">
      <section className="page-header">
        <h1>Horarios de recolección</h1>
        <p>
          Consulta los días y horas de recolección asignados a tu zona para evitar
          acumulación de residuos en espacios públicos.
        </p>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span>Zona asignada</span>
          <strong>{usuario.id_zona}</strong>
        </div>

        <div className="stat-card">
          <span>Horarios registrados</span>
          <strong>{horarios.length}</strong>
        </div>

        <div className="stat-card">
          <span>Ciudadano</span>
          <strong>{usuario.nombre ? "Activo" : "-"}</strong>
        </div>
      </section>

      <section className="content-card">
        <h2>Horarios disponibles</h2>

        {mensaje && <p className="error">{mensaje}</p>}

        {horarios.length === 0 ? (
          <div className="empty-message">
            No existen horarios registrados para tu zona.
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Hora inicio</th>
                  <th>Hora fin</th>
                  <th>Zona</th>
                  <th>Residuo</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {horarios.map((horario) => (
                  <tr key={horario.id_horario}>
                    <td>{horario.dia}</td>
                    <td>{horario.hora_inicio}</td>
                    <td>{horario.hora_fin}</td>
                    <td>{horario.nombre_zona}</td>
                    <td>{horario.residuo}</td>
                    <td>
                      <span className={claseTipo(horario.tipo_residuo)}>
                        {textoTipo(horario.tipo_residuo)}
                      </span>
                    </td>
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

export default Horarios;