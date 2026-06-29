// js/main.js
// ============================================================
// MAIN - Funcionalidades globales (menú móvil)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  // Menú hamburguesa
  const toggleBtn = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    
    // Cerrar menú al hacer click en un enlace
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        toggleBtn.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Marcar enlace activo según la página actual
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('activo');
    }
  });
});