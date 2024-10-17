import config from "../env.js";

document.addEventListener("DOMContentLoaded", () => {
  (async () => {
    const respuesta = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=listarClientes`);
    const data = await respuesta.json();

    const tbody = document.querySelector("#listarClienteyContratos tbody");

    data.forEach((cliente, index) => {
      const row = document.createElement("tr");

      // Crear celdas para los datos del cliente
      const cellIndex = document.createElement("td");
      cellIndex.className = "text-center";
      cellIndex.textContent = index + 1; // Para mostrar el número de fila
      row.appendChild(cellIndex);

      const cellNombre = document.createElement("td");
      cellNombre.className = "text-center";
      cellNombre.textContent = cliente.nombre_cliente;
      row.appendChild(cellNombre);

      const cellDocumento = document.createElement("td");
      cellDocumento.className = "text-center";
      cellDocumento.textContent = cliente.codigo_cliente;
      row.appendChild(cellDocumento);

      const cellContrato = document.createElement("td");
      cellContrato.className = "text-center";

      // Crear botón para el contrato
      const button = document.createElement("button");
      button.textContent = "Ver Contrato";
      button.className = "btn btn-primary"; // Puedes ajustar el estilo del botón
      button.onclick = () => {
        // Aquí puedes agregar la lógica para ver el contrato
        alert(`Ver contrato para: ${cliente.nombre_cliente}`);
      };
      cellContrato.appendChild(button);
      row.appendChild(cellContrato);

      // Agregar la fila a la tabla
      tbody.appendChild(row);
    });
  })();
});



