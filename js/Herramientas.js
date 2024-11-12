import config from "../env.js";
export function inicializarDataTable(selector, ajaxUrl, columns, columnDefs) {
  return $(selector).DataTable({
    responsive: true,
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
export async function permisos() {
  const response = await fetch(`${config.HOST}app/controllers/Usuario.controllers.php?operacion=obtenerPermisos`);
  const data = await response.json()
  return data
}
