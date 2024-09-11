import config from "../env.js";

window.addEventListener("DOMContentLoaded", () => {

  $(document).ready(function () {
    $('#listarContratos').DataTable({
      language: {
        url: `${config.HOST}Json/es-Es.json`
      },
      columnDefs: [
        { "width": "40%", "targets": 0 },
        { "width": "20%", "targets": 1 },
        { "width": "40%", "targets": 2 }
      ]
    });
  });
  const boton = document.querySelector("#generar");

  //funcion para traer solo json de ContratoGpon
  async function listarContratos() {
    const response = await fetch(`${config.HOST}json/ContratoGpon.json`);
    const data = await response.json();
    return data;
  }


  async function registrar() {
    const dni = $("#txtDni");
    const fechaInicio = $("#txtFechaInicio");
    const fechaFin = $("#txtFechaFin");
    const tarifario = $("#slcServicio");
    const precio = $("#txtPrecio");
    const direccion = $("#txtDireccion");
    const sector = $("#slcSector");
    const referencia = $("#txtReferencia");
    const coordenada = $("#txtCoordenada");
    const fechaRegistro = new Date().toString();
  }

  document.querySelector("#btnRegistrar").addEventListener("click", (event) => {
    event.preventDefault();
    registrar();
  })

  boton.addEventListener("click", () => {
    window.open(`../reports/Carpeta-PDF/soporte.php`);
  });

});