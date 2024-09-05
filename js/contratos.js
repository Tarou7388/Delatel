document.addEventListener("DOMContentLoaded", () => {
  $(document).ready(function () {
    $('#listarContratos').DataTable({
      "language": {
        "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
      },
      "columnDefs": [
        { "width": "40%", "targets": 0 },
        { "width": "20%", "targets": 1 },
        { "width": "40%", "targets": 2 }
      ]
    });
  });
  const boton = document.querySelector("#generar");

  boton.addEventListener("click", () => {
    window.open(`../views/reports/Carpeta-PDF/soporte.php`);
  });

});