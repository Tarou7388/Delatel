import config from "../env.js";

window.addEventListener("DOMContentLoaded", () => {
  let idRolActual = -1;
  const userid = user["idUsuario"];
  const rol = document.getElementById("txtRol");
  const form = document.getElementById("frmRol");
  const tbody = document.querySelector("#mostrar");
  const tbodyModal = document.querySelector("#cardBodyTabla");

  btnActualizar.style.display = "none";
  btnAgregar.disabled = false;

  function actualizarBotones() {
    if (btnActualizar) {
      btnActualizar.style.display = "inline-block";
    }
    if (btnAgregar) {
      btnAgregar.disabled = true;
    }
  }

  function evaluarCampo() {
    if (rol.value.trim() === "") {
      btnAgregar.disabled = false;
      btnActualizar.style.display = "none";
    } else {
      btnAgregar.disabled = true;
      btnActualizar.style.display = "inline-block";
    }
  }
  rol.addEventListener("input", evaluarCampo);

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

  const obtenerRoles = async () => {
    try {
      const respuesta = await fetch(
        `${config.HOST}app/controllers/Roles.controllers.php?operacion=getAllRol`
      );
      const datos = await respuesta.json();
      listarRol(datos); // Función que procesa y muestra los roles
      tabla(); // Función que inicializa la tabla
    } catch (e) {
      console.error(e);
    }
  };

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
        url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json",
      },
    });
  }

  async function listarRol(datos) {
    datos.forEach((element) => {
      const tr = document.createElement("tr");
      const thid = document.createElement("td");
      thid.textContent = element.rol;
      tr.appendChild(thid);

      tbody.appendChild(tr);
      const tdBoton = document.createElement("td");
      const boton = document.createElement("button");
      boton.setAttribute("class", "btnPermisos btn btn-primary");
      boton.setAttribute("data-bs-toggle", "modal");
      boton.setAttribute("data-idRol", element.id_rol);
      boton.setAttribute("data-bs-target", "#mdlPermisos");
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
      iconoLapiz.style.pointerEvents = "none";

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
      iconodelete.style.pointerEvents = "none";

      botonInhabilitar.appendChild(iconodelete);

      tdBotonInhabilitar.appendChild(botonInhabilitar);
      tr.appendChild(tdBotonInhabilitar);

      tbody.appendChild(tr);
    });
    permisosBoton(".btnPermisos");
    actualizarBoton(".btnActualizar");
    inhabilitarBoton(".btnInhabilitar");
  }

  async function obtenerJsonPermisos() {
    const respuesta = await fetch(`${config.HOST}Json/permisos.json`);
    const datos = await respuesta.json();
    return datos;
  }

  async function registrarRoles() {
    const json = await obtenerJsonPermisos();
    const datosAdicionales = {
      operacion: "registrarRoles",
      rol: rol.value,
    };
    fetch(`${config.HOST}app/controllers/Roles.controllers.php`, {
      method: "POST",
      body: JSON.stringify({
        permisos: json,
        adicionales: datosAdicionales,
        iduser_create: userid,
      }),
    })
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }
        return respuesta.json();
      })
      .then((data) => {
        showToast("El rol se ha agregado exitosamente", "SUCCESS");
        form.reset();

        setTimeout(function () {
          location.reload();
        }, 1500);
      })
      .catch((error) => {
        console.error("Error:", error);
        showToast("No se pudo agregar el rol", "ERROR");
      });
  }

  function actualizarBoton(clase) {
    const botones = document.querySelectorAll(clase);
    botones.forEach((boton) => {
      boton.addEventListener("click", (event) => {
        const idRol = parseInt(event.target.dataset.idrol);
        const fila = event.target.closest("tr");
        const Rol = fila.querySelector("td").textContent;
        document.getElementById("txtRol").value = Rol;
        idRolActual = idRol;
        actualizarBotones();
      });
    });
  }

  async function actualizarRol() {
    const datosAdicionales = {
      operacion: "actualizarRol",
    };
    fetch("../../app/controllers/Roles.controllers.php", {
      method: "PUT",
      body: JSON.stringify({
        adicionales: datosAdicionales,
        rol: rol.value,
        iduser_update: userid,
        id_rol: idRolActual
      }),
    })
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }
        return respuesta.json();
      })
      .then((data) => {
        if (data.Actualizado) {
          showToast("El rol se ha actualizado exitosamente", "SUCCESS");
          form.reset();

          setTimeout(function () {
            location.reload();
          }, 1500);
        } else {
          console.log("No se pudo Actualizar el Rol");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showToast("No se pudo actualizar el rol", "ERROR");
      });
  }

  function inhabilitarBoton(clase) {
    const botones = document.querySelectorAll(clase);
    botones.forEach((boton) => {
      boton.addEventListener("click", (event) => {
        const idRol = parseInt(event.target.dataset.idrol);
        idRolActual = idRol;

        if (idRol == userid) {
          showToast("No puedes inhabilitar tu propio rol", "ERROR");
          return;
        }

        if (ask("¿Estás seguro de que deseas inhabilitar este rol?")) {
          inhabilitarRol(idRol, userid);
        }
      });
    });
  }

  async function inhabilitarRol() {
    const datosAdicionales = {
      operacion: "eliminarRol",
    };
    fetch("../../app/controllers/Roles.controllers.php", {
      method: "PUT",
      body: JSON.stringify({
        adicionales: datosAdicionales,
        id_rol: idRolActual,
        iduser_inactive: userid
      }),
    })
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }
        return respuesta.json();
      })
      .then((data) => {
        if (data.Inhabilitado) {
          showToast("El rol se ha eliminado exitosamente", "SUCCESS");
          form.reset();

          setTimeout(function () {
            location.reload();
          }, 1500);
        } else {
          showToast("Error al inhabilitar el rol", "ERROR");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showToast("No se pudo inhabilitar el rol", "ERROR");
      });
  }

  async function rolesPermisos(idRol) {
    const resultado = await fetch(
      `${config.HOST}app/controllers/Roles.controllers.php?operacion=listarPermisosIdRol&idRol=${idRol}`
    );
    const datos = await resultado.json();
    return datos;
  }

  async function tablaModal(idRol) {
    const datos = await rolesPermisos(idRol);
    tbodyModal.innerHTML = "";
    const datosRol = datos[0].permisos;

    for (const [modulo, permisosModulo] of Object.entries(datosRol)) {
      const fila = document.createElement("tr");

      const moduloCelda = document.createElement("td");
      moduloCelda.textContent = modulo;

      const leerCelda = document.createElement("td");
      leerCelda.innerHTML = `<input type="checkbox" class="leer form-check-input" id="${modulo}-leer" ${
        permisosModulo.leer ? "checked" : ""
      }/>`;
      leerCelda.style.textAlign = "center";

      const crearCelda = document.createElement("td");
      crearCelda.innerHTML = `<input type="checkbox" class="crear form-check-input" id="${modulo}-crear" ${
        permisosModulo.crear ? "checked" : ""
      }/>`;
      crearCelda.style.textAlign = "center";

      const actualizarCelda = document.createElement("td");
      actualizarCelda.innerHTML = `<input type="checkbox" class="actualizar form-check-input" id="${modulo}-actualizar" ${
        permisosModulo.actualizar ? "checked" : ""
      }/>`;
      actualizarCelda.style.textAlign = "center";

      const eliminarCelda = document.createElement("td");
      eliminarCelda.innerHTML = `<input type="checkbox" class="eliminar form-check-input" id="${modulo}-eliminar" ${
        permisosModulo.eliminar ? "checked" : ""
      }/>`;
      eliminarCelda.style.textAlign = "center";

      fila.appendChild(moduloCelda);
      fila.appendChild(leerCelda);
      fila.appendChild(crearCelda);
      fila.appendChild(actualizarCelda);
      fila.appendChild(eliminarCelda);
      tbodyModal.appendChild(fila);
    }
    verificarEstadoCheck();
  }

  function verificarEstadoCheck() {
    const checkboxesLeer = document.querySelectorAll(".leer");
    const checkboxesCrear = document.querySelectorAll(".crear");
    const checkboxesActualizar = document.querySelectorAll(".actualizar");
    const checkboxesEliminar = document.querySelectorAll(".eliminar");

    // Habilitar o deshabilitar checkboxes de crear, actualizar y eliminar
    checkboxesLeer.forEach((checkboxLeer, index) => {
      checkboxLeer.addEventListener("change", () => {
        const isChecked = checkboxLeer.checked;
        if (isChecked) {
          checkboxesCrear[index].disabled = false;
          checkboxesActualizar[index].disabled = false;
          checkboxesEliminar[index].disabled = false;
        } else {
          checkboxesCrear[index].disabled = true;
          checkboxesActualizar[index].disabled = true;
          checkboxesEliminar[index].disabled = true;
          checkboxesCrear[index].checked = false;
          checkboxesActualizar[index].checked = false;
          checkboxesEliminar[index].checked = false;
        }
      });

      const isChecked = checkboxLeer.checked;
      checkboxesCrear[index].disabled = !isChecked;
      checkboxesActualizar[index].disabled = !isChecked;
      checkboxesEliminar[index].disabled = !isChecked;
    });

    function todasActivas(checkboxes) {
      return Array.from(checkboxes).every((checkbox) => checkbox.checked);
    }

    const leerActivas = todasActivas(checkboxesLeer);
    const crearActivas = todasActivas(checkboxesCrear);
    const actualizarActivas = todasActivas(checkboxesActualizar);
    const eliminarActivas = todasActivas(checkboxesEliminar);

    document.querySelector("#chkLeer").checked = leerActivas;
    document.querySelector("#chkCrear").checked = crearActivas;
    document.querySelector("#chkEliminar").checked = eliminarActivas;
    document.querySelector("#chkActualizar").checked = actualizarActivas;

    document.querySelector("#chkCrear").disabled = !leerActivas;
    document.querySelector("#chkActualizar").disabled = !leerActivas;
    document.querySelector("#chkEliminar").disabled = !leerActivas;
  }

  async function actualizarPermisos() {
    const permisosActualizados = {};
    const checkboxes = tbodyModal.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
      const [modulo, permiso] = checkbox.id.split("-");
      if (!permisosActualizados[modulo]) {
        permisosActualizados[modulo] = {};
      }
      if (checkbox.checked == true) {
        permisosActualizados[modulo][permiso] = true;
      }
    });

    const datosAdicionales = {
      operacion: "actualizarPermisos",
      idRol: idRolActual,
    };

    fetch(`${config.HOST}app/controllers/Roles.controllers.php`, {
      method: "PUT",
      body: JSON.stringify({
        permisos: permisosActualizados,
        adicionales: datosAdicionales,
        iduser_update: userid,
      }),
    })
      .then((respuesta) => respuesta.json())
      .then(datos => {
        showToast("Permisos actualizados correctamente.", "SUCCESS");
      });
  }

  (async function iniciarAplicacionRoles() {
    await obtenerRoles();
  })();

  document
    .querySelector("#btnCambiosPermisos")
    .addEventListener("click", () => {
      actualizarPermisos();
    });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (idRolActual === -1) {
      if (ask("¿Estás seguro de que quieres registrar el rol?")) {
        registrarRoles();
      }
    } else {
      if (ask("¿Estás seguro de actualizar el rol?")) {
        actualizarRol();
      }
    }
  });

  document.querySelector("#chkLeer").addEventListener("change", (event) => {
    const crearCheckboxes = document.querySelectorAll(".crear");
    const actualizarCheckboxes = document.querySelectorAll(".actualizar");
    const eliminarCheckboxes = document.querySelectorAll(".eliminar");

    if (event.target.checked) {
      document
        .querySelectorAll(".leer")
        .forEach((checkbox) => (checkbox.checked = true));
      crearCheckboxes.forEach((checkbox) => (checkbox.disabled = false));
      actualizarCheckboxes.forEach((checkbox) => (checkbox.disabled = false));
      eliminarCheckboxes.forEach((checkbox) => (checkbox.disabled = false));
    } else {
      document
        .querySelectorAll(".leer")
        .forEach((checkbox) => (checkbox.checked = false));
      crearCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
        checkbox.disabled = true;
      });
      actualizarCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
        checkbox.disabled = true;
      });
      eliminarCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
        checkbox.disabled = true;
      });
    }
    verificarEstadoCheck();
  });

  document.querySelector("#chkCrear").addEventListener("change", (event) => {
    if (event.target.checked) {
      document
        .querySelectorAll(".crear")
        .forEach((checkbox) => (checkbox.checked = true));
    } else {
      document
        .querySelectorAll(".crear")
        .forEach((checkbox) => (checkbox.checked = false));
    }
    verificarEstadoCheck();
  });

  document
    .querySelector("#chkActualizar")
    .addEventListener("change", (event) => {
      if (event.target.checked) {
        document
          .querySelectorAll(".actualizar")
          .forEach((checkbox) => (checkbox.checked = true));
      } else {
        document
          .querySelectorAll(".actualizar")
          .forEach((checkbox) => (checkbox.checked = false));
      }
      verificarEstadoCheck();
    });

  document.querySelector("#chkEliminar").addEventListener("change", (event) => {
    if (event.target.checked) {
      document
        .querySelectorAll(".eliminar")
        .forEach((checkbox) => (checkbox.checked = true));
    } else {
      document
        .querySelectorAll(".eliminar")
        .forEach((checkbox) => (checkbox.checked = false));
    }
    verificarEstadoCheck();
  });
});
