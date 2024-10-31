import config from '../env.js';
import { inicializarDataTable } from './Herramientas.js';
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener("DOMContentLoaded", async () => {
  const accesos = await Herramientas.permisos()
  const userid = JSON.stringify(user['idUsuario']);
  let idUserTabla = -1;
  let idresponsable = -1;

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
                    data-idrol="${row.id_rol}" 
                    data-id="${row.id_usuario}"
                    data-nombres="${row.nombre}"
                    data-responsable="${row.id_responsable}" 
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

  function abrirModal(slcRolid, nombres, usuario) {
    $('#txtNombre').val(nombres);
    $('#txtNombre').prop('disabled', true);
    $('#txtUsuario').val(usuario);
    $('#slcRol').val(slcRolid);
    $('#editModal').modal('show');
  };

  $('.card-body').on('click', '.btnActualizar', function () {
    idUserTabla = $(this).data('id');
    const nombre = $(this).data('nombres');
    const idRolid = $(this).data('idrol');
    const usuario = $(this).data('nombre_user');
    idresponsable = $(this).data('responsable')
    abrirModal(idRolid, nombre, usuario);
  });

  $('.card-body').on('click', '.btnEliminar', function () {
    idUserTabla = $(this).data('id');
    confirmarEliminacion(idUserTabla);
  });

  document.getElementById('editForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    if (idUserTabla < 0) {
      await showToast("Usuario no seleccionado correctamente", "ERROR");
      $('#editModal').modal('hide').data('bs.modal', null);
      return;
    }
    actualizarRolResponsable(idresponsable);
    //await actualizarRolResponsable();
    await actualizarUsuario();
  });

  /**
   * Función asíncrona que actualiza la información de un usuario en el sistema.
   * Envía una solicitud al servidor para actualizar el nombre de usuario y la contraseña, si corresponde.
   *
   * @async
   * @function actualizarUsuario
   * @returns {void}
   * 
   * La función toma los valores del nombre de usuario y la nueva contraseña (si se proporciona),
   * los envía al servidor, y muestra un mensaje de éxito o error dependiendo del resultado.
   *
   * @example
   * // Actualizar el usuario actual
   * actualizarUsuario();
   */
  async function actualizarUsuario() {
    if (accesos?.usuarios?.actualizar) {
      const usuario = document.getElementById('txtUsuario').value;
      const nuevaPassword = document.getElementById('txtPassword').value;

      const parametros = {
        operacion: 'actualizarUsuario',
        parametros: {
          idUsuarioUpdate: userid,
          nombreUsuario: usuario,
          idUsuario: idUserTabla,
          clave: nuevaPassword
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
    }
  }

  /**
   * Función asíncrona que actualiza el rol de un responsable en el sistema.
   * Envía una solicitud al servidor para actualizar el rol de un responsable con base en su ID.
   *
   * @async
   * @function actualizarRolResponsable
   * @param {number} idresponsabled - El ID del responsable al que se le desea actualizar el rol.
   * 
   * La función obtiene el valor seleccionado del rol desde el elemento HTML con ID `slcRol` y lo envía al servidor 
   * junto con el ID del usuario que realiza la actualización y el ID del responsable que se actualiza.
   * 
   * Al recibir la respuesta del servidor, muestra un mensaje que indica si la operación fue exitosa o fallida.
   *
   * @example
   * // Actualizar el rol del responsable con ID 7
   * actualizarRolResponsable(7);
   *
   * @returns {void}
   */
  async function actualizarRolResponsable(idresponsabled) {
    if (accesos?.roles?.actualizar) {
      const rol = document.getElementById('slcRol').value;

      const parametros = {
        operacion: 'actualizarResponsable',
        datos: {
          idUsuarioActualizador: userid,
          idRol: rol,
          idResponsable: idresponsabled
        }
      };
      //console.log(parametros);

      const respuesta = await fetch(`${config.HOST}app/controllers/Responsable.controllers.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parametros)
      });

      const resultado = await respuesta.json();
      if (resultado.Actualizado) {
        showToast("Usuario actualizado", "SUCCESS");
        $('#editModal').modal('hide');
        $('#tblUsuarios').DataTable().ajax.reload();
      } else {
        showToast("Usuario no actualizado", "ERROR");
      }
      idresponsable = -1;
      idUserTabla = -1;
    }

  };

  /**
   * Función asíncrona que solicita confirmación al usuario antes de eliminar un usuario.
   * Si el usuario confirma, procede a eliminar el usuario llamando a la función eliminarUsuario.
   *
   * @async
   * @function confirmarEliminacion
   * @param {number} id - El ID del usuario que se desea eliminar.
   * 
   * Esta función primero muestra un cuadro de diálogo de confirmación. Si el usuario confirma la acción, 
   * se llama a la función `eliminarUsuario` para proceder con la eliminación del usuario.
   *
   * @example
   * // Confirmar la eliminación del usuario con ID 5
   * confirmarEliminacion(5);
   *
   * @returns {void}
   */
  async function confirmarEliminacion(id) {
    if (await ask('¿Estás seguro de que deseas eliminar este usuario?')) {
      await eliminarUsuario(id);
    }
  };

  /**
   * Función asíncrona que elimina un usuario del sistema.
   * Envía una petición al servidor para eliminar un usuario con base en su ID.
   *
   * @async
   * @function eliminarUsuario
   * @param {number} id - El ID del usuario que se desea eliminar.
   * 
   * La función realiza una petición HTTP `PUT` enviando el ID del usuario a eliminar y el ID del usuario que realiza la operación.
   * Tras recibir la respuesta del servidor, muestra un mensaje indicando el éxito o fallo de la operación.
   *
   * @example
   * // Eliminar el usuario con ID 5
   * eliminarUsuario(5);
   *
   * @returns {void}
   */
  async function eliminarUsuario(id) {
    if (accesos?.usuarios?.eliminar) {
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
      //console.log(result);
      if (result.eliminado) {
        showToast("Usuario eliminado", "SUCCESS");
        $('#tblUsuarios').DataTable().ajax.reload();
      } else {
        showToast("No se pudo eliminar el usuario", "ERROR");
      }

      idUserTabla = -1;
    }

  };

});


