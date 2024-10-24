import config from "../env.js";
window.addEventListener("DOMContentLoaded", function () {
  async function cargarActividades() {
    const response = await fetch(`${config.HOST}app/controllers/Usuario.controllers.php?operacion=obtenerPermisos`);
    const data = await response.json();
    //const actividades = data[0].actividades;
    console.log(data);
  }
  cargarActividades();
});