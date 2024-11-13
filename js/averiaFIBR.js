import config from "../env.js";
import { inicializarDataTable } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("frm-registro-gpon");

  let idSoporte = -1;

  (async function () {
    idSoporte = await obtenerIdSoporteDeUrl();
    if (idSoporte) {
      await obtenerProblema(idSoporte);
      crearSelectYBoton();
      ArmadoJsonWisp();
    }
  })();


  async function obtenerProblema(idSoporte) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
    const data = await respuesta.json();
    console.log(data);

    $("#txtaEstadoInicial").val(data[0].descripcion_problema);
  }

  function crearSelectYBoton() {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row g-2 mb-2";

    const selectDiv = document.createElement("div");
    selectDiv.className = "col-md ";

    const labelSelect = document.createElement("label");
    labelSelect.innerText = "Tipo de Soporte";
    selectDiv.appendChild(labelSelect);

    const selectSoporte = document.createElement("select");
    selectSoporte.id = "slcTipoSoporte";
    selectSoporte.className = "form-control";
    selectSoporte.required = true;
    selectDiv.appendChild(selectSoporte);
    rowDiv.appendChild(selectDiv);

    (async () => {
      const respuesta = await fetch(`${config.HOST}/app/controllers/Soporte.controllers.php?operacion=listarTipoSoporte`);
      const datos = await respuesta.json();
      selectSoporte.innerHTML = "";
      datos.forEach((element) => {
        const option = new Option(
          `${element.tipo_soporte}`,
          element.id_tipo_soporte
        );
        selectSoporte.append(option);
      });
    })();

    const buttonDiv = document.createElement("div");
    buttonDiv.className = "col-md d-flex align-items-end";

    const guardarBtn = document.createElement("button");
    guardarBtn.id = "btnGuardarFicha";
    guardarBtn.className = "btn btn-primary";
    guardarBtn.type = "submit";
    guardarBtn.textContent = "Guardar Ficha";

    buttonDiv.appendChild(guardarBtn);
    rowDiv.appendChild(buttonDiv);


    const solutionTextarea = document.getElementById("txtaCambiosProceSolucion");
    solutionTextarea.parentNode.parentNode.appendChild(rowDiv);
  }

  async function rellenarDocNombre(doct) {
    const respuesta = await fetch(`${config.HOST}/app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${doct}`);
    const data = await respuesta.json();
    console.log(data);
    $("#txtCliente").val(data[0].nombre);
    $("#txtNrodocumento").val(doct);
  }

  async function obtenerIdSoporteDeUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    rellenarDocNombre(urlParams.get("doc"));

    return urlParams.get("idsoporte");
  }

  async function ArmadoJsonWisp() {
    const respuesta = await fetch(`${config.HOST}Json/spGpon.json`);
    const datos = await respuesta.json();

    console.log(datos);

    const pppoe = document.getElementById("txtPppoe").value;
    const potencia = document.getElementById("txtPotencia").value;
    const potecia = document.getElementById("txtPotenciaDos").value;
    const catv = document.getElementById("chkCatv").checked;
    const clave = document.getElementById("txtClave").value;
    const vlan = document.getElementById("txtVlan").value;
    const ssid = document.getElementById("txtSsid").value;
    const password = document.getElementById("txtPass").value;
    const otros = document.getElementById("txtOtros").value;

    // Para los cambios técnicos
    const pppoeCambio = document.getElementById("txtCambiosPppoe").value;
    const potenciaCambio = document.getElementById("txtCambiosPotencia").value;
    const poteciaCambio = document.getElementById("txtCambiosPotenciaDos").value;
    const catvCambio = document.getElementById("chkCambiosCatv").checked;
    const claveCambio = document.getElementById("txtCambiosClave").value;
    const vlanCambio = document.getElementById("txtCambiosVlan").value;
    const ssidCambio = document.getElementById("txtCambiosSsid").value;
    const passwordCambio = document.getElementById("txtCambiosPass").value;
    const otrosCambio = document.getElementById("txtCambiosOtros").value;

    // Ahora puedes crear tu objeto o lo que necesites hacer con estos valores.
    datos.parametrosgpon.pppoe = pppoe;
    datos.parametrosgpon.potecia = potecia;
    datos.parametrosgpon.potencia = potencia;
    datos.parametrosgpon.catv = catv;
    datos.parametrosgpon.clave = clave;
    datos.parametrosgpon.vlan = vlan;
    datos.parametrosgpon.ssid = ssid;
    datos.parametrosgpon.password = password;
    datos.parametrosgpon.otros = otros;

    datos.cambiosgpon.pppoe = pppoeCambio;
    datos.cambiosgpon.potecia = poteciaCambio;
    datos.cambiosgpon.potencia = potenciaCambio;
    datos.cambiosgpon.catv = catvCambio;
    datos.cambiosgpon.clave = claveCambio;
    datos.cambiosgpon.vlan = vlanCambio;
    datos.cambiosgpon.ssid = ssidCambio;
    datos.cambiosgpon.password = passwordCambio;
    datos.cambiosgpon.otros = otrosCambio;


    const data = {
      idSoporte: idSoporte,
      idTecnico: JSON.stringify(user['idUsuario']),
      idTipoSoporte: document.getElementById("slcTipoSoporte").value,
      soporte: datos,
      idUserUpdate: JSON.stringify(user['idUsuario']),
      descripcion_solucion: document.getElementById("txtaCambiosProceSolucion").value
    };

    console.log(data)

    return data;
  }

  async function guardarSoporte(data) {
    try {
      const response = await fetch(`${config.HOST}/app/controllers/Soporte.controllers.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operacion: 'actualizarSoporte',
          data,
        }),
      });

      const result = await response.json();
      console.log(result);

    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }


  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = await ArmadoJsonWisp();
    await guardarSoporte(data);
  });

});
