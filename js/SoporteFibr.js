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
      const fibraFiltrado = JSON.parse(dataCable[0].ficha_instalacion).cable;
    } catch (error) {

    }
  }
});
