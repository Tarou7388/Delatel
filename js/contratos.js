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
  const referencia = document.querySelector("#txtReferencia");
  const coordenada = document.querySelector("#txtCoordenadasMapa");
  const slcPaquetes = document.querySelector("#slcPaquetes");
  const txtNota = document.querySelector("#txtNota");
  const accesos = await Herramientas.permisos();
  const btnBuscarCoordenadas = document.querySelector("#btnBuscarCoordenadas");
  const slcSector = document.querySelector("#slcSector");

  let iniciarMapaSi = false;
  let idSector = null;
  let idCaja = null;
  let cambioServicio = 0;
  let idCliente = null;
  let idPersona = "";
  let idEmpresa = "";
  slcPaquetes.disabled = true;
  let tabla;
  let fichaInstalacion = {};

  mapa.emitter.on('coordenadaEncontrada', async (coordenada) => {
    await cargarSelectCajas(JSON.parse(localStorage.getItem('marcadoresCercanos')));
    document.querySelector("#slcSector").disabled = false;
  });

  mapa.emitter.on('coordenadaEncontradaActualizar', async (coordenada) => {
    await cargarSelectCajasActualizar(JSON.parse(localStorage.getItem('marcadoresCercanosActualizar')));
  });

  $('#slcSector').on('change', async function () {
    idCaja = $(this).val();
    const optgroup = $(this).find(':selected').parent();
    const optgroupId = optgroup.attr('id');
    if (optgroupId && optgroupId.includes('-')) {
      idSector = optgroupId.split('-')[1];
    } else {
      idSector = null;
    }
  });

  // Cargar cajas para el registro (slcSector)
  async function cargarSelectCajas(marcadoresNuevos) {
    try {
      const marcadores = marcadoresNuevos || [];
      const sectoresInfo = {};

      $('#slcSector').empty();
      $('#slcSector').append(new Option('Seleccione una caja', '', true, true));

      const cajasIds = marcadores
        .filter(marcador => marcador && marcador.properties && marcador.properties.id)
        .map(marcador => parseInt(marcador.properties.id))
        .filter(id => !isNaN(id));

      if (cajasIds.length === 0) {
        $('#slcSector').trigger('change');
        return;
      }

      const idsString = cajasIds.join(',');

      const cajasResponse = await fetch(`${config.HOST}app/controllers/Caja.controllers.php?operacion=cajasBuscarMultiple&ids=${idsString}`);

      const cajasData = await cajasResponse.json();

      if (!cajasData || !Array.isArray(cajasData) || cajasData.length === 0) {
        $('#slcSector').trigger('change');
        return;
      }

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

      const sectoresIdsString = sectoresIds.join(',');

      const sectoresResponse = await fetch(`${config.HOST}app/controllers/Sector.controllers.php?operacion=sectoresBuscarMultiple&ids=${sectoresIdsString}`);

      const sectoresData = await sectoresResponse.json();

      if (!sectoresData || !Array.isArray(sectoresData)) {
        $('#slcSector').trigger('change');
        return;
      }

      const sectoresMap = {};
      sectoresData.forEach(sector => {
        if (sector && sector.id_sector) {
          sectoresMap[sector.id_sector] = sector.sector;
        }
      });

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
  };


  async function cargarSelectCajasActualizar(marcadoresNuevos) {
    try {
      const $slcSectorActualizar = $('#slcSectorActualizar');

      // Reset: eliminar select2 anterior, vaciar y deshabilitar
      if ($slcSectorActualizar.hasClass('select2-hidden-accessible')) {
        $slcSectorActualizar.select2('destroy');
      }
      $slcSectorActualizar.empty().prop('disabled', true);
      $slcSectorActualizar.append(new Option('Seleccione una caja', '', true, true));

      const marcadores = marcadoresNuevos || [];
      const sectoresInfo = {};

      const cajasIds = marcadores
        .filter(m => m?.properties?.id)
        .map(m => parseInt(m.properties.id))
        .filter(id => !isNaN(id));

      if (cajasIds.length === 0) {
        $slcSectorActualizar.select2({
          theme: "bootstrap-5",
          allowClear: true,
          minimumResultsForSearch: 0 // Habilita el buscador siempre
        });
        $slcSectorActualizar.trigger('change');
        return;
      }

      const cajasResponse = await fetch(`${config.HOST}app/controllers/Caja.controllers.php?operacion=cajasBuscarMultiple&ids=${cajasIds.join(',')}`);
      const cajasData = await cajasResponse.json();

      if (!Array.isArray(cajasData) || cajasData.length === 0) {
        $slcSectorActualizar.select2({
          theme: "bootstrap-5",
          allowClear: true,
          minimumResultsForSearch: 0
        });
        $slcSectorActualizar.trigger('change');
        return;
      }

      const sectoresIds = [...new Set(
        cajasData.map(c => parseInt(c.id_sector)).filter(id => !isNaN(id))
      )];

      if (sectoresIds.length === 0) {
        $slcSectorActualizar.select2({
          theme: "bootstrap-5",
          allowClear: true,
          minimumResultsForSearch: 0
        });
        $slcSectorActualizar.trigger('change');
        return;
      }

      const sectoresResponse = await fetch(`${config.HOST}app/controllers/Sector.controllers.php?operacion=sectoresBuscarMultiple&ids=${sectoresIds.join(',')}`);
      const sectoresData = await sectoresResponse.json();

      const sectoresMap = {};
      if (Array.isArray(sectoresData)) {
        sectoresData.forEach(sector => {
          if (sector?.id_sector) {
            sectoresMap[sector.id_sector] = sector.sector;
          }
        });
      }

      cajasData.forEach(caja => {
        if (!caja?.id_sector) return;

        const idSector = caja.id_sector;
        if (!sectoresInfo[idSector]) {
          sectoresInfo[idSector] = {
            id: idSector,
            nombre: sectoresMap[idSector] || 'Sector Desconocido',
            cajas: []
          };
        }

        sectoresInfo[idSector].cajas.push({
          id: caja.id_caja,
          nombre: caja.nombre || 'Sin nombre'
        });
      });

      for (const idSector in sectoresInfo) {
        const sector = sectoresInfo[idSector];
        const optgroup = $('<optgroup></optgroup>')
          .attr('label', sector.nombre)
          .attr('id', `sector-${sector.id}`);

        sector.cajas.forEach(caja => {
          optgroup.append(new Option(caja.nombre, caja.id));
        });

        $slcSectorActualizar.append(optgroup);
      }

      // Inicializar select2 con buscador dinámico
      $slcSectorActualizar.select2({
        theme: "bootstrap-5",
        allowClear: true,
        minimumResultsForSearch: 0, // Siempre muestra el buscador
        width: '100%',
        language: {
          noResults: function () {
            return "No se encontraron resultados";
          }
        }
      });

      // Habilitar si hay al menos una opción válida
      const hasOptions = $slcSectorActualizar.find('option').length > 1 || $slcSectorActualizar.find('optgroup').length > 0;
      $slcSectorActualizar.prop('disabled', !hasOptions).val(null).trigger('change');

    } catch (error) {
      console.error('Error al cargar cajas:', error.message);
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
    if (idSector == null) {
      idSector = 0;
    }
    // Construir el objeto fichainstalacion solo si idCaja tiene valor
    let fichainstalacion = {};
    if (idCaja !== null && idCaja !== "" && typeof idCaja !== "undefined") {
      fichainstalacion.idcaja = idCaja;
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
        fichainstalacion: JSON.stringify(fichainstalacion),
        idUsuario: login.idUsuario,
      },
    };

    try {
      const response = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php`, {
        method: "POST",
        body: JSON.stringify(datosEnvio),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

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
  async function eliminar(idContrato, idUsuario) {
    if (accesos?.contratos?.eliminar) {
      const responsePeriodo = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerFichaInstalacion&id=${idContrato}`);
      const dataPeriodoini = await responsePeriodo.json();
      const dataPeriodo = JSON.parse(dataPeriodoini[0].ficha_instalacion);

      let eliminarSi = false

      if (!dataPeriodo || !dataPeriodo.periodo) {
        if (await ask("Este contrato no está instalado. ¿Desea cancelar el Contrato?", "Contratos")) {
          eliminarSi = true;
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
    if (!accesos?.contratos?.actualizar) {
      showToast("No tienes acceso para actualizar contratos", "ERROR");
      return;
    }

    const direccionServicio = document.querySelector("#txtDireccionActualizar").value.trim();
    const referencia = document.querySelector("#txtReferenciaActualizar").value.trim();
    const nota = document.querySelector("#txtNotaActualizar").value.trim();
    const fechaInicio = document.querySelector("#txtFechaInicioActualizar").value;
    const slcSectorActualizar = document.getElementById("slcSectorActualizar");
    const idCaja = slcSectorActualizar.value;
    let idSectorActualizar = null;

    if (slcSectorActualizar.selectedIndex !== -1) {
      const selectedOption = slcSectorActualizar.options[slcSectorActualizar.selectedIndex];
      const optgroup = selectedOption.parentElement;
      if (
        optgroup &&
        optgroup.tagName === "OPTGROUP" &&
        typeof optgroup.id === "string" &&
        optgroup.id.startsWith("sector-")
      ) {
        idSectorActualizar = optgroup.id.split('-')[1];
      }
    }

    // Validación de campos obligatorios
    if (
      !direccionServicio ||
      !referencia ||
      !idPaquete ||
      (slcSectorActualizar && !idCaja)
    ) {
      showToast("¡Llene todos los campos obligatorios!", "INFO");
      return;
    }
    console.log("ID Caja:", idCaja);

    if (idCaja) {
      if (!fichaInstalacion) {
        fichaInstalacion = {};
      }
      fichaInstalacion.idcaja = idCaja;
    }

    const datosEnvio = {
      operacion: "actualizarContrato",
      parametros: {
        idContrato: idContrato,
        idPaquete: idPaquete,
        direccionServicio: direccionServicio,
        referencia: referencia,
        nota: nota,
        fechaInicio: fechaInicio,
        idsector: idSectorActualizar,
        fichaInstalacion: JSON.stringify(fichaInstalacion),
        coordenada: document.querySelector("#txtCoordenadaActualizar").value.trim(),
        idUsuarioUpdate: idUsuario,
      },
    };

    console.log("Datos a enviar:", datosEnvio);

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

    const modalElement = document.getElementById("modalEditarContrato");
    const modal = bootstrap.Modal.getInstance(modalElement);

    if (data.actualizado) {
      showToast("¡Contrato actualizado correctamente!", "SUCCESS", 1500);
      document.getElementById("form-editar-contrato").reset();
      tabla.ajax.reload();
      if (modal) {
        modal.hide();
        // Limpiar los campos del formulario dentro del modal
        modalElement.querySelectorAll('input, textarea, select').forEach(el => {
          if (el.tagName === 'SELECT') {
            el.selectedIndex = 0;
          } else {
            el.value = '';
          }
        });
      }
    } else {
      showToast("Error al actualizar el contrato.", "ERROR");
      if (modal) {
        modal.hide();
        modalElement.parentNode.removeChild(modalElement);
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
        url: `${config.HOST}app/controllers/Contrato.ssp.php?vista=listarContratoSimple`,
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
            //ESTO ES EXPERIMENTAL, NO SE DEBE USAR EL btnLOG
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
                        <button class="btn btn-sm btn-secondary btnLog" data-tipoServicio="${row[6]}" data-idContrato="${row[0]}" title="Ficha Técnica">
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

            if (
              !fichaInstalacion ||
              Object.keys(fichaInstalacion).length === 0 ||
              (Object.keys(fichaInstalacion).length === 1 && fichaInstalacion.idcaja)
            ) {
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
        const botonesLog = document.querySelectorAll(".btnLog");

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
            // Si el botón de editar fue clickeado (o su hijo)
            if (event.target.closest(".btn-edit")) {
              const btn = event.target.closest(".btn-edit");
              const fila = btn.closest("tr");
              const tipoServicio = fila && fila.querySelector(".btnGenerar") ? fila.querySelector(".btnGenerar").getAttribute("data-tipoServicio") : "";
              if (tipoServicio === "WISP") {
                showToast("Falta completar Actualizar para este servicio", "WARNING");
                event.stopPropagation();
                return;
              }
              const idContrato = btn.getAttribute("data-idContrato");
              abrirModalEditar(idContrato);
            }
          });
        });

        botonesEliminar.forEach((boton) => {
          boton.addEventListener("click", async (event) => {
            const idContrato = event.target.getAttribute("data-idContrato");
            eliminar(idContrato, login.idUsuario);
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

        //ESTO ES EXPERIMENTAL, NO SE DEBE USAR
        botonesLog.forEach((boton) => {
          boton.addEventListener("click", async (event) => {
            const idContrato = event.target.getAttribute("data-idContrato");
            const cardLogs = document.querySelector("#cardLogs");
            const cardContratos = document.querySelector("#cardContratos");
            if (cardLogs) cardLogs.style.display = "block";
            if (cardContratos) cardContratos.style.display = "none";
            await cargarDatosLogs(idContrato);
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
    const slcTipoServicio = document.querySelector("#slcTipoServicio");
    const tipoServicioValor = slcTipoServicio ? slcTipoServicio.value : "";

    if (
      nroDoc.value == "" ||
      nombre.value == "" ||
      precio.value == "" ||
      precio.value == 0 ||
      direccion.value == "" ||
      referencia.value == "" ||
      coordenada.value == "" ||
      slcPaquetes.value == "0" ||
      (
        tipoServicioValor !== "2" &&
        (slcSector.value == "" || slcSector.value == null || slcSector.value == "0")
      )
    ) {
      return false;
    } else {
      return true;
    }
  };

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
    document.getElementById("form-editar-contrato").reset();
    console.log("Abriendo modal de edición para el contrato:", idContrato);
    const modalElement = document.getElementById("modalEditarContrato");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    try {
      const response = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=buscarContratoId&id=${idContrato}`);
      const data = await response.json();
      if (!data || !data[0]) {
        showToast("No se encontró el contrato.", "ERROR");
        return;
      }

      document.getElementById("txtIdContratoActualizar").value = data[0].id_contrato || "";
      document.getElementById("txtNombreActualizar").value = data[0].nombre_cliente || "";
      document.getElementById("txtFechaInicioActualizar").value = data[0].fecha_inicio || "";
      document.getElementById("txtDireccionActualizar").value = data[0].direccion_servicio || "";
      document.getElementById("txtReferenciaActualizar").value = data[0].referencia || "";
      document.getElementById("txtCoordenadaActualizar").value = data[0].coordenada || "";
      document.getElementById("txtNotaActualizar").value = data[0].nota || "";


      fichaInstalacion = JSON.parse(data[0].ficha_instalacion);
      console.log("Datos del contrato:", fichaInstalacion);
      // Buscar coordenada en el mapa si existe
      if (data[0].coordenada && data[0].coordenada.includes(',')) {
        const [lat, lng] = data[0].coordenada.split(',').map(x => parseFloat(x.trim()));
        if (!isNaN(lat) && !isNaN(lng)) {
          mapa.buscarCoordenadassinMapa({ lat, lng });
        }
      }

      // Cargar servicios y paquetes
      let idServicio = "";
      let tiposServicio = 1;
      try {
        idServicio = JSON.parse(data[0].id_servicio).id_servicio;
        tiposServicio = data[0].tipos_servicio ? data[0].tipos_servicio.split(',').length : 1;
      } catch (e) {
        idServicio = data[0].id_servicio || "";
        tiposServicio = 1;
      }

      if (tiposServicio === 2) {
        await ListarPaquetes.cargarTipoServicioActualizar('duos');
        await ListarPaquetes.cargarPaquetesMultiplesActualizar("duos", data[0].id_paquete);
      } else {
        await ListarPaquetes.cargarTipoServicioActualizar(idServicio);
        await ListarPaquetes.cargarPaquetesActualizar(idServicio, data[0].id_paquete);
      }

      // Mapa y cajas
      mapa.eliminarMapa();
      iniciarMapaSi = false;
      if (data[0].tipos_servicio === "WISP") {
        await cargarCaracteristicasMapa("Antenas", "mapActualizar");
      } else {
        await cargarCaracteristicasMapa("Cajas", "mapActualizar");
      }


      if (data[0].coordenada) {
        const buscarCoordenada = document.querySelector("#buscarCoordenadaActualizar");
        buscarCoordenada.addEventListener("click", async () => {
          slcSectorActualizar.disabled = false;
        });
      }

      await cargarSelectCajasActualizar(JSON.parse(localStorage.getItem('marcadoresCercanosActualizar')));
      // Esperar 0.6 segundos antes de buscar y seleccionar la caja
      setTimeout(() => {
        if (fichaInstalacion && fichaInstalacion.idcaja !== null && fichaInstalacion.idcaja !== undefined && fichaInstalacion.idcaja !== 0 && fichaInstalacion.idcaja !== "0") {
          console.log("Intentando seleccionar por idcaja:", fichaInstalacion.idcaja);
          const optionCaja = $(`#slcSectorActualizar option[value="${fichaInstalacion.idcaja}"]`);
          if (optionCaja.length > 0) {
            console.log("Opción encontrada para idcaja, seleccionando...");
            $('#slcSectorActualizar').val(fichaInstalacion.idcaja).trigger('change');
          } else {
            console.log("No se encontró opción para idcaja en el select.");
          }
        } else if (data[0].id_sector) {
          console.log("No hay idcaja válido, intentando seleccionar por id_sector:", data[0].id_sector);
          const optgroup = $(`#slcSectorActualizar optgroup#sector-${data[0].id_sector}`);
          if (optgroup.length > 0) {
            const firstOption = optgroup.find('option').first();
            if (firstOption.length > 0) {
              console.log("Opción encontrada en el optgroup del sector, seleccionando...");
              $('#slcSectorActualizar').val(firstOption.val()).trigger('change');
            } else {
              console.log("No hay opciones dentro del optgroup del sector.");
            }
          } else {
            console.log("No se encontró optgroup para el id_sector en el select.");
          }
        } else {
          console.log("No hay idcaja ni id_sector válidos para seleccionar.");
        }
      }, 600);

      // Cerrar modal al hacer click en la X
      const closeBtn = modalElement.querySelector(".btn-close");
      if (closeBtn) {
        closeBtn.onclick = () => modal.hide();
      }
    } catch (error) {
      console.error("Error al obtener los detalles del contrato:", error);
      showToast("Error al cargar los datos del contrato.", "ERROR");
    }
  };


  const btnRetornarLista = document.getElementById("btnRetornarLista");

  btnRetornarLista.addEventListener("click", () => {
    const cardLogs = document.querySelector("#cardLogs");
    if (cardLogs) cardLogs.style.display = "none";
    const cardContratos = document.querySelector("#cardContratos");
    if (cardContratos) cardContratos.style.display = "block";
    tabla.ajax.reload();

  });
  //ESTO ES EXPERIMENTAL, NO SE DEBE USAR
  // Versión comprimida y responsive para vista móvil
  async function cargarDatosLogs(idContrato) {
    const mdlftLogs = document.getElementById("mdlftLogs");
    const mdrgtLogs = document.getElementById("mdrgtLogs");
    mdlftLogs.innerHTML = `
      <div class="d-flex justify-content-center align-items-center my-4" style="min-height:80px;">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
    `;
    if (mdrgtLogs) mdrgtLogs.innerHTML = "";
    try {
      const response = await fetch(
        `${config.HOST}app/controllers/Logs.controllers.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operacion: "obtenerRegistrosContrato",
            idContrato: idContrato,
            tbOption: 16
          }),
        }
      );
      const data = await response.json();
      if (Array.isArray(data[0]) && data[0].length > 0) {
        let html = `
          <div class="table-responsive">
            <table class="table table-hover table-bordered align-middle mb-0 shadow-sm rounded">
              <thead class="table-primary d-none d-md-table-header-group">
                <tr>
                  <th class="text-center" style="width: 140px;">Fecha/Hora</th>
                  <th class="text-center" style="width: 180px;">Responsable</th>
                  <th class="text-center">Mensaje</th>
                </tr>
              </thead>
              <tbody>
        `;
        data[0].forEach((log, idx) => {
          html += `
            <tr class="log-row" data-id="${log.id_log}" style="cursor:pointer;">
              <td class="text-center text-nowrap">
                <span class="badge bg-light text-dark border border-primary px-2 py-1">${log.log_time || ""}</span>
              </td>
              <td class="text-center">
                <span class="fw-semibold text-primary">${log.operador || ""}</span>
              </td>
              <td>
                <span class="text-dark">${log.message || ""}</span>
              </td>
            </tr>
            <!-- Responsive: Card para móvil -->
            <tr class="d-md-none log-mobile-row" data-id="${log.id_log}">
              <td colspan="3" style="padding:0;">
                <div class="p-2 border rounded mb-2" style="background:#f8f9fa;">
                  <div><b>Fecha/Hora:</b> <span class="badge bg-light text-dark border border-primary px-2 py-1">${log.log_time || ""}</span></div>
                  <div><b>Responsable:</b> <span class="fw-semibold text-primary">${log.operador || ""}</span></div>
                  <div><b>Mensaje:</b> <span class="text-dark">${log.message || ""}</span></div>
                  <div class="mt-2 text-end">
                    <button class="btn btn-link btn-sm btn-detalle-mobile" data-id="${log.id_log}" style="text-decoration:none;">
                      <i class="fa fa-list-alt me-1"></i>Ver detalle
                    </button>
                  </div>
                  <div class="detalle-mobile-container"></div>
                </div>
              </td>
            </tr>
          `;
        });
        html += `
              </tbody>
            </table>
          </div>
          <style>
            @media (max-width: 767.98px) {
              #mdlftLogs table thead { display: none; }
              #mdlftLogs tr.log-row { display: none; }
              #mdlftLogs tr.d-md-none { display: table-row; }
            }
            @media (min-width: 768px) {
              #mdlftLogs tr.d-md-none { display: none !important; }
            }
          </style>
        `;
        mdlftLogs.innerHTML = html;

        // Evento para mostrar detalles (solo en desktop)
        const rows = mdlftLogs.querySelectorAll('.log-row');
        rows.forEach(row => {
          row.addEventListener('click', async function () {
            rows.forEach(r => r.classList.remove('table-active'));
            this.classList.add('table-active');
            const logId = this.getAttribute('data-id');
            if (!logId) return;
            if (mdrgtLogs) {
              mdrgtLogs.innerHTML = `
                <div class="d-flex justify-content-center align-items-center my-4" style="min-height:80px;">
                  <div class="spinner-border text-primary" role="status"></div>
                </div>
              `;
            }
            try {
              const response = await fetch(
                `${config.HOST}app/controllers/Logs.controllers.php`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    operacion: "obtenerDetallados",
                    id: logId,
                  }),
                }
              );
              const data = await response.json();
              if (mdrgtLogs) {
                if (Array.isArray(data[0]) && data[0].length > 0) {
                  let html = `
                    <div class="table-responsive">
                      <table class="table table-sm table-bordered table-striped align-middle mb-0 shadow-sm rounded" style="font-size:0.85rem;">
                        <thead class="table-primary">
                          <tr>
                            <th class="text-center px-2 py-1" style="width:120px;">Campo</th>
                            <th class="text-center px-2 py-1" style="width:120px;">Antes</th>
                            <th class="text-center px-2 py-1" style="width:120px;">Después</th>
                          </tr>
                        </thead>
                        <tbody>
                  `;
                  data[0].forEach(det => {
                    function renderJsonAsText(jsonStr) {
                      try {
                        const obj = JSON.parse(jsonStr);
                        if (typeof obj === 'object' && obj !== null) {
                          return `<pre class="mb-0" style="font-size:0.82rem; max-height:200px; overflow:auto; white-space:pre-wrap; word-break:break-all;">${JSON.stringify(obj, null, 2)}</pre>`;
                        }
                      } catch (e) { }
                      return `<pre class="mb-0" style="font-size:0.82rem; max-height:200px; overflow:auto; white-space:pre-wrap; word-break:break-all;">${jsonStr || ''}</pre>`;
                    }
                    html += `
                      <tr>
                        <td class="text-center px-2 py-1">${det.campo || ''}</td>
                        <td class="px-2 py-1">${renderJsonAsText(det.valor_anterior)}</td>
                        <td class="px-2 py-1">${renderJsonAsText(det.valor_nuevo)}</td>
                      </tr>
                    `;
                  });
                  html += `
                        </tbody>
                      </table>
                    </div>
                  `;
                  mdrgtLogs.innerHTML = html;
                } else {
                  mdrgtLogs.innerHTML = `
                    <div class="alert alert-info text-center my-4 shadow-sm rounded">
                      <i class="fa fa-info-circle me-2"></i>No hay detalles para este registro.
                    </div>
                  `;
                }
              }
            } catch (error) {
              if (mdrgtLogs) {
                mdrgtLogs.innerHTML = `
                  <div class="alert alert-danger text-center my-4 shadow-sm rounded">
                    <i class="fa fa-exclamation-triangle me-2"></i>Error al obtener el detalle del registro.
                  </div>
                `;
              }
              console.error("Error al obtener el detalle del log:", error);
            }
          });
        });

        // Evento para mostrar detalles en móvil (debajo del registro)
        const btnsDetalleMobile = mdlftLogs.querySelectorAll('.btn-detalle-mobile');
        btnsDetalleMobile.forEach(btn => {
          btn.addEventListener('click', async function (e) {
            e.preventDefault();
            const logId = this.getAttribute('data-id');
            const parentCard = this.closest('.log-mobile-row');
            const detalleContainer = parentCard.querySelector('.detalle-mobile-container');
            // Toggle: si ya está abierto, ciérralo
            if (detalleContainer.getAttribute('data-open') === '1') {
              detalleContainer.innerHTML = '';
              detalleContainer.setAttribute('data-open', '0');
              return;
            }
            // Cierra otros detalles abiertos
            mdlftLogs.querySelectorAll('.detalle-mobile-container').forEach(dc => {
              dc.innerHTML = '';
              dc.setAttribute('data-open', '0');
            });
            detalleContainer.innerHTML = `
              <div class="d-flex justify-content-center align-items-center my-2" style="min-height:40px;">
                <div class="spinner-border text-primary" role="status" style="width:1.5rem;height:1.5rem;"></div>
              </div>
            `;
            detalleContainer.setAttribute('data-open', '1');
            try {
              const response = await fetch(
                `${config.HOST}app/controllers/Logs.controllers.php`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    operacion: "obtenerDetallados",
                    id: logId,
                  }),
                }
              );
              const data = await response.json();
              if (Array.isArray(data[0]) && data[0].length > 0) {
                let html = `
                  <div class="table-responsive mt-2">
                    <table class="table table-sm table-bordered table-striped align-middle mb-0 shadow-sm rounded" style="font-size:0.85rem;">
                      <thead class="table-primary">
                        <tr>
                          <th class="text-center px-2 py-1" style="width:90px;">Campo</th>
                          <th class="text-center px-2 py-1" style="width:90px;">Antes</th>
                          <th class="text-center px-2 py-1" style="width:90px;">Después</th>
                        </tr>
                      </thead>
                      <tbody>
                `;
                data[0].forEach(det => {
                  function renderJsonAsText(jsonStr) {
                    try {
                      const obj = JSON.parse(jsonStr);
                      if (typeof obj === 'object' && obj !== null) {
                        return `<pre class="mb-0" style="font-size:0.82rem; max-height:120px; overflow:auto; white-space:pre-wrap; word-break:break-all;">${JSON.stringify(obj, null, 2)}</pre>`;
                      }
                    } catch (e) { }
                    return `<pre class="mb-0" style="font-size:0.82rem; max-height:120px; overflow:auto; white-space:pre-wrap; word-break:break-all;">${jsonStr || ''}</pre>`;
                  }
                  html += `
                    <tr>
                      <td class="text-center px-2 py-1">${det.campo || ''}</td>
                      <td class="px-2 py-1">${renderJsonAsText(det.valor_anterior)}</td>
                      <td class="px-2 py-1">${renderJsonAsText(det.valor_nuevo)}</td>
                    </tr>
                  `;
                });
                html += `
                      </tbody>
                    </table>
                  </div>
                `;
                detalleContainer.innerHTML = html;
              } else {
                detalleContainer.innerHTML = `
                  <div class="alert alert-info text-center my-2 shadow-sm rounded">
                    <i class="fa fa-info-circle me-2"></i>No hay detalles para este registro.
                  </div>
                `;
              }
            } catch (error) {
              detalleContainer.innerHTML = `
                <div class="alert alert-danger text-center my-2 shadow-sm rounded">
                  <i class="fa fa-exclamation-triangle me-2"></i>Error al obtener el detalle del registro.
                </div>
              `;
              console.error("Error al obtener el detalle del log:", error);
            }
          });
        });

      } else {
        mdlftLogs.innerHTML = `
          <div class="alert alert-info text-center my-4 shadow-sm rounded">
            <i class="fa fa-info-circle me-2"></i>No hay registros para este contrato.
          </div>
        `;
        if (mdrgtLogs) mdrgtLogs.innerHTML = "";
      }
    } catch (error) {
      mdlftLogs.innerHTML = `
        <div class="alert alert-danger text-center my-4 shadow-sm rounded">
          <i class="fa fa-exclamation-triangle me-2"></i>Error al obtener los registros del contrato.
        </div>
      `;
      if (mdrgtLogs) mdrgtLogs.innerHTML = "";
      console.error("Error al obtener los registros del contrato:", error);
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

  btnBuscarCoordenadas.addEventListener("click", async () => {
    const slcTipoServicio = document.querySelector("#slcTipoServicio");
    if (cambioServicio == slcTipoServicio.value) {
      cambioServicio = slcTipoServicio.value;
      iniciarMapaSi = false
    } else {
      cambioServicio = slcTipoServicio.value;
      if (slcTipoServicio.value == "2") {
        mapa.eliminarMapa();
        iniciarMapaSi = false
        await cargarCaracteristicasMapa("Antenas", "map");
      } else {
        mapa.eliminarMapa();
        iniciarMapaSi = false
        await cargarCaracteristicasMapa("Cajas", "map");
      }
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

  async function cargarCaracteristicasMapa(objeto, id) {
    const renderizado = "modal"
    if (iniciarMapaSi) {
      return
    } else {
      iniciarMapaSi = true
      mapa.iniciarMapa(objeto, id, renderizado);
    }
  };

  document.getElementById("slcTipoServicio").addEventListener("change", function () {
    const txtPrecio = document.getElementById("txtPrecio");
    const divSector = document.getElementById("divSector");
    const btnBuscarCoordenadas = document.getElementById("btnBuscarCoordenadas");

    txtPrecio.disabled = false;
    txtPrecio.value = "";
    txtPrecio.disabled = true;

    const valor = this.value;

    if (valor === "0") {
      btnBuscarCoordenadas.disabled = true;
      divSector.hidden = true;
      divSector.removeAttribute('required');
    } else {
      btnBuscarCoordenadas.disabled = false;

      if (valor === "2") {
        divSector.hidden = true;
        divSector.removeAttribute('required');
      } else {
        divSector.hidden = false;
        divSector.setAttribute('required', 'required');
        divSector.dispatchEvent(new Event("change"));
      }
    }
  });

  ListarPaquetes.cargarServiciosGenerico("#slcTipoServicio", () => ListarPaquetes.cargarSelectPaquetesGenerico("#slcTipoServicio", "#slcPaquetes"));
  ListarPaquetes.cargarServiciosGenerico("#slcTipoServicioActualizar", () => ListarPaquetes.cargarSelectPaquetesGenerico("#slcTipoServicioActualizar", "#slcPaquetesActualizar"));


  $(".select2me").select2({ theme: "bootstrap-5", allowClear: true });
  $(".select2me").parent("div").children("span").children("span").children("span").css("height", " calc(3.5rem + 2px)");
  $(".select2me").parent("div").children("span").children("span").children("span").children("span").css("margin-top", "18px");
  $(".select2me").parent("div").find("label").css("z-index", "1");


});
