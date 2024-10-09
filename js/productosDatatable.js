import config from '../env.js';

document.addEventListener("DOMContentLoaded", function () {
    const userid = user['idUsuario'];
    const ruta = `${config.HOST}app/controllers/Producto.controllers.php?operacion=listarProductos`;

    // 2. Inicialización de la tabla de productos
    window.tablaProductos = $('#tblProductos').DataTable({
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
    $('#tblProductos tbody').on('click', '.btn-edit', async function () {
        const idProducto = $(this).data('id');

        try {
            const response = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoId&id_producto=` + idProducto);
            const producto = await response.json();
            $('#txtIdProducto').val(producto[0].id_producto);
            $('#slcEditarTipoProducto').val(producto[0].tipo_producto);
            $('#slcEditarMarca').val(producto[0].marca);
            $('#txtEditarModelo').val(producto[0].modelo);
            $('#txtEditarPrecioActual').val(producto[0].precio_actual);
            $('#txtEditarCodigoBarras').val(producto[0].codigo_barra);

            $('#modalEditarProducto').modal('show');
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    });

    // 4. Evento para enviar el formulario de edición
    $('#form-editar-producto').on('submit', async function (e) {
        e.preventDefault();

        const datosProducto = {
            operacion: 'actualizarProducto',
            idProducto:$('#txtIdProducto').val(),
            marca:$('#slcEditarMarca').val(),
            tipoProducto:$('#slcEditarTipoProducto').val(),
            modelo:$('#txtEditarModelo').val(),
            precioActual:$('#txtEditarPrecioActual').val(),
            codigoBarra:$('#txtEditarCodigoBarras').val(),
            idUsuario:userid
        };

        try {
            const response = await fetch(`${config.HOST}app/controllers/Producto.controllers.php`, {
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
