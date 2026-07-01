// ========== admin.js - SUPABASE VERSION ==========

const PASS = 'artista123';

// ============================================================
// LOGIN / LOGOUT
// ============================================================

function login(e) {
  e.preventDefault();
  if (document.getElementById('adminPassword').value === PASS) {
    sessionStorage.setItem('admin_logueado', 'true');
    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    cargarPanel();
  } else {
    document.getElementById('loginError').innerText = 'Contraseña incorrecta';
  }
}

function logout() {
  sessionStorage.removeItem('admin_logueado');
  document.getElementById('loginPanel').style.display = 'block';
  document.getElementById('adminPanel').style.display = 'none';
}

// ============================================================
// CARGAR PANEL COMPLETO
// ============================================================

async function cargarPanel() {
  await Promise.all([renderTabla(), cargarMensajes()]);
}

// ============================================================
// TABLA DE OBRAS
// ============================================================

async function renderTabla() {
  const tbody = document.getElementById('tablaObras');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem;">Cargando...</td></tr>';

  try {
    const obras = await obtenerObras();
    actualizarStats(obras);

    if (obras.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-row">No hay obras cargadas</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    obras.forEach(obra => {
      const row = tbody.insertRow();
      const imagenHtml = obra.imagen_url
        ? `<img src="${obra.imagen_url}" width="50" height="50" style="object-fit:cover; border-radius:4px;">`
        : '<div style="width:50px;height:50px;background:#e8e4de;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">🎨</div>';

      row.innerHTML = `
        <td style="text-align:center">${imagenHtml}</td>
        <td><strong>${obra.titulo}</strong><br><small>${obra.tecnica}</small></td>
        <td>${obra.anio}</td>
        <td>${obra.tecnica}</td>
        <td>${obra.destacada ? '⭐ Sí' : '—'}</td>
        <td>
          <button class="btn-small btn-edit" data-id="${obra.id}"
            style="background:#b8924a;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;margin-right:5px;">
            Editar
          </button>
          <button class="btn-small btn-delete" data-id="${obra.id}"
            style="background:#c0392b;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">
            Eliminar
          </button>
        </td>
      `;
    });

    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => editarObra(btn.dataset.id));
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => confirmarEliminar(btn.dataset.id));
    });

  } catch (err) {
    console.error('Error cargando obras:', err);
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red; padding:2rem;">Error al cargar obras.</td></tr>';
  }
}

function actualizarStats(obras) {
  const totalSpan = document.getElementById('totalObras');
  if (totalSpan) totalSpan.innerText = obras.length;

  const destacadasSpan = document.getElementById('totalDestacadas');
  if (destacadasSpan) destacadasSpan.innerText = obras.filter(o => o.destacada).length;

  const ultimoSpan = document.getElementById('ultimoAnio');
  if (ultimoSpan) {
    const ultimo = obras.length ? Math.max(...obras.map(o => o.anio)) : '-';
    ultimoSpan.innerText = ultimo;
  }

  const countSpan = document.getElementById('obrasCount');
  if (countSpan) countSpan.innerText = obras.length + ' obras';
}

// ============================================================
// EDITAR / ELIMINAR
// ============================================================

async function editarObra(id) {
  try {
    const obras = await obtenerObras();
    const obra = obras.find(o => String(o.id) === String(id));
    if (!obra) return;

    document.getElementById('obraId').value = obra.id;
    document.getElementById('titulo').value = obra.titulo;
    document.getElementById('anio').value = obra.anio;
    document.getElementById('tecnica').value = obra.tecnica;
    document.getElementById('dimensiones').value = obra.dimensiones || '';
    document.getElementById('descripcion').value = obra.descripcion || '';
    document.getElementById('destacada').checked = obra.destacada;
    document.getElementById('formTitle').innerHTML = '✏️ Editando obra';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    mostrarMsg('Error al cargar la obra para editar', true);
  }
}

async function confirmarEliminar(id) {
  if (!confirm('¿Eliminar esta obra permanentemente?')) return;

  try {
    await eliminarObra(id);
    mostrarMsg('✓ Obra eliminada correctamente');
    await renderTabla();
  } catch (err) {
    console.error('Error eliminando:', err);
    mostrarMsg('Error al eliminar la obra', true);
  }
}

// ============================================================
// GUARDAR OBRA (crear o actualizar)
// ============================================================

