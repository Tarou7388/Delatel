import config from "../env.js";
import * as Herramientas from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  (async () => {
    const respuesta = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=listarClientes`);
    const data = await respuesta.json();

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
      detalleButton.onclick = () => {
        window.location.href = `${config.HOST}views/reports/Cliente/soporte.php?id=${cliente.id_cliente}`;
      };

      cellDetalle.appendChild(detalleButton);
      row.appendChild(cellDetalle);

      tbody.appendChild(row);
    });
    document.getElementById("printButton").addEventListener("click", () => {
      const modalContent = document.querySelector("#detallePersona .modal-content").innerHTML;
      const printWindow = window.open("", "", "width=800,height=600");
      printWindow.document.write(`
        <html>
          <head>
            <title>Imprimir Detalles del Cliente</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; }
              td { padding: 5px; border: 1px solid #ddd; }
              .modal-header, .modal-footer { display: none; }
            </style>
          </head>
          <body>
            ${modalContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
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
