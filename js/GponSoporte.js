import config from '../env.js';
import { inicializarDataTable } from './tools.js';

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
    params.append('operacion', '');
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

    JsonGpon.parametrosgpon.pppoe = $("#txtPppoe").value;
    JsonGpon.parametrosgpon.potecia = $("#txtPotencia").value;
    JsonGpon.parametrosgpon.catv = $("#chkCatv1").checked ? true : false;
    JsonGpon.parametrosgpon.clave = $("#txtClave").value;
    JsonGpon.parametrosgpon.vlan = $("#txtVlan").value;
    JsonGpon.parametrosgpon.potencia = $("#txtPotencia").value;
    JsonGpon.parametrosgpon.ssid = $("#txtSsid").value;
    JsonGpon.parametrosgpon.password = $("#txtPassword").value;
    JsonGpon.parametrosgpon.otros = $("#txtOtros").value;
    JsonGpon.parametrosgpon.estadoinicial = $("#txtaEstadoInicial").value;

    JsonGpon.cambiosgpon.pppoe = $("#txtCambiosPppoe").value;
    JsonGpon.cambiosgpon.potecia = $("#txtCambiosPotencia").value;
    JsonGpon.cambiosgpon.catv = $("#chkCatv2").checked ? true : false;
    JsonGpon.cambiosgpon.clave = $("#txtCambiosClave").value;
    JsonGpon.cambiosgpon.vlan = $("#txtCambiosVlan").value;
    JsonGpon.cambiosgpon.potencia = $("#txtCambiosPotencia").value;
    JsonGpon.cambiosgpon.ssid = $("#txtCambiosSsid").value;
    JsonGpon.cambiosgpon.password = $("#txtCambiosPassword").value;
    JsonGpon.cambiosgpon.otros = $("#txtCambiosOtros").value;
    JsonGpon.cambiosgpon.procedimientosolucion = $("#txtaCambiosProcedimiento").value;


    registrarGpon(JsonGpon);
  });




});