import config from '../env.js';

window.window.idContratoSeleccionado = null;

window.addEventListener('DOMContentLoaded', function () {
  const botonbuscar = document.querySelector('#btnNrodocumento');
  const txtContratoObservacion = document.querySelector('#txtContratoObservacion');
  const formIncidencia = document.querySelector("#form-Incidencia");
  const slcPrioridad = document.querySelector("#slcPrioridad");
  const txtDescripcion = document.querySelector("#txtDescripcion");
  const txtSolucion = document.querySelector("#txtSolucion");
  const slcContratos = document.querySelector("#slcContratos");
  //const selectTpSoporte = document.querySelector("#slcTipoSoporte");

  const txtnombreba = document.querySelector("#txtnombreba");
  const txtapellidoba = document.querySelector("#txtapellidoba");
  
  let dfFecha = document.getElementById('txtFecha');
  dfFecha.value = new Date().toISOString().split('T')[0];

  async function busquedaAvanzada() {
    const response = await fetch(``);

    const data = await response.json();

  }

  async function obtenerContratosCliente(data) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerContratoPorCliente&id=${data}`);
    const datos = await respuesta.json();

    console.log("Datos de contratos recibidos:", datos);

    slcContratos.innerHTML = '<option value="">Seleccione un contrato</option>';

    if (Array.isArray(datos) && datos.length > 0) {
      datos.forEach((element) => {
        const option = document.createElement('option');
        option.value = element.id_contrato;
        option.textContent = `${element.tipo_servicio} - ${element.direccion_servicio}`;
        option.dataset.nota = element.nota;
        option.dataset.direccion = element.direccion_servicio;
        slcContratos.appendChild(option);
      });

      if (datos.length === 1) {
        slcContratos.selectedIndex = 1;
        const unicoContrato = datos[0];
        txtContratoObservacion.value = `${unicoContrato.nota} | ${unicoContrato.direccion_servicio}`;
        idContratoSeleccionado = unicoContrato.id_contrato;
      }
    } else {
      console.log("No se encontraron contratos para el cliente especificado.");
    }

    slcContratos.addEventListener('change', () => {
      idContratoSeleccionado = slcContratos.value;
      const selectedOption = slcContratos.options[slcContratos.selectedIndex];
      if (selectedOption.value) {
        const nota = selectedOption.dataset.nota;
        const direccion = selectedOption.dataset.direccion;
        txtContratoObservacion.value = `${nota} | ${direccion}`;
      } else {
        txtContratoObservacion.value = '';
      }
    });
  }

  async function BuscarcontratoNDoc(numdocumento) {
    const respuesta = await fetch(`${config.HOST}/app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${numdocumento}`);
    const data = await respuesta.json();
    console.log(data);
    $("#txtCliente").val(data[0].nombre);
    await obtenerContratosCliente(data[0].id_cliente);
  };

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
  function formatoIPinput(event) {
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

  async function registrarIncidencia() {
    const datos = {
      operacion: "registrarSoporte",
      idContrato: idContratoSeleccionado,
      descripcionProblema: txtDescripcion.value,
      descripcionSolucion: txtSolucion.value,
      idUsuario: user["idUsuario"]
    }

    console.log(datos);

    const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php`,
      {
        method: "POST",
        body: JSON.stringify(datos),
        headers: { "Content-Type": "application/json" }
      });

    const data = await respuesta.json();
    console.log(data);
    if (data.status === "success") {
      showToast("Registrado Correctamente", "SUCCESS");
    } else {
      showToast(data.message, "ERROR");
    }
  };

  botonbuscar.addEventListener("click", async () => {
    const dni = document.getElementById('txtNrodocumento').value;
    await BuscarcontratoNDoc(dni);
  });

  formIncidencia.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (await ask("¿Desea Registrar esta incidencia?")) {
      await registrarIncidencia();
    }
  });

});
