import config from '../env.js';
import { inicializarDataTable } from './Herramientas.js';

document.addEventListener("DOMContentLoaded", () => {

  function $(object = null) {
    return document.querySelector(object);
  }

  async function obtenerJsonGpon() {
    const respuesta = await fetch(`${config.HOST}Json/spGPON.json`);
    const datos = await respuesta.json();
    return datos;
  }

  async function registrarGpon(jsonGpon) {
    console.log(jsonGpon);

    const params = new FormData();
    params.append('operacion', 'registrarSoporte');
    params.append('id_contrato', '');
    params.append('id_tipo_soporte', '');
    params.append('id_tecnico', '');
    params.append('fecha_hora_solicitud', '');
    params.append('fecha_hora_asistencia', '');
    params.append('prioridad', '');
    params.append('soporte', jsonGpon);
    params.append('iduser_create', 1);

    const respuesta = await fetch(`${config.HOST}/app/controllers/Soporte.controllers.php`,
      { method: 'POST', body: params });

    const data = await respuesta.json();

    if (data) {
      alert("Correcto");
    }
    else {
      alert("Error")
    }
  }

  $("#Form-FichaGpon").addEventListener("submit", async (event) => {
    event.preventDefault();
    const JsonGpon = await obtenerJsonGpon();

    JsonGpon.parametrosgpon.pppoe = $("#txtPppoeGpon").value;
    JsonGpon.parametrosgpon.potecia = $("#txtPotenciaGpon").value;
    JsonGpon.parametrosgpon.catv = $("#chkCatvGpon").checked ? true : false;
    JsonGpon.parametrosgpon.clave = $("#txtClaveGpon").value;
    JsonGpon.parametrosgpon.vlan = $("#txtVlanGpon").value;
    JsonGpon.parametrosgpon.potencia = $("#txtPotenciaGpon").value;
    JsonGpon.parametrosgpon.ssid = $("#txtSsidGpon").value;
    JsonGpon.parametrosgpon.password = $("#txtPasswordGpon").value;
    JsonGpon.parametrosgpon.otros = $("#txtOtrosGpon").value;
    JsonGpon.parametrosgpon.estadoinicial = $("#txtEstadoInicialGpon").value;

    JsonGpon.cambiosgpon.pppoe = $("#txtCambiosPppoeGpon").value;
    JsonGpon.cambiosgpon.potecia = $("#txtCambiosPotenciaGpon").value;
    JsonGpon.cambiosgpon.catv = $("#chkCambiosCatvGpon").checked ? true : false;
    JsonGpon.cambiosgpon.clave = $("#txtCambiosClaveGpon").value;
    JsonGpon.cambiosgpon.vlan = $("#txtCambiosVlanGpon").value;
    JsonGpon.cambiosgpon.potencia = $("#txtCambiosPotenciaGpon").value;
    JsonGpon.cambiosgpon.ssid = $("#txtCambiosSsidGpon").value;
    JsonGpon.cambiosgpon.password = $("#txtCambiosPasswordGpon").value;
    JsonGpon.cambiosgpon.otros = $("#txtCambiosOtrosGpon").value;
    JsonGpon.cambiosgpon.procedimientosolucion = $("#txtCambiosProcedimientoGpon").value;


    registrarGpon(JsonGpon);
  });




});