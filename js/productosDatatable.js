
const ruta = "../controllers/Productos.controllers.php?operacion=getAll";


const tablaProductos = $('#TbProductos').DataTable({
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
            title: 'Productos',
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'excel',
            text: '<i class="bi bi-file-earmark-excel"></i> Exportar Excel',
            className: 'btn btn-success me-2',
            title: 'Productos',
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'pdf',
            text: '<i class="bi bi-file-earmark-pdf"></i> Exportar PDF',
            className: 'btn btn-danger me-2',
            title: 'Productos',
            orientation: 'portrait',
            pageSize: 'A4', 
            exportOptions: {
                columns: ':visible' 
            }
        },
        {
            extend: 'print',
            text: '<i class="bi bi-printer"></i> Imprimir',
            className: 'btn btn-secondary me-2',
            title: 'Productos',
            exportOptions: {
                columns: ':visible'
            }
        }
    ],
    ajax: {
        url: ruta,
        type: 'GET',
        dataSrc: ''
    },
    columnDefs: [
        { width: '20%', targets: 0 }, // Marca
        { width: '20%', targets: 1 }, // Tipo de Producto
        { width: '20%', targets: 2 }, // Modelo
        { width: '10%', targets: 3 }, // Precio Actual
        { width: '30%', targets: 4 }  // Código de Barra
    ],
    columns: [
        { data: 'marca', title: 'Marca' },
        { data: 'tipo_producto', title: 'Tipo de Producto' },
        { data: 'modelo', title: 'Modelo' },
        { data: 'precio_actual', title: 'Precio Actual' },
        { data: 'codigo_barra', title: 'Código de Barra' }
    ],
    order: [[6, 'desc']],
    language: {
        "url": "../es-ES.json"
    },
    paging: true,
    searching: true,
    info: false
});
