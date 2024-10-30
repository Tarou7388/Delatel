import config from "../env.js";

document.addEventListener("DOMContentLoaded", () => {
  (async () => {
    const respuesta = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=listarClientes`);
    const data = await respuesta.json();

    const tbody = document.querySelector("#listarClienteyContratos tbody");

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

      const button = document.createElement("button");
      button.textContent = "Ver Contrato";
      button.className = "btn btn-primary";
      button.onclick = async () => {

        const respuestaContratos = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerContratoPorCliente&id=${cliente.id_cliente}`);
        const contratos = await respuestaContratos.json();

        const detallesContrato = document.querySelector('#exampleModalToggle .modal-body');

        if (contratos.length > 0) {
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
              <button class="btn btn-primary averias-btn" data-contrato="${contrato.id_contrato}">Averías</button>
              <hr>
            `;
            detallesContrato.innerHTML += contratoInfo;
          });

          document.querySelectorAll('.averias-btn').forEach(botonAverias => {
            botonAverias.addEventListener('click', async (e) => {
              const idContrato = e.target.getAttribute('data-contrato');
              const respuestaAverias = await fetch(`${config.HOST}app/controllers/Averias.controllers.php?operacion=buscarAveriaPorContrato&valor=${idContrato}`);
              const averias = await respuestaAverias.json();

              const detallesAveria = document.querySelector('#exampleModalToggle2 .modal-body');

              if (averias.length > 0) {
                detallesAveria.innerHTML = '';

                averias.forEach(averia => {
                  // Convertir el campo 'soporte' a un objeto (si es necesario)
                  const soporteObject = typeof averia.soporte === "string" ? JSON.parse(averia.soporte) : averia.soporte;

                  let soporteInfo = ''; // Variable para almacenar el contenido formateado

                  // Función para recorrer objetos anidados
                  const renderizarObjeto = (obj, nivel = 0) => {
                    let resultado = '';
                    Object.entries(obj).forEach(([key, value]) => {
                      if (typeof value === 'object' && value !== null) {
                        // Si el valor es otro objeto, recorrerlo de forma recursiva
                        resultado += `<p><strong>${' '.repeat(nivel * 2)}${key}:</strong></p>`;
                        resultado += renderizarObjeto(value, nivel + 1); // Llamada recursiva para objetos anidados
                      } else {
                        // Si es un valor simple, mostrarlo
                        resultado += `<p><strong>${' '.repeat(nivel * 2)}${key}:</strong> ${value}</p>`;
                      }
                    });
                    return resultado;
                  };

                  // Renderizar el objeto de soporte
                  soporteInfo = renderizarObjeto(soporteObject);

                  const averiaInfo = `
                    <p><strong>ID Soporte:</strong> ${averia.id_soporte}</p>
                    <p><strong>Tipo de Soporte:</strong> ${averia.tipo_soporte}</p>
                    <p><strong>Nombre del Técnico:</strong> ${averia.nombre_tecnico}</p>
                    <p><strong>Soporte Detallado</strong></p>
                    <ul>${soporteInfo}</ul>
                    <p><strong>Descripción de la Solución:</strong> ${averia.descripcion_solucion}</p>
                    <p><strong>Fecha de Solicitud:</strong> ${averia.fecha_hora_solicitud}</p>
                    <p><strong>Fecha de Asistencia:</strong> ${averia.fecha_hora_asistencia}</p>
                    <hr>
                  `;

                  detallesAveria.innerHTML += averiaInfo;
                });
              } else {
                detallesAveria.textContent = 'No se encontraron averías para este contrato.';
              }



              const modalAverias = new bootstrap.Modal(document.getElementById('exampleModalToggle2'));
              modalAverias.show();
            });
          });

        } else {
          detallesContrato.textContent = 'No se encontraron contratos para este cliente.';
        }

        // Mostrar el primer modal
        const modalContratos = new bootstrap.Modal(document.getElementById('exampleModalToggle'));
        modalContratos.show();
      };

      cellContrato.appendChild(button);
      row.appendChild(cellContrato);

      tbody.appendChild(row);
    });

    $('#listarClienteyContratos').DataTable({
      "paging": true,
      "lengthChange": false,
      "searching": true,
      "ordering": true,
      "info": true,
      "autoWidth": false,
      "responsive": true
    });
  })();
  async function permisos(){
    const response = await fetch(`${config.HOST}app/controllers/Usuario.controllers.php?operacion=obtenerPermisos`);
    const data = await response.json()
    if(data.contrato.crear){

    }
  }
});
