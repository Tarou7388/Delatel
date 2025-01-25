import config from "../env.js";

document.addEventListener("DOMContentLoaded", async () => {
  const rutaContratos = `${config.HOST}app/controllers/Sticket.controllers.php?operacion=listarContratosPendientes`;
  const rutaAveria = `${config.HOST}app/controllers/Sticket.controllers.php?operacion=listarAveriasPendientes`;
  const rutaContarClientes = `${config.HOST}app/controllers/Sticket.controllers.php?operacion=contarClientes`;
  const rutaContarAverias = `${config.HOST}app/controllers/Sticket.controllers.php?operacion=contarAveriasPendientes`;
  const rutaContarContratos = `${config.HOST}app/controllers/Sticket.controllers.php?operacion=contarContratosPendientes`;

  // 
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
          console.log('Datos obtenidos para contratos:', json);
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
        { data: "tipos_servicio", className: "text-center" },
        { data: "nombre_sector", className: "text-center" },
        { data: "fecha_inicio", className: "text-center" },
        { data: "nombre_tecnico_registro", className: "text-center" },
        {
          data: "estado",
          className: "text-center",
          render: function (data, type, row) {
            return '<span class="badge bg-danger">PENDIENTE</span>';
          }
        },
        {
          data: null,
          className: "text-center",
          render: function (data, type, row) {
            return '<button type="button" class="btn btn-primary btn-sm atender-contrato">Atender</button>';
          }
        }
      ],
      paging: true,
      searching: true,
      info: true,
      lengthChange: false,
    });

    $("#tblSticketsAverias").DataTable({
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
      },
      ajax: {
        url: rutaAveria,
        type: "GET",
        dataSrc: function (json) {
          console.log('Datos obtenidos para soporte:', json);
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
        { data: "tipo_servicio", className: "text-center" }, 
        {
          data: "estado",
          className: "text-center",
          render: function (data, type, row) {
            return '<span class="badge bg-danger">PENDIENTE</span>';
          }
        },
        {
          data: null,
          className: "text-center",
          render: function (data, type, row) {
            return '<button type="button" class="btn btn-primary btn-sm atender-averia">Atender</button>';
          }
        }
      ],
      paging: true,
      searching: true,
      info: true,
      lengthChange: false,
    });
  });

  //
  $("#tblStickets tbody").on("click", ".atender-contrato", async function () {
    var data = $("#tblStickets").DataTable().row($(this).parents("tr")).data();
    console.log("Datos del contrato:", data);

    const idContrato = data.id_contrato;
    const tipoServicio = data.tipos_servicio;
    const tipoFicha = {
      "FIBR, CABL": "FichaTecnicaGpon",
      "CABL, FIBR": "FichaTecnicaGpon",
      WISP: "FichaTecnicaWisp",
      CABL: "FichaTecnicaCable",
      FIBR: "FichaTecnicaFibra",
    };

    
    window.location.href = `${config.HOST}views/Contratos/${tipoFicha[tipoServicio]}?idContrato=${idContrato}`;
  });

  
  $("#tblSticketsAverias tbody").on("click", ".atender-averia", async function () {
    const data = $("#tblSticketsAverias").DataTable().row($(this).parents("tr")).data();
    console.log("Datos de la avería:", data);

    const idSoporte = data.id_soporte;
    const coordenada = data.coordenada;
    const nrodocumento = data.nrodocumento;
    const tipoServicio = data.tipo_servicio;

    
    mostrarFichaServicio(tipoServicio, idSoporte, nrodocumento, coordenada);
  });

  function mostrarFichaServicio(tipoServicio, id_soporte, nrodocumento, coordenada) {
    
    window.location.href = `${config.HOST}views/Soporte/Soporte${tipoServicio}?idsoporte=${id_soporte}&doc=${nrodocumento}&tiposervicio=${tipoServicio}&coordenada=${coordenada}`;
  }

});