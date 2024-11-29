import config from "../env.js";
import { FichaSoporte, inicializarDataTable } from "./Herramientas.js";

// Evento que se ejecuta cuando el DOM ha sido completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const serv = urlParams.get("tiposervicio");

  let idSoporte = -1;

  // Función autoejecutable para inicializar datos
  (async function () {
    try {
      idSoporte = await obtenerReferencias();
      if (idSoporte) {
        //await obtenerProblema(idSoporte);
        //crearSelectYBoton();
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
      const dataFibra = await FichaSoporte(idSoporte);
      const fibraFiltrado = JSON.parse(dataFibra[0].ficha_instalacion).fibraOptica;
      console.log(fibraFiltrado);
      //Asignacion para el campo de plan.
      console.log(fibraFiltrado.plan);
      
      //
      console.log(fibraFiltrado);

      //
      console.log(fibraFiltrado);

      //
      console.log(fibraFiltrado);

      //
      console.log(fibraFiltrado);


    } catch (error) {
      console.error("Error en data de Fibra:", error);
    }
  }
});
