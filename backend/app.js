// app.js
require('dotenv').config(); // Carga variables del .env al inicio

const express = require('express');
const cors = require('cors');
const app = express();

// Conexión a la base de datos
const db = require('./config/db');

const PORT = process.env.PORT || 3000;

// ========================================================================
// === INICIO DE LA SECCIÓN DE CONFIGURACIÓN DE CORS ===
// ========================================================================

// Define los orígenes permitidos para tu frontend
const allowedOrigins = [
    'https://tbs-frontend-virid.vercel.app', // <--- URL CORRECTA DE TU FRONTEND DE VERCEL
    // 'http://localhost:5173' // Descomenta esta línea si necesitas probar localmente
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // ¡IMPORTANTE! Añade 'x-auth-token' a los encabezados permitidos
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    credentials: true
};

app.use(cors(corsOptions));

// ========================================================================
// === FIN DE LA SECCIÓN DE CONFIGURACIÓN DE CORS ===
// ========================================================================

app.use(express.json());

// Importar rutas
const hospitalRoutes = require('./routes/hospitalRoutes');
const networkRoutes = require('./routes/networkRoutes');
const municipalityRoutes = require('./routes/municipalityRoutes');
const authRoutes = require('./routes/authRoutes');
const staffRoutes = require('./routes/staffRoutes');
const hospitalAdminRoutes = require('./routes/hospitalAdminRoutes');
const patientRoutes = require('./routes/patientRoutes');
const referralRoutes = require('./routes/referralRoutes');
const counterReferenceRoutes = require('./routes/counterReferenceRoutes');

// Usar rutas con prefijos
app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/networks', networkRoutes);
app.use('/api/municipalities', municipalityRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/hospital-admins', hospitalAdminRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/counter-references', counterReferenceRoutes);

// Ruta de prueba (opcional, buena para health checks)
app.get('/', (req, res) => {
  res.send('API de transferencia de pacientes con tuberculosis');
});

// Ruta de health check (opcional, recomendada por Render)
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});