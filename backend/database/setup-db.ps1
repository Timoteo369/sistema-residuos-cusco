# ============================================================
# Script para configurar la base de datos residuos_cusco
# Proyecto: Sistema inteligente para la gestión de residuos sólidos en Cusco
# ============================================================

$PSQL_PATH = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
$DB_NAME = "residuos_cusco"
$DB_USER = "postgres"

Write-Host "Configurando base de datos $DB_NAME..." -ForegroundColor Cyan

if (!(Test-Path $PSQL_PATH)) {
    Write-Host "ERROR: No se encontro psql en la ruta:" -ForegroundColor Red
    Write-Host $PSQL_PATH -ForegroundColor Red
    Write-Host "Modifica la variable PSQL_PATH en setup-db.ps1 segun tu version de PostgreSQL." -ForegroundColor Yellow
    exit
}

$DB_PASSWORD = Read-Host "Ingrese la contraseña del usuario postgres" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASSWORD)
$PLAIN_PASSWORD = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

$env:PGPASSWORD = $PLAIN_PASSWORD

Write-Host "Verificando si la base de datos existe..." -ForegroundColor Yellow

$DB_EXISTS = & $PSQL_PATH -U $DB_USER -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'"

if ($DB_EXISTS -eq "1") {
    Write-Host "La base de datos $DB_NAME ya existe. Se reutilizara." -ForegroundColor Green
} else {
    Write-Host "Creando base de datos $DB_NAME..." -ForegroundColor Yellow
    & $PSQL_PATH -U $DB_USER -d postgres -f "00_create_database.sql"
}

Write-Host "Creando tablas..." -ForegroundColor Yellow
& $PSQL_PATH -U $DB_USER -d $DB_NAME -f "01_schema.sql"

Write-Host "Insertando datos iniciales..." -ForegroundColor Yellow
& $PSQL_PATH -U $DB_USER -d $DB_NAME -f "02_seed.sql"

Remove-Item Env:\PGPASSWORD

Write-Host "Base de datos configurada correctamente." -ForegroundColor Green