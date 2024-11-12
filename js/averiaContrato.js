import config from "../env.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Obtén el id_cliente de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const idCliente = urlParams.get("id");

  if (idCliente) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerContratoPorCliente&id=${idCliente}`);
    const contratos = await respuesta.json();

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
        if (idContrato) {
          try {
            // Busca el contrato específico dentro del array `contratos`
            const contratoSeleccionado = contratos.find(contrato => contrato.id_contrato == parseInt(idContrato));

            const response = await fetch(`${config.HOST}app/controllers/Averias.controllers.php?operacion=buscarAveriaPorContrato&valor=${idContrato}`);
            const averias = await response.json();

            if (!averias || averias.length === 0) {
              showToast("No tienes ninguna avería", "INFO");
            } else {
              // Verifica el tipo de servicio del contrato seleccionado y redirige a la vista correspondiente
              if (contratoSeleccionado.tipo_servicio == "CABL") {
                window.location.href = `${config.HOST}views/Soporte/FichaAveriaCable?idContrato=${idContrato}`;
              } else if (contratoSeleccionado.tipo_servicio == "WISP") {
                window.location.href = `${config.HOST}views/Soporte/FichaWisp?idContrato=${idContrato}`;
              } else if (contratoSeleccionado.tipo_servicio == "GPON") {
                window.location.href = `${config.HOST}views/Soporte/FichaGpon?idContrato=${idContrato}`;
              }
            }
          } catch (error) {
            console.error("Error al obtener las averías:", error);
          }
        }
      });
    });
  }
});
