window.addEventListener("DOMContentLoaded", () => {
  
  const rol = document.getElementById('nombreRol');
  const form = document.getElementById('frmRol');
  const tbody = document.querySelector("#mostrar");

  (async function () {
    try {
      const respuesta = await fetch('../controllers/Roles.controllers.php?operacion=getAllRol');
      const datos = await respuesta.json();
      listarRol(datos);
      tabla();
    }
    catch (e) {
      console.error(e)
    }
  })();

  async function tabla() {
    $(tablaRol).DataTable({
      paging: true,
      searching: true,
      ordering: false,
      columnDefs: [
        { width: "30px", targets: 0 },
        { width: "70px", targets: 1 }
      ],
      autoWidth: false,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
      }
    });
  }

  async function listarRol(datos){
    datos.forEach(element => {
      const tr = document.createElement("tr");
      const thid = document.createElement("td");
      thid.textContent = element.rol;
      tr.appendChild(thid);
      tbody.appendChild(tr);

      const tdBoton = document.createElement("td");
      const boton = document.createElement("button");
      boton.setAttribute("class", "btnPermisos btn btn-primary")
      boton.textContent = "Permisos";

      tr.appendChild(tdBoton)
      tdBoton.appendChild(boton);
      tbody.appendChild(tr);
    });
  }

  form.addEventListener('submit', function (event) {
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
});