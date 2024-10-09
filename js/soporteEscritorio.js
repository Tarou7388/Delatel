import config from '../env.js';
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
  const dropdownItems = document.querySelectorAll('.list-group-item');
  const dropdownButton = document.getElementById('btnModal');

  dropdownItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const value = this.getAttribute('data-value');
      const name = this.getAttribute('data-name');

      dropdownButton.textContent = name;
      dropdownButton.setAttribute('data-value', value);

      const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
      modal.hide();

      updateSections(value);
    });
  });

  const checkboxCatvGpon = document.getElementById('chkCatvGpon');
  const checkboxTextGpon = document.getElementById('checkboxTextGpon');
  const checkboxCambiosCatvGpon = document.getElementById('chkCambiosCatvGpon');
  const checkboxTextCambiosCatvGpon = document.getElementById('checkboxTextCambiosCatv');

  function updateSections(value) {
    // Ocultar todas las secciones primero
    wisp.setAttribute('hidden', true);
    gpon.setAttribute('hidden', true);
    cable.setAttribute('hidden', true);

    // Mostrar la sección correspondiente al plan seleccionado
    if (value == 1) {
      wisp.removeAttribute('hidden');
    } else if (value == 2) {
      gpon.removeAttribute('hidden');
    } else if (value == 3) {
      cable.removeAttribute('hidden');
    }
  }
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

    const selectContratos = $("#slcContratos");
    selectContratos.empty();

    datos.forEach((element) => {
      //console.log(element.tipo_paquete);
      const option = new Option(
        `${element.servicio} - ${element.tipo_paquete}`,
        element.id_contrato
      );
      selectContratos.append(option);
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

  // Agregar evento de input a los inputs
  $('#txtIpWisp, #txtCambiosIpWisp').on('input', function (event) {
    formatoIPinput(event); // Pasar el evento completo
  });

  function CalcularEntradaPrecio(cantidad, precio) {

    let PrecioTotal = cantidad * precio;

    if (PrecioTotal == 0 || PrecioTotal < 0) {
      return PrecioTotal;
    }
    else {
      showToast("No se puede calcular esta cantidad", "ERROR");
    };

    return { precio: PrecioTotal };
  }

  $('#txtPrecioCable').on('input', function (event) {
    CalcularEntradaPrecio(event);
  });
  $('#txtConectorCable').on('input', function (event) {
    CalcularEntradaPrecio(event);
  });
  $('#txtCambiosPrecioCable').on('input', function (event) {
    CalcularEntradaPrecio(event);
  });
  $('#txtCambiosConectorCable').on('input', function (event) {
    CalcularEntradaPrecio(event);
  });

});
