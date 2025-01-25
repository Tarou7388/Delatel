import config from "../env.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener("DOMContentLoaded", async () => {
  const userid = await Herramientas.obtenerLogin();
  let servicioEnEdicion = null;

  const obtenerServicios = async () => {
    try {
      const respuesta = await fetch(
        `${config.HOST}app/controllers/Servicio.controllers.php?operacion=listarServicio`
      );
      const datos = await respuesta.json();
      renderServicios(datos);
    } catch (e) {
      console.error(e);
    }
  };

  (async function iniciarServicios() {
    await obtenerServicios();
  })();

  const listaServicios = document.getElementById("listaServicios");

  const renderServicios = (servicios) => {
    listaServicios.innerHTML = "";
    servicios.forEach((servicio, index) => {
      const tr = document.createElement("tr");

      if (servicio.inactive_at !== null) {
        tr.classList.add("disabled-service");
      }

      const tdNombre = document.createElement("td");
      tdNombre.textContent = servicio.servicio;
      tr.appendChild(tdNombre);

      const tdTipo = document.createElement("td");
      tdTipo.textContent = servicio.tipo_servicio;
      tr.appendChild(tdTipo);

      const tdAcciones = document.createElement("td");
      tdAcciones.className = "text-end";

      const btnGroup = document.createElement("div");
      btnGroup.className = "btn-group";

      if (servicio.inactive_at !== null) {
        const btnActivate = document.createElement("button");
        btnActivate.className = "btn btn-sm btn-success";
        btnActivate.innerHTML = '<i class="fa-solid fa-check"></i>';
        btnActivate.addEventListener("click", () => {
          activarServicio(servicio.id_servicio, userid);
        });
        btnGroup.appendChild(btnActivate);
      } else {
        const btnEdit = document.createElement("button");
        btnEdit.className = "btn btn-sm btn-warning";
        btnEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
        btnEdit.addEventListener("click", () => {
          editarServicio(servicio);
        });

        const btnDelete = document.createElement("button");
        btnDelete.className = "btn btn-sm btn-danger";
        btnDelete.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
        btnDelete.addEventListener("click", () => {
          eliminarServicio(servicio.id_servicio, userid);
        });

        btnGroup.appendChild(btnEdit);
        btnGroup.appendChild(btnDelete);
      }

      tdAcciones.appendChild(btnGroup);
      tr.appendChild(tdAcciones);

      listaServicios.appendChild(tr);
    });
  };

  const style = document.createElement("style");
  style.innerHTML = `
    .disabled-service td:nth-child(1),
    .disabled-service td:nth-child(2) {
      opacity: 0.5;
      text-decoration: line-through;
    }
  `;
  document.head.appendChild(style);

  async function registrarServicio(idServicio) {
    const servicio = document.querySelector("#txtNombreServicio");
    const tipoServicio = document.querySelector("#txtTipoServicio");

    if (servicio.value.trim() === "" || tipoServicio.value.trim() === "") {
      showToast("Los campos no pueden estar vacíos", "WARNING", 1500);
      return;
    }

    try {
      const respuesta = await fetch(
        `${config.HOST}app/controllers/Servicio.controllers.php`,
        {
          method: "POST",
          body: JSON.stringify({
            operacion: "registrarServicio",
            parametros: {
              tipo_servicio: tipoServicio.value,
              servicio: servicio.value,
              idUsuario: userid,
            },
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }

      const data = await respuesta.json();

      if (data.guardado) {
        showToast("El Servicio se ha guardado correctamente", "SUCCESS", 1500);
        obtenerServicios();
        const event = new CustomEvent("servicioAgregado", {
          detail: { idServicio, userid },
        });
        document.dispatchEvent(event);
        limpiarFormulario();
      } else {
        showToast("Verifique que se haya hecho bien la operacion", "ERROR", 1500);
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("No se pudo Agregar el servicio", "ERROR", 1500);
    }
  }

  async function eliminarServicio(idServicio, userid) {
    try {
      if (await ask("¿Desea Eliminar este Servicio?")) {
        const response = await fetch(
          `${config.HOST}app/controllers/Servicio.controllers.php`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              operacion: "eliminarServicio",
              parametros: {
                idServicio: idServicio,
                idUsuario: userid,
              },
            }),
          }
        );

        const data = await response.json();

        if (data.eliminado) {
          showToast("¡Servicio eliminado correctamente!", "SUCCESS", 1500);
          obtenerServicios();

          const event = new CustomEvent("servicioDesactivado", {
            detail: { idServicio, userid },
          });
          document.dispatchEvent(event);
        } else {
          showToast("No se pudo eliminar el servicio.", "ERROR", 1500);
        }
      }
    } catch (e) {
      console.error("Error al eliminar el servicio:", e);
      showToast("Ocurrió un error al eliminar el servicio.", "ERROR", 1500);
    }
  }

  function editarServicio(servicio) {
    const servicioInput = document.querySelector("#txtNombreServicio");
    const tipoServicioInput = document.querySelector("#txtTipoServicio");

    servicioInput.value = servicio.servicio;
    tipoServicioInput.value = servicio.tipo_servicio;
    servicioEnEdicion = servicio.id_servicio;

    const btnRegistrarServicio = document.getElementById(
      "btnRegistrarServicio"
    );
    btnRegistrarServicio.textContent = "Actualizar";
  }

  async function actualizarServicio(idServicio) {
    const servicioInput = document.querySelector("#txtNombreServicio");
    const tipoServicioInput = document.querySelector("#txtTipoServicio");

    if (
      servicioInput.value.trim() === "" ||
      tipoServicioInput.value.trim() === ""
    ) {
      showToast("Los campos no pueden estar vacíos", "ERROR", 1500);
      return;
    }

    const datos = {
      operacion: "actualizarServicio",
      parametros: {
        idServicio: servicioEnEdicion,
        servicio: servicioInput.value,
        tipo_servicio: tipoServicioInput.value,
        idUsuario: userid,
      },
    };

    try {
      const respuesta = await fetch(
        `${config.HOST}app/controllers/Servicio.controllers.php`,
        {
          method: "PUT",
          body: JSON.stringify(datos),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }

      const data = await respuesta.json();

      if (data.actualizado) {
        showToast("El Servicio se ha actualizado correctamente", "SUCCESS", 1500);
        obtenerServicios();
        const event = new CustomEvent("servicioActualizado", {
          detail: { idServicio, userid },
        });
        document.dispatchEvent(event);
        limpiarFormulario();
      } else {
        showToast("Verifique que se haya hecho bien la operacion", "ERROR", 1500);
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("No se pudo actualizar el servicio", "ERROR", 1500);
    }
  }

  function limpiarFormulario() {
    document.querySelector("#txtNombreServicio").value = "";
    document.querySelector("#txtTipoServicio").value = "";
    servicioEnEdicion = null;

    const btnRegistrarServicio = document.getElementById(
      "btnRegistrarServicio"
    );
    btnRegistrarServicio.textContent = "Registrar";
  }

  async function activarServicio(idServicio, userid) {
    try {
      if (await ask("¿Desea Activar este Servicio?")) {
        const response = await fetch(
          `${config.HOST}app/controllers/Servicio.controllers.php`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              operacion: "reactivarServicio",
              parametros: {
                idServicio: idServicio,
                idUsuario: userid,
              },
            }),
          }
        );

        const data = await response.json();

        if (data.activado) {
          showToast("¡Servicio activado correctamente!", "SUCCESS", 1500);
          obtenerServicios();

          const event = new CustomEvent("servicioActivado", {
            detail: { idServicio, userid },
          });
          document.dispatchEvent(event);
        } else {
          showToast("No se pudo activar el servicio.", "ERROR", 1500);
        }
      }
    } catch (e) {
      console.error("Error al activar el servicio:", e);
      showToast("Ocurrió un error al activar el servicio", "ERROR", 1500);
    }
  }

  document
    .getElementById("btnRegistrarServicio")
    .addEventListener("click", () => {
      if (servicioEnEdicion) {
        actualizarServicio();
      } else {
        registrarServicio();
      }
    });

  document
    .getElementById("modalServicio")
    .addEventListener("hidden.bs.modal", limpiarFormulario);

  $('#modalServicio').modal({
    backdrop: 'static',
    keyboard: false
  });

  obtenerServicios();
});
