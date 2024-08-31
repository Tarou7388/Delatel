
const ruta = "../controllers/kardex.controllers.php?operacion=getAll";

const tablaKardex = $('#TbKardex').DataTable({
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
            filename: function() {
                return getFileName('CSV');
            },
            title:function() {
                return getFileTitle();
            }
        },
        {
            extend: 'excel',
            text: '<i class="bi bi-file-earmark-excel"></i> Exportar Excel',
            className: 'btn btn-success me-2',
            filename: function() {
                return getFileName('Excel');
            },
            title:function() {
                return getFileTitle();
            }
        },
        {
            extend: 'pdf',
            text: '<i class="bi bi-file-earmark-pdf"></i> Exportar PDF',
            className: 'btn btn-danger me-2',
            filename: function() {
                return getFileName('PDF');
            },
            title:function() {
                return getFileTitle();
            }
        },
        {
            extend: 'print',
            text: '<i class="bi bi-printer"></i> Imprimir',
            className: 'btn btn-secondary me-2'
        }
    ],
    ajax: {
        url: ruta,
        type: 'GET',
        dataSrc: ''
    },
    columnDefs: [
        { targets: 0, width: '30%' }, // Producto
        { targets: 1, width: '10%' }, // Fecha
        { targets: 2, width: '10%' }, // Tipo Operación
        { targets: 3, width: '15%' }, // Motivo
        { targets: 4, width: '15%' }, // Cantidad
        { targets: 5, width: '10%' }, // Saldo Total
        { targets: 6, width: '10%' }  // Valor Único Histórico
    ],
    columns: [
        {
            data: null,
            render: function (data, type, row) {
                return `${row.tipo_producto} ${row.modelo}`;
            },
            title: 'Producto'
        },
        { data: 'fecha' },
        { data: 'tipo_operacion' },
        { data: 'motivo' },
        { data: 'cantidad' },
        { data: 'saldo_total' },
        { data: 'valor_unico_historico' }
    ],
    order: [[1, 'desc']],
    language: {
        "url": "../json/es-ES.json"
    },
    paging: true,
    searching: true,
    info: false
});

function getFileName(type) {
    const productName = tablaKardex.column(0).data()[0];
    return `${productName.tipo_producto + productName.modelo} - kardex (${type})`;
}
function getFileTitle() {
    const productName = tablaKardex.column(0).data()[0];
    return `${productName.tipo_producto + productName.modelo} - kardex`;
}
