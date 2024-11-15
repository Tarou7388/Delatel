import config from "../env.js";
import * as Herramientas from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  (async () => {
    const respuesta = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=listarClientes`);
    const data = await respuesta.json();
    console.log(data);

    const tbody = document.querySelector("#listarClienteyContratos tbody");

    data.forEach((cliente, index) => {
      const row = document.createElement("tr");

      // Columna índice
      const cellIndex = document.createElement("td");
      cellIndex.className = "text-center";
      cellIndex.textContent = index + 1;
      row.appendChild(cellIndex);

      // Columna nombre del cliente
      const cellNombre = document.createElement("td");
      cellNombre.className = "text-center";
      cellNombre.textContent = cliente.nombre_cliente;
      row.appendChild(cellNombre);

      // Columna número de documento
      const cellDocumento = document.createElement("td");
      cellDocumento.className = "text-center";
      cellDocumento.textContent = cliente.codigo_cliente;
      row.appendChild(cellDocumento);

      // Columna contrato
      const cellContrato = document.createElement("td");
      cellContrato.className = "text-center";
      const contratoButton = document.createElement("button");
      contratoButton.textContent = "Ver Contrato";
      contratoButton.className = "btn btn-primary";
      contratoButton.onclick = () => {
        const nombreCliente = encodeURIComponent(cliente.nombre_cliente);
        window.location.href = `${config.HOST}views/Reportes/tablaContrato?id=${cliente.id_cliente}&nombre=${nombreCliente}`;
      };
      cellContrato.appendChild(contratoButton);
      row.appendChild(cellContrato);

      // Columna detalles (botón para abrir el modal)
      const cellDetalle = document.createElement("td");
      cellDetalle.className = "text-center";
      const detalleButton = document.createElement("button");
      detalleButton.textContent = "Ver Detalles";
      detalleButton.className = "btn btn-secondary";
      detalleButton.setAttribute("data-bs-toggle", "modal");
      detalleButton.setAttribute("data-bs-target", "#detallePersona");
      detalleButton.onclick = () => {
        // Asigna los datos al modal
        document.querySelector("#nombrePersona").textContent = cliente.nombre_cliente;
        document.querySelector(".modal-body").innerHTML = `
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="font-weight: bold; padding: 5px;">Número de Documento:</td>
              <td style="padding: 5px;">${cliente.codigo_cliente || "No disponible"}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 5px;">Correo electrónico:</td>
              <td style="padding: 5px;">${cliente.email_cliente || "No disponible"}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 5px;">Número de contacto:</td>
              <td style="padding: 5px;">${cliente.telefono_cliente || "No disponible"}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 5px;">Dirección:</td>
              <td style="padding: 5px;">${cliente.direccion_cliente || "No disponible"}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 5px;">Coordenadas:</td>
              <td style="padding: 5px;">${cliente.coordenadas_cliente || "No disponible"}</td>
            </tr>
          </table>
        `;
      };

      cellDetalle.appendChild(detalleButton);
      row.appendChild(cellDetalle);

      tbody.appendChild(row);
    });

    $('#listarClienteyContratos').DataTable({
      paging: true,
      lengthChange: false,
      searching: true,
      ordering: true,
      info: true,
      autoWidth: false,
    });
  })();
});
