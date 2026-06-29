// js/main.js
// ============================================================
// MAIN - Funcionalidades globales (menú móvil)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  // ============================================================
  // MENÚ HAMBURGUESA - Versión mejorada
  // ============================================================
  
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (menuToggle && navLinks) {
    // Abrir/cerrar menú al hacer clic en el botón
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      console.log('Menú clickeado'); // Para depurar
    });
    
    // Cerrar menú al hacer clic en cualquier enlace
    const links = navLinks.querySelectorAll('a');
    links.forEach(function(link) {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        console.log('Enlace clickeado, menú cerrado');
      });
    });
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(e) {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  // ============================================================
  // MARCAR ENLACE ACTIVO
  // ============================================================
  
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const allLinks = document.querySelectorAll('.nav__links a');
  allLinks.forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('activo');
    }
  });
  
  console.log('✅ main.js cargado correctamente');
});
