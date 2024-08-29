import config from '../env.js';

document.addEventListener("DOMContentLoaded", function () {
  if (permisos[0].permisos.inventariado.leer != 1) {
    window.location.href = `${config.HOST}views`;
  }



});