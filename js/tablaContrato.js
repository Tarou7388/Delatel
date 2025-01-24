import config from "../env.js";
document.addEventListener("DOMContentLoaded", async () => {
  
  const urlParams = new URLSearchParams(window.location.search);
  const idCliente = urlParams.get("id");
  const nombreCliente = urlParams.get("nombre");

  if (nombreCliente) {
    document.getElementById("nombreCliente").textContent = decodeURIComponent(nombreCliente);
  }

  if (idCliente) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerContratoPorCliente&id=${idCliente}`);
    const contratos = await respuesta.json();
    console.log(contratos);

    const tbody = document.querySelector("#listarContratos tbody");
    contratos.forEach(contrato => {
      const row = document.createElement("tr");

      
      row.innerHTML = `
        <td>${contrato.tipos_servicio}</td>
        <td>${contrato.paquete}</td>
        <td>${contrato.direccion_servicio}</td>
        <td>${contrato.fecha_inicio}</td>
        <td>${contrato.fecha_fin}</td>
        <td>
          <button class="btn btn-primary btn-averias" data-id="${contrato.id_contrato}">Averías</button>
        </td>
        <td>
          <button class="btn btn-danger btn-pdf" data-idContrato="${contrato.id_contrato}">
            Ver PDF
          </button>
        </td>
      `;

      tbody.appendChild(row);
    });

    
    $('#listarContratos').DataTable({
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

    
    document.querySelectorAll(".btn-averias").forEach(button => {
      button.addEventListener("click", async (event) => {
        const idContrato = event.target.getAttribute("data-id");

        
        const respuesta = await fetch(`${config.HOST}app/controllers/Averias.controllers.php?operacion=buscarAveriaPorContrato&valor=${idContrato}`);
        const data = await respuesta.json();
        console.log(data);
        if (data == "") {
          showToast("No tiene averías");
        } else {
          window.location.href = `${config.HOST}views/Reportes/listarReporte?idContrato=${idContrato}&nombreCliente=${encodeURIComponent(nombreCliente)}`;
        }
      });
    });

    
    document.querySelectorAll(".btn-pdf").forEach(boton => {
      boton.addEventListener("click", () => {
        const idContrato = boton.getAttribute("data-idContrato");
        
        const contrato = contratos.find(c => c.id_contrato == idContrato);

        if (contrato) {
          if (contrato.tipos_servicio === "WISP") {
            window.open(`${config.HOST}views/reports/Contrato_servicio_WISP/soporte.php?id=${idContrato}`, "_blank");
          } else {
            window.open(`${config.HOST}views/reports/Contrato_servicio/soporte.php?id=${idContrato}`, "_blank");
          }
        } else {
          showToast("Contrato no encontrado.");
        }
      });
    });

  }
});
