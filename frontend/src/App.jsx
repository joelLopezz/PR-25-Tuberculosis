// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './Layouts/MainLayout';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Hospitals from './pages/Hospitals';
import HospitalReadOnlyView from './pages/HospitalReadOnlyView';
import CreateHospital from './pages/CreateHospital';
import EditHospital from './pages/EditHospital';
import Networks from './pages/Networks';
import NetworkReadOnlyView from './pages/NetworkReadOnlyView';
import Staff from './pages/Staff';
import StaffReadOnlyView from './pages/StaffReadOnlyView';
import CreateStaff from './pages/CreateStaff';
import EditStaff from './pages/EditStaff';
import StaffDetail from './pages/StaffDetail';
import ChangePassword from './pages/ChangePassword';
import HospitalAdmins from './pages/HospitalAdmins';
import CreateHospitalAdmin from './pages/CreateHospitalAdmin';
import EditHospitalAdmin from './pages/EditHospitalAdmin';

// Nuevas páginas para pacientes, referencias y contrareferencias
import Patients from './pages/Patients';
import CreatePatient from './pages/CreatePatient';
import EditPatient from './pages/EditPatient';
import PatientDetail from './pages/PatientDetail';

import Referrals from './pages/Referrals';
import CreateReferral from './pages/CreateReferral';
import ReferralDetail from './pages/ReferralDetail';

import CounterReferences from './pages/CounterReferences';
import CreateCounterReference from './pages/CreateCounterReference';
import CounterReferenceDetail from './pages/CounterReferenceDetail';

// Componente para proteger rutas y aplicar el layout
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Aplicamos el MainLayout a todas las rutas protegidas
  return <MainLayout>{children}</MainLayout>;
};

// Componente para verificar si el usuario necesita cambiar su contraseña
const FirstLoginCheck = ({ children }) => {
  const { user } = useAuth();
  
  // Si el usuario está en su primer login o tiene la contraseña temporal
  if (user && user.password_change_required) {
    return <Navigate to="/cambiar-password" />;
  }
  
  return children;
};

// Componente para restringir acceso solo a administradores de SEDES
const SedesAdminRoute = ({ children }) => {
  const { isSedesAdmin, loading } = useAuth();
  
  if (loading) return null;
  
  if (!isSedesAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Componente para restringir acceso solo a administradores de Hospital
const HospitalAdminRoute = ({ children }) => {
  const { isHospitalAdmin, isSedesAdmin, loading } = useAuth();
  
  if (loading) return null;
  
  // Permitimos acceso tanto a hospital_admin como a roles superiores (SEDES y Super Admin)
  if (!isHospitalAdmin && !isSedesAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Componente para restringir acceso solo a personal médico (doctor/nurse)
const MedicalStaffRoute = ({ children }) => {
  const { isMedicalStaff, isHospitalAdmin, isSedesAdmin, loading } = useAuth();
  
  if (loading) return null;
  
  // Permitir acceso a personal médico y roles administrativos
  if (!isMedicalStaff && !isHospitalAdmin && !isSedesAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/olvide-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
            <Route path="/cambiar-password" element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } />
            
            {/* Ruta principal ahora dirige al Dashboard */}
            <Route path="/" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <Dashboard />
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            
            {/* Dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <Dashboard />
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            
            {/* Rutas de Hospitales - acceso completo para admins */}
            <Route path="/hospitals" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <SedesAdminRoute>
                    <Hospitals />
                  </SedesAdminRoute>
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            
            {/* Vista de solo lectura de Hospitales para hospital_admin y personal médico */}
            <Route path="/hospitals-view" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <HospitalReadOnlyView />
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            
            <Route path="/crear-hospital" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <SedesAdminRoute>
                    <CreateHospital />
                  </SedesAdminRoute>
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            <Route path="/editar-hospital/:id" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <SedesAdminRoute>
                    <EditHospital />
                  </SedesAdminRoute>
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            
            {/* Rutas de Redes - acceso completo para SEDES Admin */}
            <Route path="/redes" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <SedesAdminRoute>
                    <Networks />
                  </SedesAdminRoute>
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            
            {/* Vista de solo lectura de Redes para hospital_admin */}
            <Route path="/redes-view" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <NetworkReadOnlyView />
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            
            {/* Rutas de administradores de hospital - solo para SEDES Admin */}
            <Route path="/admins-hospital" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <SedesAdminRoute>
                    <HospitalAdmins />
                  </SedesAdminRoute>
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            <Route path="/crear-admin-hospital" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <SedesAdminRoute>
                    <CreateHospitalAdmin />
                  </SedesAdminRoute>
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            <Route path="/editar-admin-hospital/:id" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <SedesAdminRoute>
                    <EditHospitalAdmin />
                  </SedesAdminRoute>
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            
            {/* Rutas de personal - acceso completo para Hospital Admin */}
            <Route path="/personal" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <HospitalAdminRoute>
                    <Staff />
                  </HospitalAdminRoute>
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            
            {/* Vista de solo lectura de Personal para personal médico */}
            <Route path="/personal-view" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <MedicalStaffRoute>
                    <StaffReadOnlyView />
                  </MedicalStaffRoute>
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            
            <Route path="/crear-personal" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <HospitalAdminRoute>
                    <CreateStaff />
                  </HospitalAdminRoute>
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            <Route path="/editar-personal/:id" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <HospitalAdminRoute>
                    <EditStaff />
                  </HospitalAdminRoute>
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            <Route path="/ver-personal/:id" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <StaffDetail />
                </FirstLoginCheck>
              </ProtectedRoute>
            } />

            {/* NUEVAS RUTAS */}
            {/* Rutas de Pacientes */}
            <Route path="/pacientes" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <MedicalStaffRoute>
                    <Patients />
                  </MedicalStaffRoute>
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            <Route path="/crear-paciente" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <MedicalStaffRoute>
                    <CreatePatient />
                  </MedicalStaffRoute>
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            <Route path="/editar-paciente/:id" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <MedicalStaffRoute>
                    <EditPatient />
                  </MedicalStaffRoute>
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            <Route path="/ver-paciente/:id" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <PatientDetail />
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            
            {/* Rutas de Referencias */}
            <Route path="/referencias" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <Referrals />
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            <Route path="/crear-referencia" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <MedicalStaffRoute>
                    <CreateReferral />
                  </MedicalStaffRoute>
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            <Route path="/ver-referencia/:id" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <ReferralDetail />
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            
            {/* Rutas de Contrareferencias */}
            <Route path="/contrareferencias" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <CounterReferences />
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            <Route path="/crear-contrareferencia/:referralId" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <MedicalStaffRoute>
                    <CreateCounterReference />
                  </MedicalStaffRoute>
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
            <Route path="/ver-contrareferencia/:id" element={
              <ProtectedRoute>
                <FirstLoginCheck>
                  <CounterReferenceDetail />
                </FirstLoginCheck>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;