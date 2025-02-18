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

export async function FichaInstalacion(Value) {
  const response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=obtenerfichaInstalacionporIdSoporte&idSoporte=${Value}`);
  const data = await response.json()
  return data
}

export async function FichaSoporteporDocServCoordenada(nrodoc, tipoServicio, coordenada) {
  const response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php`, {
    method: 'POST',
    body: JSON.stringify({
      operacion: 'buscarUltimoSoportebyDNI',
      nrodoc: nrodoc,
      tipoServicio: tipoServicio.toUpperCase(),
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

export async function validarValorRango(event) {
  const elemento = event.target;
  const min = parseFloat(elemento.min);
  const max = parseFloat(elemento.max);
  const mensaje = `${elemento.placeholder} debe estar entre ${min} y ${max}.`;
  const invalidFeedback = elemento.nextElementSibling;

  if (parseFloat(elemento.value) < min || parseFloat(elemento.value) > max) {
    elemento.classList.add("is-invalid");
    invalidFeedback.textContent = mensaje;
    invalidFeedback.style.display = "block";
  } else {
    elemento.classList.remove("is-invalid");
    invalidFeedback.style.display = "none";
  }
}


export async function CompletarSoporte(idSoporte) {
  let login = await obtenerLogin();
  try {
    const response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operacion: 'completarSoportebyId',
        data: {
          idSoporte: idSoporte,
          idUserUpdate: login.idUsuario,
        },
      }),
    });
    const result = await response.json();
    return result
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}

export async function obtenerLogin() {
  const response = await fetch(`${config.HOST}app/controllers/Usuario.controllers.php?operacion=obtenerLogin`);
  const data = await response.json();
  return data
}

export class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}