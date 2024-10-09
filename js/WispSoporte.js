import config from '../env.js';
import { inicializarDataTable } from './Herramientas.js';

document.addEventListener("DOMContentLoaded", () => {

  function $(object) {
    return document.querySelector(object);
  }

  function ResetWisp() {
    //Antiguos
    $("#txtBaseWisp").value = "";
    $("#txtIpWisp").value = "";
    $("#txtSenialWisp").value = "";
    $("#txtEstadoInicialWisp").value = "";
    //Nuevos
    $("#txtCambiosBaseWisp").value = "";
    $("#txtCambiosIpWisp").value = "";
    $("#txtCambiosSenialWisp").value = "";
    $("#txtProcedimientoWisp").value = "";
  }

  async function obtenerJsonWisp() {
    const respuesta = await fetch(`${config.HOST}Json/spWISP.json`);
    const datos = await respuesta.json();
    return datos;

  }

  async function registrarWisp(jsondata) {
    console.log(new Date().toISOString().slice(0, 19).replace('T', ' '));


    console.log(jsondata);

    const params = {
      operacion: 'registrarSoporte',
      idContrato: $("#slcContratos").value,
      idTipoSoporte: $("#slcTipoSoporte").value,
      idTecnico: 1, // A cambiar
      fechaHoraSolicitud: new Date().toISOString().slice(0, 19).replace('T', ' '),//2024-05-31 13:00:00 EJEMPLO
      fechaHoraAsistencia: new Date().toISOString().slice(0, 19).replace('T', ' '),
      prioridad: $("#slcPrioridad").value,
      soporte: jsondata, // Asegúrate de que jsondata esté bien definido
      idUsuario: 1 // A espera de un nuevo método
    };

    const respuesta = await fetch(`${config.HOST}/app/controllers/Soporte.controllers.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    const data = await respuesta.json();
    if (data) {
      alert("Correcto");
      await ResetWisp();
    }
    else {
      alert("Error")
    }
  }

  // Manejo del evento de envío del formulario
  $("#Form-FichaWisp").addEventListener("submit", async (event) => {
    event.preventDefault();
    const JsonWisp = await obtenerJsonWisp();

    JsonWisp.parametros.base = $("#txtBaseWisp").value;
    JsonWisp.parametros.ip = $("#txtIpWisp").value;
    JsonWisp.parametros.señal = $("#txtSenialWisp").value;
    JsonWisp.parametros.estadoInicial = $("#txtEstadoInicialWisp").value;

    JsonWisp.cambios.nuevaBase = $("#txtCambiosBaseWisp").value;
    JsonWisp.cambios.nuevoIP = $("#txtCambiosIpWisp").value;
    JsonWisp.cambios.señal = $("#txtCambiosSenialWisp").value;
    JsonWisp.cambios.procedimiento = $("#txtProcedimientoWisp").value;

    registrarWisp(JsonWisp);
  });

});
