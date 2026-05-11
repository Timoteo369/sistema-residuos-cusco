function Panel() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  return (
    <div className="card">
      <h1>Panel ciudadano</h1>
      <p>Bienvenido al sistema de gestión de residuos sólidos en Cusco.</p>

      <h3>Datos del usuario</h3>
      <p><strong>Nombre:</strong> {usuario.nombre}</p>
      <p><strong>Correo:</strong> {usuario.correo}</p>
      <p><strong>Rol:</strong> {usuario.rol}</p>
      <p><strong>Zona:</strong> {usuario.id_zona}</p>
    </div>
  );
}

export default Panel;