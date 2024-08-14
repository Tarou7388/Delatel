import config from '../env.js';

window.addEventListener("DOMContentLoaded", event => {
  
  function $(id) {
    return document.querySelector(id);
  }
  function logear() {
    const user = $("#NomUser").value;
    const pass = $("#PassUser").value;
    if (user != "") {
      fetch(`${config.HOST}controllers/Usuarios.controllers.php?Operacion=Login&nombreUser=${user}&pass=${pass}`)
        .then((respuesta) => respuesta.json())
        .then((datos) => {
          if (datos.estado) {
            alert(datos.mensaje)
            window.location.href = `${config.HOST}views`;
          } else {
            alert(datos.mensaje)
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }
  $("#PassUser").addEventListener("keypress", (event) => {
    if(event.KeyCode == 13){
      logear();
    }
  })
  $("#btnIniciar").addEventListener("click", ()=> {
    logear();
  })
})