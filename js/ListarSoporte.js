import config from "../env.js";
import * as mapa from "./Mapa.js";
import { inicializarDataTable, FichaInstalacion, CompletarSoporte } from "./Herramientas.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener("DOMContentLoaded", async () => {
  let login = await Herramientas.obtenerLogin();
  let ruta = `${config.HOST}app/controllers/Soporte.controllers.php?operacion=FiltrarSoportePrioridad&prioridad=`;

  const Prioridad = document.querySelector("#slcPrioridad");


  async function recorrerIdServicio(data, nrodoc, coordenada, soporteJson) {
    const modal = new bootstrap.Modal(document.getElementById('soporteModal'));
    const modalBody = document.querySelector('#soporteModal .modal-body');
    modalBody.innerHTML = '';
    const servicios = JSON.parse(data[0].id_servicio).id_servicio;
    const soporteData = JSON.parse(soporteJson);

    // Verificar qué servicios están completos
    const serviciosCompletos = {
      fibr: !!soporteData.fibr,
      cabl: !!soporteData.cabl
    };

    console.log('Servicios completos:', serviciosCompletos);

    if (servicios.length > 1) {
      for (const [index, id] of servicios.entries()) {
        const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=obtenerServiciosId&idservicio=${id}`);
        const nombres = await respuesta.json();
        const tipoServicio = nombres[0].tipo_servicio.toLowerCase();
        const estaCompleto = serviciosCompletos[tipoServicio];

        const div = document.createElement('div');
        div.classList.add('my-2', 'p-2', 'border', 'rounded', 'd-flex', 'justify-content-between', 'align-items-center');

        if (estaCompleto) {
          div.classList.add('bg-light');
          div.innerHTML = `
                    <span>Servicio ${index + 1}: ${nombres[0].tipo_servicio} (Completo)</span>
                    <span class="text-success"><i class="fas fa-check-circle"></i></span>
                `;
        } else {
          div.innerHTML = `<span>Servicio ${index + 1}: ${nombres[0].tipo_servicio}</span>`;
          div.addEventListener('click', () => {
            mostrarFichaServicio(nombres[0].tipo_servicio, data[0].id_soporte, nrodoc, coordenada);
          });
          div.style.cursor = 'pointer';
        }

        modalBody.appendChild(div);
      }
      modal.show();
    } else if (servicios.length === 1) {
      const id = servicios[0];
      const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=obtenerServiciosId&idservicio=${id}`);
      const nombres = await respuesta.json();
      mostrarFichaServicio(nombres[0].tipo_servicio, data[0].id_soporte, nrodoc, coordenada);
    }
  }

  function mostrarFichaServicio(tipoServicio, id_soporte, nro_doc, coordenada) {
    window.location.href = `${config.HOST}views/Soporte/Soporte${tipoServicio}?idsoporte=${id_soporte}&doc=${nro_doc}&tiposervicio=${tipoServicio}&coordenada=${coordenada}`;
  }

  async function obtenerDataSoporte(idsoport) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idsoport}`);
    const data = await respuesta.json();
    await recorrerIdServicio(data, data[0].nro_doc, data[0].coordenada, data[0].soporte);
  }

  async function inhabilitarSoporte(idsoport) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        operacion: 'inhabilitarSoportebyID',
        data: {
          idSoporte: idsoport,
          idUserInactive: login.idUsuario
        }
      })
    });
    const data = await respuesta.json();
    if (data) {
      showToast('Soporte eliminado correctamente', 'SUCCESS');
      table.ajax.reload();
    }
  }

  const table = inicializarDataTable(
    "#tblSoporteIncompleto",
    ruta,
    [
      {
        data: "prioridad",
        title: "Prioridad",
        className: "text-center user-select-none d-none d-sm-table-cell"
      },
      {
        data: "nombre_usuario",
        title: "Usuario",
        className: "text-center user-select-none d-none d-sm-table-cell"
      },
      {
        data: "tipos_servicio",
        title: "Servicios",
        className: "text-center user-select-none d-none d-sm-table-cell",
        render: function (data, type, row) {
          return data ? data : '<i>No asignado</i>';
        }
      },
      {
        data: "nombre_cliente",
        title: "Nombre del Cliente",
        className: "text-start user-select-none"
      },
      {
        data: "direccion_servicio",
        title: "Dirección",
        className: "text-center user-select-none d-none d-sm-table-cell"
      },
      {
        data: "fecha_hora_solicitud",
        title: "Hora de solicitud",
        className: "text-center user-select-none d-none d-sm-table-cell",
        render: function (data, type, row) {
          return data ? data : '<i>No asignado</i>';
        }
      },
      {
        data: null,
        title: "Acciones",
        className: "text-center",
        render: function (data, type, row) {
          const prioridad = row.prioridad ? row.prioridad.trim().toLowerCase() : "";
          const isDisabled = prioridad === "incidencia" ? "disabled" : "";
          return `<button class="btnActualizar btn btn-primary" data-id="${row.id_soporte}" ${isDisabled}><i class="fa-solid fa-pen"></i></button>
                  <button class="btnEliminar btn btn-danger" data-id="${row.id_soporte}" ><i class="fa-solid fa-trash"></i></button>
                  <button class="btnMapa btn btn-dark" data-id="${row.id_soporte}" data-bs-toggle="modal" data-bs-target="#ModalMapa"><i class="fa-solid fa-location-dot"></i></button>
                  <button class="btnCompleto btn btn-success" data-id="${row.id_soporte}" ><i class="fa-solid fa-check"></i></button>`;
        }
      }
    ],
    [
      { width: "4%", targets: 0 },
      { width: "10%", targets: 1 },
      { width: "10%", targets: 2 },
      { width: "20%", targets: 3 },
      { width: "25%", targets: 4 },
      { width: "10%", targets: 5 }
    ],
    {
      columnDefs: [
        { className: 'text-center', targets: '_all' },
        { targets: [0], visible: false },
        { targets: [0, 1, 3, 4], className: 'd-none d-sm-table-cell' }
      ]
    }
  );


  function alternarDetalles(fila) {
    if (window.innerWidth < 768) {
      const siguienteFila = fila.nextElementSibling;
      if (siguienteFila && siguienteFila.classList.contains('fila-detalles')) {
        siguienteFila.remove();
      } else {
        const celdasOcultas = fila.querySelectorAll('.d-none.d-sm-table-cell');
        let detallesHtml = '<tr class="fila-detalles" style="height: auto;"><td colspan="12"><table class="table table-striped">';
        celdasOcultas.forEach((celda) => {
          detallesHtml += `<tr><td><div class="d-flex justify-content-between"><span class="text-center">${celda.innerHTML}</span></div></td></tr>`;
        });

        detallesHtml += '</table></td></tr>';
        fila.insertAdjacentHTML('afterend', detallesHtml);
      }
    }
  }


  function agregarEventListenersFilas() {
    const filas = document.querySelectorAll("#tblSoporteIncompleto tbody tr");

    filas.forEach((fila) => {
      fila.addEventListener("click", (event) => {
        alternarDetalles(fila);
      });
    });
  }


  table.on('draw', function () {
    agregarEventListenersFilas();
  });

  $('.card-body').on('click', '.btnActualizar', async function () {
    let id_soporte = $(this).data('id');
    await obtenerDataSoporte(id_soporte);
  });

  $('.card-body').on('click', '.btnEliminar', async function () {
    let id_soporte = $(this).data('id');
    if (await ask("¿Está seguro de eliminar este soporte?")) {
      await inhabilitarSoporte(id_soporte);
    }
  });

  $('.card-body').on('click', '.btnMapa', async function () {

    let id_soporte = $(this).data('id');
    const data = await FichaInstalacion(id_soporte);


    const id_contrato = data[0].id_contrato;

    const params = { cajas: false, mufas: false }
    const ip = "map"
    const renderizado = "modal"
    await mapa.iniciarMapa(params, ip, renderizado);

    await mapa.renderizarCoordenadaMapa(id_contrato);
  });

  $('.card-body').on('click', '.btnCompleto', async function () {
    let id_soporte = $(this).data('id');
    if (await ask("¿Está seguro de completar este soporte? Ya no aparecera en la tabla.")) {
      CompletarSoporte(id_soporte);
      table.ajax.reload();
    }
  });

  var today = new Date().toISOString().split('T')[0];
  document.getElementById('txtFecha').value = today;

  Prioridad.addEventListener("change", async (event) => {
    ruta = `${config.HOST}app/controllers/Soporte.controllers.php?operacion=FiltrarSoportePrioridad&prioridad=` + Prioridad.value;
    table.ajax.url(ruta).load();
  });

});