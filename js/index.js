// ========== js/index.js (VERSIÓN CON IMÁGENES BASE64) ==========
const STORAGE_KEY = 'mis_obras';

function getObras() {
  let data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

function cargarDestacadas() {
  let grid = document.getElementById('destacadas-grid');
  if (!grid) return;
  
  let obras = getObras();
  let destacadas = obras.filter(o => o.destacada === true);
  
  if (destacadas.length === 0) {
    destacadas = obras.slice(0, 2);
  }
  
  if (destacadas.length === 0) {
    grid.innerHTML = `
      <div style="text-align:center; width:100%; padding: 2rem;">
        <p class="text-muted" style="font-style: italic;">Próximamente nuevas obras...</p>
        <p style="font-size: 0.8rem; margin-top: 0.5rem;">
          <a href="admin.html" style="color: var(--ocre);">👉 Accede al panel admin</a> para comenzar a cargar obras.
        </p>
      </div>
    `;
    return;
  }
  
  let mostrar = destacadas.slice(0, 2);
  
  grid.innerHTML = mostrar.map(obra => {
    let imagenSrc = '';
    if (obra.imagenBase64 && obra.imagenBase64.startsWith('data:image')) {
      imagenSrc = obra.imagenBase64;
    } else {
      imagenSrc = `imagenes/${obra.imagen || 'default.jpg'}`;
    }
    
    return `
      <div class="dest-card ${mostrar.length === 1 ? 'dest-card--large' : ''}" onclick="window.location.href='galeria.html'">
        <img src="${imagenSrc}" class="dest-card__img" onerror="this.style.background='#e8e4de'">
        <div class="dest-card__info">
          <h3>${obra.titulo}</h3>
          <p>${obra.anio} · ${obra.tecnica}</p>
        </div>
      </div>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  cargarDestacadas();
});

window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) {
    cargarDestacadas();
  }
});

window.cargarDestacadas = cargarDestacadas;