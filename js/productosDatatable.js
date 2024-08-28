
const ruta = "../controllers/Productos.controllers.php?operacion=getAll";


const tablaProductos = $('#TbProductos').DataTable({
    ajax: {
        url: ruta,
        type: 'GET',
        dataSrc: ''
    },
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
    info: true      
});
