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

  // Evento de Atender Contrato
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

    try {
      const response = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerFichaInstalacion&id=${idContrato}`);
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      const fichaInstalacion = JSON.parse(data[0].ficha_instalacion);

      if (fichaInstalacion && Object.keys(fichaInstalacion).length > 0) {
        if (tipoServicio === "WISP") {
          window.open(`${config.HOST}views/reports/Contrato_WISP/fichaInstalacion.php?id=${idContrato}`, '_blank');
        } else if (tipoServicio === "FIBR,CABL" || tipoServicio === "CABL,FIBR") {
          window.open(`${config.HOST}views/reports/Contrato_GPON/fichaInstalacion.php?id=${idContrato}`, '_blank');
        } else if (tipoServicio === "CABL") {
          window.open(`${config.HOST}views/reports/Contrato_CABLE/fichaInstalacion.php?id=${idContrato}`, '_blank');
        } else if (tipoServicio === "FIBR") {
          window.open(`${config.HOST}views/reports/Contrato_FIBRA/fichaInstalacion.php?id=${idContrato}`, '_blank');
        }
      } else {
        window.location.href = `${config.HOST}views/Contratos/${tipoFicha[tipoServicio]}?idContrato=${idContrato}`;
      }
    } catch (error) {
      console.error("Error al obtener el JSON de la ficha de instalación:", error);
    }
  });

  $("#tblSticketsAverias tbody").on("click", ".atender-averia", async function () {
    const data = $("#tblSticketsAverias").DataTable().row($(this).parents("tr")).data();
    console.log("Datos de la avería:", data);

    const idSoporte = data.id_soporte;
    const coordenada = data.coordenada;

    try {
      const response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=obtenerServiciosId&idservicio=${idSoporte}`);
      const servicios = await response.json();
      await recorrerIdServicio(servicios, coordenada, idSoporte);
    } catch (error) {
      console.error("Error al obtener el JSON de la ficha de avería:", error);
    }
  });

  // Función para recorrer los ID de los servicios
  async function recorrerIdServicio(data, coordenada, idSoporte) {
    console.log(data);

    // Asegurarnos de que 'data' contiene al menos un objeto y que tiene la propiedad 'id_servicio'
    if (Array.isArray(data) && data.length > 0 && data[0].id_servicio) {
      const id_servicio = data[0].id_servicio; // Obtenemos el id_servicio del primer objeto
      console.log("ID del servicio:", id_servicio);

      // Realizamos la llamada a la API para obtener los detalles del servicio
      try {
        const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=obtenerServiciosId&idservicio=${id_servicio}`);
        const nombres = await respuesta.json();
        console.log(nombres);

        // Verificamos si la respuesta contiene la propiedad 'tipo_servicio'
        if (nombres && nombres.length > 0 && nombres[0].tipo_servicio) {
          // Si la respuesta es válida, mostramos la ficha del servicio
          mostrarFichaServicio(nombres[0].tipo_servicio, idSoporte, coordenada);
        } else {
          console.error("La respuesta de los servicios no contiene 'tipo_servicio'.");
        }
      } catch (error) {
        console.error("Error al obtener los detalles del servicio:", error);
      }
    } else {
      console.error("No se encontraron servicios válidos en los datos.");
    }
  }

  function mostrarFichaServicio(tipoServicio, id_soporte, nro_doc, coordenada) {
    // Redirigir al usuario a la página correspondiente
    window.location.href = `${config.HOST}views/Soporte/Soporte${tipoServicio}?idsoporte=${id_soporte}&doc=${nro_doc}&tiposervicio=${tipoServicio}&coordenada=${coordenada}`;
  }

});