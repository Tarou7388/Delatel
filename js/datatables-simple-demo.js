import config from '../env.js';
window.addEventListener('DOMContentLoaded', event => {
  // Simple-DataTables
  // https://github.com/fiduswriter/Simple-DataTables/wiki

  
  $(document).ready(function () {
    $('#listarUsuarios').DataTable({
      "language": {
        "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
      },
      "columnDefs": [
        { "width": "5%", "targets": 0 },
        { "width": "15%", "targets": 1 },
        { "width": "20%", "targets": 2 },
        { "width": "15%", "targets": 3 },
        { "width": "15%", "targets": 4 },
        { "width": "15%", "targets": 5 },
        { "width": "15%", "targets": 6 }
      ]
    });
  });

  $(document).ready(function () {
    $('#listarActividades').DataTable({
      "language": {
        "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
      },
      "columnDefs": [
        { "width": "5%", "targets": 0 },
        { "width": "35%", "targets": 1 },
        { "width": "20%", "targets": 2 },
        { "width": "15%", "targets": 3 },
        { "width": "15%", "targets": 4 },
        { "width": "15%", "targets": 5 },
      ]
    });
  });
  
});

