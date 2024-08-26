import config from '../env.js';

window.addEventListener("DOMContentLoaded", event => {
  function $(id) {
    return document.querySelector(id);
  }
  async function logear() {
    const user = $("#NomUser").value;
    const pass = $("#PassUser").value;
    if (user != "" && pass != "") {
      const respuesta = await fetch(`${config.HOST}controllers/Usuarios.controllers.php?Operacion=Login&nombreUser=${user}&pass=${pass}`)
      const datos = await respuesta.json();
      if (datos.estado) {
        await getPermisos(datos.idRol);
        alert(datos.mensaje)
        window.location.href = `${config.HOST}views`;
      } else {
        alert(datos.mensaje)
      }
    }
  }
  async function getPermisos(idRol){
    await fetch(`${config.HOST}controllers/roles.controllers.php?operacion=getPermisos&rol=${idRol}`);
  }

  $("#PassUser").addEventListener("keydown", (event) => {
    if(event.KeyCode == 13){
      logear();
    }
  })
  $("#btnIniciar").addEventListener("click", (event)=> {
    event.preventDefault();
    logear();
  })
})