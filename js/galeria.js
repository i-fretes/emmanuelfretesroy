// ========== galeria.js - VERSIÓN CORREGIDA ==========
const STORAGE_KEY = 'mis_obras';

function getObras() {
  let data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

let filtroActual = 'todos';

function cargarGaleria() {
  let grid = document.getElementById('galeria-grid');
  if (!grid) return;
  
  let obras = getObras();
  
  if (filtroActual !== 'todos') {
    obras = obras.filter(o => o.categoria === filtroActual);
  }
  
  if (obras.length === 0) {
    grid.innerHTML = '<p class="text-muted" style="text-align:center; padding:3rem;">No hay obras en esta categoría.</p>';
    return;
  }
  
  grid.innerHTML = obras.map(obra => {
    let imagenSrc = obra.imagenBase64 || `imagenes/${obra.imagen || 'default.jpg'}`;
    return `
      <div class="obra-card" onclick="verObra(${obra.id})">
        <img src="${imagenSrc}" class="obra-card__img" onerror="this.style.background='#e8e4de'">
        <div class="obra-card__info">
          <h3>${obra.titulo}</h3>
          <p>${obra.anio} · ${obra.tecnica}</p>
        </div>
      </div>
    `;
  }).join('');
}

function verObra(id) {
  let obra = getObras().find(o => o.id === id);
  if (!obra) return;
  
  let modal = document.getElementById('obra-modal');
  if (!modal) return;
  
  let imagenSrc = obra.imagenBase64 || `imagenes/${obra.imagen || 'default.jpg'}`;
  
  modal.querySelector('.modal__img').src = imagenSrc;
  modal.querySelector('.modal__titulo').innerHTML = obra.titulo;
  modal.querySelector('.modal__anio').innerHTML = obra.anio;
  modal.querySelector('.modal__tecnica').innerHTML = obra.tecnica;
  modal.querySelector('.modal__dimensiones').innerHTML = obra.dimensiones || 'No especificado';
  modal.querySelector('.modal__descripcion').innerHTML = obra.descripcion || 'Sin descripción';
  
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  let modal = document.getElementById('obra-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function filtrarGaleria(filtro) {
  filtroActual = filtro;
  cargarGaleria();
  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filtro === filtro);
  });
}

window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) cargarGaleria();
});

document.addEventListener('DOMContentLoaded', () => {
  cargarGaleria();
  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => filtrarGaleria(btn.dataset.filtro));
  });
  let cerrarBtn = document.getElementById('cerrar-modal');
  if (cerrarBtn) cerrarBtn.addEventListener('click', cerrarModal);
  let modal = document.getElementById('obra-modal');
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModal(); });
});

window.cargarGaleria = cargarGaleria;
window.verObra = verObra;
window.filtrarGaleria = filtrarGaleria;
window.cerrarModal = cerrarModal;
