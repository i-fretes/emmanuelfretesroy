// ========== contacto.js - SUPABASE VERSION ==========

document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('contactoForm');
  const btnEnviar = form.querySelector('.btn-enviar');
  const mensajeDiv = document.getElementById('formMensaje');

  const NUMERO_ARTISTA = "595984332922";

  function mostrarMensaje(texto, tipo) {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = 'form-mensaje ' + tipo;
    mensajeDiv.style.display = 'block';
    setTimeout(() => { mensajeDiv.style.display = 'none'; }, 5000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validarFormulario() {
    let esValido = true;
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');

    [nombre, email, mensaje].forEach(c => c.classList.remove('error'));

    if (!nombre.value.trim()) { nombre.classList.add('error'); esValido = false; }
    if (!email.value.trim() || !isValidEmail(email.value.trim())) { email.classList.add('error'); esValido = false; }
    if (!mensaje.value.trim()) { mensaje.classList.add('error'); esValido = false; }

    return esValido;
  }

  function obtenerDatos() {
    return {
      nombre: document.getElementById('nombre').value.trim(),
      email: document.getElementById('email').value.trim(),
      asunto: document.getElementById('asunto').value || 'No especificado',
      mensaje: document.getElementById('mensaje').value.trim()
    };
  }

  function enviarPorWhatsApp(datos) {
    let msg = `*Nuevo mensaje desde la web de Emmanuel Fretes Roy*%0A%0A`;
    msg += `*Nombre:* ${datos.nombre}%0A`;
    msg += `*Email:* ${datos.email}%0A`;
    msg += `*Asunto:* ${datos.asunto}%0A%0A`;
    msg += `*Mensaje:*%0A${datos.mensaje}%0A%0A`;
    msg += `_(Responder a: ${datos.email})_`;
    window.open(`https://wa.me/${NUMERO_ARTISTA}?text=${msg}`, '_blank');
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validarFormulario()) {
      mostrarMensaje('Por favor, completá todos los campos correctamente.', 'error');
      return;
    }

    const datos = obtenerDatos();

    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';

    try {
      // Guardar en Supabase
      await crearMensaje(datos);
      console.log('✅ Mensaje guardado en Supabase');
    } catch (err) {
      // Si falla Supabase, igual seguimos con WhatsApp
      console.warn('⚠️ No se pudo guardar en Supabase:', err);
    }

    // Abrir WhatsApp
    enviarPorWhatsApp(datos);

    mostrarMensaje('✓ ¡Mensaje enviado! Se abrirá WhatsApp para confirmar.', 'success');
    form.reset();
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select')
      .forEach(c => c.classList.remove('error'));

    btnEnviar.disabled = false;
    btnEnviar.textContent = 'Enviar mensaje';
  });

  // Limpiar errores al escribir
  document.querySelectorAll('#contactoForm input, #contactoForm textarea, #contactoForm select')
    .forEach(input => input.addEventListener('input', function () {
      this.classList.remove('error');
    }));
});
