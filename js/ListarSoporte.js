import config from "../env.js";
import { inicializarDataTable } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  const table = inicializarDataTable(
    "#tblSoporteIncompleto",
    `${config.HOST}app/controllers/Soporte.controllers.php?operacion=listarSoportesIncompletos`,
    [
      { data: "prioridad", title: "prioridad", className: "text-center" },
      { data: "tipo_soporte", title: "tipo_soporte", className: "text-center" },
      {
        data: "nombre_cliente",
        title: "nombre_cliente",
        className: "text-center",
      },
      {
        data: "nombre_tecnico",
        title: "nombre_tecnico",
        className: "text-center",
      },
      {
        data: null,
        title: "Acciones",
        className: "text-center",
        render: function (data, type, row) {
          return `<button class="btnActualizar btn btn-primary" 
                    data-id="${row.id_soporte}">Editar</button>`;
        },
      },
    ],
    [
      { width: "30%", targets: 0 },
      { width: "30%", targets: 1 },
      { width: "20%", targets: 2 },
      { width: "20%", targets: 3 },
    ]
  );
});
