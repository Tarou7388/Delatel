import config from "../env.js";

document.addEventListener("DOMContentLoaded", () => {
  (async () => {
    const respuesta = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=listarClientes`);
    const data = await respuesta.json();

    const tbody = document.querySelector("#listarClienteyContratos tbody");
    const modalContratos = new bootstrap.Modal(document.getElementById('modalContratos'));

    data.forEach((cliente, index) => {
      const row = document.createElement("tr");

      const cellIndex = document.createElement("td");
      cellIndex.className = "text-center";
      cellIndex.textContent = index + 1; 
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
      button.className = "btn btn-primary"; 
      button.onclick = async () => {

        const respuestaContratos = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerContratoPorCliente&id=${cliente.id_cliente}`);
        const contratos = await respuestaContratos.json();

        const detallesContrato = document.getElementById('detallesContrato');

        if (contratos.length > 0) {
          // Limpiar el contenido actual
          detallesContrato.innerHTML = '';

          contratos.forEach(contrato => {
            const contratoInfo = `
              <p><strong>Nombre del Cliente:</strong> ${cliente.nombre_cliente}</p>
              <p><strong>ID del Contrato:</strong> ${contrato.id_contrato}</p>
              <p><strong>Dirección:</strong> ${contrato.direccion_servicio}</p>
              <p><strong>Referencia:</strong> ${contrato.referencia}</p>
              <p><strong>Sector:</strong> ${contrato.sector}</p>
              <p><strong>Fecha de Inicio:</strong> ${contrato.fecha_inicio}</p>
              <p><strong>Fecha de Fin:</strong> ${contrato.fecha_fin}</p>
              <button class="btn btn-primary">Averías</button>
              <hr>
            `;
            detallesContrato.innerHTML += contratoInfo;
          });
        } else {
          detallesContrato.textContent = 'No se encontraron contratos para este cliente.';
        }

        modalContratos.show();
      };
      cellContrato.appendChild(button);
      row.appendChild(cellContrato);

      tbody.appendChild(row);
    });
  })();
});




