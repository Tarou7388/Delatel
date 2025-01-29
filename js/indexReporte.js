import config from "../env.js";
document.addEventListener("DOMContentLoaded", () => {
  $('#listarClienteyContratos').DataTable({
    processing: true,
    serverSide: true,
    ajax: `${config.HOST}app/controllers/Clientes.ssp.php`,
    columns: [
      { data: 0, className: "text-center", visible: false },
      { data: 1, className: "text-center" },
      { data: 2, className: "text-center" },
      { data: 3, className: "text-center" },
      { data: 4, className: "text-center" }
    ],
    paging: true,
    lengthChange: false,
    searching: true,
    ordering: true,
    info: true,
    autoWidth: false,
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
    },
  });
});
