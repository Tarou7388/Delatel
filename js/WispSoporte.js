import config from "../env.js";
import { inicializarDataTable } from "./Herramientas.js";

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
  };

  async function registrarWisp(jsondata) {
    const params = {
      operacion: "registrarSoporte",
      idContrato: window.idContratoSeleccionado,
      idTipoSoporte: $("#slcTipoSoporte").value,
      idTecnico: 1, // Este valor debe ser actualizado dinámicamente si es necesario
      fechaHoraSolicitud: `${$("#txtFecha").value} ${new Date()
        .toISOString()
        .slice(11, 19)}`, // Puedes generar la fecha y hora aquí si es necesario
      fechaHoraAsistencia: `${$("#txtFecha").value} ${new Date()
        .toISOString()
        .slice(11, 19)}`, // Concatenación de strings para mayor claridad
      prioridad: $("#slcPrioridad").value,
      soporte: jsondata, // Asegúrate de que jsondata esté definido antes de usarlo
      idUsuario: 1, // Actualizar este valor según sea necesario
      descripcionProblema: $("#txtEstadoInicialWisp").value,
      descripcionSolucion: $("#txtProcedimientoWisp").value
    };

    console.log(params);

    const respuesta = await fetch(
      `${config.HOST}/app/controllers/Soporte.controllers.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      }
    );

    const data = await respuesta.json();
    if (data) {
      await ResetWisp();
    } else {
      alert("Error");
    }
  }

  // Manejo del evento de envío del formulario
  $("#Form-FichaWisp").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (
      $("#txtNrodocumento").value === "" ||
      $("#txtNrodocumento").value.length < 9 ||
      $("#txtNrodocumento").value.length > 11
    ) {
      await showToast("Encontrado Correctamente", "SUCCESS");
    }
    else {
      await showToast("Ingrese un documento válido", "ERROR");
    };

    const JsonWisp = await obtenerJsonWisp();

    JsonWisp.parametros.base = $("#txtBaseWisp").value;
    JsonWisp.parametros.ip = $("#txtIpWisp").value;
    JsonWisp.parametros.senal = $("#txtSenialWisp").value;

    JsonWisp.cambios.nuevaBase = $("#txtCambiosBaseWisp").value;
    JsonWisp.cambios.nuevoIP = $("#txtCambiosIpWisp").value;
    JsonWisp.cambios.senal = $("#txtCambiosSenialWisp").value;

    //console.log(JsonWisp);

    registrarWisp(JsonWisp);
  });
});
