import config from "../env.js";
import { inicializarDataTable } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  let ruta = `${config.HOST}app/controllers/Soporte.controllers.php?operacion=FiltrarSoportePrioridad&prioridad=`;

  const Prioridad = document.querySelector("#slcPrioridad");

  function obtenerPeriodo() {
    const periodoSelect = document.querySelector("#slcCambiosPeriodoCable");
    return periodoSelect ? periodoSelect.value : "";
  }

  async function obtenerDataSoporte(idsoport) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idsoport}`);
    const data = await respuesta.json();
    console.log(data);
    return data;
  }

  const table = inicializarDataTable(
    "#tblSoporteIncompleto",
    ruta,
    [
      {
        data: "prioridad",
        title: "Prioridad",
        className: "text-center"
      },
      {
        data: "tipo_soporte",
        title: "Tipo de Soporte",
        className: "text-center",
        render: function (data, type, row) {
          return data ? data : '<i>No asignado</i>';
        }
      },
      {
        data: "nombre_cliente",
        title: "Nombre del Cliente",
        className: "text-center"
      },
      {
        data: "fecha_hora_solicitud",
        title: "Hora de solicitud",
        className: "text-center",
        render: function (data, type, row) {
          return data ? data : '<i>No asignado</i>';
        }
      },
      {
        data: "nombre_tecnico",
        title: "Técnico a Cargo",
        className: "text-center",
        render: function (data, type, row) {
          return data ? data : '<i>No asignado</i>';
        }
      },
      {
        data: null,
        title: "Acciones",
        className: "text-center",
        render: function (data, type, row) {
          return `<button class="btnActualizar btn btn-primary" data-id="${row.id_soporte}">Atender</button>`;
        }
      }
    ],
    [
      { width: "10%", targets: 0 },
      { width: "20%", targets: 1 },
      { width: "20%", targets: 2 },
      { width: "20%", targets: 3 },
      { width: "20%", targets: 4 },
      { width: "10%", targets: 5 }
    ]
  );


  $('.card-body').on('click', '.btnActualizar', function () {
    let id_soporte = $(this).data('id');
    console.log("Se ha hecho clic en Editar con ID de soporte:", id_soporte); // Aquí se agrega el console.log
    window.location.href = `${config.HOST}views/Soporte/FichaAveriaCable`;
  });

  var today = new Date().toISOString().split('T')[0];
  document.getElementById('txtFecha').value = today;

  Prioridad.addEventListener("change", async (event) => {
    ruta = `${config.HOST}app/controllers/Soporte.controllers.php?operacion=FiltrarSoportePrioridad&prioridad=` + Prioridad.value;
    table.ajax.url(ruta).load();
  });
});
