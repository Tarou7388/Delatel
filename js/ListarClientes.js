import config from "../env.js";

document.addEventListener("DOMContentLoaded", function () {
    const ruta = "../controllers/Cliente.controllers.php?operacion=getAll";
    if (permisos[0].permisos.inventariado.leer != 1) {
        window.location.href = `${config.HOST}views`;
    }
    const userid = user['idUsuario'];
    window.tablaProductos = $('#listarCliente').DataTable({
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
            { data: 'nombre_cliente', title: 'Nombre cliente' },
            { data: 'representante_cliente', title: 'N° identificador' },
            { data: 'email_cliente', title: 'Emailr' },
            { data: 'telefono_cliente', title: 'Teléfono' },
            { data: 'direccion_cliente', title: 'Dirección' },
            { data: 'referencia_cliente', title: 'Referencia' },
            { data: 'coordenadas_cliente', title: 'Coordenadas' },
            {
                data: null,
                title: 'Acciones',
                render: function (data, type, row) {
                    return `
<button class="btn btn-warning btn-edit" data-id="${row.id_cliente}"><i class="fa-regular fa-pen-to-square"></i></button>
<button class="btn btn-danger btn-delete" data-id="${row.id_cliente}"><i class="fa-regular fa-trash-can"></i></button>
`;
                }
            }
        ]
    });





});