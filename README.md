# Sistema inteligente para la gestion de residuos solidos en Cusco

Aplicacion web para gestionar zonas, tipos de residuos, horarios de recoleccion, usuarios e incidencias relacionadas con la gestion de residuos solidos en Cusco.

## Tecnologias

- Backend: Node.js, Express, PostgreSQL, JWT.
- Frontend: React, TypeScript, Vite, Axios, React Router.
- Base de datos: PostgreSQL.

## Requisitos previos

Antes de ejecutar el proyecto, instala:

- Node.js 18 o superior.
- npm.
- PostgreSQL.
- Git.

Tambien debes tener disponible el comando `psql`. En Windows suele estar en una ruta similar a:

```text
C:\Program Files\PostgreSQL\18\bin\psql.exe
```

Si tu version de PostgreSQL es diferente, cambia esa ruta en `backend/database/setup-db.ps1`.

## 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd SistemaResiduosCusco
```

## 2. Configurar variables de entorno del backend

Entra a la carpeta `backend` y crea el archivo `.env` usando como base el ejemplo:

```bash
cd backend
copy .env.example .env
```

En Linux o macOS:

```bash
cp .env.example .env
```

Luego edita `backend/.env` con tus datos locales de PostgreSQL:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_DE_POSTGRES
DB_NAME=residuos_cusco

JWT_SECRET=clave_secreta_residuos_cusco
```

Importante: `DB_PASSWORD` debe ser la contrasena real de tu usuario `postgres`.

## 3. Crear la base de datos

El proyecto incluye scripts SQL en:

```text
backend/database/
```

Archivos principales:

- `00_create_database.sql`: crea la base de datos `residuos_cusco`.
- `01_schema.sql`: crea las tablas.
- `02_seed.sql`: inserta datos iniciales.
- `setup-db.ps1`: automatiza la configuracion en Windows.

### Opcion A: Crear la base automaticamente en Windows

Desde PowerShell, entra a la carpeta de scripts:

```powershell
cd backend\database
.\setup-db.ps1
```

El script pedira la contrasena del usuario `postgres`, creara la base de datos si no existe, creara las tablas e insertara datos iniciales.

Si aparece un error indicando que no se encontro `psql`, abre `backend/database/setup-db.ps1` y modifica esta linea segun tu version instalada de PostgreSQL:

```powershell
$PSQL_PATH = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
```

### Opcion B: Crear la base manualmente

Puedes ejecutar los scripts en este orden usando pgAdmin o `psql`:

```sql
-- 1. Crear la base de datos
\i backend/database/00_create_database.sql

-- 2. Conectarte a residuos_cusco y crear tablas
\c residuos_cusco
\i backend/database/01_schema.sql

-- 3. Insertar datos iniciales
\i backend/database/02_seed.sql
```

Si usas pgAdmin, primero ejecuta `00_create_database.sql`; luego abre la base `residuos_cusco` y ejecuta `01_schema.sql` y `02_seed.sql`.

## 4. Instalar dependencias

Instala las dependencias del backend:

```bash
cd backend
npm install
```

Instala las dependencias del frontend:

```bash
cd ../frontend
npm install
```

## 5. Ejecutar el proyecto

Abre dos terminales.

Terminal 1, backend:

```bash
cd backend
npm run dev
```

El backend quedara disponible en:

```text
http://localhost:3000
```

Terminal 2, frontend:

```bash
cd frontend
npm run dev
```

Vite mostrara la URL local del frontend, normalmente:

```text
http://localhost:5173
```

## 6. Probar la conexion

Abre en el navegador:

```text
http://localhost:3000
```

Si todo esta correcto, el backend respondera con un mensaje indicando que la API esta funcionando.

Luego abre el frontend:

```text
http://localhost:5173
```

## Endpoints principales

El backend expone las rutas bajo `http://localhost:3000/api`:

- `/api/usuarios`
- `/api/zonas`
- `/api/residuos`
- `/api/horarios`
- `/api/incidencias`

## Problemas comunes

Si el backend no conecta a PostgreSQL:

- Verifica que PostgreSQL este encendido.
- Revisa que `DB_PASSWORD` en `backend/.env` sea correcto.
- Confirma que exista la base `residuos_cusco`.
- Confirma que PostgreSQL este usando el puerto `5432`.

Si el frontend no carga datos:

- Asegurate de que el backend este corriendo en `http://localhost:3000`.
- Revisa que `frontend/src/api/axios.ts` apunte a `http://localhost:3000/api`.

Si PowerShell bloquea `setup-db.ps1`, ejecuta:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\setup-db.ps1
```

## Notas

- No subas el archivo `backend/.env` a GitHub porque contiene credenciales locales.
- Usa `backend/.env.example` como plantilla para otros desarrolladores.
- La base de datos no esta incluida como archivo fisico en el repositorio; se crea localmente usando los scripts SQL.
