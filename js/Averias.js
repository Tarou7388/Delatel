import config from "../env.js";

document.addEventListener("DOMContentLoaded", () => {
  (async () => {
    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=listarContratos`);
      const data = await respuesta.json();
      console.log(data);

      const clientesContratos = data.reduce((acc, contrato) => {
        const cliente = contrato.nombre_cliente;
        if (!acc[cliente]) {
          acc[cliente] = [];
        }
        acc[cliente].push({ servicio: contrato.servicio, idContrato: contrato.id_contrato });
        return acc;
      }, {});

      const tbody = document.querySelector("#listarClienteyContratos tbody");
      Object.keys(clientesContratos).forEach((cliente, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="text-center">${index + 1}</td>
          <td>${cliente}</td>
          <td class="text-center"><button class="btn btn-primary btn-sm" data-cliente="${cliente}">Detalle</button></td>
        `;
        tbody.appendChild(row);

        const detalleButton = row.querySelector(".btn-primary");

        detalleButton.addEventListener("click", (event) => {
          const clienteSeleccionado = event.target.getAttribute("data-cliente");
          const servicios = clientesContratos[clienteSeleccionado];

          // Actualizar contenido del modal con una lista de servicios
          const modalTitle = document.querySelector(".modal-title");
          const modalBody = document.querySelector(".modal-body");

          modalTitle.textContent = `Contratos de ${clienteSeleccionado}`;

          // Crear la lista de servicios con enlaces a detalles
          const serviciosList = servicios.map(servicio => `
            <li>
              <button class="btn btn-link" data-idcontrato="${servicio.idContrato}">
                ${servicio.servicio}
              </button>
            </li>
          `).join("");

          modalBody.innerHTML = `<ul>${serviciosList}</ul>`;

          // Mostrar el modal usando Bootstrap
          const modal = new bootstrap.Modal(document.querySelector('.modal'));
          modal.show();

          // Agregar evento click para cada botón de servicio
          modalBody.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
              const idContrato = e.target.getAttribute("data-idcontrato");

              // Aquí puedes hacer una nueva solicitud para obtener detalles del contrato
              obtenerDetallesContrato(idContrato);
            });
          });
        });
      });

      // Inicializar DataTables
      $('#listarClienteyContratos').DataTable({
        paging: true,
        searching: true,
        ordering: true,
        info: true,
        language: {
          url: 'https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json'
        }
      });
    } catch (error) {
      console.error("Error al obtener los contratos:", error);
    }
  })();
});

// Función para obtener los detalles de un contrato
function obtenerDetallesContrato(idContrato) {
  fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=detallesContrato&id=${idContrato}`)
    .then(response => response.json())
    .then(data => {
      console.log("Detalles del contrato:", data);
      // Aquí puedes actualizar el modal con más información del contrato
      const modalBody = document.querySelector(".modal-body");
      modalBody.innerHTML = `
        <p><strong>ID Contrato:</strong> ${data.id_contrato}</p>
        <p><strong>Servicio:</strong> ${data.servicio}</p>
        <p><strong>Descripción:</strong> ${data.descripcion}</p>
        <p><strong>Fecha de inicio:</strong> ${data.fecha_inicio}</p>
        <p><strong>Fecha de fin:</strong> ${data.fecha_fin}</p>
      `;
    })
    .catch(error => console.error("Error al obtener los detalles del contrato:", error));
}
