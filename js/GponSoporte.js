import config from "../env.js";
import { inicializarDataTable } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  function $(object = null) {
    return document.querySelector(object);
  }

  async function obtenerJsonGpon() {
    const datos = {
      parametrosgpon: {
        pppoe: "",
        potencia: "",
        catv: false,
        clave: "",
        vlan: 0,
        potencia: "",
        ssid: "",
        password: "",
        otros: "",
      },
      cambiosgpon: {
        pppoe: "",
        potencia: "",
        catv: false,
        clave: "",
        vlan: 0,
        potencia: "",
        ssid: "",
        password: "",
        otros: "",
      },
    };

    return datos;
  }

  async function registrarGpon(jsonGpon) {
    //console.log(jsonGpon);

    const solicitud = new Date().toISOString().slice(0, 19).replace("T", " ");
    //console.log(solicitud);
    const params = {
      operacion: "registrarSoporte",
      idContrato: $("#slcContratos").value,
      idTipoSoporte: $("#slcTipoSoporte").value,
      idTecnico: 1, // A cambiar
      fechaHoraSolicitud: solicitud, //2024-05-31 13:00:00 EJEMPLO
      fechaHoraAsistencia: new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      prioridad: $("#slcPrioridad").value,
      soporte: jsonGpon,
      idUsuario: 1, // A espera de un nuevo método
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
      alert("Correcto");
    } else {
      alert("Error");
    }
  }

  $("#Form-FichaGpon").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (
      $("#txtNrodocumento").value === "" ||
      $("#txtNrodocumento").value.length < 9 ||
      $("#txtNrodocumento").value.length > 11
    ) {
      await showToast("Ingrese un documento válido", "ERROR");
    }

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
    JsonGpon.cambiosgpon.procedimientosolucion = $(
      "#txtCambiosProcedimientoGpon"
    ).value;

    //console.log(JsonGpon);
    registrarGpon(JsonGpon);
  });
});
