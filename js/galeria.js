// ========== galeria.js - SUPABASE VERSION ==========

let filtroActual = 'todos';
let todasLasObras = [];

async function cargarGaleria() {
  const grid = document.getElementById('galeria-grid');
  if (!grid) return;

  grid.innerHTML = '<p class="text-muted" style="text-align:center; padding:3rem;">Cargando obras...</p>';

  try {
    todasLasObras = await obtenerObras();
    renderizarObras();
  } catch (err) {
    console.error('Error cargando galería:', err);
    grid.innerHTML = '<p class="text-muted" style="text-align:center; padding:3rem;">Error al cargar las obras. Intentá de nuevo.</p>';
  }
}

function renderizarObras() {
  const grid = document.getElementById('galeria-grid');
  if (!grid) return;

  let obras = todasLasObras;

  if (filtroActual !== 'todos') {
    obras = obras.filter(o => {
      const tecnica = (o.tecnica || '').toLowerCase();
      if (filtroActual === 'oleo') return tecnica.includes('óleo') || tecnica.includes('oleo');
      if (filtroActual === 'acrilico') return tecnica.includes('acrílico') || tecnica.includes('acrilico');
      if (filtroActual === 'mixta') return tecnica.includes('mixta') || tecnica.includes('mix');
      return true;
    });
  }

  if (obras.length === 0) {
    grid.innerHTML = '<p class="text-muted" style="text-align:center; padding:3rem;">No hay obras en esta categoría.</p>';
    return;
  }

  grid.innerHTML = obras.map(obra => {
    const imagenSrc = obra.imagen_url || 'imagenes/default.jpg';
    return `
      <div class="obra-card" onclick="verObra(${obra.id})">
        <img src="${imagenSrc}" class="obra-card__img" alt="${obra.titulo}" loading="lazy"
             onerror="this.style.background='#e8e4de'; this.style.minHeight='200px';">
        <div class="obra-card__info">
          <h3>${obra.titulo}</h3>
          <p>${obra.anio} · ${obra.tecnica}</p>
        </div>
      </div>
    `;
  }).join('');
}

function verObra(id) {
  const obra = todasLasObras.find(o => o.id === id);
  if (!obra) return;

  const modal = document.getElementById('obra-modal');
  if (!modal) return;

  const imagenSrc = obra.imagen_url || 'imagenes/default.jpg';

  modal.querySelector('.modal__img').src = imagenSrc;
  modal.querySelector('.modal__titulo').innerHTML = obra.titulo;
  modal.querySelector('.modal__anio').innerHTML = obra.anio;
  modal.querySelector('.modal__tecnica').innerHTML = obra.tecnica;
  modal.querySelector('.modal__dimensiones').innerHTML = obra.dimensiones || 'No especificado';
  modal.querySelector('.modal__descripcion').innerHTML = obra.descripcion || '';

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  const modal = document.getElementById('obra-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function filtrarGaleria(filtro) {
  filtroActual = filtro;
  renderizarObras();
  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filtro === filtro);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  cargarGaleria();

  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => filtrarGaleria(btn.dataset.filtro));
  });

  const cerrarBtn = document.getElementById('cerrar-modal');
  if (cerrarBtn) cerrarBtn.addEventListener('click', cerrarModal);

  const modal = document.getElementById('obra-modal');
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) cerrarModal(); });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModal(); });
});

window.cargarGaleria = cargarGaleria;
window.verObra = verObra;
window.filtrarGaleria = filtrarGaleria;
window.cerrarModal = cerrarModal;
