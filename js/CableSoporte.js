import config from '../env.js';
import { inicializarDataTable } from './Herramientas.js';

document.addEventListener("DOMContentLoaded", () => {

  function $(object = null) {
    return document.querySelector(object);
  }

  async function obtenerJsonCable() {
    const respuesta = await fetch(`${config.HOST}Json/spCable.json`);
    const datos = await respuesta.json();
    return datos;
  }

  async function registrarCable(JsonCable) {
    console.log(JsonCable);
    console.log($("#txtPotencia").value);

    const params = new FormData();
        params.append('operacion', '');
        params.append('id_contrato', '');
        params.append('id_tipo_soporte', '');
        params.append('id_tecnico', '');
        params.append('fecha_hora_solicitud', '');
        params.append('fecha_hora_asistencia', '');
        params.append('prioridad', '');
        params.append('soporte', JsonCable);
        params.append('iduser_create', 1);
    
        const respuesta = await fetch(`${config.HOST}/app/controllers/Soporte.controllers.php`,
          { method: 'POST', body: params });
    
        const data = await respuesta.json();
    
        if (data) {
          alert("Correcto");
        }
        else {
          alert("Error")
        };
  }

  $("#Form-FichaCable").addEventListener("submit", async (event) => {
    event.preventDefault();
    const potencia = $("#txtPotenciaCable").value;
    const Cambiopotencia = $("#txtCambiosPotenciaCable").value;

    const JsonCable = await obtenerJsonCable();

    // Parámetros del Cable
    JsonCable.parametroscable.periodo = $("#slcPeriodoCable").value;
    JsonCable.parametroscable.potencia = potencia;
    JsonCable.parametroscable.sintonizador = $("#txtSintonizadorCable").value;
    JsonCable.parametroscable.triplexor = {
      "requiere": ($("#slcTriplexorCable").value !== "1"),  // "1" es "No"
      "cantidad": $("#txtNumTriplexorCable").value,
      "tipo": ($("#slcTriplexorCable").value === "2") ? "activo" : "pasivo"
    };

    // Asignación de splitter (que puede ser más de uno)
    JsonCable.parametroscable.spliter = [
      {
        "cantidad": $("#txtNumSpliterCable").value,
        "tipo": $("#slcSpliterCable").value === "1" ? "1x3" :
          $("#slcSpliterCable").value === "2" ? "1x5" : "1x8"
      }
    ];

    JsonCable.parametroscable.cable = $("#txtCable").value;
    JsonCable.parametroscable.conectores = $("#txtConectorCable").value;
    JsonCable.parametroscable.estadoinicial = $("#txtEstadoInicialCable").value;

    // Cambios en el Cable
    JsonCable.cambioscable.periodo = $("#slcCambiosPeriodoCable").value;
    JsonCable.cambioscable.potencia = Cambiopotencia;
    JsonCable.cambioscable.sintonizador = $("#txtCambiosSintonizadorCable").value;
    JsonCable.cambioscable.triplexor = {
      "requiere": ($("#slcCambiosTriplexorCable").value !== "1"),  // 1 significa NO, si pueden cambienlo
      "cantidad": $("#txtCambiosNumTriplexorCable").value,
      "tipo": ($("#slcCambiosTriplexorCable").value === "2") ? "activo" : "pasivo"
    };

    JsonCable.cambioscable.spliter = [
      {
        "cantidad": $("#txtCambiosNumSpliterCable").value,
        "tipo": $("#slcCambiosSpliterCable").value === "1" ? "1x3" :
          $("#slcCambiosSpliterCable").value === "2" ? "1x5" : "1x8"
      }
    ];

    JsonCable.cambioscable.cable = $("#txtCambiosCable").value;
    JsonCable.cambioscable.conectores = $("#txtCambiosConectorCable").value;
    JsonCable.cambioscable.procedimientosolucion = $("#txtProcedimientoCable").value;

    registrarCable(JsonCable);
  });






});