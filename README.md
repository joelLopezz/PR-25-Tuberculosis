# Sistema de Transferencia de Pacientes con Tuberculosis - SEDES Cochabamba

## Manual Técnico

### 1. Roles / Integrantes

- **PSII**: Joel Israel Lopez Ticlla - Desarrollador

### 2. Introducción

El presente documento describe el manual técnico del "Sistema de Transferencia de Pacientes con Tuberculosis", desarrollado para el Servicio Departamental de Salud (SEDES) de Cochabamba, específicamente para el programa departamental de tuberculosis.

Este sistema surge de la necesidad de optimizar y digitalizar el proceso de transferencia de pacientes diagnosticados con tuberculosis entre los diferentes hospitales de la red de salud cochabambina, reemplazando los procedimientos manuales y en papel que se utilizaban anteriormente.

La solución implementada permite a los profesionales de salud gestionar de manera eficiente las referencias y contrareferencias de pacientes, mantener un registro actualizado de los casos, y facilitar la comunicación entre instituciones médicas para garantizar la continuidad del tratamiento de los pacientes con tuberculosis.

El sistema está diseñado con una arquitectura web moderna, utilizando tecnologías como React para el frontend, Node.js para el backend, y MySQL como base de datos, garantizando escalabilidad, seguridad y facilidad de uso para los diferentes roles de usuarios identificados en el proceso de atención médica.

### 3. Descripción del Proyecto

#### Objetivo
Desarrollar un sistema web para gestionar la transferencia de pacientes con tuberculosis entre hospitales del departamento de Cochabamba, mejorando la coordinación interinstitucional y el seguimiento de casos.

#### Alcance
- Gestión de hospitales y redes de salud
- Registro de pacientes con tuberculosis
- Creación y seguimiento de referencias/contrareferencias
- Administración de personal médico
- Control de acceso basado en roles

#### Tecnologías utilizadas
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express.js
- Base de datos: MySQL
- Autenticación: JWT
- Seguridad: Bcrypt para contraseñas

#### Estado Actual (Octubre 2025)
**✅ Proyecto funcional en desarrollo local**
- Base de datos: MySQL local
- Para ejecutar: Ver `SETUP_LOCAL.md`
- Documentación: Ver `CLAUDE.md`

**⚠️ Deployment en producción suspendido temporalmente**
- La base de datos en DatabaseASP.net fue descontinuada
- Frontend (Vercel) y Backend (Render) requieren migración de BD
- Guía de migración disponible en `MIGRATION_GUIDE.md`

### 4. Link al Video Demostrativo YouTube
(No disponible en este momento)

### 5. Listado de los Requisitos Funcionales del Sistema

#### RF-01: Gestión de Usuarios y Autenticación
- Login con usuario/email y contraseña
- Cambio obligatorio de contraseña en primer acceso
- Gestión de roles (Admin, SEDES Admin, Hospital Admin, Médico, Enfermera)
- Cierre de sesión
- Control de acceso basado en roles

#### RF-02: Gestión de Hospitales
- Crear, editar y eliminar hospitales (solo SEDES Admin)
- Asignar hospitales a redes de salud
- Asignar hospitales a municipios
- Vista de solo lectura para otros roles

#### RF-03: Gestión de Redes de Salud
- Crear, editar y eliminar redes (solo SEDES Admin)
- Asignar código único a cada red
- Vista de solo lectura para Hospital Admin

#### RF-04: Gestión de Personal Médico
- Registrar personal con datos personales y CI
- Asignar especialidad y hospital
- Crear usuario del sistema (opcional)
- Reset de contraseñas
- Eliminación lógica

#### RF-05: Gestión de Pacientes
- Registrar pacientes con tuberculosis
- Clasificar tipo de TB (Pulmonar/Extrapulmonar)
- Actualizar información clínica

#### RF-06: Referencias de Pacientes
- Crear referencias entre hospitales
- Establecer nivel de urgencia (Alta/Media/Baja)
- Incluir diagnóstico y resumen clínico
- Estados: Pendiente, Aceptada, Rechazada, Completada
- Notificaciones de nuevas referencias

