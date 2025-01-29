import config from "../env.js";
import * as mapa from "./Mapa.js";
import * as ListarPaquetes from "./ListarPaquetes.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener("DOMContentLoaded", async function () {
  let login = await Herramientas.obtenerLogin();
  const accesos = await Herramientas.permisos()
  const userid = login.idUsuario;
  const slcPaquetes = document.getElementById("slcPaquetes");
  const slcTipoServicio = document.getElementById("slcTipoServicio");
  const slcChangeRegistro = document.getElementById("slcChangeRegistro");
  const divPersonaCard = document.getElementById("divPersonaCard");
  const divEmpresaCard = document.getElementById("divEmpresaCard");
  const frmPersonas = document.getElementById("frmPersonas");
  const slcTipoDocumento = document.getElementById("slcTipoDocumento");
  const txtNumDocumentoPersona = document.getElementById("txtNumDocumentoPersona");
  const txtNombresPersona = document.getElementById("txtNombresPersona");
  const txtApellidosPersona = document.getElementById("txtApellidosPersona");
  const txtTelefono = document.getElementById("txtTelefonoPersona");
  const txtEmail = document.getElementById("txtEmailPersona");
  const txtcoordenadasPersona = document.getElementById("txtCoordenadasPersona");
  const slcNacionalidad = document.getElementById("slcNacionalidad");
  const divOtherNacionalidad = document.getElementById("divOtherNacionalidad");
  const txtOtherNacionalidad = document.getElementById("txtOtherNacionalidad");
  const txtNacionalidad = document.getElementById("txtNacionalidad");
  const txtDireccion = document.getElementById("txtDireccionPersona");
  const txtReferencia = document.getElementById("txtReferenciaPersona");
  const btnBuscar = document.getElementById("btnBuscar");

  let idCaja = null;
  let dniActual = null;
  let idSector = null;

  slcPaquetes.disabled = true;

  slcNacionalidad.addEventListener('change', function () {
    if (slcNacionalidad.value === 'Otros') {
      divOtherNacionalidad.classList.remove('d-none');
    } else {
      divOtherNacionalidad.classList.add('d-none');
      txtOtherNacionalidad.value = '';
    }
  });

  /**
   * Alterna la visibilidad de los formularios de Persona y Empresa.
   *
   * @param {string} value - El valor que determina qué formulario mostrar. Puede ser "Persona" o "Empresa".
   */
  function toggleForms(value) {
    if (value === "Persona") {
      resetUI();
      divPersonaCard.classList.remove("d-none");
      divEmpresaCard.classList.add("d-none");
    } else if (value === "Empresa") {
      resetUI();
      divPersonaCard.classList.add("d-none");
      divEmpresaCard.classList.remove("d-none");
    } else {
      resetUI();
      divPersonaCard.classList.remove("d-none");
      divEmpresaCard.classList.add("d-none");
    }
  }

  slcTipoServicio.addEventListener("change", async function () {
    const idServicioSeleccionado = slcTipoServicio.value;
    const tiposMultiples = ["duos"];

    if (tiposMultiples.includes(idServicioSeleccionado)) {
      await ListarPaquetes.cargarPaquetesMultiplesGenerico(idServicioSeleccionado, "#slcPaquetes");
    } else {
      await ListarPaquetes.cargarPaquetesGenerico(idServicioSeleccionado, "#slcPaquetes");
    }
  });

  (() => {
    manejarDocumentoNacionalidad();
    ListarPaquetes.cargarServiciosGenerico("#slcTipoServicio", async () => {
      const idServicioSeleccionado = slcTipoServicio.value;
      const tiposMultiples = ["duos"];

      if (tiposMultiples.includes(idServicioSeleccionado)) {
        await ListarPaquetes.cargarPaquetesMultiplesGenerico(idServicioSeleccionado, "#slcPaquetes");
      } else {
        await ListarPaquetes.cargarPaquetesGenerico(idServicioSeleccionado, "#slcPaquetes");
      }
    });
  })();

  /**
   * Obtiene y procesa datos para un DNI (Documento Nacional de Identidad) dado.
   *
   * @param {string} operacion - La operación a realizar.
   * @param {string} dni - El número de DNI para obtener datos.
   * @returns {void}
   *
   * @description
   * Esta función envía una solicitud al servidor para obtener datos asociados con el DNI proporcionado.
   * Maneja la respuesta actualizando la interfaz de usuario con los datos obtenidos o mostrando mensajes de error apropiados.
   *
   * @example
   * ObtenerDataDNI('buscar', '12345678');
   *
   * @throws {Error} Lanza un error si la respuesta no es correcta.
   */
  function ObtenerDataDNI(operacion, dni) {
    bloquearCargar(true);
    fetch(`${config.HOST}app/controllers/Persona.controllers.php?operacion=${operacion}&dni=${encodeURIComponent(dni)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener la información');
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.nombres && data.apellidoPaterno) {
          dniActual = dni;
          txtNombresPersona.value = data.nombres;
          txtApellidosPersona.value = `${data.apellidoPaterno} ${data.apellidoMaterno || ''}`.trim();
        } else {
          showToast('No se encontraron datos para el DNI proporcionado', 'WARNING');
          dniActual = null;
        }
      })
      .catch((error) => {
        showToast('Error al obtener la información de la persona: ' + error.message, 'ERROR');
      })
      .finally(() => {
        bloquearCargar(false);
      });
  }

  function resetUI() {
    txtNumDocumentoPersona.value = '';
    txtNombresPersona.value = '';
    txtApellidosPersona.value = '';
    txtTelefono.value = '';
    txtEmail.value = '';
    txtDireccion.value = '';
    txtReferencia.value = '';
    txtcoordenadasPersona.value = '';
    slcTipoDocumento.value = '';
    slcNacionalidad.value = '';
    txtRuc.value = '';
    txtRepresentanteLegal.value = '';
    txtRazonSocial.value = '';
    txtNombreComercial.value = '';
    txtTelefono.value = '';
    txtEmail.value = '';
    txtCoordenadas.value = '';
    txtDireccion.value = '';
    txtReferencia.value = '';
    slcTipoServicio.value = '';
    slcPaquetes.value = '';
  }

  /**
   * Verifica que los campos de la persona estén completos y sean válidos.
   *
   * @returns {Object} Un objeto con dos propiedades:
   * - mensaje {string}: Un mensaje indicando el error encontrado, si lo hay.
   * - confirmacion {boolean}: Un valor booleano que indica si todos los campos son válidos (true) o no (false).
   */
  function verificarCamposPersona() {
    const camposPersona = [
      slcTipoDocumento, txtNumDocumentoPersona, txtNombresPersona,
      txtApellidosPersona, txtTelefono,
      txtDireccion, txtReferencia, txtcoordenadasPersona,
    ];
    let bandera = {
      mensaje: "",
      confirmacion: true
    };
    const length = txtNumDocumentoPersona.value.length;
    if ((slcTipoDocumento.value === 'DNI' && length !== 8) || (slcTipoDocumento.value === 'CAR' && length !== 9)) {
      bandera.mensaje = "El número de documento no es válido";
      bandera.confirmacion = false;
    }

    for (let campo of camposPersona) {
      if (campo.value.trim() == '') {
        bandera.mensaje = "Por favor complete el campo " + campo.placeholder;
        campo.focus();
        bandera.confirmacion = false;
      }
    }
    return bandera;
  }

  /**
   * Registra una nueva persona en el sistema.
   * 
   * @async
   * @function registrarPersona
   * @returns {Promise<void>} No retorna ningún valor.
   * @throws {Error} Si ocurre un error durante la solicitud.
   * 
   * @description Esta función envía una solicitud POST al servidor para registrar una nueva persona. 
   * Los datos de la persona se obtienen de varios elementos del DOM y se envían como un FormData. 
   * Si la respuesta del servidor contiene un error, se muestra un mensaje de advertencia. 
   * Si la persona se registra correctamente, se llama a la función registrarContacto con el ID de la persona registrada.
   * 
   * @example
   * registrarPersona();
   */
  async function registrarPersona() {
    if (accesos?.personas?.crear) {
      const params = new FormData();
      params.append("operacion", "registrarPersona");
      params.append("tipoDoc", slcTipoDocumento.value);
      params.append("nroDoc", txtNumDocumentoPersona.value);
      params.append("apellidos", txtApellidosPersona.value);
      params.append("nombres", txtNombresPersona.value);
      params.append("telefono", txtTelefono.value);
      params.append("nacionalidad", slcNacionalidad.value === 'Otros' ? txtNacionalidad.value : slcNacionalidad.value);
      params.append("email", txtEmail.value);
      params.append("idUsuario", userid);

      const options = {
        method: "POST",
        body: params
      };

      const response = await fetch(`${config.HOST}app/controllers/Persona.controllers.php`, options);
      const data = await response.json();
      if (data.error) {
        showToast(data.error.message, "WARNING");
      } else {
        registrarContacto(data[0].id_persona);
      }
    } else {
      showToast("No tienes permiso para crear personas", "ERROR")
    }
  }

  /**
   * Registra un contacto para una persona específica.
   *
   * @async
   * @function registrarContacto
   * @param {number} idPersona - El ID de la persona para registrar el contacto.
   * @returns {Promise<void>} - Una promesa que se resuelve cuando el contacto ha sido registrado.
   *
   * @throws {Error} - Lanza un error si la solicitud de registro de contacto falla.
   *
   * @description
   * Esta función registra un contacto para una persona específica enviando una solicitud POST
   * al servidor con los datos necesarios. Si el registro es exitoso, muestra un mensaje de éxito
   * y pregunta al usuario si desea registrar un contrato. Si el usuario acepta, redirige a la página
   * de registro de contratos con los parámetros correspondientes.
   */
  async function registrarContacto(idPersona) {
    const Servicio = slcTipoServicio.value;
    const Paquete = slcPaquetes.value;
    const direccion = txtDireccion.value;
    const referencia = txtReferencia.value;
    const coordenadas = txtcoordenadasPersona.value;
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 14);
    const datos = {
      operacion: "registrarContacto",
      idPersona: idPersona,
      idEmpresa: '',
      idPaquete: parseInt(slcPaquetes.value.split((" - ")[0])),
      direccion: direccion,
      nota: "Para llamar",
      idUsuario: userid,
      fechaLimite: fecha.toISOString().slice(0, 10),
    };
    const response = await fetch(`${config.HOST}app/controllers/Contactabilidad.controllers.php`, {
      method: "POST",
      body: JSON.stringify(datos),
    });
    const data = await response.json();
    if (data.guardado) {
      await showToast("Persona registrada correctamente", "SUCCESS", 650);
      setTimeout(async () => {
        frmPersonas.reset();
        if (await ask("¿Desea registrar un contrato?")) {
          window.location.href = `${config.HOST}views/Contratos?nroDoc=${dniActual}&idObjeto=${idPersona}&Servicio=${Servicio}&Paquete=${Paquete}&referencia=${referencia}&coordenadas=${coordenadas}&direccion=${direccion}`;
        }
      }, 650);
    }
  }

  toggleForms(slcChangeRegistro.value);

  /**
   * Bloquea o desbloquea los campos del formulario de personas.
   *
   * @param {boolean} show - Indica si los campos deben ser bloqueados (true) o desbloqueados (false).
   */
  async function bloquearCargar(show) {
    txtTelefono.disabled = show;
    txtEmail.disabled = show;
    txtDireccion.disabled = show;
    txtReferencia.disabled = show;
    slcTipoDocumento.disabled = show;
    if (slcTipoDocumento.value != 'DNI') {
      slcNacionalidad.disabled = show;
    }
    txtNumDocumentoPersona.disabled = show;
    slcTipoServicio.disabled = show;
    slcPaquetes.disabled;
    btnBuscar.disabled = show;
    frmPersonas.querySelector("button[type=submit]").disabled = show;
  }

  function manejarDocumentoNacionalidad() {
    const peruanoOpcion = new Option('Peruano', 'Peruano');
    peruanoOpcion.id = 'peruanoOpcion';

    txtNumDocumentoPersona.addEventListener('input', cambiarslc);

    /**
     * Función que cambia el estado de varios elementos del formulario
     * basado en la longitud del valor del campo txtNumDocumentoPersona.
     * 
     * - Si la longitud es 8:
     *   - Habilita el botón de búsqueda.
     *   - Establece el tipo de documento a 'DNI' y lo deshabilita.
     *   - Establece la nacionalidad a 'Peruano' y la deshabilita.
     *   - Deshabilita los campos de apellidos y nombres.
     * - Si la longitud es diferente de 8:
     *   - Deshabilita el botón de búsqueda.
     *   - Si la longitud es 9:
     *     - Establece el tipo de documento a 'CAR' y lo deshabilita.
     *     - Habilita los campos de apellidos y nombres.
     *   - Si la longitud es diferente de 9:
     *     - Limpia el tipo de documento.
     *     - Deshabilita los campos de apellidos y nombres.
     *   - Habilita la selección de nacionalidad.
     * 
     * @function cambiarslc
     */
    function cambiarslc() {
      txtApellidosPersona.value = '';
      txtNombresPersona.value = '';
      const length = txtNumDocumentoPersona.value.length;

      if (length === 8) {
        if (![...slcNacionalidad.options].some(option => option.value === 'Peruano')) {
          slcNacionalidad.add(peruanoOpcion);
        }
        btnBuscar.disabled = false;
        slcTipoDocumento.value = 'DNI';
        slcTipoDocumento.disabled = true;
        slcNacionalidad.value = 'Peruano';
        slcNacionalidad.disabled = true;
        txtApellidosPersona.disabled = true;
        txtNombresPersona.disabled = true;
      } else {

        btnBuscar.disabled = true;
        if ([...slcNacionalidad.options].some(option => option.value === 'Peruano')) {
          slcNacionalidad.remove(slcNacionalidad.querySelector('#peruanoOpcion').index);
        }
        slcTipoDocumento.disabled = false;
        if (length === 9) {
          slcTipoDocumento.value = 'CAR';
          slcTipoDocumento.disabled = true;
          txtApellidosPersona.disabled = false;
          txtNombresPersona.disabled = false;
        } else {
          slcTipoDocumento.value = '';
          txtApellidosPersona.disabled = true;
          txtNombresPersona.disabled = true;
        }
        slcNacionalidad.disabled = false;
      }
    }
  }

  $(".select2me").select2({ theme: "bootstrap-5", placeholder: "Seleccione", allowClear: true });
  $('.select2me').parent('div').children('span').children('span').children('span').css('height', ' calc(3.5rem + 2px)');
  $('.select2me').parent('div').children('span').children('span').children('span').children('span').css('margin-top', '18px');
  $('.select2me').parent('div').find('label').css('z-index', '1');

  slcChangeRegistro.addEventListener("change", () => {
    const valor = slcChangeRegistro.value;
    toggleForms(valor);
  });

  frmPersonas.addEventListener("submit", (event) => {
    event.preventDefault();
    const bandera = verificarCamposPersona();
    if (bandera.confirmacion) {
      registrarPersona();
    } else {
      showToast(bandera.mensaje, "WARNING");
    }
  });

  document.querySelector("#btnBuscarCoordenadas").addEventListener("click", async () => {
    const params = { cajas: true, mufas: true }
    const id = "map"
    const renderizado = "modal"
    mapa.iniciarMapa(params, id, renderizado);
  })

  btnBuscar.addEventListener("click", () => {
    ObtenerDataDNI("obtenerDni", txtNumDocumentoPersona.value);
  });

  document.querySelector("#txtCoordenadasPersona").addEventListener("input", async () => {
    idSector = mapa.idSector;
    idCaja = mapa.idCaja;
  });
});