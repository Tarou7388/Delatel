import config from '../env.js';

document.addEventListener("DOMContentLoaded", function () {
    if (permisos[0].permisos.inventariado.leer != 1) {
        window.location.href = `${config.HOST}views`;
    }

    const userid = user['idUsuario'];
    const ruta = `${config.HOST}app/controllers/Productos.controllers.php?operacion=listarProductos`;

    // 2. Inicialización de la tabla de productos
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
        ],
        ajax: {
            url: ruta,
            type: 'GET',
            dataSrc: ''
        },
        columns: [
            { data: 'marca', title: 'Marca', className: 'text-center' },
            { data: 'tipo_producto', title: 'Tipo de Producto', className: 'text-center' },
            { data: 'modelo', title: 'Modelo', className: 'text-center' },
            { data: 'precio_actual', title: 'Precio Actual', className: 'text-center' },
            { data: 'codigo_barra', title: 'Código de Barra', className: 'text-center' },
            {
                data: null,
                title: 'Acciones', className: 'text-center',
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-warning btn-edit" data-id="${row.id_producto}"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button class="btn btn-danger btn-delete" data-id="${row.id_producto}"><i class="fa-regular fa-trash-can"></i></button>
                    `;
                }
            }
        ]
    });

    // 3. Evento para editar un producto
    $('#TbProductos tbody').on('click', '.btn-edit', async function () {
        const idProducto = $(this).data('id');

        try {
            const response = await fetch(`${config.HOST}app/controllers/Productos.controllers.php?operacion=buscarProductoId&id_producto=` + idProducto);
            const producto = await response.json();
            $('#txtIdProducto').val(producto.id_producto);
            $('#slcEditarTipoProducto').val(producto.tipo_producto);
            $('#slcEditarMarca').val(producto.marca);
            $('#txtEditarModelo').val(producto.modelo);
            $('#txtEditarPrecioActual').val(producto.precio_actual);
            $('#txtEditarCodigoBarras').val(producto.codigo_barra);

            $('#modalEditarProducto').modal('show');
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    });

    // 4. Evento para enviar el formulario de edición
    $('#form-editar-producto').on('submit', async function (e) {
        e.preventDefault();

        if (permisos[0].permisos.inventariado.crear != 1) {
            showToast("No tienes permiso para esta acción", "ERROR");
            return;
        }

        const datosProducto = {
            id_producto: $('#txtIdProducto').val(),
            tipo_producto: $('#slcEditarTipoProducto').val(),
            marca: $('#slcEditarMarca').val(),
            modelo: $('#txtEditarModelo').val(),
            precio_actual: $('#txtEditarPrecioActual').val(),
            codigo_barra: $('#txtEditarCodigoBarras').val(),
            iduser_update: userid
        };

        try {
            const response = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=actualizarProducto`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosProducto)
            });
            const data = await response.json();

            if (data.Actualizado) {
                tablaProductos.ajax.reload();
                showToast('Actualizado Correctamente.', "SUCCESS");
                $('#modalEditarProducto').modal('hide');
            } else {
                showToast('Error al actualizar el producto.', "ERROR");
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    });
});
