import config from '../env.js';

window.addEventListener("DOMContentLoaded", () => {
  let idRolActual = -1;
  const userid = user['idUsuario'];
  const rol = document.getElementById('nombreRol');
  const form = document.getElementById('frmRol');
  const tbody = document.querySelector("#mostrar");
  const tbodyModal = document.querySelector("#cardBodyTabla");

  btnActualizar.style.display = 'none';
  btnAgregar.disabled = false; 

  function actualizarBotones() {
    if (btnActualizar) {
      btnActualizar.style.display = 'inline-block';
    }
    if (btnAgregar) {
      btnAgregar.disabled = true;
    }
  }

  function evaluarCampo() {
    if (rol.value.trim() === "") {
      btnAgregar.disabled = false;
      btnActualizar.style.display = 'none';
    }
  }
  rol.addEventListener('input', evaluarCampo); 

  (async function () {
    try {
      const respuesta = await fetch('../../controllers/Roles.controllers.php?operacion=getAllRol');
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
        { width: "30px", targets: 1 },
        { width: "20px", targets: 2 },
        { width: "20px", targets: 3 },
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
      tdBoton.appendChild(boton);
      tr.appendChild(tdBoton);

      // Nueva Columna para el botón Actualizar
      const tdBotonActualizar = document.createElement("td");
      const botonActualizar = document.createElement("button");
      botonActualizar.setAttribute("class", "btnActualizar btn btn-warning");
      botonActualizar.setAttribute("data-idRol", element.id_rol);

      const iconoLapiz = document.createElement("i");
      iconoLapiz.setAttribute("class", "fa-regular fa-pen-to-square");
      iconoLapiz.style.pointerEvents = 'none';

      botonActualizar.appendChild(iconoLapiz);

      tdBotonActualizar.appendChild(botonActualizar);
      tr.appendChild(tdBotonActualizar);

      // Nueva columna para el botón de Inhabilitar
      const tdBotonInhabilitar = document.createElement("td");
      const botonInhabilitar = document.createElement("button");
      botonInhabilitar.setAttribute("class", "btnInhabilitar btn btn-danger");
      botonInhabilitar.setAttribute("data-idRol", element.id_rol);

      const iconodelete = document.createElement("i");
      iconodelete.setAttribute("class", "fa-regular fa-trash-can");
      iconodelete.style.pointerEvents = 'none';

      botonInhabilitar.appendChild(iconodelete);

      tdBotonInhabilitar.appendChild(botonInhabilitar);
      tr.appendChild(tdBotonInhabilitar);

      tbody.appendChild(tr);
    });
    permisosBoton(".btnPermisos");
    actualizarBoton(".btnActualizar");
    inhabilitarBoton(".btnInhabilitar")
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
    fetch('../../controllers/Roles.controllers.php', {
      method: 'POST',
      body: JSON.stringify({
        permisos: json,
        adicionales: datosAdicionales,
        iduser_create: userid
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
        location.reload();
      })
      .catch(error => {
        console.error('Error:', error);
        alert("No se pudo agregar el rol.");
      });
  }

  function actualizarBoton(clase) {
    const botones = document.querySelectorAll(clase);
    botones.forEach((boton) => {
      boton.addEventListener("click", (event) => {
        const idRol = parseInt(event.target.dataset.idrol);
        const fila = event.target.closest("tr");
        const nombreRol = fila.querySelector("td").textContent;
        document.getElementById('nombreRol').value = nombreRol;
        idRolActual = idRol;
        actualizarBotones();
      });
    });
  }

  async function actualizarRol() {
    const datosAdicionales = {
      operacion: 'updateRol'
    };
    fetch('../../controllers/Roles.controllers.php', {
      method: 'PUT',
      body: JSON.stringify({
        adicionales: datosAdicionales,
        id_rol: idRolActual,
        rol: rol.value,
        iduser_update: userid
      })
    })
      .then(respuesta => {
        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }
        return respuesta.json();
      })
      .then(data => {
        if(data.Actualizado){
          console.log("Rol Actualizado Correctamente");
          form.reset();
          location.reload();
        }else{
          console.log("No se pudo Actualizar el Rol")
        }

      })
      .catch(error => {
        console.error('Error:', error);
        alert("No se pudo actualizar el rol");
      });
  }

  function inhabilitarBoton(clase) {
    const botones = document.querySelectorAll(clase);
    botones.forEach((boton) => {
      boton.addEventListener("click", (event) => {
        const idRol = parseInt(event.target.dataset.idrol);
        idRolActual = idRol;
        if (confirm("¿Estás seguro de que deseas inhabilitar este rol?")) {
          inhabilitarRol(idRol, userid);
        }
      });
    });
  }

  async function inhabilitarRol() {
    const datosAdicionales = {
      operacion: 'inhabilitarRol'
    };
    fetch('../../controllers/Roles.controllers.php', {
      method: 'PUT',
      body: JSON.stringify({
        adicionales: datosAdicionales,
        id_rol: idRolActual,
        iduser_inactive: userid
      })
    })
    .then(respuesta => {
      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
      return respuesta.json();
    })
      .then(data => {
        if (data.Inhabilitado) {
          alert("Rol inhabilitado exitosamente.");
          form.reset();
          location.reload();
        } else {
          alert("Error al inhabilitar el rol.");
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert("No se pudo inhabilitar el rol.");
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
      leerCelda.innerHTML = `<input type="checkbox" class="leer form-check-input" id="${modulo}-leer" ${permisosModulo.leer ? 'checked' : ''}/>`;
      leerCelda.style.textAlign = 'center';

      const crearCelda = document.createElement('td');
      crearCelda.innerHTML = `<input type="checkbox" class="crear form-check-input" id="${modulo}-crear" ${permisosModulo.crear ? 'checked' : ''}/>`;
      crearCelda.style.textAlign = 'center';

      const actualizarCelda = document.createElement('td');
      actualizarCelda.innerHTML = `<input type="checkbox" class="actualizar form-check-input" id="${modulo}-actualizar" ${permisosModulo.actualizar ? 'checked' : ''}/>`;
      actualizarCelda.style.textAlign = 'center';

      const eliminarCelda = document.createElement('td');
      eliminarCelda.innerHTML = `<input type="checkbox" class="eliminar form-check-input" id="${modulo}-eliminar" ${permisosModulo.eliminar ? 'checked' : ''}/>`;
      eliminarCelda.style.textAlign = 'center';

      fila.appendChild(moduloCelda);
      fila.appendChild(leerCelda);
      fila.appendChild(crearCelda);
      fila.appendChild(actualizarCelda);
      fila.appendChild(eliminarCelda);
      tbodyModal.appendChild(fila);
    }
    verificarEstadoCheck()
  }

  function verificarEstadoCheck() {
    const checkboxesLeer = document.querySelectorAll('.leer');
    const checkboxesCrear = document.querySelectorAll('.crear');
    const checkboxesActualizar = document.querySelectorAll('.actualizar');
    const checkboxesEliminar = document.querySelectorAll('.eliminar');

    function todasActivas(checkboxes) {
      return Array.from(checkboxes).every(checkbox => checkbox.checked);
    }

    const leerActivas = todasActivas(checkboxesLeer);
    const crearActivas = todasActivas(checkboxesCrear);
    const actualizarActivas = todasActivas(checkboxesActualizar);
    const eliminarActivas = todasActivas(checkboxesEliminar);

    document.querySelector("#chkLeer").checked = leerActivas;
    document.querySelector("#chkCrear").checked = crearActivas;
    document.querySelector("#chkEliminar").checked = eliminarActivas;
    document.querySelector("#chkActualizar").checked = actualizarActivas;
  }

  async function actualizarPermisos() {
    const permisosActualizados = {};
    const checkboxes = tbodyModal.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
      const [modulo, permiso] = checkbox.id.split('-');
      if (!permisosActualizados[modulo]) {
        permisosActualizados[modulo] = {};
      }
      if (checkbox.checked == true) {
        permisosActualizados[modulo][permiso] = true;
      }
    });

    const datosAdicionales = {
      operacion: 'updatePermisos',
      idRol: idRolActual

    };

    fetch(`${config.HOST}controllers/Roles.controllers.php`, { 
      method: 'PUT',
      body: JSON.stringify({
        permisos: permisosActualizados,
        adicionales: datosAdicionales,
        iduser_update: userid
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

    if (idRolActual === -1) { 
      if (confirm("¿Estás seguro de que quieres registrar el rol?")) {
        registrarRoles();
      }
    } else { 
      if (confirm("¿Estás seguro de actualizar el rol?")) {
        actualizarRol();
      }
    }
  });

  document.querySelector("#chkLeer").addEventListener('change', (event) => {
    if (event.target.checked) {
      document.querySelectorAll('.leer').forEach(checkbox => checkbox.checked = true);
    } else {
      document.querySelectorAll('.leer').forEach(checkbox => checkbox.checked = false);
    }
  });

  document.querySelector("#chkCrear").addEventListener('change', (event) => {
    if (event.target.checked) {
      document.querySelectorAll('.crear').forEach(checkbox => checkbox.checked = true);
    } else {
      document.querySelectorAll('.crear').forEach(checkbox => checkbox.checked = false);
    }
  });

  document.querySelector("#chkActualizar").addEventListener('change', (event) => {
    if (event.target.checked) {
      document.querySelectorAll('.actualizar').forEach(checkbox => checkbox.checked = true);
    } else {
      document.querySelectorAll('.actualizar').forEach(checkbox => checkbox.checked = false);
    }
  });

  document.querySelector("#chkEliminar").addEventListener('change', (event) => {
    if (event.target.checked) {
      document.querySelectorAll('.eliminar').forEach(checkbox => checkbox.checked = true);
    } else {
      document.querySelectorAll('.eliminar').forEach(checkbox => checkbox.checked = false);
    }
  });

});


