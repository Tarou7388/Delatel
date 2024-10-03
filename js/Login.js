import config from '../env.js';

// 1. Variables locales
const HOST = config.HOST;

// 2. Funciones externas
function $(id) {
  return document.querySelector(id);
}

async function logear() {
  const user = $("#NomUser").value;
  const pass = $("#PassUser").value;

  if (user != "" && pass != "") {
    const respuesta = await fetch(`${HOST}app/controllers/Usuarios.controllers.php?Operacion=Login&nombreUser=${user}&pass=${pass}`);
    const datos = await respuesta.json();

    if (datos.estado) {
      await getPermisos(datos.idRol);
      showToast(datos.mensaje, "SUCCESS");
      window.location.href = `${HOST}views`;
    } else {
      showToast(datos.mensaje, "ERROR");
    }
  } else {
    showToast("Por favor, completa todos los campos.", "WARNING");
  }
}

async function getPermisos(idRol) {
  await fetch(`${HOST}app/controllers/roles.controllers.php?operacion=getPermisos&rol=${idRol}`);
}

// 3. Autoejecutables
window.addEventListener("DOMContentLoaded", event => {
  // 4. Eventos
  $("#PassUser").addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
      logear();
    }
  });

  $("#btnIniciar").addEventListener("click", (event) => {
    event.preventDefault();
    logear();
  });
});
