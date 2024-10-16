import config from '../env.js';
import { inicializarDataTable } from './Herramientas.js';

const userid = JSON.stringify(user['idUsuario']);
let idUserTabla = -1;

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

  // Evento para actualizar
  $('.card-body').on('click', '.btnActualizar', function () {
    idUserTabla = $(this).data('id');

    const nombre = $(this).data('nombres');
    const usuario = $(this).data('nombre_user');
    abrirModal(nombre, usuario);
  });

  $('.card-body').on('click', '.btnEliminar', function () {
    idUserTabla = $(this).data('id');
    confirmarEliminacion(idUserTabla);
  });
});


document.getElementById('editForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  if (idUserTabla < 0) {
    await showToast("Usuario no seleccionado correctamente", "ERROR");
    $('#editModal').modal('hide').data('bs.modal', null);
    return;
  }

  const usuario = document.getElementById('txtUsuario').value;
  const rol = document.getElementById('slcRol').value;
  const nuevaPassword = document.getElementById('txtPassword').value;

  const parametros = {
    operacion: 'actualizarUsuario',
    parametros: {
      idUsuarioUpdate: userid,
      nombreUsuario: usuario,
      idUsuario: idUserTabla,
      clave: nuevaPassword,
      rol: rol
    }
  };

  const respuesta = await fetch(`${config.HOST}app/controllers/Usuario.controllers.php`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros)
  });

  const resultado = await respuesta.json();
  if (resultado.actualizado) {
    showToast("Usuario actualizado", "SUCCESS");
    $('#editModal').modal('hide');
    $('#tblUsuarios').DataTable().ajax.reload();
  } else {
    showToast("Usuario no actualizado", "ERROR");
  }

  idUserTabla = -1;
});

async function confirmarEliminacion(id) {
  if (await ask('¿Estás seguro de que deseas eliminar este usuario?')) {
    await eliminarUsuario(id);
  }
}

// Eliminar usuario
async function eliminarUsuario(id) {
  const data = {
    operacion: "eliminarUsuario",
    idUsuario: id,
    idUsuarioEliminador: userid
  };

  const response = await fetch(`${config.HOST}app/controllers/Usuario.controllers.php`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  console.log(result);
  if (result.eliminado) {
    showToast("Usuario eliminado", "SUCCESS");
    $('#tblUsuarios').DataTable().ajax.reload();
  } else {
    showToast("No se pudo eliminar el usuario", "ERROR");
  }

  idUserTabla = -1;
}
