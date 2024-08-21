document.addEventListener("DOMContentLoaded", () =>{
  // data table
  $(document).ready(function() {
    $('#myTable').DataTable({
      "paging": false,
      "searching": false,
      "info": false,
      "lengthChange": false
    });
  });
  var rol = document.getElementById("nombreRol");
});