import config from "../env.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Obtén el id_cliente de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const idCliente = urlParams.get("id");
  const nombreCliente = urlParams.get("nombre");

  if (nombreCliente) {
    document.getElementById("nombreCliente").textContent = decodeURIComponent(nombreCliente);
  }

  if (idCliente) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerContratoPorCliente&id=${idCliente}`);
    const contratos = await respuesta.json();
    console.log(contratos)

    const tbody = document.querySelector("#listarContratos tbody");
    contratos.forEach(contrato => {
      const row = document.createElement("tr");

      // Añade las columnas correspondientes y el botón de averías
      row.innerHTML = `
        <td>${contrato.paquete}</td>
        <td>${contrato.direccion_servicio}</td>
        <td>${contrato.referencia}</td>
        <td>${contrato.sector}</td>
        <td>${contrato.fecha_inicio}</td>
        <td>${contrato.fecha_fin}</td>
        <td><button class="btn btn-primary btn-averias" data-id="${contrato.id_contrato}">Ver Averías</button></td>
      `;

      tbody.appendChild(row);
    });

    // Activa el DataTable
    $('#listarContratos').DataTable({
      paging: true,
      lengthChange: false,
      searching: true,
      ordering: true,
      info: true,
      autoWidth: false
    });

    // Agrega evento para cada botón de averías
    document.querySelectorAll(".btn-averias").forEach(button => {
      button.addEventListener("click", async (event) => {
        const idContrato = event.target.getAttribute("data-id");

        // Hacer fetch al controlador para obtener las averías del contrato
        const respuesta = await fetch(`${config.HOST}app/controllers/Averias.controllers.php?operacion=buscarAveriaPorContrato&valor=${idContrato}`);
        const data = await respuesta.json();
        console.log(data)
        if(data ==""){
          showToast("No tiene averias")
        }else{
          window.location.href = `${config.HOST}views/Reportes/listarAverias?idContrato=${idContrato}&nombreCliente=${encodeURIComponent(nombreCliente)}`;
        }
      });
    });
  }
});
