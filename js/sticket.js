import config from "../env.js";

document.addEventListener("DOMContentLoaded", () => {
  const rutaContratos = `${config.HOST}app/controllers/Sticket.controllers.php?operacion=listarContratosPendientes`;
  const rutaAveria = `${config.HOST}app/controllers/Sticket.controllers.php?operacion=listarAveriasPendientes`;
  const rutaContarClientes = `${config.HOST}app/controllers/Sticket.controllers.php?operacion=contarClientes`;
  const rutaContarAverias = `${config.HOST}app/controllers/Sticket.controllers.php?operacion=contarAveriasPendientes`;
  const rutaContarContratos = `${config.HOST}app/controllers/Sticket.controllers.php?operacion=contarContratosPendientes`;

  // Solicitud AJAX para obtener el número de clientes
  $.ajax({
    url: rutaContarClientes,
    type: "GET",
    success: function (response) {
      const totalClientes = JSON.parse(response)[0].total_clientes_con_ficha_llena;
      const clientesOnlineElement = document.querySelector("#clientes-online");
      const totalRegistradosElement = document.querySelector("#total-registrados");
      if (clientesOnlineElement) {
        clientesOnlineElement.textContent = totalClientes;
      }
      if (totalRegistradosElement) {
        totalRegistradosElement.textContent = `Total Registrados: ${totalClientes}`;
      }
    },
    error: function (xhr, error, thrown) {
      console.error('Error al obtener el número de clientes:', error, thrown);
      alert('Error al obtener el número de clientes. Por favor, revisa la consola para más detalles.');
    }
  });

  // Solicitud AJAX para obtener los contratos pendientes
  $.ajax({
    url: rutaContarContratos,
    type: "GET",
    success: function (response) {
      const totalContratos = JSON.parse(response)[0].total_contratos_ficha_vacia;
      const contratosPendientesElement = document.querySelector("#contratos-pendientes");
      const totalSoportesElement = document.querySelector("#total-soportes");
      if (contratosPendientesElement) {
        contratosPendientesElement.textContent = totalContratos;
      }
      if (totalSoportesElement) {
        totalSoportesElement.textContent = `Total Contratos: ${totalContratos}`;
      }
    },
    error: function (xhr, error, thrown) {
      console.error('Error al obtener el número de contratos:', error, thrown);
      alert('Error al obtener el número de contratos. Por favor, revisa la consola para más detalles.');
    }
  });

  // Solicitud AJAX para obtener los Soportes Pendientes
  $.ajax({
    url: rutaContarAverias,
    type: "GET",
    success: function (response) {
      const totalAverias = JSON.parse(response)[0].total_averias_ficha_vacia;
      const soportesPendientesElement = document.querySelector("#soportes-pendientes");
      const totalSoportesElement = document.querySelector("#total-soportes");
      if (soportesPendientesElement) {
        soportesPendientesElement.textContent = totalAverias;
      }
      if (totalSoportesElement) {
        totalSoportesElement.textContent = `Total Soportes: ${totalAverias}`;
      }
    },
    error: function (xhr, error, thrown) {
      console.error('Error al obtener el número de soportes:', error, thrown);
      alert('Error al obtener el número de soportes. Por favor, revisa la consola para más detalles.');
    }
  });

  $(document).ready(function () {
    $("#tblStickets").DataTable({
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
      },
      ajax: {
        url: rutaContratos,
        type: "GET",
        dataSrc: function (json) {
          json.forEach(item => {
            item.estado = 'PENDIENTE';
          });
          return json;
        },
        error: function (xhr, error, thrown) {
          console.error('Error en la carga de datos:', error, thrown);
          alert('Error al cargar los datos. Por favor, revisa la consola para más detalles.');
        }
      },
      columns: [
        { data: "id_contrato", className: "text-center" },
        { data: "nombre_cliente", className: "text-center" },
        { data: "nombre_paquete", className: "text-center" },
        { data: "nombre_sector", className: "text-center" },
        { data: "fecha_inicio", className: "text-center" },
        { data: "nombre_tecnico_registro", className: "text-center" },
        {
          data: "estado",
          className: "text-center",
          render: function (data, type, row) {
            return '<span class="badge bg-danger">PENDIENTE</span>';
          }
        }
      ],
      paging: true,
      searching: true,
      info: true,
      lengthChange: false,
    });
  });

  $(document).ready(function () {
    $("#tblSticketsAverias").DataTable({
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
      },
      ajax: {
        url: rutaAveria,
        type: "GET",
        dataSrc: function (json) {
          json.forEach(item => {
            item.estado = 'PENDIENTE';
          });
          return json;
        },
        error: function (xhr, error, thrown) {
          console.error('Error en la carga de datos:', error, thrown);
          alert('Error al cargar los datos. Por favor, revisa la consola para más detalles.');
        }
      },
      columns: [
        { data: "id_soporte", className: "text-center" },
        {
          data: "soporte", className: "text-center",
          render: function (data, type, row) {
            return '<span class="badge bg-primary">SOPORTE TÉCNICO</span>';
          }
        },
        { data: "nombre_cliente", className: "text-center" },
        { data: "descripcion_problema", className: "text-center" },
        { data: "fecha_creacion", className: "text-center" },
        { data: "sector_cliente", className: "text-center" },
        {
          data: "estado",
          className: "text-center",
          render: function (data, type, row) {
            return '<span class="badge bg-danger">PENDIENTE</span>';
          }
        }
      ],
      paging: true,
      searching: true,
      info: true,
      lengthChange: false,
    });
  });

});