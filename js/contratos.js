import config from "../env.js";
window.addEventListener("DOMContentLoaded", () => {
  $(document).ready(function () {
    $('#listarContratos').DataTable({
      language: {
        url: `${config.HOST}Json/es-Es.json`
      },
      columnDefs: [
        { "width": "40%", "targets": 0 },
        { "width": "20%", "targets": 1 },
        { "width": "40%", "targets": 2 }
      ]
    });
  });
  const boton = document.querySelector("#generar");

  boton.addEventListener("click", () => {
    window.open(`../reports/Carpeta-PDF/soporte.php`);
  });

});