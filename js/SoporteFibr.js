import config from "../env.js";
import { FichaSoporte, inicializarDataTable } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("frm-registro-gpon");
  const urlParams = new URLSearchParams(window.location.search);
  const serv = urlParams.get("tiposervicio");

  let idSoporte = -1;

  (async function () {
    try {
      idSoporte = await obtenerIdSoporteDeUrl();
      if (idSoporte) {
        await obtenerProblema(idSoporte);
        await datosfichaFibra(idSoporte);
        crearSelectYBoton();
        ArmadoJsonGpon();
      }
    } catch (error) {
      console.error("Error durante la inicialización:", error);
    }
  })();

  async function obtenerProblema(idSoporte) {
    try {
      const respuesta = await fetch(
        `${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`
      );
      if (!respuesta.ok) throw new Error("Error al obtener problema");
      const data = await respuesta.json();

      if (data.length > 0) {
        $("#txtaEstadoInicial").val(data[0].descripcion_problema);
      } else {
        console.warn("No se encontraron datos para el soporte:", idSoporte);
      }
    } catch (error) {
      console.error("Error en obtenerProblema:", error);
    }
  }

  function crearSelectYBoton() {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row g-2 mb-2";

    const selectDiv = document.createElement("div");
    selectDiv.className = "col-md";

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
      try {
        const respuesta = await fetch(
          `${config.HOST}/app/controllers/Soporte.controllers.php?operacion=listarTipoSoporte`
        );
        if (!respuesta.ok) throw new Error("Error al listar tipos de soporte");
        const datos = await respuesta.json();

        selectSoporte.innerHTML = "";
        datos.forEach((element) => {
          const option = new Option(
            `${element.tipo_soporte}`,
            element.id_tipo_soporte
          );
          selectSoporte.append(option);
        });
      } catch (error) {
        console.error("Error en listarTipoSoporte:", error);
      }
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
    try {
      const respuesta = await fetch(
        `${config.HOST}/app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${doct}`
      );

      const data = await respuesta.json();

      if (data.length > 0) {
        $("#txtCliente").val(data[0].nombre);
        $("#txtNrodocumento").val(doct);
      } else {
        console.warn("Cliente no encontrado con el documento:", doct);
      }
    } catch (error) {
      console.error("Error en rellenarDocNombre:", error);
    }
  }

  async function datosfichaFibra(idSoporte) {
    const dataFbibr = await FichaSoporte(idSoporte);
    console.log(dataFbibr);
  }

  async function obtenerIdSoporteDeUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const doc = urlParams.get("doc");
    console.log(doc);
    await rellenarDocNombre(doc);
    return urlParams.get("idsoporte");
  }

  async function ArmadoJsonGpon() {
    const response = await fetch(`${config.HOST}/app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
    const result = await response.json();

    let soporte = result[0].soporte ? JSON.parse(result[0].soporte) : {};

    const existeClave = Object.keys(soporte).includes(serv);

    if (!existeClave) {
      soporte[serv] = {
        parametrosgpon: {
          pppoe: document.getElementById("txtPppoe").value,
          potencia: document.getElementById("txtPotencia").value,
          potecia: document.getElementById("txtPotenciaDos").value,
          catv: document.getElementById("chkCatv").checked,
          clave: document.getElementById("txtClave").value,
          vlan: document.getElementById("txtVlan").value,
          ssid: document.getElementById("txtSsid").value,
          password: document.getElementById("txtPass").value,
          otros: document.getElementById("txtOtros").value
        },
        cambiosgpon: {
          pppoe: document.getElementById("txtCambiosPppoe").value,
          potencia: document.getElementById("txtCambiosPotencia").value,
          potecia: document.getElementById("txtCambiosPotenciaDos").value,
          catv: document.getElementById("chkCambiosCatv").checked,
          clave: document.getElementById("txtCambiosClave").value,
          vlan: document.getElementById("txtCambiosVlan").value,
          ssid: document.getElementById("txtCambiosSsid").value,
          password: document.getElementById("txtCambiosPass").value,
          otros: document.getElementById("txtCambiosOtros").value
        }
      }
    }
    return soporte;
  }

  async function guardarSoporte(data) {
    try {

      const urlParams = new URLSearchParams(window.location.search);
      const serv = urlParams.get("tiposervicio");

      const response = await fetch(
        `${config.HOST}/app/controllers/Soporte.controllers.php`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            operacion: 'actualizarSoporte',
            data: {
              idSoporte: idSoporte,
              idTecnico: user['idUsuario'],
              idTipoSoporte: document.getElementById("slcTipoSoporte").value,
              soporte: data,
              idUserUpdate: user['idUsuario'],
              descripcion_solucion: document.getElementById("txtaCambiosProceSolucion").value,
            },
          }),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        console.log("Soporte actualizado correctamente.");

      } else {
        console.error("Error al guardar soporte:", result.message);
      }
    } catch (error) {
      console.error("Error en guardarSoporte:", error);
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = await ArmadoJsonGpon();
    if (await ask("¿Desea guardar la ficha?")) {
      await guardarSoporte(data)
      window.location.href = `${config.HOST}views/Soporte/listarSoporte`;
    }
  });
});
