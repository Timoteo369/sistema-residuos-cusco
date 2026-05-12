-- ============================================================
-- Esquema de base de datos: residuos_cusco
-- Crea las tablas principales del MVP
-- ============================================================

DROP TABLE IF EXISTS incidencias;
DROP TABLE IF EXISTS horarios;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS residuos;
DROP TABLE IF EXISTS zonas;

CREATE TABLE zonas (
    id_zona SERIAL PRIMARY KEY,
    nombre_zona VARCHAR(100) NOT NULL,
    distrito VARCHAR(100) NOT NULL,
    referencia VARCHAR(150)
);

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(30) NOT NULL CHECK (rol IN ('ciudadano', 'administrador')),
    id_zona INT,
    FOREIGN KEY (id_zona) REFERENCES zonas(id_zona)
);

CREATE TABLE residuos (
    id_residuo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('organico', 'reciclable', 'no_reciclable')),
    descripcion TEXT
);

CREATE TABLE horarios (
    id_horario SERIAL PRIMARY KEY,
    dia VARCHAR(20) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    id_zona INT NOT NULL,
    id_residuo INT NOT NULL,
    FOREIGN KEY (id_zona) REFERENCES zonas(id_zona),
    FOREIGN KEY (id_residuo) REFERENCES residuos(id_residuo)
);

CREATE TABLE incidencias (
    id_incidencia SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente'
        CHECK (estado IN ('pendiente', 'en_proceso', 'atendida')),
    id_usuario INT NOT NULL,
    id_zona INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_zona) REFERENCES zonas(id_zona)
);