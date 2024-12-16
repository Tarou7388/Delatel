import config from "../env.js";
import * as mapa from "./Mapa.js";
import { inicializarDataTable, FichaSoporte } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  let ruta = `${config.HOST}app/controllers/Soporte.controllers.php?operacion=FiltrarSoportePrioridad&prioridad=`;

  const Prioridad = document.querySelector("#slcPrioridad");


  async function recorrerIdServicio(data, nrodoc, coordenada) {
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
        console.log(nombres);
        const div = document.createElement('div');
        div.classList.add('my-2', 'p-2', 'border', 'rounded');
        div.textContent = `Servicio ${index + 1}: ${nombres[0].tipo_servicio}`;

        div.addEventListener('click', () => {
          mostrarFichaServicio(nombres[0].tipo_servicio, data[0].id_soporte, nrodoc, coordenada);
        });

        modalBody.appendChild(div);
      });
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
    console.log(data);
    await recorrerIdServicio(data, data[0].nro_doc, data[0].coordenada);
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
          idUserInactive: user['idUsuario']
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
        className: "text-center user-select-none"
      },
      {
        data: "tipo_soporte",
        title: "Tipo de Soporte",
        className: "text-center user-select-none",
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
        className: "text-start user-select-none"
      },
      {
        data: "fecha_hora_solicitud",
        title: "Hora de solicitud",
        className: "text-end user-select-none",
        render: function (data, type, row) {
          return data ? data : '<i>No asignado</i>';
        }
      },
      {
        data: "nombre_tecnico",
        title: "Técnico a Cargo",
        className: "text-center user-select-none",
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
          return `<button class="btnActualizar btn btn-primary" data-id="${row.id_soporte}" ${isDisabled}>Atender</button>
                  <button class="btnEliminar btn btn-danger" data-id="${row.id_soporte}" ><i class="fa-solid fa-trash"></i></button>
                  <button class="btnMapa btn btn-dark" data-id="${row.id_soporte}" data-toggle="modal" data-target="#ModalMapa"><i class="fa-solid fa-map"></i></button>
                  <button class="btnCompleto btn btn-success" data-id="${row.id_soporte}" ><i class="fa-solid fa-check"></i></button>`;
        }
      }
    ],
    [
      { width: "4%", targets: 0 },
      { width: "10%", targets: 1 },
      { width: "15%", targets: 2 },
      { width: "25%", targets: 3 },
      { width: "10%", targets: 4 },
      { width: "20%", targets: 5 },
      { width: "10%", targets: 6 }
    ]
  );


  $('.card-body').on('click', '.btnActualizar', async function () {
    let id_soporte = $(this).data('id');
    console.log("Se ha hecho clic en Editar con ID de soporte:", id_soporte);
    await obtenerDataSoporte(id_soporte);
  });

  $('.card-body').on('click', '.btnEliminar', async function () {
    let id_soporte = $(this).data('id');
    if (await ask("¿Está seguro de eliminar este soporte?")) {
      await inhabilitarSoporte(id_soporte);
    }
  });
  
  $('.card-body').on('click', '.btnMapa', async function () {
    //asignar la funcion del boton del mapa para que me obtenga el id del contrato la funcion esta en Herramientas.js
    let id_soporte = $(this).data('id');
    const data = await FichaSoporte(id_soporte);
    console.log('id del soporte:', id_soporte);
    console.log('Datos del contrato:', data);

    //Extraer y almacenar el id_contrato
    const id_contrato = data[0].id_contrato;
    console.log('ID del contrato:', id_contrato);
    await mapa.renderizarCoordenadaMapa(id_contrato);

    const params = { cajas: false, mufas: false }
    const ip = "map"
    const renderizado = "modal"
    mapa.iniciarMapa(params, ip, renderizado);
  });

  $('.card-body').on('click', '.btnCompleto', async function () {
    let id_soporte = $(this).data('id');
    console.log("Aqui sera para completarlo");
  });

  var today = new Date().toISOString().split('T')[0];
  document.getElementById('txtFecha').value = today;

  Prioridad.addEventListener("change", async (event) => {
    ruta = `${config.HOST}app/controllers/Soporte.controllers.php?operacion=FiltrarSoportePrioridad&prioridad=` + Prioridad.value;
    table.ajax.url(ruta).load();
  });

  
});