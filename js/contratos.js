import config from "../env.js";
import * as Herramientas from "../js/Herramientas.js";
import * as ListarPaquetes from "../js/ListarPaquetes.js";
import * as mapa from "./Mapa.js";
window.addEventListener("DOMContentLoaded", async () => {
  const nroDoc = document.querySelector("#txtNumDoc");
  const nombre = document.querySelector("#txtNombre");
  const precio = document.querySelector("#txtPrecio");
  const direccion = document.querySelector("#txtDireccion");
  const sector = document.querySelector("#slcSector");
  const referencia = document.querySelector("#txtReferencia");
  const coordenada = document.querySelector("#txtCoordenadasMapa");
  const slcPaquetes = document.querySelector("#slcPaquetes");
  const slcPaquetesActualizar = document.querySelector("#slcPaquetesActualizar");
  const txtNota = document.querySelector("#txtNota");
  const accesos = await Herramientas.permisos();
  const btnBuscarCoordenadas = document.querySelector("#btnBuscarCoordenadas");

  let idSector = null;
  let idCaja = null;
  let precioServicio = 0;
  let idCliente = null;
  let idPersona = "";
  let idEmpresa = "";
  slcPaquetes.disabled = true;
  let tabla;
  let dataPaquetes = [];

  document.addEventListener("servicioActivado", ListarPaquetes.fetchServicios);
  document.addEventListener("servicioDesactivado", ListarPaquetes.fetchServicios);
  document.addEventListener("servicioAgregado", ListarPaquetes.fetchServicios);
  document.addEventListener("servicioActualizado", ListarPaquetes.fetchServicios);

  async function getQueryParams() {
    try {
      // Obtén los parámetros de la URL
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const params = Object.fromEntries(urlParams.entries());

      // Seleccionar el servicio y cargar paquetes
      if (params.Servicio) {
        const slcTipoServicio = document.querySelector("#slcTipoServicio");
        if (slcTipoServicio) {
          const optionToSelect = document.querySelector(`#slcTipoServicio option[value="${params.Servicio}"]`);
          if (optionToSelect) {
            // Selecciona el servicio
            optionToSelect.selected = true;
            slcTipoServicio.dispatchEvent(new Event("change")); // Simula el cambio

            // Esperar a que los paquetes se carguen
            await ListarPaquetes.cargarPaquetesGenerico(params.Servicio, "#slcPaquetes");

            // Seleccionar el paquete específico si está en los parámetros
            if (params.Paquete) {
              const slcPaquetes = document.querySelector("#slcPaquetes");
              if (slcPaquetes) {
                const optionToSelectPaquete = document.querySelector(`#slcPaquetes option[value="${params.Paquete}"]`);
                if (optionToSelectPaquete) {
                  optionToSelectPaquete.selected = true;
                  slcPaquetes.dispatchEvent(new Event("change"));
                }
              }
            }
          }
        }
      }
      if (params.nroDoc && document.querySelector("#txtNumDoc")) {
        const nroDoc = document.querySelector("#txtNumDoc");
        nroDoc.value = params.nroDoc;
      }

      if (params.coordenadas && document.querySelector("#txtCoordenadasMapa")) {
        const coordenada = document.querySelector("#txtCoordenadasMapa");
        coordenada.value = params.coordenadas;
        coordenada.dispatchEvent(new Event("change", { bubbles: true }));
      }

      if (params.direccion && document.querySelector("#txtDireccion")) {
        const direccion = document.querySelector("#txtDireccion");
        direccion.value = params.direccion;
      }

      if (params.referencia && document.querySelector("#txtReferencia")) {
        const referencia = document.querySelector("#txtReferencia");
        referencia.value = params.referencia;
      }
    } catch (error) {
      console.error("Error al procesar los parámetros de la URL:", error);
    }
  }

  async function fetchSectores() {
    const response = await fetch(
      `${config.HOST}app/controllers/Sector.controllers.php?operacion=listarSectores`
    );
    return await response.json();
  }

  async function buscarCliente(nroDoc) {
    if (nroDoc == "") {
      showToast("¡Ingrese numero de documento!", "INFO");
    } else {
      const response = await fetch(
        `${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteExistencia&nroDoc=${nroDoc}`
      );
      const data = await response.json();
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
          nombre.value = data[0].nombres + ", " + data[0].apellidos;

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
    if (!idPersona && !idEmpresa) {
      showToast("Debe proporcionar un ID de persona o empresa.", "INFO");
      return;
    }
    if (!direccion.value.trim() || !referencia.value.trim() || !coordenada.value.trim()) {
      showToast("¡Llene todos los campos!", "INFO");
      return;
    }

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
    console.log(mapa.idCaja) //-------Id de la caja, guardar json
    if (accesos?.contratos?.crear) {
      const fechaRegistro = new Date().toISOString().split("T")[0];
      const nota = txtNota.value;
      const idPaquete = slcPaquetes.value.split(' - ')[0];

      if (!(await validarCampos())) {
        showToast("¡Llene todos los campos!", "INFO");
        return;
      }

      const confirmacion = await ask("¿Desea registrar el nuevo contrato?", "Contratos");
      if (!confirmacion) {
        return;
      }

      try {
        const datosEnvio = {
          operacion: "registrarContrato",
          parametros: {
            idCliente: idCliente,
            idPaquete: idPaquete,
            idSector: sector.value,
            direccion: direccion.value,
            referencia: referencia.value,
            coordenada: coordenada.value,
            fechaInicio: new Date().toISOString().split("T")[0],
            fechaRegistro: fechaRegistro,
            nota: nota,
            idUsuario: user.idUsuario,
          },
        };

        const response = await fetch(
          `${config.HOST}app/controllers/Contrato.controllers.php`,
          {
            method: "POST",
            body: JSON.stringify(datosEnvio),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.error) {
          console.log(data.error);
        } else {
          console.log(data);
          try {
            const respuesta = await fetch(`${config.HOST}app/controllers/Caja.controllers.php`, {
              method: "PUT",
              body: JSON.stringify({
                operacion: "descontarCaja",
                idCaja: mapa.idCaja, // Correcta estructura
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            const data = await respuesta.json();

            showToast("¡Contrato registrado correctamente!", "SUCCESS", 1500);
            resetUI();
            tabla.ajax.reload();
            // Guardar el idCaja en el almacenamiento local
            localStorage.setItem('idCaja', mapa.idCaja);
          } catch (error) {
            console.log(error);
            showToast("Ocurrió un error en las cajas.", "ERROR");
          }
        }
      } catch (error) {
        console.log(error);
        showToast("Ocurrió un error al registrar el contrato. Por favor, inténtelo de nuevo.", "ERROR");
      }
    } else {
      showToast("No tienes acceso para registrar un contrato", "ERROR");
    }
  }

  async function eliminar(idContrato, idUsuario, idCaja) {
    if (accesos?.contratos?.eliminar) {
      if (await ask("¿Desea eliminar este contrato?")) {
        const response = await fetch(
          `${config.HOST}app/controllers/Contrato.controllers.php`,
          {
            method: "PUT",
            body: JSON.stringify({
              operacion: "eliminarContrato",
              parametros: {
                idContrato: idContrato,
                idUsuario: idUsuario,
              },
            }),
          }
        );
        const data = await response.json();
        if (data.eliminado) {
          if (idCaja != -1) {
            const respuesta = await fetch(`${config.HOST}app/controllers/Caja.controllers.php`, {
              method: "PUT",
              body: JSON.stringify({
                operacion: "recontarCaja",
                idContrato: idCaja
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            const data = await respuesta.json();

            console.log(data);
          }
          showToast("¡Contrato eliminado correctamente!", "SUCCESS", 1500);
          resetUI();
          tabla.ajax.reload();
        }
      }
    } else {
      showToast("No tienes acceso para eliminar un contrato", "ERROR");
    }

  }

  async function actualizarContrato(idContrato, idUsuario, idPaquete) {
    if (accesos?.contratos?.actualizar) {
      const direccionServicio = document.querySelector("#txtDireccionActualizar").value;
      const referencia = document.querySelector("#txtReferenciaActualizar").value;
      const coordenada = document.querySelector("#txtCoordenadaActualizar").value;
      const nota = document.querySelector("#txtNotaActualizar").value;
      const datosEnvio = {
        operacion: "actualizarContrato",
        parametros: {
          idContrato: idContrato,
          idPaquete: idPaquete,
          direccionServicio: direccionServicio,
          referencia: referencia,
          coordenada: coordenada,
          nota: nota,
          idUsuarioUpdate: idUsuario,
        },
      };

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
    //Cargar Sectores
    const dataSectores = await fetchSectores();
    dataSectores.forEach((sector) => {
      const option = document.createElement("option");
      option.value = sector.id_sector;
      option.textContent = sector.sector;
      slcSector.appendChild(option);

      slcSector.appendChild(option.cloneNode(true));
      slcSectorActualizar.appendChild(option);
    });

    //Inicializar tabla
    tabla = new DataTable("#listarContratos", {
      language: {
        url: `https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json`,
      },
      processing: true,
      serverSide: true,
      ajax: {
        url: `${config.HOST}app/controllers/Contrato.ssp.php`,
        type: 'GET',
        dataSrc: function (json) {
          return json.data;
        },
        error: function (xhr, error, thrown) {
          console.error("Error en la solicitud AJAX:", error, thrown);
          console.error("Respuesta del servidor:", xhr.responseText);
          showToast("Ocurrió un error al cargar los datos. Por favor, inténtelo de nuevo.", "ERROR");
        }
      },
      columns: [
        { data: 0 }, // id_contrato
        { data: 1 }, // nombre_cliente
        { data: 2 }, // num_identificacion
        { data: 4 }, // paquete
        { data: 5 }, // precio
        { data: 6 }, // tipos_servicio
        {
          data: null,
          render: function (data, type, row) {
            return `
              <button class="btn btn-sm btn-warning btn-edit" data-idContrato="${row[0]}" title="Actualizar">
              <i class="fa-regular fa-pen-to-square icon-disabled"></i>
              </button>
              <button class="btn btn-sm btn-danger btnEliminar" data-idContrato="${row[0]}" title="Eliminar">
              <i class="fa-regular fa-trash-can icon-disabled"></i>
              </button>
              <button class="btn btn-sm btn-primary btnGenerar" data-tipoServicio="${row[6]}" data-idContrato="${row[0]}" title="Generar PDF">
              <i class="fa-solid fa-file-pdf icon-disabled"></i>
              </button>
              <button class="btn btn-sm btn-success btnFicha" data-tipoServicio="${row[6]}" data-idContrato="${row[0]}" title="Ver Ficha">
              Ficha
              </button>
            `;
          }
        }
      ],
      columnDefs: [
        { className: 'text-center', targets: [0, 1, 2, 3, 4, 5, 6] },
        { width: "200px", targets: [6] },
        { targets: [0], visible: false }
      ],
      order: [[0, 'desc']],
      drawCallback: function (settings) {
        //Agregar event listerners para los botones despues de dibujar la tabla
        const botonesPdf = document.querySelectorAll(".btnGenerar");
        const botonesEliminar = document.querySelectorAll(".btnEliminar");
        const botonesFicha = document.querySelectorAll(".btnFicha");
        const botonesEdit = document.querySelectorAll(".btn-edit");

        //Event listeners para el botón de ficha técnica
        botonesFicha.forEach((boton) => {
          boton.addEventListener("click", async (event) => {
            const idContrato = event.target.getAttribute("data-idContrato");
            const tipoServicio = event.target.getAttribute("data-tipoServicio");
            const tipoFicha = {
              "FIBR,CABL": "FichaTecnicaGpon",
              "CABL,FIBR": "FichaTecnicaGpon",
              WISP: "FichaTecnicaWisp",
              CABL: "FichaTecnicaCable",
              FIBR: "FichaTecnicaFibra",
            };

            try {
              const response = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerFichaInstalacion&id=${idContrato}`);
              const data = await response.json();
              const fichaInstalacion = JSON.parse(data[0].ficha_instalacion);

              if (fichaInstalacion && Object.keys(fichaInstalacion).length > 0) {
                if (tipoServicio === "WISP") {
                  window.open(`${config.HOST}views/reports/Contrato_WISP/fichaInstalacion.php?id=${idContrato}`, '_blank');
                } else if (tipoServicio === "FIBR,CABL" || tipoServicio === "CABL,FIBR") {
                  window.open(`${config.HOST}views/reports/Contrato_GPON/fichaInstalacion.php?id=${idContrato}`, '_blank');
                } else if (tipoServicio === "CABL") {
                  window.open(`${config.HOST}views/reports/Contrato_CABLE/fichaInstalacion.php?id=${idContrato}`, '_blank');
                } else if (tipoServicio === "FIBR") {
                  window.open(`${config.HOST}views/reports/Contrato_FIBRA/fichaInstalacion.php?id=${idContrato}`, '_blank');
                }
              } else {
                window.location.href = `${config.HOST}views/Contratos/${tipoFicha[tipoServicio]}?idContrato=${idContrato}`;
              }
            } catch (error) {
              console.error("Error al obtener el JSON de la ficha de instalación:", error);
              // Redirigir a la ruta original en caso de error
              window.location.href = `${config.HOST}views/Contratos/${tipoFicha[tipoServicio]}?idContrato=${idContrato}`;
            }
          });
        });

        //Event listeners para el botón de editar
        botonesEdit.forEach((boton) => {
          boton.addEventListener("click", (event) => {
            const idContrato = event.target.getAttribute("data-idContrato");
            abrirModalEditar(idContrato);
          });
        });

        //Event listeners para el botón de eliminar
        botonesEliminar.forEach((boton) => {
          boton.addEventListener("click", async (event) => {
            const idContrato = event.target.getAttribute("data-idContrato");
            const tipoServicio = boton.closest('tr').querySelector('td:nth-child(6)').textContent.trim();
            let idCaja = -1;
            if (tipoServicio === "FIBR,CABL" || tipoServicio === "FIBR" || tipoServicio === "CABL") {
              try {
                const response = await fetch(
                  `${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerJsonFichabyId&id=${idContrato}`
                );
                const data = await response.json();
                idCaja = JSON.parse(data[0].ficha_instalacion).idCaja;
              } catch (error) {
                console.error("Error al obtener el JSON de la ficha de instalación:", error);
                idCaja = -1;
              }

            }

            eliminar(idContrato, 1, idCaja);
          });
        });

        //Event listeners para el botón de generar PDF
        botonesPdf.forEach((boton) => {
          boton.addEventListener("click", () => {
            const idContrato = boton.getAttribute("data-idContrato");
            const tipoServicio = boton.getAttribute("data-tipoServicio");
            if (tipoServicio === "WISP") {
              window.open(`${config.HOST}views/reports/Contrato_servicio_WISP/soporte.php?id=${idContrato}`);
            } else {
              window.open(`${config.HOST}views/reports/Contrato_servicio/soporte.php?id=${idContrato}`);
            }
          });
        });
      }
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
    precio.value = "";
    direccion.value = "";
    $('#slcSector').val(null).trigger('change');
    referencia.value = "";
    coordenada.value = "";
    slcTipoServicio.value = "";
    txtNota.value = "";
    slcPaquetes.disabled = true;
    $('#slcPaquetes').val(null).trigger('change');
  }

  async function abrirModalEditar(idContrato) {
    const modal = new bootstrap.Modal(document.getElementById("modalEditarContrato"));
    modal.show();

    try {
      const response = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=buscarContratoId&id=${idContrato}`);
      const data = await response.json();
      document.getElementById("txtIdContratoActualizar").value = data[0].id_contrato;
      document.getElementById("txtNombreActualizar").value = data[0].nombre_cliente;
      document.getElementById("txtFechaInicioActualizar").value = data[0].fecha_inicio;
      document.getElementById("txtDireccionActualizar").value = data[0].direccion_servicio;
      document.getElementById("txtReferenciaActualizar").value = data[0].referencia;
      document.getElementById("txtCoordenadaActualizar").value = data[0].coordenada;
      document.getElementById("txtNotaActualizar").value = data[0].nota;

      const idServicio = JSON.parse(data[0].id_servicio).id_servicio;
      const tiposServicio = data[0].tipos_servicio.split(',').length;

      if (tiposServicio === 2) {
        await ListarPaquetes.cargarTipoServicioActualizar('duos');
        await ListarPaquetes.cargarPaquetesMultiplesActualizar("duos", data[0].id_paquete);
      } else {
        await ListarPaquetes.cargarTipoServicioActualizar(idServicio);
        await ListarPaquetes.cargarPaquetesActualizar(idServicio, data[0].id_paquete);
      }

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
      document.querySelector(".btn-close").addEventListener("click", () => {
        modal.hide();
      });

      const slcPaquetes = document.getElementById("slcPaquetesActualizar");
      slcPaquetes.addEventListener('change', (e) => {
        const paqueteId = e.target.value;
        if (paqueteId) {
          const paqueteSeleccionado = dataPaquetes.find(p => p.id_paquete == paqueteId);
          document.getElementById("txtPrecioActualizar").value = paqueteSeleccionado ? paqueteSeleccionado.precio : '0';
        }
      });

    } catch (error) {
      console.error("Error al obtener los detalles del contrato:", error);
    }
  };

  (async () => {
    await cargarDatos();
    await ListarPaquetes.cargarServiciosGenerico("#slcTipoServicio", () => ListarPaquetes.cargarSelectPaquetesGenerico("#slcTipoServicio", "#slcPaquetes"));
    await getQueryParams();
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
    const idPaquete = document.getElementById("slcPaquetesActualizar").value;
    await actualizarContrato(idContrato, idUsuario, idPaquete);
  });

  coordenada.addEventListener("change", async function () {
    //console.log(coordenada.value);
    idSector = mapa.idSector;
    idCaja = mapa.idCaja;
    const optionToSelect = document.querySelector(`#slcSector option[value="${idSector}"]`);
    //console.log(optionToSelect);
    if (optionToSelect) {
      optionToSelect.selected = true;
      const selectElement = document.querySelector("#slcSector");
      selectElement.dispatchEvent(new Event('change'));
    }
  });

  $(".select2me").select2({ theme: "bootstrap-5", allowClear: true });
  $(".select2me").parent("div").children("span").children("span").children("span").css("height", " calc(3.5rem + 2px)");
  $(".select2me").parent("div").children("span").children("span").children("span").children("span").css("margin-top", "18px");
  $(".select2me").parent("div").find("label").css("z-index", "1");

  btnBuscarCoordenadas.addEventListener("click", async () => {
    const params = { cajas: true, mufas: true }
    const id = "map"
    const renderizado = "modal"
    mapa.iniciarMapa(params, id, renderizado);
  });

  $('#slcPaquetes').on('change', function () {
    const selectedOption = $(this).find("option:selected");
    const precio = selectedOption.data("precio");
    const txtPrecio = document.querySelector("#txtPrecio");

    if (precio) {
      txtPrecio.value = precio;
    } else {
      txtPrecio.value = "";
    }
  });

  $('#slcPaquetesActualizar').on('change', function () {
    const selectedOption = $(this).find("option:selected");
    const precio = selectedOption.data("precio");
    const txtPrecioActualizar = document.querySelector("#txtPrecioActualizar");

    if (precio) {
      txtPrecioActualizar.value = precio;
    } else {
      txtPrecioActualizar.value = "";
    }
  });

  // Agregar el eventListener al select de tipo servicio
  document.querySelector("#slcTipoServicio").addEventListener("change", function () {
    const idServicio = this.value;  // Obtener el id del servicio seleccionado
    const btnBuscarCoordenada = document.querySelector("#btnBuscarCoordenadas");
    const sector = document.querySelector("#slcSector");

    if (idServicio === "2") {  // Si el servicio seleccionado es 2
      btnBuscarCoordenada.disabled = true;  // Deshabilitar el botón
      sector.disabled = false;  // Habilitar el select de sector
    } else {
      btnBuscarCoordenada.disabled = false;  // Habilitar el botón
      sector.disabled = true;  // Deshabilitar el select de sector
    }
  });

  // Uso de las funciones genéricas
  ListarPaquetes.cargarServiciosGenerico("#slcTipoServicio", () => ListarPaquetes.cargarSelectPaquetesGenerico("#slcTipoServicio", "#slcPaquetes"));
  ListarPaquetes.cargarServiciosGenerico("#slcTipoServicioActualizar", () => ListarPaquetes.cargarSelectPaquetesGenerico("#slcTipoServicioActualizar", "#slcPaquetesActualizar"));
});
