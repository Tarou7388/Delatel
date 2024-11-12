import config from "../env.js";

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idContrato = urlParams.get("idContrato");

  if (idContrato) {
    try {
      const response = await fetch(`${config.HOST}app/controllers/Averias.controllers.php?operacion=buscarAveriaPorContrato&valor=${idContrato}`);
      const averias = await response.json();

      if (averias.length === 0) {
        showToast("No tienes ninguna avería", "INFO");
      } else {
        const averia = averias[0]; // Asumimos que solo obtienes una avería por contrato
        const soporteData = JSON.parse(averia.soporte);

        // Asignar valores a los campos de "Datos del Cliente"
        document.getElementById("txtNrodocumento").value = averia.id_soporte;
        document.getElementById("txtCliente").value = averia;
        document.getElementById("txtFecha").value = averia.fecha_hora_solicitud.split(" ")[0];

        // Parámetros Técnicos
        document.getElementById("slcPeriodo").value = soporteData.parametroscable.periodo[0];
        document.getElementById("txtPotencia").value = soporteData.parametroscable.potencia;
        document.getElementById("txtSintonizador").value = soporteData.parametroscable.sintonizador;
        document.getElementById("txtNumTriplexor").value = soporteData.parametroscable.triplexor.cantidad;
        document.getElementById("slcTriplexor").value = soporteData.parametroscable.triplexor.tipo[0];
        document.getElementById("txtNumSpliter").value = soporteData.parametroscable.spliter[0].cantidad;
        document.getElementById("slcSpliter").value = soporteData.parametroscable.spliter[0].tipo;
        document.getElementById("txtCable").value = soporteData.parametroscable.cable;
        document.getElementById("txtConector").value = soporteData.parametroscable.conectores;

        // Estado Inicial
        document.getElementById("txtaEstadoInicial").value = averia.descripcion_solucion;

        // Cambios Técnicos
        document.getElementById("slcPeriodo").value = soporteData.cambioscable.periodo[0];
        document.getElementById("txtPotencia").value = soporteData.cambioscable.potencia;
        document.getElementById("txtSintonizador").value = soporteData.cambioscable.sintonizador;
        document.getElementById("txtNumTriplexor").value = soporteData.cambioscable.triplexor.cantidad;
        document.getElementById("slcTriplexor").value = soporteData.cambioscable.triplexor.tipo[0];
        document.getElementById("txtNumSpliter").value = soporteData.cambioscable.spliter[0].cantidad;
        document.getElementById("slcSpliter").value = soporteData.cambioscable.spliter[0].tipo;
        document.getElementById("txtCable").value = soporteData.cambioscable.cable;
        document.getElementById("txtConector").value = soporteData.cambioscable.conectores;

        // Procedimiento de Solución
        document.getElementById("txtaProceSolucion").value = averia.descripcion_solucion;
      }
    } catch (error) {
      console.error("Error al obtener las averías:", error);
    }
  }
});
