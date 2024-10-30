import config from "../env.js";
import * as Herramientas from "../js/Herramientas.js";
window.addEventListener("DOMContentLoaded", async () => {
  const nroDoc = document.querySelector("#txtNumDoc");
  const nombre = document.querySelector("#txtNombre");
  const txtDuracion = document.querySelector("#txtDuracion");
  const precio = document.querySelector("#txtPrecio");
  const direccion = document.querySelector("#txtDireccion");
  const sector = document.querySelector("#slcSector");
  const referencia = document.querySelector("#txtReferencia");
  const coordenada = document.querySelector("#txtCoordenada");
  const slcSector = document.querySelector("#slcSector");
  const slcPaquetes = document.querySelector("#slcPaquetes");
  const slcPaquetesActualizar = document.querySelector("#slcPaquetesActualizar");
  const slcServicioActualizar = document.querySelector("#slcServicioActualizar");
  const txtNota = document.querySelector("#txtNota");
  const span = document.querySelector("#infoFecha");
  const accesos = await Herramientas.permisos()
  let lapsoTiempo = false;
  let fechaFin = null;
  let fechaFinActualizar = null;
  let precioServicio = 0;
  let precioServicioActualizar = 0;
  let idCliente = null;
  let idServicio = 0;
  let idServicioActualizar = 0;
  let idPersona = "";
  let idEmpresa = "";

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
      const optionToSelect = slcPaquetes.querySelector(
        `option[value="${params.paquete}"]`
      );
      if (optionToSelect) {
        optionToSelect.selected = true;
      }
    }
  }

  async function fetchSectores() {
    const response = await fetch(
      `${config.HOST}app/controllers/Sector.controllers.php?operacion=listarSectores`
    );
    return await response.json();
  }

  async function fetchPaquetesPorServicio(idServicio) {
    const response = await fetch(
      `${config.HOST}app/controllers/Paquete.controllers.php?operacion=buscarPaquetePorIdServicio&idServicio=${idServicio}`
    );
    return await response.json();
  }

  async function cargarPaquetes(idServicio) {
    const dataPaquetes = await fetchPaquetesPorServicio(idServicio);
    slcPaquetes.innerHTML = '<option value="" disabled selected>Seleccione un paquete</option>';
    dataPaquetes
      .filter(paquete => !paquete.inactive_at)
      .forEach((paquete) => {
        const option = document.createElement("option");
        const id = `${paquete.id_paquete} - ${paquete.precio} - ${paquete.duracion}`;
        option.value = id;
        option.textContent = paquete.paquete;
        slcPaquetes.appendChild(option);
      });
  }

  async function cargarPaquetesActualizar(idServicio) {
    const dataPaquetes = await fetchPaquetesPorServicio(idServicio);
    console.log(dataPaquetes)
    slcPaquetesActualizar.innerHTML = '<option value="" disabled selected>Seleccione un paquete</option>';
    dataPaquetes
      .filter(paquete => !paquete.inactive_at)
      .forEach((paquete) => {
        const option = document.createElement("option");
        const id = `${paquete.id_paquete} - ${paquete.precio} - ${paquete.duracion}`;
        option.value = id;
        option.textContent = paquete.paquete;
        slcPaquetesActualizar.appendChild(option);
      });
  }

  slcTipoServicio.addEventListener("change", async function () {
    const idServicioSeleccionado = slcTipoServicio.value;
    await cargarPaquetes(idServicioSeleccionado);
  });

  $("#slcServicioActualizar").on("select2:select", async function (e) {
    const idServicioActualizarSeleccionado = e.params.data.id;
    await cargarPaquetesActualizar(idServicioActualizarSeleccionado);
  });

  $("#slcPaquetesActualizar").on("select2:select", function () {
    const selectedValue = slcPaquetes.value.split(" - ");
    console.log(selectedValue);
    idServicio = parseInt(selectedValue[0]);
    precioServicio = selectedValue[1];
    const duracionServicio = selectedValue[2];

    document.getElementById("txtPrecioActualizar").value = precioServicio;

    let duracionFormateada = "Duracion no disponible";
    if (duracionServicio) {
      try {
        const duracionObj = JSON.parse(duracionServicio);
        duracionFormateada = Object.entries(duracionObj)
          .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value} meses`)
          .join(", ");
      } catch (e) {
        console.error("Error al parsear la duración:", e);
      }
    }

    txtDuracion.value = duracionFormateada;
    slcPaquetes.value = idServicio;
  });

  async function fetchContratos() {
    const response = await fetch(
      `${config.HOST}app/controllers/Contrato.controllers.php?operacion=listarContratos`
    );
    return await response.json();
  }

  /* async function validarFechas() {
    if (fechaInicio.value > txtfechaFin.value) {
      showToast(
        "¡La fecha de inicio no puede ser mayor a la fecha de fin!",
        "ERROR"
      );
      return false;
    } else {
      return true;
    }
  } */

  async function buscarCliente(nroDoc) {
    if (nroDoc == "") {
      showToast("¡Ingrese numero de documento!", "INFO");
    } else {
      const response = await fetch(
        `${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteExistencia&nroDoc=${nroDoc}`
      );
      const data = await response.json();
      console.log(data);
      if (data.length == 0) {
        showToast("No existe la persona", "WARNING");
      } else {
        if (data[0].id_cliente == null) {
          if (!data[0].id_empresa) {
            idPersona = data[0].id_persona;
            idEmpresa = "";
          } else if (!data[0].id_persona) {
            idPersona = "";
            idEmpresa = data[0].id_empresa;
          }
          nombre.value = data[0].nombres;
        } else {
          const response = await fetch(
            `${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${nroDoc}`
          );
          const data2 = await response.json();
          nombre.value = data2[0].nombre;
          direccion.value = data2[0].direccion;
          coordenada.value = data2[0].coordenadas;
          referencia.value = data2[0].referencia;
          idPersona = "";
          idEmpresa = "";
          idCliente = data2[0].id_cliente;
        }
      }
    }
  }

  async function registrarCliente() {
    // if (accesos?.personas?.crear) {

    // } else {
    //   showToast("No tienes acceso para crear un cliente", "ERROR");
    // }
    const params = new FormData();
    params.append("operacion", "registrarCliente");
    params.append("idPersona", idPersona);
    params.append("idEmpresa", idEmpresa);
    params.append("direccion", direccion.value);
    params.append("referencia", referencia.value);
    params.append("idUsuario", user.idUsuario);
    params.append("coordenadas", coordenada.value);

    const response = await fetch(
      `${config.HOST}app/controllers/Cliente.controllers.php`,
      {
        method: "POST",
        body: params,
      }
    );
    const data = await response.json();
    idCliente = data[0].id_cliente;
  }

  async function registrarContrato() {
    // if (accesos?.contratos?.crear) {

    // } else {
    //   showToast("No tienes acceso para registrar un contrato", "ERROR");
    // }
    const fechaRegistro = new Date().toISOString().split("T")[0];
    const nota = txtNota.value;
    console.log(nota);
    const idUsuarioRegistro = user.idRol;
    console.log(lapsoTiempo);
    if (!(await validarCampos())) {

    } else if (lapsoTiempo) {
      showToast("¡La fecha de fin debe ser mayor a 3 meses!", "INFO");
    } else {
      try {
        const response = await fetch(
          `${config.HOST}app/controllers/Contrato.controllers.php`,
          {
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
                fechaInicio: new Date().toISOString().split("T")[0],
                fechaFin: fechaFin,
                fechaRegistro: fechaRegistro,
                nota: nota,
                idUsuario: user.idUsuario,
              },
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.error) {
          console.log(data.error);
        } else {
          showToast("¡Contrato registrado correctamente!", "SUCCESS");
          span.classList.add("invisible");
          nroDoc.disabled = false;
          //window.location.reload();
          resetUI();
        }
      } catch (error) {
        console.log(error); // Añade este log para depurar el error
        showToast(
          "Ocurrió un error al registrar el contrato. Por favor, inténtelo de nuevo.",
          "ERROR"
        );
      }
    }
  }

  async function eliminar(idContrato, idUsuario) {
    // if (accesos?.contrato?.eliminar) {

    // } else {
    //   showToast("No tienes acceso para eliminar un contrato", "ERROR");
    // }
    if (await ask("¿Desea eliminar este contrato?")) {
      const response = await fetch(
        `${config.HOST}app/controllers/Contrato.controllers.php`,
        {
          method: "PUT",
          body: JSON.stringify({
            operacion: "eliminarContrato",
            parametros: {
              id: idContrato,
              idUsuario: idUsuario,
            },
          }),
        }
      );
      const data = await response.json();
      if (data.eliminado) {
        showToast("¡Contrato eliminado correctamente!", "SUCCESS");
        window.location.reload();
      }
    }
  }

  async function actualizarContrato(idContrato, idUsuario) {
    if (accesos?.contratos?.actualizar) {
      const idServicio = document.querySelector("#slcServicioActualizar").value;
      const idSector = document.querySelector("#slcSectorActualizar").value;
      const direccionServicio = document.querySelector("#txtDireccionActualizar").value;
      const referencia = document.querySelector("#txtReferenciaActualizar").value;
      const coordenada = document.querySelector("#txtCoordenadaActualizar").value;
      const fechaInicio = document.querySelector("#txtFechaInicioActualizar").value;
      const fechaRegistro = new Date().toISOString().split("T")[0];
      const nota = document.querySelector("#txtNotaActualizar").value;

      const today = new Date().toISOString().split("T")[0];
      if (fechaInicio < today) {
        showToast("¡La fecha de inicio no puede ser menor a la fecha de hoy!", "WARNING");
        return;
      }

      const response = await fetch(
        `${config.HOST}app/controllers/Contrato.controllers.php`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            operacion: "actualizarContrato",
            parametros: {
              idContrato: idContrato,
              idPaquete: idServicioActualizar,
              idSector: idSector,
              direccionServicio: direccionServicio,
              referencia: referencia,
              coordenada: coordenada,
              fechaInicio: fechaInicio,
              fechaFin: fechaFinActualizar,
              fechaRegistro: fechaRegistro,
              nota: nota,
              idUsuarioUpdate: idUsuario,
            },
          }),
        }
      );
      const data = await response.json();
      if (data.actualizado) {
        showToast("¡Contrato actualizado correctamente!", "SUCCESS");
        setTimeout(() => { window.location.reload(); }, 2500);
      } else {
        showToast("Error al actualizar el contrato.", "ERROR");
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

      slcSector.appendChild(option.cloneNode(true));
      slcSectorActualizar.appendChild(option);
    });

    //const dataPaquetes = await fetchPaquetes();
    /* dataPaquetes
      .filter((paquete) => !paquete.inactive_at) 
      .forEach((paquete) => {
      const option = document.createElement("option");
      const id = `${paquete.id_paquete} - ${paquete.precio}`;
      option.value = id;
      option.textContent = paquete.paquete;
      slcPaquetes.appendChild(option);

      // Clonar la opción solo una vez para slcServicioActualizar
      const optionClone = option.cloneNode(true);
      slcServicioActualizar.appendChild(optionClone);
      }); */

    const dataContratos = await fetchContratos();
    const tbody = document.querySelector("#listarContratos tbody");

    function formatDuracion(duracion) {
      try {
        const duracionObj = JSON.parse(duracion);
        return Object.entries(duracionObj)
          .map(
            ([key, value]) =>
              `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value} meses`
          )
          .join(", ");
      } catch (e) {
        return duracion;
      }
    }

    dataContratos.forEach((contrato) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="text-center">${contrato.nombre_cliente}</td>
        <td class="text-center">${contrato.num_identificacion}</td>
        <td class="text-center">${contrato.paquete}</td>
        <td class="text-center">${contrato.direccion_servicio}</td>
        <td class="text-center">${formatDuracion(contrato.duracion)}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning btn-edit" data-idContrato="${contrato.id_contrato
        }"><i class="fa-regular fa-pen-to-square icon-disabled"></i></button>
          <button class="btn btn-sm btn-danger btnEliminar" data-idContrato=${contrato.id_contrato
        }><i class="fa-regular fa-trash-can icon-disabled"></i></button>
          <button class="btn btn-sm btn-primary btnGenerar" data-idContrato=${contrato.id_contrato
        }><i class="fa-solid fa-file-pdf icon-disabled"></i></button>
          <button class="btn btn-sm btn-success btnFicha" data-tipoServicio=${contrato.tipo_servicio
        } data-idContrato=${contrato.id_contrato}>Ficha</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    var tabla = new DataTable("#listarContratos", {
      language: {
        url: `https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json`,
      },
      ordering: false,
      columnDefs: [
        { width: "12.5%", targets: 0 },
        { width: "12.5%", targets: 1 },
        { width: "12.5%", targets: 2 },
        { width: "14%", targets: 3 },
        { width: "17%", targets: 4 },
        { width: "14%", targets: 5 },
      ],
    });

    const botonesPdf = document.querySelectorAll(".btnGenerar");
    const botonesEliminar = document.querySelectorAll(".btnEliminar");
    const botonesFicha = document.querySelectorAll(".btnFicha");
    const botonesEdit = document.querySelectorAll(".btn-edit");

    botonesFicha.forEach((boton) => {
      boton.addEventListener("click", (event) => {
        const idContrato = event.target.getAttribute("data-idContrato");
        const tipoServicio = event.target.getAttribute("data-tipoServicio");
        const tipoFicha = {
          GPON: "FichaTecnicaGpon",
          WISP: "FichaTecnicaWisp",
          CABl: "FichaTecnicaCable",
          FIBR: "FichaTecnicaGpon",
        };
        window.location.href = `${config.HOST}views/Contratos/${tipoFicha[tipoServicio]}.php?idContrato=${idContrato}`;
      });
    });

    //Abre el modal de Actualizar
    botonesEdit.forEach((boton) => {
      boton.addEventListener("click", (event) => {
        const idContrato = event.target.getAttribute("data-idContrato");
        abrirModalEditar(idContrato);
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
        window.open(
          `${config.HOST}views/reports/Contrato/soporte.php?id=${idContrato}`
        );
      });
    });
  }

  async function validarCampos() {
    if (
      nroDoc.value == "" ||
      nombre.value == "" ||
      precio.value == "" ||
      direccion.value == "" ||
      sector.value == "" ||
      referencia.value == "" ||
      coordenada.value == "" ||
      slcSector.value == "0" ||
      slcPaquetes.value == "0"
    ) {
      showToast("¡Llene todos los campos!", "INFO");
      return false;
    } else {
      return true;
    }
  }

  async function resetUI() {
    nroDoc.value = "";
    nombre.value = "";
    //fechaInicio.value = "";
    //txtfechaFin.value = "";
    precio.value = "";
    direccion.value = "";
    sector.value = "";
    referencia.value = "";
    coordenada.value = "";
    slcSector.value = "0";
    slcPaquetes.value = "0";
  }

  async function abrirModalEditar(idContrato) {
    const modal = new bootstrap.Modal(
      document.getElementById("modalEditarContrato")
    );
    modal.show();

    try {
      const response = await fetch(
        `${config.HOST}app/controllers/Contrato.controllers.php?operacion=buscarContratoId&id=${idContrato}`
      );
      const data = await response.json();

      document.getElementById("txtIdContratoActualizar").value =
        data[0].id_contrato;
      document.getElementById("txtNombreActualizar").value =
        data[0].nombre_cliente;
      document.getElementById("txtFechaInicioActualizar").value =
        data[0].fecha_inicio;

      fechaFinActualizar = data[0].fecha_fin;

      const span = document.getElementById("mensajeFechaFin");
      span.textContent = `La fecha de fin es: ${fechaFinActualizar}`;
      span.classList.remove("invisible");

      const slcServicio = document.getElementById("slcServicioActualizar");
      const servicioId = data[0].id_servicio;
      const servicioTexto = data[0].servicio;
      let optionExists = false;

      for (let i = 0; i < slcPaquetes.options.length; i++) {
        if (slcPaquetes.options[i].value == servicioId) {
          optionExists = true;
          break;
        }
      }

      if (optionExists) {
        slcPaquetes.value = servicioId;
      } else {
        const newOption = new Option(servicioTexto, servicioId, true, true);
        slcPaquetes.add(newOption);
      }

      idServicioActualizar = servicioId;

      const slcSector = document.getElementById("slcSectorActualizar");
      const sectorId = data[0].id_sector;
      const sectorTexto = data[0].nombre_sector;
      optionExists = false;

      for (let i = 0; i < slcSector.options.length; i++) {
        if (slcSector.options[i].value == sectorId) {
          optionExists = true;
          break;
        }
      }

      if (optionExists) {
        slcSector.value = sectorId;
      } else {
        const newOption = new Option(sectorTexto, sectorId, true, true);
        slcSector.add(newOption);
      }

      document.getElementById("txtDireccionActualizar").value =
        data[0].direccion_servicio;
      document.getElementById("txtReferenciaActualizar").value =
        data[0].referencia;
      document.getElementById("txtCoordenadaActualizar").value =
        data[0].coordenada;
      document.getElementById("txtNotaActualizar").value = data[0].nota;

      document.querySelector(".btn-close").addEventListener("click", () => {
        modal.hide();
      });
    } catch (error) {
      console.error("Error al obtener los detalles del contrato:", error);
    }
  }

  document.querySelector("#txtFechaFinActualizar").addEventListener("input", () => {
    const fechaInicioValue = document.querySelector(
      "#txtFechaInicioActualizar"
    ).value;
    const txtFechaFinValue = document.querySelector(
      "#txtFechaFinActualizar"
    ).value;
    const span = document.getElementById("mensajeFechaFin");

    if (txtFechaFinValue > 3) {
      lapsoTiempo = true;
      const dateFechaInicio = new Date(fechaInicioValue);
      const meses = parseInt(txtFechaFinValue, 10);

      dateFechaInicio.setMonth(dateFechaInicio.getMonth() + meses);

      const opciones = { year: "numeric", month: "2-digit", day: "2-digit" };
      fechaFinActualizar = dateFechaInicio.toLocaleDateString(
        "es-ES",
        opciones
      );

      span.textContent = `La fecha de fin es: ${fechaFinActualizar}`;
      span.classList.remove("invisible");
      const partesFecha = fechaFinActualizar.split("/");
      fechaFinActualizar = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;
    } else {
      lapsoTiempo = false;
      span.textContent = "La fecha de fin debe ser mayor a 3 meses";
      span.classList.remove("invisible");
    }
    if (txtFechaFinValue == "") {
      lapsoTiempo = false;
      span.classList.add("invisible");
    }
  });

  (async () => {
    await getQueryParams();
    await cargarDatos();
  })();

  document
    .querySelector("#btnRegistrar")
    .addEventListener("click", async (event) => {
      event.preventDefault();
      if (idCliente == null) {
        await registrarCliente();
      }
      await registrarContrato();
    });

  document
    .querySelector("#btnBuscar")
    .addEventListener("click", async (event) => {
      event.preventDefault();
      await buscarCliente(nroDoc.value);
    });

  document
    .querySelector("#btnActualizar")
    .addEventListener("click", async (event) => {
      event.preventDefault();
      const idContrato = document.querySelector(
        "#txtIdContratoActualizar"
      ).value;
      const idUsuario = user.idUsuario;
      await actualizarContrato(idContrato, idUsuario);
    });

  $("#slcPaquetes").on("select2:select", function () {
    const selectedValue = slcPaquetes.value.split(" - ");
    console.log(selectedValue);
    idServicio = parseInt(selectedValue[0]);
    precioServicio = selectedValue[1];
    const duracionServicio = selectedValue[2];

    precio.value = precioServicio;

    let duracionFormateada = "Duracion no disponible";
    if (duracionServicio) {
      try {
        const duracionObj = JSON.parse(duracionServicio);
        duracionFormateada = Object.entries(duracionObj)
          .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value} meses`)
          .join(", ");
      } catch (e) {
        console.error("Error al parsear la duración:", e);
      }
    }

    txtDuracion.value = duracionFormateada;
    slcPaquetes.value = idServicio;
  });

  $(".select2me").select2({ theme: "bootstrap-5", allowClear: true });
  $(".select2me").parent("div").children("span").children("span").children("span").css("height", " calc(3.5rem + 2px)");
  $(".select2me").parent("div").children("span").children("span").children("span").children("span").css("margin-top", "18px");
  $(".select2me").parent("div").find("label").css("z-index", "1");


  async function cargarServicios() {
    try {
      const response = await fetch(
        `${config.HOST}app/controllers/Servicio.controllers.php?operacion=listarServicio`
      );
      const servicios = await response.json();

      const slcTipoServicio = $("#slcTipoServicio");
      const slcTipoServicioActualizar = $("#slcServicioActualizar");

      slcTipoServicio.empty();
      slcTipoServicioActualizar.empty();

      slcTipoServicio.append(
        '<option value="" disabled selected>Seleccione</option>'
      );
      slcTipoServicioActualizar.append(
        '<option value="" disabled selected>Seleccione</option>'
      );

      servicios.forEach((servicio) => {
        const option = `<option value="${servicio.id_servicio}">${servicio.tipo_servicio} (${servicio.servicio})</option>`;
        slcTipoServicio.append(option);
        slcTipoServicioActualizar.append(option);
      });

      slcTipoServicio.on("change", function () {
        idServicio = parseInt($(this).val(), 10);
      });

      slcTipoServicioActualizar.on("change", function () {
        idServicio = parseInt($(this).val(), 10);
      });
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    }
  }

  cargarPaquetes();
  cargarServicios();
});
