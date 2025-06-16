import config from "../../env.js";

document.addEventListener("DOMContentLoaded", function () {
    $(document).ready(function () {
        const table = $("#tblGestionPendientes").DataTable({
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
            },
            processing: true,
            serverSide: true,
            responsive: false, // Desactiva el plugin responsive de DataTables
            ajax: {
                url: `${config.HOST}app/controllers/Soporte.ssp.php`,
                type: "GET",
                error: function (error, thrown) {
                    console.error('Error en la carga de datos:', error, thrown);
                    alert('Error al cargar los datos. Por favor, revisa la consola para más detalles.');
                }
            },
            order: [[2, "DESC"]],
            columns: [
                { data: 1, className: "text-start" },
                { data: 2, className: "text-center" },
                { data: 3, className: "text-center" },
                {
                    data: 4,
                    className: "text-center",
                    render: function (data) {
                        return data ? data : "<strong>No concretado</strong>";
                    }
                },
                {
                    data: 5,
                    className: "text-center",
                    render: function (data) {
                        return data && data.trim()
                            ? `<div style="text-align: center;">${data}</div>`
                            : "<span class='text-muted'>No proporcionado</span>";
                    }
                },
                {
                    data: 10,
                    className: "text-center",
                    render: function (data) {
                        return data && data.trim()
                            ? `<div style="text-align: justify;">${data}</div>`
                            : "<span class='text-muted'>No proporcionado</span>";
                    }
                },
                { data: 6, className: "text-center" },
                {
                    data: null,
                    className: "text-center",
                    render: function (data, type, row) {
                        if (row[8]) {
                            return '<span class="badge bg-danger" style="font-size: 1.05em">Cancelado</span>';
                        } else if (row[9] == 1) {
                            return '<span class="badge bg-success" style="font-size: 1.05em">Completado</span>';
                        } else {
                            return '<span class="badge bg-warning text-dark" style="font-size: 1.05em">Pendiente</span>';
                        }
                    }
                }
            ],
            columnDefs: [
                {
                    targets: [1, 2, 3, 4], // columnas a ocultar en móvil
                    className: "d-none d-md-table-cell"
                }
            ],
            paging: true,
            searching: true,
            info: true,
            lengthChange: false,
        });

        // Altura de celdas
        $('#tblGestionPendientes').on('draw.dt', function () {
            $('#tblGestionPendientes td, #tblGestionPendientes th').each(function () {
                this.style.height = '50px';
            });
        });

        // Expansión personalizada en móvil
        $('#tblGestionPendientes tbody').on('click', 'tr', function () {
            // Solo en móvil
            if (window.innerWidth < 768) {
                var row = table.row(this);
                if (row.child.isShown()) {
                    row.child.hide();
                    $(this).removeClass('shown');
                } else {
                    const rowData = row.data();
                    let detalle = `
                    <div>
                        <strong>DNI:</strong> ${rowData[2]}<br>
                        <strong>Fecha Solicitud:</strong> ${rowData[3]}<br>
                        <strong>Fecha Asistencia:</strong> ${rowData[4] ? rowData[4] : "No concretado"}<br>
                        <strong>Descripción:</strong> ${rowData[5]}<br>
                        <strong>Solución:</strong> ${rowData[10]}<br>
                    </div>
                `;
                    row.child(detalle).show();
                    $(this).addClass('shown');
                }
            }
        });
    });
});

