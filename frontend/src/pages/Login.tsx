import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");

  const iniciarSesion = async (e: React.FormEvent) => {
    e.preventDefault();

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
    }
  };

  return (
    <div className="card">
      <h1>Iniciar sesión</h1>
      <p>Ingrese sus credenciales para acceder al sistema.</p>

      <form className="form" onSubmit={iniciarSesion}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

        <button type="submit">Ingresar</button>
      </form>

      {mensaje && <p className="error">{mensaje}</p>}
    </div>
  );
}

export default Login;