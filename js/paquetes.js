import config from "../env.js";

document.addEventListener('DOMContentLoaded', () => {
  $(document).ready(function () {
    $('#tablaPaquetes').DataTable({
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      columnDefs: [
        { "width": "25%", "targets": 0 },
        { "width": "15%", "targets": 1 },
        { "width": "25%", "targets": 2 },
        { "width": "20%", "targets": 3 },
        { "width": "20%", "targets": 4 },
        {
          data: null,
          title: "Acciones",
          className: "text-center",
          render: function (data, type, row) {
            return `
              <button class="btn btn-warning btn-edit" data-id="${row.id_paquete}"><i class="fa-regular fa-pen-to-square"></i></button>
              <button class="btn btn-danger btn-delete" data-id="${row.id_paquete}"><i class="fa-regular fa-trash-can"></i></button>
            `;
          },
          "width": "15%",
          "targets": 5
        }
      ],
      paging: true,
      searching: true,
      info: true,
      lengthChange: false
    });

    // Evento para abrir el modal de actualización
    $('#tablaPaquetes').on('click', '.btn-edit', function () {
      const idPaquete = $(this).data('id');
      $('#modalActualizarPaquete').modal('show');
    });
  });
});