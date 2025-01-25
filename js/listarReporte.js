import config from '../env.js';
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener("DOMContentLoaded", async () => {
  let login = await Herramientas.obtenerLogin();
  const urlParams = new URLSearchParams(window.location.search);
  const idContrato = urlParams.get("idContrato");
  const nombreCliente = urlParams.get("nombreCliente");
  let tipoServicio = "";

  if (nombreCliente) {
    document.getElementById("nombreCliente").textContent = decodeURIComponent(nombreCliente);
  }

  if (idContrato) {

    const contratoRespuesta = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=buscarContratoId&id=${idContrato}`);
    const contrato = await contratoRespuesta.json();
    tipoServicio = contrato[0].tipos_servicio;

    const respuesta = await fetch(`${config.HOST}app/controllers/Averias.controllers.php?operacion=buscarAveriaPorContrato&valor=${idContrato}`);
    const averias = await respuesta.json();
    console.log(averias);

    const tbody = document.querySelector("#listarAverias tbody");
    averias.forEach((averia, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${averia.nombre_tecnico}</td>
        <td>${averia.fecha_hora_solicitud}</td>
        <td>${averia.fecha_hora_asistencia}</td>
        <td><button class="btn btn-primary btn-ver-soporte" 
                    data-id-soporte="${averia.id_soporte}" 
                    data-id-contrato="${idContrato}" 
                    data-tipo-servicio="${tipoServicio}">
              Ver Soporte
            </button></td>
      `;
      tbody.appendChild(row);
    });

    $('#listarAverias').DataTable({
      paging: true,
      lengthChange: false,
      searching: true,
      ordering: true,
      info: true,
      autoWidth: false,
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
      }
    });

    document.querySelectorAll(".btn-ver-soporte").forEach(button => {
      button.addEventListener("click", (e) => {
        const idSoporte = e.target.getAttribute("data-id-soporte");
        const tipoServicio = e.target.getAttribute("data-tipo-servicio");
        const idContrato = e.target.getAttribute("data-id-contrato");

        actualizarModal(idSoporte, tipoServicio, idContrato);
      });
    });
  }
});

function actualizarModal(idSoporte, tipoServicio, idContrato) {
  const modalTitle = document.querySelector("#nombrePersona");
  const modalBody = document.querySelector(".modal-body");

  modalTitle.textContent = `Soporte ID: ${idSoporte}`;

  const servicios = tipoServicio.split(",");

  modalBody.innerHTML = "";
  servicios.forEach(servicio => {
    const div = document.createElement("div");
    div.className = "option-div border p-3 mb-2";
    div.textContent = `Tipo de Servicio: ${servicio}`;
    div.dataset.servicio = servicio;

    div.addEventListener("click", () => {
      let vistaURL = "";

      switch (servicio) {
        case "CABL":
          vistaURL = `${config.HOST}views/reports/Averia_Cable/soporte.php?idSoporte=${idSoporte}`;
          break;
        case "WISP":
          vistaURL = `${config.HOST}views/reports/Averia_WISP/soporte.php?idSoporte=${idSoporte}`;
          break;
        case "FIBR":
          vistaURL = `${config.HOST}views/reports/Averia_Fibra/soporte.php?idSoporte=${idSoporte}`;
          break;
        default:
          showToast("Tipo de servicio no reconocido", "ERROR");
          return;
      }
      window.open(vistaURL, '_blank');
    });

    modalBody.appendChild(div);
  });

  // Mostrar el modal
  const modal = new bootstrap.Modal(document.querySelector("#detalleAveria"));
  modal.show();
}
