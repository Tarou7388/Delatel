import config from "../env.js";
import { FichaSoporte, formatoIPinput } from "./Herramientas.js";

// Evento que se ejecuta cuando el DOM ha sido completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const serv = urlParams.get("tiposervicio");
  const form = document.getElementById("frm-registro-gpon");

  //Parametros tecnicos de la ficha
  const txtPlan = document.getElementById("txtPlan");
  const txtPppoe = document.getElementById("txtPppoe");
  const txtPotencia = document.getElementById("txtPotencia");
  const chkCatv = document.getElementById("chkCatv");
  const txtClave = document.getElementById("txtClave");
  const txtVlan = document.getElementById("txtVlan");
  const txtSsid = document.getElementById("txtSsid");
  const txtPass = document.getElementById("txtPass");
  const txtIp = document.getElementById("txtIp");
  const slcRpetidor = document.getElementById("slcRpetidor");
  const txtaEstadoInicial = document.getElementById("txtaEstadoInicial");

  //Cambios de la ficha
  const txtCambiosPppoe = document.getElementById("txtCambiosPppoe");
  const txtCambiosClave = document.getElementById("txtCambiosClave");
  const txtCambiosVlan = document.getElementById("txtCambiosVlan");
  const txtCambiosIp = document.getElementById("txtCambiosIp");

  let idSoporte = -1;

  // Función autoejecutable para inicializar datos
  (async function () {
    try {
      idSoporte = await obtenerReferencias();
      if (idSoporte) {
        await crearSelectYBoton();

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
      const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
      const data = await respuesta.json();
      txtaEstadoInicial.value = (data[0].descripcion_problema);

    } catch (error) {
      console.log("Error en Obtener el estado Inicial:", error);
    }

    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${doct}`);
      const data = await respuesta.json();
      console.log(doct);
      console.log(data[0].nombre);
      //Asignacion del Nombre del cliente
      $("#txtCliente").val(data[0].nombre);
      //Asignacion del Documento del cliente
      $("#txtNrodocumento").val(doct);

    } catch (error) {
      console.error("Error en llenadoDeDatos:", error);
    }

    try {
      const dataFibra = await FichaSoporte(idSoporte);
      const fibraFiltrado = JSON.parse(dataFibra[0].ficha_instalacion).fibraOptica;
      console.log(dataFibra[0]);

      // Asignacion para el campo de plan.
      console.log(fibraFiltrado.plan);
      txtPlan.value = fibraFiltrado.plan;

      // Asignacion de Usuario PPPoE
      console.log(fibraFiltrado.usuario);
      txtPppoe.value = fibraFiltrado.usuario;

      // Asignacion de clave PPPoE
      console.log(fibraFiltrado.claveAcceso);
      txtClave.value = fibraFiltrado.claveAcceso;

      //Asignacion de los campos que no pueden cambiar sin procesos externos
      txtCambiosPppoe.value = fibraFiltrado.usuario;
      txtCambiosClave.value = fibraFiltrado.claveAcceso;
      txtCambiosVlan.value = fibraFiltrado.vlan;

      // Asignacion potencia 
      console.log(fibraFiltrado);
      txtPotencia.value = fibraFiltrado.potencia;

      // Catv
      console.log(fibraFiltrado.moden.catv);
      chkCatv.checked = fibraFiltrado.moden.catv;

      // Vlan
      console.log(fibraFiltrado.vlan);
      txtVlan.value = fibraFiltrado.vlan;

      // DATOS MODEN
      // Asignacion repetidores
      const slcRpetidor = document.getElementById('slcRpetidor');
      fibraFiltrado.repetidores.forEach(repetidor => {
        const option = document.createElement('option');
        option.value = repetidor.numero;
        option.text = `${repetidor.ssid} (${repetidor.ip})`;
        slcRpetidor.appendChild(option);
      });


      //Seleccionar Automaticamente el primer repetidor, y ejecutar programaticamente el evento change
      slcRpetidor.selectedIndex = 1;
      const changeEvent = new Event('change');
      slcRpetidor.dispatchEvent(changeEvent);

    } catch (error) {
      console.error("Error en data de Fibra:", error);
    }
  };

  slcRpetidor.addEventListener("change", async () => {
    await cargarEnInputs();
  });

  async function cargarEnInputs() {
    try {
      const selectedValue = parseInt(slcRpetidor.value); // Convertir el valor seleccionado a número
      console.log("Valor seleccionado:", selectedValue);

      const respuesta = await FichaSoporte(idSoporte);
      const fibraFiltrado = JSON.parse(respuesta[0].ficha_instalacion).fibraOptica;

      const repetidorSeleccionado = fibraFiltrado.repetidores.find(
        repetidor => repetidor.numero === selectedValue
      );

      if (repetidorSeleccionado) {
        console.log("Repetidor seleccionado:", repetidorSeleccionado);
        txtIp.value = repetidorSeleccionado.ip;
        txtSsid.value = repetidorSeleccionado.ssid;
        txtPass.value = repetidorSeleccionado.contrasenia;
      } else {
        console.warn("No se encontró un repetidor con el valor seleccionado.");
      }
    } catch (error) {
      console.error("Error al cargar datos del repetidor:", error);
    }
  }

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

  txtCambiosIp.addEventListener("input", async (event) => {
    await formatoIPinput(event);
  });

});
