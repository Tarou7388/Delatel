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
  let idServicio = 0;
  let idPersona = null;

  async function getQueryParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const params = Object.fromEntries(urlParams.entries());
    if (params.dni) {
      dni.value = params.dni;
      dni.disabled = true;
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

  async function buscarCliente(dni) {
    if (dni == "") {
      showToast("¡Ingrese numero de documento!", "INFO");
    } else {
      const response = await fetch(`${config.HOST}app/controllers/Persona.controllers.php?operacion=buscarPersonaClienteDni&dni=${dni}`);
      const data = await response.json();
      if (data[0].id_cliente == null) {
        idPersona = data[0].id_persona;
        nombre.value = data[0].nombres;
      }else{
        const response = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${dni}`);
        const data = await response.json();
        nombre.value = data[0].nombre;
        direccion.value = data[0].direccion;
        coordenada.value = data[0].coordenada;
        referencia.value = data[0].referencia;
        idPersona = null;
        idCliente = data[0].id_cliente;
      }
    }
  }

  async function registrarCliente() {
    const params = new FormData();
    params.append("operacion", "registrarCliente");
    params.append("idPersona", idPersona);
    params.append("idEmpresa", '');
    params.append("direccion", direccion.value);
    params.append("referencia", referencia.value);
    params.append("idUsuario", user.idUsuario);
    params.append("coordenadas", coordenada.value);

    const response = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php`, {
      method: "POST",
      body: params,
    })
    const data = await response.json();
    console.log(data);
    idCliente = data[0].id_cliente;
    registrarContrato();
  }

  async function registrarContrato() {
    const fechaRegistro = new Date().toISOString().split('T')[0];
    const nota = "";
    const idUsuarioRegistro = user.idRol;

    if (!validarFechas() || !(await validarCampos())) {
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
              idUsuarioRegistro: idUsuarioRegistro,
              direccion: direccion.value,
              referencia: referencia.value,
              coordenada: coordenada.value,
              fechaInicio: fechaInicio.value,
              fechaFin: fechaFin.value,
              fechaRegistro: fechaRegistro,
              nota: nota,
              idUsuario: user.idUsuario,
            },
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          showToast("¡Contrato registrado correctamente!", "SUCCESS");
          resetUI();
        }
      } catch (error) {
        console.error(error);  // Añade este log para depurar el error
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
          <button class="btn btn-sm btn-warning">Editar</button>
          <button class="btn btn-sm btn-danger btnEliminar" data-idContrato=${contrato.id_contrato}>Eliminar</button>
          <button class="btn btn-sm btn-primary btnGenerar" data-idContrato=${contrato.id_contrato}>PDF</button>
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
        window.location.href = `${config.HOST}views/contratos/${tipoFicha[tipoPaquete]}.php?idContrato=${idContrato}`;
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
        window.open(`${config.HOST}/views/reports/Contrato/soporte.php?id=${idContrato}`);
      });
    });
  }

  async function validarCampos() {
    return !(dni.value === "" || nombre.value === "" || fechaInicio.value === "" || fechaFin.value === "" || precio.value === "" || direccion.value === "" || sector.value === "" || referencia.value === "" || coordenada.value === "" || slcSector.value === "0" || slcServicio.value === "0");
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

  function validarFechas() {
    return fechaInicio.value <= fechaFin.value;
  }

  (async () => {
    await getQueryParams();
    await cargarDatos();
  })();

  document.querySelector("#btnRegistrar").addEventListener("click", async (event) => {
    event.preventDefault();
    console.log(idPersona);
    if (idPersona > 0) {
      console.log("Hola");
      await registrarCliente();
    }
    //await registrarContrato();
  });

  document.querySelector("#btnBuscar").addEventListener("click", async (event) => {
    event.preventDefault();
    await buscarCliente(dni.value);
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