#### RF-07: Contrareferencias
- Crear contrareferencia al completar tratamiento
- Actualizar diagnóstico y tratamiento proporcionado
- Incluir recomendaciones médicas
- Transferir paciente de vuelta al hospital origen

### 6. Arquitectura del Software

#### Arquitectura General
Sistema web de tres capas siguiendo el patrón MVC (Model-View-Controller):
- Frontend (Vista): React SPA que consume API REST
- Backend (Controlador): API REST con Node.js/Express
- Base de datos (Modelo): MySQL con acceso mediante mysql2

#### Componentes Principales

**Frontend React**
- Pages: Componentes de página completa (Login, Dashboard, etc.)
- Components: Elementos UI reutilizables (modales, formularios, tablas)
- Services: Capa de comunicación con API (axios)
- Context: Gestión de estado global (AuthContext)
- Hooks: Lógica reutilizable

**Backend Express**
- Controllers: Lógica de negocio para cada endpoint
- Routes: Definición de endpoints API REST
- Middleware: Autenticación JWT y validación de roles
- Config: Configuración de BD y variables de entorno

### 7. Base de Datos

#### Diagrama de Base de Datos
(Ver diagrama completo en la carpeta 'BaseDatos' del repositorio)

#### Script Simple
-- Estructura básica de la base de datos dbTuber
-- Ver archivo completo en "Base de Datos/Structure.sql"

### 8. Listado de Roles y Credenciales

#### Roles del Sistema

- **Super Admin (admin)**: Control total del sistema
- **SEDES Admin (sedes_admin)**: Gestión de hospitales y redes
- **Hospital Admin (hospital_admin)**: Gestión de personal médico del hospital
- **Doctor**: Personal médico con acceso a referencias
- **Nurse**: Personal de enfermería con acceso a referencias

#### Credenciales de Usuarios de Prueba

**Super Administrador**
- Usuario: `admin`
- Email: `admin@sedes.gob.bo`
- Contraseña: `Sedes2025`
- Rol: admin

**SEDES Admin**
- Usuario: `sedes_admin`
- Email: `sedes@sedes.gob.bo`
- Contraseña: `sedes2025`
- Rol: sedes_admin

**Administradores de Hospital**

Hospital Cochabamba Norte:
- Usuario: `eee`
- Email: `prueba2@gmail.com`
- Contraseña: `B5n&y3Ht`
- Rol: hospital_admin

Hospital Ayacucho:
- Usuario: `adminAyacucho`
- Contraseña: `cN5&b1Vq`
- Rol: hospital_admin

**Personal Médico**

Doctor - Hospital Cochabamba Norte:
- Usuario: `rrrrrr`
- Contraseña: `yF8&u3Qp`
- Rol: doctor

Doctor - Hospital Ayacucho:
- Usuario: `jjuego`
- Contraseña: `H9z$k5Ta`
- Rol: doctor

#### Notas Importantes
- Todos los usuarios deben cambiar su contraseña en el primer inicio de sesión
- Las contraseñas cumplen con requisitos de seguridad (mayúsculas, minúsculas, números y caracteres especiales)

### 9. Requisitos del Sistema

#### Requerimientos de Hardware (cliente)
- Procesador: 1 GHz o superior
- RAM: 2 GB mínimo (4 GB recomendado)
- Espacio en disco: 500 MB libre
- Resolución de pantalla: 1366x768 mínimo
- Conexión a Internet: Banda ancha (mínimo 1 Mbps)

#### Requerimientos de Software (cliente)
- Sistema Operativo: Windows 7/10/11, macOS 10.12+, Linux Ubuntu 18.04+
- Navegador web (versiones actualizadas):
  - Google Chrome 90+
  - Mozilla Firefox 88+
  - Microsoft Edge 90+
  - Safari 14+
- JavaScript: Habilitado en el navegador

#### Requerimientos de Hardware (servidor/hosting/BD)
- Procesador: Intel Xeon o AMD equivalente, 2 GHz mínimo
- RAM: 8 GB mínimo (16 GB recomendado)
- Almacenamiento: 50 GB SSD mínimo
- Ancho de banda: 100 Mbps dedicado
- Arquitectura: x64