async function guardarObra(e) {
  e.preventDefault();

  const id = document.getElementById('obraId').value;
  const titulo = document.getElementById('titulo').value.trim();
  const anio = parseInt(document.getElementById('anio').value);
  const tecnica = document.getElementById('tecnica').value.trim();
  const dimensiones = document.getElementById('dimensiones').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const destacada = document.getElementById('destacada').checked;
  const archivo = document.getElementById('imagenArchivo').files[0];

  if (!titulo || !anio || !tecnica) {
    mostrarMsg('Completá título, año y técnica', true);
    return;
  }

  const btnGuardar = document.querySelector('#obraForm button[type="submit"]');
  if (btnGuardar) { btnGuardar.disabled = true; btnGuardar.textContent = 'Guardando...'; }

  try {
    let imagen_url = null;

    // Subir imagen si se seleccionó una
    if (archivo) {
      if (!archivo.type.startsWith('image/')) {
        mostrarMsg('El archivo debe ser una imagen', true);
        return;
      }
      if (archivo.size > 5 * 1024 * 1024) {
        mostrarMsg('La imagen no debe superar los 5MB', true);
        return;
      }

      const extension = archivo.name.split('.').pop();
      const nombreArchivo = `obra_${Date.now()}.${extension}`;
      imagen_url = await subirImagen(archivo, nombreArchivo);
    }

    const datosObra = { titulo, anio, tecnica, dimensiones, descripcion, destacada };
    if (imagen_url) datosObra.imagen_url = imagen_url;

    if (id) {
      await actualizarObra(id, datosObra);
      mostrarMsg('✓ Obra actualizada');
    } else {
      await crearObra(datosObra);
      mostrarMsg('✓ Obra agregada correctamente');
    }

    limpiarForm();
    await renderTabla();

  } catch (err) {
    console.error('Error guardando obra:', err);
    mostrarMsg('Error al guardar la obra. Verificá la conexión.', true);
  } finally {
    if (btnGuardar) { btnGuardar.disabled = false; btnGuardar.textContent = '💾 Guardar obra'; }
  }
}

// ============================================================
// MENSAJES DE CONTACTO
// ============================================================

async function cargarMensajes() {
  const tbody = document.getElementById('tablaMensajes');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:1rem;">Cargando mensajes...</td></tr>';

  try {
    const mensajes = await obtenerMensajes();

    if (!mensajes || mensajes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-row">No hay mensajes guardados</td></tr>';
      return;
    }

    tbody.innerHTML = mensajes.map(m => `
      <tr>
        <td>${new Date(m.created_at).toLocaleDateString('es-PY')}</td>
        <td>${m.nombre || '-'}</td>
        <td>${m.email || '-'}</td>
        <td>${m.asunto || '-'}</td>
        <td style="max-width:200px; overflow:hidden; text-overflow:ellipsis;">${m.mensaje || '-'}</td>
      </tr>
    `).join('');

  } catch (err) {
    console.error('Error cargando mensajes:', err);
    tbody.innerHTML = '<tr><td colspan="5" style="color:red; text-align:center; padding:1rem;">Error al cargar mensajes.</td></tr>';
  }
}

// ============================================================
// UTILIDADES
// ============================================================

function limpiarForm() {
  document.getElementById('obraId').value = '';
  document.getElementById('titulo').value = '';
  document.getElementById('anio').value = '';
  document.getElementById('tecnica').value = '';
  document.getElementById('dimensiones').value = '';
  document.getElementById('descripcion').value = '';
  document.getElementById('imagenArchivo').value = '';
  document.getElementById('destacada').checked = false;
  document.getElementById('formTitle').innerHTML = '➕ Agregar nueva obra';

  const preview = document.getElementById('vistaPrevia');
  if (preview) preview.style.display = 'none';
  const previewImg = document.getElementById('previewImg');
  if (previewImg) previewImg.src = '';
  const fileName = document.getElementById('fileName');
  if (fileName) fileName.innerText = 'Ningún archivo seleccionado';
}

function mostrarMsg(texto, error = false) {
  let toast = document.getElementById('toastMsg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.style.cssText = 'position:fixed;bottom:2rem;right:2rem;background:#1a1a1a;color:white;padding:0.7rem 1.2rem;border-radius:4px;opacity:0;transition:0.3s;z-index:1000;';
    document.body.appendChild(toast);
  }
  toast.textContent = texto;
  toast.style.background = error ? '#c0392b' : '#2c3e50';
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

// ============================================================
// INIT
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // Preview imagen
  const imagenInput = document.getElementById('imagenArchivo');
  if (imagenInput) {
    imagenInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      const fileNameSpan = document.getElementById('fileName');
      const previewDiv = document.getElementById('vistaPrevia');
      const previewImg = document.getElementById('previewImg');
      if (file) {
        if (fileNameSpan) fileNameSpan.innerText = file.name;
        const reader = new FileReader();
        reader.onload = ev => {
          if (previewImg) previewImg.src = ev.target.result;
          if (previewDiv) previewDiv.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        if (fileNameSpan) fileNameSpan.innerText = 'Ningún archivo seleccionado';
        if (previewDiv) previewDiv.style.display = 'none';
      }
    });
  }

  // Borrar todos los mensajes
  const borrarMensajesBtn = document.getElementById('borrarMensajesBtn');
  if (borrarMensajesBtn) {
    borrarMensajesBtn.addEventListener('click', async () => {
      if (!confirm('¿Borrar todos los mensajes permanentemente?')) return;
      try {
        await eliminarTodosMensajes();
        mostrarMsg('✓ Mensajes eliminados');
        await cargarMensajes();
      } catch (err) {
        mostrarMsg('Error al eliminar mensajes', true);
      }
    });
  }

  // Eventos del formulario
  if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', login);
  }
  if (document.getElementById('obraForm')) {
    document.getElementById('obraForm').addEventListener('submit', guardarObra);
  }
  if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', logout);
  }
  if (document.getElementById('cancelarBtn')) {
    document.getElementById('cancelarBtn').addEventListener('click', limpiarForm);
  }

  // Auto-login si ya estaba logueado
  if (sessionStorage.getItem('admin_logueado') === 'true') {
    document.getElementById('loginPanel').style.display = 'none';
    const panel = document.getElementById('adminPanel');
    if (panel) {
      panel.style.display = 'block';
      cargarPanel();
    }
  }
});
