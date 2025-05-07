import config from "../env.js";
import * as Herramientas from "../js/Herramientas.js";
import * as ListarPaquetes from "../js/ListarPaquetes.js";
import * as mapa from "./Mapa.js";
window.addEventListener("DOMContentLoaded", async () => {
  let login = await Herramientas.obtenerLogin();
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


  let iniciarMapaSi = false;
  let idSector = null;
  let idCaja = null;
  let cambioServicio = 0;
  let idCliente = null;
  let idPersona = "";
  let idEmpresa = "";
  slcPaquetes.disabled = true;
  let tabla;
  let dataPaquetes = [];

  mapa.emitter.on('coordenadaEncontrada', async (coordenada) => {
    await cargarSelectCajas(JSON.parse(localStorage.getItem('marcadoresCercanos')));
    document.querySelector("#slcSector").disabled = false;
  });

  $('#slcSector').on('change', async function () {
    idCaja = $(this).val();
    idSector = $(this).find(':selected').parent().attr('id').split('-')[1];
  });

  async function cargarSelectCajas(marcadoresNuevos) {
    try {
      const marcadores = marcadoresNuevos || [];
      const sectoresInfo = {};

      // Limpiar y preparar el select
      $('#slcSector').empty();
      $('#slcSector').append(new Option('Seleccione una caja', '', true, true));

      // Obtener IDs válidos (asegurarse de que todos sean números)
      const cajasIds = marcadores
        .filter(marcador => marcador && marcador.properties && marcador.properties.id)
        .map(marcador => parseInt(marcador.properties.id))
        .filter(id => !isNaN(id));

      if (cajasIds.length === 0) {
        $('#slcSector').trigger('change');
        return;
      }

      // Crear string de IDs separados por comas directamente
      const idsString = cajasIds.join(',');

      // 1. Obtener información de todas las cajas en una sola solicitud GET
      const cajasResponse = await fetch(`${config.HOST}app/controllers/Caja.controllers.php?operacion=cajasBuscarMultiple&ids=${idsString}`);

      const cajasData = await cajasResponse.json();

      if (!cajasData || !Array.isArray(cajasData) || cajasData.length === 0) {
        $('#slcSector').trigger('change');
        return;
      }

      // Recopilar IDs de sectores únicos y asegurarse de que sean números
      const sectoresIds = [...new Set(
        cajasData
          .filter(caja => caja && caja.id_sector)
          .map(caja => parseInt(caja.id_sector))
          .filter(id => !isNaN(id))
      )];

      if (sectoresIds.length === 0) {
        $('#slcSector').trigger('change');
        return;
      }

      // Crear string de IDs de sectores separados por comas
      const sectoresIdsString = sectoresIds.join(',');

      // 2. Obtener información de todos los sectores en una sola solicitud GET
      const sectoresResponse = await fetch(`${config.HOST}app/controllers/Sector.controllers.php?operacion=sectoresBuscarMultiple&ids=${sectoresIdsString}`);

      const sectoresData = await sectoresResponse.json();

      // Verificar que tenemos datos de sectores
      if (!sectoresData || !Array.isArray(sectoresData)) {
        $('#slcSector').trigger('change');
        return;
      }

      // Crear mapa de sectores para acceso rápido
      const sectoresMap = {};
      sectoresData.forEach(sector => {
        if (sector && sector.id_sector) {
          sectoresMap[sector.id_sector] = sector.sector;
        }
      });

      // Organizar datos por sector
      cajasData.forEach(caja => {
        if (!caja || !caja.id_sector) return;

        const idSector = caja.id_sector;
        const idCaja = caja.id_caja;
        const nombreCaja = caja.nombre || 'Sin nombre';

        if (!sectoresInfo[idSector]) {
          sectoresInfo[idSector] = {
            id: idSector,
            nombre: sectoresMap[idSector] || 'Sector Desconocido',
            cajas: []
          };
        }

        sectoresInfo[idSector].cajas.push({
          id: idCaja,
          nombre: nombreCaja
        });
      });

      // Construir los optgroup y opciones
      for (const idSector in sectoresInfo) {
        const sector = sectoresInfo[idSector];
        const optgroup = $('<optgroup></optgroup>')
          .attr('label', sector.nombre)
          .attr('id', `sector-${sector.id}`);

        sector.cajas.forEach(caja => {
          optgroup.append(new Option(caja.nombre, caja.id));
        });

        $('#slcSector').append(optgroup);
      }

    } catch (error) {
      console.error('Error al cargar cajas:', error.message);
    } finally {
      $('#slcSector').trigger('change');
    }
  }

  async function getQueryParams() {
    try {

      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const params = Object.fromEntries(urlParams.entries());

      if (params.idCaja) {
        idCaja = params.idCaja;
      }

      if (params.Servicio) {
        const slcTipoServicio = document.querySelector("#slcTipoServicio");
        if (slcTipoServicio) {
          const optionToSelect = document.querySelector(`#slcTipoServicio option[value="${params.Servicio}"]`);
          if (optionToSelect) {
            optionToSelect.selected = true;
            slcTipoServicio.dispatchEvent(new Event("change"));
            await ListarPaquetes.cargarPaquetesGenerico(params.Servicio, "#slcPaquetes");
            if (params.Paquete) {
              const slcPaquetes = $("#slcPaquetes");
              const waitForOptions = setInterval(() => {
                if (slcPaquetes.find(`option[value="${params.Paquete}"]`).length) {
                  slcPaquetes.val(params.Paquete).trigger("change");
                  clearInterval(waitForOptions);
                }
              }, 100);
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
        await cargarSelectCajas(JSON.parse(localStorage.getItem('marcadoresCercanos')));
      }

      if (params.direccion && document.querySelector("#txtDireccion")) {
        const direccion = document.querySelector("#txtDireccion");
        direccion.value = params.direccion;
      }

      if (params.referencia && document.querySelector("#txtReferencia")) {
        const referencia = document.querySelector("#txtReferencia");
        referencia.value = params.referencia;
      }

      if (params.NomComercial && document.querySelector("#txtNombreComercial")) {
        const nombreComercial = document.querySelector("#txtNombreComercial");
        nombreComercial.value = params.NomComercial;
      }
    } catch (error) {
      console.error("Error al procesar los parámetros de la URL:", error);
    }
  }

  /**
   * Función asíncrona para obtener la lista de sectores desde el servidor.
   * Realiza una solicitud HTTP GET al endpoint especificado y devuelve la respuesta en formato JSON.
   *
   * @returns {Promise<Object>} Una promesa que resuelve con los datos de la lista de sectores en formato JSON.
   * @throws {Error} Si la solicitud de red falla o la respuesta no es un JSON válido.
   */
  async function fetchSectores() {
    const response = await fetch(
      `${config.HOST}app/controllers/Sector.controllers.php?operacion=listarSectores`
    );
    return await response.json();
  };

  /**
   * Busca información de un cliente basado en su número de documento.
   *
   * @async
   * @function buscarCliente
   * @param {string} nroDoc - El número de documento del cliente a buscar.
   * @returns {Promise<void>} - No retorna un valor, pero actualiza los campos del formulario con la información del cliente.
   *
   * @description
   * Esta función realiza una búsqueda de un cliente utilizando su número de documento.
   * Si el número de documento está vacío, muestra un mensaje de información.
   * Si no se encuentra el cliente, muestra un mensaje de advertencia.
   * Si se encuentra el cliente, actualiza los campos del formulario con la información del cliente.
   *
   * @example
   * buscarCliente("12345678");
   */
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
            nombre.value = data[0].nombres + ", " + data[0].apellidos;
          } else if (!data[0].id_persona) {
            idPersona = "";
            idEmpresa = data[0].id_empresa;
            nombre.value = data[0].razon_social;
          }
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
  };

  /**
   * Registra un nuevo cliente en el sistema.
   * 
   * Esta función envía una solicitud POST al servidor para registrar un cliente
   * utilizando los datos proporcionados en los campos de entrada. Si no se 
   * proporciona un ID de persona o empresa, o si alguno de los campos requeridos 
   * está vacío, se muestra un mensaje de advertencia y la función se detiene.
   * 
   * @async
   * @function registrarCliente
   * @returns {Promise<void>} Una promesa que se resuelve cuando la solicitud se completa.
   */
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
    params.append("idUsuario", login.idUsuario);
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

  /**
   * Registra un nuevo contrato en el sistema.
   * 
   * Este método realiza las siguientes acciones:
   * 1. Verifica si el usuario tiene permisos para crear contratos.
   * 2. Valida los campos del formulario.
   * 3. Solicita confirmación del usuario para registrar el contrato.
   * 4. Envía los datos del contrato al servidor.
   * 5. Descuenta la caja correspondiente.
   * 6. Muestra mensajes de éxito o error según el resultado de las operaciones.
   * 
   * @async
   * @function registrarContrato
   * @returns {Promise<void>} No retorna ningún valor.
   * 
   * @throws {Error} Muestra un mensaje de error si ocurre algún problema durante el registro del contrato o el descuento de la caja.
   */
  async function registrarContrato() {
    if (!accesos?.contratos?.crear) {
      showToast("No tienes acceso para registrar un contrato", "ERROR");
      return;
    }

    if (!(await validarCampos())) {
      showToast("¡Llene todos los campos!", "INFO");
      return;
    }

    const confirmacion = await ask("¿Desea registrar el nuevo contrato?", "Contratos");
    if (!confirmacion) return;

    const fechaRegistro = new Date().toISOString().split("T")[0];
    const nota = txtNota.value;
    const idPaquete = slcPaquetes.value.split(' - ')[0];
    if(idSector == null){
      idSector = 0;
    }
    const datosEnvio = {
      operacion: "registrarContrato",
      parametros: {
        idCliente: idCliente,
        idPaquete: idPaquete,
        idSector: idSector,
        direccion: direccion.value,
        referencia: referencia.value,
        coordenada: coordenada.value,
        fechaInicio: fechaRegistro,
        fechaRegistro: fechaRegistro,
        nota: nota,
        fichainstalacion: JSON.stringify({ idcaja: idCaja }),
        idUsuario: login.idUsuario,
      },
    };

    console.log(datosEnvio);

    try {
      const response = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php`, {
        method: "POST",
        body: JSON.stringify(datosEnvio),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log(data);

      if (data.error) {
        showToast("Error al registrar el contrato.", "ERROR");
        console.error("Error en la respuesta del servidor:", data);
        return;
      }

      showToast("¡Contrato registrado correctamente!", "SUCCESS", 1500);

      try {
        const respuesta = await fetch(`${config.HOST}app/controllers/Caja.controllers.php`, {
          method: "PUT",
          body: JSON.stringify({
            operacion: "descontarCaja",
            idCaja: mapa.idCaja,
          }),
          headers: { "Content-Type": "application/json" },
        });

        const dataCaja = await respuesta.json();
        console.log(dataCaja);
        if (dataCaja.error) {
          showToast("Error al descontar caja.", "ERROR");
        } else {
          showToast("¡Caja descontada correctamente!", "SUCCESS");
        }
      } catch (error) {
        console.error("Error en la solicitud de descuento de caja:", error);
        showToast("Ocurrió un error en las cajas.", "ERROR");
      }

      resetUI();
      tabla.ajax.reload();
    } catch (error) {
      console.error("Error en la solicitud de registro de contrato:", error);
      showToast("Ocurrió un error al registrar el contrato. Por favor, inténtelo de nuevo.", "ERROR");
    }
  }


  /**
   * Elimina un contrato y actualiza la interfaz de usuario.
   *
   * @async
   * @function eliminar
   * @param {number} idContrato - El ID del contrato a eliminar.
   * @param {number} idUsuario - El ID del usuario que realiza la eliminación.
   * @param {number} idCaja - El ID de la caja asociada al contrato. Si es -1, no se realiza la recontabilización de la caja.
   * @returns {Promise<void>} - Una promesa que se resuelve cuando la operación de eliminación y actualización de la interfaz de usuario se completa.
   * @throws {Error} - Lanza un error si la solicitud de eliminación o recontabilización falla.
   */
  async function eliminar(idContrato, idUsuario, idCaja) {
    if (accesos?.contratos?.eliminar) {
      const responsePeriodo = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerFichaInstalacion&id=${idContrato}`);
      const dataPeriodoini = await responsePeriodo.json();
      const dataPeriodo = JSON.parse(dataPeriodoini[0].ficha_instalacion);


      let eliminarSi = false

      if (await dataPeriodo.periodo == null) {
        if (await ask("Este contrato no esta instalado. ¿Desea cancelar el Contrato?", "Contratos")) {
          eliminarSi = true
        }
      } else if (await dataPeriodo.periodo != null) {
        //saber ya se paso la fecha de periodo o no
        const fechaActual = new Date();
        const fechaPeriodo = new Date(dataPeriodo.periodo);
        if (fechaActual > fechaPeriodo) {
          if (await ask("¿Desea Cancelar el Contrato?")) {
            eliminarSi = true
          }
        } else {
          if (await ask("El contrato no ha cumplido su periodo. ¿Desea cancelar el contrato?")) {
            eliminarSi = true
          }
        }
      }

      if (eliminarSi == true) {
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
      const nota = document.querySelector("#txtNotaActualizar").value;
      const datosEnvio = {
        operacion: "actualizarContrato",
        parametros: {
          idContrato: idContrato,
          idPaquete: idPaquete,
          direccionServicio: direccionServicio,
          referencia: referencia,
          nota: nota,
          fechaInicio: document.querySelector("#txtFechaInicioActualizar").value,
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

    function alternarDetalles(fila) {
      if (window.innerWidth < 768) {
        const siguienteFila = fila.nextElementSibling;
        if (siguienteFila && siguienteFila.classList.contains('fila-detalles')) {
          siguienteFila.remove();
        } else {
          const celdasOcultas = fila.querySelectorAll('.d-none.d-sm-table-cell');
          let detallesHtml = '<tr class="fila-detalles"><td colspan="8"><table class="table table-striped">';
          celdasOcultas.forEach(celda => {
            detallesHtml += `<tr><td>${celda.innerHTML}</td></tr>`;
          });

          detallesHtml += '</table></td></tr>';
          fila.insertAdjacentHTML('afterend', detallesHtml);
        }
      }
    }

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
        { data: 0 },
        { data: 1 },
        { data: 2 },
        { data: 4 },
        { data: 5 },
        { data: 6 },
        {
          data: null,
          render: function (data, type, row) {
            return `
                      <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-warning btn-edit" data-idContrato="${row[0]}" title="Actualizar">
                            <i class="fa-regular fa-pen-to-square icon-disabled"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btnEliminar" data-idContrato="${row[0]}" title="Eliminar">
                            <i class="fa-solid fa-file-circle-xmark icon-disabled"></i>
                        </button>
                        <button class="btn btn-sm btn-primary btnGenerar" data-tipoServicio="${row[6]}" data-idContrato="${row[0]}" title="Generar PDF">
                            <i class="fa-solid fa-file-pdf icon-disabled"></i>
                        </button>
                        <button class="btn btn-sm btn-success btnFicha" data-tipoServicio="${row[6]}" data-idContrato="${row[0]}" title="Ficha Técnica">
                            <i class="fa-solid fa-file-signature icon-disabled" id="iconFicha${row[0]}"></i>
                        </button>
                      </div>
                  `;
          }
        }
      ],
      columnDefs: [
        { className: 'text-center', targets: '_all' },
        { target: [0], visible: false },
        { targets: [0, 2, 3, 4], className: 'd-none d-sm-table-cell' }
      ],
      order: [[0, 'desc']],
      drawCallback: function (settings) {

        const filas = document.querySelectorAll("#listarContratos tbody tr");

        filas.forEach(async (fila) => {
          const idContrato = fila.querySelector(".btn-edit").getAttribute("data-idContrato");
          try {
            const response = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerFichaInstalacion&id=${idContrato}`);
            const data = await response.json();

            const fichaInstalacion = data[0].ficha_instalacion ? JSON.parse(data[0].ficha_instalacion) : null;

            if (fichaInstalacion === null || 
                (Object.keys(fichaInstalacion).length === 1 && fichaInstalacion.idcaja)) {
              fila.classList.add("ficha-incompleta");
              fila.classList.remove("ficha-completa");
            } else {
              fila.classList.remove("ficha-incompleta");
              fila.classList.add("ficha-completa");
            }
          } catch (error) {
            console.error("Error al obtener el JSON de la ficha de instalación:", error);
          }

          fila.addEventListener("click", (event) => {
            alternarDetalles(fila);
          });
        });

        const botonesPdf = document.querySelectorAll(".btnGenerar");
        const botonesEliminar = document.querySelectorAll(".btnEliminar");
        const botonesFicha = document.querySelectorAll(".btnFicha");
        const botonesEdit = document.querySelectorAll(".btn-edit");

        botonesFicha.forEach((boton) => {
          const idContrato = boton.getAttribute("data-idContrato");
          const icono = document.getElementById(`iconFicha${idContrato}`);
          const estadoIcono = localStorage.getItem(`iconFicha${idContrato}`);
          if (estadoIcono === 'lleno') {
            icono.classList.replace('fa-file-signature', 'fa-file-circle-check');
          } else {
            const fila = boton.closest('tr');
            fila.classList.add('ficha-incompleta');
          }
        });

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

              if (fichaInstalacion && Object.keys(fichaInstalacion).length > 1) {
                const icono = document.getElementById(`iconFicha${idContrato}`);
                icono.classList.replace('fa-file', 'fa-file-circle-check');
                localStorage.setItem(`iconFicha${idContrato}`, 'lleno');

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
              window.location.href = `${config.HOST}views/Contratos/${tipoFicha[tipoServicio]}?idContrato=${idContrato}`;
            }
          });
        });

        botonesEdit.forEach((boton) => {
          boton.addEventListener("click", (event) => {
            const idContrato = event.target.getAttribute("data-idContrato");
            abrirModalEditar(idContrato);
          });
        });

        botonesEliminar.forEach((boton) => {
          boton.addEventListener("click", async (event) => {
            const idContrato = event.target.getAttribute("data-idContrato");
            const tipoServicio = boton.closest('tr').querySelector('td:nth-child(5)').textContent.trim();
            let idCaja = -1;
            if (tipoServicio === "FIBR,CABL" || tipoServicio === "FIBR" || tipoServicio === "CABL") {
              try {
                const response = await fetch(
                  `${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerJsonFichabyId&id=${idContrato}`
                );
                const data = await response.json();
                idCaja = JSON.parse(data[0].ficha_instalacion).idcaja;
              } catch (error) {
                console.error("Error al obtener el JSON de la ficha de instalación:", error);
                idCaja = -1;
              }
            }

            eliminar(idContrato, 1, idCaja);
          });
        });

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

    const style = document.createElement('style');
    style.innerHTML = `
      .ficha-incompleta {
        background-color:rgb(255, 255, 137) !important; 
      }
    `;
    document.head.appendChild(style);
  }

  async function validarCampos() {
    if (
      nroDoc.value == "" ||
      nombre.value == "" ||
      precio.value == "" ||
      precio.value == 0 ||
      direccion.value == "" ||
      referencia.value == "" ||
      coordenada.value == "" ||
      slcPaquetes.value == "0"
    ) {
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
    const idContrato = document.querySelector("#txtIdContratoActualizar").value;
    const idUsuario = login.idUsuario;
    const idPaquete = document.getElementById("slcPaquetesActualizar").value;
    await actualizarContrato(idContrato, idUsuario, idPaquete);
  });

  coordenada.addEventListener("change", async function () {
    const optionToSelect = document.querySelector(`#slcSector option[value="${idSector}"]`);

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
    const slcTipoServicio = document.querySelector("#slcTipoServicio");
    if(cambioServicio == slcTipoServicio.value){
      cambioServicio = slcTipoServicio.value;
      iniciarMapaSi = false
    }else{
      cambioServicio = slcTipoServicio.value;
      if (slcTipoServicio.value == "2") {
        mapa.eliminarMapa();
        iniciarMapaSi = false
        await cargarCaracteristicasMapa("Antenas");
      } else {
        mapa.eliminarMapa();
        iniciarMapaSi = false
        await cargarCaracteristicasMapa("Cajas");
      }
    }
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

  async function cargarCaracteristicasMapa(objeto) {
    const id = "map"
    const renderizado = "modal"
    if(iniciarMapaSi){
      return
    }else{
      iniciarMapaSi = true
      mapa.iniciarMapa(objeto, id, renderizado);
    }
  }

  $("#slcTipoServicio").on("change", function () {
    const txtPrecio = $("#txtPrecio");
    const divSector = $("#divSector");

    txtPrecio.prop("disabled", false);
    txtPrecio.val("");
    txtPrecio.prop("disabled", true);

    if ($(this).val() === "2") {
      divSector.attr("hidden", true);
    } else {
      divSector.removeAttr("hidden");
      divSector.trigger("change");
    }
  });

  $("#btnGuardarModalMapa").on("click", function () {
    idSector = mapa.idSector;
    idCaja = mapa.idCaja;
  });


  ListarPaquetes.cargarServiciosGenerico("#slcTipoServicio", () => ListarPaquetes.cargarSelectPaquetesGenerico("#slcTipoServicio", "#slcPaquetes"));
  ListarPaquetes.cargarServiciosGenerico("#slcTipoServicioActualizar", () => ListarPaquetes.cargarSelectPaquetesGenerico("#slcTipoServicioActualizar", "#slcPaquetesActualizar"));
});
