import config from '../env.js';

window.addEventListener("DOMContentLoaded", () => {
  let idRolActual = -1; 
  const rol = document.getElementById('nombreRol');
  const form = document.getElementById('frmRol');
  const tbody = document.querySelector("#mostrar");
  const tbodyModal = document.querySelector("#cardBodyTabla");

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
        url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
      }
    });
  }

  async function listarRol(datos) {
    datos.forEach(element => {
      const tr = document.createElement("tr");
      const thid = document.createElement("td");
      thid.textContent = element.rol;
      tr.appendChild(thid);
      tbody.appendChild(tr);
      const tdBoton = document.createElement("td");
      const boton = document.createElement("button");
      boton.setAttribute("class", "btnPermisos btn btn-primary")
      boton.setAttribute("data-bs-toggle", "modal")
      boton.setAttribute("data-idRol", element.id_rol)
      boton.setAttribute("data-bs-target", "#mdlPermisos")
      boton.textContent = "Permisos";

      tr.appendChild(tdBoton)
      tdBoton.appendChild(boton);
      tbody.appendChild(tr);
    });
    permisosBoton(".btnPermisos")
  }

  async function obtenerJsonPermisos() {
    const respuesta = await fetch(`${config.HOST}Json/permisos.json`)
    const datos = await respuesta.json();
    return datos;
  }

  async function registrarRoles() {
    const json = await obtenerJsonPermisos();
    const datosAdicionales = {
      operacion: 'add',
      rol: rol.value
    };
    fetch('../controllers/Roles.controllers.php', {
      method: 'POST',
      body: JSON.stringify({
        permisos: json,
        adicionales: datosAdicionales
      })
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
  }

  async function rolesPermisos(idRol) {
    const resultado = await fetch(`${config.HOST}controllers/Roles.controllers.php?operacion=getRolPermisos&idRol=${idRol}`)
    const datos = await resultado.json();
    return datos;
  }

  async function tablaModal(idRol) {
    const datos = await rolesPermisos(idRol);
    tbodyModal.innerHTML = '';
    const datosRol = datos[0].permisos;

    for (const [modulo, permisosModulo] of Object.entries(datosRol)) {
      const fila = document.createElement('tr');

      const moduloCelda = document.createElement('td');
      moduloCelda.textContent = modulo;

      const leerCelda = document.createElement('td');
      leerCelda.innerHTML = `<input type="checkbox" id="${modulo}-leer" ${permisosModulo.leer ? 'checked' : ''}/>`;
      leerCelda.style.textAlign = 'center';

      const crearCelda = document.createElement('td');
      crearCelda.innerHTML = `<input type="checkbox" id="${modulo}-crear" ${permisosModulo.crear ? 'checked' : ''}/>`;
      crearCelda.style.textAlign = 'center';

      const actualizarCelda = document.createElement('td');
      actualizarCelda.innerHTML = `<input type="checkbox" id="${modulo}-actualizar" ${permisosModulo.actualizar ? 'checked' : ''}/>`;
      actualizarCelda.style.textAlign = 'center';

      const eliminarCelda = document.createElement('td');
      eliminarCelda.innerHTML = `<input type="checkbox" id="${modulo}-eliminar" ${permisosModulo.eliminar ? 'checked' : ''}/>`;
      eliminarCelda.style.textAlign = 'center';

      fila.appendChild(moduloCelda);
      fila.appendChild(leerCelda);
      fila.appendChild(crearCelda);
      fila.appendChild(actualizarCelda);
      fila.appendChild(eliminarCelda);
      tbodyModal.appendChild(fila);
    }
  }

  async function actualizarPermisos() {
    const permisosActualizados = {};
    const checkboxes = tbodyModal.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
      const [modulo, permiso] = checkbox.id.split('-');
      if (!permisosActualizados[modulo]) {
        permisosActualizados[modulo] = {};
      }
      permisosActualizados[modulo][permiso] = checkbox.checked ? 1 : 0;
    });

    const datosAdicionales = {
      operacion: 'updatePermisos',
      idRol: idRolActual
    };

    fetch(`${config.HOST}controllers/Roles.controllers.php`, { // Ajusta la ruta a tu script PHP
      method: 'PUT',
      body: JSON.stringify({
        permisos: permisosActualizados,
        adicionales: datosAdicionales
      })
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
      alert("Rol actualizado exitosamente.");
    })
  }

  document.querySelector("#btnCambiosPermisos").addEventListener('click', () => {
    actualizarPermisos();
  })

  function permisosBoton(clase) {
    const botones = document.querySelectorAll(clase);
    botones.forEach((boton) => {
      boton.addEventListener("click", async (event) => {
        const idRol = Number(event.target.dataset.idrol);
        tablaModal(idRol);
        idRolActual = idRol;
      });
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (confirm("¿Estás seguro de que quieres registrar el rol?")) {
      registrarRoles()
    }
  });


});