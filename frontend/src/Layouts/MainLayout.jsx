// src/layouts/MainLayout.jsx
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  // Agregar efecto de inicialización para animaciones en la página
  useEffect(() => {
    // Esta función se ejecutará cuando el componente se monte
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      setTimeout(() => {
        mainContent.classList.add('fade-in');
      }, 100);
    }
    
    // Función de limpieza que se ejecuta cuando el componente se desmonte
    return () => {
      if (mainContent) {
        mainContent.classList.remove('fade-in');
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Espacio para que el contenido no quede debajo del navbar fijo */}
      <div className="h-16 md:h-20"></div>
      
      {/* Contenido principal con animaciones */}
      <main className="flex-grow bg-gray-50 main-content">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Animación sutil para el contenido */}
          <div className="animate-fadeIn">
            {children}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
