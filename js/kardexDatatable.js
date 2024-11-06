import config from '../env.js';
const ruta = `${config.HOST}app/controllers/Kardex.controllers.php?operacion=listarKardex`;

window.tablaKardex = $('#TbKardex').DataTable({
    dom: `
    <"row"<"col-sm-12 col-md-6"B><"col-sm-12 col-md-6 text-end"f>>
    <"row"<"col-sm-12"tr>>
    <"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>
`,
    buttons: [
        {
            extend: 'csv',
            text: '<i class="fa-solid fa-file-csv"></i>',
            className: 'btn btn-primary me-2',
            filename: function () {
                return getFileName('CSV');
            },
            title: function () {
                return getFileTitle();
            }
        },
        {
            extend: 'excel',
            text: '<i class="fa-solid fa-file-excel"></i>',
            className: 'btn btn-success me-2',
            filename: function () {
                return getFileName('Excel');
            },
            title: function () {
                return getFileTitle();
            }
        },
        {
            extend: 'pdf',
            text: '<i class="fa-solid fa-file-pdf"></i>',
            className: 'btn btn-danger me-2',
            filename: function () {
                return getFileName('PDF');
            },
            title: function () {
                return getFileTitle();
            }
        },
        {
            extend: 'print',
            text: '<i class="fa-solid fa-print"></i>',
            className: 'btn btn-secondary me-2'
        }
    ],
    processing: true,
    serverSide: true,
    ajax: {
      url: ruta,
      type: "GET",
      data: function (d) {
        return {
          draw: d.draw,
          start: d.start,
          length: d.length,
          search: d.search.value,
        };
      },
      dataSrc: function (json) {
        return json.data;
      },
    },
    columnDefs: [
        { targets: 0, width: '20%' },
        { targets: 1, width: '10%' },
        { targets: 2, width: '20%' },
        { targets: 3, width: '20%' },
        { targets: 4, width: '10%' },
        { targets: 5, width: '10%' },
        { targets: 6, width: '10%' }
    ],
    columns: [
        {
            data: null,
            render: function (data, type, row) {
                return `${row.tipo_producto} ${row.modelo}`;
            },
            title: 'Producto', className: 'text-center' 
        },
        { data: 'nombre_almacen', className: 'text-center' },
        { data: 'fecha', className: 'text-center' },
        { data: 'tipo_movimiento', className: 'text-center'  },
        { data: 'tipo_operacion', className: 'text-center' },
        { data: 'cantidad', className: 'text-center' },
        { data: 'saldo_total', className: 'text-center' },
        { data: 'valor_unico_historico', className: 'text-center' }
    ],
    order: [],
    language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
    },
    paging: true,
    searching: true,
    info: false,
    lengthChange: false
});

function getFileName(type) {
    const productName = tablaKardex.column(0).data()[0];
    return `${productName.tipo_producto + productName.modelo} - kardex (${type})`;
}
function getFileTitle() {
    const productName = tablaKardex.column(0).data()[0];
    return `${productName.tipo_producto + productName.modelo} - kardex`;
}
