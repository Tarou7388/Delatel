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

    console.log(jsondata);

    const params = new FormData();
    params.append('operacion', '');
    params.append('id_contrato', '');
    params.append('id_tipo_soporte', '');
    params.append('id_tecnico', '');
    params.append('fecha_hora_solicitud', '');
    params.append('fecha_hora_asistencia', '');
    params.append('prioridad', '');
    params.append('soporte', jsondata);
    params.append('iduser_create', 1);

    const respuesta = await fetch(`${config.HOST}/app/controllers/Soporte.controllers.php`,
      { method: 'POST', body: params });

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
