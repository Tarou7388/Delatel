import config from "../env.js";
import * as mapa from "./Mapa.js";
import * as Herramientas from "./Herramientas.js";
window.addEventListener("DOMContentLoaded", async function () {
  let login = await Herramientas.obtenerLogin();
  let actividad = null;
  const contenido = document.getElementById("contenido");
  async function cargarActividades() {
    const response = await fetch(`${config.HOST}app/controllers/Usuario.controllers.php?operacion=obtenerPermisos`);
    const data = await response.json();
    actividad = data.actividad;
  }

  (async () => {
    await cargarActividades();
    await seleccionarActividad();
  })();

  async function seleccionarActividad() {
    switch (actividad) {
      case 'Mapa':
        cargarMapa();
        break;
      case 'Soporte':
        cargarSoporte();
        break;
      case 'Contratos':
        cargarContratos();
        break;
      case 'Kardex':
        cargarKardex();
        break;
      case 'Fichas':
        cargarFichas();
        break;
      case 'Contactos':
        cargarContactos();
        break;
    }
  }

  async function cargarMapa() {
    contenido.innerHTML = `
    <div id="mapPagina" style="height: 700px;"></div>
    `;
    const params = { cajas: true, mufas: true, antena: true };
    const id = "mapPagina"
    const renderizado = "pagina"
    await mapa.iniciarMapa(params, id, renderizado);
  }

  async function cargarSoporte() {
    const soporteContainer = document.createElement('div');
    soporteContainer.innerHTML = `
    <h4 class="text-center">Fichas de Soportes Pendientes</h4>
      <div class="table-responsive">
        <table class="table table-striped" id="tablaSoporte">
          <thead>
            <tr>
              <th class="text-center">ID</th>
              <th class="text-center">Cliente</th>
              <th class="text-center">Servicio</th>
              <th class="text-center">Fecha</th>
              <th class="text-center">N° Telefono</th>
              <th class="text-center">Problema</th>
              <th class="text-center">Mapa</th>
              <th class="text-center">Prioridad</th>
            </tr>
          </thead>
          <tbody id="tbodySoporte">
          </tbody>
        </table>
      </div>
    `;
    contenido.appendChild(soporteContainer);

    const tbodySoporte = document.getElementById("tbodySoporte");
    const response = await fetch(`${config.HOST}app/controllers/Sticket.controllers.php?operacion=listarAveriasPendientes`);
    const data = await response.json();
    data.forEach(soporte => {
      console.log(soporte);
      let rowClass = '';
      if (soporte.prioridad === 'Alta') {
        rowClass = 'bg-danger';
      } else if (soporte.prioridad === 'Media') {
        rowClass = 'bg-warning';
      } else if (soporte.prioridad === 'Baja') {
        rowClass = 'bg-success';
      }

      tbodySoporte.innerHTML += `
          <tr>
            <td class="text-center">${soporte.id_soporte}</td>
            <td class="text-center">${soporte.nombre_cliente}</td>
            <td class="text-center">${soporte.tipo_servicio}</td>
            <td class="text-center">${soporte.fecha_creacion}</td>
            <td class="text-center">${soporte.telefono}</td>
            <td class="text-center">${soporte.descripcion_problema}</td>
             <td class="text-center">
              <button class="btnMapa btn btn-dark" data-id="${soporte.id_soporte}" data-tipo="soporte" data-bs-toggle="modal" data-bs-target="#ModalMapa">
                <i class="fa-solid fa-location-dot"></i>
              </button>
            </td>
            <td class="${rowClass} text-center">${soporte.prioridad}</td>
          </tr>
        `;
    });
    $('#tablaSoporte').DataTable({
      columnDefs: [
        { targets: [], visible: true }
      ],
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
      },
      ordering: false
    });
  }

  async function cargarContratos() {
    contenido.innerHTML = `
      <table class="table table-striped" id="tablaContratos">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Cliente</th>
            <th>Direccion</th>
            <th>Paquete</th>
            <th>Servicio</th>
          </tr>
        </thead>
        <tbody id="tbodyContratos">
        </tbody>
      </table>
    `;
    $('#tablaContratos').DataTable({
      ajax: {
        url: `${config.HOST}app/controllers/Contrato.controllers.php?operacion=listarContratos`,
        type: 'GET',
        dataSrc: function (json) {
          console.log('Respuesta completa del servidor:', json);
          return json;
        }
      },
      columns: [
        { data: 'id_contrato' },
        { data: 'nombre_cliente' },
        { data: 'direccion_servicio' },
        { data: 'paquete' },
        { data: 'tipos_servicio' } // Asegúrate de que el nombre de la propiedad coincida
      ],
      columnDefs: [
        { targets: 0, visible: false },
      ],
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
      },
      order: [[0, 'desc']]
    });
  }

  async function cargarKardex() {
    contenido.innerHTML = `
    <table class="table table-striped" id="tablaKardex">
      <thead>
        <tr>
          <th class="text-center">ID</th>
          <th class="text-center">Fecha</th>
          <th class="text-center">Marca</th>
          <th class="text-center">Tipo</th>
          <th class="text-center">Saldo</th>
          <th class="text-center">Motivo</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody id="tbodyKardex"></tbody>
    </table>
    `
    let tablaKardex = null;

    function renderDataTable() {
      tablaKardex = new DataTable("#tablaKardex", {
        order: [[0, 'desc']],
        columnDefs: [{ targets: 0, visible: false }],
        language: { url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json" }
      });
    }

    const response = await fetch(`${config.HOST}app/controllers/Kardex.controllers.php?operacion=listarKardex`);
    const data = await response.json();

    const tbody = document.querySelector("#tablaKardex tbody");
    tbody.innerHTML = data.map(element => `
      <tr>
        <td class="text-center">${element.id_kardex}</td>
        <td class="text-center">${element.fecha}</td>
        <td class="text-center">${element.nombre_marca}</td>
        <td class="text-center">${element.tipo_producto}</td>
        <td class="text-center">${element.saldo_total}</td>
        <td class="text-center">${element.tipo_operacion}</td>
        <td class="text-center">
          <button class="btn btn-primary btn-detalle" data-id="${element.id_kardex}"><i class="fa-regular fa-clipboard"></i></button>
        </td>
      </tr>`).join('');

    renderDataTable();

    document.querySelectorAll('.btn-detalle').forEach(button => {
      button.addEventListener('click', (event) => {
        const id = event.currentTarget.getAttribute('data-id');
        const kardex = data.find(element => element.id_kardex == id);
        console.log(kardex);

        document.getElementById('detalleIdKardex').innerText = kardex.id_kardex;
        document.getElementById('detalleUsuario').innerText = kardex.creado_por;
        document.getElementById('detalleFecha').innerText = kardex.fecha;
        document.getElementById('detalleMarca').innerText = kardex.nombre_marca;
        document.getElementById('detalleTipo').innerText = kardex.tipo_producto;
        document.getElementById('detalleSaldo').innerText = kardex.saldo_total;
        document.getElementById('detalleTipoMovimiento').innerText = kardex.tipo_movimiento;
        document.getElementById('detalleMotivo').innerText = kardex.tipo_operacion;

        new bootstrap.Modal(document.getElementById('detalleModalKardex')).show();
      });
    });
  }

  async function cargarFichas() {
    await cargarSoporte();

    const fichasContainer = document.createElement('div');
    fichasContainer.innerHTML = `
    <h4 class="text-center">Fichas de Contratos Pendientes</h4>
    <div class="table-responsive">
      <table class="table table-striped" id="tablaFichaContrato">
      <thead>
        <tr>
          <th>ID</th>
          <th class="text-center">Nombre Cliente</th>
          <th class="text-center">Servicio</th>
          <th class="text-center">Paquete</th>
          <th class="text-center">N° Telefono</th>
          <th class="text-center">Direccion</th>
          <th class="text-center">Referencia</th>
          <th class="text-center">Mapa</th>
        </tr>
      </thead>
      <tbody id="tbodyFichaContrato">
      </tbody>
    </table>
    </div>
    `;
    contenido.appendChild(fichasContainer);

    const tbodyFichaContrato = document.getElementById("tbodyFichaContrato");
    const responseFichaContrato = await fetch(`${config.HOST}app/controllers/Sticket.controllers.php?operacion=listarContratosPendientes`);
    const dataFichaContrato = await responseFichaContrato.json();
    dataFichaContrato.forEach(contrato => {
      tbodyFichaContrato.innerHTML += `
        <tr>
          <td>${contrato.id_contrato}</td>
          <td class="text-center">${contrato.nombre_cliente}</td>
          <td class="text-center">${contrato.tipos_servicio}</td>
          <td class="text-center">${contrato.nombre_paquete}</td>
          <td class="text-center">${contrato.telefono}</td>
          <td class="text-center">${contrato.direccion_servicio}</td>
          <td class="text-center">${contrato.referencia}</td>
         <td class="text-center">
            <button class="btnMapa btn btn-dark" data-id="${contrato.id_contrato}" data-tipo="ficha" data-bs-toggle="modal" data-bs-target="#ModalMapa">
              <i class="fa-solid fa-location-dot"></i>
            </button>
          </td>
        </tr>
      `;
    });
    $('#tablaFichaContrato').DataTable({
      columnDefs: [
        { targets: 0, visible: false }
      ],
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
      },
      order: [[0, "desc"]]
    });
  }

  async function cargarContactos() {

    contenido.innerHTML = `
      <table class="table table-striped" id="tablaContactos">
        <thead>
          <tr>
            <th>ID</th>
            <th class="text-center">Nombre y Apellido</th>
            <th class="text-center">Telefono</th>
            <th class="text-center">Dirección</th>
            <th class="text-center">Nota</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody id="tbodyContactos"></tbody>
      </table>
    `;

    $('#tablaContactos').DataTable({
      processing: true,
      serverSide: true,
      ajax: {
        url: '../app/controllers/Contactos.ssp.php',
        dataSrc: function (json) {

          console.log(json);
          return json.data;
        },
        error: function (xhr, error, thrown) {
          console.error('Error en la carga de datos:', error, thrown);
          alert('Error al cargar los datos. Por favor, revisa la consola para más detalles.');
        }
      },
      columns: [
        { data: 0, className: 'text-center' },
        { data: 1, className: 'text-center' },
        { data: 2, className: 'text-center' },
        { data: 8, className: 'text-center' },
        { data: 4, className: 'text-center' },
        {
          data: null,
          orderable: false,
          searchable: false,
          render: function (data, type, row) {
            return `
              <button class="btn btn-primary btn-detalle" data-id="${row[0]}"><i class="fa-regular fa-clipboard"></i></button>
              <button class="btn btn-success btn-whatsapp" data-telefono="${row[2]}" data-nombre="${row[1]}"><i class="fa-brands fa-whatsapp"></i></button>
            `;
          }
        }
      ],
      columnDefs: [
        { targets: 0, visible: false }
      ],
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      order: [[0, 'desc']]
    });


    $('#tablaContactos').on('draw.dt', function () {
      document.querySelectorAll('.btn-detalle').forEach(button => {
        button.addEventListener('click', (event) => {
          const id = event.currentTarget.getAttribute('data-id');
          const contacto = $('#tablaContactos').DataTable().data().toArray().find(element => element[0] == id);

          if (contacto) {
            document.getElementById('detalleId').innerText = contacto[0];
            document.getElementById('detalleNombre').innerText = contacto[1];
            document.getElementById('detalleEmail').innerText = contacto[3];
            document.getElementById('detalleDireccion').innerText = contacto[8];
            document.getElementById('detalleFechaLimite').innerText = contacto[10];
            document.getElementById('detalleFechaCreacion').innerText = contacto[7];
            document.getElementById('detallePaquete').innerHTML = contacto[9];
            document.getElementById('detallePrecio').innerText = contacto[6];
            document.getElementById('detalleNota').innerText = contacto[4];
            document.getElementById('detalleUsuarioCreador').innerText = contacto[11];

            new bootstrap.Modal(document.getElementById('detalleModalContactos')).show();
          } else {
            console.error('Contacto no encontrado');
          }
        });
      });

      document.querySelectorAll('.btn-whatsapp').forEach(button => {
        button.addEventListener('click', (event) => {
          const telefono = event.currentTarget.getAttribute('data-telefono');
          const nombre = event.currentTarget.getAttribute('data-nombre');
          window.whatsapp(telefono, nombre);
        });
      });
    });

    window.whatsapp = function (telefono, nombre) {
      if (typeof telefono === 'string') {
        const telefonoFormateado = `51${telefono.replace(/\D/g, '')}`;
        const mensaje = `Hola ${nombre}, Estoy creando pruebas para la empresa delatel sobre contactos por WhatsApp.`;
        const url = `https://api.whatsapp.com/send?phone=${telefonoFormateado}&text=${encodeURIComponent(mensaje)}`;

        console.log("Teléfono formateado:", telefonoFormateado);
        console.log("Mensaje:", mensaje);
        console.log("URL:", url);

        window.open(url, '_blank');
      } else {
        console.error('Teléfono no válido');
      }
    }
  }

  $('.card-body').on('click', '.btnMapa', async function () {
    const id = $(this).data('id');
    const tipo = $(this).data('tipo');
    const params = { cajas: false, mufas: false };
    const ip = "map";
    const renderizado = "modal";
    await mapa.iniciarMapa(params, ip, renderizado);

    if (tipo === 'ficha') {
      await mapa.renderizarCoordenadaMapa(id);
    } else if (tipo === 'soporte') {
      const data = await Herramientas.FichaInstalacion(id);
      const id_contrato = data[0].id_contrato;
      await mapa.renderizarCoordenadaMapa(id_contrato);
    }
  });
});