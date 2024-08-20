window.addEventListener('DOMContentLoaded', event => {
  // Simple-DataTables
  // https://github.com/fiduswriter/Simple-DataTables/wiki

  const datatablesSimple = document.getElementById('datatablesSimple');
  if (datatablesSimple) {
    new simpleDatatables.DataTable(datatablesSimple);
  }

  $(document).ready(function () {
    $('#listarContratos').DataTable({
      "language": {
        "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
      },
      "columnDefs": [
        { "width": "40%", "targets": 0 },
        { "width": "30%", "targets": 1 },
        { "width": "30%", "targets": 2 }
      ]
    });
  });
});