#### Requerimientos de Software (servidor/hosting/BD)
- Sistema Operativo: Windows Server 2016+ con IIS 10+
- Runtime: Node.js 18.x LTS o superior
- Base de datos: MySQL 8.0+
- Servidor web: IIS con HttpPlatformHandler
- Módulos IIS requeridos:
  - URL Rewrite Module 2.1
  - Application Request Routing (ARR)
- SSL/TLS: Certificado SSL válido (recomendado)
- Firewall: Puertos abiertos 80/443 (HTTP/HTTPS), 3306 (MySQL interno)

### 10. Instalación y Configuración

#### Base de Datos

##### Instalación de MySQL
1. Descarga **MySQL Installer** desde <https://dev.mysql.com/downloads/>.
2. Instala **MySQL Server 8.0** (o superior).

##### Creación de la base de datos
```sql
mysql -u root -p
CREATE DATABASE dbTuber;
USE dbTuber;
```

##### Importar estructura y datos
```bash
mysql -u root -p dbTuber < db19475_dump.sql
```

##### Verificar conexión remota
```bash
mysql -u db19475 -p -h db19475.public.databaseasp.net
# Password: 5Zb-_y2X6Yq=
```

---

#### Backend

##### Preparar archivos
1. Copia el proyecto **backend** (sin la carpeta `node_modules`).
2. Revisa el archivo `web.config` y define las variables de entorno.
3. Crea la carpeta de logs:

   ```bash
   mkdir logs
   ```

##### Instalar dependencias
```bash
cd C:\inetpub\wwwroot\api
npm install --production
```

##### Configurar IIS
1. Crea una **aplicación** para el backend.
2. Asigna un **Application Pool** con Node.js.
3. Concede **permisos de escritura** a la carpeta `logs`.

##### Variables de entorno en `web.config`
```xml
<environmentVariable name="DB_HOST"     value="db19475.public.databaseasp.net" />
<environmentVariable name="DB_USER"     value="db19475" />
<environmentVariable name="DB_PASSWORD" value="5Zb-_y2X6Yq=" />
<environmentVariable name="DB_NAME"     value="dbTuber" />
<environmentVariable name="DB_PORT"     value="3306" />
<environmentVariable name="JWT_SECRET"  value="tubersedessecretkey2025" />
<environmentVariable name="EMAIL_USER"  value="yajuego69@gmail.com" />
<environmentVariable name="EMAIL_PASSWORD" value="yayq hxtf oeof kyek" />
```

---

#### Frontend

##### Construir proyecto para producción
```bash
cd frontend
npm run build
```

##### Configurar archivo `.env`
```env
VITE_API_URL=http://[IP-SERVIDOR]/api
```

##### Subir archivos al servidor
1. Copia el contenido de `dist` a `C:\inetpub\wwwroot\tuber`.
2. Incluye el archivo `web.config` para React Router.

##### Configurar IIS
1. Crea un **sitio web** para el frontend.
2. Configura **bindings** (puertos 80/443).
3. Instala y habilita **URL Rewrite**.
4. Aplica las reglas para SPA.

##### `web.config` para React Router
```xml
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <!-- Redirigir todas las rutas al index.html, excepto /api -->
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/(api)" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>

    <staticContent>
      <mimeMap fileExtension=".js"   mimeType="application/javascript" />
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <mimeMap fileExtension=".svg"  mimeType="image/svg+xml" />
    </staticContent>
  </system.webServer>
</configuration>
```

##### Verificar instalación
1. Accede a `http://[IP-SERVIDOR]`.
2. Inicia sesión con credenciales de prueba.
3. Confirma que la aplicación se comunica correctamente con la API.
```bash
curl http://[IP-SERVIDOR]/api/health
```
### 11. Procedimiento de Hosting

#### Servidor Utilizado
- **Tipo**: Windows Server con IIS  
- **Proveedor**: DatabaseASP.net  
- **Base de datos**: MySQL remota en `db19475.public.databaseasp.net`

---

#### Configuración IIS

##### Backend (Node.js)
- Crear aplicación en IIS: `/api`
- Instalar **HttpPlatformHandler**
- Configurar `web.config` con variables de entorno
- Application Pool: **No Managed Code**

