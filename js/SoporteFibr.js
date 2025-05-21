import config from "../env.js";
import { FichaInstalacion, formatoIPinput, FichaSoporteporDocServCoordenada, CompletarSoporte } from "./Herramientas.js";
import * as mapa from "./Mapa.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idContrato = urlParams.get("idContrato");
  const btnInformacion = document.getElementById('btnInformacion');
  btnInformacion.type = "button";
  const cardContainer = document.getElementById('cardContainer');
  btnInformacion.disabled = true;
  let login = await Herramientas.obtenerLogin();
  let idSector = -1;

  const txtPuertoCambio = document.getElementById("txtPuertoCambio");

  btnInformacion.addEventListener('click', function () {
    if (cardContainer.style.display === 'none' || cardContainer.style.display === '') {
      mostrarCard();
      cardContainer.style.display = 'block';
      this.textContent = 'Ver menos';
    } else {
      cardContainer.style.display = 'none';
      this.textContent = 'Ver más';
    }
  });

  function mostrarCard() {
    const selectedValue = slcEquipo.value;
    let cardContent = '';

    if (selectedValue === 'router') {
      cardContent = `
        <div class="card mt-2">
          <div class="card-body">
            <h5 class="card-title">Parámetros del Router</h5>
            <div class="row">
              <div class="col-6"><strong>SSID:</strong> ${txtSsid.value}</div>
              <div class="col-6"><strong>IP:</strong> ${txtIpRouter.value}</div>
              <div class="col-6"><strong>Usuario:</strong> ${txtUsuarioRouter.value}</div>
              <div class="col-6"><strong>Contraseña:</strong> ${txtContraseniaRouter.value}</div>
              <div class="col-6"><strong>Código de Barra:</strong> ${txtCodigoBarraRouter.value}</div>
              <div class="col-6"><strong>Marca:</strong> ${txtMarcaRouter.value}</div>
              <div class="col-6"><strong>Modelo:</strong> ${txtModeloRouter.value}</div>
              <div class="col-6"><strong>Serie:</strong> ${txtSerieRouter.value}</div>
              <div class="col-6"><strong>Banda:</strong> ${slcBanda.value}</div>
              <div class="col-6"><strong>Número de Antenas:</strong> ${txtAntenas.value}</div>
            </div>
          </div>
        </div>
      `;
    } else if (selectedValue.startsWith('repetidor')) {
      cardContent = `
        <div class="card mt-2">
          <div class="card-body">
            <h5 class="card-title">Parámetros del Repetidor</h5>
            <div class="row">
              <div class="col-6"><strong>SSID:</strong> ${txtSSIDRepetidor.value}</div>
              <div class="col-6"><strong>Contraseña:</strong> ${txtPassRepetidor.value}</div>
              <div class="col-6"><strong>IP:</strong> ${txtIpRepetidor.value}</div>
              <div class="col-6"><strong>Código de Barra:</strong> ${txtCodigoBarraRepetidor.value}</div>
              <div class="col-6"><strong>Marca:</strong> ${txtMarcaRepetidor.value}</div>
              <div class="col-6"><strong>Modelo:</strong> ${txtModeloRepetidor.value}</div>
            </div>
          </div>
        </div>
      `;
    }
    cardContainer.innerHTML = cardContent;
  }

  const form = document.getElementById("frm-registro-fibr");
  const txtPlan = document.getElementById("txtPlan");
  const txtCliente = document.getElementById("txtCliente");
  const txtNrodocumento = document.getElementById("txtNrodocumento");

  const txtPppoe = document.getElementById("txtPppoe");
  const txtPotencia = document.getElementById("txtPotencia");
  const chkCatv = document.getElementById("chkCatv");
  const txtClave = document.getElementById("txtClave");
  const txtVlan = document.getElementById("txtVlan");
  const txtSsid = document.getElementById("txtSsid");
  const txtPass = document.getElementById("txtPass");
  const txtIp = document.getElementById("txtIp");
  const slcRpetidor = document.getElementById("slcRpetidor");
  const routerCambiosContainer = document.getElementById("routerCambiosContainer");
  const repetidorCambiosContainer = document.getElementById("repetidorCambiosContainer");
  const txtaEstadoInicial = document.getElementById("txtaEstadoInicial");
  const slcCaja = document.getElementById("slcCaja");

  const txtIpRouter = document.getElementById("txtIpRouter");
  const txtIpRepetidor = document.getElementById("txtIpRepetidor");

  const txtSSIDRepetidor = document.getElementById("txtSSIDRepetidor");
  const txtPassRepetidor = document.getElementById("txtPassRepetidor");

  const txtCambiosPppoe = document.getElementById("txtCambiosPppoe");
  const txtCambiosClave = document.getElementById("txtCambiosClave");
  const txtCambiosVlan = document.getElementById("txtCambiosVlan");

  const txtCambiosPotencia = document.getElementById("txtCambiosPotencia");
  const txtCambiosSsid = document.getElementById("txtCambiosSsid");
  const txtCambiosIp = document.getElementById("txtCambiosIp");
  const chkCambiosCatv = document.getElementById("chkCambiosCatv");
  const txtCambiosPass = document.getElementById("txtCambiosPass");
  const txtCambiosIpRouter = document.getElementById("txtCambiosIpRouter");
  const txtCambiosIpRepetidor = document.getElementById("txtCambiosIpRepetidor");
  const txtIpRepetidorModal = document.getElementById("txtIpRepetidorModal");

  const txtCambiosPassRepetidor = document.getElementById("txtCambiosPassRepetidor");
  const txtCambiosSsidRepetidor = document.getElementById("txtCambiosSsidRepetidor");

  const solutionTextarea = document.getElementById("txtaCambiosProceSolucion");

  const slcEquipo = document.getElementById("slcEquipo");

  let idSoporte = -1;
  let idCaja = -1;
  let jsonRepetidores = [];
  let numeroRepetidores = 0;

  (async function () {
    idSoporte = await obtenerReferencias();
    if (idSoporte) {
      crearSelectYBoton();
      await cargarDatosdelSoporte();
      await cargarProblema(idSoporte);
      await llamarCajas();
    }
  })();

  function resetCheckbox() {
    if (chkConfirmacion) {
      chkConfirmacion.checked = false;
    }
  }

  slcEquipo.addEventListener('change', async (event) => {
    const invalidFields = document.querySelectorAll('.is-invalid');
    if (invalidFields.length > 0) {
      showToast("Hay campos con errores que deben ser corregidos antes de cambiar de formulario.", "ERROR");
      event.preventDefault();
      slcEquipo.value = slcEquipo.dataset.previousValue;
      invalidFields[0].focus();
      return;
    }

    resetCheckbox();
    const selectedValue = slcEquipo.value;
    if (selectedValue === "router") {
      routerCambiosContainer.style.display = 'block';
      repetidorCambiosContainer.style.display = 'none';
      chkConfirmacion.disabled = false;
      btnInformacion.disabled = false;
    } else if (selectedValue.startsWith("repetidor")) {
      routerCambiosContainer.style.display = 'none';
      repetidorCambiosContainer.style.display = 'block';
      chkConfirmacion.disabled = false;
      btnInformacion.disabled = false;
      await cargarEnInputs();
    } else if (selectedValue === "") {
      routerCambiosContainer.style.display = 'none';
      repetidorCambiosContainer.style.display = 'none';
      chkConfirmacion.disabled = true;
      btnInformacion.disabled = true;
      cardContainer.style.display = 'none';
      btnInformacion.textContent = 'Ver más';
    } else {
      chkConfirmacion.disabled = true;
      btnInformacion.disabled = true;
    }
    slcEquipo.dataset.previousValue = selectedValue;
  });

  if (slcRpetidor) {
    slcRpetidor.addEventListener("change", async () => {
      if (slcRpetidor.value) {
        repetidorCambiosContainer.style.display = 'block';
        txtCambiosSsidRepetidor.disabled = false;
        txtCambiosPassRepetidor.disabled = false;
        txtCambiosIpRepetidor.disabled = false;
        chkConfirmacion.disabled = false;
      } else {
        repetidorCambiosContainer.style.display = 'none';
        txtCambiosSsidRepetidor.disabled = true;
        txtCambiosPassRepetidor.disabled = true;
        txtCambiosIpRepetidor.disabled = true;
        chkConfirmacion.disabled = true;
      }
      await cargarEnInputs();
    });
  } else {
    console.error("slcRpetidor no encontrado");
  }

  const camposValido = document.querySelectorAll('input, select, textarea');
  camposValido.forEach(field => {
    field.addEventListener('input', () => {
      if (field.checkValidity()) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
      } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
      }
    });
  });

  async function completarCamposRouter() {
    const parametrosRouter = {
      txtCambiosPass: txtPass.value,
      txtCambiosPppoe: txtPppoe.value,
      txtCambiosClave: txtClave.value,
      txtCambiosVlan: txtVlan.value,
      txtCambiosPotencia: txtPotencia.value,
      txtCambiosSsid: txtSsid.value,
      txtCambiosIpRouter: txtIpRouter.value,
      txtCambiosUsuarioRouter: txtUsuarioRouter.value,
      txtCambiosContraseniaRouter: txtContraseniaRouter.value,
      txtCambiosCodigoBarraRouter: txtCodigoBarraRouter.value,
      txtCambiosMarcaRouter: txtMarcaRouter.value,
      txtCambiosModeloRouter: txtModeloRouter.value,
      txtCambiosSerieRouter: txtSerieRouter.value,
      slcCambiosBanda: slcBanda.value,
      txtCambiosAntenas: txtAntenas.value
    };

    for (const [id, value] of Object.entries(parametrosRouter)) {
      const input = document.getElementById(id);
      if (input && !input.value) {
        input.value = value;
      }
    }
  }

  async function completarCamposRepetidor() {
    const parametrosRepetidor = {
      txtCambiosSsidRepetidor: txtSSIDRepetidor.value,
      txtCambiosPassRepetidor: txtPassRepetidor.value,
      txtCambiosIpRepetidor: txtIpRepetidor.value,
      txtCambiosCodigoBarraRepetidor: txtCodigoBarraRepetidor.value,
      txtCambiosMarcaRepetidor: txtMarcaRepetidor.value,
      txtCambiosModeloRepetidor: txtModeloRepetidor.value
    };

    for (const [id, value] of Object.entries(parametrosRepetidor)) {
      const input = document.getElementById(id);
      if (input && !input.value) {
        input.value = value;
      }
    }
  }

  async function borrarCamposRouter() {
    const camposRouter = [
      'txtCambiosPotencia',
      'txtCambiosPass',
      'txtCambiosSsid',
      'txtCambiosIpRouter',
      'txtCambiosUsuarioRouter',
      'txtCambiosContraseniaRouter',
      'txtCambiosCodigoBarraRouter',
      'txtCambiosMarcaRouter',
      'txtCambiosModeloRouter',
      'txtCambiosSerieRouter',
      'slcCambiosBanda',
      'txtCambiosAntenas'
    ];

    camposRouter.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.value = '';
      }
    });
  }

  async function borrarCamposRepetidor() {
    const camposRepetidor = [
      'txtCambiosSsidRepetidor',
      'txtCambiosPassRepetidor',
      'txtCambiosIpRepetidor',
      'txtCambiosCodigoBarraRepetidor',
      'txtCambiosMarcaRepetidor',
      'txtCambiosModeloRepetidor'
    ];

    camposRepetidor.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.value = '';
      }
    });
  }

  const fields = [
    { id: 'txtCambiosPotencia', type: 'number', min: -30, max: 40, message: 'Por favor, ingrese un valor válido (-30 a 40).' },
    { id: 'txtCambiosUsuarioRouter', type: 'text', message: 'Este campo es obligatorio.' },
    { id: 'txtCambiosContraseniaRouter', type: 'text', message: 'Este campo es obligatorio.' },
    { id: 'txtCambiosSsid', type: 'text', message: 'Este campo es obligatorio.' },
    { id: 'txtCambiosPass', type: 'text', message: 'Este campo es obligatorio.' },
    { id: 'txtCambiosIpRouter', type: 'ip', message: 'Por favor, ingrese una IP válida con al menos 3 puntos.' },
    { id: 'txtCambiosCodigoBarraRouter', type: 'text', message: 'Este campo es obligatorio.' },
    { id: 'slcCambiosBanda', type: 'select', message: 'Por favor, seleccione una opción válida.' },
    { id: 'txtCambiosAntenas', type: 'number', min: 2, max: 10, message: 'Por favor, ingrese un valor válido (2 a 10).' },
    { id: 'txtCambiosSerieRouter', type: 'text', message: 'Este campo es obligatorio.' },
    { id: 'txtCambiosSsidRepetidor', type: 'text', message: 'Este campo es obligatorio.' },
    { id: 'txtCambiosPassRepetidor', type: 'text', message: 'Este campo es obligatorio.' },
    { id: 'txtCambiosIpRepetidor', type: 'ip', message: 'Por favor, ingrese una IP válida con al menos 3 puntos.' },
    { id: 'txtCambiosCodigoBarraRepetidor', type: 'text', message: 'Este campo es obligatorio.' }
  ];

  fields.forEach(field => {
    const input = document.getElementById(field.id);
    input.addEventListener('input', () => validateField(input, field));
  });

  function validateField(input, field) {
    let valid = true;
    if (field.type === 'number') {
      const value = parseInt(input.value, 10);
      valid = value >= field.min && value <= field.max;
    } else if (field.type === 'ip') {
      const ipParts = input.value.split('.');
      valid = ipParts.length >= 4;
    } else if (field.type === 'select') {
      valid = input.value.trim() !== '';
    } else {
      valid = input.value.trim() !== '';
    }

    const grupoFormulario = input.closest('.form-floating');
    const mensajeError = grupoFormulario?.querySelector('.invalid-feedback');

    if (valid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (mensajeError) {
        mensajeError.style.display = 'none';
      }
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      if (mensajeError) {
        mensajeError.style.display = 'block';
        mensajeError.textContent = field.message;
      }
    }
  }

  async function llamarCajas() {
    let cajas = [];

    if (!idCaja || idCaja == 0 || idCaja == -1) {
      cajas = await mapa.buscarCajasporSector(idSector);
    } else {
      cajas = await mapa.buscarCercanos(idCaja);
    }

    const slcCaja = document.getElementById('slcCaja');
    slcCaja.innerHTML = '';

    if (idCaja !== undefined) {
      const cajaActual = cajas.find(caja => caja.id_caja === idCaja);
      if (cajaActual) {
        const option = document.createElement('option');
        option.value = idCaja;
        option.text = cajaActual.nombre;
        slcCaja.appendChild(option);
        slcCaja.value = idCaja;
      }
    }

    cajas.forEach(caja => {
      if (caja.id_caja !== idCaja) {
        const option = document.createElement('option');
        option.value = caja.id_caja;
        option.text = caja.nombre;
        slcCaja.appendChild(option);
      }
    });
  }

  async function cargarDatosdelSoporte() {
    const urlParams = new URLSearchParams(window.location.search);
    const doc = urlParams.get("doc");
    const tiposervicio = urlParams.get("tiposervicio");
    
    let coordenada = urlParams.get("coordenada");
    if (coordenada === null || coordenada === 'null' || coordenada.trim() === '') {
      coordenada = null;
    }
    
    const respuesta = await FichaSoporteporDocServCoordenada(doc, tiposervicio, coordenada);

    try {
      const soporte = JSON.parse(respuesta[0].soporte);

      if (soporte && soporte.fibr) {
        await cargarSoporteAnterior(soporte, doc, idSoporte);
      } else {
        await CargarDatosInstalacion(doc, idSoporte);
      }

      if (idCaja === undefined) {
        console.error("Error: idCaja es undefined");
      }

      mostrarRepetidoresEnModal();
    } catch (error) {
      console.error("Error al parsear la respuesta del soporte:", error);
    }
  }

  async function cargarProblema(idSoporte) {
    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
      const data = await respuesta.json();
      txtaEstadoInicial.value = (data[0].descripcion_problema);

    } catch (error) {
      console.error("Error al cargar el problema:", error);
    }
  }

  async function cargarSoporteAnterior(data, doct, idsoporte) {
    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${doct}`);
      const data = await respuesta.json();
      txtCliente.value = data[0].nombre;
      txtNrodocumento.value = doct;
    } catch (error) {
      console.error("Error en CargarDatosInstalacion:", error);
    }

    const fibr = data.fibr;
    console.log(data);

    const dataFibra = await FichaInstalacion(idSoporte);
    const fichaInstalacion = JSON.parse(dataFibra[0].ficha_instalacion);

    const response = await fetch(
      `${config.HOST}app/controllers/Paquete.controllers.php?operacion=buscarPaqueteId&idPaquete=${dataFibra[0].id_paquete}`
    );
    const paquete = await response.json();

    txtPlan.value = paquete[0].paquete;
    idSector = dataFibra[0].id_sector;

    txtPppoe.value = fibr.cambiosgpon.pppoe;
    txtClave.value = fibr.cambiosgpon.clave;
    txtPotencia.value = fibr.cambiosgpon.potencia;
    chkCatv.checked = fibr.cambiosgpon.catv;
    txtVlan.value = data.vlan;

    txtPuertoCambio.value = fibr.puerto;

    txtCambiosPppoe.value = fibr.cambiosgpon.pppoe;
    txtCambiosClave.value = fibr.cambiosgpon.clave;
    txtCambiosVlan.value = data.vlan;

    idCaja = data.idcaja;

    if (idCaja === undefined) {
      console.error("Error: idCaja es undefined");
      return;
    }

    slcEquipo.innerHTML = '<option value="" disabled selected>Seleccione una opción</option>';
    const optionNingunProducto = document.createElement('option');
    optionNingunProducto.value = '';
    optionNingunProducto.text = 'Restablecer Selección';
    slcEquipo.appendChild(optionNingunProducto);

    const optionRouter = document.createElement('option');
    optionRouter.value = 'router';
    optionRouter.text = `Router (${fibr.cambiosgpon.router.ip})`;
    slcEquipo.appendChild(optionRouter);

    if (Array.isArray(fibr.cambiosgpon.repetidores) && fibr.cambiosgpon.repetidores.length > 0) {
      jsonRepetidores = fibr.cambiosgpon.repetidores;
      fibr.cambiosgpon.repetidores.forEach(repetidor => {
        const option = document.createElement('option');
        option.value = `repetidor-${repetidor.numero}`;
        option.text = `${repetidor.ssid} (${repetidor.ip})`;
        slcEquipo.appendChild(option);
      });
    }

    await cargarDatosRouter(fibr.cambiosgpon);
  }

  function mostrarRepetidoresEnModal() {
    const modalBody = document.getElementById('mdlRepetidorBody');
    const tarjetasDinamicas = modalBody.querySelectorAll('.card');
    tarjetasDinamicas.forEach(tarjeta => tarjeta.remove());

    jsonRepetidores.forEach(repetidor => {
      const card = document.createElement('div');
      card.className = 'card mt-2';
      card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title"><i class="fa-solid fa-desktop" style="color: #0459ad;"></i> ${repetidor.ssid}</h5>
        <br>
        <div class="row">
          <div class="col-12 mb-2">
            <p class="card-text" style="color: gray;">
              Código de Barra:
              <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                ${repetidor.codigobarrarepetidor}
              </span>
            </p>
          </div>
          <div class="col-6 mb-2">
            <p class="card-text" style="color: gray;">
              Marca:
              <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
              ${repetidor.marca}
              </span>
            </p>
          </div>
          <div class="col-6 mb-2">
            <p class="card-text" style="color: gray;">
              Modelo:
              <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
              ${repetidor.modelo}
              </span>
            </p>
          </div>
          <div class="col-6 mb-2">
            <p class="card-text" style="color: gray;">
              Serie:
              <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                ${repetidor.serie}
              </span>
            </p>
          </div>
          <div class="col-6 mb-2">
            <p class="card-text" style="color: gray;">
              Precio:
              <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                ${repetidor.precio}
              </span>
            </p>
          </div>
          <div class="col-6 mb-2">
            <p class="card-text" style="color: gray;">
              IP:
              <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                ${repetidor.ip}
              </span>
            </p>
          </div>
          <div class="col-6 mb-2">
            <p class="card-text" style="color: gray;">
              Condición:
              <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                ${repetidor.condicion}
              </span>
            </p>
          </div>
        </div>
        <button class="btn btn-danger btn-sm mt-2 btnEliminar">
          <i class="fas fa-times"></i> Eliminar
        </button>
      </div>
    `;

      modalBody.appendChild(card);
      card.querySelector(".btnEliminar").addEventListener("click", function () {
        card.remove();
        jsonRepetidores = jsonRepetidores.filter(rep => rep.numero !== repetidor.numero);
      });
    });
  }

  function crearSelectYBoton() {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row g-2 mb-2 mt-2";

    const buttonDiv = document.createElement("div");
    buttonDiv.className = "col-md d-flex justify-content-start align-items-end";

    const guardarBtn = document.createElement("button");
    guardarBtn.id = "btnGuardarFicha";
    guardarBtn.className = "btn btn-success me-2";
    guardarBtn.type = "submit";
    guardarBtn.textContent = "Guardar Ficha";

    const cancelarBtn = document.createElement("button");
    cancelarBtn.id = "btnCancelarFicha";
    cancelarBtn.className = "btn btn-secondary me-2";
    cancelarBtn.type = "button";
    cancelarBtn.textContent = "Cancelar";
    cancelarBtn.addEventListener("click", () => {
      window.location.href = `${config.HOST}views/Soporte/listarSoporte`;
    });

    const checkboxDiv = document.createElement("div");
    checkboxDiv.className = "form-check d-flex align-items-center ms-3";

    const chkConfirmacion = document.createElement("input");
    chkConfirmacion.type = "checkbox";
    chkConfirmacion.id = "chkConfirmacion";
    chkConfirmacion.className = "form-check-input me-2";

    const chkLabel = document.createElement("label");
    chkLabel.htmlFor = "chkConfirmacion";
    chkLabel.className = "form-check-label";
    chkLabel.textContent = "Rellenar Campos";

    checkboxDiv.appendChild(chkConfirmacion);
    checkboxDiv.appendChild(chkLabel);

    buttonDiv.appendChild(guardarBtn);
    buttonDiv.appendChild(cancelarBtn);
    buttonDiv.appendChild(checkboxDiv);
    rowDiv.appendChild(buttonDiv);

    solutionTextarea.parentNode.parentNode.appendChild(rowDiv);

    chkConfirmacion.disabled = true;
    chkConfirmacion.addEventListener("change", async () => {
      const routerVisible = routerCambiosContainer.style.display === 'block';
      const repetidorVisible = repetidorCambiosContainer.style.display === 'block';

      if (chkConfirmacion.checked) {
        if (routerVisible) {
          await completarCamposRouter();
        } else if (repetidorVisible) {
          await completarCamposRepetidor();
        }
        showToast("Campos completados y validados.", "SUCCESS");
      } else {
        if (routerVisible) {
          await borrarCamposRouter();
        } else if (repetidorVisible) {
          await borrarCamposRepetidor();
        }
        showToast("Campos vaciados.", "INFO");
      }
    });
  }

  async function obtenerReferencias() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("idsoporte");
  };

  async function CargarDatosInstalacion(doct, idSoporte) {
    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${doct}`);
      const data = await respuesta.json();
      txtCliente.value = data[0].nombre;
      txtNrodocumento.value = doct;
    } catch (error) {
      console.error("Error en CargarDatosInstalacion:", error);
    }

    try {
      const dataFibra = await FichaInstalacion(idSoporte);
      const fichaInstalacion = JSON.parse(dataFibra[0].ficha_instalacion);
      const fibraFiltrado = fichaInstalacion.fibraoptica;
      txtPuertoCambio.value = fichaInstalacion.puerto;

      const response = await fetch(
        `${config.HOST}app/controllers/Paquete.controllers.php?operacion=buscarPaqueteId&idPaquete=${dataFibra[0].id_paquete}`
      );
      const paquete = await response.json();

      txtPlan.value = paquete[0].paquete;
      idSector = dataFibra[0].id_sector;
      txtPppoe.value = fibraFiltrado.usuario;
      txtClave.value = fibraFiltrado.claveacceso;
      txtCambiosPppoe.value = fibraFiltrado.usuario;
      txtCambiosClave.value = fibraFiltrado.claveacceso;
      txtCambiosVlan.value = fichaInstalacion.vlan;
      txtPotencia.value = fibraFiltrado.potencia;
      chkCatv.checked = fibraFiltrado.router.catv;
      txtVlan.value = fibraFiltrado.vlan;
      idCaja = fichaInstalacion.idcaja;

      slcEquipo.innerHTML = '<option value="" disabled selected>Seleccione una opción</option>';

      const optionNingunProducto = document.createElement('option');
      optionNingunProducto.value = '';
      optionNingunProducto.text = 'Restablecer Selección';
      slcEquipo.appendChild(optionNingunProducto);

      if (fibraFiltrado.router) {
        const optionRouter = document.createElement('option');
        optionRouter.value = 'router';
        optionRouter.text = `Router (${fibraFiltrado.router.ip})`;
        slcEquipo.appendChild(optionRouter);
      } else {
        console.error("Datos del router no encontrados en fibraFiltrado");
      }

      const repetidorContainers = $('.repetidor-container');
      if (Array.isArray(fibraFiltrado.repetidores) && fibraFiltrado.repetidores.length > 0) {
        repetidorContainers.show();
        jsonRepetidores = fibraFiltrado.repetidores;
        fibraFiltrado.repetidores.forEach(repetidor => {
          const option = document.createElement('option');
          option.value = `repetidor-${repetidor.numero}`;
          option.text = `${repetidor.ssid} (${repetidor.ip})`;
          slcEquipo.appendChild(option);
        });
        await cargarRepetidores(fibraFiltrado.repetidores);
        mostrarRepetidoresEnModal();
      } else {
        repetidorContainers.hide();
      }

      await cargarDatosRouter(fibraFiltrado);
    } catch (error) {
      console.error("Error en data de Fibra:", error);
    }
  }

  async function cargarRepetidores(repetidorJson) {
    const slcRpetidor = document.getElementById('slcRpetidor');
    const txtCambiosSsidRepetidor = document.getElementById('txtCambiosSsidRepetidor');
    const txtCambiosPassRepetidor = document.getElementById('txtCambiosPassRepetidor');
    const txtCambiosIpRepetidor = document.getElementById('txtCambiosIpRepetidor');
    const txtCodigoBarraRepetidor = document.getElementById('txtCodigoBarrasRepetidor');
    const txtMarcaRepetidor = document.getElementById('txtMarcaRepetidor');
    const txtModeloRepetidor = document.getElementById('txtModeloRepetidor');
    const repetidorContainers = $('.repetidor-container');

    slcRpetidor.innerHTML = '';

    if (Array.isArray(repetidorJson) && repetidorJson.length > 0) {
      repetidorContainers.show();
      slcRpetidor.innerHTML = '<option value="" disabled selected>Seleccione una opción</option>';
      repetidorJson.forEach(repetidor => {
        const option = document.createElement('option');
        option.value = repetidor.numero;
        option.text = `${repetidor.ssid} (${repetidor.ip})`;
        slcRpetidor.appendChild(option);
      });

      slcRpetidor.disabled = false;
      txtCambiosSsidRepetidor.disabled = false;
      txtCambiosPassRepetidor.disabled = false;
      txtCambiosIpRepetidor.disabled = false;
      txtCodigoBarraRepetidor.disabled = false;
      txtMarcaRepetidor.disabled = false;
      txtModeloRepetidor.disabled = false;
    } else {
      repetidorContainers.hide();
      slcRpetidor.disabled = true;
      txtCambiosSsidRepetidor.disabled = true;
      txtCambiosPassRepetidor.disabled = true;
      txtCambiosIpRepetidor.disabled = true;
      txtCodigoBarraRepetidor.disabled = true;
      txtMarcaRepetidor.disabled = true;
      txtModeloRepetidor.disabled = true;
    }
  }

  slcRpetidor.addEventListener("change", async () => {
    await cargarEnInputs();
  });

  async function cargarEnInputs() {
    try {
      const selectedValue = slcEquipo.value;
      const coordenada = urlParams.get("coordenada");
      const Tiposervicios = urlParams.get("tiposervicio").toLocaleLowerCase();
      const respuesta = await FichaInstalacion(idSoporte);
      const respuesta2 = await FichaSoporteporDocServCoordenada(txtNrodocumento.value, Tiposervicios, coordenada);

      let fibraFiltrado = null;
      let datosgenerales = null;
      if (!respuesta2[0]?.soporte || respuesta2[0]?.soporte === "{}" || !JSON.parse(respuesta2[0].soporte)?.fibr) {
        const fichaInstalacion = JSON.parse(respuesta[0]?.ficha_instalacion || "{}");

        fibraFiltrado = fichaInstalacion?.fibraoptica?.repetidores || null;
        datosgenerales = fichaInstalacion?.fibraoptica || null;
      } else {
        const soporte = JSON.parse(respuesta2[0]?.soporte || "{}");
        fibraFiltrado = soporte?.fibr?.cambiosgpon?.repetidores || null;
        datosgenerales = soporte?.fibr?.cambiosgpon || null;
      }

      if (selectedValue === 'router') {
        await cargarDatosRouter(datosgenerales);
      } else if (selectedValue.startsWith('repetidor')) {
        const repetidorNumero = parseInt(selectedValue.split('-')[1]);
        const repetidorSeleccionado = fibraFiltrado.find(
          (repetidor) => repetidor.numero === repetidorNumero
        );

        if (repetidorSeleccionado) {
          txtIpRepetidor.value = repetidorSeleccionado.ip || "";
          txtSSIDRepetidor.value = repetidorSeleccionado.ssid || "";
          txtPassRepetidor.value = repetidorSeleccionado.contrasenia || "";
          txtCodigoBarraRepetidor.value = repetidorSeleccionado.codigobarrarepetidor || "";
          txtMarcaRepetidor.value = repetidorSeleccionado.marca || "";
          txtModeloRepetidor.value = repetidorSeleccionado.modelo || "";
        } else {
          console.warn("No se encontró un repetidor con el valor seleccionado.");
        }
      }
    } catch (error) {
      console.error("Error al cargar datos del repetidor o router:", error);
    }
  }

  async function cargarDatosRouter(datoRouters) {
    txtIpRouter.value = datoRouters.router.ip || "";
    txtSsid.value = datoRouters.router.ssid || "";
    txtPass.value = datoRouters.router.seguridad || "";
    txtUsuarioRouter.value = datoRouters.router.ingresouserrouter || "";
    txtContraseniaRouter.value = datoRouters.router.ingresopass || "";
    txtCodigoBarraRouter.value = datoRouters.router.codigobarra || "";
    txtMarcaRouter.value = datoRouters.router.marca || "";
    txtModeloRouter.value = datoRouters.router.modelo || "";
    txtSerieRouter.value = datoRouters.router.serie || "";
    slcBanda.value = datoRouters.router.banda || "";
    txtAntenas.value = datoRouters.router.numeroantena || "";
  }

  function obtenerRutaSoporte(idSoporte) {
    return `${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`;
  }

  async function armadoJsonFibra() {
    const urlParams = new URLSearchParams(window.location.search);
    const doc = urlParams.get("doc");
    const tipoServicio = urlParams.get("tiposervicio");
    const coordenada = urlParams.get("coordenada");

    const respuesta = await FichaSoporteporDocServCoordenada(doc, tipoServicio, coordenada);
    const soporteAnterior = respuesta[0]?.soporte ? JSON.parse(respuesta[0].soporte) : null;
    const idSoporteAnterior = respuesta[0]?.idSoporte;

    const rutaSoporte = obtenerRutaSoporte(idSoporteAnterior);
    const response = await fetch(rutaSoporte);
    const result = await response.json();

    const dataFibra = await FichaInstalacion(idSoporte);
    const fibrafiltrado = JSON.parse(dataFibra[0].ficha_instalacion).fibraoptica;
    const soporte = result[0]?.soporte ? JSON.parse(result[0].soporte) : {};
    const nuevoSoporte = { ...soporte };
    const yaTieneSoporte = soporteAnterior && soporteAnterior.fibr && Object.keys(soporteAnterior.fibr).length > 0;

    const repetidoresActualizados = await moficadoRepetidor(fibrafiltrado.repetidores || []);

    const nuevosRepetidoresFiltrados = jsonRepetidores.filter(nuevoRepetidor =>
      !repetidoresActualizados.some(repetidorActualizado => repetidorActualizado.numero === nuevoRepetidor.numero)
    );

    const repetidoresCombinados = [...repetidoresActualizados, ...nuevosRepetidoresFiltrados];

    const fibraData = {
      parametrosgpon: {
        pppoe: txtPppoe.value,
        clave: txtClave.value,
        potencia: yaTieneSoporte ? (document.getElementById("txtPotencia").value || soporteAnterior.fibr?.cambiosgpon?.potencia) : fibrafiltrado.potencia,
        router: yaTieneSoporte ? (soporteAnterior.fibr?.cambiosgpon?.router || JSON.parse(JSON.stringify(fibrafiltrado.router))) : JSON.parse(JSON.stringify(fibrafiltrado.router)),
        catv: yaTieneSoporte ? (soporteAnterior.fibr?.cambiosgpon?.catv || document.getElementById("chkCatv").checked) : fibrafiltrado.router.catv,
        repetidores: yaTieneSoporte ? (soporteAnterior.fibr?.cambiosgpon?.repetidores || JSON.parse(JSON.stringify(fibrafiltrado.repetidores))) : JSON.parse(JSON.stringify(fibrafiltrado.repetidores)),
      },
      cambiosgpon: {
        pppoe: txtCambiosPppoe.value,
        clave: txtCambiosClave.value,
        potencia: txtCambiosPotencia.value || soporteAnterior.fibr?.cambiosgpon?.potencia,
        router: await modificadoRouter(fibrafiltrado.router) || soporteAnterior.fibr?.cambiosgpon?.router,
        catv: chkCambiosCatv.checked || soporteAnterior.fibr?.cambiosgpon?.catv,
        repetidores: repetidoresCombinados,
      }
    };

    nuevoSoporte.fibr = fibraData;
    nuevoSoporte.idcaja = idCaja;
    nuevoSoporte.vlan = txtCambiosVlan.value;
    nuevoSoporte.tipoentrada = JSON.parse(dataFibra[0].ficha_instalacion).tipoentrada;
    nuevoSoporte.periodo = JSON.parse(dataFibra[0].ficha_instalacion).periodo || 0;
    nuevoSoporte.puerto = parseInt(txtPuertoCambio.value) || 0;

    return nuevoSoporte;
  }

  slcCaja.addEventListener("change", async () => {
    idCaja = slcCaja.value;
    console.log("ID Caja:", idCaja);
  });

  async function moficadoRepetidor() {
    if (!jsonRepetidores) {
      return null;
    }

    return jsonRepetidores.map(repetidor => {
      repetidor.ssid = txtCambiosSsidRepetidor.value || repetidor.ssid;
      repetidor.contrasenia = txtCambiosPassRepetidor.value || repetidor.contrasenia;
      repetidor.ip = txtCambiosIpRepetidor.value || repetidor.ip;
      repetidor.codigobarrarepetidor = txtCambiosCodigoBarraRepetidor.value || repetidor.codigobarrarepetidor;
      repetidor.marca = txtCambiosMarcaRepetidor.value || repetidor.marca;
      repetidor.modelo = txtCambiosModeloRepetidor.value || repetidor.modelo;
      return repetidor;
    });
  }

  async function modificadoRouter(router) {
    router.ssid = txtCambiosSsid.value || router.ssid;
    router.seguridad = txtCambiosPass.value || router.seguridad;
    router.ip = txtCambiosIpRouter.value || router.ip;
    router.ingresouserrouter = txtCambiosUsuarioRouter.value || router.usuario;
    router.ingresopass = txtCambiosContraseniaRouter.value || router.ingresopass;
    router.codigobarra = txtCambiosCodigoBarraRouter.value || router.codigobarra;
    router.marca = txtCambiosMarcaRouter.value || router.marca;
    router.modelo = txtCambiosModeloRouter.value || router.modelo;
    router.serie = txtCambiosSerieRouter.value || router.serie;
    router.banda = slcCambiosBanda.value || router.banda;
    router.numeroantena = txtCambiosAntenas.value || router.numeroantena;
    router.catv = chkCambiosCatv.checked || router.catv;
    return router;
  }

  async function verificarServicioEnSoporte(idSoporte, JSONsoporte) {
    const ServiciosTotales = await FichaInstalacion(idSoporte);
    const tiposServicio = (ServiciosTotales[0].tipos_servicio).toLowerCase().split(",");


    const todosValidos = tiposServicio.every(servicio =>
      JSONsoporte?.[servicio] && Object.keys(JSONsoporte[servicio]).length > 0
    );

    if (todosValidos) {
      await CompletarSoporte(idSoporte);
    }
  }

  async function guardarSoporte(data) {
    try {

      const soporteData = typeof data === "string" ? JSON.parse(data) : data;

      const response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operacion: 'actualizarSoporte',
          data: {
            idSoporte: idSoporte,
            idTecnico: login.idUsuario,
            soporte: soporteData,
            idUserUpdate: login.idUsuario,
            descripcion_solucion: solutionTextarea.value,
          },
        }),
      });

      const result = await response.json();

      await verificarServicioEnSoporte(idSoporte, data);
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const routerVisible = routerCambiosContainer.style.display === 'block';
    const repetidorVisible = repetidorCambiosContainer.style.display === 'block';

    if ((routerVisible || repetidorVisible) && !chkConfirmacion.checked) {
      showToast("Debe marcar el checkbox de confirmación para guardar la ficha.", "WARNING");
      return;
    }

    const invalidFields = document.querySelectorAll('.is-invalid');
    if (invalidFields.length > 0) {
      showToast("Hay campos con errores que deben ser corregidos antes de guardar la ficha.", "ERROR");
      invalidFields[0].focus();
      return;
    }

    const data = await armadoJsonFibra();
    if (await ask("¿Desea guardar la ficha?")) {
      await guardarSoporte(data);
      window.location.href = `${config.HOST}views/Soporte/listarSoporte`;
    }
  });

  [txtIpRouter, txtIpRepetidorModal, txtIpRepetidor, txtCambiosIpRouter, txtCambiosIpRepetidor].forEach(element => {
    element.addEventListener("input", (event) => {
      formatoIPinput(event);
    });
  });

  document.getElementById('txtCodigoBarrasRepetidorModal').addEventListener('input', async function () {
    const codigoBarra = this.value.trim();

    if (codigoBarra === "") {
      return;
    }

    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoBarra&codigoBarra=${encodeURIComponent(codigoBarra)}`);
      const resultado = await respuesta.json();

      if (Array.isArray(resultado) && resultado.length > 0) {
        const producto = resultado[0];
        if (producto?.marca && producto?.modelo) {
          document.getElementById('txtMarcaRepetidorModal').value = producto.marca;
          document.getElementById('txtModeloRepetidorModal').value = producto.modelo;
          document.getElementById('txtPrecioRepetidorModal').value = producto.precio_actual;
          showToast(`Producto encontrado: ${producto.marca} - ${producto.modelo}`, "SUCCESS");
        } else {
          showToast("Producto no encontrado o datos incompletos.", "INFO");
        }
      } else {
        showToast("Producto no encontrado", "INFO");
      }
    } catch (error) {
      console.error('Error:', error);
      showToast("Hubo un error al buscar el producto.", "ERROR");
    }
  });

  document.getElementById('txtCambiosCodigoBarraRepetidor').addEventListener('input', async function () {
    const codigoBarra = this.value.trim();

    if (codigoBarra === "") {
      return;
    }

    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoBarra&codigoBarra=${encodeURIComponent(codigoBarra)}`);
      const resultado = await respuesta.json();

      if (Array.isArray(resultado) && resultado.length > 0) {
        const producto = resultado[0];
        if (producto?.marca && producto?.modelo) {
          document.getElementById('txtCambiosMarcaRepetidor').value = producto.marca;
          document.getElementById('txtCambiosModeloRepetidor').value = producto.modelo;
          showToast(`Producto encontrado: ${producto.marca} - ${producto.modelo}`, "SUCCESS");
        } else {
          showToast("Producto no encontrado o datos incompletos.", "INFO");
        }
      } else {
        showToast("Producto no encontrado", "INFO");
      }
    } catch (error) {
      console.error('Error:', error);
      showToast("Hubo un error al buscar el producto.", "ERROR");
    }
  });

  document.getElementById('txtCambiosCodigoBarraRouter').addEventListener('input', async function () {
    const codigoBarra = this.value.trim();

    if (codigoBarra === "") {
      return;
    }

    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoBarra&codigoBarra=${encodeURIComponent(codigoBarra)}`);
      const resultado = await respuesta.json();

      if (Array.isArray(resultado) && resultado.length > 0) {
        const producto = resultado[0];
        if (producto?.marca && producto?.modelo) {
          document.getElementById('txtCambiosMarcaRouter').value = producto.marca;
          document.getElementById('txtCambiosModeloRouter').value = producto.modelo;
          showToast(`Producto encontrado: ${producto.marca} - ${producto.modelo}`, "SUCCESS");
        } else {
          showToast("Producto no encontrado o datos incompletos.", "INFO");
        }
      } else {
        showToast("Producto no encontrado", "INFO");
      }
    } catch (error) {
      console.error('Error:', error);
      showToast("Hubo un error al buscar el producto.", "ERROR");
    }
  });

  async function AgregarRepetidor() {
    const ssid = document.getElementById('txtSsidRepetidorModal')?.value;
    const contrasenia = document.getElementById('txtContraseniaRepetidorModal')?.value;
    const serie = document.getElementById('txtSerieRepetidorModal')?.value;
    const ip = document.getElementById('txtIpRepetidorModal')?.value;
    const condicion = document.getElementById('slcCondicionRepetidor')?.value;
    const codigoBarra = document.getElementById('txtCodigoBarrasRepetidorModal')?.value;
    const marca = document.getElementById('txtMarcaRepetidorModal')?.value;
    const modelo = document.getElementById('txtModeloRepetidorModal')?.value;
    const precio = document.getElementById('txtPrecioRepetidorModal')?.value;

    if (!ssid || !contrasenia || !codigoBarra || !marca || !modelo || !serie || !ip) {
      showToast("Por favor, complete todos los campos del repetidor.", "WARNING");
      return;
    }

    const repetidorExistente = jsonRepetidores.find(rep => rep.codigobarrarepetidor === codigoBarra);

    if (repetidorExistente) {
      showToast("El repetidor con este código de barras ya existe.", "WARNING");
      return;
    }

    const repetidoresExistentes = jsonRepetidores.map(rep => rep.numero);
    const maxNumero = Math.max(0, ...repetidoresExistentes);
    const numeroRepetidores = maxNumero + 1;

    const repetidor = {
      numero: numeroRepetidores,
      ssid: ssid,
      contrasenia: contrasenia,
      codigobarrarepetidor: codigoBarra,
      marca: marca,
      modelo: modelo,
      precio: precio,
      serie: serie,
      ip: ip,
      condicion: condicion
    };

    jsonRepetidores.push(repetidor);

    mostrarRepetidoresEnModal();

    document.getElementById('txtSsidRepetidorModal').value = '';
    document.getElementById('txtContraseniaRepetidorModal').value = '';
    document.getElementById('txtSerieRepetidorModal').value = '';
    document.getElementById('txtIpRepetidorModal').value = '';
    document.getElementById('slcCondicionRepetidor').value = 'venta';
    document.getElementById('txtCodigoBarrasRepetidorModal').value = '';
    document.getElementById('txtMarcaRepetidorModal').value = '';
    document.getElementById('txtModeloRepetidorModal').value = '';
    document.getElementById('txtPrecioRepetidorModal').value = '';
  }

  function mostrarRepetidoresEnModal() {
    const modalBody = document.getElementById('mdlRepetidorBody');
    const tarjetasDinamicas = modalBody.querySelectorAll('.card');
    tarjetasDinamicas.forEach(tarjeta => tarjeta.remove());

    jsonRepetidores.forEach(repetidor => {
      const card = document.createElement('div');
      card.className = 'card mt-2';
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title"><i class="fa-solid fa-desktop" style="color: #0459ad;"></i> ${repetidor.ssid}</h5>
          <br>
          <div class="row">
            <div class="col-12 mb-2">
              <p class="card-text" style="color: gray;">
                Código de Barra:
                <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                  ${repetidor.codigobarrarepetidor}
                </span>
              </p>
            </div>
            <div class="col-6 mb-2">
              <p class="card-text" style="color: gray;">
                Marca:
                <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                ${repetidor.marca}
                </span>
              </p>
            </div>
            <div class="col-6 mb-2">
              <p class="card-text" style="color: gray;">
                Modelo:
                <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                ${repetidor.modelo}
                </span>
              </p>
            </div>
            <div class="col-6 mb-2">
              <p class="card-text" style="color: gray;">
                Serie:
                <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                  ${repetidor.serie}
                </span>
              </p>
            </div>
            <div class="col-6 mb-2">
              <p class="card-text" style="color: gray;">
                Precio:
                <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                  ${repetidor.precio}
                </span>
              </p>
            </div>
            <div class="col-6 mb-2">
              <p class="card-text" style="color: gray;">
                IP:
                <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                  ${repetidor.ip}
                </span>
              </p>
            </div>
            <div class="col-6 mb-2">
              <p class="card-text" style="color: gray;">
                Condición:
                <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                  ${repetidor.condicion}
                </span>
              </p>
            </div>
          </div>
          <button class="btn btn-danger btn-sm mt-2 btnEliminar">
            <i class="fas fa-times"></i> Eliminar
          </button>
        </div>
      `;

      modalBody.appendChild(card);
      card.querySelector(".btnEliminar").addEventListener("click", function () {
        card.remove();
        jsonRepetidores = jsonRepetidores.filter(rep => rep.numero !== repetidor.numero);
      });
    });
  }

  document.getElementById('btnAñadirRepetidor').addEventListener('click', async function () {
    await AgregarRepetidor();
  });

  cargarDatosdelSoporte();
});
