import config from "../env.js";

window.addEventListener("DOMContentLoaded", () => {

  const dni = document.querySelector("#txtDni");
  const fechaInicio = document.querySelector("#txtFechaInicio");
  const fechaFin = document.querySelector("#txtFechaFin");
  const tarifario = document.querySelector("#slcServicio");
  const precio = document.querySelector("#txtPrecio");
  const direccion = document.querySelector("#txtDireccion");
  const sector = document.querySelector("#slcSector");
  const referencia = document.querySelector("#txtReferencia");
  const coordenada = document.querySelector("#txtCoordenada");
  const slcSector = document.querySelector("#slcSector");

  $(document).ready(function () {
    $('#listarContratos').DataTable({
      language: {
        url: `${config.HOST}Json/es-Es.json`
      },
      columnDefs: [
        { "width": "20%", "targets": 0 },
        { "width": "20%", "targets": 1 },
        { "width": "20%", "targets": 2 },
        { "width": "20%", "targets": 3 },
        { "width": "20%", "targets": 4 } 
      ]
    });
  });

  $('#slcSector').select2({
    theme: 'bootstrap-5',
    placeholder: "Seleccione",
    allowClear: true
  });

  (async () => {
    const response = await fetch(`${config.HOST}controllers/sectores.controllers.php?operacion=getAll`);
    const data = await response.json();
    data.forEach((sector) => {
      const option = document.createElement("option");
      option.value = sector.id_sector;
      option.textContent = sector.sector;
      slcSector.appendChild(option);
    });
  })();

  (async () => {
    const response = await fetch(`${config.HOST}controllers/contrato.controllers.php?operacion=getAll`);
    const data = await response.json();
    const tbody = document.querySelector("#listarContratos tbody");
    console.log(data);
    data.forEach((contrato) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${contrato.nombre_cliente}</td>
        <td>${contrato.direccion_servicio}</td>
        <td>${contrato.fecha_inicio}</td>
        <td>${contrato.fecha_fin}</td>
        <td>
          <button class="btn btn-sm btn-warning">Editar</button>
          <button class="btn btn-sm btn-danger">Eliminar</button>
          <button class="btn btn-sm btn-primary btnGenerar">PDF</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    const botones = document.querySelectorAll(".btnGenerar");

    console.log(botones);

    botones.forEach(boton => {
      boton.addEventListener("click", () => {
        window.open(`../reports/Carpeta-PDF/soporte.php`);
      });
    });

  })();

  async function fichaInstalacionGpon() {
    const response = await fetch(`${config.HOST}json/FichaGpon.json`);
    const data = await response.json();
    return data;
  }

  async function resetUI() {
    $("#txtDni").val("");
    $("#txtFechaInicio").val("");
    $("#txtFechaFin").val("");
    $("#slcServicio").val("");
    $("#txtPrecio").val("");
    $("#txtDireccion").val("");
    $("#slcSector").val("");
    $("#txtReferencia").val("");
    $("#txtCoordenada").val("");
  }

  async function registrar() {
    const fechaRegistro = new Date().toString();
    const fichaInstalacion = await fichaInstalacionGpon();
    const nota = "";
    const operacion = "add";
    const idUsuarioRegistro = user.idRol;

    if (dni.val() === "" || fechaInicio.val() === "" || fechaFin.val() === "" || tarifario.val() === "" ||
      precio.val() === "" || direccion.val() === "" || sector.val() === "" || referencia.val() === "" ||
      coordenada.val() === "" || slcSector.val() === "0") {
      alert("Complete todos los campos");
    }
    else {
      const registro = await fetch(`${config.HOST}controllers/contrato.controllers.php`, {
        method: "POST",
        body: JSON.stringify({
          operacion: operacion,
          parametros: {
            idCliente: 1,
            idTarifario: tarifario.val(),
            idSector: sector.val(),
            idUsuarioRegistro: idUsuarioRegistro,
            direccion: direccion.val(),
            referencia: referencia.val(),
            coordenada: coordenada.val(),
            fechaInicio: fechaInicio.val(),
            fechaFin: fechaFin.val(),
            fechaRegistro: fechaRegistro,
            fichaInstalacion: fichaInstalacion,
            nota: nota
          }
        })
      });
      const respuesta = await registro.json();
      if (respuesta.guardado) {
        alert("Contrato registrado correctamente");
        resetUI();
      }
    }
  }

  document.querySelector("#btnRegistrar").addEventListener("click", (event) => {
    event.preventDefault();
    registrar();
  })



});