import config from "../env.js";
import { FichaSoporte, inicializarDataTable } from "./Herramientas.js";

// Evento que se ejecuta cuando el DOM ha sido completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const serv = urlParams.get("tiposervicio");
  const form = document.getElementById("frm-registro-gpon");

  const txtPlan = document.getElementById("txtPlan");
  const txtPppoe = document.getElementById("txtPppoe");
  const txtPotenciaDos = document.getElementById("txtPotencia");
  const chkCatv = document.getElementById("chkCatv");
  const txtClave = document.getElementById("txtClave");
  const txtVlan = document.getElementById("txtVlan");
  const txtPotencia = document.getElementById("txtPotenciaDos");
  const txtSsid = document.getElementById("txtSsid");
  const txtPass = document.getElementById("txtPass");
  const txtOtros = document.getElementById("txtOtros");

  let idSoporte = -1;

  // Función autoejecutable para inicializar datos
  (async function () {
    try {
      idSoporte = await obtenerReferencias();
      if (idSoporte) {
        //await obtenerProblema(idSoporte);
        await crearSelectYBoton();
        //ArmadoJsonGpon();

        const doc = urlParams.get("doc");
        const idSoporte = urlParams.get("idsoporte");
        const tiposervicio = urlParams.get("tiposervicio");
        await llenadoDeDatos(doc, idSoporte, tiposervicio);
      }
    } catch (error) {
      console.error("Error durante la inicialización:", error);
    }
  })();

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
      const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=listarTipoSoporte`);
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

  async function obtenerReferencias() {
    const urlParams = new URLSearchParams(window.location.search);
    // Obtener el id del soporte desde la URL
    return urlParams.get("idsoporte");
  };

  /**
   * Documentacion sobre que hace:
   * Llenado de datos del cliente y soporte de fibra.
   *
   * @async
   * @function llenadoDeDatos
   * @param {string} doct - Documento del cliente.
   * @param {number} idSoporte - ID del soporte.
   * @param {string} tiposervicio - Tipo de servicio.
   * @returns {Promise<void>} - Promesa que se resuelve cuando los datos han sido llenados.
   * @throws {Error} - Lanza un error si ocurre un problema al obtener los datos del cliente o del soporte.
   */
  async function llenadoDeDatos(doct, idSoporte, tiposervicio) {
    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${doct}`);
      const data = await respuesta.json();
      console.log(doct);
      console.log(data[0].nombre);
      //Asignacion del Nombre del cliente
      $("#txtCliente").val(data[0].nombre);
      //Asignacion del Documento del cliente
      $("#txtNrodocumento").val(doct);
      //Asignacion del Plan
      //...Pendiente
    } catch (error) {
      console.error("Error en llenadoDeDatos:", error);
    }

    try {
      const dataFibra = await FichaSoporte(idSoporte);
      const fibraFiltrado = JSON.parse(dataFibra[0].ficha_instalacion).fibraoptica;
      console.log(JSON.parse(dataFibra[0].ficha_instalacion));
      console.log(fibraFiltrado);
      //Asignacion para el campo de plan.
      console.log(fibraFiltrado.plan);
      txtPlan.value = fibraFiltrado.plan;
      //Asignacion de Usuario PPPoE
      console.log(fibraFiltrado.usuario);
      txtPppoe.value = fibraFiltrado.usuario;
      //Asignacion de clave PPPoE
      console.log(fibraFiltrado.claveacceso);
      txtClave.value = fibraFiltrado.claveacceso;
      //Asignacion potencia 
      console.log(fibraFiltrado);
      txtPotencia.value = fibraFiltrado.potencia;
      //
      console.log(fibraFiltrado);

      //Asignacion potencia 
      console.log(fibraFiltrado);

      //
      console.log(fibraFiltrado);

      //Asignacion potencia 
      console.log(fibraFiltrado);

      //
      console.log(fibraFiltrado);

    } catch (error) {
      console.error("Error en data de Fibra:", error);
    }
  };

  async function ArmadoJsonGpon() {
    const response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
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
  };

  async function guardarSoporte(data) {
    try {
      const response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operacion: 'actualizarSoporte',
          data: {
            idSoporte: idSoporte,
            idTecnico: user['idUsuario'],
            idTipoSoporte: document.getElementById("slcTipoSoporte").value,
            soporte: data,
            idUserUpdate: user['idUsuario'],
            descripcion_solucion: document.getElementById("txtaEstadoFinal").value,
          },
        }),
      });

      const result = await response.json();
      console.log(result.status);
      if (result.status === "success") {
        // Lógica para éxito
        console.log("Soporte actualizado correctamente.");
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }

  }

  /**
   * Llama a la función ArmadoJsonCable para recuperar datos.
   * 
   * @returns {Promise<Object>} Los datos devueltos por la función ArmadoJsonCable.
   */
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = await ArmadoJsonGpon();
    if (await ask("¿Desea guardar la ficha?")) {
      await guardarSoporte(data);

      window.location.href = `${config.HOST}views/Soporte/listarSoporte`;
    }
  });

});
