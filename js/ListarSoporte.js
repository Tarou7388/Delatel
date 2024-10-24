import config from "../env.js";
import { inicializarDataTable } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  let ruta = `${config.HOST}app/controllers/Soporte.controllers.php?operacion=FiltrarSoportePrioridad&prioridad=`

  const Prioridad = document.querySelector("#slcPrioridad");

  async function obtenerDataSoporte() {
    const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php`, {
      method: "POST",
      body: JSON.stringify({
        operacion: "obtenerJSON",
        datos: id_soporte
      })
    })

    const data = await respuesta.json();
  }

  function abrirModal(idsoport) {
    $('#editModal').modal('show');
  };

  const table = inicializarDataTable(
    "#tblSoporteIncompleto",
    ruta,
    [
      { data: "prioridad", title: "prioridad", className: "text-center" },
      { data: "tipo_soporte", title: "tipo_soporte", className: "text-center" },
      {
        data: "nombre_cliente",
        title: "nombre_cliente",
        className: "text-center",
      },
      {
        data: "nombre_tecnico",
        title: "nombre_tecnico",
        className: "text-center",
      },
      {
        data: null,
        title: "Acciones",
        className: "text-center",
        render: function (data, type, row) {
          return `
            <button class="btnActualizar btn btn-primary" 
                    data-id="${row.id_soporte}">Editar</button>`;
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
    abrirModal(id_soporte);
  });


  var today = new Date().toISOString().split('T')[0];
  document.getElementById('txtFecha').value = today;

  Prioridad.addEventListener("change", async (event) => {
    ruta = `${config.HOST}app/controllers/Soporte.controllers.php?operacion=FiltrarSoportePrioridad&prioridad=` + Prioridad.value;
    table.ajax.url(ruta).load();
  });
});
