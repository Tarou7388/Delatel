import config from "../env.js";
import { FichaSoporte, inicializarDataTable } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  const txtPotencia = document.getElementById("txtPotencia");
  const txtSintonizador = document.getElementById("txtSintonizador");
  const slcTriplexor = document.getElementById("slcTriplexor");
  const txtNumSpliter = document.getElementById("txtNumSpliter");
  const txtCable = document.getElementById("txtCable");
  const txtConector = document.getElementById("txtConector");
  const txtPrecioCable = document.getElementById("txtPrecioCable");
  const txtPrecioConector = document.getElementById("txtPrecioConector");
  const txtaEstadoInicial = document.getElementById("txtaEstadoInicial")


  const form = document.getElementById("form-cable");
  const urlParams = new URLSearchParams(window.location.search);
  const serv = urlParams.get("tiposervicio");

  let idSoporte = -1;

  /**
   * Función para obtener las referencias del soporte
   * de las cuales se obtendrá para obtener el problema del soporte
   * y llenar los campos de la ficha de soporte
   */
  (async function () {
    idSoporte = await obtenerReferencias();
    if (idSoporte) {
      await obtenerProblema(idSoporte);
      crearSelectYBoton();

      //await ArmadoJsonCable();
    } else {
      //Código del reporte.
      const urlParams = new URLSearchParams(window.location.search);
      const idContrato = urlParams.get("idContrato");

      if (idContrato) {
        try {
          const response = await fetch(`${config.HOST}app/controllers/Averias.controllers.php?operacion=buscarAveriaPorContrato&valor=${idContrato}`);
          const averias = await response.json();

          if (averias.length === 0) {
            showToast("No tienes ninguna avería", "INFO");
          } else {
            const averia = averias[0];
            const soporteData = JSON.parse(averia.soporte);

            document.getElementById("txtNrodocumento").value = averia.id_soporte;
            document.getElementById("txtCliente").value = averia;
            document.getElementById("txtFecha").value = averia.fecha_hora_solicitud.split(" ")[0];

            document.getElementById("txtPotencia").value = soporteData.parametroscable.potencia;
            document.getElementById("txtSintonizador").value = soporteData.parametroscable.sintonizador;
            document.getElementById("txtNumTriplexor").value = soporteData.parametroscable.triplexor.cantidad;
            document.getElementById("slcTriplexor").value = soporteData.parametroscable.triplexor.tipo[0];
            document.getElementById("txtNumSpliter").value = soporteData.parametroscable.spliter[0].cantidad;
            document.getElementById("slcSpliter").value = soporteData.parametroscable.spliter[0].tipo;
            document.getElementById("txtCable").value = soporteData.parametroscable.cable;
            document.getElementById("txtConector").value = soporteData.parametroscable.conectores;

            document.getElementById("txtaEstadoInicial").value = averia.descripcion_solucion;

            document.getElementById("txtPotencia").value = soporteData.cambioscable.potencia;
            document.getElementById("txtSintonizador").value = soporteData.cambioscable.sintonizador;
            document.getElementById("txtNumTriplexor").value = soporteData.cambioscable.triplexor.cantidad;
            document.getElementById("slcTriplexor").value = soporteData.cambioscable.triplexor.tipo[0];
            document.getElementById("txtNumSpliter").value = soporteData.cambioscable.spliter[0].cantidad;
            document.getElementById("slcSpliter").value = soporteData.cambioscable.spliter[0].tipo;
            document.getElementById("txtCable").value = soporteData.cambioscable.cable;
            document.getElementById("txtConector").value = soporteData.cambioscable.conectores;

            document.getElementById("txtaEstadoFinal").value = averia.descripcion_solucion;
          }
        } catch (error) {
          console.error("Error al obtener las averías:", error);
        }
      }
    }
  })();

  /**
   * Función para obtener el id del soporte, el nro de documento y 
   * el tipo de servicio del contrato desde la URL
   */
  async function obtenerReferencias() {
    const urlParams = new URLSearchParams(window.location.search);
    // Obtener el id del soporte desde la URL
    const doc = urlParams.get("doc");
    const idSoporte = urlParams.get("idsoporte");
    const tiposervicio = urlParams.get("tiposervicio");
    await llenadoDeDatos(doc, idSoporte, tiposervicio);

    return idSoporte;
  }

  /**
   * Función para obtener el problema del soporte
   * hace una consulta a la base de datos y llena el textarea con la descripción del problema
   * @param {string} idSoporte - Id del soporte
   * @returns {Promise<void>}
   */
  async function obtenerProblema(idSoporte) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
    const data = await respuesta.json();
    console.log(data);

    $("#txtaEstadoInicial").val(data[0].descripcion_problema);
  }

  /**
   * Función para llenar los datos del cliente y del soporte en la parte de parametros de la ficha de soporte
   * @param {string} doct - Documento del cliente
   * @param {string} idSoporte - Id del soporte
   * @param {string} tiposervicio - Tipo de servicio /-->/ Actualmente sin uso
   * @returns {Promise<void>}
   */
  async function llenadoDeDatos(doct, idSoporte, tiposervicio) {
    try {
      const respuesta = await fetch(`${config.HOST}/app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${doct}`);
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
      const dataCable = await FichaSoporte(idSoporte);
      const cableFiltrado = JSON.parse(dataCable[0].ficha_instalacion).cable;

      //console.log(dataCable[0].ficha_instalacion);
      /***  Asignacion de los datos del cable ***/
      //Asignacion de la potencia
      console.log(cableFiltrado.potencia);
      txtPotencia.value = cableFiltrado.potencia;

      //Asignacion de los sintonizadores
      console.log(cableFiltrado.sintonizadores);
      const sintonizadores = cableFiltrado.sintonizadores.length;
      txtSintonizador.value = sintonizadores;

      //Asignacion de los triplores
      console.log(cableFiltrado.triplexor);
      // Parsea los valores de cargador y requerido del objeto triplexor
      const cargador = JSON.parse(cableFiltrado.triplexor.cargador);
      const requerido = JSON.parse(cableFiltrado.triplexor.requerido);

      // Lógica para seleccionar el índice del triplexor basado en las condiciones:
      // - Si no hay cargador pero es requerido -> índice 3
      // - Si hay cargador y es requerido -> índice 2  
      // - En cualquier otro caso -> índice 1
      if (!cargador && requerido) {
        slcTriplexor.selectedIndex = 3;
      } else if (cargador && requerido) {
        slcTriplexor.selectedIndex = 2;
      } else {
        slcTriplexor.selectedIndex = 1;
      }

      //Asignacion de los spliter
      console.log(cableFiltrado.spliter);
      txtNumSpliter.value = cableFiltrado.spliter[0].cantidad;
      console.log(cableFiltrado.spliter[0].tipo);
      slcSpliter.value = cableFiltrado.spliter[0].tipo;

      //Asignacion del array de cables
      console.log(cableFiltrado.cable);
      txtCable.value = cableFiltrado.cable.metrosadicionales;
      //Calculo para el total de metros * precio
      txtPrecioCable.value = (cableFiltrado.cable.metrosadicionales * cableFiltrado.cable.preciometro).toFixed(2);

      //Asignacion del array de conectores      
      console.log(cableFiltrado.conector);
      txtConector.value = cableFiltrado.conector.numeroconector;
      //Calculo para el total de cantidad * precio
      txtPrecioConector.value = (cableFiltrado.conector.numeroconector * cableFiltrado.conector.precio).toFixed(2);

    } catch (error) {
      console.error("Error en FichaInstalacion:", error);
    }

    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
      const data = await respuesta.json();
      txtaEstadoInicial.value = data[0].descripcion_problema;

    } catch (error) {
      console.error("Error en obtener el problema:", error);
    }

  }

  /**
   * Crea un elemento de selección (select) y un botón, y los agrega al DOM.
   * El select se llena con datos obtenidos de una API.
   * El botón se utiliza para guardar la ficha.
   * 
   * @async
   * @function crearSelectYBoton
   */
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

    const solutionTextarea = document.getElementById("txtaEstadoFinal");
    solutionTextarea.parentNode.parentNode.appendChild(rowDiv);
  }

  /**
   * ArmadoJsonCable - Recupera datos de soporte por ID de forma asíncrona, los analiza y construye un objeto JSON con parámetros y cambios del cable.
   *
   * @async
   * @function ArmadoJsonCable
   * @returns {Promise<Object>} Una promesa que se resuelve en un objeto que contiene los parámetros y cambios del cable.
   */
  async function ArmadoJsonCable() {
    const Response = await fetch(`${config.HOST}/app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
    const result = await Response.json();

    let soporte = result[0].soporte ? JSON.parse(result[0].soporte) : {};

    const existeClave = Object.keys(soporte).includes(serv);

    if (!existeClave) {
      soporte[serv] = {
        parametroscable: {
          potencia: parseInt(document.getElementById("txtPotencia").value) || 0,
          sintonizador: parseInt(document.getElementById("txtSintonizador").value) || 0,
          triplexor: document.getElementById("slcTriplexor").value === "2" ? "activo" :
            (document.getElementById("slcTriplexorCambio").value === "3" ? "pasivo" : "no lleva"),
          spliter: [
            { cantidad: parseInt(document.getElementById("txtNumSpliter").value) || 0, tipo: document.getElementById("slcSpliter").value }
          ],
          cable: parseInt(document.getElementById("txtCable").value) || 0,
          conectores: parseInt(document.getElementById("txtConector").value) || 0,
        },
        cambioscable: {
          potencia: parseInt(document.getElementById("txtPotenciaCambio").value) || 0,
          sintonizador: parseInt(document.getElementById("txtSintonizadorCambio").value) || 0,
          triplexor: document.getElementById("slcTriplexorCambio").value === "2" ? "activo" :
            (document.getElementById("slcTriplexorCambio").value === "3" ? "pasivo" : "no lleva"),
          spliter: [
            { cantidad: parseInt(document.getElementById("txtNumSpliterCambio").value) || 0, tipo: document.getElementById("slcSpliterCambio").value }
          ],
          cable: parseInt(document.getElementById("txtCableCambio").value) || 0,
          conectores: parseInt(document.getElementById("txtConectorCambio").value) || 0,
        }
      }
    }
    return soporte;
  }

  /**
   * Guarda la información del soporte técnico.
   *
   * @param {Object} data - Los datos del soporte técnico a actualizar.
   * @returns {Promise<void>} - Una promesa que se resuelve cuando la solicitud se completa.
   * @throws {Error} - Lanza un error si la solicitud falla.
   *
   * @example
   * const data = { /* datos del soporte técnico * / };
   * guardarSoporte(data)
   *   .then(() => console.log('Soporte actualizado correctamente.'))
   *   .catch(error => console.error('Error en la solicitud:', error));
   */
  async function guardarSoporte(data) {
    try {
      const response = await fetch(`${config.HOST}/app/controllers/Soporte.controllers.php`, {
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
    const data = await ArmadoJsonCable();
    if (await ask("¿Desea guardar la ficha?")) {
      await guardarSoporte(data);

      window.location.href = `${config.HOST}views/Soporte/listarSoporte`;
    }
  });

});
