import config from '../env.js';
import { inicializarDataTable } from './Herramientas.js';
const userid = JSON.stringify(user["idUsuario"]);
let idUserEditar;

document.addEventListener("DOMContentLoaded", () => {

  (async () => {
    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Rol.controllers.php?operacion=listarRoles`);
      const data = await respuesta.json();
      const select = document.getElementById("slcRol");
      data.forEach(({ rol, id_rol }) => select.add(new Option(rol, id_rol)));
    } catch (error) {
      console.error("Error al cargar los roles:", error);
    }
  })();


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
          return `
            <button class="btnActualizar btn btn-primary" 
                    data-id="${row.id_usuario}" 
                    data-nombres="${row.nombre}" 
                    data-telefono="${row.telefono || ''}"
                    data-nombre_user="${row.nombre_user}">Editar</button>
            <button class="btnEliminar btn btn-danger" 
                    data-id="${row.id_usuario}">Eliminar</button>`;
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
    idUserEditar = $(this).data('id');

    const nombre = $(this).data('nombres');
    const usuario = $(this).data('nombre_user');
    abrirModal(nombre, usuario);
  });


  $('.card-body').on('click', '.btnEliminar', function () {
    const id = $(this).data('id');
    confirmarEliminacion(id);
  });
});

function abrirModal(nombres, usuario) {
  $('#txtNombre').val(nombres);
  $('#txtUsuario').val(usuario);
  $('#editModal').modal('show');
}

document.getElementById('editForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const usuario = document.getElementById('txtUsuario').value;
  const rol = document.getElementById('slcRol').value;
  const nuevaPassword = document.getElementById('txtPassword').value;
  console.log(idUserEditar)
  const parametros = {
    operacion: 'actualizarUsuario',
    parametros: {
      idUsuarioUpdate: userid,
      nombreUsuario: usuario,
      idUsuario: idUserEditar,
      clave: nuevaPassword,
      rol: rol
    }
  };

  console.log(parametros)

  const respuesta = await fetch(`${config.HOST}app/controllers/Usuario.controllers.php`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros)
  });

  const resultado = await respuesta.json();
  console.log(resultado);
  if (resultado.actualizado) {
    showToast("Usuario actualizado", "SUCCESS");
    $('#editModal').modal('hide');
    $('#tblUsuarios').DataTable().ajax.reload();
  } else {
    showToast("Usuario no actualizado", "ERROR");
  }

});


function confirmarEliminacion(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    eliminarUsuario(id);
  }
}

function eliminarUsuario(id) {
  $.ajax({
    url: `${config.HOST}app/controllers/Usuario.controllers.php?operacion=eliminarUsuario`,
    type: 'POST',
    data: { id: id },
    success: function (response) {
      if (response.success) {
        alert('Usuario eliminado exitosamente.');
        // Recargar la tabla después de la eliminación
        $('#tblUsuarios').DataTable().ajax.reload();
      } else {
        alert('Error al eliminar el usuario: ' + response.message || 'Inténtalo más tarde.');
      }
    },
    error: function () {
      alert('Error en la conexión. Inténtalo de nuevo más tarde.');
    }
  });


}
