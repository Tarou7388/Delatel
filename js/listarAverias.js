import config from "../env.js";
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idContrato = urlParams.get("idContrato");
  const nombreCliente = urlParams.get("nombreCliente");

  if (nombreCliente) {
    document.getElementById("nombreCliente").textContent = decodeURIComponent(nombreCliente);
  }

  if (idContrato) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Averias.controllers.php?operacion=buscarAveriaPorContrato&valor=${idContrato}`);
    const averias = await respuesta.json();
    console.log(averias)

    const tbody = document.querySelector("#listarAverias tbody");
    averias.forEach((averia, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${averia.nombre_tecnico}</td>
        <td>${averia.fecha_hora_solicitud}</td>
        <td>${averia.fecha_hora_asistencia}</td>
        <td>${averia.descripcion_solucion}</td>
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
  }
});