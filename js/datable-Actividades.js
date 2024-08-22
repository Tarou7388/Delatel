
window.addEventListener('DOMContentLoaded', event => {
    $(document).ready(function () {
        $('#listarActividades').DataTable({
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
            },
            columnDefs: [
                { "width": "5%", "targets": 0 },
                { "width": "35%", "targets": 1 },
                { "width": "20%", "targets": 2 },
                { "width": "15%", "targets": 3 },
                { "width": "15%", "targets": 4 },
                { "width": "15%", "targets": 5 },
            ],
            paging: false,
            searching: true,
            info: true,
            lengthChange: false
        });
    });
});