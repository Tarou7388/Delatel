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
      <td>${contrato.fecha_inicio}</td>
      <td>${contrato.fecha_fin}</td>
      <td>
        <button class="btn btn-primary btn-averias" data-id="${contrato.id_contrato}">Ver Averías</button>
      </td>
      <td>
        <button class="btn btn-secondary btn-detalle" 
                data-bs-toggle="modal" 
                data-bs-target="#detalleContrato" 
                data-id="${contrato.id_contrato}" 
                data-paquete="${contrato.paquete}" 
                data-direccion="${contrato.direccion_servicio}" 
                data-fechainicio="${contrato.fecha_inicio}" 
                data-fechafin="${contrato.fecha_fin}" 
                data-referencia="${contrato.referencia}" 
                data-sector="${contrato.sector}">
          Ver Detalles
        </button>
      </td>
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
        if (data == "") {
          showToast("No tiene averias")
        } else {
          window.location.href = `${config.HOST}views/Reportes/listarReporte?idContrato=${idContrato}&nombreCliente=${encodeURIComponent(nombreCliente)}`;
        }
      });
    });
    document.querySelectorAll(".btn-detalle").forEach(button => {
      button.addEventListener("click", (event) => {
        const paquete = event.target.getAttribute("data-paquete");
        const direccion = event.target.getAttribute("data-direccion");
        const fechaInicio = event.target.getAttribute("data-fechainicio");
        const fechaFin = event.target.getAttribute("data-fechafin");
        const referencia = event.target.getAttribute("data-referencia");
        const sector = event.target.getAttribute("data-sector");

        // Actualizar el contenido del modal
        document.querySelector("#nombrePersona").textContent = `Detalles del Contrato`;
        document.querySelector(".modal-body").innerHTML = `
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td><strong>Paquete:</strong></td>
              <td>${paquete}</td>
            </tr>
            <tr>
              <td><strong>Dirección del Servicio:</strong></td>
              <td>${direccion}</td>
            </tr>
            <tr>
              <td><strong>Fecha de Inicio:</strong></td>
              <td>${fechaInicio}</td>
            </tr>
            <tr>
              <td><strong>Fecha de Fin:</strong></td>
              <td>${fechaFin}</td>
            </tr>
            <tr>
              <td><strong>Referencia:</strong></td>
              <td>${referencia}</td>
            </tr>
            <tr>
              <td><strong>Sector:</strong></td>
              <td>${sector}</td>
            </tr>
          </table>
      `;
      });
    });
  }
});
