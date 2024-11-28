import config from "../env.js";
import { FichaSoporte, inicializarDataTable } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  const txtPotencia = document.getElementById("txtPotencia");
  const txtSintonizador = document.getElementById("txtSintonizador");
  const slcTriplexor = document.getElementById("slcTriplexor");
  const txtNumSpliter = document.getElementById("txtNumSpliter");
  const txtCable = document.getElementById("txtCable");
  const txtConector = document.getElementById("txtConector");



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
      //crearSelectYBoton();
      //await ArmadoJsonCable();
    }
  })();

  /**
   * Función para obtener el id del soporte, el nro de documento y 
   * el tipo de servicio del contrato desde la URL
   */
  async function obtenerReferencias() {
    const urlParams = new URLSearchParams(window.location.search);
    await llenadoDeDatos(urlParams.get("doc"), urlParams.get("idsoporte"), urlParams.get("tiposervicio"));
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
      console.log(cableFiltrado);
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

      //Asignacion del array de conectores      
      console.log(cableFiltrado.conector);
      txtConector.value = cableFiltrado.conector.numeroconector;

    } catch (error) {
      console.error("Error en FichaInstalacion:", error);
    }


    async function calculovalor()
    {

    }


  }
});
