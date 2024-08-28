
ruta = "../controllers/kardex.controllers.php?operacion=getAll";

// TABLA DE VISTA DE KARDEX
const tablaKardex = $('#TbKardex').DataTable({
    ajax: {
        url: ruta,  // La ruta de tu controlador que retorna los datos JSON
        type: 'GET',
        dataSrc: ''
    },
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
        "url": "../es-ES.json" 
    },
    paging: true,
    searching: true,
    info: false
});