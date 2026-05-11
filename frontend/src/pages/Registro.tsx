import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

interface Zona {
  id_zona: number;
  nombre_zona: string;
  distrito: string;
  referencia: string;
}

function Registro() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [idZona, setIdZona] = useState("");
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"error" | "success">("error");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarZonas = async () => {
      try {
        const respuesta = await api.get("/zonas");
        setZonas(respuesta.data);
      } catch (error) {
        setMensaje("No se pudieron cargar las zonas.");
        setTipoMensaje("error");
      }
    };

    cargarZonas();
  }, []);

  const registrarCiudadano = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      await api.post("/usuarios/registro", {
        nombre,
        correo,
        contrasena,
        id_zona: Number(idZona),
      });

      setTipoMensaje("success");
      setMensaje("Usuario registrado correctamente. Redirigiendo al login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      setTipoMensaje("error");
      setMensaje(error.response?.data?.mensaje || "Error al registrar usuario.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-info">
          <h1>Registro ciudadano</h1>
          <p>
            Crea una cuenta para consultar horarios de recolección, conocer la
            clasificación de residuos y reportar incidencias en tu zona.
          </p>

          <div className="login-badges">
            <span>Participación ciudadana</span>
            <span>Consulta de horarios</span>
            <span>Reporte de incidencias</span>
            <span>Cusco sostenible</span>
          </div>
        </div>

        <div className="login-form-section">
          <h2>Crear cuenta</h2>
          <p className="subtitle">
            Complete sus datos para registrarse en el sistema.
          </p>

          <form className="login-form" onSubmit={registrarCiudadano}>
            <div>
              <label>Nombre completo</label>
              <input
                type="text"
                placeholder="Ejemplo: Carlos Huaman"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div>
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="ejemplo@gmail.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            <div>
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Ingrese una contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </div>

            <div>
              <label>Zona de recolección</label>
              <select value={idZona} onChange={(e) => setIdZona(e.target.value)}>
                <option value="">Seleccione una zona</option>
                {zonas.map((zona) => (
                  <option key={zona.id_zona} value={zona.id_zona}>
                    {zona.nombre_zona} - {zona.distrito}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={cargando}>
              {cargando ? "Registrando..." : "Registrarme"}
            </button>
          </form>

          {mensaje && <p className={tipoMensaje}>{mensaje}</p>}

          <p className="login-footer">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Registro;