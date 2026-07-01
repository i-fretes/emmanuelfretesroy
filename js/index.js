// ========== js/index.js - SUPABASE VERSION ==========

async function cargarDestacadas() {
  const grid = document.getElementById('destacadas-grid');
  if (!grid) return;

  grid.innerHTML = '<p class="text-muted" style="text-align:center; width:100%;">Cargando obras...</p>';

  try {
    let destacadas = await obtenerObrasDestacadas();

    // Si no hay destacadas, mostrar las 2 más recientes
    if (!destacadas || destacadas.length === 0) {
      const todas = await obtenerObras();
      destacadas = todas.slice(0, 2);
    }

    if (!destacadas || destacadas.length === 0) {
      grid.innerHTML = `
        <div style="text-align:center; width:100%; padding: 2rem;">
          <p class="text-muted" style="font-style: italic;">Próximamente nuevas obras...</p>
        </div>
      `;
      return;
    }

    const mostrar = destacadas.slice(0, 2);

    grid.innerHTML = mostrar.map(obra => {
      const imagenSrc = obra.imagen_url || 'imagenes/default.jpg';
      return `
        <div class="dest-card ${mostrar.length === 1 ? 'dest-card--large' : ''}"
             onclick="window.location.href='galeria.html'">
          <img src="${imagenSrc}" class="dest-card__img" alt="${obra.titulo}" loading="lazy"
               onerror="this.style.background='#e8e4de'; this.style.minHeight='200px';">
          <div class="dest-card__info">
            <h3>${obra.titulo}</h3>
            <p>${obra.anio} · ${obra.tecnica}</p>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error('Error cargando destacadas:', err);
    grid.innerHTML = '<p class="text-muted" style="text-align:center; width:100%;">Error al cargar las obras.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cargarDestacadas();
});

window.cargarDestacadas = cargarDestacadas;
