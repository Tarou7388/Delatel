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

export async function FichaSoportePorId(nrodoc,tipoServicio,coordenada) {
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
* Formatea la entrada de un campo de texto para que se asemeje a una dirección IP.
* 
* Esta función se utiliza como un manejador de eventos para el evento 'input' de un campo de texto.
* Su propósito es restringir la entrada del usuario para que solo contenga números y puntos ('.'),
* y formatear la cadena de entrada de manera que se agreguen puntos cada tres dígitos.
* Además, limita la longitud de la entrada a un máximo de 15 caracteres.
* 
* Ejemplo de uso:
* 
* <input type="text" oninput="formatoIPinput(event)">
* 
* @param {Event} event - El evento de entrada que contiene el valor del campo de texto.
*/
export async function formatoIPinput(event) {
  let input = event.target.value.replace(/[^0-9.]/g, ''); // Solo números y puntos

  let formattedInput = '';
  let count = 0;

  for (let i = 0; i < input.length; i++) {
    if (input[i] !== '.') {
      formattedInput += input[i];
      count++;

      if (count % 3 === 0 && i < input.length - 1 && input[i + 1] !== '.') {
        formattedInput += '.';
      }
    } else {
      if (formattedInput[formattedInput.length - 1] !== '.') {
        formattedInput += '.';
      }
      count = 0;
    }
  }

  event.target.value = formattedInput.slice(0, 15);
};