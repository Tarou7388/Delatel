window.addEventListener("DOMContentLoaded", () => {
    function $(id) { return document.querySelector(id) }
    const Soporte = $("#molSoporte");
    const Contratos = $("#molContratos");
    const Inventariado = $("#molInventariado");
    const Personas = $("#molPersonas");
    const Roles = $("#molRoles");


    if(permisos[0].permisos.soporte.leer == 1){
        Soporte.removeAttribute('hidden');
    }
    if(permisos[0].permisos.soporte.leer == 1){
        Contratos.removeAttribute('hidden');
    }
    if(permisos[0].permisos.soporte.leer == 1){
        Inventariado.removeAttribute('hidden');
    }
    if(permisos[0].permisos.soporte.leer == 1){
        Personas.removeAttribute('hidden');
    }
    if(permisos[0].permisos.soporte.leer == 1){
        Roles.removeAttribute('hidden');
    }
});
