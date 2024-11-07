document.addEventListener("DOMContentLoaded", async () => {
  // Obtén el id_cliente de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const idCliente = urlParams.get("id");

  if (idCliente) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerContratoPorCliente&id=${idCliente}`);
    const contratos = await respuesta.json();

    const tbody = document.querySelector("#tablaContratos tbody");
    contratos.forEach(contrato => {
      const row = document.createElement("tr");

      // Añade las columnas correspondientes
      row.innerHTML = `
        <td>${contrato.direccion_servicio}</td>
        <td>${contrato.fecha_inicio}</td>
        <td>${contrato.fecha_fin}</td>
        <td>${contrato.paquete}</td>
        <td>${contrato.referencia}</td>
        <td>${contrato.sector}</td>
        <td>${contrato.tipo_servicio}</td>
      `;

      tbody.appendChild(row);
    });

    $('#tablaContratos').DataTable({
      paging: true,
      lengthChange: false,
      searching: true,
      ordering: true,
      info: true,
      autoWidth: false
    });
  }
});
