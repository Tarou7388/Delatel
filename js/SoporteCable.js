import config from "../env.js";
import { FichaSoporte, FichaSoportePorId } from "./Herramientas.js";

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

  const txtPrecioCableCambio = document.getElementById("txtPrecioCableCambio");
  const txtPrecioConectorCambio = document.getElementById("txtPrecioConectorCambio");

  const txtPlan = document.getElementById("txtPlan");


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
      await ObtenerValores();

      //await ArmadoJsonCable();
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.get("idReporte");
      await reporte(urlParams.get("idReporte"));
    }
  })();

  async function rellenarDocNombre(doct) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${doct}`);
    const data = await respuesta.json();
    $("#txtCliente").val(data[0].nombre);
    $("#txtNrodocumento").val(doct);
  }

  async function reporte(idReporte) {
    try {
      // Obtener datos del soporte
      const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idReporte}`);
      const data = await respuesta.json();
      const dataCable = await FichaSoporte(idReporte);
      const cableFiltrado = JSON.parse(dataCable[0].ficha_instalacion).cable;
      const plan = document.getElementById("txtPlan")
      plan.value = cableFiltrado.plan

      // Llamada necesaria para rellenar el número de documento
      await rellenarDocNombre(data[0].nro_doc);

      // Parsear el campo `soporte`
      const soporteData = JSON.parse(data[0].soporte);

      // Extraer parámetros iniciales y cambios técnicos
      const parametrosCable = soporteData.CABL.parametroscable;
      const cambiosCable = soporteData.CABL.cambioscable;

      // Precios
      const precioCable = 1.50;  // Precio del cable por unidad
      const precioConector = 1.00;  // Precio del conector por unidad

      // Función para rellenar y desactivar campos
      const setField = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
          element.value = value || '';
          element.setAttribute('disabled', 'true');
        }
      };

      // Calcular precios
      const calcularPrecio = (cantidadCable, cantidadConectores) => {
        const totalCable = cantidadCable * precioCable;
        const totalConectores = cantidadConectores * precioConector;
        return { totalCable, totalConectores };
      };

      // Cálculo para parámetros iniciales
      const preciosIniciales = calcularPrecio(parametrosCable.cable, parametrosCable.conectores);
      setField('txtPrecioCable', preciosIniciales.totalCable.toFixed(2));  // Precio del cable inicial
      setField('txtPrecioConector', preciosIniciales.totalConectores.toFixed(2));  // Precio de conectores iniciales

      // Cálculo para cambios técnicos
      const preciosCambios = calcularPrecio(cambiosCable.cable, cambiosCable.conectores);
      setField('txtPrecioCableCambio', preciosCambios.totalCable.toFixed(2));  // Precio del cable en cambios
      setField('txtPrecioConectorCambio', preciosCambios.totalConectores.toFixed(2));  // Precio de conectores en cambios

      // Rellenar campos con datos iniciales
      setField('txtPotencia', parametrosCable.potencia);
      setField('txtSintonizador', parametrosCable.sintonizador);
      setField('slcTriplexor', triplexorValue(parametrosCable.triplexor));
      setField('txtNumSpliter', parametrosCable.splitter[0]?.cantidad);
      setField('slcSpliter', parametrosCable.splitter[0]?.tipo);
      setField('txtCable', parametrosCable.cable);
      setField('txtConector', parametrosCable.conectores);
      setField('txtaEstadoInicial', data[0].descripcion_problema);

      // Rellenar campos con datos de cambios técnicos
      setField('txtPotenciaCambio', cambiosCable.potencia);
      setField('txtSintonizadorCambio', cambiosCable.sintonizador);
      setField('slcTriplexorCambio', triplexorValue(cambiosCable.triplexor));
      setField('txtNumSpliterCambio', cambiosCable.splitter[0]?.cantidad);
      setField('slcSpliterCambio', cambiosCable.splitter[0]?.tipo);
      setField('txtCableCambio', cambiosCable.cable);
      setField('txtConectorCambio', cambiosCable.conectores);
      setField('txtaEstadoFinal', data[0].descripcion_solucion);

    } catch (error) {
      console.error("Error en la función reporte:", error);
    }
  }

  // Función auxiliar para convertir triplexor a valores válidos del select
  function triplexorValue(triplexor) {
    switch (triplexor?.toLowerCase()) {
      case 'no lleva': return '1';
      case 'activo': return '2';
      case 'pasivo': return '3';
      default: return '';
    }
  }

  async function ObtenerValores() {

    const urlParams = new URLSearchParams(window.location.search);
    const doc = urlParams.get("doc");
    const idSoporte = urlParams.get("idsoporte");
    const tiposervicio = urlParams.get("tiposervicio");
    const coordenada = urlParams.get("coordenada");

    await cabeceraFicha(doc);

    console.log(doc);

    const respuesta = await FichaSoportePorId(doc, tiposervicio, coordenada);

    if (respuesta[0].soporte != "{}") {
      if (JSON.parse(respuesta[0].soporte).CABL) {
        await cargardatos(JSON.parse(respuesta[0].soporte).CABL.cambioscable);
      }
      else {
        await llenadoDeDatos(doc, idSoporte);
      }

    } else {
      await llenadoDeDatos(doc, idSoporte);
    }

  }

  async function cabeceraFicha(doct) {
    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${doct}`);
      const data = await respuesta.json();
      console.log(doct);
      console.log(data[0].nombre);
      $("#txtCliente").val(data[0].nombre);
      $("#txtNrodocumento").val(doct);
    } catch (error) {
      console.error("Error en llenadoDeDatos:", error);
    }
  }

  async function cargardatos(data) {
    console.log(data);
    txtPotencia.value = data.potencia;
    txtSintonizador.value = data.sintonizador;

    for (let i = 0; i < slcTriplexor.options.length; i++) {
      if (slcTriplexor.options[i].text.trim().toLowerCase() === data.triplexor.trim().toLowerCase()) {
        slcTriplexor.selectedIndex = i;
        break;
      }
    }
    console.log(data);
    txtNumSpliter.value = data.splitter[0].cantidad;
    slcSpliter.selectedIndex = data.splitter[0].tipo;
    txtPlan.value = data.plan;
    txtCable.value = data.cable.metrosadicionales;
    txtPrecioCable.value = data.cable.metrosadicionales * data.cable.preciometro;
    txtConector.value = data.conector.numeroconector;
    txtPrecioConector.value = data.conector.precio * data.conector.numeroconector;
  }

  /**
   * Función para obtener el id del soporte, el nro de documento y 
   * el tipo de servicio del contrato desde la URL
   */
  async function obtenerReferencias() {
    const urlParams = new URLSearchParams(window.location.search);
    const idSoporte = urlParams.get("idsoporte");

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
    $("#txtaEstadoInicial").val(data[0].descripcion_problema);
  }

  /**
   * Función para llenar los datos del cliente y del soporte en la parte de parametros de la ficha de soporte
   * @param {string} doct - Documento del cliente
   * @param {string} idSoporte - Id del soporte
   * @param {string} tiposervicio - Tipo de servicio /-->/ Actualmente sin uso
   * @returns {Promise<void>}
   */
  async function llenadoDeDatos(doct, idSoporte) {
    try {
      const dataCable = await FichaSoporte(idSoporte);
      const cableFiltrado = JSON.parse(dataCable[0].ficha_instalacion).cable;

      console.log(cableFiltrado);
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
      // Asigna el valor del select según los valores de cargador y requerido
      if (!cargador && requerido) {
        slcTriplexor.selectedIndex = 3;
      } else if (cargador && requerido) {
        slcTriplexor.selectedIndex = 2;
      } else {
        slcTriplexor.selectedIndex = 1;
      }

      //Asignacion de los spliter
      console.log(cableFiltrado.splitter);
      txtNumSpliter.value = cableFiltrado.splitter[0].cantidad;
      console.log(cableFiltrado.splitter[0].tipo);
      slcSpliter.value = cableFiltrado.splitter[0].tipo;

      //Asignacion del array de cables
      console.log(cableFiltrado.cable);
      txtCable.value = cableFiltrado.cable.metrosadicionales;
      //Calculo para el total de metros * precio
      txtPrecioCable.value = (cableFiltrado.cable.metrosadicionales * cableFiltrado.cable.preciometro).toFixed(2);

      //Asignacion del array de conectores      
      console.log(cableFiltrado.conector);
      txtConector.value = cableFiltrado.conector.numeroconector;

      // Heredado de Parametros tecnicos
      console.log(cableFiltrado.cable.preciometro);
      txtPrecioCableCambio.value = (cableFiltrado.cable.preciometro).toFixed(2);
      txtPrecioConectorCambio.value = (cableFiltrado.conector.precio).toFixed(2);

      //Calculo para el total de cantidad * precio
      txtPrecioConector.value = (cableFiltrado.conector.numeroconector * cableFiltrado.conector.precio).toFixed(2);

      //Asignar el plan 

      txtPlan.value = cableFiltrado.plan

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
    rowDiv.className = "row g-2 mb-2 mt-2";

    const selectDiv = document.createElement("div");
    selectDiv.className = "col-md ";

    const labelSelect = document.createElement("label");
    labelSelect.innerText = "Tipo de Soporte";
    selectDiv.appendChild(labelSelect);

    const selectSoporte = document.createElement("select");
    selectSoporte.id = "slcTipoSoporte";
    selectSoporte.className = "form-floating form-select";
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
    const Response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
    const result = await Response.json();

    let soporte = result[0].soporte ? JSON.parse(result[0].soporte) : {};

    const existeClave = Object.keys(soporte).includes(serv);

    if (!existeClave) {
      soporte[serv] = {
        parametroscable: {
          plan: document.getElementById("txtPlan").value,
          potencia: parseInt(document.getElementById("txtPotencia").value) || 0,
          sintonizador: parseInt(document.getElementById("txtSintonizador").value) || 0,
          triplexor: document.getElementById("slcTriplexor").value === "2" ? "activo" :
            (document.getElementById("slcTriplexor").value === "3" ? "pasivo" : "no lleva"),
          splitter: [
            { cantidad: parseInt(document.getElementById("txtNumSpliter").value) || 0, tipo: document.getElementById("slcSpliter").value }
          ],
          conector: {
            numeroconector: parseInt(document.getElementById("txtConector").value) || 0,
            precio: parseFloat(document.getElementById("txtPrecioConector").value) || 0
          },
          cable: {
            metrosadicionales: parseInt(document.getElementById("txtCable").value) || 0,
            preciometro: parseFloat(document.getElementById("txtPrecioCable").value) || 0
          }
        },
        cambioscable: {
          plan: document.getElementById("txtPlan").value,
          potencia: parseInt(document.getElementById("txtPotenciaCambio").value) || 0,
          sintonizador: parseInt(document.getElementById("txtSintonizadorCambio").value) || 0,
          triplexor: document.getElementById("slcTriplexorCambio").value === "2" ? "activo" :
            (document.getElementById("slcTriplexorCambio").value === "3" ? "pasivo" : "no lleva"),
          splitter: [
            { cantidad: parseInt(document.getElementById("txtNumSpliterCambio").value) || 0, tipo: document.getElementById("slcSpliterCambio").value }
          ],
          conector: {
            numeroconector: parseInt(document.getElementById("txtConectorCambio").value) || 0,
            precio: parseFloat(document.getElementById("txtPrecioConectorCambio").value) || 0
          },
          cable: {
            metrosadicionales: parseInt(document.getElementById("txtCableCambio").value) || 0,
            preciometro: parseFloat(document.getElementById("txtPrecioCableCambio").value) || 0
          }
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
    const data = await ArmadoJsonCable();
    if (await ask("¿Desea guardar la ficha?")) {
      await guardarSoporte(data);
      window.location.href = `${config.HOST}views/Soporte/listarSoporte`;
    }
  });
});
