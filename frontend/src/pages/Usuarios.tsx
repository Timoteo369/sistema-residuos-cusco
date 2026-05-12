import { useEffect, useState } from "react";
import api from "../api/axios";

interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
  id_zona: number;
}

interface Zona {
  id_zona: number;
  nombre_zona: string;
}

function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [filtroRol, setFiltroRol] = useState<string>("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Estado para crear administrador
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoAdmin, setNuevoAdmin] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    rol: "administrador",
    id_zona: ""
  });

  const cargarUsuarios = async (rol: string) => {
    try {
      const endpoint = rol ? `/usuarios?rol=${rol}` : "/usuarios";
      const respuesta = await api.get(endpoint);
      setUsuarios(respuesta.data.usuarios);
    } catch (error: any) {
      setError(error.response?.data?.mensaje || "Error al cargar usuarios");
    }
  };

  const cargarZonas = async () => {
    try {
      const respuesta = await api.get("/zonas");
      setZonas(respuesta.data);
    } catch (error: any) {
      console.error("Error al cargar zonas", error);
    }
  };

  useEffect(() => {
    cargarUsuarios(filtroRol);
    cargarZonas();
  }, [filtroRol]);

  const cambiarRol = async (id: number, rolActual: string) => {
    const nuevoRol = rolActual === "ciudadano" ? "administrador" : "ciudadano";
    if (!window.confirm(`¿Estás seguro de cambiar el rol a ${nuevoRol}?`)) return;

    try {
      await api.put(`/usuarios/${id}/rol`, { rol: nuevoRol });
      setMensaje("Rol actualizado correctamente.");
      setError("");
      cargarUsuarios(filtroRol);
    } catch (error: any) {
      setError(error.response?.data?.mensaje || "Error al cambiar rol");
      setMensaje("");
    }
  };

  const registrarAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/usuarios/admin-registro", nuevoAdmin);
      setMensaje("Usuario administrador creado correctamente.");
      setError("");
      setMostrarFormulario(false);
      setNuevoAdmin({ ...nuevoAdmin, nombre: "", correo: "", contrasena: "" });
      cargarUsuarios(filtroRol);
    } catch (error: any) {
      setError(error.response?.data?.mensaje || "Error al crear administrador");
      setMensaje("");
    }
  };

  return (
    <div className="dashboard">
      <section className="page-header">
        <h1>Gestión de Usuarios</h1>
        <p>Administra los usuarios de la plataforma y asigna roles.</p>
        <button 
          className="button" 
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          style={{ marginTop: '1rem' }}
        >
          {mostrarFormulario ? "Cancelar" : "Crear Administrador"}
        </button>
      </section>

      {mostrarFormulario && (
        <section className="content-card" style={{ marginBottom: '2rem' }}>
          <h2>Nuevo Administrador</h2>
          <form className="form" onSubmit={registrarAdmin}>
            <div className="form-group">
              <label>Nombre Completo</label>
              <input
                type="text"
                required
                value={nuevoAdmin.nombre}
                onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, nombre: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                required
                value={nuevoAdmin.correo}
                onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, correo: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                required
                value={nuevoAdmin.contrasena}
                onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, contrasena: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Zona Principal (Opcional)</label>
              <select
                required
                value={nuevoAdmin.id_zona}
                onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, id_zona: e.target.value })}
              >
                <option value="">Seleccione una zona</option>
                {zonas.map((z) => (
                  <option key={z.id_zona} value={z.id_zona}>
                    {z.nombre_zona}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="button button-primary">Crear Administrador</button>
          </form>
        </section>
      )}

      <section className="stats-grid">
        <div className="stat-card">
          <span>Total Usuarios</span>
          <strong>{usuarios.length}</strong>
        </div>
        <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span>Filtrar por Rol</span>
          <select 
            value={filtroRol} 
            onChange={(e) => setFiltroRol(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">Todos</option>
            <option value="administrador">Administrador</option>
            <option value="ciudadano">Ciudadano</option>
          </select>
        </div>
      </section>

      <section className="content-card">
        <h2>Listado de Usuarios</h2>

        {error && <p className="error" style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        {mensaje && <p className="success" style={{ color: 'green', marginBottom: '1rem' }}>{mensaje}</p>}

        {usuarios.length === 0 ? (
          <div className="empty-message">No hay usuarios para mostrar.</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id_usuario}>
                    <td>{usuario.id_usuario}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.correo}</td>
                    <td>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: usuario.rol === 'administrador' ? '#e3f2fd' : '#f5f5f5',
                        color: usuario.rol === 'administrador' ? '#1565c0' : '#616161',
                        fontWeight: 'bold',
                        fontSize: '0.85rem'
                      }}>
                        {usuario.rol.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="button"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                        onClick={() => cambiarRol(usuario.id_usuario, usuario.rol)}
                      >
                        Hacer {usuario.rol === 'ciudadano' ? 'Admin' : 'Ciudadano'}
                      </button>
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

export default Usuarios;
