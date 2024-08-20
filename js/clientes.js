window.addEventListener("DOMContentLoaded", event => {
  $(document).ready(function () {
    $('#listarCliente').DataTable({
      "language": {
        "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
      },
      "columnDefs": [
        { "width": "5%", "targets": 0 },
        { "width": "30%", "targets": 1 },  
        { "width": "10%", "targets": 2 },  
        { "width": "15%", "targets": 3 },
        { "width": "10%", "targets": 4 }, 
        { "width": "15%", "targets": 5 }, 
        { "width": "10%", "targets": 6 }, 
        { "width": "15%", "targets": 7 }
      ],
      "autoWidth": false  
    });
  });
  document.getElementById('saveChanges').addEventListener('click', function () {
    // Lógica para guardar cambios
    alert('Cambios guardados');
    // Puedes cerrar el modal manualmente si lo deseas
    var myModal = new bootstrap.Modal(document.getElementById('updateModal'));
    myModal.hide();
  });
});
