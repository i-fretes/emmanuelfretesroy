/* ========================================
   CONTACTO - CON WHATSAPP Y LOCALSTORAGE
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  
  const form = document.getElementById('contactoForm');
  const btnEnviar = form.querySelector('.btn-enviar');
  const mensajeDiv = document.getElementById('formMensaje');
  
  // Número del artista (formato internacional sin + ni espacios)
  const NUMERO_ARTISTA = "595984332922";
  
  function mostrarMensaje(texto, tipo) {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = 'form-mensaje ' + tipo;
    mensajeDiv.style.display = 'block';
    
    setTimeout(() => {
      mensajeDiv.style.display = 'none';
    }, 5000);
  }
  
  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  function validarFormulario() {
    let esValido = true;
    
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');
    
    [nombre, email, mensaje].forEach(campo => {
      campo.classList.remove('error');
    });
    
    if (!nombre.value.trim()) {
      nombre.classList.add('error');
      esValido = false;
    }
    
    if (!email.value.trim() || !isValidEmail(email.value.trim())) {
      email.classList.add('error');
      esValido = false;
    }
    
    if (!mensaje.value.trim()) {
      mensaje.classList.add('error');
      esValido = false;
    }
    
    return esValido;
  }
  
  function obtenerDatosFormulario() {
    return {
      nombre: document.getElementById('nombre').value.trim(),
      email: document.getElementById('email').value.trim(),
      asunto: document.getElementById('asunto').value,
      mensaje: document.getElementById('mensaje').value.trim(),
      fecha: new Date().toLocaleString()
    };
  }
  
  // ✅ Guardar mensaje en localStorage
  function guardarMensaje(datos) {
    const mensajesGuardados = localStorage.getItem('mensajes_contacto');
    let mensajes = [];
    
    if (mensajesGuardados) {
      mensajes = JSON.parse(mensajesGuardados);
    }
    
    datos.id = Date.now();
    mensajes.push(datos);
    localStorage.setItem('mensajes_contacto', JSON.stringify(mensajes));
    
    console.log('📝 Mensaje guardado:', datos);
  }
  
  // ✅ Enviar por WhatsApp (nueva función)
  function enviarPorWhatsApp(datos) {
    // Construir mensaje para WhatsApp
    let mensajeWhatsApp = `*Nuevo mensaje desde la web de Emmanuel Fretes Roy*%0A%0A`;
    mensajeWhatsApp += `*Nombre:* ${datos.nombre}%0A`;
    mensajeWhatsApp += `*Email:* ${datos.email}%0A`;
    mensajeWhatsApp += `*Asunto:* ${datos.asunto || 'No especificado'}%0A`;
    mensajeWhatsApp += `*Fecha:* ${datos.fecha}%0A%0A`;
    mensajeWhatsApp += `*Mensaje:*%0A${datos.mensaje}%0A%0A`;
    mensajeWhatsApp += `_(Responder a este email: ${datos.email})_`;
    
    // Abrir WhatsApp
    const url = `https://wa.me/${NUMERO_ARTISTA}?text=${mensajeWhatsApp}`;
    window.open(url, '_blank');
  }
  
  // ✅ Enviar por email (abre el cliente de email como respaldo)
  function enviarPorEmail(datos) {
    const asunto = `Contacto desde web: ${datos.asunto || 'Consulta'}`;
    const cuerpo = `Nombre: ${datos.nombre}%0AEmail: ${datos.email}%0A%0AMensaje:%0A${datos.mensaje}`;
    window.location.href = `mailto:emmanuelfretesroy@hotmail.com?subject=${asunto}&body=${cuerpo}`;
  }
  
  // ✅ Manejar el envío del formulario
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validarFormulario()) {
      mostrarMensaje('Por favor, completá todos los campos correctamente.', 'error');
      return;
    }
    
    const datos = obtenerDatosFormulario();
    
    // 1. Guardar en localStorage (copia local)
    guardarMensaje(datos);
    
    // 2. Enviar por WhatsApp (principal)
    enviarPorWhatsApp(datos);
    
    // 3. Mostrar mensaje de éxito
    mostrarMensaje('✓ ¡Mensaje enviado! Se abrirá WhatsApp para confirmar el envío.', 'success');
    
    // 4. Limpiar formulario
    form.reset();
    
    // Limpiar clases de error
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(campo => {
      campo.classList.remove('error');
    });
  });
  
  // Limpiar error al escribir
  const inputs = document.querySelectorAll('#contactoForm input, #contactoForm textarea, #contactoForm select');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      this.classList.remove('error');
    });
  });
  
  // Mostrar mensajes guardados en consola (solo para debug)
  const mensajesGuardados = localStorage.getItem('mensajes_contacto');
  if (mensajesGuardados) {
    console.log('📋 Mensajes anteriores:', JSON.parse(mensajesGuardados).length);
  }
});