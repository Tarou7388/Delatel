import config from "../env.js";
import * as mapa from "./Mapa.js";
import * as Herramientas from "../js/Herramientas.js";
import * as ListarPaquetes from "../js/ListarPaquetes.js";

document.addEventListener("DOMContentLoaded", async function () {
  const accesos = await Herramientas.permisos()
  let login = await Herramientas.obtenerLogin();
  const userid = login.idUsuario;

  const divEmpresaCard = document.getElementById("divEmpresaCard");
  const frmEmpresas = document.getElementById("frmEmpresas");

  const txtRuc = document.getElementById("txtRuc");
  const txtRepresentanteLegal = document.getElementById("txtRepresentanteLegal");
  const txtRazonSocial = document.getElementById("txtRazonSocial");
  const txtNombreComercial = document.getElementById("txtNombreComercial");
  const txtTelefono = document.getElementById("txtTelefono");
  const txtEmail = document.getElementById("txtEmail");
  const txtCoordenadas = document.getElementById("txtCoordenadas");
  const txtDireccion = document.getElementById("txtDireccion");
  const txtReferencia = document.getElementById("txtReferencia");
  const slcPaquetes = document.getElementById("slcPaqueteEmpresa");
  const slcTipoServicio = document.getElementById("slcTipoServicioEmpresa");
  const btnCancelarEmpresa = document.getElementById("btnCancelarEmpresa");
  const btnBuscarEmpresa = document.getElementById("btnBuscarEmpresa");

  let ruc = null;

  slcPaquetes.disabled = true;

  slcTipoServicio.addEventListener("change", async function () {
    const idServicioSeleccionado = slcTipoServicio.value;
    const tiposMultiples = ["duos"];

    if (tiposMultiples.includes(idServicioSeleccionado)) {
      await ListarPaquetes.cargarPaquetesMultiplesGenerico(idServicioSeleccionado, "#slcPaqueteEmpresa");
    } else {
      await ListarPaquetes.cargarPaquetesGenerico(idServicioSeleccionado, "#slcPaqueteEmpresa");
    }
  });

  (() => {
    ListarPaquetes.cargarServiciosGenerico("#slcTipoServicioEmpresa", async () => {
      const idServicioSeleccionado = slcTipoServicio.value;
      const tiposMultiples = ["duos"];

      if (tiposMultiples.includes(idServicioSeleccionado)) {
        await ListarPaquetes.cargarPaquetesMultiplesGenerico(idServicioSeleccionado, "#slcPaqueteEmpresa");
      } else {
        await ListarPaquetes.cargarPaquetesGenerico(idServicioSeleccionado, "#slcPaqueteEmpresa");
      }
    });
  })();

  /**
   * Verifica si todos los campos requeridos están completos.
   * 
   * @async
   * @function verificarCampos
   * @returns {Promise<boolean>} Retorna `true` si algún campo está vacío, de lo contrario `false`.
   * @description Esta función recorre una lista de campos y verifica si alguno de ellos está vacío.
   * Si encuentra un campo vacío, muestra un mensaje de advertencia y retorna `true`.
   * Si todos los campos están completos, retorna `false`.
   */
  async function verificarCampos() {
    const campos = [
      txtRuc, txtRepresentanteLegal, txtRazonSocial,
      txtNombreComercial, txtTelefono,
      txtDireccion, txtReferencia, txtCoordenadas
    ];

    for (let campo of campos) {
      if (campo.value.trim() === '') {
        showToast("¡Por favor complete todos los campos!", "INFO");
        return true;
      }
    }
    return false;
  }

  /**
   * Registra una nueva empresa en el sistema.
   * 
   * Esta función envía una solicitud POST al servidor para registrar una nueva empresa
   * utilizando los datos proporcionados en los campos de entrada del formulario.
   * 
   * @async
   * @function registrarEmpresa
   * @returns {Promise<void>} No devuelve ningún valor, pero muestra mensajes de éxito o advertencia.
   * 
   * @throws {Error} Si ocurre un error durante la solicitud de registro.
   */
  async function registrarEmpresa() {
    if (accesos?.personas?.crear) {
      const params = new FormData();
      params.append("operacion", "registrarEmpresa");
      params.append("ruc", txtRuc.value);
      params.append("representanteLegal", txtRepresentanteLegal.value);
      params.append("razonSocial", txtRazonSocial.value);
      params.append("nombreComercial", txtNombreComercial.value);
      params.append("telefono", txtTelefono.value);
      params.append("email", txtEmail.value);
      params.append("idUsuario", userid);

      const options = {
        method: "POST",
        body: params,
      };

      const response = await fetch(`${config.HOST}app/controllers/Empresa.controllers.php`, options);
      const data = await response.json();
      if (data.error) {
        showToast(data.error.message, "WARNING");
      }
      else {
        ruc = txtRuc.value;
        await showToast("Empresa registrada correctamente", "SUCCESS", 650);
        await registrarContacto(data[0].id_empresa);
        frmEmpresas.reset();
      }
    }

  }

  /**
   * Registra un nuevo contacto para una empresa.
   *
   * @async
   * @function registrarContacto
   * @param {number} idEmpresa - El ID de la empresa para la cual se registra el contacto.
   * @returns {Promise<void>} - Una promesa que se resuelve cuando el contacto ha sido registrado.
   *
   * @throws {Error} - Lanza un error si la solicitud de registro falla.
   *
   * @description
   * Esta función registra un nuevo contacto para una empresa específica. Si el usuario tiene permisos de creación de personas,
   * se recopilan los datos necesarios y se envían a un controlador para su registro. Si el registro es exitoso, se muestra un mensaje
   * de éxito y se pregunta al usuario si desea registrar un contrato.
   */
  async function registrarContacto(idEmpresa) {
    if (accesos?.personas?.crear) {
      const Paquete = slcPaquetes.value;
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + 14);
      const datos = {
        operacion: "registrarContacto",
        idPersona: '',
        idEmpresa: idEmpresa,
        idPaquete: parseInt(slcPaquetes.value.split((" - ")[0])),
        direccion: txtDireccion.value,
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
        const ruc = txtRuc.value;
        const NombreComercial = txtNombreComercial.value;
        const Servicio = slcTipoServicio.value;
        const Paquete = slcPaquetes.value;
        const direccion = txtDireccion.value;
        const referencia = txtReferencia.value;
        const coordenadas = txtCoordenadas.value;
        await showToast("Empresa registrada correctamente", "SUCCESS", 650);
        setTimeout(async () => {
          frmPersonas.reset();
          if (await ask("¿Desea registrar un contrato?")) {
            window.location.href = `${config.HOST}views/Contratos/?nroDoc=${ruc}&Servicio=${Servicio}&Paquete=${Paquete}&NomComercial=${NombreComercial}&direccion=${direccion}&referencia=${referencia}&coordenadas=${coordenadas}`;
          }
        }, 650);
      }
    }
  }

  /**
   * Obtiene los datos de una empresa a partir de su RUC (Registro Único de Contribuyentes).
   *
   * @async
   * @function ObtenerDataRUC
   * @param {string} ruc - El RUC de la empresa que se desea buscar. Debe tener 11 dígitos.
   * @returns {Promise<void>} No retorna un valor, pero actualiza los campos de texto con la razón social y dirección de la empresa.
   * @throws {Error} Muestra un mensaje de error si la empresa no es encontrada o si ocurre algún problema durante la solicitud.
   */
  async function ObtenerDataRUC(ruc) {
    try {
      if (ruc.length < 11) {
        showToast("¡El RUC debe tener 11 dígitos!", "INFO");
        return;
      } else {
        showLoadingMessage(true);
        const response = await fetch(`${config.HOST}app/controllers/Persona.controllers.php?operacion=obtenerRuc&ruc=${ruc}`);
        const data = await response.json();
        txtRazonSocial.value = data.razonSocial;
        txtDireccion.value = data.direccion;
      }
    } catch (error) {
      showToast("¡Empresa no encontrada, verifique RUC!", "INFO");
    } finally {
      showLoadingMessage(false);
    }
  }

  /**
   * Muestra u oculta el mensaje de carga y deshabilita o habilita los campos del formulario.
   *
   * @param {boolean} show - Indica si se debe mostrar (true) o ocultar (false) el mensaje de carga.
   */
  async function showLoadingMessage(show) {
    txtReferencia.disabled = show;
    txtNombreComercial.disabled = show;
    txtTelefono.disabled = show;
    txtEmail.disabled = show;
    txtRepresentanteLegal.disabled = show;
    btnBuscarEmpresa.disabled = show;
    btnCancelarEmpresa.disabled = show;
    slcTipoServicio.disabled = show;
    slcPaquetes.disabled;
  }

  frmEmpresas.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!await verificarCampos()) {
      await registrarEmpresa();
    }
  });

  btnBuscarEmpresa.addEventListener("click", async function () {
    await ObtenerDataRUC(txtRuc.value);
  });

  document.querySelector("#btnBuscarCoordenadasEmpresa").addEventListener("click", async () => {
    await mapa.iniciarMapa();
  });
});