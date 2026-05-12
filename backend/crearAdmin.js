require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./src/config/db');

async function crearAdminDirecto() {
  try {
    const correo = 'admin@residuos.com';
    const contrasena = 'admin123';
    
    console.log(`Intentando crear administrador con correo: ${correo}`);
    
    // Verificar si ya existe
    const resultBusqueda = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    if (resultBusqueda.rows.length > 0) {
      console.log('El usuario ya existe. Actualizando su rol a administrador...');
      await pool.query('UPDATE usuarios SET rol = $1 WHERE correo = $2', ['administrador', correo]);
      console.log('Rol actualizado exitosamente.');
      process.exit(0);
    }
    
    // Encriptar la contraseña (importante, ya que no se puede insertar texto plano directamente en SQL por cómo funciona el backend)
    const contrasenaCifrada = await bcrypt.hash(contrasena, 10);
    
    // Asignar a la primera zona disponible
    const zonas = await pool.query('SELECT id_zona FROM zonas LIMIT 1');
    const id_zona = zonas.rows.length > 0 ? zonas.rows[0].id_zona : null;
    
    // Insertar en la base de datos
    await pool.query(
      `INSERT INTO usuarios (nombre, correo, contrasena, rol, id_zona)
       VALUES ($1, $2, $3, $4, $5)`,
      ['Administrador Principal', correo, contrasenaCifrada, 'administrador', id_zona]
    );
    
    console.log('¡Éxito! Administrador creado.');
    console.log(`Correo: ${correo}`);
    console.log(`Contraseña: ${contrasena}`);
  } catch (error) {
    console.error('Error al crear el administrador:', error);
  } finally {
    await pool.end();
  }
}

crearAdminDirecto();
