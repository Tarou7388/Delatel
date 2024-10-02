import config from '../env.js';

document.addEventListener("DOMContentLoaded", () => {
  if (!permisos[0].permisos.personas.leer) {
    window.location.href = `${config.HOST}views`;
  }

  const table = $('#listarUsuarios').DataTable({
    language: {
      url: "//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
    },
    ajax: {
      url: `${config.HOST}app/controllers/Usuarios.controllers.php?Operacion=getAll`,
      dataSrc: ''
    },
    columns: [
      { data: "nombre", title: "Nombre" },
      { data: "nombre_user", title: "Usuario" },
      { data: "Cargo", title: "Rol" },
      {
        data: null,
        title: "Acciones",
        render: function (data, type, row) {
          return `<button class="update-btn btn btn-primary" 
                    data-id="${row.id}" 
                    data-apellidos="${row.apellidos}" 
                    data-nombres="${row.nombres}" 
                    data-telefono="${row.telefono}">Editar</button>`;
        }
      }
    ],
    columnDefs: [
      { width: "30%", targets: 0 },
      { width: "30%", targets: 1 },
      { width: "20%", targets: 2 },
      { width: "20%", targets: 3 }
    ]
  });

  $('.card-body').on('click', '.update-btn', function () {
    const id = $(this).data('id');
    const nombres = $(this).data('nombres');
    const telefono = $(this).data('telefono');
    openEditModal(id, nombres, telefono);
  });
});

export function openEditModal(id, nombres, telefono) {
  $('#userId').val(id);
  $('#txtNombre').val(nombres);
  $('#txtTelPrincipal').val(telefono);
  $('#editModal').modal('show');
}
