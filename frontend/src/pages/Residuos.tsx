import { useEffect, useState } from "react";
import api from "../api/axios";

interface Residuo {
  id_residuo: number;
  nombre: string;
  tipo: string;
  descripcion: string;
}

function Residuos() {
  const [residuos, setResiduos] = useState<Residuo[]>([]);
  const [tipo, setTipo] = useState("todos");
  const [mensaje, setMensaje] = useState("");
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoResiduo, setNuevoResiduo] = useState({
    nombre: "",
    tipo: "organico",
    descripcion: ""
  });
  const [mensajeForm, setMensajeForm] = useState({ texto: "", esError: false });

  const cargarResiduos = async (tipoSeleccionado: string) => {
    try {
      setMensaje("");

      const ruta =
        tipoSeleccionado === "todos"
          ? "/residuos"
          : `/residuos/tipo/${tipoSeleccionado}`;

      const respuesta = await api.get(ruta);
      setResiduos(respuesta.data.residuos);
    } catch (error: any) {
      setMensaje(error.response?.data?.mensaje || "Error al cargar residuos");
    }
  };

  useEffect(() => {
    cargarResiduos(tipo);
  }, [tipo]);

  const registrarResiduo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/residuos", nuevoResiduo);
      setMensajeForm({ texto: "Residuo registrado correctamente.", esError: false });
      setNuevoResiduo({ nombre: "", tipo: "organico", descripcion: "" });
      setMostrarFormulario(false);
      cargarResiduos(tipo); // recargar la lista
    } catch (error: any) {
      setMensajeForm({ 
        texto: error.response?.data?.mensaje || "Error al registrar residuo", 
        esError: true 
      });
    }
  };

  const totalOrganicos = residuos.filter((r) => r.tipo === "organico").length;
  const totalReciclables = residuos.filter((r) => r.tipo === "reciclable").length;
  const totalNoReciclables = residuos.filter((r) => r.tipo === "no_reciclable").length;

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
        <h1>Clasificación de residuos</h1>
        <p>
          Consulta los residuos registrados y su clasificación para promover una
          segregación responsable: orgánicos, reciclables y no reciclables.
        </p>
        <button 
          className="button" 
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            setMensajeForm({ texto: "", esError: false });
          }}
          style={{ marginTop: '1rem' }}
        >
          {mostrarFormulario ? "Cancelar" : "Registrar Nuevo Residuo"}
        </button>
      </section>

      {mostrarFormulario && (
        <section className="content-card" style={{ marginBottom: '2rem' }}>
          <h2>Registrar Residuo</h2>
          {mensajeForm.texto && (
            <p className={mensajeForm.esError ? "error" : "success"} style={{ color: mensajeForm.esError ? 'red' : 'green', marginBottom: '1rem' }}>
              {mensajeForm.texto}
            </p>
          )}
          <form className="form" onSubmit={registrarResiduo}>
            <div className="form-group">
              <label>Nombre del Residuo</label>
              <input
                type="text"
                required
                value={nuevoResiduo.nombre}
                onChange={(e) => setNuevoResiduo({ ...nuevoResiduo, nombre: e.target.value })}
                placeholder="Ej. Botellas de vidrio"
              />
            </div>
            <div className="form-group">
              <label>Tipo de Clasificación</label>
              <select
                required
                value={nuevoResiduo.tipo}
                onChange={(e) => setNuevoResiduo({ ...nuevoResiduo, tipo: e.target.value })}
              >
                <option value="organico">Orgánico</option>
                <option value="reciclable">Reciclable</option>
                <option value="no_reciclable">No reciclable</option>
              </select>
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                required
                rows={3}
                value={nuevoResiduo.descripcion}
                onChange={(e) => setNuevoResiduo({ ...nuevoResiduo, descripcion: e.target.value })}
                placeholder="Breve descripción del residuo"
                style={{ padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '4px', resize: 'vertical' }}
              />
            </div>
            <button type="submit" className="button button-primary">Guardar Residuo</button>
          </form>
        </section>
      )}

      <section className="stats-grid">
        <div className="stat-card">
          <span>Orgánicos</span>
          <strong>{tipo === "todos" ? totalOrganicos : "-"}</strong>
        </div>

        <div className="stat-card">
          <span>Reciclables</span>
          <strong>{tipo === "todos" ? totalReciclables : "-"}</strong>
        </div>

        <div className="stat-card">
          <span>No reciclables</span>
          <strong>{tipo === "todos" ? totalNoReciclables : "-"}</strong>
        </div>
      </section>

      <section className="content-card">
        <h2>Listado de residuos</h2>

        <div className="form" style={{ marginBottom: "20px" }}>
          <label>Filtrar por tipo de residuo:</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="organico">Orgánico</option>
            <option value="reciclable">Reciclable</option>
            <option value="no_reciclable">No reciclable</option>
          </select>
        </div>

        {mensaje && <p className="error">{mensaje}</p>}

        {residuos.length === 0 ? (
          <div className="empty-message">No hay residuos para mostrar.</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Residuo</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {residuos.map((residuo) => (
                  <tr key={residuo.id_residuo}>
                    <td>{residuo.id_residuo}</td>
                    <td>{residuo.nombre}</td>
                    <td>
                      <span className={claseTipo(residuo.tipo)}>
                        {textoTipo(residuo.tipo)}
                      </span>
                    </td>
                    <td>{residuo.descripcion}</td>
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

export default Residuos;