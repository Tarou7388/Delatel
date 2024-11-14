import config from "../env.js";
import { inicializarDataTable } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  let ruta = `${config.HOST}app/controllers/Soporte.controllers.php?operacion=FiltrarSoportePrioridad&prioridad=`;

  const Prioridad = document.querySelector("#slcPrioridad");


  async function recorrerIdServicio(data,nrodoc) {
    const modal = new bootstrap.Modal(document.getElementById('soporteModal'));
    const modalBody = document.querySelector('#soporteModal .modal-body');
    modalBody.innerHTML = '';

    console.log(nrodoc);
    console.log(data);
    const servicios = JSON.parse(data[0].id_servicio).id_servicio;

    if (servicios.length > 1) {
      servicios.forEach(async (id, index) => {
        const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=obtenerServiciosId&idservicio=${id}`);
        const nombres = await respuesta.json();

        const div = document.createElement('div');
        div.classList.add('my-2', 'p-2', 'border', 'rounded');
        div.textContent = `Servicio ${index + 1}: ${nombres[0].tipo_servicio}`;

        div.addEventListener('click', () => {
          mostrarFichaServicio(nombres[0].tipo_servicio, data[0].id_soporte,nrodoc);
        });

        modalBody.appendChild(div);
      });
      modal.show();
    } else if (servicios.length === 1) {
      const id = servicios[0];
      const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=obtenerServiciosId&idservicio=${id}`);
      const nombres = await respuesta.json();
      mostrarFichaServicio(nombres[0].tipo_servicio, data[0].id_soporte,nrodoc);
    }
  }

  function mostrarFichaServicio(tipoServicio, id_soporte,nro_doc) {
    if (tipoServicio === "WISP") {
      window.location.href = `${config.HOST}views/Soporte/FichaWisp?idsoporte=${id_soporte}&doc=${nro_doc}`;
    } else if (tipoServicio === "FIBR") {
      window.location.href = `${config.HOST}views/Soporte/FichaGpon?idsoporte=${id_soporte}&doc=${nro_doc}`;
    } else if (tipoServicio === "CABL") {
      window.location.href = `${config.HOST}views/Soporte/FichaAveriaCable?idsoporte=${id_soporte}&doc=${nro_doc}`;
    } else {
      console.error("No se encontró el servicio y la ficha correspondiente");
    }
  }

  async function obtenerDataSoporte(idsoport) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idsoport}`);
    const data = await respuesta.json();
    console.log(data[0]);
    await recorrerIdServicio(data,data[0].nro_doc);
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
    console.log("Se ha hecho clic en Editar con ID de soporte:", id_soporte);
    obtenerDataSoporte(id_soporte);
  });

  var today = new Date().toISOString().split('T')[0];
  document.getElementById('txtFecha').value = today;

  Prioridad.addEventListener("change", async (event) => {
    ruta = `${config.HOST}app/controllers/Soporte.controllers.php?operacion=FiltrarSoportePrioridad&prioridad=` + Prioridad.value;
    table.ajax.url(ruta).load();
  });
});
