// SOLO PARA EL MENÚ HAMBURGUESA
document.addEventListener('DOMContentLoaded', function() {
  
  const toggleBtn = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', function() {
      navLinks.classList.toggle('open');
    });
  }

  // Marcar enlace activo según la página actual
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('activo');
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  let toggle = document.getElementById('menu-toggle');
  let links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
});