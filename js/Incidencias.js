import config from '../env.js';



window.addEventListener('DOMContentLoaded', function () {
  idcliente = null;

  const botonbuscar = document.getElementById('btnNrodocumento');
  const formRegistroIncidencia = document.getElementById('formRegistroIncidencia');
  async function BuscarcontratoNDoc(numdocumento) {
    const respuesta = await fetch(`${config.HOST}/app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${numdocumento}`);
    const data = await respuesta.json();
    //console.log(data[0].nombre);
    if (data[0]) {
      $("#txtCliente").val(data[0].nombre);
      idcliente = data[0].id_cliente;
      $("#txtCliente").prop('disabled', true);
    }
    else {
      showToast("No se encuentra a este cliente", "ERROR");
      idcliente = null;
    }

  }

  botonbuscar.addEventListener("click", async () => {
    const dni = document.getElementById('txtNrodocumento').value;
    await BuscarcontratoNDoc(dni);
  });

  formRegistroIncidencia.addEventListener("submit", (event) => {

  });

});