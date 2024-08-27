<script src="../js/Kardex.js"></script>
ruta = "../controllers/kardex.controllers.php?operacion=getAll";

// TABLA DE VISTA DE KARDEX
const tablaKardex = $('#TbKardex').DataTable({
  ajax: {
    url: ruta,  // La ruta de tu controlador que retorna los datos JSON
    type: 'GET',
    dataSrc: ''
  },
  columns: [
    { data: 'id_producto' },
    { data: 'fecha' },
    { data: 'tipo_operacion' },
    { data: 'motivo' },
    { data: 'cantidad' },
    { data: 'saldo_total' },
    { data: 'valor_unico_historico' }
  ],
  order: [[1, 'desc']],
  language: {
    "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
  },
  paging: true,
  searching: true,
  info: false
});