import config from "../env.js";

document.addEventListener("DOMContentLoaded", () => {
  const userid = user["idUsuario"];

  let idServicio = 0;

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
                    `${
                      key.charAt(0).toUpperCase() + key.slice(1)
                    }: ${value} meses`
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
    $(
      "#txtPrecio, #txtDuracion1, #txtDuracion2, #txtPrecioActualizar, #txtDuracion1Actualizar, #txtDuracion2Actualizar"
    ).on("input", function () {
      validarNumerosPositivos(this);
    });
  });

  // Limpiar campos de texto
  function limpiarModal() {
    $("#txtPaquete").val("");
    $("#txtPrecio").val("");
    $("#txtDuracion1").val("");
    $("#txtDuracion2").val("");
    $("#txtPaqueteActualizar").val("");
    $("#txtPrecioActualizar").val("");
    $("#txtDuracion1Actualizar").val("");
    $("#txtDuracion2Actualizar").val("");
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
      $("#slcTipoServicioActualizar").val(paquete[0].id_servicio);
      idServicio = paquete[0].id_servicio;
      const duracionObj = JSON.parse(paquete[0].duracion);
      if (paquete[0].id_servicio === 3) {
        $("#txtDuracion1Actualizar").val(duracionObj.fibra || "");
        $("#txtDuracion2Actualizar").val(duracionObj.cable || "");
      } else {
        $("#txtDuracion1Actualizar").val(duracionObj.duracion || "");
        $("#txtDuracion2Actualizar").val("");
      }

      deshabilitarDuracion2("slcTipoServicioActualizar");

      $("#modalActualizarPaquete").modal("show");
    } catch (error) {
      console.error("Error en paquete:", error);
    }
  });

  // Función para obtener los valores de duración
  function obtenerValoresDuracion(contexto) {
    let txtMeses1, txtMeses2;

    if (contexto === "registro") {
      txtMeses1 = document.querySelector("#txtDuracion1");
      txtMeses2 = document.querySelector("#txtDuracion2");
    } else if (contexto === "actualizacion") {
      txtMeses1 = document.querySelector("#txtDuracion1Actualizar");
      txtMeses2 = document.querySelector("#txtDuracion2Actualizar");
    }

    if (!txtMeses1 || !txtMeses1.value.trim()) {
      console.error("Elemento de duración 1 no encontrado o vacío");
      return null;
    }

    const tipoServicio =
      $("#slcTipoServicio").val() || $("#slcTipoServicioActualizar").val();

    if (tipoServicio === "3") {
      if (!txtMeses2 || !txtMeses2.value.trim()) {
        console.error("Elemento de duración 2 no encontrado o vacío para GPON");
        return null;
      }
      return {
        fibra: parseInt(txtMeses1.value, 10),
        cable: parseInt(txtMeses2.value, 10),
      };
    } else {
      return {
        duracion: parseInt(txtMeses1.value, 10),
      };
    }
  }

  // Función meses actualizada
  async function meses(contexto) {
    const idServicio =
      document.querySelector("#slcTipoServicio").value ||
      document.querySelector("#slcTipoServicioActualizar").value;
    let jsonMeses = {};

    jsonMeses = obtenerValoresDuracion(contexto);
    if (!jsonMeses) {
      return null;
    }

    return jsonMeses;
  }

  // Validar Campos
  async function validarCampos(contexto) {
    let paquete, precio, tipoServicio, duracion1, duracion2;

    if (contexto === "registro") {
      paquete = document.querySelector("#txtPaquete");
      precio = document.querySelector("#txtPrecio");
      tipoServicio = document.querySelector("#slcTipoServicio");
      duracion1 = document.querySelector("#txtDuracion1");
      duracion2 = document.querySelector("#txtDuracion2");
    } else if (contexto === "actualizacion") {
      paquete = document.querySelector("#txtPaqueteActualizar");
      precio = document.querySelector("#txtPrecioActualizar");
      tipoServicio = document.querySelector("#slcTipoServicioActualizar");
      duracion1 = document.querySelector("#txtDuracion1Actualizar");
      duracion2 = document.querySelector("#txtDuracion2Actualizar");
    }

    if (
      !paquete.value.trim() ||
      !precio.value.trim() ||
      !tipoServicio.value.trim() ||
      !duracion1.value.trim() ||
      (tipoServicio.value === "3" && !duracion2.value.trim())
    ) {
      showToast("Todos los campos son obligatorios", "WARNING");
      return false;
    }

    if (
      parseFloat(duracion1.value) < 3 ||
      (tipoServicio.value === "3" && parseFloat(duracion2.value) < 3)
    ) {
      showToast("La duración no puede ser menor a 3 meses.", "WARNING");
      return false;
    }

    return true;
  }

  // Función para Registrar
  async function registrarPaquete() {
    if (!(await validarCampos("registro"))) {
      return;
    }

    const jsonMeses = await meses("registro");
    if (!jsonMeses) {
      showToast("Error al obtener la duración", "ERROR");
      return;
    }

    const paquete = document.querySelector("#txtPaquete");
    const precio = document.querySelector("#txtPrecio");

    if (!paquete || !precio) {
      console.error("Elementos de paquete o precio no encontrados");
      showToast("Error al obtener los datos del paquete o precio", "ERROR");
      return;
    }

    try {
      const respuesta = await fetch(
        `${config.HOST}app/controllers/Paquete.controllers.php`,
        {
          method: "POST",
          body: JSON.stringify({
            operacion: "registrarPaquete",
            parametros: {
              idServicio: idServicio,
              paquete: paquete.value,
              precio: precio.value,
              duracion: jsonMeses,
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

  // Función Actualizar
  async function actualizarPaquete(idPaquete) {
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
    const idServicio = document.querySelector(
      "#slcTipoServicioActualizar"
    ).value;

    const datos = {
      operacion: "actualizarPaquete",
      parametros: {
        idPaquete: idPaquete,
        idServicio: idServicio,
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

  // Función eliminar
  async function eliminarPaquete(idPaquete, idUsuario) {
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

  async function cargarServicios() {
    try {
      const response = await fetch(
        `${config.HOST}app/controllers/Servicio.controllers.php?operacion=listarServicio`
      );
      const servicios = await response.json();

      const slcTipoServicio = $("#slcTipoServicio");
      const slcTipoServicioActualizar = $("#slcTipoServicioActualizar");

      slcTipoServicio.empty();
      slcTipoServicioActualizar.empty();

      slcTipoServicio.append(
        '<option value="" disabled selected>Seleccione</option>'
      );
      slcTipoServicioActualizar.append(
        '<option value="" disabled selected>Seleccione</option>'
      );

      servicios.forEach((servicio) => {
        const option = `<option value="${servicio.id_servicio}">${servicio.tipo_servicio} (${servicio.servicio})</option>`;
        slcTipoServicio.append(option);
        slcTipoServicioActualizar.append(option);
      });

      slcTipoServicio.on("change", function () {
        idServicio = parseInt($(this).val(), 10);
      });

      slcTipoServicioActualizar.on("change", function () {
        idServicio = parseInt($(this).val(), 10);
      });
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    }
  }

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
});
