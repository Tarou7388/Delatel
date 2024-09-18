import config from "../env.js";



if (permisos[0].permisos.inventariado.leer != 1) {
    window.location.href = `${config.HOST}views`;
}

const ruta = `${config.HOST}/controllers/Cliente.controllers.php?operacion=getAll`;
const userid = user['idUsuario'];
window.tablaClientes = $('#listarCliente').DataTable({
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
            filename: 'Clientes',
            title: 'Clientes',
            exportOptions: {
                columns: ':not(:last-child)'
            }
        },
        {
            extend: 'excel',
            text: '<i class="bi bi-file-earmark-excel"></i> Exportar Excel',
            className: 'btn btn-success me-2',
            filename: 'Clientes',
            title: 'Clientes',
            exportOptions: {
                columns: ':not(:last-child)'
            }
        },
        {
            extend: 'pdf',
            text: '<i class="bi bi-file-earmark-pdf"></i> Exportar PDF',
            className: 'btn btn-danger me-2',
            filename: 'Clientes',
            title: 'Clientes',
            orientation: 'landscape',
            exportOptions: {
                columns: [0, 1, 2, 3, 4]
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
        { data: 'codigo_cliente', title: 'N° identificador' },
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
<button class="btn btn-warning btn-edit" data-id="${row.codigo_cliente}"><i class="fa-regular fa-pen-to-square"></i></button>
<button class="btn btn-danger btn-delete" data-id="${row.codigo_cliente}"><i class="fa-regular fa-trash-can"></i></button>
`;
            }
        }
    ]
});
$('#listarCliente tbody').on('click', '.btn-edit', function () {
    const idcliente = $(this).data('id');

    fetch(`${config.HOST}controllers/cliente.controllers.php?operacion=getByDoc&numDoc=${idcliente}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (idcliente.toString().length >= 8 && idcliente.toString().length <= 10) {
                $('#editNombrePersona').val(data.nombre);
                // let nombreParts = data.nombre.split(', ');
                // if (nombreParts.length === 2) {
                //     $('#editNombrePersona').val(nombreParts[1]);
                //     $('#editApellidosPersona').val(nombreParts[0]);
                // }
                $('#editEmailPersona').val(data.email);
                $('#editTelefonoPersona').val(data.telefono);
                $('#editDireccionPersona').val(data.direccion);
                $('#editReferenciaPersona').val(data.referencia);
                $('#editCoordenadasPersona').val(data.coordenadas);
                $('#editPersonaModal').modal('show');
            } else if (idcliente.toString().length == 11) {
                $('#editNombreEmpresa').val(data.nombre);
                $('#editEmailEmpresa').val(data.email);
                $('#editTelefonoEmpresa').val(data.telefono);
                $('#editDireccionEmpresa').val(data.direccion);
                $('#editReferenciaEmpresa').val(data.referencia);
                $('#editCoordenadasEmpresa').val(data.coordenadas);
                $('#editEmpresaModal').modal('show');
            }
        })
        .catch(error => console.error('Error fetching product:', error));
});
