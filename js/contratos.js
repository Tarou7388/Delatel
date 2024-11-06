import config from "../env.js";
import * as Herramientas from "../js/Herramientas.js";
import * as mapa from "./Mapa.js";
window.addEventListener("DOMContentLoaded", async () => {
  const nroDoc = document.querySelector("#txtNumDoc");
  const nombre = document.querySelector("#txtNombre");
  const txtDuracion = document.querySelector("#txtDuracion");
  const precio = document.querySelector("#txtPrecio");
  const direccion = document.querySelector("#txtDireccion");
  const sector = document.querySelector("#slcSector");
  const referencia = document.querySelector("#txtReferencia");
  const coordenada = document.querySelector("#txtCoordenadas");
  //const slcSector = document.querySelector("#slcSector");
  const slcPaquetes = document.querySelector("#slcPaquetes");
  const slcPaquetesActualizar = document.querySelector("#slcPaquetesActualizar");
  //const slcServicioActualizar = document.querySelector("#slcServicioActualizar");
  const txtNota = document.querySelector("#txtNota");
  //const span = document.querySelector("#infoFecha");
  const accesos = await Herramientas.permisos();
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
  slcPaquetes.disabled = true;
  let tabla;

  // Le avisa al select cuando se activa, elimina, actualiza o agrega un servicio
  document.addEventListener("servicioActivado", cargarServicios);
  document.addEventListener("servicioDesactivado", cargarServicios);
  document.addEventListener("servicioAgregado", cargarServicios);
  document.addEventListener("servicioActualizado", cargarServicios);

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
    const data = await response.json();
    return data;
  }

  async function cargarPaquetes(idServicio) {
    const dataPaquetes = await fetchPaquetesPorServicio(idServicio);
    slcPaquetesActualizar.innerHTML = '<option value="" disabled selected>Seleccione un paquete</option>';
    slcPaquetes.innerHTML = '<option value="" disabled selected>Seleccione un paquete</option>';
    dataPaquetes
      .filter(paquete =>
        !paquete.id_servicio2 &&
        !paquete.id_servicio3 &&
        !paquete.id_servicio4 &&
        !paquete.inactive_at
      )
      .forEach((paquete) => {
        const option = document.createElement("option");
        const id = `${paquete.id_paquete} - ${paquete.precio} - ${paquete.duracion}`;
        option.value = id;
        option.textContent = paquete.paquete;
        slcPaquetes.appendChild(option);
      });
    slcPaquetes.disabled = false;
  }


  /* async function cargarPaquetesActualizar(idServicio) {
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
  } */

  async function cargarPaquetesMultiples(tipo) {
    const response = await fetch(
      `${config.HOST}app/controllers/Paquete.controllers.php?operacion=listarPaquetes`
    );
    const dataPaquetes = await response.json();
    slcPaquetes.innerHTML = '<option value="" disabled selected>Seleccione un paquete</option>';

    let paquetesFiltrados = [];
    if (tipo === "duos") {
      paquetesFiltrados = dataPaquetes.filter(paquete => paquete.id_servicio && paquete.id_servicio2 && !paquete.id_servicio3 && !paquete.id_servicio4 && !paquete.inactive_at);
    } else if (tipo === "trios") {
      paquetesFiltrados = dataPaquetes.filter(paquete => paquete.id_servicio && paquete.id_servicio2 && paquete.id_servicio3 && !paquete.id_servicio4 && !paquete.inactive_at);
    } else if (tipo === "cuarteto") {
      paquetesFiltrados = dataPaquetes.filter(paquete => paquete.id_servicio && paquete.id_servicio2 && paquete.id_servicio3 && paquete.id_servicio4 && !paquete.inactive_at);
    }

    paquetesFiltrados.forEach((paquete) => {
      const option = document.createElement("option");
      const id = `${paquete.id_paquete} - ${paquete.precio} - ${paquete.duracion}`;
      option.value = id;
      option.textContent = paquete.paquete;
      slcPaquetes.appendChild(option);
    });
    slcPaquetes.disabled = false;
  }

  slcTipoServicio.addEventListener("change", async function () {
    const idServicioSeleccionado = slcTipoServicio.value;
    if (idServicioSeleccionado === "duos" || idServicioSeleccionado === "trios" || idServicioSeleccionado === "cuarteto") {
      await cargarPaquetesMultiples(idServicioSeleccionado);
    } else {
      await cargarPaquetes(idServicioSeleccionado);
    }
  });

  /* $("#slcServicioActualizar").on("select2:select", async function (e) {
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
  }); */

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
    if (accesos?.contratos?.crear) {
      const fechaRegistro = new Date().toISOString().split("T")[0];
      const nota = txtNota.value;
      const idUsuarioRegistro = user.idRol;

      // Verificación de los valores antes de hacer la solicitud
      console.log("Verificando los valores antes de registrar el contrato:");
      console.log("idCliente:", idCliente);
      console.log("idServicio:", idServicio);
      console.log("sector:", sector.value);
      console.log("direccion:", direccion.value);
      console.log("referencia:", referencia.value);
      console.log("coordenada:", coordenada.value);
      console.log("fechaFin:", fechaFin);
      console.log("nota:", nota);
      console.log("idUsuario:", user.idUsuario);

      if (!(await validarCampos())) {
        showToast("¡Llene todos los campos!", "INFO");
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
            showToast("¡Contrato registrado correctamente!", "SUCCESS", 1500);
            resetUI();
            tabla.ajax.reload();
          }
        } catch (error) {
          console.log(error);
          showToast(
            "Ocurrió un error al registrar el contrato. Por favor, inténtelo de nuevo.",
            "ERROR"
          );
        }
      }
    } else {
      showToast("No tienes acceso para registrar un contrato", "ERROR");
    }
  }

  async function eliminar(idContrato, idUsuario) {
    if (accesos?.contratos?.eliminar) {
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
          showToast("¡Contrato eliminado correctamente!", "SUCCESS", 1500);
          resetUI();
          tabla.ajax.reload();
        }
      }
    } else {
      showToast("No tienes acceso para eliminar un contrato", "ERROR");
    }

  }

  async function actualizarContrato(idContrato, idUsuario) {
    if (accesos?.contratos?.actualizar) {
      const direccionServicio = document.querySelector("#txtDireccionActualizar").value;
      const referencia = document.querySelector("#txtReferenciaActualizar").value;
      const coordenada = document.querySelector("#txtCoordenadaActualizar").value;
      const nota = document.querySelector("#txtNotaActualizar").value;

      // Crear el objeto de datos para enviar al servidor
      const datosEnvio = {
        operacion: "actualizarContrato",
        parametros: {
          idContrato: idContrato,
          idPaquete: idServicioActualizar,  
          direccionServicio: direccionServicio,
          referencia: referencia,
          coordenada: coordenada,
          nota: nota,
          idUsuarioUpdate: idUsuario,
        },
      };

      // Hacer el console.log para ver los datos antes de enviarlos
      console.log("Datos enviados para actualizar el contrato:", JSON.stringify(datosEnvio, null, 2));

      const response = await fetch(
        `${config.HOST}app/controllers/Contrato.controllers.php`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosEnvio),
        }
      );

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (data.actualizado) {
        showToast("¡Contrato actualizado correctamente!", "SUCCESS", 1500);
        resetUI();
        tabla.ajax.reload();
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

    // Configura DataTable con procesamiento server-side
    tabla = new DataTable("#listarContratos", {
      language: {
        url: `https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json`,
      },
      processing: true,
      serverSide: true,
      ajax: {
        url: `${config.HOST}app/controllers/Contrato.controllers.php?operacion=listarContratos`,
        type: 'GET',
        dataSrc: function (json) {
          return json.data;
        }
      },
      columns: [
        { data: 'nombre_cliente' },
        { data: 'num_identificacion' },
        { data: 'paquete' },
        { data: 'direccion_servicio' },
        {
          data: 'duracion',
          render: function (data) {
            return formatDuracion(data);
          }
        },
        {
          data: null,
          render: function (data, type, row) {
            return `
              <button class="btn btn-sm btn-warning btn-edit" data-idContrato="${row.id_contrato}">
                <i class="fa-regular fa-pen-to-square icon-disabled"></i>
              </button>
              <button class="btn btn-sm btn-danger btnEliminar" data-idContrato="${row.id_contrato}">
                <i class="fa-regular fa-trash-can icon-disabled"></i>
              </button>
              <button class="btn btn-sm btn-primary btnGenerar" data-idContrato="${row.id_contrato}">
                <i class="fa-solid fa-file-pdf icon-disabled"></i>
              </button>
              <button class="btn btn-sm btn-success btnFicha" data-tipoServicio="${row.tipo_servicio}" data-idContrato="${row.id_contrato}">
                Ficha
              </button>
            `;
          }
        }
      ],
      columnDefs: [
        { className: 'text-center', targets: [0, 1, 2, 3, 4, 5] },
        { width: "200px", targets: [5] }
      ],
      drawCallback: function (settings) {
        const botonesPdf = document.querySelectorAll(".btnGenerar");
        const botonesEliminar = document.querySelectorAll(".btnEliminar");
        const botonesFicha = document.querySelectorAll(".btnFicha");
        const botonesEdit = document.querySelectorAll(".btn-edit");

        botonesFicha.forEach((boton) => {
          boton.addEventListener("click", (event) => {
            const idContrato = event.target.getAttribute("data-idContrato");
            const tipoServicio = event.target.getAttribute("data-tipoServicio");

            console.log("tipo_servicio:", tipoServicio);

            const tipoFicha = {
              "FIBR + CABL": "FichaTecnicaGpon",
              "CABL + FIBR": "FichaTecnicaGpon",
              WISP: "FichaTecnicaWisp",
              CABL: "FichaTecnicaCable",
              FIBR: "FichaTecnicaGpon",
            };
            window.location.href = `${config.HOST}views/Contratos/${tipoFicha[tipoServicio]}?idContrato=${idContrato}`;
          });
        });

        botonesEdit.forEach((boton) => {
          boton.addEventListener("click", (event) => {
            const idContrato = event.target.getAttribute("data-idContrato");
            abrirModalEditar(idContrato);
          });
        });

        botonesEliminar.forEach((boton) => {
          boton.addEventListener("click", (event) => {
            const idContrato = event.target.getAttribute("data-idContrato");
            eliminar(idContrato, 1);
          });
        });

        botonesPdf.forEach((boton) => {
          boton.addEventListener("click", () => {
            const idContrato = boton.getAttribute("data-idContrato");
            window.open(`${config.HOST}views/reports/Contrato/soporte.php?id=${idContrato}`);
          });
        });
      }
    });
  }

  function formatDuracion(duracion) {
    try {
      const duracionObj = JSON.parse(duracion);
      return Object.entries(duracionObj)
        .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value} meses`)
        .join(", ");
    } catch (e) {
      return duracion;
    }
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
    precio.value = "";
    direccion.value = "";
    $('#slcSector').val(null).trigger('change');
    referencia.value = "";
    coordenada.value = "";
    slcTipoServicio.value = "";
    txtNota.value = "";
    txtDuracion.value = "";
    slcPaquetes.disabled = true;
    $('#slcPaquetes').val(null).trigger('change');
  }

  async function abrirModalEditar(idContrato) {
    const modal = new bootstrap.Modal(document.getElementById("modalEditarContrato"));
    modal.show();
  
    try {
      // Paso 1: Obtener los detalles del contrato
      const response = await fetch(
        `${config.HOST}app/controllers/Contrato.controllers.php?operacion=buscarContratoId&id=${idContrato}`
      );
      const data = await response.json();
      console.log(data);
  
      // Paso 2: Cargar los datos del contrato en el modal
      document.getElementById("txtIdContratoActualizar").value = data[0].id_contrato;
      document.getElementById("txtNombreActualizar").value = data[0].nombre_cliente;
      document.getElementById("txtFechaInicioActualizar").value = data[0].fecha_inicio;
      document.getElementById("txtDireccionActualizar").value = data[0].direccion_servicio;
      document.getElementById("txtReferenciaActualizar").value = data[0].referencia;
      document.getElementById("txtCoordenadaActualizar").value = data[0].coordenada;
      document.getElementById("txtNotaActualizar").value = data[0].nota;
  
      // Paso 3: Obtener el tipo de servicio del contrato
      const idServicio = data[0].id_servicio;
      console.log("ID del servicio del contrato:", idServicio);
  
      // Llamar a la función que carga los tipos de servicio disponibles
      await cargarTipoServicioActualizar(idServicio);
  
      // Paso 4: Llamar a la función que carga los paquetes relacionados al servicio
      await cargarPaquetesActualizar(idServicio);
  
      // Paso 5: Seleccionar el paquete del contrato
      const slcPaquetes = document.getElementById("slcPaquetesActualizar");
      slcPaquetes.value = data[0].id_paquete;
  
      // Paso 6: Configurar el select de Sector
      const slcSector = document.getElementById("slcSectorActualizar");
      const sectorId = data[0].id_sector;
      const sectorTexto = data[0].nombre_sector;
      let optionExists = false;
  
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
  
      $('#slcSectorActualizar').trigger('change');
  
      // Cerrar el modal cuando se haga clic en el botón de cierre
      document.querySelector(".btn-close").addEventListener("click", () => {
        modal.hide();
      });
  
      // Paso 7: Actualizar el precio cuando se selecciona un paquete
      slcPaquetes.addEventListener('change', (e) => {
        const paqueteId = e.target.value; // id de paquete
        if (paqueteId) {
          const paqueteSeleccionado = paquetesActualizar.find(p => p.id_paquete == paqueteId);
          document.getElementById("txtPrecioActualizar").value = paqueteSeleccionado ? paqueteSeleccionado.precio : '0';
        }
      });
  
    } catch (error) {
      console.error("Error al obtener los detalles del contrato:", error);
    }
  }
  
  // Esta función carga los tipos de servicio disponibles y los agrega al select
  async function cargarTipoServicioActualizar(idServicioSeleccionado) {
    try {
      const response = await fetch(
        `${config.HOST}app/controllers/Servicio.controllers.php?operacion=listarServicio`
      );
      const servicios = await response.json();
      console.log(servicios);
  
      const slcTipoServicioActualizar = document.getElementById("slcTipoServicioActualizar");
  
      // Limpiar el select y agregar la opción por defecto
      slcTipoServicioActualizar.innerHTML = '<option value="0" disabled selected>Seleccione</option>';
  
      // Recorrer los servicios disponibles y agregar las opciones
      servicios.forEach((servicio) => {
        const option = document.createElement("option");
        option.value = servicio.id_servicio;
        option.textContent = servicio.tipo_servicio;
        slcTipoServicioActualizar.appendChild(option);
      });
  
      // Después de agregar las opciones, seleccionamos el tipo de servicio que corresponde
      slcTipoServicioActualizar.value = idServicioSeleccionado;
  
      // Disparar el evento de cambio si es necesario
      $('#slcTipoServicioActualizar').trigger('change');
  
    } catch (error) {
      console.error("Error al cargar los tipos de servicio:", error);
    }
  }
  
  // Función para cargar los paquetes correspondientes a un tipo de servicio
  async function cargarPaquetesActualizar(idServicio) {
    try {
      const dataPaquetes = await fetchPaquetesPorServicioActualizar(idServicio);
  
      const slcPaquetes = document.getElementById("slcPaquetesActualizar");
      slcPaquetes.innerHTML = '<option value="" disabled selected>Seleccione un paquete</option>';
  
      dataPaquetes
        .filter(paquete =>
          !paquete.id_servicio2 &&
          !paquete.id_servicio3 &&
          !paquete.id_servicio4 &&
          !paquete.inactive_at
        )
        .forEach((paquete) => {
          const option = document.createElement("option");
          const id = `${paquete.id_paquete} - ${paquete.precio} - ${paquete.duracion}`;
          option.value = id;
          option.textContent = paquete.paquete;
          slcPaquetes.appendChild(option);
        });
  
      slcPaquetes.disabled = false;
  
    } catch (error) {
      console.error("Error al cargar los paquetes:", error);
    }
  }
  
  // Función que obtiene los paquetes relacionados a un servicio
  async function fetchPaquetesPorServicioActualizar(idServicio) {
    const response = await fetch(
      `${config.HOST}app/controllers/Paquete.controllers.php?operacion=buscarPaquetePorIdServicio&idServicio=${idServicio}`
    );
    const data = await response.json();
    return data;
  }
  
  

  /* document.querySelector("#txtFechaFinActualizar").addEventListener("input", () => {
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
  }); */

  (async () => {
    await getQueryParams();
    await cargarDatos();
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

  document.querySelector("#btnActualizar").addEventListener("click", async (event) => {
    event.preventDefault();
    const idContrato = document.querySelector("#txtIdContratoActualizar").value;
    const idUsuario = user.idUsuario;
    await actualizarContrato(idContrato, idUsuario);
  });

  $("#slcPaquetes").on("select2:select", function () {
    console.log(slcPaquetes.value);
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

  $("#slcPaquetesActualizar").on("select2:select", function () {
    console.log(slcPaquetesActualizar.value);
    const selectedValue = slcPaquetesActualizar.value.split(" - ");
    idServicioActualizar = parseInt(selectedValue[0]);
    precioServicio = selectedValue[1];

    // Asignar el precio al campo correspondiente
    document.getElementById("txtPrecioActualizar").value = precioServicio;

    // Cambiar el valor del select (esto es redundante pero lo dejamos por si acaso)
    slcPaquetesActualizar.value = idServicioActualizar;
    console.log(idServicioActualizar);
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

      slcTipoServicio.empty();

      slcTipoServicio.append(
        '<option value="" disabled selected>Seleccione</option>'
      );

      const serviciosActivos = servicios.filter((servicio) => servicio.inactive_at === null);
      if (serviciosActivos.length === 0) {
        slcTipoServicio.append('<option value="" disabled>No hay servicios disponibles</option>');
      } else {
        serviciosActivos.forEach((servicio) => {
          const option = `<option value="${servicio.id_servicio}">${servicio.tipo_servicio} (${servicio.servicio})</option>`;
          slcTipoServicio.append(option);
        });

        slcTipoServicio.append('<option value="duos">Duos</option>');
        slcTipoServicio.append('<option value="trios">Trios</option>');
        slcTipoServicio.append('<option value="cuarteto">Cuarteto</option>');
      }

      slcTipoServicio.on("change", function () {
        const idServicio = $(this).val();
        if (idServicio === "duos" || idServicio === "trios" || idServicio === "cuarteto") {
          cargarPaquetesMultiples(idServicio);
        } else {
          cargarPaquetes(idServicio);
        }
      });
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    }
  }


  document.querySelector("#btnBuscarCoordenadas").addEventListener("click", async () => {
    await mapa.iniciarMapa('map');
  });

  document.querySelector("#btnGuardarCoordenadas").addEventListener("click", () => {
    document.querySelector("#txtCoordenadas").value = `${mapa.marcadorMasCercano.coordenadas}`;
    $('#ModalMapa').modal('hide');
  });

  cargarServicios();
});
