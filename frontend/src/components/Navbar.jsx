/* eslint-disable no-unused-vars */
// src/components/Navbar.jsx - Con acceso de lectura para hospital_admin
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isSedesAdmin, isHospitalAdmin, isMedicalStaff, clearUser } = useAuth();

  // Efecto para detectar el scroll y cambiar la apariencia del navbar
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Verificar ruta actual para activar el enlace correspondiente
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Manejar logout
  const handleLogout = () => {
    clearUser();
    navigate('/login');
  };

  return (
    <nav 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled 
          ? 'bg-gradient-to-r from-teal-600 to-blue-700 shadow-md py-2' 
          : 'bg-gradient-to-r from-teal-500 to-blue-600 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo y nombre del sistema con animación */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              {/* Icono de salud */}
              <svg 
                className={`h-8 w-8 mr-2 text-white transform transition duration-500 ${scrolled ? 'scale-90' : 'scale-100'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                >
                </path>
              </svg>
              
              <Link to="/dashboard" className="text-white font-bold text-lg md:text-xl tracking-wide transition-all duration-500 ease-in-out transform hover:scale-105">
                SEDES Cochabamba <span className="text-yellow-300">|</span> Programa TB
              </Link>
            </div>
          </div>

          {/* Menú de navegación - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link
              to="/dashboard"
              className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md ${
                isActive('/dashboard') || isActive('/')
                  ? 'bg-white text-blue-700'
                  : 'text-white border border-transparent hover:border-white/30'
              }`}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Inicio
              </span>
            </Link>
            
            {/* Mostrar enlace Hospitales con acceso diferenciado */}
            {isSedesAdmin ? (
              <Link
                to="/hospitals"
                className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md ${
                  isActive('/hospitals')
                    ? 'bg-white text-blue-700'
                    : 'text-white border border-transparent hover:border-white/30'
                }`}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  Hospitales
                </span>
              </Link>
            ) : (isHospitalAdmin || isMedicalStaff) && (
              <Link
                to="/hospitals-view"
                className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md ${
                  isActive('/hospitals-view')
                    ? 'bg-white text-blue-700'
                    : 'text-white border border-transparent hover:border-white/30'
                }`}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  Hospitales
                </span>
              </Link>
            )}
            
            {/* Redes de Salud - acceso completo para SEDES Admin, vista solo para Hospital Admin */}
            {isSedesAdmin ? (
              <Link
                to="/redes"
                className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md ${
                  isActive('/redes')
                    ? 'bg-white text-blue-700'
                    : 'text-white border border-transparent hover:border-white/30'
                }`}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  Redes de Salud
                </span>
              </Link>
            ) : isHospitalAdmin && (
              <Link
                to="/redes-view"
                className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md ${
                  isActive('/redes-view')
                    ? 'bg-white text-blue-700'
                    : 'text-white border border-transparent hover:border-white/30'
                }`}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  Redes de Salud
                </span>
              </Link>
            )}
            
            {/* Mostrar enlace Personal con acceso diferenciado */}
            {isHospitalAdmin ? (
              <Link
                to="/personal"
                className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md ${
                  isActive('/personal')
                    ? 'bg-white text-blue-700'
                    : 'text-white border border-transparent hover:border-white/30'
                }`}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Personal
                </span>
              </Link>
            ) : isMedicalStaff && (
              <Link
                to="/personal-view"
                className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md ${
                  isActive('/personal-view')
                    ? 'bg-white text-blue-700'
                    : 'text-white border border-transparent hover:border-white/30'
                }`}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Personal
                </span>
              </Link>
            )}

            {/* NUEVOS ENLACES: Pacientes, Referencias y Contrareferencias */}
            {isMedicalStaff && (
              <>
                <Link
                  to="/pacientes"
                  className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md ${
                    isActive('/pacientes')
                      ? 'bg-white text-blue-700'
                      : 'text-white border border-transparent hover:border-white/30'
                  }`}
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Pacientes
                  </span>
                </Link>

                <Link
                  to="/referencias"
                  className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md ${
                    isActive('/referencias')
                      ? 'bg-white text-blue-700'
                      : 'text-white border border-transparent hover:border-white/30'
                  }`}
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    Referencias
                  </span>
                </Link>

                <Link
                  to="/contrareferencias"
                  className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md ${
                    isActive('/contrareferencias')
                      ? 'bg-white text-blue-700'
                      : 'text-white border border-transparent hover:border-white/30'
                  }`}
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
                    </svg>
                    Contrareferencias
                  </span>
                </Link>
              </>
            )}
            
            {/* Menú de usuario */}
            <div className="relative ml-3">
              <div>
                <button
                  type="button"
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                  id="user-menu-button"
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="sr-only">Abrir menú de usuario</span>
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                    {user?.first_name ? user.first_name.charAt(0) : user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>
              </div>
              
              {/* Menú desplegable */}
              {showUserMenu && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex="-1"
                >
                  <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-200 pb-2">
                    {user?.first_name && user?.last_name ? (
                      <span className="font-medium">{user.first_name} {user.last_name}</span>
                    ) : (
                      <span className="font-medium">{user?.username}</span>
                    )}
                    <div className="mt-1">
                      {user?.role === 'admin' && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Super Admin</span>
                      )}
                      {user?.role === 'sedes_admin' && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">SEDES Admin</span>
                      )}
                      {user?.role === 'hospital_admin' && (
                        <div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Admin Hospital</span>
                          {user?.hospital && (
                            <p className="text-xs text-gray-500 mt-1">{user.hospital}</p>
                          )}
                        </div>
                      )}
                      {['doctor', 'nurse', 'receptionist'].includes(user?.role) && (
                        <div>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                            {user?.role === 'doctor' ? 'Médico' : 
                              user?.role === 'nurse' ? 'Enfermero/a' : 'Recepcionista'}
                          </span>
                          {user?.hospital && (
                            <p className="text-xs text-gray-500 mt-1">{user.hospital}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    to="/cambiar-password"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    tabIndex="-1"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Cambiar contraseña
                  </Link>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    tabIndex="-1"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Botón de menú móvil con animación */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none transition-colors duration-300"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {/* Icono menú animado */}
              <div className="w-6 h-6 relative">
                <span className={`absolute h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
                <span className={`absolute h-0.5 mt-2 w-full bg-current transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`absolute h-0.5 mt-4 w-full bg-current transform transition-all duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil con animación */}
      <div
        className={`transition-all duration-300 ease-in-out transform md:hidden ${
          isOpen 
            ? 'max-h-screen opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
        id="mobile-menu"
      >
        <div className="px-3 pt-2 pb-4 space-y-2 bg-gradient-to-r from-teal-600 to-blue-700">
          <Link
            to="/dashboard"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
              isActive('/dashboard') || isActive('/')
                ? 'bg-white text-blue-700'
                : 'text-white hover:bg-blue-700'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Inicio
            </span>
          </Link>
          
          {/* Hospitales - acceso condicional */}
          {isSedesAdmin ? (
            <Link
              to="/hospitals"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                isActive('/hospitals')
                  ? 'bg-white text-blue-700'
                  : 'text-white hover:bg-blue-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                Hospitales
              </span>
            </Link>
          ) : (isHospitalAdmin || isMedicalStaff) && (
            <Link
              to="/hospitals-view"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                isActive('/hospitals-view')
                  ? 'bg-white text-blue-700'
                  : 'text-white hover:bg-blue-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                Hospitales
              </span>
            </Link>
          )}
          
          {/* Redes de Salud - solo SEDES Admin y Hospital Admin (vista solo lectura) */}
          {isSedesAdmin ? (
            <Link
              to="/redes"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                isActive('/redes')
                  ? 'bg-white text-blue-700'
                  : 'text-white hover:bg-blue-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Redes de Salud
              </span>
            </Link>
          ) : isHospitalAdmin && (
            <Link
              to="/redes-view"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                isActive('/redes-view')
                  ? 'bg-white text-blue-700'
                  : 'text-white hover:bg-blue-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Redes de Salud
              </span>
            </Link>
          )}
          
          {/* Personal - acceso completo para Hospital Admin */}
          {isHospitalAdmin ? (
            <Link
              to="/personal"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                isActive('/personal')
                  ? 'bg-white text-blue-700'
                  : 'text-white hover:bg-blue-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Personal
              </span>
            </Link>
          ) : isMedicalStaff && (
            <Link
              to="/personal-view"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                isActive('/personal-view')
                  ? 'bg-white text-blue-700'
                  : 'text-white hover:bg-blue-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Personal
              </span>
            </Link>
          )}

          {/* NUEVOS ENLACES para versión móvil: Pacientes, Referencias y Contrareferencias */}
          {isMedicalStaff && (
            <>
              <Link
                to="/pacientes"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive('/pacientes')
                    ? 'bg-white text-blue-700'
                    : 'text-white hover:bg-blue-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Pacientes
                </span>
              </Link>

              <Link
                to="/referencias"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive('/referencias')
                    ? 'bg-white text-blue-700'
                    : 'text-white hover:bg-blue-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Referencias
                </span>
              </Link>

              <Link
                to="/contrareferencias"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive('/contrareferencias')
                    ? 'bg-white text-blue-700'
                    : 'text-white hover:bg-blue-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
                  </svg>
                  Contrareferencias
                </span>
              </Link>
            </>
          )}
          
          {/* Opciones de usuario en móvil */}
          <div className="pt-4 pb-3 border-t border-blue-800">
            <div className="flex items-center px-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                  {user?.first_name ? user.first_name.charAt(0) : user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">
                  {user?.first_name && user?.last_name ? (
                    <span>{user.first_name} {user.last_name}</span>
                  ) : (
                    <span>{user?.username}</span>
                  )}
                </div>
                <div className="text-sm font-medium text-teal-200">
                  {user?.role === 'admin' && 'Super Admin'}
                  {user?.role === 'sedes_admin' && 'SEDES Admin'}
                  {user?.role === 'hospital_admin' && (user?.hospital ? user.hospital : 'Admin Hospital')}
                  {['doctor', 'nurse', 'receptionist'].includes(user?.role) && (
                    <>
                      {user?.role === 'doctor' ? 'Médico' : 
                       user?.role === 'nurse' ? 'Enfermero/a' : 'Recepcionista'}
                      {user?.hospital && ` - ${user.hospital}`}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link
                to="/cambiar-password"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                onClick={() => setIsOpen(false)}
              >
                Cambiar contraseña
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;