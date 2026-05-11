import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await api.post("/usuarios/login", {
        correo,
        contrasena,
      });

      localStorage.setItem("token", respuesta.data.token);
      localStorage.setItem("usuario", JSON.stringify(respuesta.data.usuario));

      navigate("/panel");
      window.location.reload();
    } catch (error: any) {
      setMensaje(error.response?.data?.mensaje || "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-info">
          <h1>Gestión inteligente de residuos sólidos</h1>
          <p>
            Plataforma web orientada a mejorar la recolección, segregación,
            comunicación ciudadana y gestión ambiental urbana en la ciudad del Cusco.
          </p>

          <div className="login-badges">
            <span>Horarios por zona</span>
            <span>Residuos segregados</span>
            <span>Incidencias</span>
            <span>Gestión ambiental</span>
          </div>
        </div>

        <div className="login-form-section">
          <h2>Iniciar sesión</h2>
          <p className="subtitle">
            Accede al sistema con tu correo y contraseña.
          </p>

          <form className="login-form" onSubmit={iniciarSesion}>
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
                placeholder="Ingrese su contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </div>

            <button type="submit" disabled={cargando}>
              {cargando ? "Ingresando..." : "Ingresar al sistema"}
            </button>
          </form>

          {mensaje && <p className="error">{mensaje}</p>}

          <p className="login-footer">
            ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;