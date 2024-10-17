import config from "../env.js";
window.addEventListener("DOMContentLoaded", () => {
  const nroDoc = document.querySelector("#txtNumDoc");
  const nombre = document.querySelector("#txtNombre");
  const fechaInicio = document.querySelector("#txtFechaInicio");
  const txtfechaFin = document.querySelector("#txtFechaFin");
  const precio = document.querySelector("#txtPrecio");
  const direccion = document.querySelector("#txtDireccion");
  const sector = document.querySelector("#slcSector");
  const referencia = document.querySelector("#txtReferencia");
  const coordenada = document.querySelector("#txtCoordenada");
  const slcSector = document.querySelector("#slcSector");
  const slcServicio = document.querySelector("#slcServicio");
  const span = document.querySelector('#infoFecha');

  let lapsoTiempo = false;
  let fechaFin = null;
  let precioServicio = 0;
  let idCliente = null;
  let idServicio = 0;
  let idPersona = '';
  let idEmpresa = '';

  async function getQueryParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const params = Object.fromEntries(urlParams.entries());
    if (params.nroDoc) {
      nroDoc.value = params.nroDoc;
      nroDoc.disabled = true;
      coordenada.value = params.coordenadas;
      direccion.value = params.direccion;
      referencia.value = params.referencia;
      const optionToSelect = slcServicio.querySelector(`option[value="${params.paquete}"]`);
      if (optionToSelect) {
        optionToSelect.selected = true;
      }
    }
  }

  async function fetchSectores() {
    const response = await fetch(`${config.HOST}app/controllers/Sector.controllers.php?operacion=listarSectores`);
    return await response.json();
  }

  async function fetchPaquetes() {
    const response = await fetch(`${config.HOST}app/controllers/Paquete.controllers.php?operacion=listarPaquetes`);
    return await response.json();
  }

  async function fetchContratos() {
    const response = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=listarContratos`);
    return await response.json();
  }

  async function validarFechas() {
    if (fechaInicio.value > txtfechaFin.value) {
      showToast("¡La fecha de inicio no puede ser mayor a la fecha de fin!", "ERROR");
      return false;
    } else {
      return true;
    }
  }

  async function buscarCliente(nroDoc) {
    if (nroDoc == "") {
      showToast("¡Ingrese numero de documento!", "INFO");
    } else {
      const response = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteExistencia&nroDoc=${nroDoc}`);
      const data = await response.json();
      if (data == []) {
        showToast("No existe la persona", "WARNING");
      } else {
        if (data[0].id_cliente == null) {
          if (!data[0].id_empresa) {
            idPersona = data[0].id_persona;
            idEmpresa = '';
          } else if (!data[0].id_persona) {
            idPersona = '';
            idEmpresa = data[0].id_empresa;
          }
          nombre.value = data[0].nombres;
        } else {
          const response = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${nroDoc}`);
          const data2 = await response.json();
          nombre.value = data2[0].nombre;
          direccion.value = data2[0].direccion;
          coordenada.value = data2[0].coordenadas;
          referencia.value = data2[0].referencia;
          idPersona = '';
          idEmpresa = '';
          idCliente = data2[0].id_cliente;
        }
      }
    }
  }

  async function registrarCliente() {
    const params = new FormData();
    params.append("operacion", "registrarCliente");
    params.append("idPersona", idPersona);
    params.append("idEmpresa", idEmpresa);
    params.append("direccion", direccion.value);
    params.append("referencia", referencia.value);
    params.append("idUsuario", user.idUsuario);
    params.append("coordenadas", coordenada.value);

    const response = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php`, {
      method: "POST",
      body: params,
    })
    const data = await response.json();
    idCliente = data[0].id_cliente;
  }

  async function registrarContrato() {
    const fechaRegistro = new Date().toISOString().split('T')[0];
    const nota = "";
    const idUsuarioRegistro = user.idRol;

    if (!await validarCampos() || await !validarFechas()) {

    } else if (!lapsoTiempo) {
      showToast("¡La fecha de fin debe ser mayor a 3 meses!", "INFO");
    } else {
      try {
        const response = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php`, {
          method: "POST",
          body: JSON.stringify({
            operacion: "registrarContrato",
            parametros: {
              idCliente: idCliente,
              idTarifario: idServicio,
              idSector: sector.value,
              direccion: direccion.value,
              referencia: referencia.value,
              coordenada: coordenada.value,
              fechaInicio: fechaInicio.value,
              fechaFin: fechaFin,
              fechaRegistro: fechaRegistro,
              nota: nota,
              idUsuario: user.idUsuario,
            },
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.error) {
          console.log(data.error);
        } else {
          showToast("¡Contrato registrado correctamente!", "SUCCESS");
          span.classList.add('invisible');
          nroDoc.disabled = false;
          window.location.reload();
          resetUI();
        }
      } catch (error) {
        console.log(error);  // Añade este log para depurar el error
        showToast("Ocurrió un error al registrar el contrato. Por favor, inténtelo de nuevo.", "ERROR");
      }
    }
  }

  async function eliminar(idContrato, idUsuario) {
    if (await ask("¿Desea eliminar este contrato?")) {
      const response = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php`, {
        method: "PUT",
        body: JSON.stringify({
          operacion: "eliminarContrato",
          parametros: {
            id: idContrato,
            idUsuario: idUsuario
          },
        }),
      });
      const data = await response.json();
      if (data.eliminado) {
        showToast("¡Contrato eliminado correctamente!", "SUCCESS");
        location.reload();
      }
    }
  }

  async function cargarDatos() {
    const dataSectores = await fetchSectores();
    dataSectores.forEach((sector) => {
      const option = document.createElement("option");
      option.value = sector.id_sector;
      option.textContent = sector.sector;
      slcSector.appendChild(option);
    });

    const dataPaquetes = await fetchPaquetes();
    dataPaquetes.forEach((paquete) => {
      const option = document.createElement("option");
      const id = `${paquete.id_servicio} - ${paquete.precio}`;
      option.value = id;
      option.textContent = paquete.servicio;
      slcServicio.appendChild(option);
    });

    const dataContratos = await fetchContratos();
    const tbody = document.querySelector("#listarContratos tbody");

    dataContratos.forEach((contrato) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="text-center">${contrato.nombre_cliente}</td>
        <td class="text-center">${contrato.num_identificacion}</td>
        <td class="text-center">${contrato.servicio}</td>
        <td class="text-center">${contrato.direccion_servicio}</td>
        <td class="text-center">${contrato.fecha_inicio}</td>
        <td class="text-center">${contrato.fecha_fin}</td>
        <td>
          <button class="btn btn-sm btn-warning"><i class="fa-regular fa-pen-to-square"></i></button>
          <button class="btn btn-sm btn-danger btnEliminar" data-idContrato=${contrato.id_contrato}><i class="fa-regular fa-trash-can"></i></button>
          <button class="btn btn-sm btn-primary btnGenerar" data-idContrato=${contrato.id_contrato}><i class="fa-solid fa-file-pdf"></i></button>
          <button class="btn btn-sm btn-success btnFicha" data-tipoPaquete=${contrato.tipo_paquete} data-idContrato=${contrato.id_contrato}>Ficha</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    var tabla = new DataTable("#listarContratos", {
      language: {
        url: `https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json`,
      },
      columnDefs: [
        { width: "12.5%", targets: 0 },
        { width: "12.5%", targets: 1 },
        { width: "12.5%", targets: 2 },
        { width: "12.5%", targets: 3 },
        { width: "11%", targets: 4 },
        { width: "12.5%", targets: 5 },
        { width: "14%", targets: 6 },
      ],
    });

    const botonesPdf = document.querySelectorAll(".btnGenerar");
    const botonesEliminar = document.querySelectorAll(".btnEliminar");
    const botonesFicha = document.querySelectorAll(".btnFicha");

    botonesFicha.forEach((boton) => {
      boton.addEventListener("click", (event) => {
        const idContrato = event.target.getAttribute("data-idContrato");
        const tipoPaquete = event.target.getAttribute("data-tipoPaquete");
        const tipoFicha = {
          "GPON": "FichaTecnicaGpon",
          "WISP": "FichaTecnicaWisp",
          "CABl": "FichaTecnicaCable",
          "FIBR": "FichaTecnicaGpon",
        };
        window.location.href = `${config.HOST}//views/contratos/${tipoFicha[tipoPaquete]}.php?idContrato=${idContrato}`;
      });
    });

    botonesEliminar.forEach((boton) => {
      boton.addEventListener("click", (event) => {
        const idContrato = event.target.getAttribute("data-idContrato");
        eliminar(idContrato, 1); //el uno se reemplaza por el IdUsuario
      });
    });

    botonesPdf.forEach((boton) => {
      boton.addEventListener("click", () => {
        const idContrato = boton.getAttribute("data-idContrato");
        window.open(`${config.HOST}views/reports/Contrato/soporte.php?id=${idContrato}`);
      });
    });
  }

  async function validarCampos() {
    if (nroDoc.value == "" || nombre.value == "" || fechaInicio.value == "" || txtfechaFin.value == "" || precio.value == "" || direccion.value == "" || sector.value == "" || referencia.value == "" || coordenada.value == "" || slcSector.value == "0" || slcServicio.value == "0") {
      showToast("¡Llene todos los campos!", "INFO");
      return false;
    } else {
      return true;
    }
  }

  async function resetUI() {
    nroDoc.value = "";
    nombre.value = "";
    fechaInicio.value = "";
    txtfechaFin.value = "";
    precio.value = "";
    direccion.value = "";
    sector.value = "";
    referencia.value = "";
    coordenada.value = "";
    slcSector.value = "0";
    slcServicio.value = "0";
  }

  (async () => {
    await getQueryParams();
    await cargarDatos();
    const today = new Date().toISOString().split('T')[0];
    fechaInicio.value = today;
  })();

  document.querySelector("#btnRegistrar").addEventListener("click", async (event) => {
    event.preventDefault();
    if (idCliente == null) {
      await registrarCliente();
    }
    await registrarContrato();
  });

  document.querySelector("#btnBuscar").addEventListener("click", async (event) => {
    event.preventDefault();
    await buscarCliente(nroDoc.value);
  });

  document.querySelector('#txtFechaFin').addEventListener('input', () => {

    const fechaInicioValue = document.querySelector('#txtFechaInicio').value;
    const txtFechaFinValue = document.querySelector('#txtFechaFin').value;
    if (txtFechaFinValue > 3) {
      lapsoTiempo = true;
      const dateFechaInicio = new Date(fechaInicioValue);
      const meses = parseInt(txtFechaFinValue, 10);

      dateFechaInicio.setMonth(dateFechaInicio.getMonth() + meses);

      const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
      fechaFin = dateFechaInicio.toLocaleDateString('es-ES', opciones);

      span.textContent = `La fecha de fin es: ${fechaFin}`;
      span.classList.remove('invisible');
      const partesFecha = fechaFin.split('/');
      fechaFin = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;
    } else {
      lapsoTiempo = false;
      span.textContent = "La fecha de fin debe ser mayor a 3 meses";
      span.classList.remove('invisible');
    }
    if (txtFechaFinValue == '') {
      lapsoTiempo = false;
      span.classList.add('invisible');
    }
  });

  $("#slcServicio").on("select2:select", function () {
    idServicio = parseInt(slcServicio.value.split((" - ")[0]))
    precioServicio = parseFloat(slcServicio.value.split(" - ")[1]);
    precio.value = precioServicio;
    slcServicio.value = idServicio;
  });

  $(".select2me").select2({ theme: "bootstrap-5", placeholder: "Seleccione Servicio", allowClear: true });
  $('.select2me').parent('div').children('span').children('span').children('span').css('height', ' calc(3.5rem + 2px)');
  $('.select2me').parent('div').children('span').children('span').children('span').children('span').css('margin-top', '18px');
  $('.select2me').parent('div').find('label').css('z-index', '1');
});
