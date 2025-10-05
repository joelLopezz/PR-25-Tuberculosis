# Guía de Migración de Base de Datos

## Problema Actual
El servidor `db19475.public.databaseasp.net` no resuelve DNS y es inaccesible.

## Solución: Migrar a Railway.app

### Paso 1: Crear Base de Datos en Railway

1. Ve a https://railway.app/
2. Inicia sesión con GitHub
3. Click en **"New Project"** → **"Provision MySQL"**
4. Espera 30 segundos a que se cree

### Paso 2: Obtener Credenciales

En el dashboard de Railway:
1. Click en el servicio MySQL
2. Ve a la pestaña **"Connect"**
3. Copia las credenciales que se muestran:

```
MYSQL_HOST=containers-us-west-xxx.railway.app
MYSQL_PORT=6379
MYSQL_USER=root
MYSQL_PASSWORD=xxxxxxxxxxxxx
MYSQL_DATABASE=railway
```

### Paso 3: Restaurar Datos (si tienes backup)

Si tienes el dump SQL:

```bash
# Desde tu máquina local
mysql -h containers-us-west-xxx.railway.app \
      -P 6379 \
      -u root \
      -p railway < "Bases de Datos/db19475_dump.sql"
```

Si NO tienes backup, necesitas crear la estructura manualmente desde:
`Bases de Datos/Structure.sql`

### Paso 4: Actualizar Variables de Entorno en Render

En Render.com → `tuberculosis-backend` → **Environment**:

```env
DB_HOST=containers-us-west-xxx.railway.app
DB_USER=root
DB_PASSWORD=xxxxxxxxxxxxx
DB_NAME=railway
DB_PORT=6379  # Railway usa puertos no estándar
JWT_SECRET=tubersedessecretkey2025
EMAIL_USER=yajuego69@gmail.com
EMAIL_PASSWORD=yayq hxtf oeof kyek
```

**Importante**: Cambiar `DB_PORT` al puerto que te dé Railway (usualmente 6xxx).

### Paso 5: Redeploy Backend

1. En Render, ve a **Manual Deploy** → **Deploy latest commit**
2. Espera a que termine el despliegue
3. Verifica logs para confirmar conexión exitosa

### Paso 6: Verificar Conexión

En los logs de Render deberías ver:
```
✅ Conexión a la base de datos MySQL exitosa
✅ Nueva conexión MySQL establecida como id X
```

## Alternativa: Pedir acceso al panel DatabaseASP

Contacta a tu compañero para:
1. Acceso al panel de control DatabaseASP
2. Verificar si el servicio sigue activo
3. Obtener las credenciales correctas actualizadas

## Opción Temporal: Base de Datos Local

Si necesitas trabajar YA, puedes usar MySQL local:

```bash
# Instalar MySQL localmente
# Windows: descargar de mysql.com

# Crear base de datos
mysql -u root -p
CREATE DATABASE dbTuber;
USE dbTuber;
source C:/Users/irisc/Desktop/tuberculosis-transfer-system/Bases de Datos/Structure.sql

# En backend/.env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_local
DB_NAME=dbTuber
DB_PORT=3306
```

Luego correr backend local:
```bash
cd backend
npm run dev
```
