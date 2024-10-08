export function inicializarDataTable(selector, ajaxUrl, columns, columnDefs) {
  return $(selector).DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"

    },
    ajax: {
      url: ajaxUrl,
      dataSrc: ''
    },
    columns: columns,
    columnDefs: columnDefs
  });
}