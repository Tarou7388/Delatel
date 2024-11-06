import config from "../env.js";
import { inicializarDataTable } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  let ruta = `${config.HOST}app/controllers/Soporte.controllers.php?operacion=FiltrarSoportePrioridad&prioridad=`;

  const Prioridad = document.querySelector("#slcPrioridad");

  // Función para obtener el valor de periodo (ahora será texto)
  function obtenerPeriodo() {
    const periodoSelect = document.querySelector("#slcCambiosPeriodoCable");
    return periodoSelect ? periodoSelect.value : "";
  }

  async function obtenerDataSoporte(idsoport) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idsoport}`);
    const data = await respuesta.json();
    console.log(data);
    return data;
  }

  async function abrirModal(idsoport) {
    try {
      // Obtener los datos de soporte
      const soporteData = await obtenerDataSoporte(idsoport);

      // Validar la respuesta
      if (!soporteData || !soporteData[0] || !soporteData[0].soporte) {
        console.error("Datos de soporte no encontrados o JSON inválido");
        return;
      }

      let soporteJson = soporteData[0].soporte;

      // Parsear si es una cadena JSON
      if (typeof soporteJson === "string") {
        soporteJson = JSON.parse(soporteJson);
      }

      // Obtener el tipo de servicio y seleccionar el modal correspondiente
      const tipoServicio = soporteData[0].tipo_servicio;
      const { modalID, parametrosList, cambiosList } = obtenerModal(tipoServicio);

      // Limpiar los contenidos
      if (parametrosList) parametrosList.innerHTML = "";
      if (cambiosList) cambiosList.innerHTML = "";

      // Obtener el valor del periodo
      const periodo = obtenerPeriodo(); // Obtener el valor como texto
      console.log("Valor de periodo:", periodo);

      // Procesar y formatear los datos
      const parametrosHTML = procesarDatos(soporteJson, 'parametros', tipoServicio);
      const cambiosHTML = procesarDatos(soporteJson, 'cambios', tipoServicio);

      // Insertar los contenidos en el modal
      if (parametrosList) parametrosList.innerHTML = parametrosHTML;
      if (cambiosList) cambiosList.innerHTML = cambiosHTML;

      // Mostrar el modal
      $(modalID).modal("show");

    } catch (error) {
      console.error("Error al abrir el modal:", error);
    }
  }

  // Función para obtener el modal y listas de parámetros y cambios
  function obtenerModal(tipoServicio) {
    let modalID = "";
    let parametrosList, cambiosList;

    switch (tipoServicio) {
      case "WISP":
        modalID = "#editModalWISP";
        parametrosList = document.querySelector(`${modalID} #parametrosList`);
        cambiosList = document.querySelector(`${modalID} #cambiosList`);
        break;
      case "GPON":
      case "FIBR": // Agregado caso para "FIBR" que es lo que se refiere a fibra
        modalID = "#editModalGPON";
        parametrosList = document.querySelector(`${modalID} #parametrosList`);
        cambiosList = document.querySelector(`${modalID} #cambiosList`);
        break;
      case "CABL":
        modalID = "#editModalCABLE";
        parametrosList = document.querySelector("#parametrosListCable");
        cambiosList = document.querySelector("#cambiosListCable");
        break;
      default:
        modalID = "#editModalWISP";
        parametrosList = document.querySelector(`${modalID} #parametrosList`);
        cambiosList = document.querySelector(`${modalID} #cambiosList`);
        break;
    }

    return { modalID, parametrosList, cambiosList };
  }

  // Función para procesar los datos y generar el HTML
  function procesarDatos(soporteJson, campo, tipoServicio) {
    let data;

    // Si el tipo de servicio es "CABL" (cable), usamos los campos "parametroscable" y "cambioscable"
    if (tipoServicio === "CABL") {
      data = soporteJson[`${campo}cable`];  // En el caso de "cable"
    }
    // Si el tipo de servicio es "GPON" o "FIBR", usamos los campos correspondientes "parametrosgpon" y "cambiosgpon"
    else if (tipoServicio === "FIBR" || tipoServicio === "GPON") {
      data = soporteJson[`${campo}gpon`];  // En el caso de "gpon"
    } else {
      data = soporteJson[campo];  // Para otros casos
    }

    let html = "";

    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        html += `<li><strong>${formatearClave(key)}:</strong> ${formatValue(value)}</li>`;
      });
    }

    return html;
  }

  // Función para formatear la clave de la lista de parámetros
  function formatearClave(key) {
    // Devolver la clave formateada (con espacios y mayúsculas adecuadas)
    return key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase());
  }

  // Función para formatear los valores de manera más legible
  function formatValue(value) {
    if (typeof value === "object" && !Array.isArray(value)) {
      // Si es un objeto, recorrer sus claves y valores
      return Object.entries(value)
        .map(([key, val]) => `<strong>${formatearClave(key)}:</strong> ${formatValue(val)}`)
        .join('<br>');
    } else if (Array.isArray(value)) {
      // Si es un array, recorrer sus elementos
      return value
        .map(v => (typeof v === "object" ? formatValue(v) : v))
        .join('<br>');
    } else {
      // Si es un valor simple, mostrarlo directamente
      return value;
    }
  }

  const table = inicializarDataTable(
    "#tblSoporteIncompleto",
    ruta,
    [
      { data: "prioridad", title: "Prioridad", className: "text-center" },
      { data: "tipo_soporte", title: "Tipo de Soporte", className: "text-center" },
      { data: "nombre_cliente", title: "Nombre del Cliente", className: "text-center" },
      { data: "nombre_tecnico", title: "Técnico a Cargo", className: "text-center" },
      {
        data: null,
        title: "Acciones",
        className: "text-center",
        render: function (data, type, row) {
          return `<button class="btnActualizar btn btn-primary" data-id="${row.id_soporte}">Mostrar info</button>`;
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
    console.log("Se ha hecho clic en Editar con ID de soporte:", id_soporte); // Aquí se agrega el console.log
    abrirModal(id_soporte);
  });

  var today = new Date().toISOString().split('T')[0];
  document.getElementById('txtFecha').value = today;

  Prioridad.addEventListener("change", async (event) => {
    ruta = `${config.HOST}app/controllers/Soporte.controllers.php?operacion=FiltrarSoportePrioridad&prioridad=` + Prioridad.value;
    table.ajax.url(ruta).load();
  });
});
