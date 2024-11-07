import config from "../env.js";
import * as Herramientas from "../js/Herramientas.js";

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

      // Columna código del cliente
      const cellDocumento = document.createElement("td");
      cellDocumento.className = "text-center";
      cellDocumento.textContent = cliente.codigo_cliente;
      row.appendChild(cellDocumento);

      // Columna contrato
      const cellContrato = document.createElement("td");
      cellContrato.className = "text-center";

      const button = document.createElement("button");
      button.textContent = "Ver Contrato";
      button.className = "btn btn-primary";
      button.onclick = () => {
        window.location.href = `${config.HOST}views/Averias/table.php?id=${cliente.id_cliente}`;
      };
      

      cellContrato.appendChild(button);
      row.appendChild(cellContrato);
      tbody.appendChild(row);
    });

    $('#listarClienteyContratos').DataTable({
      paging: true,
      lengthChange: false,
      searching: true,
      ordering: true,
      info: true,
      autoWidth: false
    });
  })();
});
