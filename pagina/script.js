const btnAbrir = document.getElementById("btnAbrir");
const btnCerrar = document.getElementById("btnCerrar");
const formulario = document.getElementById("formularioObra");

btnAbrir.addEventListener("click", () => {
    formulario.classList.remove("oculto");
});

btnCerrar.addEventListener("click", () => {
    formulario.classList.add("oculto");
});

// Cerrar si se hace clic fuera del formulario
formulario.addEventListener('click', (e) => {
    if(e.target === formulario){
        formulario.classList.add('oculto');
    }
});