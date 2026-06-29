// ========== admin.js - VERSIÓN COMPLETA Y FUNCIONAL ==========
const PASS = 'artista123';
const STORAGE_KEY = 'mis_obras';

function getObras() {
  let data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

function saveObras(obras) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obras));
  if (typeof window.cargarGaleria === 'function') window.cargarGaleria();
  if (typeof window.cargarDestacadas === 'function') window.cargarDestacadas();
  if (document.getElementById('tablaObras')) renderTabla();
}

function renderTabla() {
  let obras = getObras();
  let tbody = document.getElementById('tablaObras');
  if (!tbody) return;
  
  if (obras.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem;">No hay obras cargadas</td></tr>';
    return;
  }
  
  tbody.innerHTML = '';
  for (let i = 0; i < obras.length; i++) {
    let obra = obras[i];
    let row = tbody.insertRow();
    
    let imagenHtml = '';
    if (obra.imagenBase64 && obra.imagenBase64.startsWith('data:image')) {
      imagenHtml = `<img src="${obra.imagenBase64}" width="50" height="50" style="object-fit:cover; border-radius:4px;">`;
    } else {
      imagenHtml = '<div style="width:50px;height:50px;background:#e8e4de;display:flex;align-items:center;justify-content:center;">🎨</div>';
    }
    
    row.innerHTML = `
      <td style="text-align:center">${imagenHtml}</td>
      <td><strong>${obra.titulo}</strong><br><small>${obra.tecnica}</small></td>
      <td>${obra.anio}</td>
      <td>${obra.destacada ? '⭐ Sí' : '—'}</td>
      <td>
        <button class="btn-small btn-edit" data-id="${obra.id}" style="background:#b8924a;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;margin-right:5px;">Editar</button>
        <button class="btn-small btn-delete" data-id="${obra.id}" style="background:#c0392b;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">Eliminar</button>
      </td>
    `;
  }
  
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => editarObra(parseInt(btn.dataset.id)));
  });
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => eliminarObra(parseInt(btn.dataset.id)));
  });
}

function eliminarObra(id) {
  if (!confirm('¿Eliminar esta obra permanentemente?')) return;
  
  let obras = getObras();
  let nuevasObras = obras.filter(o => o.id !== id);
  saveObras(nuevasObras);
  actualizarStats();
  mostrarMsg('✓ Obra eliminada correctamente');
}

function editarObra(id) {
  let obra = getObras().find(o => o.id === id);
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
}

function actualizarStats() {
  let obras = getObras();
  let totalSpan = document.getElementById('totalObras');
  if (totalSpan) totalSpan.innerText = obras.length;
  let destacadasSpan = document.getElementById('totalDestacadas');
  if (destacadasSpan) destacadasSpan.innerText = obras.filter(o => o.destacada).length;
  let ultimoSpan = document.getElementById('ultimoAnio');
  if (ultimoSpan) {
    let ultimo = obras.length ? Math.max(...obras.map(o => o.anio)) : '-';
    ultimoSpan.innerText = ultimo;
  }
  let countSpan = document.getElementById('obrasCount');
  if (countSpan) countSpan.innerText = obras.length + ' obras';
}

function mostrarMsg(texto, error = false) {
  let toast = document.getElementById('toastMsg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.style.cssText = 'position:fixed;bottom:2rem;right:2rem;background:#1a1a1a;color:white;padding:0.7rem 1.2rem;border-radius:4px;opacity:0;transition:0.3s;z-index:1000';
    document.body.appendChild(toast);
  }
  toast.textContent = texto;
  toast.style.background = error ? '#c0392b' : '#2c3e50';
  toast.style.opacity = '1';
  setTimeout(() => toast.style.opacity = '0', 2500);
}

