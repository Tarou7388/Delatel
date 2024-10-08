import config from '../env.js';
import { inicializarDataTable } from './tools.js';

document.addEventListener("DOMContentLoaded", () => {

  function $(object) {
    return document.querySelector(object);
  }

  function ResetWisp() {
    //Antiguos
    $("#txtBase").value = "";
    $("#txtIp").value = "";
    $("#txtSenial").value = "";
    $("#txtaEstadoInicial").value = "";
    //Nuevos
    $("#txtNuevaBase").value = "";
    $("#txtNuevoIp").value = "";
    $("#txtNuevoSenial").value = "";
    $("#txtNuevoProcedimiento").value = "";
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

    JsonWisp.parametros.base = $("#txtBase").value;
    JsonWisp.parametros.ip = $("#txtIp").value;
    JsonWisp.parametros.señal = $("#txtSenial").value;
    JsonWisp.parametros.estadoInicial = $("#txtaEstadoInicial").value;

    JsonWisp.cambios.nuevaBase = $("#txtNuevaBase").value;
    JsonWisp.cambios.nuevoIP = $("#txtNuevoIp").value;
    JsonWisp.cambios.señal = $("#txtNuevoSenial").value;
    JsonWisp.cambios.procedimiento = $("#txtNuevoProcedimiento").value;

    registrarWisp(JsonWisp);
  });

});
