import config from "../env.js";
import * as mapa from "./Mapa.js";
window.addEventListener("DOMContentLoaded", function () {
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
    <div id="map" style="height: 700px;"></div>
    `;
    const params = { cajas: true, mufas: true }
    const id = "map"
    const renderizado = "pagina"
    await mapa.iniciarMapa(params, id, renderizado);
  }

  async function cargarSoporte() {
    contenido.innerHTML = `
      <table class="table table-striped" id="tablaSoporte">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha Asistencia</th>
            <th>Tipo Soporte</th>
            <th>Direccion</th>
            <th>Prioridad</th>
          </tr>
        </thead>
        <tbody id="tbodySoporte">
        </tbody>
      </table>
      `
    const tbodySoporte = document.getElementById("tbodySoporte");
    const response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=FiltrarSoportePrioridad`);
    const data = await response.json();
    console.log(data);
    data.forEach(soporte => {
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
            <td>${soporte.id_soporte}</td>
            <td>${soporte.fecha_hora_asistencia}</td>
            <td>${soporte.tipo_soporte}</td>
            <td>${soporte.direccion_servicio}</td>
            <td class="${rowClass}">${soporte.prioridad}</td>
          </tr>
        `;
    });
    $('#tablaSoporte').DataTable({
      columnDefs: [
        { targets: [], visible: true } // Asegurarse de que todas las columnas sean visibles
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
      processing: true,
      serverSide: true,
      ajax: {
        url: `${config.HOST}app/controllers/Contrato.controllers.php?operacion=listarContratos`,
        type: 'GET',
        dataSrc: 'data'
      },
      columns: [
        { data: 'id_contrato' },
        { data: 'nombre_cliente' },
        { data: 'direccion_servicio' },
        { data: 'paquete' },
        { data: 'tipo_servicio' }
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
    // Crear la tabla en el DOM
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
    // Variable global
    let tablaKardex = null;

    // Renderizar la tabla
    function renderDataTable() {
      tablaKardex = new DataTable("#tablaKardex", {
        order: [[0, 'desc']],
        columnDefs: [{ targets: 0, visible: false }],
        language: { url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json" }
      });
    }

    const response = await fetch(`${config.HOST}app/controllers/Kardex.controllers.php?operacion=listarKardex`);
    const data = await response.json();

    // Reiniciando contenido
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

    // Agregar eventos a los botones
    document.querySelectorAll('.btn-detalle').forEach(button => {
      button.addEventListener('click', (event) => {
        const id = event.currentTarget.getAttribute('data-id');
        const kardex = data.find(element => element.id_kardex == id);
        console.log(kardex); // Verifica los detalles del kardex

        // Llenar el modal con los detalles del kardex
        document.getElementById('detalleIdKardex').innerText = kardex.id_kardex;
        document.getElementById('detalleUsuario').innerText = kardex.creado_por;
        document.getElementById('detalleFecha').innerText = kardex.fecha;
        document.getElementById('detalleMarca').innerText = kardex.nombre_marca;
        document.getElementById('detalleTipo').innerText = kardex.tipo_producto;
        document.getElementById('detalleSaldo').innerText = kardex.saldo_total;
        document.getElementById('detalleTipoMovimiento').innerText = kardex.tipo_movimiento;
        document.getElementById('detalleMotivo').innerText = kardex.tipo_operacion;

        // Mostrar el modal
        new bootstrap.Modal(document.getElementById('detalleModalKardex')).show();
      });
    });
  }

  async function cargarFichas() {
    await cargarSoporte();

    contenido.innerHTML += `
    <div>
      <table class="table table-striped" id="tablaFichaContrato">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre Cliente</th>
          <th>Direccion</th>
          <th>Paquete</th>
          <th>Servicio</th>
        </tr>
      </thead>
      <tbody id="tbodyFichaContrato">
      </tbody>
    </table>
    </div>
    `

    const tbodyFichaContrato = document.getElementById("tbodyFichaContrato");
    const responseFichaContrato = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=listarContratos`);
    const dataFichaContrato = await responseFichaContrato.json();
    dataFichaContrato.forEach(contrato => {
      tbodyFichaContrato.innerHTML += `
        <tr>
          <td>${contrato.id_contrato}</td>
          <td>${contrato.nombre_cliente}</td>
          <td>${contrato.direccion_servicio}</td>
          <td>${contrato.paquete}</td>
          <td>${contrato.servicio}</td>
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
    // Crear la tabla en el DOM
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

    // Variables globales
    let table = null;

    //Renderizar la tabla
    function renderDataTable() {
      table = new DataTable("#tablaContactos", {
        order: [[0, 'desc']],
        columnDefs: [{ targets: 0, visible: false }],
        language: { url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json" }
      });
    }

    const response = await fetch(`${config.HOST}app/controllers/Contactabilidad.controllers.php?operacion=obtenerContactos`);
    const data = await response.json();

    // Reiniciando contenido
    const tbody = document.querySelector("#tablaContactos tbody");
    tbody.innerHTML = data.map(element => `
      <tr>
        <td class="text-center">${element.id_contactabilidad}</td>
        <td class="text-center">${element.nombre_contacto}</td>
        <td class="text-center">${element.telefono}</td>
        <td class="text-center">${element.direccion_servicio}</td>
        <td class="text-center">${element.nota}</td>
        <td>
          <button class="btn btn-primary btn-detalle" data-id="${element.id_contactabilidad}"><i class="fa-regular fa-clipboard"></i></button>
          <button class="btn btn-success btn-whatsapp" data-telefono="${element.telefono}" data-nombre="${element.nombre_contacto}"><i class="fa-brands fa-whatsapp"></i></button>
        </td>
      </tr>`).join('');

    renderDataTable();

    // Agregar eventos a los botones
    document.querySelectorAll('.btn-detalle').forEach(button => {
      button.addEventListener('click', (event) => {
        const id = event.currentTarget.getAttribute('data-id');
        const contacto = data.find(element => element.id_contactabilidad == id);

        // Llenar el modal con los detalles del contacto
        document.getElementById('detalleId').innerText = contacto.id_contactabilidad;
        document.getElementById('detalleNombre').innerText = contacto.nombre_contacto;
        document.getElementById('detalleEmail').innerText = contacto.email;
        document.getElementById('detalleDireccion').innerText = contacto.direccion_servicio;
        document.getElementById('detalleFechaLimite').innerText = contacto.fecha_limite;
        document.getElementById('detalleFechaCreacion').innerText = contacto.fecha_hora_contacto;
        document.getElementById('detallePaquete').innerHTML = contacto.paquete;
        document.getElementById('detallePrecio').innerText = contacto.precio;
        document.getElementById('detalleNota').innerText = contacto.nota;
        document.getElementById('detalleUsuarioCreador').innerText = contacto.usuario_creador;

        // Mostrar el modal
        new bootstrap.Modal(document.getElementById('detalleModal')).show();
      });
    });

    // Define la nueva función whatsapp
    window.whatsapp = function (telefono, nombre) {
      const telefonoFormateado = `51${telefono.replace(/\D/g, '')}`;
      const mensaje = `Hola ${nombre}, Estoy creando pruebas para la empresa delatel sobre contactos por WhatsApp.`;
      const url = `https://api.whatsapp.com/send?phone=${telefonoFormateado}&text=${encodeURIComponent(mensaje)}`;

      console.log("Teléfono formateado:", telefonoFormateado);
      console.log("Mensaje:", mensaje);
      console.log("URL:", url);

      window.open(url, '_blank');
    }

    // Modifica el evento de clic para llamar a la nueva función whatsapp
    document.querySelectorAll('.btn-whatsapp').forEach(button => {
      button.addEventListener('click', (event) => {
        const telefono = event.currentTarget.getAttribute('data-telefono');
        const nombre = event.currentTarget.getAttribute('data-nombre');
        window.whatsapp(telefono, nombre);
      });
    });
  }

});