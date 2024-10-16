import config from "../env.js";
window.addEventListener("DOMContentLoaded", () => {
  const nroDoc = document.querySelector("#txtNumDoc");
  const nombre = document.querySelector("#txtNombre");
  const fechaInicio = document.querySelector("#txtFechaInicio");
  const txtfechaFin = document.querySelector("#txtFechaFin");
  const precio = document.querySelector("#txtPrecio");
  const direccion = document.querySelector("#txtDireccion");
  const email = document.querySelector("#txtEmail");
  const sector = document.querySelector("#slcSector");
  const referencia = document.querySelector("#txtReferencia");
  const coordenada = document.querySelector("#txtCoordenada");
  const slcSector = document.querySelector("#slcSector");
  const slcServicio = document.querySelector("#slcServicio");


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

  async function buscarCliente(nroDoc) {
    if (nroDoc == "") {
      showToast("¡Ingrese numero de documento!", "INFO");
    } else {
      const response = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteExistencia&nroDoc=${nroDoc}`);
      const data = await response.json();
      console.log(data);
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
          coordenada.value = data2[0].coordenada;
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

    for (var pair of params.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    const response = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php`, {
      method: "POST",
      body: params,
    })
    const data = await response.json();
    console.log(data);
    idCliente = data[0].id_cliente;
  }

  async function registrarContrato() {
    const fechaRegistro = new Date().toISOString().split('T')[0];
    const nota = "";
    const idUsuarioRegistro = user.idRol;

    if (!(await validarCampos())) {
      showToast("¡Complete los campos!", "INFO");
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
        console.log(data);
        if (data.error) {
          console.log(data.error);
        } else {
          showToast("¡Contrato registrado correctamente!", "SUCCESS");
          nroDoc.disabled = false;
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
      console.log("Respuesta del servidor:", data);
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
    return !(nroDoc.value === "" || nombre.value === "" || fechaInicio.value === "" || txtfechaFin.value === "" || precio.value === "" || direccion.value === "" || sector.value === "" || referencia.value === "" || coordenada.value === "" || slcSector.value === "0" || slcServicio.value === "0");
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
  })();

  document.querySelector("#btnRegistrar").addEventListener("click", async (event) => {
    event.preventDefault();
    console.log(idPersona);
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
    const span = document.querySelector('#infoFecha');
    const fechaInicioValue = document.querySelector('#txtFechaInicio').value;
    const txtFechaFinValue = document.querySelector('#txtFechaFin').value;

    if (fechaInicioValue && txtFechaFinValue >= 3) {
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
      span.textContent = "La fecha de fin debe ser mayor a 3 meses";
      span.classList.remove('invisible');
    }
  });

  $("#slcServicio").on("select2:select", function () {
    idServicio = parseInt(slcServicio.value.split((" - ")[0]))
    precioServicio = parseFloat(slcServicio.value.split(" - ")[1]);
    precio.value = precioServicio;
    slcServicio.value = idServicio;
  });

  $("#slcSector").select2({
    theme: "bootstrap-5",
    placeholder: "Seleccione Sectores",
    allowClear: true,
  });

  $("#slcServicio").select2({
    theme: "bootstrap-5",
    placeholder: "Seleccione Servicio",
    allowClear: true,
  });
});