##### Frontend (React)
- Crear **sitio web raíz** en IIS
- Instalar **URL Rewrite Module**
- Configurar reglas para SPA en `web.config`
- Habilitar archivos estáticos (`.js`, `.json`, `.svg`)

---

#### Configuración de Red
- **Puerto HTTP**: 80  
- **Puerto HTTPS**: 443 (opcional)  
- **Firewall**: Permitir tráfico web entrante

---

#### Archivos de Configuración Clave

##### Backend `web.config`
```xml
<configuration>
  <system.webServer>
    <handlers>
      <add name="httpPlatformHandler"
           path="*"
           verb="*"
           modules="httpPlatformHandler"
           resourceType="Unspecified" />
    </handlers>

    <httpPlatform processPath="node"
                  arguments=".\app.js"
                  startupTimeLimit="60"
                  stdoutLogEnabled="true"
                  stdoutLogFile=".\logs\stdout">
      <environmentVariables>
        <environmentVariable name="PORT"         value="%HTTP_PLATFORM_PORT%" />
        <environmentVariable name="NODE_ENV"     value="production" />
        <environmentVariable name="DB_HOST"      value="db19475.public.databaseasp.net" />
        <environmentVariable name="DB_USER"      value="db19475" />
        <environmentVariable name="DB_PASSWORD"  value="5Zb-_y2X6Yq=" />
        <environmentVariable name="DB_NAME"      value="db19475" />
        <environmentVariable name="DB_PORT"      value="3306" />
        <environmentVariable name="JWT_SECRET"   value="tubersedessecretkey2025" />
        <environmentVariable name="EMAIL_USER"   value="yajuego69@gmail.com" />
        <environmentVariable name="EMAIL_PASSWORD" value="yayq hxtf oeof kyek" />
      </environmentVariables>
    </httpPlatform>
  </system.webServer>
</configuration>
```

##### Frontend `web.config`
```xml
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <!-- Redirigir todas las rutas al index.html, excepto /api -->
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/(api)" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>

    <staticContent>
      <mimeMap fileExtension=".js"   mimeType="application/javascript" />
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <mimeMap fileExtension=".svg"  mimeType="image/svg+xml" />
    </staticContent>
  </system.webServer>
</configuration>
```
### 12. Repositorio GIT

**Repositorio del Proyecto**: <https://github.com/joelLopezz/PR-25-Tuberculosis>

#### Estructura del Repositorio
```
PR-25-Tuberculosis/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── app.js
│   ├── package.json
│   └── web.config
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── web.config
├── BaseDatos/
│   ├── Structure.sql
│   ├── Dump20250512.sql
│   └── DiagramaDB.png
├── Documentacion/
│   ├── Manual_Tecnico.docx
│   └── Manual_Usuario.pdf
└── README.md
```

#### Instrucciones de Clonación
```bash
# Clonar el repositorio
git clone https://github.com/joelLopezz/PR-25-Tuberculosis.git

# Navegar al directorio del proyecto
cd PR-25-Tuberculosis

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```
### 14. Personalización y Configuración

#### Variables de Entorno

##### Backend: todas las configuraciones en `web.config`
- `DB_HOST`: Host de la base de datos  
- `DB_USER`: Usuario de MySQL  
- `DB_PASSWORD`: Contraseña de MySQL  
- `DB_NAME`: Nombre de la base de datos  
- `JWT_SECRET`: Clave secreta para tokens JWT  
- `EMAIL_USER`: Usuario de correo para notificaciones  
- `EMAIL_PASSWORD`: Contraseña del correo  
- `PORT`: Puerto dinámico asignado por IIS  

##### Frontend: variables en `.env`
```env
VITE_API_URL=http://[IP-SERVIDOR]/api
```

---

#### Configuraciones Modificables

##### Tiempo de sesión JWT
- Ubicación: `authController.js`  
- Valor por defecto: 8 h  
```javascript
jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
```

##### CORS
- Ubicación: `app.js`  
- Configuración actual: permite frontend específico  
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

##### Tamaño de uploads
- Ubicación: `app.js`  
- Limitado por Express body-parser  
```javascript
app.use(express.json({ limit: '10mb' }));
```

