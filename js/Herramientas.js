import config from "../env.js";
export function inicializarDataTable(selector, ajaxUrl, columns, columnDefs) {
  return $(selector).DataTable({
    responsive: true,
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
    },
    ajax: {
      url: ajaxUrl,
      dataSrc: ''
    },
    columns: columns,
    columnDefs: columnDefs
  });
}

export async function permisos() {
  const response = await fetch(`${config.HOST}app/controllers/Usuario.controllers.php?operacion=obtenerPermisos`);
  const data = await response.json()
  return data
}

export async function FichaSoporte(Value) {
  const response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=obtenerfichaSoporteporDoc&nroDoc=${Value}`);
  const data = await response.json()
  return data
}

export async function FichaSoportePorId(nrodoc, tipoServicio, coordenada) {
  const response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php`, {
    method: 'POST',
    body: JSON.stringify({
      operacion: 'buscarUltimoSoportebyDNI',
      nrodoc: nrodoc,
      tipoServicio: tipoServicio,
      coordenada: coordenada
    })
  });
  const data = await response.json()
  return data
}


/**
 * Formatea la entrada de un campo de texto para que tenga el formato de una dirección IP.
 * 
 * @async
 * @function formatoIPinput
 * @param {Event} event - El evento de entrada del campo de texto.
 * 
 * @description
 * Esta función toma el valor del campo de texto del evento, elimina todos los caracteres que no sean números o puntos,
 * y luego formatea el valor para que tenga el formato de una dirección IP. Se asegura de que no haya más de tres números
 * entre cada punto y que no haya más de tres puntos en total. Si el valor formateado excede los 15 caracteres, se trunca.
 */
export async function formatoIPinput(event) {
  let input = event.target.value.replace(/[^0-9.]/g, '');
  let pointCount = (input.match(/\./g) || []).length;
  if (pointCount > 3) {
    input = input.split('.').slice(0, 4).join('.');
  }

  let formattedInput = '';
  let count = 0;

  for (let i = 0; i < input.length; i++) {
    if (input[i] !== '.') {
      formattedInput += input[i];
      count++;

      if (count === 3 && i < input.length - 1 && input[i + 1] !== '.') {
        formattedInput += '.';
        count = 0;
      }
    } else {
      if (formattedInput[formattedInput.length - 1] !== '.') {
        formattedInput += '.';
        count = 0;
      }
    }
  }
  event.target.value = formattedInput.slice(0, 15);
}

