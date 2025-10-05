# Setup Local - Desarrollo sin Internet

## Paso 1: Instalar MySQL

### Windows:
1. Descarga: https://dev.mysql.com/downloads/installer/
2. Instala MySQL Server 8.0
3. Durante instalación, configura password root (ejemplo: `root123`)

### Verificar instalación:
```bash
mysql --version
# Debería mostrar: mysql  Ver 8.0.x
```

## Paso 2: Crear Base de Datos

```bash
# Abrir MySQL
mysql -u root -p
# Ingresa tu password

# Ejecutar en consola MySQL:
CREATE DATABASE dbTuber;
USE dbTuber;
```

## Paso 3: Importar Estructura

```bash
# Salir de MySQL (Ctrl+C)
# Desde terminal normal:
mysql -u root -p dbTuber < "Bases de Datos/Structure and Data.sql"
```

## Paso 4: Configurar Backend Local

Crea archivo `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root123
DB_NAME=dbTuber
DB_PORT=3306
JWT_SECRET=tubersedessecretkey2025
EMAIL_USER=yajuego69@gmail.com
EMAIL_PASSWORD=yayq hxtf oeof kyek
PORT=3000
```

## Paso 5: Configurar Frontend Local

Crea archivo `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Paso 6: Ejecutar Aplicación

**Terminal 1 - Backend**:
```bash
cd backend
npm install
npm run dev
# Deberías ver: ✅ Conexión a la base de datos MySQL exitosa
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm install
npm run dev
# Abre: http://localhost:5173
```

## Paso 7: Probar Login

Usa credenciales de prueba:
- Usuario: `admin`
- Contraseña: `Sedes2025`

Si funciona, el problema era la BD de DatabaseASP.

## Siguiente: Deployar a Producción

Una vez que funcione local, migra a Railway/PlanetScale (ver MIGRATION_GUIDE.md)
