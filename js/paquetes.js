import config from "../env.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener("DOMContentLoaded", async () => {
  let login = await Herramientas.obtenerLogin();
  const userid = login.idUsuario;
  let idServicio = 0;
  const accesos = await Herramientas.permisos();

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
          data: "tipos_servicio",
          title: "Tipo de Servicio",
          className: "text-center",
        },
        {
          data: "servicios",
          title: "Servicios",
          className: "text-center",
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

    $("#tablaPaquetes tbody").on("click", ".btn-delete", function () {
      const idPaquete = $(this).data("id");
      eliminarPaquete(idPaquete, userid);
    });

    $("#btnRegistrar").on("click", function () {
      registrarPaquete(userid);
    });

    $("#btnActualizar").on("click", function () {
      const idPaquete = $("#txtIdPaquete").val();
      actualizarPaquete(idPaquete);
    });

    cargarServicios();

    $("#txtPrecio, #txtPrecioActualizar").on("input", function () {
      validarNumerosPositivos(this);
    });
  });

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

  function limpiarModal() {
    $("#txtPaquete").val("");
    $("#txtPrecio").val("");
    $("#txtPaqueteActualizar").val("");
    $("#txtPrecioActualizar").val("");
    $("#slcTipoServicio").val("").trigger("change");
    $("#slcTipoServicioActualizar").val("").trigger("change");
    $("#serviciosContainer").empty();
  }

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

      const idServicioJson = JSON.parse(paquete[0].id_servicio);
      const selectedServices = idServicioJson.id_servicio;

      $("#slcTipoServicioActualizar").val(selectedServices).trigger("change");

      idServicio = selectedServices;

      setTimeout(() => {
        const velocidad = JSON.parse(paquete[0].velocidad);

        if (selectedServices.includes(3)) {
          $("#txtbajadaMaximaActualizar").val(velocidad.bajada.maxima);
          $("#txtbajadaMinimaActualizar").val(velocidad.bajada.minima_garantizada);
          $("#txtsubidaMaximaActualizar").val(velocidad.subida.maxima);
          $("#txtsubidaMinimaActualizar").val(velocidad.subida.minima_garantizada);
        } else if (selectedServices.includes(2)) {
          $("#txtbajadaActualizar").val(velocidad.bajada);
          $("#txtsubidaActualizar").val(velocidad.subida);
        }
      }, 500);

      $("#modalActualizarPaquete").modal("show");
    } catch (error) {
      console.error("Error en paquete:", error);
    }
  });

  async function validarCampos(contexto) {
    let paquete, precio, tipoServicio;

    if (contexto === "registro") {
      paquete = document.querySelector("#txtPaquete");
      precio = document.querySelector("#txtPrecio");
      tipoServicio = document.querySelector("#slcTipoServicio");
    } else if (contexto === "actualizacion") {
      paquete = document.querySelector("#txtPaqueteActualizar");
      precio = document.querySelector("#txtPrecioActualizar");
      tipoServicio = document.querySelector("#slcTipoServicioActualizar");
    }

    if (
      !paquete || !paquete.value.trim() ||
      !precio || !precio.value.trim() ||
      !tipoServicio || !tipoServicio.value.trim()
    ) {
      showToast("Todos los campos son obligatorios", "WARNING");
      return false;
    }

    return true;
  }

  async function registrarPaquete() {
    if (accesos?.paquetes?.crear) {
      if (!(await validarCampos("registro"))) {
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

      let velocidad = {};
      if (selectedServices.includes("3")) {
        velocidad = {
          bajada: {
            maxima: document.querySelector("#txtbajadaMaxima").value || 0,
            minima_garantizada: document.querySelector("#txtbajadaMinima").value || 0
          },
          subida: {
            maxima: document.querySelector("#txtsubidaMaxima").value || 0,
            minima_garantizada: document.querySelector("#txtsubidaMinima").value || 0
          }
        };
      } else if (selectedServices.includes("2")) {
        velocidad = {
          bajada: document.querySelector("#txtbajadaMaxima").value || 0,
          subida: document.querySelector("#txtsubidaMaxima").value || 0
        };
      }

      const datosEnviar = {
        operacion: "registrarPaquete",
        parametros: {
          idServicio: selectedServices.map(Number),
          paquete: paquete,
          precio: precio,
          velocidad: velocidad,
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

  async function actualizarPaquete(idPaquete) {
    if (accesos?.paquetes?.actualizar) {
      if (!(await validarCampos("actualizacion"))) {
        return;
      }

      const paquete = document.querySelector("#txtPaqueteActualizar").value;
      const precio = document.querySelector("#txtPrecioActualizar").value;
      const selectedServices = $("#slcTipoServicioActualizar").val() || [];

      let velocidad = {};
      if (selectedServices.includes("3")) {
        velocidad = {
          bajada: {
            maxima: document.querySelector("#txtbajadaMaximaActualizar").value || 0,
            minima_garantizada: document.querySelector("#txtbajadaMinimaActualizar").value || 0
          },
          subida: {
            maxima: document.querySelector("#txtsubidaMaximaActualizar").value || 0,
            minima_garantizada: document.querySelector("#txtsubidaMinimaActualizar").value || 0
          }
        };
            } else if (selectedServices.includes("2")) {
        velocidad = {
          bajada: document.querySelector("#txtbajadaActualizar").value || 0,
          subida: document.querySelector("#txtsubidaActualizar").value || 0
        };
      }

      const datos = {
        operacion: "actualizarPaquete",
        parametros: {
          idPaquete: idPaquete,
          idServicio: selectedServices.map(Number),
          paquete: paquete,
          precio: precio,
          velocidad: velocidad,
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

  function validarSoloNumeros(input) {
    input.value = input.value.replace(/[^0-9.]/g, '');
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
  
      const wispServiceId = "2";
  
      function handleServiceChange(selector) {
        const selectedServices = selector.val();
        const isWispSelected = selectedServices.includes(wispServiceId);
  
        selector.find("option").each(function () {
          const optionValue = $(this).val();
          if (isWispSelected) {
            if (optionValue !== wispServiceId) {
              $(this).prop("disabled", true);
            }
          } else {
            if (selectedServices.length > 0 && optionValue === wispServiceId) {
              $(this).prop("disabled", true);
            } else {
              $(this).prop("disabled", false);
            }
          }
        });
  
        selector.trigger("change.select2");
      }
  
      function calcularMinimaGarantizada() {
        const bajadaMaxima = parseFloat($("#txtbajadaMaxima").val()) || 0;
        const subidaMaxima = parseFloat($("#txtsubidaMaxima").val()) || 0;
        const bajadaMaximaActualizar = parseFloat($("#txtbajadaMaximaActualizar").val()) || 0;
        const subidaMaximaActualizar = parseFloat($("#txtsubidaMaximaActualizar").val()) || 0;
        const porcentajeGarantizado = 0.70; // 70%
  
        $("#txtbajadaMinima").val(Math.round(bajadaMaxima * porcentajeGarantizado));
        $("#txtsubidaMinima").val(Math.round(subidaMaxima * porcentajeGarantizado));
        $("#txtbajadaMinimaActualizar").val(Math.round(bajadaMaximaActualizar * porcentajeGarantizado));
        $("#txtsubidaMinimaActualizar").val(Math.round(subidaMaximaActualizar * porcentajeGarantizado));
      }
  
      slcTipoServicio.on("change", function () {
        handleServiceChange($(this));
        const selectedServices = $(this).val();
        serviciosContainer.empty();
  
        if (selectedServices.includes("3")) {
          const labels = [
            { id: "bajadaMaxima", label: "Bajada Máxima", placeholder: "Bajada Máxima" },
            { id: "bajadaMinima", label: "Bajada Mínima Garantizada", placeholder: "Bajada Mínima Garantizada" },
            { id: "subidaMaxima", label: "Subida Máxima", placeholder: "Subida Máxima" },
            { id: "subidaMinima", label: "Subida Mínima Garantizada", placeholder: "Subida Mínima Garantizada" }
          ];
          let row = $('<div class="row g-2"></div>');
          labels.forEach((item, index) => {
            row.append(`
              <div class="col-md-6">
                <div class="form-floating mb-2">
                  <input type="text" class="form-control" id="txt${item.id}" placeholder="${item.placeholder}" required ${item.id.includes("Minima") ? 'disabled' : ''}>
                  <label for="txt${item.id}">${item.label}</label>
                </div>
              </div>
            `);
            if (index % 2 === 1) {
              serviciosContainer.append(row);
              row = $('<div class="row g-2"></div>');
            }
          });
          if (labels.length % 2 !== 0) {
            serviciosContainer.append(row);
          }
  
          $("#txtbajadaMaxima, #txtsubidaMaxima").on("input", function() {
            validarSoloNumeros(this);
            calcularMinimaGarantizada();
          });
        } else if (selectedServices.includes("2")) {
          const labels = [
            { id: "bajadaMaxima", label: "Bajada", placeholder: "Bajada" },
            { id: "subidaMaxima", label: "Subida", placeholder: "Subida" }
          ];
          let row = $('<div class="row g-2"></div>');
          labels.forEach((item, index) => {
            row.append(`
              <div class="col-md-6">
                <div class="form-floating mb-2">
                  <input type="text" class="form-control" id="txt${item.id}" placeholder="${item.placeholder}" required>
                  <label for="txt${item.id}">${item.label}</label>
                </div>
              </div>
            `);
            if (index % 2 === 1) {
              serviciosContainer.append(row);
              row = $('<div class="row g-2"></div>');
            }
          });
          if (labels.length % 2 !== 0) {
            serviciosContainer.append(row);
          }
  
          $("#txtbajadaMaxima, #txtsubidaMaxima").on("input", function() {
            validarSoloNumeros(this);
          });
        }
      });
  
      slcTipoServicioActualizar.on("change", function () {
        handleServiceChange($(this));
        const selectedServices = $(this).val();
        const serviciosContainerActualizar = $("#serviciosContainerActualizar");
        serviciosContainerActualizar.empty();
  
        if (selectedServices.includes("3")) {
          const labels = [
            { id: "bajadaMaximaActualizar", label: "Bajada Máxima", placeholder: "Bajada Máxima" },
            { id: "bajadaMinimaActualizar", label: "Bajada Mínima Garantizada", placeholder: "Bajada Mínima Garantizada" },
            { id: "subidaMaximaActualizar", label: "Subida Máxima", placeholder: "Subida Máxima" },
            { id: "subidaMinimaActualizar", label: "Subida Mínima Garantizada", placeholder: "Subida Mínima Garantizada" }
          ];
          let row = $('<div class="row g-2"></div>');
          labels.forEach((item, index) => {
            row.append(`
              <div class="col-md-6">
                <div class="form-floating mb-2">
                  <input type="text" class="form-control" id="txt${item.id}" placeholder="${item.placeholder}" required ${item.id.includes("Minima") ? 'disabled' : ''}>
                  <label for="txt${item.id}">${item.label}</label>
                </div>
              </div>
            `);
            if (index % 2 === 1) {
              serviciosContainerActualizar.append(row);
              row = $('<div class="row g-2"></div>');
            }
          });
          if (labels.length % 2 !== 0) {
            serviciosContainerActualizar.append(row);
          }
  
          $("#txtbajadaMaximaActualizar, #txtsubidaMaximaActualizar").on("input", function() {
            validarSoloNumeros(this);
            calcularMinimaGarantizada();
          });
        } else if (selectedServices.includes("2")) {
          const labels = [
            { id: "bajadaActualizar", label: "Bajada Máxima", placeholder: "Bajada Máxima" },
            { id: "subidaActualizar", label: "Subida Máxima", placeholder: "Subida Máxima" }
          ];
          let row = $('<div class="row g-2"></div>');
          labels.forEach((item, index) => {
            row.append(`
              <div class="col-md-6">
                <div class="form-floating mb-2">
                  <input type="text" class="form-control" id="txt${item.id}" placeholder="${item.placeholder}" required>
                  <label for="txt${item.id}">${item.label}</label>
                </div>
              </div>
            `);
            if (index % 2 === 1) {
              serviciosContainerActualizar.append(row);
              row = $('<div class="row g-2"></div>');
            }
          });
          if (labels.length % 2 !== 0) {
            serviciosContainerActualizar.append(row);
          }
  
          $("#txtbajadaActualizar, #txtsubidaActualizar").on("input", function() {
            validarSoloNumeros(this);
          });
        }
      });
    } catch (error) {
      console.error("Error al cargar servicios:", error);
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
    });
  });

  $(document).ready(function () {
    $('#modalAgregarPaquete').modal({
      backdrop: 'static',
      keyboard: false
    });

    $('#modalActualizarPaquete').modal({
      backdrop: 'static',
      keyboard: false
    });

    $('#slcTipoServicio').select2({
      theme: 'bootstrap-5',
      placeholder: 'Seleccione',
      width: '100%'
    }).next('.select2-container').css({
      'font-size': '1.2em',
      'min-height': '40px'
    });

    $('#slcTipoServicioActualizar').select2({
      theme: 'bootstrap-5',
      placeholder: 'Seleccione',
      width: '100%'
    }).next('.select2-container').css({
      'font-size': '1.2em',
      'min-height': '40px'
    });
  });

  $('#btnCancelarRegistrar').on('click', function () {
    limpiarModal();
  });
});