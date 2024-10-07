window.addEventListener("DOMContentLoaded", () => {
    function $(id) { return document.querySelector(id) }
    const Soporte = $("#molSoporte");
    const Contratos = $("#molContratos");
    const Inventariado = $("#molInventariado");
    const Usuario = $("#molUsuarios");
    const Clientes = $("#molClientes");
    const Roles = $("#molRoles");

    if (permisos.length > 0 && permisos[0].permisos) {
        if(permisos[0].permisos.soporte?.leer){
            Soporte.removeAttribute('hidden');
        }else {
            Soporte.setAttribute('hidden', true); 
        }
        if(permisos[0].permisos.contratos?.leer){
            Contratos.removeAttribute('hidden');
        }else {
            Contratos.setAttribute('hidden', true); 
        }
        if(permisos[0].permisos.inventariado?.leer){
            Inventariado.removeAttribute('hidden');
        }else {
            Inventariado.setAttribute('hidden', true);
        }
        if(permisos[0].permisos.personas?.leer){
            Clientes.removeAttribute('hidden');
        }else {
            Clientes.setAttribute('hidden', true); 
        }
        if(permisos[0].permisos.personas?.leer){
            Usuario.removeAttribute('hidden');
        }else {
            Usuario.setAttribute('hidden', true); 
        }
        if(permisos[0].permisos.roles?.leer){
            Roles.removeAttribute('hidden');
        }else {
            Roles.setAttribute('hidden', true); 
        }
    }
});
