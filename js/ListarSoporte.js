import config from "../env.js";
import { inicializarDataTable } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  let ruta = `${config.HOST}app/controllers/Soporte.controllers.php?operacion=FiltrarSoportePrioridad&prioridad=`;

  const Prioridad = document.querySelector("#slcPrioridad");

  async function obtenerDataSoporte(idsoport) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idsoport}`);
    const data = await respuesta.text();
    console.log(data);
    return data;
  }

  async function abrirModal(idsoport) {
    const soporteData = await obtenerDataSoporte(idsoport);
    console.log(soporteData);
    if (soporteData && soporteData.soporte) {
      let modalID;

      // Parsear el campo "soporte" que está en formato de cadena JSON
      const soporteJson = JSON.parse(soporteData.soporte);

      // Selección del modal según el tipo de servicio
      if (soporteData.tipo_servicio === "WISP") {
        modalID = "#editModalWISP";
      } else if (soporteData.tipo_servicio === "GPON") {
        modalID = "#editModalGPON";
      } else if (soporteData.tipo_servicio === "CABL") {
        modalID = "#editModalCABLE";
      }

      // Seleccionar el modal y mostrar datos
      const parametrosList = document.querySelector(`${modalID} #parametrosList`);
      const cambiosList = document.querySelector(`${modalID} #cambiosList`);
      
      parametrosList.innerHTML = "";
      cambiosList.innerHTML = "";

      // Renderizar `parametros` y `cambios` en el modal
      Object.entries(soporteJson.parametroscable).forEach(([key, value]) => {
        parametrosList.innerHTML += `<li><strong>${key}:</strong> ${JSON.stringify(value)}</li>`;
      });
      
      Object.entries(soporteJson.cambioscable).forEach(([key, value]) => {
        cambiosList.innerHTML += `<li><strong>${key}:</strong> ${JSON.stringify(value)}</li>`;
      });

      // Mostrar el modal
      $(modalID).modal("show");
    } else {
      console.error("Datos de soporte no encontrados o JSON inválido");
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
          return `<button class="btnActualizar btn btn-primary" data-id="${row.id_soporte}">Editar</button>`;
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
