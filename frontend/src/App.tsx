import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Panel from "./pages/Panel";
import Zonas from "./pages/Zonas";
import Residuos from "./pages/Residuos";
import Horarios from "./pages/Horarios";
import Incidencias from "./pages/Incidencias";
import Usuarios from "./pages/Usuarios";
import "./styles/app.css";

function App() {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navbar">
          <div className="brand">
            <div className="brand-icon">SR</div>
            <div>
              <h2>Sistema Residuos Cusco</h2>
              <span>Gestión ambiental urbana</span>
            </div>
          </div>
          
          <div className="nav-links">
            {token ? (
              <>
                <Link to="/panel">Panel</Link>
                <Link to="/zonas">Zonas</Link>
                <Link to="/residuos">Residuos</Link>
                <Link to="/horarios">Horarios</Link>
                <Link to="/incidencias">Incidencias</Link>
                {usuario?.rol === 'administrador' && (
                  <Link to="/panel/usuarios">Usuarios</Link>
                )}
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("usuario");
                    window.location.href = "/login";
                  }}
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/registro">Registro</Link>
              </>
            )}
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to={token ? "/panel" : "/login"} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/panel" element={token ? <Panel /> : <Navigate to="/login" />} />
            <Route path="/zonas" element={token ? <Zonas /> : <Navigate to="/login" />} />
            <Route path="/residuos" element={token ? <Residuos /> : <Navigate to="/login" />} />
            <Route path="/horarios" element={token ? <Horarios /> : <Navigate to="/login" />} />
            <Route path="/incidencias" element={token ? <Incidencias /> : <Navigate to="/login" />} />
            <Route path="/panel/usuarios" element={token && usuario?.rol === 'administrador' ? <Usuarios /> : <Navigate to="/panel" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;