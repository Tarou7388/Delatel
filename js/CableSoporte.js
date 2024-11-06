import config from "../env.js";
import { inicializarDataTable } from "./Herramientas.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener("DOMContentLoaded", async () => {
  const accesos = await Herramientas.permisos()

  function $(object = null) {
    return document.querySelector(object);
  }

  async function obtenerJsonCable() {
    const respuesta = await fetch(`${config.HOST}Json/spCable.json`);
    const datos = await respuesta.json();
    return datos;
  }

  async function registrarCable(JsonCable) {
    if(accesos?.averias?.crear){
      const params = {
        operacion: "registrarSoporte",
        idContrato: window.idContratoSeleccionado,
        idTipoSoporte: $("#slcTipoSoporte").value,
        idTecnico: 1, // A cambiar
        fechaHoraSolicitud: new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "), //2024-05-31 13:00:00 EJEMPLO
        fechaHoraAsistencia: new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        prioridad: $("#slcPrioridad").value,
        soporte: JsonCable,
        idUsuario: 1, // A espera de un nuevo método
        descripcionProblema: $("#txtEstadoInicialCable").value,
        descripcionSolucion: $("#txtProcedimientoCable").value
      };
  
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
      } else {
        alert("Error");
      }
    }
    else{
      showToast("No tienes permisos", "ERROR")
    }
    
  }

  $("#Form-FichaCable").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (
      $("#txtNrodocumento").value === "" ||
      $("#txtNrodocumento").value.length < 9 ||
      $("#txtNrodocumento").value.length > 11
    ) {
      await showToast("Registrado Correctamente", "SUCCESS");
    }
    else {
      await showToast("Ingrese un documento válido", "ERROR");
    };

    const JsonCable = await obtenerJsonCable();

    // Parámetros del Cable
    JsonCable.parametroscable.periodo = $("#slcPeriodoCable").value;
    JsonCable.parametroscable.potencia = $("#txtPotenciaCable").value;
    JsonCable.parametroscable.sintonizador = $("#txtSintonizadorCable").value;
    JsonCable.parametroscable.triplexor = {
      requiere: $("#slcTriplexorCable").value !== "1", // "1" es "No"
      cantidad: $("#txtNumTriplexorCable").value,
      tipo: $("#slcTriplexorCable").value === "2" ? "activo" : "pasivo",
    };

    // Asignación de splitter (que puede ser más de uno)
    JsonCable.parametroscable.spliter = [
      {
        cantidad: $("#txtNumSpliterCable").value,
        tipo:
          $("#slcSpliterCable").value === "1"
            ? "1x3"
            : $("#slcSpliterCable").value === "2"
              ? "1x5"
              : "1x8",
      },
    ];

    JsonCable.parametroscable.cable = $("#txtCable").value;
    JsonCable.parametroscable.conectores = $("#txtConectorCable").value;
    //JsonCable.parametroscable.estadoinicial = $("#txtEstadoInicialCable").value;

    // Cambios en el Cable
    JsonCable.cambioscable.periodo = $("#slcCambiosPeriodoCable").value;
    JsonCable.cambioscable.potencia = $("#txtCambiosPotenciaCable").value;
    JsonCable.cambioscable.sintonizador = $(
      "#txtCambiosSintonizadorCable"
    ).value;
    JsonCable.cambioscable.triplexor = {
      requiere: $("#slcCambiosTriplexorCable").value !== "1", // 1 significa NO, si pueden cambienlo
      cantidad: $("#txtCambiosNumTriplexorCable").value,
      tipo: $("#slcCambiosTriplexorCable").value === "2" ? "activo" : "pasivo",
    };

    JsonCable.cambioscable.spliter = [
      {
        cantidad: $("#txtCambiosNumSpliterCable").value,
        tipo:
          $("#slcCambiosSpliterCable").value === "1"
            ? "1x3"
            : $("#slcCambiosSpliterCable").value === "2"
              ? "1x5"
              : "1x8",
      },
    ];

    JsonCable.cambioscable.cable = $("#txtCambiosCable").value;
    JsonCable.cambioscable.conectores = $("#txtCambiosConectorCable").value;
    //JsonCable.cambioscable.procedimientosolucion = $("#txtProcedimientoCable").value;

    //console.log(JsonCable);
    registrarCable(JsonCable);
  });
});
