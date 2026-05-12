-- ============================================================
-- Datos iniciales para residuos_cusco
-- ============================================================

INSERT INTO zonas (nombre_zona, distrito, referencia) VALUES
('Centro Historico', 'Cusco', 'Plaza de Armas y calles principales'),
('San Sebastian', 'San Sebastian', 'Avenida de la Cultura'),
('Wanchaq', 'Wanchaq', 'Zona comercial y residencial');

INSERT INTO residuos (nombre, tipo, descripcion) VALUES
('Restos de comida', 'organico', 'Residuos biodegradables provenientes de alimentos'),
('Botellas de plastico', 'reciclable', 'Envases plasticos que pueden ser reciclados'),
('Papel y carton', 'reciclable', 'Materiales aprovechables para reciclaje'),
('Panales usados', 'no_reciclable', 'Residuo sanitario no reciclable');

INSERT INTO horarios (dia, hora_inicio, hora_fin, id_zona, id_residuo) VALUES
('Lunes', '07:00', '09:00', 1, 1),
('Martes', '07:00', '09:00', 1, 2),
('Miercoles', '08:00', '10:00', 2, 1),
('Jueves', '08:00', '10:00', 2, 3),
('Viernes', '06:30', '08:30', 3, 4);

-- Contraseña encriptada para 'admin123'
INSERT INTO usuarios (nombre, correo, contrasena, rol, id_zona) VALUES
('Administrador Principal', 'admin@residuos.com', '$2a$10$Uv67oM/qKpwV8b0H7.i4Kue2GgYhQvI.6tS0E5F/1o3e7oX0R.i/i', 'administrador', 1);
