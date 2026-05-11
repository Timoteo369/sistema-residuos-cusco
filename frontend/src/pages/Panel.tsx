import { Link } from "react-router-dom";

function Panel() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <div>
          <span className="hero-label">Panel ciudadano</span>
          <h1>Bienvenido, {usuario.nombre}</h1>
          <p>
            Desde este panel puedes consultar información sobre la recolección de
            residuos sólidos, revisar horarios, conocer la clasificación de residuos
            y reportar incidencias en tu zona.
          </p>
        </div>

        <div className="hero-card">
          <h3>Zona asignada</h3>
          <p className="hero-number">{usuario.id_zona}</p>
          <span>Gestión de residuos sólidos en Cusco</span>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="info-card">
          <div className="icon-box">👤</div>
          <h3>Datos del usuario</h3>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Correo:</strong> {usuario.correo}</p>
          <p><strong>Rol:</strong> {usuario.rol}</p>
        </div>

        <div className="info-card">
          <div className="icon-box">📍</div>
          <h3>Zonas de recolección</h3>
          <p>
            Consulta las zonas registradas para la organización del servicio de
            recolección de residuos sólidos.
          </p>
          <Link className="card-link" to="/zonas">Ver zonas</Link>
        </div>

        <div className="info-card">
          <div className="icon-box">♻️</div>
          <h3>Clasificación de residuos</h3>
          <p>
            Revisa los tipos de residuos: orgánicos, reciclables y no reciclables,
            para promover una correcta segregación.
          </p>
          <Link className="card-link" to="/residuos">Ver residuos</Link>
        </div>

        <div className="info-card">
          <div className="icon-box">🕒</div>
          <h3>Horarios de recolección</h3>
          <p>
            Consulta los horarios asignados a tu zona para sacar los residuos en el
            momento adecuado.
          </p>
          <Link className="card-link" to="/horarios">Ver horarios</Link>
        </div>

        <div className="info-card">
          <div className="icon-box">⚠️</div>
          <h3>Incidencias ciudadanas</h3>
          <p>
            Reporta acumulación de basura, retrasos del camión recolector o zonas no
            atendidas.
          </p>
          <Link className="card-link" to="/incidencias">Reportar incidencia</Link>
        </div>

        <div className="info-card impact-card">
          <div className="icon-box">🌎</div>
          <h3>Impacto ambiental</h3>
          <p>
            Este sistema busca mejorar la comunicación ciudadana, reducir la
            acumulación de residuos y fortalecer la gestión ambiental urbana en Cusco.
          </p>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Resumen del MVP</h2>
        <p>
          El Producto Mínimo Viable permite registrar ciudadanos, iniciar sesión,
          consultar zonas, visualizar residuos segregados, revisar horarios por zona y
          reportar incidencias ciudadanas.
        </p>

        <div className="summary-row">
          <div>
            <strong>Usuarios</strong>
            <span>Registro y autenticación</span>
          </div>
          <div>
            <strong>Zonas</strong>
            <span>Organización territorial</span>
          </div>
          <div>
            <strong>Residuos</strong>
            <span>Clasificación ambiental</span>
          </div>
          <div>
            <strong>Incidencias</strong>
            <span>Participación ciudadana</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Panel;