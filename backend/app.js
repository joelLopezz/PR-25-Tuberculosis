// app.js
require('dotenv').config(); // Carga variables del .env al inicio

const express = require('express');
const cors = require('cors');
const app = express();

// Conexión a la base de datos
const db = require('./config/db');

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Importar rutas
const hospitalRoutes = require('./routes/hospitalRoutes');
const networkRoutes = require('./routes/networkRoutes');
const municipalityRoutes = require('./routes/municipalityRoutes');
const authRoutes = require('./routes/authRoutes');
const staffRoutes = require('./routes/staffRoutes'); // AÑADIR ESTA LÍNEA
const hospitalAdminRoutes = require('./routes/hospitalAdminRoutes'); // Nueva importación
const patientRoutes = require('./routes/patientRoutes');
const referralRoutes = require('./routes/referralRoutes');
const counterReferenceRoutes = require('./routes/counterReferenceRoutes');
// Usar rutas con prefijos
app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/networks', networkRoutes);
app.use('/api/municipalities', municipalityRoutes);
app.use('/api/staff', staffRoutes); // AÑADIR ESTA LÍNEA
app.use('/api/hospital-admins', hospitalAdminRoutes); // Nueva ruta
app.use('/api/patients', patientRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/counter-references', counterReferenceRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de transferencia de pacientes con tuberculosis');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

/*
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});*/