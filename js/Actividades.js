import config from "../env.js";
import * as mapa from "./Mapa.js";
import * as Herramientas from "./Herramientas.js";
window.addEventListener("DOMContentLoaded", async function () {
  let login = await Herramientas.obtenerLogin();
  let actividad = null;
  const contenido = document.getElementById("contenido");
  const labelSector = document.querySelector('#sectorNombre');
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
      <div class="input-group mb-3" id="inputGroupCoordenada">
        <input type="text" id="CoordenadaModel" class="form-control" placeholder="Coordenada" aria-label="Coordenada">
        <button class="btn btn-outline-secondary" type="button" id="buscarCoodenada">Buscar</button>
      </div>
      <div id="mapPagina" style="height: 700px;"></div>
    `;
    labelSector.hidden = false;
    const id = "mapPagina";
    const renderizado = "pagina";
    await mapa.iniciarMapa("Cajas", id, renderizado);
  }

  async function cargarSoporte() {
    function alternarDetalles(fila) {
      if (window.innerWidth >= 768) {
        return;
      }

      const siguienteFila = fila.nextElementSibling;
      if (siguienteFila && siguienteFila.classList.contains('fila-detalles')) {
        siguienteFila.remove();
      } else {
        const celdasOcultas = fila.querySelectorAll('.d-none.d-md-table-cell');
        let detallesHtml = '<tr class="fila-detalles"><td colspan="8"><table class="table table-striped">';
        celdasOcultas.forEach(celda => {
          const descripcion = celda.getAttribute('data-descripcion');
          detallesHtml += `<tr><td><strong>${descripcion}:</strong> ${celda.innerHTML}</td></tr>`;
        });
        detallesHtml += '</table></td></tr>';
        fila.insertAdjacentHTML('afterend', detallesHtml);
      }
    }

    const soporteContainer = document.createElement('div');
    soporteContainer.innerHTML = `
    <h4 class="text-center">Fichas de Soportes Pendientes</h4>
      <div class="table-responsive">
        <table class="table table-striped" id="tablaSoporte">
          <thead>
            <tr>
              <th class="text-center">ID</th>
              <th class="text-center">Cliente</th>
              <th class="text-center d-none d-md-table-cell">Servicio</th>
              <th class="text-center d-none d-md-table-cell" data-descripcion="Fecha">Fecha</th>
              <th class="text-center d-none d-md-table-cell" data-descripcion="N° Teléfono">N° Teléfono</th>
              <th class="text-center d-none d-md-table-cell" data-descripcion="Problema">Problema</th>
              <th class="text-center">Prioridad</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody id="tbodySoporte"></tbody>
        </table>
      </div>
    `;
    contenido.appendChild(soporteContainer);

    const tbodySoporte = document.getElementById("tbodySoporte");
    try {
      const response = await fetch(`${config.HOST}app/controllers/Sticket.controllers.php?operacion=listarAveriasPendientes`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      tbodySoporte.innerHTML = '';

      data.forEach(soporte => {
        let rowClass = '';
        if (soporte.prioridad === 'Alta') {
          rowClass = 'bg-danger';
        } else if (soporte.prioridad === 'Media') {
          rowClass = 'bg-warning';
        } else if (soporte.prioridad === 'Baja') {
          rowClass = 'bg-success';
        }

        const row = `
            <tr class="soporte-row" data-id_soporte="${soporte.id_soporte}" data-coordenada="${soporte.coordenada}" data-nrodocumento="${soporte.nrodocumento}" data-tipo_servicio="${soporte.tipo_servicio}">
                <td class="text-center">${soporte.id_soporte}</td>
                <td class="text-center">${soporte.nombre_cliente}</td>
                <td class="text-center d-none d-md-table-cell" data-descripcion="Servicio">${soporte.tipo_servicio}</td>
                <td class="text-center d-none d-md-table-cell" data-descripcion="Fecha">${soporte.fecha_creacion}</td>
                <td class="text-center d-none d-md-table-cell" data-descripcion="N° Teléfono">${soporte.telefono}</td>
                <td class="text-center d-none d-md-table-cell" data-descripcion="Problema">${soporte.descripcion_problema}</td>
                <td class="${rowClass} text-center">${soporte.prioridad}</td>
                <td class="text-center">
                    <div class="d-flex justify-content-center">
                        <button class="btnMapa btn btn-dark me-2" data-id="${soporte.id_soporte}" data-tipo="soporte" data-bs-toggle="modal" data-bs-target="#ModalMapa" style="font-size: 1rem; padding: 0.375rem 0.75rem;">
                            <i class="fa-solid fa-location-dot"></i>
                        </button>
                        <button type="button" class="btn btn-primary atender-soporte" style="font-size: 1rem; padding: 0.375rem 0.75rem;">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </div>
                </td>
            </tr>
            `;
        tbodySoporte.innerHTML += row;
      });

      const table = $('#tablaSoporte').DataTable({
        destroy: true,
        columnDefs: [
          { targets: 0, visible: false }
        ],
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
        },
        ordering: false
      });

      $('#tablaSoporte tbody').on('click', 'tr.soporte-row', function () {
        alternarDetalles(this);
      });

      $('#tablaSoporte tbody').on('click', '.atender-soporte', async function () {
        const row = $(this).closest('tr');
        const idSoporte = row.data('id_soporte');
        const coordenada = row.data('coordenada');
        const nrodocumento = row.data('nrodocumento');
        const tipoServicio = row.data('tipo_servicio');

        mostrarFichaServicio(tipoServicio, idSoporte, nrodocumento, coordenada);
      });

    } catch (error) {
      console.error('Error fetching soporte data:', error);
      tbodySoporte.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">Error cargando datos: ${error.message}</td>
            </tr>
        `;
    }

    function mostrarFichaServicio(tipoServicio, id_soporte, nrodocumento, coordenada) {
      window.location.href = `${config.HOST}views/Soporte/Soporte${tipoServicio}?idsoporte=${id_soporte}&doc=${nrodocumento}&tiposervicio=${tipoServicio}&coordenada=${coordenada}`;
    }
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

          return json;
        }
      },
      columns: [
        { data: 'id_contrato' },
        { data: 'nombre_cliente' },
        { data: 'direccion_servicio' },
        { data: 'paquete' },
        { data: 'tipos_servicio' }
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
    `;
    let tablaKardex = null;

    const response = await fetch(`${config.HOST}app/controllers/Kardex.ssp.php`);
    const data = await response.json();

    const tbody = document.querySelector("#tablaKardex tbody");
    tbody.innerHTML = data.data.map(element => `
      <tr>
        <td class="text-center">${element[0]}</td>
        <td class="text-center">${element[6]}</td>
        <td class="text-center">${element[4]}</td>
        <td class="text-center">${element[3]}</td>
        <td class="text-center">${element[10]}</td>
        <td class="text-center">${element[7]}</td>
        <td class="text-center">
          <button class="btn btn-primary btn-detalle" data-id="${element[0]}"><i class="fa-regular fa-clipboard"></i></button>
        </td>
      </tr>`).join('');

    tablaKardex = $('#tablaKardex').DataTable({
      order: [[0, 'desc']],
      columnDefs: [{ targets: 0, visible: false }],
      language: { url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json" }
    });

    document.querySelectorAll('.btn-detalle').forEach(button => {
      button.addEventListener('click', (event) => {
        const id = event.currentTarget.getAttribute('data-id');
        // Buscar el registro en data.data (array de arrays)
        const row = data.data.find(element => element[0] == id);
        if (!row) return;

        // Asignar valores a los campos del modal solo si existen
        const idElem = document.getElementById('detalleIdKardex');
        if (idElem) idElem.innerText = row[0];

        const usuarioElem = document.getElementById('detalleUsuario');
        if (usuarioElem) usuarioElem.innerText = row[1] || '';

        const fechaElem = document.getElementById('detalleFecha');
        if (fechaElem) fechaElem.innerText = row[6] || '';

        const marcaElem = document.getElementById('detalleMarca');
        if (marcaElem) marcaElem.innerText = row[4] || '';

        const tipoElem = document.getElementById('detalleTipo');
        if (tipoElem) tipoElem.innerText = row[3] || '';

        const saldoElem = document.getElementById('detalleSaldo');
        if (saldoElem) saldoElem.innerText = row[10] || '';

        const tipoMovElem = document.getElementById('detalleTipoMovimiento');
        if (tipoMovElem) tipoMovElem.innerText = row[8] || '';

        const motivoElem = document.getElementById('detalleMotivo');
        if (motivoElem) motivoElem.innerText = row[7] || '';

        const modalElem = document.getElementById('detalleModalKardex');
        if (modalElem) {
          new bootstrap.Modal(modalElem).show();
        }
      });
    });
  }

  async function cargarFichas() {
    await cargarSoporte();

    function alternarDetalles(fila) {
      if (window.innerWidth >= 768) {
        return;
      }

      const siguienteFila = fila.nextElementSibling;
      if (siguienteFila && siguienteFila.classList.contains('fila-detalles')) {
        siguienteFila.remove();
      } else {
        const celdasOcultas = fila.querySelectorAll('.d-none.d-md-table-cell');
        let detallesHtml = '<tr class="fila-detalles"><td colspan="8"><table class="table table-striped">';
        celdasOcultas.forEach(celda => {
          const descripcion = celda.getAttribute('data-descripcion');
          detallesHtml += `<tr><td><strong>${descripcion}:</strong> ${celda.innerHTML}</td></tr>`;
        });
        detallesHtml += '</table></td></tr>';
        fila.insertAdjacentHTML('afterend', detallesHtml);
      }
    }

    const fichasContainer = document.createElement('div');
    fichasContainer.innerHTML = `
    <hr>
    <h4 class="text-center">Fichas de Contratos Pendientes</h4>
    <div class="table-responsive">
      <table class="table table-striped" id="tablaFichaContrato">
      <thead>
        <tr>
          <th class="text-center">ID</th>
          <th class="text-center">Cliente</th>
          <th class="text-center d-none d-md-table-cell" data-descripcion="Servicio">Servicio</th>
          <th class="text-center d-none d-md-table-cell" data-descripcion="Paquete">Paquete</th>
          <th class="text-center" data-descripcion="N° Telefono">N° Telefono</th>
          <th class="text-center d-none d-md-table-cell" data-descripcion="Direccion">Direccion</th>
          <th class="text-center d-none d-md-table-cell" data-descripcion="Referencia">Referencia</th>
          <th class="text-center d-none d-md-table-cell" data-descripcion="Nota">Nota</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody id="tbodyFichaContrato">
      </tbody>
    </table>
    </div>
    `;
    contenido.appendChild(fichasContainer);

    const tbodyFichaContrato = document.getElementById("tbodyFichaContrato");
    try {
      const response = await fetch(`${config.HOST}app/controllers/Contrato.ssp.php?vista=listarContratoPendiente`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      console.log(data);

      tbodyFichaContrato.innerHTML = '';

      let html = '';

      data.data.forEach(contrato => {
        console.log(contrato);
        const nota = contrato[8] ? contrato[8].trim() !== "" ? contrato[8] : 'Sin observaciones' : 'Sin observaciones';
        const Referencia = contrato[7] ? contrato[7].trim() !== "" ? contrato[7] : 'Sin referencia' : 'Sin referencia';
        html += `
          <tr class="ficha-row" data-id_contrato="${contrato[0]}" data-tipo_servicio="${contrato[1]}">
            <td class="text-center">${contrato[0]}</td>
            <td class="text-center">${contrato[2]}</td>
            <td class="text-center d-none d-md-table-cell" data-descripcion="Servicio">${contrato[3]}</td>
            <td class="text-center d-none d-md-table-cell" data-descripcion="Paquete">${contrato[4]}</td>
            <td class="text-center" data-descripcion="N° Telefono">${contrato[5]}</td>
            <td class="text-center d-none d-md-table-cell" data-descripcion="Direccion">${contrato[6]}</td>
            <td class="text-center d-none d-md-table-cell" data-descripcion="Referencia">${Referencia}</td>
            <td class="text-center d-none d-md-table-cell" data-descripcion="Nota">${nota}</td>
            <td class="text-center">
              <div class="d-flex justify-content-center">
                <button class="btnMapa btn btn-dark me-2" data-id="${contrato[0]}" data-tipo="ficha" data-bs-toggle="modal" data-bs-target="#ModalMapa">
                  <i class="fa-solid fa-location-dot"></i>
                </button>
                <button type="button" class="btn btn-primary btn-sm atender-contrato">
                  <i class="fa-solid fa-pen"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      });

      // Inserta todas las filas de golpe
      tbodyFichaContrato.innerHTML = html;

      const table = $('#tablaFichaContrato').DataTable({
        destroy: true,
        columnDefs: [
          { targets: 0, visible: false }
        ],
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
        },
        ordering: false
      });

      $('#tablaFichaContrato tbody').on('click', 'tr.ficha-row', function () {
        alternarDetalles(this);
      });

      $('#tablaFichaContrato tbody').on('click', '.atender-contrato', async function () {
        const row = $(this).closest('tr');
        const idContrato = row.data('id_contrato');
        const tipoServicio = row.data('tipo_servicio');

        const tipoFicha = {
          "FIBR, CABL": "FichaTecnicaGpon",
          "CABL, FIBR": "FichaTecnicaGpon",
          WISP: "FichaTecnicaWisp",
          CABL: "FichaTecnicaCable",
          FIBR: "FichaTecnicaFibra",
        };

        window.location.href = `${config.HOST}views/Contratos/${tipoFicha[tipoServicio]}?idContrato=${idContrato}`;
      });

    } catch (error) {
      console.error('Error fetching ficha data:', error);
      tbodyFichaContrato.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">Error cargando datos: ${error.message}</td>
            </tr>
        `;
    }
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


  mapa.emitter.on('funcionEjecutada', (data) => {
    labelSector.textContent = mapa.nombreSector;
  });
});