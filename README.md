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
```sql
-- Estructura básica de la base de datos dbTuber
-- Ver archivo completo en "Base de Datos/Structure.sql"
