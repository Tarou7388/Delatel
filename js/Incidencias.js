import config from '../env.js';
import * as Herramientas from "../js/Herramientas.js";

if (JSON.stringify(user['idRol']) == 2) {
  window.location.href = `${config.HOST}views/Soporte/registroSoporte`;
}

window.addEventListener('DOMContentLoaded', async function () {
  const accesos = await Herramientas.permisos()
  const userid = JSON.stringify(user['idUsuario']);
  let idcliente = -1;

  var today = new Date().toISOString().split('T')[0];
  document.getElementById('txtFecha').value = today;

  function $(object) {
    return document.querySelector(object);
  };

  async function registrarIncidencia() {
    if (accesos?.soporte?.crear) {
      const datos = {
        idCliente: idcliente,
        fechaIncidencia: new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        descripcion: $("#txtDescripcion").value,
        solucion: $("#txtSolucion").value,
        idtecnico: userid,
        idUsuario: userid,
      };

      console.log(JSON.stringify({
        operacion: "registrarIncidencia",
        datos: datos
      }));

      const respuesta = await fetch(`${config.HOST}app/controllers/Incidencia.controllers.php`, {
        method: "POST",
        body: JSON.stringify({
          operacion: "registrarIncidencia",
          datos: datos
        })
      });

      const data = await respuesta.json();

      if (data) {
        showToast("Incicencia guardada", "SUCCESS");
        formRegistroIncidencia.reset();
      }
      else {
        showToast("No se logró registrar la incidencia", "ERROR");
      }
    }
  }

  const botonbuscar = document.getElementById('btnNrodocumento');
  const formRegistroIncidencia = document.getElementById('formRegistroIncidencia');
  async function BuscarcontratoNDoc(numdocumento) {
    const respuesta = await fetch(`${config.HOST}/app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${numdocumento}`);
    const data = await respuesta.json();
    //console.log(data[0].nombre);
    if (data[0]) {
      $("#txtCliente").value = data[0].nombre;
      idcliente = data[0].id_cliente;
      $("#txtCliente").disabled = true;
    }
    else {
      showToast("No se encuentra a este cliente", "ERROR");
      idcliente = -1;
    }

  }

  botonbuscar.addEventListener("click", async () => {
    const dni = document.getElementById('txtNrodocumento').value;
    await BuscarcontratoNDoc(dni);
  });

  formRegistroIncidencia.addEventListener("submit", async (event) => {
    event.preventDefault();
    await registrarIncidencia();
  });

});