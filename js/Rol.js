document.addEventListener("DOMContentLoaded", () => {
  // DataTable
  $(document).ready(function() {
    $('#myTable').DataTable({
      language: {
        "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
      },
      paging: true,
      searching: true,
      info: false
    });
  });

  //Registrar Rol

  const rol = document.getElementById('nombreRol');
  const form = document.getElementById('frmRol');

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const isConfirmed = confirm("¿Estás seguro de que quieres registrar el rol?");
    if (!isConfirmed) {
      return; 
    }
    const formData = new FormData();
    formData.append('operacion', 'add'); 
    formData.append('rol', rol.value); 

    fetch('../controllers/Roles.controllers.php', {
      method: 'POST',
      body: formData
    })
    .then(respuesta => {
      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
      return respuesta.json();
    })
    .then(data => {
        alert("Rol agregado exitosamente.");
        form.reset(); 
    })
    .catch(error => {
      console.error('Error:', error);
      alert("No se pudo agregar el rol.");
    });
  });
  //Fin registrar rol

  
});
