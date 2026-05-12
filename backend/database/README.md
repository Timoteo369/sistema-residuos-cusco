# Base de datos - residuos_cusco

Esta carpeta contiene los scripts necesarios para crear y cargar la base de datos local del proyecto.

## Requisitos

- PostgreSQL instalado.
- pgAdmin o psql disponible.
- Usuario PostgreSQL: postgres.

## Archivos

| Archivo | Descripción |
|---|---|
| 00_create_database.sql | Crea la base de datos residuos_cusco |
| 01_schema.sql | Crea las tablas principales |
| 02_seed.sql | Inserta datos iniciales |
| setup-db.ps1 | Ejecuta automáticamente los scripts en Windows |

## Ejecución manual desde pgAdmin

1. Crear la base de datos ejecutando:

```sql
CREATE DATABASE residuos_cusco;