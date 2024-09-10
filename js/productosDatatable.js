const ruta = "../../controllers/Productos.controllers.php?operacion=getAll";
if (permisos[0].permisos.inventariado.leer != 1) {
    window.location.href = `${config.HOST}views`;
}
const userid = user['idUsuario'];
window.tablaProductos = $('#TbProductos').DataTable({
    dom: `
    <"row"<"col-sm-12 col-md-6"B><"col-sm-12 col-md-6 text-end"f>>
    <"row"<"col-sm-12"tr>>
    <"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>
`,
    buttons: [
        {
            extend: 'csv',
            text: '<i class="bi bi-file-earmark-csv"></i> Exportar CSV',
            className: 'btn btn-primary me-2',
            filename: 'Productos',
            title: 'Productos',
            exportOptions: {
                columns: ':not(:last-child)'
            }
        },
        {
            extend: 'excel',
            text: '<i class="bi bi-file-earmark-excel"></i> Exportar Excel',
            className: 'btn btn-success me-2',
            filename: 'Productos',
            title: 'Productos',
            exportOptions: {
                columns: ':not(:last-child)'
            }
        },
        {
            extend: 'pdf',
            text: '<i class="bi bi-file-earmark-pdf"></i> Exportar PDF',
            className: 'btn btn-danger me-2',
            filename: 'Productos',
            title: 'Productos',
            exportOptions: {
                columns: ':not(:last-child)'
            }
        },
        {
            extend: 'print',
            text: '<i class="bi bi-printer"></i> Imprimir',
            className: 'btn btn-secondary me-2',
            exportOptions: {
                columns: ':not(:last-child)'
            }
        }
    ], ajax: {
        url: ruta,
        type: 'GET',
        dataSrc: ''
    },
    columns: [
        { data: 'marca', title: 'Marca' },
        { data: 'tipo_producto', title: 'Tipo de Producto' },
        { data: 'modelo', title: 'Modelo' },
        { data: 'precio_actual', title: 'Precio Actual' },
        { data: 'codigo_barra', title: 'Código de Barra' },
        {
            data: null,
            title: 'Acciones',
            render: function (data, type, row) {
                return `
                    <button class="btn btn-warning btn-edit" data-id="${row.id_producto}"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="btn btn-danger btn-delete" data-id="${row.id_producto}"><i class="fa-regular fa-trash-can"></i></button>
                `;
            }
        }
    ]
});


$('#TbProductos tbody').on('click', '.btn-edit', function () {
    const idProducto = $(this).data('id');

    fetch(`../../controllers/Productos.controllers.php?operacion=getById&id_producto=` + idProducto)
        .then(response => response.json())
        .then(producto => {
            $('#txtIdProducto').val(producto.id_producto);
            $('#slcEditarTipoProducto').val(producto.tipo_producto);
            $('#slcEditarMarca').val(producto.marca);
            $('#txtEditarModelo').val(producto.modelo);
            $('#txtEditarPrecioActual').val(producto.precio_actual);
            $('#txtEditarCodigoBarras').val(producto.codigo_barra);

            $('#modalEditarProducto').modal('show');
        })
        .catch(error => console.error('Error fetching product:', error));
});

$('#form-editar-producto').on('submit', function (e) {
    if (permisos[0].permisos.inventariado.crear != 1) {
        alert("No tienes permiso para esta acción");
    }
    e.preventDefault();

    const datosProducto = {
        id_producto: $('#txtIdProducto').val(),
        tipo_producto: $('#slcEditarTipoProducto').val(),
        marca: $('#slcEditarMarca').val(),
        modelo: $('#txtEditarModelo').val(),
        precio_actual: $('#txtEditarPrecioActual').val(),
        codigo_barra: $('#txtEditarCodigoBarras').val(),
        iduser_update: (userid)
    };

    fetch(`../../controllers/Productos.controllers.php?operacion=update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosProducto)
    })
        .then(response => response.json())
        .then(data => {
            if (data.Actualizado) {
                tablaProductos.ajax.reload();
                alert('Actualizado Correctamente.');
                $('#modalEditarProducto').modal('hide');
            } else {
                alert('Error al actualizar el producto.');
            }
        })
});