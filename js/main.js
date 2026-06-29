// js/main.js
// ============================================================
// MAIN - Funcionalidades globales (menú móvil)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ main.js cargado');

  // ============================================================
  // MENÚ HAMBURGUESA
  // ============================================================

  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    console.log('✅ Botón y menú encontrados');

    // Abrir/cerrar menú al hacer clic en el botón
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log('🔄 Click en menú');

      // Alternar clases
      this.classList.toggle('active');
      navLinks.classList.toggle('active');

      console.log('Menú activo:', navLinks.classList.contains('active'));
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        console.log('🔗 Enlace clickeado, menú cerrado');
      });
    });

    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(e) {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  } else {
    console.error('❌ No se encontró el botón o el menú');
  }

  // ============================================================
  // MARCAR ENLACE ACTIVO
  // ============================================================

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('activo');
    }
  });
});
