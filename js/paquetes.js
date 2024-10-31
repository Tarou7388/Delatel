import config from "../env.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener("DOMContentLoaded", async () => {
  const userid = user["idUsuario"];
  let idServicio = 0;
  const accesos = await Herramientas.permisos()

  const ruta = `${config.HOST}app/controllers/Paquete.controllers.php?operacion=listarPaquetes`;

  $(document).ready(function () {
    $("#tablaPaquetes").DataTable({
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
      },
      ajax: {
        url: ruta,
        type: "GET",
        dataSrc: function (json) {
          return json.filter((paquete) => paquete.inactive_at === null);
        },
      },
      columns: [
        { data: "id_paquete", visible: false },
        { data: "paquete", title: "Paquete", className: "text-center" },
        { data: "precio", title: "Precio", className: "text-center" },
        {
          data: "tipo_servicio",
          title: "Tipo de Servicio",
          className: "text-center",
        },
        {
          data: "duracion",
          title: "Duración",
          className: "text-center",
          render: function (data) {
            try {
              const duracionObj = JSON.parse(data);
              return Object.entries(duracionObj)
                .map(
                  ([key, value]) =>
                    `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value} meses`
                )
                .join(", ");
            } catch (e) {
              return data;
            }
          },
        },
        {
          data: null,
          title: "Acciones",
          className: "text-center",
          render: function (data, type, row) {
            return `
              <button class="btn btn-warning btn-edit" data-id="${row.id_paquete}"><i class="fa-regular fa-pen-to-square"></i></button>
              <button class="btn btn-danger btn-delete" data-id="${row.id_paquete}"><i class="fa-regular fa-trash-can"></i></button>
            `;
          },
        },
      ],
      order: [[0, "desc"]],
      paging: true,
      searching: true,
      info: true,
      lengthChange: false,
    });

    // Evento para el botón de eliminar
    $("#tablaPaquetes tbody").on("click", ".btn-delete", function () {
      const idPaquete = $(this).data("id");
      eliminarPaquete(idPaquete, userid);
    });

    // Evento para el botón de registrar
    $("#btnRegistrar").on("click", function () {
      registrarPaquete(userid);
    });

    // Evento para el botón de Actualizar
    $("#btnActualizar").on("click", function () {
      const idPaquete = $("#txtIdPaquete").val();
      actualizarPaquete(idPaquete);
    });

    // Cargar datos de servicios en los selectores
    cargarServicios();

    // Deshabilitar la caja de texto de duración 2
    $("#slcTipoServicioActualizar, #slcTipoServicio").on("change", function () {
      deshabilitarDuracion2(this.id);
    });

    deshabilitarDuracion2("slcTipoServicio");
    deshabilitarDuracion2("slcTipoServicioActualizar");

    // Validar números positivos en los campos de entrada
    $("#txtPrecio, #txtPrecioActualizar").on("input", function () {
      validarNumerosPositivos(this);
    });
  });

  // Escuchar el evento personalizado
  document.addEventListener("servicioActivado", (event) => {
    const { idServicio, userid } = event.detail;
    cargarServicios();
  });

  document.addEventListener("servicioDesactivado", (event) => {
    const { idServicio, userid } = event.detail;
    cargarServicios();
  });

  document.addEventListener("servicioAgregado", (event) => {
    const { idServicio, userid } = event.detail;
    cargarServicios();
  });

  document.addEventListener("servicioActualizado", (event) => {
    const { idServicio, userid } = event.detail;
    cargarServicios();
  });

  // Limpiar campos de texto
  function limpiarModal() {
    $("#txtPaquete").val("");
    $("#txtPrecio").val("");
    $("#txtPaqueteActualizar").val("");
    $("#txtPrecioActualizar").val("");
    $("#slcTipoServicio").val("").trigger("change");
    $("#slcTipoServicioActualizar").val("").trigger("change");

    deshabilitarDuracion2("slcTipoServicio");
    deshabilitarDuracion2("slcTipoServicioActualizar");
  }

  // Evento para abrir el modal de actualización
  $("#tablaPaquetes tbody").on("click", ".btn-edit", async function () {
    const idPaquete = $(this).data("id");

    try {
      const response = await fetch(
        `${config.HOST}app/controllers/Paquete.controllers.php?operacion=buscarPaqueteId&idPaquete=` +
        idPaquete
      );
      const paquete = await response.json();
      $("#txtIdPaquete").val(paquete[0].id_paquete);
      $("#txtPaqueteActualizar").val(paquete[0].paquete);
      $("#txtPrecioActualizar").val(paquete[0].precio);

      // Establecer los valores de los servicios en el selector
      const selectedServices = [
        paquete[0].id_servicio,
        paquete[0].id_servicio2,
        paquete[0].id_servicio3,
        paquete[0].id_servicio4,
      ].filter((id) => id !== null);
      $("#slcTipoServicioActualizar").val(selectedServices).trigger("change");

      idServicio = paquete[0].id_servicio;

      // Parsear y mostrar las duraciones
      const duracionObj = JSON.parse(paquete[0].duracion);
      actualizarCajasDeTexto("Actualizar");
      selectedServices.forEach((servicio, index) => {
        const nombreCortoServicio = $(`#slcTipoServicioActualizar option[value="${servicio}"]`).data("nombre-corto");
        $(`#txtDuracionServicioActualizar${index + 1}`).val(duracionObj[nombreCortoServicio] || "");
      });

      deshabilitarDuracion2("slcTipoServicioActualizar");

      $("#modalActualizarPaquete").modal("show");
    } catch (error) {
      console.error("Error en paquete:", error);
    }
  });

  // Función meses actualizada
  async function meses(contexto) {
    const selectedServices = $(`#slcTipoServicio${contexto === "actualizacion" ? "Actualizar" : ""}`).val() || [];
    let jsonMeses = {};

    selectedServices.forEach((servicio, index) => {
      const nombreCortoServicio = $(`#slcTipoServicio${contexto === "actualizacion" ? "Actualizar" : ""} option[value="${servicio}"]`).data("nombre-corto");
      const duracion = document.querySelector(`#txtDuracionServicio${contexto === "actualizacion" ? "Actualizar" : ""}${index + 1}`).value;
      if (duracion) {
        jsonMeses[nombreCortoServicio] = parseInt(duracion, 10);
      }
    });

    if (Object.keys(jsonMeses).length === 0) {
      return null;
    }

    return jsonMeses;
  }

  // Validar Campos
  async function validarCampos(contexto) {
    let paquete, precio, tipoServicio, duracionServicio;

    if (contexto === "registro") {
      paquete = document.querySelector("#txtPaquete");
      precio = document.querySelector("#txtPrecio");
      tipoServicio = document.querySelector("#slcTipoServicio");
      duracionServicio = document.querySelector("#txtDuracionServicio1");
    } else if (contexto === "actualizacion") {
      paquete = document.querySelector("#txtPaqueteActualizar");
      precio = document.querySelector("#txtPrecioActualizar");
      tipoServicio = document.querySelector("#slcTipoServicioActualizar");
      duracionServicio = document.querySelector("#txtDuracionServicioActualizar1");
    }

    if (
      !paquete || !paquete.value.trim() ||
      !precio || !precio.value.trim() ||
      !tipoServicio || !tipoServicio.value.trim() ||
      !duracionServicio || !duracionServicio.value.trim()
    ) {
      showToast("Todos los campos son obligatorios", "WARNING");
      return false;
    }

    if (parseFloat(duracionServicio.value) < 3) {
      showToast("La duración no puede ser menor a 3 meses.", "WARNING");
      return false;
    }

    return true;
  }

  // Función para Registrar
  async function registrarPaquete() {
    if (accesos?.paquetes?.crear) {
      if (!(await validarCampos("registro"))) {
        return;
      }

      const jsonMeses = await meses("registro");
      if (!jsonMeses) {
        showToast("Error al obtener la duración", "ERROR");
        return;
      }

      const paquete = document.querySelector("#txtPaquete").value;
      const precio = document.querySelector("#txtPrecio").value;
      const selectedServices = $("#slcTipoServicio").val() || [];

      if (!paquete || !precio) {
        console.error("Elementos de paquete o precio no encontrados");
        showToast("Error al obtener los datos del paquete o precio", "ERROR");
        return;
      }

      const datosEnviar = {
        operacion: "registrarPaquete",
        parametros: {
          idServicio: selectedServices[0] || null,
          idServicio2: selectedServices[1] || null,
          idServicio3: selectedServices[2] || null,
          idServicio4: selectedServices[3] || null,
          paquete: paquete,
          precio: precio,
          duracion: jsonMeses,
          idUsuario: userid,
        },
      };

      try {
        const respuesta = await fetch(`${config.HOST}app/controllers/Paquete.controllers.php`, {
          method: "POST",
          body: JSON.stringify(datosEnviar),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }

        const data = await respuesta.json();

        if (data.guardado) {
          showToast("El Paquete se ha guardado correctamente", "SUCCESS");
          $("#tablaPaquetes").DataTable().ajax.reload(null, false);
          $("#modalAgregarPaquete").modal("hide");
          limpiarModal();
        } else {
          showToast("Verifique que se haya hecho bien la operacion", "ERROR");
        }
      } catch (error) {
        console.error("Error:", error);
        showToast("No se pudo Agregar el paquete", "ERROR");
      }
    }
  }
  // Función Actualizar
  async function actualizarPaquete(idPaquete) {
    console.log(accesos)
    if (accesos?.paquetes?.actualizar) {
      if (!(await validarCampos("actualizacion"))) {
        return;
      }

      const jsonMeses = await meses("actualizacion");
      if (!jsonMeses) {
        showToast("Error al obtener la duración", "ERROR");
        return;
      }

      const paquete = document.querySelector("#txtPaqueteActualizar").value;
      const precio = document.querySelector("#txtPrecioActualizar").value;
      const selectedServices = $("#slcTipoServicioActualizar").val() || [];

      const datos = {
        operacion: "actualizarPaquete",
        parametros: {
          idPaquete: idPaquete,
          idServicio: selectedServices[0] || null,
          idServicio2: selectedServices[1] || null,
          idServicio3: selectedServices[2] || null,
          idServicio4: selectedServices[3] || null,
          paquete: paquete,
          precio: precio,
          duracion: jsonMeses,
          idUsuario: userid,
        },
      };

      try {
        const respuesta = await fetch(
          `${config.HOST}app/controllers/Paquete.controllers.php`,
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
          showToast("El Paquete se ha actualizado correctamente", "SUCCESS");
          $("#tablaPaquetes").DataTable().ajax.reload(null, false);
          $("#modalActualizarPaquete").modal("hide");
        } else {
          showToast("Verifique que se haya hecho bien la operación", "ERROR");
        }
      } catch (error) {
        console.error("Error:", error);
        showToast("No se pudo actualizar el paquete", "ERROR");
      }
    }
  }

  // Función eliminar
  async function eliminarPaquete(idPaquete, idUsuario) {
    if (accesos?.paquetes?.eliminar) {
      try {
        if (await ask("¿Desea Eliminar este Paquete?")) {
          const response = await fetch(
            `${config.HOST}app/controllers/Paquete.controllers.php`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                operacion: "eliminarPaquete",
                parametros: {
                  idPaquete: idPaquete,
                  idUsuario: idUsuario,
                },
              }),
            }
          );

          const data = await response.json();

          try {
            if (data.eliminado) {
              showToast("¡Paquete eliminado correctamente!", "SUCCESS");
              $("#tablaPaquetes").DataTable().ajax.reload(null, false);
            } else {
              showToast("No se pudo eliminar el paquete.", "ERROR");
            }
          } catch (jsonError) {
            console.error("Error al parsear JSON:", jsonError);
            console.error("Respuesta del servidor:", responseText);
            showToast("Ocurrió un error al eliminar el paquete.", "ERROR");
          }
        }
      } catch (error) {
        console.error("Error al eliminar el paquete:", error);
        showToast("Ocurrió un error al eliminar el paquete.", "ERROR");
      }
    }
  }

  async function cargarServicios() {
    try {
      const response = await fetch(
        `${config.HOST}app/controllers/Servicio.controllers.php?operacion=listarServicio`
      );
      const servicios = await response.json();

      const slcTipoServicio = $("#slcTipoServicio");
      const slcTipoServicioActualizar = $("#slcTipoServicioActualizar");
      const serviciosContainer = $("#serviciosContainer");

      slcTipoServicio.empty();
      slcTipoServicioActualizar.empty();
      serviciosContainer.empty();

      servicios
        .filter((servicio) => servicio.inactive_at === null)
        .forEach((servicio) => {
          const option = `<option value="${servicio.id_servicio}" data-nombre-corto="${servicio.tipo_servicio}">${servicio.tipo_servicio} (${servicio.servicio})</option>`;
          slcTipoServicio.append(option);
          slcTipoServicioActualizar.append(option);
        });

      slcTipoServicio.on("change", function () {
        idServicio = parseInt($(this).val(), 10);
        actualizarCajasDeTexto();
      });

      slcTipoServicioActualizar.on("change", function () {
        idServicio = parseInt($(this).val(), 10);
        actualizarCajasDeTexto("Actualizar");
      });
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    }
  }

  function actualizarCajasDeTexto(contexto = "") {
    const serviciosContainer = $(`#serviciosContainer${contexto}`);
    const selectedServices = $(`#slcTipoServicio${contexto}`).val() || [];

    serviciosContainer.empty();

    selectedServices.forEach((servicio, index) => {
      const nombreCortoServicio = $(`#slcTipoServicio${contexto} option[value="${servicio}"]`).data("nombre-corto");
      const inputHtml = `
        <div class="form-floating mb-2">
          <input type="number" class="form-control" id="txtDuracionServicio${contexto}${index + 1}" placeholder="Duración del Servicio ${nombreCortoServicio}" required>
          <label for="txtDuracionServicio${contexto}${index + 1}">Duración del Servicio ${nombreCortoServicio} (Meses)</label>
        </div>
      `;
      serviciosContainer.append(inputHtml);
    });
  }

  $(document).ready(function () {
    cargarServicios();

    $("#slcTipoServicioActualizar").on("change", function () {
      actualizarCajasDeTexto("Actualizar");
    });
  });

  $(document).ready(function () {
    cargarServicios();

    $("#slcTipoServicioActualizar").on("change", function () {
      actualizarCajasDeTexto("Actualizar");
    });
  });

  function deshabilitarDuracion2(selectorId) {
    const idServicio = $(`#${selectorId}`).val();
    const txtDuracion2 = selectorId.includes("Actualizar")
      ? $("#txtDuracion2Actualizar")
      : $("#txtDuracion2");

    if (idServicio === "3") {
      txtDuracion2.prop("disabled", false);
    } else {
      txtDuracion2.prop("disabled", true);
      txtDuracion2.val("");
    }
  }

  function validarNumerosPositivos(input) {
    const valor = parseFloat(input.value);
    if (valor < 0) {
      showToast("No se permiten números negativos.", "WARNING");
      input.value = "";
    }
  }

  $(document).ready(function () {
    $("#modalAgregarPaquete .js-example-basic-multiple").select2({
      dropdownParent: $("#modalAgregarPaquete"),
      placeholder: "Seleccione"
    });

    $("#modalActualizarPaquete .js-example-basic-multiple").select2({
      dropdownParent: $("#modalActualizarPaquete"),
      placeholder: "Seleccione"
    });
  });

  $(document).ready(function () {
    cargarServicios();

    $("#slcTipoServicioActualizar").on("change", function () {
      idServicio = parseInt($(this).val(), 10);
      actualizarCajasDeTexto("Actualizar");
    });
  });

});