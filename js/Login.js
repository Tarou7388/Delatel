import config from '../env.js';

window.addEventListener("DOMContentLoaded", event => {

  const HOST = config.HOST;

  function $(id) {
    return document.querySelector(id);
  }

  async function logear() {
    const user = $("#txtNomUser").value;
    const pass = $("#txtPassUser").value;

    if (user != "" && pass != "") {
      const respuesta = await fetch(`${HOST}app/controllers/Usuarios.controllers.php?operacion=login&nombreUser=${user}&pass=${pass}`);
      const datos = await respuesta.json();
      console.log(datos)
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


  $("#txtPassUser").addEventListener("keydown", async (event) => {
    if (event.keyCode === 13) {
      await logear();
    }
  });

  $("#btnIniciar").addEventListener("click",async (event) => {
    event.preventDefault();
    await logear();
  });
});
