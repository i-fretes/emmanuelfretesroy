// js/main.js — navbar global

document.addEventListener('DOMContentLoaded', function () {

  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {

    // Abrir / cerrar al tocar el botón
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const abierto = navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active', abierto);
      // Bloquear scroll del body cuando el menú está abierto
      document.body.style.overflow = abierto ? 'hidden' : '';
    });

    // Cerrar al tocar cualquier enlace
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Cerrar al tocar fuera del menú
    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Marcar enlace activo
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(function (link) {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('activo');
    }
  });
});
