import config from "../env.js";
import * as Herramientas from "./Herramientas.js";
document.addEventListener("DOMContentLoaded", async function () {
  let login = await Herramientas.obtenerLogin();
  const userid = login.idUsuario;
  const ruta = `${config.HOST}app/controllers/Producto.ssp.php`;
  let idProducto = -1;

  window.tablaProductos = $("#tblProductos").DataTable({
    dom: `
      <"row"<"col-sm-12 col-md-6"B><"col-sm-12 col-md-6 text-end"f>>
      <"row"<"col-sm-12"tr>>
      <"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>
    `,
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
    },
    buttons: [
      {
        extend: "csv",
        text: '<i class="fa-solid fa-file-csv"></i>',
        className: "btn btn-primary me-2",
        filename: "Productos",
        title: "Productos",
        exportOptions: {
          columns: ":not(:last-child)",
        },
      },
      {
        extend: "excel",
        text: '<i class="fa-solid fa-file-excel"></i>',
        className: "btn btn-success me-2",
        filename: "Productos",
        title: "Productos",
        exportOptions: {
          columns: ":not(:last-child)",
        },
      },
      {
        extend: "pdf",
        text: '<i class="fa-solid fa-file-pdf"></i>',
        className: "btn btn-danger me-2",
        filename: "Productos",
        title: "Productos",
        exportOptions: {
          columns: ":not(:last-child)",
        },
      },
      {
        extend: "print",
        text: '<i class="fa-solid fa-print"></i>',
        className: "btn btn-secondary me-2",
        exportOptions: {
          columns: ":not(:last-child)",
        },
      },
    ],
    processing: true,
    serverSide: true,
    ajax: {
      url: ruta,
      type: "GET",
      dataSrc: function (json) {
        return json.data;
      },
      error: function (xhr, error, thrown) {
        console.error('Error en la carga de datos:', error, thrown);
        alert('Error al cargar los datos. Por favor, revisa la consola para más detalles.');
      }
    },
    columns: [
      { data: 0, title: "ID", className: "text-center" },
      { data: 1, title: "Marca", className: "text-center" },
      { data: 2, title: "Tipo de Producto", className: "text-center" },
      { data: 3, title: "Nombre o Modelo", className: "text-center" },
      { data: 4, title: "Unidad de Medida", className: "text-center" },
      { data: 5, title: "Precio Actual", className: "text-center" },
      { data: 6, title: "MAC", className: "text-center" },
      {
        data: 7,
        title: "Acciones",
        className: "text-center",
        orderable: false,
        searchable: false,
        render: function (data, type, row) {
          return `
            <button class="btn btn-warning btn-edit" data-id="${row[0]}"><i class="fa-regular fa-pen-to-square"></i></button>
            <button class="btn btn-danger btn-delete" data-id="${row[0]}"><i class="fa-regular fa-trash-can"></i></button>
          `;
        }
      }
    ],
    columnDefs: [
      { targets: 0, visible: false } 
    ],
    paging: true,
    searching: true,
    info: true,
    lengthChange: false,
  });

  const slcEditarMarca = document.querySelector("#slcEditarMarca");
  const slcUnidadEditarMedida = document.querySelector("#slcUnidadEditarMedida");
  const slcEditarTipoProducto = document.querySelector("#slcEditarTipoProducto");

  $("#tblProductos tbody").on("click", ".btn-edit", async function () {
    idProducto = $(this).data("id");

    try {
      const response = await fetch(
        `${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoId&idProducto=` +
        idProducto
      );
      const producto = await response.json();
      $("#slcEditarTipoProducto").val(producto[0].id_tipo);
      $("#slcEditarMarca").val(producto[0].id_marca);
      $("#slcUnidadEditarMedida").val(producto[0].id_unidad);
      $("#txtEditarModelo").val(producto[0].modelo);
      $("#txtEditarPrecioActual").val(producto[0].precio_actual);
      $("#txtEditarCodigoBarras").val(producto[0].codigo_barra);
      $("#slcEditarCategoria").val(producto[0].categoria);

      $("#modalEditarProducto").modal("show");
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  });

  $("#form-editar-producto").on("submit", async function (e) {
    e.preventDefault();

    const datosProducto = {
      operacion: "actualizarProducto",
      idProducto: idProducto,
      idmarca: $("#slcEditarMarca").val(),
      idtipoProducto: $("#slcEditarTipoProducto").val(),
      idUnidad: $("#slcUnidadEditarMedida").val(),
      modelo: $("#txtEditarModelo").val(),
      precioActual: $("#txtEditarPrecioActual").val(),
      idUsuario: userid,
      categoria: $("#slcEditarCategoria").val()
    };

    const response = await fetch(
      `${config.HOST}app/controllers/Producto.controllers.php`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosProducto),
      }
    );
    const data = await response.json();

    if (data.Actualizado) {
      tablaProductos.ajax.reload();
      showToast("Actualizado Correctamente.", "SUCCESS");
      $("#modalEditarProducto").modal("hide");
      idProducto = -1;
    } else {
      showToast("Error al actualizar el producto.", "ERROR");
      idProducto = -1;
    }

  });

  (async () => {
    try {
      const response = await fetch(`${config.HOST}app/controllers/Marcas.controllers.php?operacion=listarmarca`);
      const data = await response.json();

      if (Array.isArray(data)) {
        data.forEach(data => {
          const option = document.createElement("option");
          option.value = data.id_marca;
          option.textContent = data.marca;
          slcEditarMarca.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Error al cargar las marcas:", error);
    }
  })();

  (async () => {
    try {
      const response = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=listarTipoProductos`);
      const data = await response.json();

      if (Array.isArray(data)) {
        data.forEach(tipoProduc => {
          const option = document.createElement("option");
          option.value = tipoProduc.id_tipo;
          option.textContent = tipoProduc.tipo_nombre;
          slcEditarTipoProducto.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Error al cargar los Tipos de Producto:", error);
    }
  })();

  (async () => {
    try {
      const response = await fetch(`${config.HOST}app/controllers/Medidas.controllers.php?operacion=listarmedidas`);
      const data = await response.json();

      if (Array.isArray(data)) {
        data.forEach(unidades => {
          const option = document.createElement("option");
          option.value = unidades.id_unidad;
          option.textContent = unidades.unidad_nombre;
          slcUnidadEditarMedida.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Error al cargar las Medidas:", error);
    }
  })();

  $("#tblProductos tbody").on("click", ".btn-delete", async function () {
    if (await ask("¿Desea  eliminar el producto?")) {
      idProducto = $(this).data("id");
      await eliminarProducto(idProducto);
    }
  });

  async function eliminarProducto(id) {
    const datosProducto = {
      operacion: "EliminarProducto",
      idProducto: id,
      idUsuario: userid,
    };

    const response = await fetch(
      `${config.HOST}app/controllers/Producto.controllers.php`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosProducto),
      }
    );
    const data = await response.json();

    if (data.Eliminado) {
      tablaProductos.ajax.reload();
      showToast("Eliminado Correctamente.", "SUCCESS");
      idProducto = -1;
    } else {
      showToast("Error al eliminar el producto.", "ERROR");
      idProducto = -1;
    }

  };

  async function rehabilitarProducto(id) {
    const datosProducto = {
      operacion: "ReactivarProducto",
      idProducto: id,
      idUsuario: userid,
    };

    const response = await fetch(
      `${config.HOST}app/controllers/Producto.controllers.php`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosProducto),
      }
    );

    const data = await response.json();

    if (data.Activado) {
      tablaProductos.ajax.reload();
      showToast("Se ha reactivado Correctamente.", "SUCCESS");
      idProducto = -1;
    } else {
      showToast("Error al reactivar el producto.", "ERROR");
      idProducto = -1;
    }

  };
});