import config from '../env.js';

window.window.idContratoSeleccionado = null;

window.addEventListener('DOMContentLoaded', function () {
  // if (permisos[0].permisos.soporte.leer != 1) {
  //   window.location.href = `${config.HOST}views`;
  // }
  const wisp = document.getElementById('lstWisp');
  const gpon = document.getElementById('lstGpon');
  const cable = document.getElementById('lstCable');
  const botonbuscar = document.getElementById('btnNrodocumento');

  async function BuscarcontratoNDoc(numdocumento) {
    const respuesta = await fetch(`${config.HOST}/app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${numdocumento}`);
    const data = await respuesta.json();
    //console.log(data[0].nombre);
    $("#txtCliente").val(data[0].nombre);
    await obtenerContratosCliente(data[0].id_cliente);
  };

  var today = new Date().toISOString().split('T')[0];
  document.getElementById('txtFecha').value = today;

  const checkboxCatvGpon = document.getElementById('chkCatvGpon');
  const checkboxTextGpon = document.getElementById('checkboxTextGpon');
  const checkboxCambiosCatvGpon = document.getElementById('chkCambiosCatvGpon');
  const checkboxTextCambiosCatvGpon = document.getElementById('checkboxTextCambiosCatv');

  function actualizarSecciones(tipoPaquete) {
    // Ocultar todas las secciones primero
    wisp.setAttribute('hidden', true);
    gpon.setAttribute('hidden', true);
    cable.setAttribute('hidden', true);

    const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));


    // Mostrar la sección correspondiente según el tipo de paquete
    if (tipoPaquete === 'WISP') {
      wisp.removeAttribute('hidden');
    } else if (tipoPaquete === 'FIBR') { // Cambiado de 'FRIB' a 'FIBR'
      gpon.removeAttribute('hidden');
    } else if (tipoPaquete === 'CABl') { // Verifica que sea 'CABL'
      cable.removeAttribute('hidden');
    }

    modal.hide();
  };

  checkboxCatvGpon.addEventListener('change', function () {
    checkboxTextGpon.textContent = this.checked ? 'Sí' : 'No';
  });

  checkboxCambiosCatvGpon.addEventListener('change', function () {
    checkboxTextCambiosCatvGpon.textContent = this.checked ? 'Sí' : 'No';
  });

  botonbuscar.addEventListener("click", async () => {
    const dni = document.getElementById('txtNrodocumento').value;
    await BuscarcontratoNDoc(dni);
  });


  async function obtenerContratosCliente(data) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerContratoPorCliente&id=${data}`);
    const datos = await respuesta.json();

    const modalBody = document.querySelector('.modal-body ul'); // Lista dentro del modal
    modalBody.innerHTML = ''; // Limpiar contenido previo del modal

    // Llenar el modal con los contratos
    datos.forEach((element) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.textContent = `${element.servicio}`;
      li.setAttribute('data-id-contrato', element.id_contrato); // Almacenar el id del contrato
      li.setAttribute('data-tipo-paquete', element.tipo_paquete); // Almacenar el tipo de paquete

      li.addEventListener('click', () => {
        actualizarSecciones(element.tipo_paquete);
        window.idContratoSeleccionado = element.id_contrato; // Almacenar el ID del contrato en la variable global
      });

      modalBody.appendChild(li);
    });
  };


  (async () => {
    const respuesta = await fetch(`${config.HOST}/app/controllers/Soporte.controllers.php?operacion=listarTipoSoporte`);
    const datos = await respuesta.json();

    const selectTpSoporte = $("#slcTipoSoporte");
    selectTpSoporte.empty();
    datos.forEach((element) => {
      const option = new Option(
        `${element.tipo_soporte}`,
        element.id_tipo_soporte
      );
      selectTpSoporte.append(option);
    });
  })();

  function formatoIPinput(event) {
    // Obtener el valor del input
    let input = event.target.value.replace(/[^0-9.]/g, ''); // Solo números y puntos

    // Agrupar en segmentos de 3
    let formattedInput = '';
    let count = 0; // Contador de dígitos

    for (let i = 0; i < input.length; i++) {
      if (input[i] !== '.') {
        formattedInput += input[i];
        count++;
        // Agregar punto después de cada 3 dígitos, pero solo si no es el final
        if (count % 3 === 0 && i < input.length - 1 && input[i + 1] !== '.') {
          formattedInput += '.';
        }
      } else {
        // Reiniciar el contador al encontrar un punto
        if (formattedInput[formattedInput.length - 1] !== '.') {
          formattedInput += '.'; // Agregar el punto si no está presente al final
        }
        count = 0; // Reiniciar el contador
      }
    }

    // Limitar el valor a 15 caracteres
    event.target.value = formattedInput.slice(0, 15);
  };

  $('#txtIpWisp, #txtCambiosIpWisp').on('input', function (event) {
    formatoIPinput(event);
  });

  async function CalcularYActualizarPrecio(txtSalida, cantidad, precio) {
    if (cantidad < 0) {
      await showToast("La cantidad debe ser mayor o igual a 0", "ERROR");
      $(txtSalida).val(""); // Limpia el campo de salida en caso de error
      return;
    }
    let PrecioTotal = cantidad * precio;
    $(txtSalida).val(PrecioTotal.toFixed(2)); // Formatea a dos decimales
  }

  function ManejodeInputs(txtInput, txtSalida, precio) {
    $(txtInput).on('input', async function () {
      let cantidad = parseFloat($(this).val());

      // Ajusta la cantidad a 0 si es negativa o no es un número
      if (isNaN(cantidad) || cantidad < 0) {
        cantidad = 0;
        $(this).val(""); // Actualiza el input a 0
      }

      // Realiza el cálculo
      await CalcularYActualizarPrecio(txtSalida, cantidad, precio);
    });
  }

  // NO MUEVAN ESTO, ES NECESARIO PARA EL CALCULO DE LOS INPUTS
  ManejodeInputs('#txtCable', '#txtPrecioCable', 4.25);
  ManejodeInputs('#txtConectorCable', '#txtPrecioConectorCable', 6.25);
  ManejodeInputs('#txtCambiosCable', '#txtCambiosPrecioCable', 4.25);
  ManejodeInputs('#txtCambiosConectorCable', '#txtCambiosPrecioConectorCable', 6.25);
});
