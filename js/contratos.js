import config from "../env.js";

window.addEventListener("DOMContentLoaded", () => {

  const dni = document.querySelector("#txtDni");
  const nombre = document.querySelector("#txtNombre");
  const fechaInicio = document.querySelector("#txtFechaInicio");
  const fechaFin = document.querySelector("#txtFechaFin");
  const precio = document.querySelector("#txtPrecio");
  const direccion = document.querySelector("#txtDireccion");
  const sector = document.querySelector("#slcSector");
  const referencia = document.querySelector("#txtReferencia");
  const coordenada = document.querySelector("#txtCoordenada");
  const slcSector = document.querySelector("#slcSector");
  const slcServicio = document.querySelector("#slcServicio");
  let precioServicio = 0;
  let idCliente = 0;

  $('#slcSector').select2({
    theme: 'bootstrap-5',
    placeholder: "Seleccione",
    allowClear: true
  });

  $('#slcServicio').select2({
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
    const response = await fetch(`${config.HOST}controllers/paquetes.controllers.php?operacion=getAll`);
    const data = await response.json();
    data.forEach((paquetes) => {
      const option = document.createElement("option");
      const id = paquetes.id + " - " + paquetes.tipo_paquete + " - " + paquetes.precio;
      option.value = id;
      option.textContent = paquetes.nombre;
      slcServicio.appendChild(option);
    });
  })();

  (async () => {
    const response = await fetch(`${config.HOST}controllers/contrato.controllers.php?operacion=getAll`);
    const data = await response.json();
    const tbody = document.querySelector("#listarContratos tbody");
    data.forEach((contrato) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${contrato.nombre_cliente}</td>
        <td>${contrato.num_identificacion}</td>
        <td>${contrato.servicio}</td>
        <td>${contrato.direccion_servicio}</td>
        <td>${contrato.fecha_inicio}</td>
        <td>${contrato.fecha_fin}</td>
        <td>
          <button class="btn btn-sm btn-warning">Editar</button>
          <button class="btn btn-sm btn-danger btnEliminar" data-idContrato=${contrato.id_contrato}>Eliminar</button>
          <button class="btn btn-sm btn-primary btnGenerar" data-idContrato=${contrato.id_contrato}>PDF</button>
          <button class="btn btn-sm btn-success btnFicha" data-tipoPaquete=${contrato.tipo_paquete} data-idContrato=${contrato.id_contrato}>Ficha</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    var tabla = new DataTable(('#listarContratos'), {
      language: {
        url: `${config.HOST}Json/es-Es.json`
      },
      columnDefs: [
        { "width": "12.5%", "targets": 0 },
        { "width": "12.5%", "targets": 1 },
        { "width": "12.5%", "targets": 2 },
        { "width": "12.5%", "targets": 3 },
        { "width": "11%", "targets": 4 },
        { "width": "12.5%", "targets": 5 },
        { "width": "14%", "targets": 6 }
      ]
    });

    const botonesPdf = document.querySelectorAll(".btnGenerar");
    const botonesEliminar = document.querySelectorAll(".btnEliminar");
    const botonesFicha = document.querySelectorAll(".btnFicha");

    botonesFicha.forEach(boton => {
      boton.addEventListener("click", (event) => {
        const idContrato = event.target.getAttribute("data-idContrato");
        const tipoPaquete = event.target.getAttribute("data-tipoPaquete");
        if (tipoPaquete == "GPON") {
          window.location.href = `${config.HOST}views/contratos/FichaTecnicaGpon.php?idContrato=${idContrato}`;
        }
        if (tipoPaquete == "WISP") {
          window.location.href = `${config.HOST}views/contratos/FichaTecnicaWisp.php?idContrato=${idContrato}`;
        }
        if (tipoPaquete == "CABl") {
          window.location.href = `${config.HOST}views/contratos/FichaTecnicaCable.php?idContrato=${idContrato}`;
        }
      });
    });

    botonesEliminar.forEach(boton => {
      boton.addEventListener("click", (event) => {
        const idContrato = event.target.getAttribute("data-idContrato");
        eliminar(parseInt(idContrato));
      });
    });

    botonesPdf.forEach(boton => {
      boton.addEventListener("click", () => {
        const idContrato = boton.getAttribute("data-idContrato");
        window.open(`../reports/Contrato/soporte.php?id=${idContrato}`);
      });
    });
  })();

  function validarFechas() {
    if (fechaInicio.value > fechaFin.value) {
      return false;
    } else {
      return true;
    }
  }

  async function validarCampos() {
    if (dni.value == "" || nombre.value == "" || fechaInicio.value == "" || fechaFin.value == "" || precio.value == "" || direccion.value == "" || sector.value == "" || referencia.value == "" || coordenada.value == "" || slcSector.value == "0" || slcServicio.value == "0") {
      return false;
    }
    else {
      return true;
    }
  }

  async function fichaInstalacionGpon() {
    const response = await fetch(`${config.HOST}json/FichaGpon.json`);
    const data = await response.json();
    return data;
  }

  async function resetUI() {
    dni.value = "";
    nombre.value = "";
    fechaInicio.value = "";
    fechaFin.value = "";
    precio.value = "";
    direccion.value = "";
    sector.value = "";
    referencia.value = "";
    coordenada.value = "";
    slcSector.value = "0";
    slcServicio.value = "0";
  }

  async function buscarCliente() {
    if (dni.value == "") {
      alert("Ingrese un número de documento");
    } else {
      const response = await fetch(`${config.HOST}controllers/cliente.controllers.php?operacion=getByDoc&numDoc=${dni.value}`);
      const data = await response.json();
      if (data.length > 0) {
        nombre.value = data[0].nombre;
        referencia.value = data[0].referencia;
        direccion.value = data[0].direccion;
        coordenada.value = data[0].coordenada;
        idCliente = data[0].id_cliente;
        console.log(data);
      }
      else {
        alert("Cliente no encontrado");
      }
    }
  }

  async function registrar() {
    const fechaRegistro = new Date().toString();
    const fichaInstalacion = await fichaInstalacionGpon();
    const nota = "";
    const idUsuarioRegistro = user.idRol;
    if (!validarFechas() || !await validarCampos()) {
      alert("Complete todos los campos");
    } else {
      try {
        const idServicio = parseInt(slcServicio.value.split(" - ")[0]);
        const fichaInstalacionJSON = JSON.stringify(fichaInstalacion);
        const response = await fetch(`${config.HOST}controllers/contrato.controllers.php`, {
          method: "POST",
          body: JSON.stringify({
            operacion: "add",
            parametros: {
              idCliente: idCliente,
              idTarifario: idServicio,
              idSector: sector.value,
              idUsuarioRegistro: idUsuarioRegistro,
              direccion: direccion.value,
              referencia: referencia.value,
              coordenada: coordenada.value,
              fechaInicio: fechaInicio.value,
              fechaFin: fechaFin.value,
              fechaRegistro: fechaRegistro,
              fichaInstalacion: fichaInstalacionJSON,
              nota: nota
            }
          }),
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }else{
          alert("Contrato registrado correctamente");
          resetUI();
        }

        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error al registrar el contrato. Por favor, inténtelo de nuevo.");
      }
    }
  }

  async function eliminar(idContrato) {
    if (confirm("¿Desea eliminar este contrato?")) {
      const response = await fetch(`${config.HOST}controllers/contrato.controllers.php`, {
        method: "PUT",
        body: JSON.stringify({
          operacion: "delete",
          parametros: {
            id: idContrato
          }
        })
      });
      const data = await response.json();
      if (data.eliminado) {
        alert("Contrato eliminado correctamente");
        location.reload();
      }
    }
  }

  document.querySelector("#btnRegistrar").addEventListener("click", (event) => {
    event.preventDefault();
    registrar();
  })

  document.querySelector("#btnBuscar").addEventListener("click", (event) => {
    event.preventDefault();
    buscarCliente();
  });

  $('#slcServicio').on('select2:select', function (e) {
    precioServicio = parseFloat(slcServicio.value.split(" - ")[2]);
    precio.value = precioServicio;
  });

});