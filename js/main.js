// js/main.js
// ============================================================
// MAIN - Funcionalidades globales (menú móvil)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  // Menú hamburguesa
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-links');

  if (toggle && menu) {
    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('active');
      menu.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        toggle.classList.remove('active');
        menu.classList.remove('active');
      });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        toggle.classList.remove('active');
        menu.classList.remove('active');
      }
    });
  }

  // Marcar enlace activo
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(function(link) {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('activo');
    }
  });
});
