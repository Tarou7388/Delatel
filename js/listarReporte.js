import config from '../env.js';

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idContrato = urlParams.get("idContrato");
  const nombreCliente = urlParams.get("nombreCliente");
  let tipoServicio = "";

  if (nombreCliente) {
    document.getElementById("nombreCliente").textContent = decodeURIComponent(nombreCliente);
  }

  if (idContrato) {
    // Fetch para obtener el contrato y el tipo de servicio
    const contratoRespuesta = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=buscarContratoId&id=${idContrato}`);
    const contrato = await contratoRespuesta.json();
    tipoServicio = contrato[0].tipos_servicio; // Guardamos el tipo de servicio

    // Fetch para obtener las averías del contrato
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

    // Evento click en cada botón "Ver Soporte"
    document.querySelectorAll(".btn-ver-soporte").forEach(button => {
      button.addEventListener("click", (e) => {
        const idSoporte = e.target.getAttribute("data-id-soporte");
        const tipoServicio = e.target.getAttribute("data-tipo-servicio");
        const idContrato = e.target.getAttribute("data-id-contrato");

        // Llama a la función para actualizar el modal con la información correspondiente
        actualizarModal(idSoporte, tipoServicio, idContrato);
      });
    });
  }
});

// Función para actualizar y mostrar el modal
function actualizarModal(idSoporte, tipoServicio, idContrato) {
  const modalTitle = document.querySelector("#nombrePersona");
  const modalBody = document.querySelector(".modal-body");

  // Actualizar el título del modal
  modalTitle.textContent = `Soporte ID: ${idSoporte}`;

  // Simular los tipos de servicio como opciones dinámicas
  const servicios = tipoServicio.split(","); // Supongamos que los servicios vienen separados por comas

  // Limpiar el contenido del modal y generar los `divs`
  modalBody.innerHTML = "";
  servicios.forEach(servicio => {
    const div = document.createElement("div");
    div.className = "option-div border p-3 mb-2";
    div.textContent = `Tipo de Servicio: ${servicio}`;
    div.dataset.servicio = servicio; // Asignamos el tipo de servicio como atributo

    // Agregar un evento click para seleccionar el div
    div.addEventListener("click", () => {
      let vistaURL = "";

      switch (servicio) {
        case "CABL":
          vistaURL = `${config.HOST}views/Soporte/SoporteCABL?idReporte=${idSoporte}&idContrato=${idContrato}`;
          break;
        case "WISP":
          vistaURL = `${config.HOST}views/Soporte/SoporteWISP?idReporte=${idSoporte}&idContrato=${idContrato}`;
          break;
        case "FIBR":
          vistaURL = `${config.HOST}views/Soporte/SoporteFIBR?idReporte=${idSoporte}&idContrato=${idContrato}`;
          break;
        default:
          showToast("Tipo de servicio no reconocido", "ERROR");
          return;
      }
      window.location.href = vistaURL;
    });

    modalBody.appendChild(div);
  });

  // Mostrar el modal
  const modal = new bootstrap.Modal(document.querySelector("#detalleAveria"));
  modal.show();
}
