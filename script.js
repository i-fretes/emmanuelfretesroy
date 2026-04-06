// BOTÓN FLOTANTE PARA MOSTRAR/OCULTAR FORMULARIO
const btnAbrir = document.getElementById("btnAbrir");
const btnCerrar = document.getElementById("btnCerrar");
const formulario = document.getElementById("formularioObra");

btnAbrir.addEventListener("click", () => {
    formulario.classList.remove("oculto");
});

btnCerrar.addEventListener("click", () => {
    formulario.classList.add("oculto");
});