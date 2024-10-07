window.addEventListener("DOMContentLoaded", () => {
  function $(id) {
    return document.querySelector(id);
  }
  const Soporte = $("#molSoporte");
  const Contratos = $("#molContratos");
  const Inventariado = $("#molInventariado");
  const Clientes = $("#molClientes");
  const Usuarios = $("#molUsuarios");
  const Roles = $("#molRoles");

    console.log(permisos[0].permisos);
  if (permisos[0].permisos.soporte?.leer) {
    Soporte.removeAttribute("hidden");
  } else {
    Soporte.setAttribute("hidden", true); // Asegúrate de ocultar
  }

  if (permisos[0].permisos.contratos?.leer) {
    Contratos.removeAttribute("hidden");
  } else {
    Contratos.setAttribute("hidden", true); // Asegúrate de ocultar
  }

  if (permisos[0].permisos.inventariado?.leer) {
    Inventariado.removeAttribute("hidden");
  } else {
    Inventariado.setAttribute("hidden", true); // Asegúrate de ocultar
  }

  if (permisos[0].permisos.personas?.leer) {
    Clientes.removeAttribute("hidden");
  } else {
    Clientes.setAttribute("hidden", true); // Asegúrate de ocultar
  }

  if (permisos[0].permisos.personas?.leer) {
    Usuarios.removeAttribute("hidden");
  } else {
    Usuarios.setAttribute("hidden", true); // Asegúrate de ocultar
  }

  if (permisos[0].permisos.roles?.leer) {
    Roles.removeAttribute("hidden");
  } else {
    Roles.setAttribute("hidden", true); // Asegúrate de ocultar
  }

});
