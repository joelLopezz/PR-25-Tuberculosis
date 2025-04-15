// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-teal-800 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo y eslogan */}
        <div className="flex flex-col items-center mb-3">
          <div className="flex items-center mb-2">
            <svg 
              className="h-8 w-8 text-teal-300 mr-2" 
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
            <h2 className="text-xl font-bold text-white">SEDES <span className="text-teal-300">Cochabamba</span></h2>
          </div>
        </div>
        
        {/* Información principal en 2 columnas */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Columna 1: Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm text-white hover:text-teal-200 transition duration-300">
              &copy; {currentYear} SEDES Cochabamba
            </p>
            <p className="text-xs text-gray-300 mt-1 hover:text-white transition duration-300">
              Sistema de Transferencia de Pacientes con Tuberculosis
            </p>
          </div>
          
          {/* Columna 2: Contacto */}
          <div className="text-center md:text-right">
            <p className="flex items-center justify-center md:justify-end text-sm text-white group">
              <svg className="h-4 w-4 mr-2 text-teal-400 group-hover:text-teal-300 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span className="group-hover:text-teal-200 transition duration-300">
                Teléfono: (591) 4-123456
              </span>
            </p>
            <p className="flex items-center justify-center md:justify-end text-sm text-white group mt-1">
              <svg className="h-4 w-4 mr-2 text-teal-400 group-hover:text-teal-300 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span className="group-hover:text-teal-200 transition duration-300">
                Email: tuberculosis@sedes.gob.bo
              </span>
            </p>
          </div>
        </div>
        
        {/* Copyright final */}
        <div className="text-center text-xs text-gray-400 mt-2">
          <p>Todos los derechos reservados. SEDES Cochabamba {currentYear}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
