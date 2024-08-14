/* const env = require('./config');
console.log(process.env.HOST); */
window.addEventListener("DOMContentLoaded", event => {
  
  function $(id) {
    return document.querySelector(id);
  }
  function logear() {
    const user = $("#NomUser").value;
    const pass = $("#PassUser").value;
    if (user != "") {
      console.log(user)
      console.log(pass)
      fetch(`http://localhost/delatel/controllers/Usuarios.controllers.php?Operacion=Login&nombreUser=${user}&pass=${pass}`)
        .then((respuesta) => respuesta.json())
        .then((datos) => {
          if (datos.estado) {
            alert(datos.mensaje)
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