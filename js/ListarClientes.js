import config from "../env.js";

const ruta = `${config.HOST}/controllers/Cliente.controllers.php?operacion=getAll`;
const userid = user["idUsuario"];

if (permisos[0].permisos.inventariado.leer != 1) {
  window.location.href = `${config.HOST}views`;
}

function actualizar(idcliente) {
  const data = {
    identificador: idcliente,
    nombre: $("#editNombrePersona").val() || $("#editNombreEmpresa").val(),
    apellidos: $("#editApellidosPersona").val() || "",
    email: $("#editEmailPersona").val() || $("#editEmailEmpresa").val(),
    telefono:
      $("#editTelefonoPersona").val() || $("#editTelefonoEmpresa").val(),
    direccion:
      $("#editDireccionPersona").val() || $("#editDireccionEmpresa").val(),
    referencia:
      $("#editReferenciaPersona").val() || $("#editReferenciaEmpresa").val(),
    coordenadas:
      $("#editCoordenadasPersona").val() || $("#editCoordenadasEmpresa").val(),
    iduser_update: userid,
  };

  fetch(
    `${config.HOST}controllers/cliente.controllers.php?operacion=actualizar`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.Actualizado) {
        $("#listarCliente").DataTable().ajax.reload();
        $("#editPersonaModal").modal("hide");
        $("#editEmpresaModal").modal("hide");
        alert("Cliente actualizado exitosamente.");
      } else {
        alert(
          "Error al actualizar el cliente: " +
          (data.error || "Error desconocido")
        );
      }
    });
}

window.tablaClientes = $("#listarCliente").DataTable({
  dom: `
    <"row"<"col-sm-12 col-md-6"B><"col-sm-12 col-md-6 text-end"f>>
    <"row"<"col-sm-12"tr>>
    <"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>
  `,
  buttons: [
    {
      extend: "csv",
      text: '<i class="bi bi-file-earmark-csv"></i> Exportar CSV',
      className: "btn btn-primary me-2",
      filename: "Clientes",
      title: "Clientes",
      exportOptions: {
        columns: ":not(:last-child)",
      },
    },
    {
      extend: "excel",
      text: '<i class="bi bi-file-earmark-excel"></i> Exportar Excel',
      className: "btn btn-success me-2",
      filename: "Clientes",
      title: "Clientes",
      exportOptions: {
        columns: ":not(:last-child)",
      },
    },
    {
      extend: "pdf",
      text: '<i class="bi bi-file-earmark-pdf"></i> Exportar PDF',
      className: "btn btn-danger me-2",
      filename: "Clientes",
      title: "Clientes",
      orientation: "landscape",
      pageSize: "LEGAL",
      exportOptions: {
        columns: [0, 1, 2, 3, 4, 5, 6],
      },
    },
    {
      extend: "print",
      text: '<i class="bi bi-printer"></i> Imprimir',
      className: "btn btn-secondary me-2",
      exportOptions: {
        columns: ":not(:last-child)",
      },
    },
  ],
  ajax: {
    url: ruta,
    type: "GET",
    dataSrc: "",
  },
  columns: [
    { data: "nombre_cliente", title: "Nombre cliente" },
    { data: "codigo_cliente", title: "N° identificador" },
    { data: "email_cliente", title: "Email" },
    { data: "telefono_cliente", title: "Teléfono" },
    { data: "direccion_cliente", title: "Dirección" },
    { data: "referencia_cliente", title: "Referencia" },
    { data: "coordenadas_cliente", title: "Coordenadas" },
    {
      data: null,
      title: "Acciones",
      render: function (data, type, row) {
        return `
          <button class="btn btn-warning btn-edit" data-id="${row.codigo_cliente}"><i class="fa-regular fa-pen-to-square"></i></button>
          <button class="btn btn-danger btn-delete" data-id="${row.codigo_cliente}"><i class="fa-regular fa-trash-can"></i></button>
        `;
      },
    },
  ],
  columnDefs: [
    { targets: 0, width: '10%' }, 
    { targets: 1, width: '12%' }, 
    { targets: 2, width: '15%' }, 
    { targets: 3, width: '10%' }, 
    { targets: 4, width: '15%' }, 
    { targets: 5, width: '15%' }, 
    { targets: 6, width: '15%' },
    { targets: 7, width: '10%' }
  ],
  autoWidth: false
});


$("#listarCliente tbody").on("click", ".btn-edit", function () {
  const idcliente = $(this).data("id");

  fetch(
    `${config.HOST}controllers/cliente.controllers.php?operacion=getByDoc&numDoc=${idcliente}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (
        idcliente.toString().length >= 8 &&
        idcliente.toString().length <= 10
      ) {
        $("#editNombrePersona").val(data[0].nombre);
        let nombreParts = data[0].nombre.split(", ");
        if (nombreParts.length === 2) {
          $("#editNombrePersona").val(nombreParts[1]);
          $("#editApellidosPersona").val(nombreParts[0]);
        }
        $("#editEmailPersona").val(data[0].email);
        $("#editTelefonoPersona").val(data[0].telefono);
        $("#editDireccionPersona").val(data[0].direccion);
        $("#editReferenciaPersona").val(data[0].referencia);
        $("#editCoordenadasPersona").val(data[0].coordenadas);
        $("#editPersonaModal").modal("show");
      } else if (idcliente.toString().length === 11) {
        $("#editNombreEmpresa").val(data[0].nombre);
        $("#editEmailEmpresa").val(data[0].email);
        $("#editTelefonoEmpresa").val(data[0].telefono);
        $("#editDireccionEmpresa").val(data[0].direccion);
        $("#editReferenciaEmpresa").val(data[0].referencia);
        $("#editCoordenadasEmpresa").val(data[0].coordenadas);
        $("#editEmpresaModal").modal("show");
      }

      $("#savePersonaChanges")
        .off("click")
        .on("click", function () {
          actualizar(idcliente);
        });
      $("#saveEmpresaChanges")
        .off("click")
        .on("click", function () {
          actualizar(idcliente);
        });
    })
    .catch((error) => console.error("Error fetching client data:", error));
});

$("#listarCliente tbody").on("click", ".btn-delete", function () {
  if (confirm("¿Estás seguro de eliminar este registro? No se podrá volver a registrar nuevamente")) {
    const idcliente = $(this).data("id");
    const data = {
      identificador: idcliente,
      iduser_inactive: userid
    };

    fetch(
      `${config.HOST}controllers/cliente.controllers.php`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json())
      .then((data) => {
        if (data.Eliminado) {
          $("#listarCliente").DataTable().ajax.reload();
          alert("Cliente eliminado exitosamente.");
        } else {
          alert("Error al eliminar el cliente.");
        }
      });
  }
});


$('#editPersonaModal').on('hidden.bs.modal', function () {
  $("#editNombrePersona").val('');
  $("#editApellidosPersona").val('');
  $("#editEmailPersona").val('');
  $("#editTelefonoPersona").val('');
  $("#editDireccionPersona").val('');
  $("#editReferenciaPersona").val('');
  $("#editCoordenadasPersona").val('');
});

$('#editEmpresaModal').on('hidden.bs.modal', function () {
  $("#editNombreEmpresa").val('');
  $("#editEmailEmpresa").val('');
  $("#editTelefonoEmpresa").val('');
  $("#editDireccionEmpresa").val('');
  $("#editReferenciaEmpresa").val('');
  $("#editCoordenadasEmpresa").val('');
});
