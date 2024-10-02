import config from '../env.js';

window.addEventListener("DOMContentLoaded", event => {
  function $(id) {
    return document.querySelector(id);
  }
  
  async function logear() {
    const user = $("#NomUser").value;
    const pass = $("#PassUser").value;
    
    if (user != "" && pass != "") {
      const respuesta = await fetch(`${config.HOST}app/controllers/Usuarios.controllers.php?Operacion=Login&nombreUser=${user}&pass=${pass}`);
      const datos = await respuesta.json();
      
      if (datos.estado) {
        await getPermisos(datos.idRol);
        showToast(datos.mensaje, "SUCCESS");
        window.location.href = `${config.HOST}views`;
      } else {
        showToast(datos.mensaje, "ERROR");
      }
    } else {
      showToast("Por favor, completa todos los campos.", "WARNING");
    }
  }

  async function getPermisos(idRol){
    await fetch(`${config.HOST}app/controllers/roles.controllers.php?operacion=getPermisos&rol=${idRol}`);
  }

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