function guardarObra(e) {
  e.preventDefault();
  let id = document.getElementById('obraId').value;
  let titulo = document.getElementById('titulo').value.trim();
  let anio = parseInt(document.getElementById('anio').value);
  let tecnica = document.getElementById('tecnica').value.trim();
  let dimensiones = document.getElementById('dimensiones').value.trim();
  let descripcion = document.getElementById('descripcion').value.trim();
  let destacada = document.getElementById('destacada').checked;
  let archivo = document.getElementById('imagenArchivo').files[0];
  
  if (!titulo || !anio || !tecnica) {
    mostrarMsg('Completá título, año y técnica', true);
    return;
  }
  
  let categoria = 'mixta';
  if (tecnica.toLowerCase().includes('óleo')) categoria = 'oleo';
  else if (tecnica.toLowerCase().includes('acrílico')) categoria = 'acrilico';
  
  let obras = getObras();
  
  const guardar = (imagenBase64) => {
    if (id) {
      let idx = obras.findIndex(o => o.id == id);
      if (idx !== -1) {
        obras[idx] = { ...obras[idx], titulo, anio, tecnica, dimensiones, descripcion, destacada, categoria };
        if (imagenBase64) obras[idx].imagenBase64 = imagenBase64;
        mostrarMsg('✓ Obra actualizada');
      }
    } else {
      let nuevaObra = { 
        id: Date.now(), 
        titulo, 
        anio, 
        tecnica, 
        dimensiones, 
        descripcion, 
        destacada, 
        categoria,
        imagenBase64: imagenBase64 || null
      };
      obras.push(nuevaObra);
      mostrarMsg('✓ Obra agregada correctamente');
    }
    saveObras(obras);
    renderTabla();
    actualizarStats();
    limpiarForm();
  };
  
  if (archivo) {
    if (!archivo.type.startsWith('image/')) {
      mostrarMsg('El archivo debe ser una imagen', true);
      return;
    }
    if (archivo.size > 2 * 1024 * 1024) {
      mostrarMsg('La imagen no debe superar los 2MB', true);
      return;
    }
    const reader = new FileReader();
    reader.onload = function(event) { guardar(event.target.result); };
    reader.readAsDataURL(archivo);
  } else {
    guardar(null);
  }
}

function limpiarForm() {
  document.getElementById('obraId').value = '';
  document.getElementById('titulo').value = '';
  document.getElementById('anio').value = '';
  document.getElementById('tecnica').value = '';
  document.getElementById('dimensiones').value = '';
  document.getElementById('descripcion').value = '';
  document.getElementById('imagenArchivo').value = '';
  document.getElementById('destacada').checked = false;
  document.getElementById('formTitle').innerHTML = '➕ Agregar obra';
  let preview = document.getElementById('vistaPrevia');
  if (preview) preview.style.display = 'none';
  let previewImg = document.getElementById('previewImg');
  if (previewImg) previewImg.src = '';
  let fileName = document.getElementById('fileName');
  if (fileName) fileName.innerText = 'Ningún archivo seleccionado';
}

function login(e) {
  e.preventDefault();
  if (document.getElementById('adminPassword').value === PASS) {
    sessionStorage.setItem('admin_logueado', 'true');
    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    renderTabla();
    actualizarStats();
  } else {
    document.getElementById('loginError').innerText = 'Contraseña incorrecta';
  }
}

function logout() {
  sessionStorage.removeItem('admin_logueado');
  document.getElementById('loginPanel').style.display = 'block';
  document.getElementById('adminPanel').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  const imagenInput = document.getElementById('imagenArchivo');
  if (imagenInput) {
    imagenInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      const fileNameSpan = document.getElementById('fileName');
      const previewDiv = document.getElementById('vistaPrevia');
      const previewImg = document.getElementById('previewImg');
      if (file) {
        if (fileNameSpan) fileNameSpan.innerText = file.name;
        const reader = new FileReader();
        reader.onload = function(event) {
          if (previewImg) previewImg.src = event.target.result;
          if (previewDiv) previewDiv.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        if (fileNameSpan) fileNameSpan.innerText = 'Ningún archivo seleccionado';
        if (previewDiv) previewDiv.style.display = 'none';
        if (previewImg) previewImg.src = '';
      }
    });
  }
});

if (document.getElementById('loginPanel') && sessionStorage.getItem('admin_logueado') === 'true') {
  document.getElementById('loginPanel').style.display = 'none';
  if (document.getElementById('adminPanel')) {
    document.getElementById('adminPanel').style.display = 'block';
    renderTabla();
    actualizarStats();
  }
}

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
