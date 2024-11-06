import config from "../env.js";
import { inicializarDataTable } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  let ruta = `${config.HOST}app/controllers/Soporte.controllers.php?operacion=FiltrarSoportePrioridad&prioridad=`;

  const Prioridad = document.querySelector("#slcPrioridad");

  async function obtenerDataSoporte(idsoport) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idsoport}`);
    const data = await respuesta.json();
    console.log(data);
    return data;
  }

  async function abrirModal(idsoport) {
    try {
      // Obtener los datos de soporte
      const soporteData = await obtenerDataSoporte(idsoport);

      // Validar que la respuesta contenga datos y que soporteData[0] exista
      if (!soporteData || !soporteData[0] || !soporteData[0].soporte) {
        console.error("Datos de soporte no encontrados o JSON inválido");
        return;
      }

      // Asegurarse de que el campo "soporte" sea un objeto JSON válido
      let soporteJson = soporteData[0].soporte;

      if (typeof soporteJson === "string") {
        soporteJson = JSON.parse(soporteJson);
      }

      // Selección del modal según el tipo de servicio
      const tipoServicio = soporteData[0].tipo_servicio;
      let modalID = "";
      let parametrosList, cambiosList;

      switch (tipoServicio) {
        case "WISP":
          modalID = "#editModalWISP";
          parametrosList = document.querySelector(`${modalID} #parametrosList`);
          cambiosList = document.querySelector(`${modalID} #cambiosList`);
          break;
        case "GPON":
          modalID = "#editModalGPON";
          parametrosList = document.querySelector(`${modalID} #parametrosList`);
          cambiosList = document.querySelector(`${modalID} #cambiosList`);
          break;
        case "CABL":
          modalID = "#editModalCABLE";
          parametrosList = document.querySelector("#parametrosListCable");
          cambiosList = document.querySelector("#cambiosListCable");
          break;
        default:
          modalID = "#editModalWISP";
          parametrosList = document.querySelector(`${modalID} #parametrosList`);
          cambiosList = document.querySelector(`${modalID} #cambiosList`);
          break;
      }

      // Limpiar las listas si existen
      if (parametrosList) parametrosList.innerHTML = "";
      if (cambiosList) cambiosList.innerHTML = "";

      // Renderizado personalizado para "CABLE"
      if (tipoServicio === "CABL") {
        if (soporteJson.parametroscable) {
          Object.entries(soporteJson.parametroscable).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              parametrosList.innerHTML += `<li><strong>${key}:</strong> ${value.join(", ")}</li>`;
            } else if (typeof value === "object") {
              parametrosList.innerHTML += `<li><strong>${key}:</strong> ${JSON.stringify(value)}</li>`;
            } else {
              parametrosList.innerHTML += `<li><strong>${key}:</strong> ${value}</li>`;
            }
          });
        }

        if (soporteJson.cambioscable) {
          Object.entries(soporteJson.cambioscable).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              cambiosList.innerHTML += `<li><strong>${key}:</strong> ${value.join(", ")}</li>`;
            } else if (typeof value === "object") {
              cambiosList.innerHTML += `<li><strong>${key}:</strong> ${JSON.stringify(value)}</li>`;
            } else {
              cambiosList.innerHTML += `<li><strong>${key}:</strong> ${value}</li>`;
            }
          });
        }
      } else {
        // Renderizado genérico para otros tipos de soporte
        if (soporteJson.parametros) {
          Object.entries(soporteJson.parametros).forEach(([key, value]) => {
            parametrosList.innerHTML += `<li><strong>${key}:</strong> ${JSON.stringify(value)}</li>`;
          });
        }

        if (soporteJson.cambios) {
          Object.entries(soporteJson.cambios).forEach(([key, value]) => {
            cambiosList.innerHTML += `<li><strong>${key}:</strong> ${JSON.stringify(value)}</li>`;
          });
        }
      }

      // Mostrar el modal correspondiente
      $(modalID).modal("show");
    } catch (error) {
      console.error("Error al abrir el modal:", error);
    }
  }




  const table = inicializarDataTable(
    "#tblSoporteIncompleto",
    ruta,
    [
      { data: "prioridad", title: "Prioridad", className: "text-center" },
      { data: "tipo_soporte", title: "Tipo de Soporte", className: "text-center" },
      { data: "nombre_cliente", title: "Nombre del Cliente", className: "text-center" },
      { data: "nombre_tecnico", title: "Técnico a Cargo", className: "text-center" },
      {
        data: null,
        title: "Acciones",
        className: "text-center",
        render: function (data, type, row) {
          return `<button class="btnActualizar btn btn-primary" data-id="${row.id_soporte}">Mostrar info</button>`;
        },
      },
    ],
    [
      { width: "10%", targets: 0 },
      { width: "20%", targets: 1 },
      { width: "20%", targets: 2 },
      { width: "25%", targets: 3 },
      { width: "25%", targets: 4 },
    ]
  );

  $('.card-body').on('click', '.btnActualizar', function () {
    let id_soporte = $(this).data('id');
    console.log("Se ha hecho clic en Editar con ID de soporte:", id_soporte); // Aquí se agrega el console.log
    abrirModal(id_soporte);
  });

  var today = new Date().toISOString().split('T')[0];
  document.getElementById('txtFecha').value = today;

  Prioridad.addEventListener("change", async (event) => {
    ruta = `${config.HOST}app/controllers/Soporte.controllers.php?operacion=FiltrarSoportePrioridad&prioridad=` + Prioridad.value;
    table.ajax.url(ruta).load();
  });
});
