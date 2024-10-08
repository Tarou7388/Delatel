import config from '../env.js';
window.addEventListener("DOMContentLoaded", event => {
  // if (permisos[0].permisos.personas.leer != 1) {
  //   window.location.href = `${config.HOST}views`;
  // }
  $(document).ready(function () {
    $('#listarCliente').DataTable({
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
      },
      columnDefs: [
        { "width": "5%", "targets": 0 },
        { "width": "30%", "targets": 1 },
        { "width": "10%", "targets": 2 },
        { "width": "15%", "targets": 3 },
        { "width": "10%", "targets": 4 },
        { "width": "15%", "targets": 5 },
        { "width": "10%", "targets": 6 },
        { "width": "15%", "targets": 7 }
      ],
      autoWidth: false
    });
  });
  document.getElementById('saveChanges').addEventListener('click', function () {
    showToast("Cambios guardados", "SUCCESS");
    var modal = new bootstrap.Modal(document.getElementById('updateModal'));
    modal.hide();
  });
});
