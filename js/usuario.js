import config from '../env.js';
import { inicializarDataTable} from './tools.js';

document.addEventListener("DOMContentLoaded", () => {
  const table = inicializarDataTable('#tblUsuarios', 
    `${config.HOST}app/controllers/Usuario.controllers.php?operacion=listarUsuarios`, 
    [
      { data: "nombre", title: "Nombre", className: 'text-center' },
      { data: "nombre_user", title: "Usuario", className: 'text-center' },
      { data: "Cargo", title: "Rol", className: 'text-center' },
      {
        data: null,
        title: "Acciones",
        className: 'text-center',
        render: function (data, type, row) {
          return `<button class="btnActualizar btn btn-primary" 
                    data-id="${row.id}" 
                    data-apellidos="${row.apellidos}" 
                    data-nombres="${row.nombres}" 
                    data-telefono="${row.telefono}">Editar</button>`;
        }
      }
    ],
    [
      { width: "30%", targets: 0 },
      { width: "30%", targets: 1 },
      { width: "20%", targets: 2 },
      { width: "20%", targets: 3 }
    ]
  );

  $('.card-body').on('click', '.btnActualizar', function () {
    const id = $(this).data('id');
    const nombres = $(this).data('nombres');
    const usuario = $(this).data('nombre_user');
    abrirModal(id, nombres, usuario);
  });
});

export function abrirModal(id, nombres, usuario) {
  $('#userId').val(id);
  $('#txtNombre').val(nombres);
  $('#txtUsuario').val(usuario);
  $('#editModal').modal('show');
}
