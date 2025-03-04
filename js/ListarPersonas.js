import config from "../env.js";
import * as mapa from "./Mapa.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener("DOMContentLoaded", async () => {

  let login = await Herramientas.obtenerLogin();
  const userid = login.idUsuario;
  const ruta = `${config.HOST}app/controllers/Persona.ssp.php`;
  const accesos = await Herramientas.permisos();

  let idPersonaSeleccionada = -1;

  window.tablaPersonas = $("#TbPersonas").DataTable({
    dom: `
      <"row"<"col-sm-12 col-md-6"><"col-sm-12 col-md-6 text-end"f>>
      <"row"<"col-sm-12"tr>>
      <"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>
    `,
    order: [0, 'desc'],
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
    },
    processing: true,
    serverSide: true,
    ajax: {
      url: ruta,
      type: "GET",
      dataSrc: function (json) {
        return json.data;
      },
      error: function (xhr, error, thrown) {
        console.error('Error en la carga de datos:', error, thrown);
        alert('Error al cargar los datos. Por favor, revisa la consola para más detalles.');
      }
    },
    columns: [
      { data: 0, title: "ID", className: "text-center" },
      { data: 1, title: "Tipo Documento", className: "text-center" },
      { data: 2, title: "Nro°", className: "text-center" },
      { data: 3, title: "Nombre Completo", className: "text-center" },
      { data: 4, title: "Telefono", className: "text-center" },
      { data: 5, title: "Nacionalidad", className: "text-center" },
      {
        data: 6,
        title: "Email",
        className: "text-center",
        render: function (data, type, row) {
          return data && data.trim() !== "" ? data : '<em>No asignado</em>';
        }
      },
      {
        data: 7,
        title: "Acciones",
        className: "text-center",
        orderable: false,
        searchable: false,
        render: function (data, type, row) {
          return `
            <button class="btn btn-warning btn-edit" data-id="${row[0]}"><i class="fa-regular fa-pen-to-square"></i></button>
            <button class="btn btn-danger btn-delete" data-id="${row[0]}"><i class="fa-regular fa-trash-can"></i></button>
          `;
        }
      }
    ],
    columnDefs: [
      { targets: 0, visible: false },
      { targets: 1, width: "5%" },
      { targets: 2, width: "5%" },
      { targets: 3, width: "15%" },
      { targets: 4, width: "10%" },
      { targets: 5, width: "5%" },
      { targets: 6, width: "10%" },
      { targets: 7, width: "5%" },
    ],
    paging: true,
    searching: true,
    info: true,
    lengthChange: false,
  });

  async function cargarMapa() {
    await mapa.iniciarMapa({ cajas: false, mufas: false, antena: false }, "map", "modal");

    mapa.obtenerCoordenadasClick();

    document.querySelector("#map").addEventListener("click", async () => {
      $("#CoordenadaModel").val(mapa.ultimaCoordenada.latitud + "," + mapa.ultimaCoordenada.longitud);
    });
  }

  $("#TbPersonas tbody").on("click", ".btn-edit", async function () {
    idPersonaSeleccionada = $(this).data("id");

    let datospersona = await traerdatosPersona(idPersonaSeleccionada);

    if (datospersona < 0) {
      showToast("Esta persona no figura como cliente", "WARNING");
      return;
    };

    $("#modalEditarPersona").modal("show");
    await cargarMapa();
  });

  document.querySelector("#FormActualizarPersona").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (await ask("¿Desea actualizar a este cliente?")) {
      await actualizarCliente();
      $("#modalEditarPersona").modal("hide");
    }
  });

  /******************************************************************************************/
  /***************************ESTA PARTE ES PARA EL ACTUALIZAR*******************************/
  /******************************************************************************************/

  async function actualizarCliente() {
    if (accesos?.personas?.actualizar) {
      const txtNombresActualizar = document.querySelector("#txtNombresActualizar").value;
      const txtApellidosActualizar = document.querySelector("#txtApellidosActualizar").value;
      const txtTelefono = document.querySelector("#txtTelefono").value;
      const txtCorreoElectronico = document.querySelector("#txtCorreoElectronico").value;
      const txtDireccionActualizar = document.querySelector("#txtDireccionActualizar").value;
      const txtReferenciaActualizar = document.querySelector("#txtReferenciaActualizar").value;
      const CoordenadaModel = document.querySelector("#CoordenadaModel").value;

      const datosEnvio = {
        operacion: "actualizarCliente",
        parametros: {
          apellidos: txtApellidosActualizar,
          nombres: txtNombresActualizar,
          telefono: txtTelefono,
          email: txtCorreoElectronico,
          direccion: txtDireccionActualizar,
          referencia: txtReferenciaActualizar,
          coordenadas: CoordenadaModel,
          idUserUpdate: userid,
          idPersona: idPersonaSeleccionada,
        },
      };

      console.log("Datos a enviar:", datosEnvio);

      const response = await fetch(
        `${config.HOST}app/controllers/Cliente.controllers.php`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosEnvio),
        }
      );

      const data = await response.json();
      if (data.Actualizado) {
        showToast("¡Cliente actualizado correctamente!", "SUCCESS", 1500);
        tablaPersonas.ajax.reload();
      } else {
        showToast("Error al actualizar el Cliente.", "ERROR");
      }
    }
  };

  async function traerdatosPersona(idPersona) {
    try {
      const response = await fetch(`${config.HOST}app/controllers/Persona.controllers.php?operacion=buscarClienteIdPersona&id=${idPersona}`);

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        console.log("Datos de la persona seleccionada:", data);

        if (data[0].id_cliente == null && data[0].id_cliente == undefined) {
          return -1;
        }

        document.querySelector("#txtNombresActualizar").value = data[0].nombres || "";
        document.querySelector("#txtApellidosActualizar").value = data[0].apellidos || "";
        document.querySelector("#txtTelefono").value = data[0].telefono || "";
        document.querySelector("#txtCorreoElectronico").value = data[0].email || "";
        document.querySelector("#txtDireccionActualizar").value = data[0].direccion || "";
        document.querySelector("#txtReferenciaActualizar").value = data[0].referencia || "";
        document.querySelector("#CoordenadaModel").value = data[0].coordenadas || "";

        if (data[0].coordenadas) {
          const buscarCoodenada = document.querySelector("#buscarCoodenada");
          setTimeout(() => {
            buscarCoodenada.click();
          }, 500);
          console.log("Coordenadas:", data[0].coordenadas);
        }
        return 1;
      } else {
        console.error('No se encontraron datos para esta persona.');
        showToast('No se encontraron datos para la persona seleccionada.', 'WARNING');
      }
    } catch (error) {
      console.error('Error al obtener los datos de la persona:', error);
      showToast('Hubo un problema al intentar obtener los datos.', 'ERROR');
    }
  }


});