##### Logs
- Carpeta: `C:\inetpub\wwwroot\api\logs`  
- Nivel de detalle: configurado en `web.config`

---

#### Personalización Visual

##### Colores (Tailwind CSS)
- **Primario**: teal-600 / teal-700  
- **Secundario**: blue-600 / blue-700  
- **Gradiente**: `from-teal-700 to-blue-700`

##### Logo / Nombre
- Texto: **“SEDES Cochabamba | Programa TB”**  
- Ubicación: `Navbar.jsx`  
- Ícono: SVG médico personalizado

##### Idioma
- Español (hard-coded)  
- No hay sistema de internacionalización

---

### 15. Seguridad

#### Autenticación y Autorización

##### JWT (JSON Web Tokens)
- Expiración: **8 h**  
- Almacenamiento: `localStorage`  
- Header: `x-auth-token`  
- Renovación automática: **no**

##### Bcrypt
- Salt rounds: **10**  
- Librería: `bcryptjs`  
```javascript
const salt = await bcryptjs.genSalt(10);
const hashedPassword = await bcryptjs.hash(password, salt);
```

##### Middleware de Autenticación
- Ubicación: `authMiddleware.js`  
- Verifica token y rol en cada ruta protegida

##### Cambio de Contraseña Obligatorio
- Primera sesión: `last_login === null`  
- Redirige a `/cambiar-password`  
- Reglas de complejidad:  
  - ≥ 8 caracteres  
  - 1 mayúscula, 1 minúscula, 1 número, 1 carácter especial

---

#### Protección de Datos

##### Contraseñas
- Nunca en texto plano  
- Hasheadas con bcrypt antes de guardar  
- Excluidas de `SELECT` y de respuestas JSON

##### Eliminación Lógica
- Campo `status` (1 = activo, 0 = inactivo)  
- Registros no se borran físicamente  
- Todas las queries incluyen `WHERE status = 1`

##### Validación de Entrada
- Backend valida cada campo  
- SQL Injection prevenido con placeholders  
```javascript
db.promise().query('SELECT * FROM users WHERE id = ?', [id]);
```

##### CORS
- Dominios específicos  
- `credentials: true` para cookies/headers  
- Métodos permitidos: GET, POST, PUT, DELETE

---

#### Acceso y Permisos

##### Control por Roles
1. **admin** – acceso total  
2. **sedes_admin** – gestión de hospitales y redes  
3. **hospital_admin** – personal de su hospital  
4. **doctor** – referencias y pacientes  
5. **nurse** – referencias y pacientes

##### Filtrado por Hospital
```javascript
if (!['admin', 'sedes_admin'].includes(req.user.role)) {
  query += ' AND hospital_id = ?';
  queryParams.push(req.user.hospital_id);
}
```

##### Sesiones *Stateless*
- El servidor no guarda estado  
- JWT contiene toda la info necesaria  
- Cada petición es independiente

##### Headers Seguros
- `x-auth-token` – token JWT  
- `Content-Type` validado  
- HTTPS **recomendado** en producción
### 16. Depuración y Solución de Problemas

#### Errores Comunes – Local

##### Backend no arranca
- Verificar que el **puerto 3000** esté libre  
- Comprobar variables en `.env`  
- Ejecutar `npm install`

##### Error de conexión a la BD
- Confirmar que **MySQL** esté corriendo  
- Revisar credenciales en `.env`  
- Asegurar que el **puerto 3306** esté abierto

##### Frontend no conecta con la API
- Verificar `VITE_API_URL` en `.env`  
- CORS habilitado en el backend  
- Backend corriendo en el puerto correcto

---

#### Errores Comunes – Hosting

##### Error **500** en IIS
- Revisar logs en `C:\inetpub\wwwroot\api\logs`  
- Verificar permisos de la carpeta `logs`  
- **HttpPlatformHandler** instalado

##### Rutas de React no funcionan
- **URL Rewrite Module** instalado  
- `web.config` con reglas para SPA  
- Revisar permisos en IIS

##### API no responde
- Application Pool activo  
- Variables correctas en `web.config`  
- **Node.js** instalado en el servidor

---

#### Comandos útiles de depuración

