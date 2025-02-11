
import config from "../env.js";
import * as mapa from "./Mapa.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener("DOMContentLoaded", async () => {

  let login = await Herramientas.obtenerLogin();
  const userid = login.idUsuario;
  const ruta = `${config.HOST}app/controllers/Persona.ssp.php`;

  window.tablaProductos = $("#TbPersonas").DataTable({
    dom: `
      <"row"<"col-sm-12 col-md-6"B><"col-sm-12 col-md-6 text-end"f>>
      <"row"<"col-sm-12"tr>>
      <"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>
    `,
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
    },
    buttons: [
      {
        extend: "csv",
        text: '<i class="fa-solid fa-file-csv"></i>',
        className: "btn btn-primary me-2",
        filename: "Productos",
        title: "Productos",
        exportOptions: {
          columns: ":not(:last-child)",
        },
      },
      {
        extend: "excel",
        text: '<i class="fa-solid fa-file-excel"></i>',
        className: "btn btn-success me-2",
        filename: "Productos",
        title: "Productos",
        exportOptions: {
          columns: ":not(:last-child)",
        },
      },
      {
        extend: "pdf",
        text: '<i class="fa-solid fa-file-pdf"></i>',
        className: "btn btn-danger me-2",
        filename: "Productos",
        title: "Productos",
        exportOptions: {
          columns: ":not(:last-child)",
        },
      },
      {
        extend: "print",
        text: '<i class="fa-solid fa-print"></i>',
        className: "btn btn-secondary me-2",
        exportOptions: {
          columns: ":not(:last-child)",
        },
      },
    ],
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
      { data: 6, title: "Email", className: "text-center" },
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
      { targets: 1, width: "10%" },
      { targets: 2, width: "15%" },
      { targets: 3, width: "10%" },
      { targets: 4, width: "15%" },
      { targets: 5, width: "15%" },
      { targets: 6, width: "15%" },
      { targets: 7, width: "10%" },
    ],
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
    },
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
    console.log("ID de la persona seleccionada:", $(this).data("id"));
    $("#modalEditarPersona").modal("show");
    await cargarMapa();
  });




});