import config from '../env.js';
const ruta = `${config.HOST}app/controllers/Kardex.ssp.php`;

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
      filename: function () { return getFileName('CSV'); },
      title: function () { return getFileTitle(); }
    },
    {
      extend: 'excel',
      text: '<i class="fa-solid fa-file-excel"></i>',
      className: 'btn btn-success me-2',
      filename: function () { return getFileName('Excel'); },
      title: function () { return getFileTitle(); }
    },
    {
      extend: 'pdf',
      text: '<i class="fa-solid fa-file-pdf"></i>',
      className: 'btn btn-danger me-2',
      filename: function () { return getFileName('PDF'); },
      title: function () { return getFileTitle(); }
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
    dataSrc: function (json) {
      return json.data;
    },
    error: function (xhr, error, thrown) {
      console.error('Error en la carga de datos:', error, thrown);
      alert('Error al cargar los datos. Por favor, revisa la consola para más detalles.');
    }
  },
  columnDefs: [
    { targets: 0, width: '15%' },
    { targets: 1, width: '10%' },
    { targets: 2, width: '10%' },
    { targets: 3, width: '10%' },
    { targets: 4, width: '10%' },
    { targets: 5, width: '10%' },
    { targets: 6, width: '10%' },
    { targets: 7, width: '10%' },
    { targets: 8, width: '15%' }
  ],
  columns: [
    {
      data: function (row) {
        return `${row[3]} ${row[2]}`;
      },
      title: 'Producto',
      className: 'text-center'
    },
    { data: 11, title: 'Almacén', className: 'text-center' },
    { data: 6, title: 'Fecha', className: 'text-center' },
    { data: 13, title: 'Movimiento', className: 'text-center' },
    { data: 7, title: 'Operación', className: 'text-center' },
    { data: 8, title: 'Cantidad', className: 'text-center' },
    { data: 9, title: 'Saldo Total', className: 'text-center' },
    { data: 10, title: 'Valor Histórico', className: 'text-center' },
    { data: 12, title: 'Creado Por', className: 'text-center' }
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
  return `${productName[3]} ${productName[2]} - kardex (${type})`;
}
function getFileTitle() {
  const productName = tablaKardex.column(0).data()[0];
  return `${productName[3]} ${productName[2]} - kardex`;
}