```bash
# Local
npm run dev         # Backend con nodemon
npm run dev         # Frontend con Vite

# Hosting
iisreset            # Reiniciar IIS
node app.js         # Probar backend manualmente
netstat -an | find "80"  # Verificar puertos
```
### 17. Glosario de Términos

- **API**: *Application Programming Interface* – interfaz de comunicación entre frontend y backend.  
- **Bcrypt**: algoritmo de hash para encriptar contraseñas de forma segura.  
- **CORS**: *Cross-Origin Resource Sharing* – política de seguridad para peticiones entre dominios.  
- **Express**: framework de Node.js para crear servidores web y APIs.  
- **IIS**: *Internet Information Services* – servidor web de Microsoft.  
- **JWT**: *JSON Web Token* – token de autenticación *stateless*.  
- **MySQL**: sistema de gestión de bases de datos relacional.  
- **Node.js**: entorno de ejecución de JavaScript del lado del servidor.  
- **React**: biblioteca JavaScript para construir interfaces de usuario.  
- **SEDES**: *Servicio Departamental de Salud*.  
- **SPA**: *Single Page Application* – aplicación web de página única.  
- **Tailwind CSS**: framework de CSS basado en utilidades.  
- **TB**: *Tuberculosis* – enfermedad infecciosa bacteriana.  
- **Vite**: herramienta de construcción rápida para proyectos web modernos.  
- **Eliminación lógica**: marcar registros como inactivos sin borrarlos físicamente.  
- **Middleware**: software intermediario que procesa peticiones antes de llegar al controlador.  
- **Hash**: función criptográfica unidireccional para proteger contraseñas.  
- **Pool de aplicaciones**: conjunto de procesos *worker* en IIS.  
- **Rol**: conjunto de permisos asignados a un usuario.  
- **Token**: cadena de caracteres que identifica una sesión autenticada.  

---

### 18. Referencias y Recursos Adicionales

- **Documentación oficial de React** v18.2.0  
- **Documentación de Express.js** v4.18.0  
- **Manual de MySQL 8.0 Reference Manual**  
- **Guía de seguridad OWASP para aplicaciones web**  
- **Microsoft IIS 10.0 Documentation**  
- **RFC 7519 – JSON Web Token (JWT) Standard**
### 19. Herramientas de Implementación

#### Desarrollo
- **IDE**: Visual Studio Code  
- **Control de versiones**: Git (local)  
- **Gestor de paquetes**: npm  
- **Base de datos**: MySQL Workbench  

#### Frontend
- **Framework**: React 18  
- **Bundler**: Vite 5  
- **CSS**: Tailwind CSS 3  
- **HTTP Client**: Axios  
- **Formularios**: Formik + Yup  
- **Rutas**: React Router v6  

#### Backend
- **Runtime**: Node.js 18 LTS  
- **Framework**: Express.js 5  
- **ORM / Driver**: mysql2 (conexión directa)  
- **Autenticación**: jsonwebtoken  
- **Encriptación**: bcryptjs  
- **CORS**: cors middleware  
- **Variables de entorno**: dotenv  

#### Testing y Debug
- **API Testing**: Postman  
- **Debug React**: React DevTools  
- **Logs**: Winston (producción)  

#### Deployment
- **Servidor**: Windows Server + IIS  
- **Base de datos**: MySQL (DatabaseASP.net)  
- **Build**: npm scripts  
- **Monitoreo**: logs de IIS  

---

### 20. Bibliografía

#### Documentación Oficial
- React: <https://react.dev/>  
- Node.js: <https://nodejs.org/docs/>  
- Express: <https://expressjs.com/>  
- MySQL: <https://dev.mysql.com/doc/>  
- Tailwind CSS: <https://tailwindcss.com/docs>  
- JWT: <https://jwt.io/introduction>  

#### Recursos de Hosting
- IIS con Node.js: <https://github.com/Azure/iisnode>  
- HttpPlatformHandler: <https://www.iis.net/downloads/microsoft/httpplatformhandler>  

#### Guías de Implementación
- Bcrypt: <https://www.npmjs.com/package/bcryptjs>  
- CORS: <https://www.npmjs.com/package/cors>  
- Vite: <https://vitejs.dev/guide/>  


