import config from "../env.js";

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

    const tbody = document.querySelector("#listarAverias tbody");
    averias.forEach((averia, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${averia.nombre_tecnico}</td>
        <td>${averia.fecha_hora_solicitud}</td>
        <td>${averia.fecha_hora_asistencia}</td>
        <td><button class="btn btn-primary btn-ver-soporte" data-id-soporte="${averia.id_soporte}">Ver Soporte</button></td>
      `;
      tbody.appendChild(row);
    });

    $('#listarAverias').DataTable({
      paging: true,
      lengthChange: false,
      searching: true,
      ordering: true,
      info: true,
      autoWidth: false
    });

    // Evento click en cada botón para redirigir a la vista correspondiente
    document.querySelectorAll(".btn-ver-soporte").forEach(button => {
      button.addEventListener("click", (e) => {
        const idSoporte = e.target.getAttribute("data-id-soporte");

        // Redirige a la vista correspondiente según el tipo de servicio
        let vistaURL = "";
        switch (tipoServicio) {
          case "CABL":
            vistaURL = `${config.HOST}views/Soporte/SoporteCABL?idSoporte=${idSoporte}&nombreCliente=${encodeURIComponent(nombreCliente)}`;
            break;
          case "WISP":
            vistaURL = `${config.HOST}views/Soporte/SoporteWISP?idSoporte=${idSoporte}&nombreCliente=${encodeURIComponent(nombreCliente)}`;
            break;
          case "GPON":
            vistaURL = `${config.HOST}views/Soporte/SoporteFIBR?idSoporte=${idSoporte}&nombreCliente=${encodeURIComponent(nombreCliente)}`;
            break;
          default:
            showToast("Tipo de servicio no reconocido", "ERROR");
            return;
        }

        // Redirige a la URL determinada
        window.location.href = vistaURL;
      });
    });
  }
});
