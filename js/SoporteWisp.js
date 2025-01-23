import config from "../env.js";
import { FichaInstalacion, FichaSoporteporDocServCoordenada, formatoIPinput, validarValorRango, CompletarSoporte } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("frmRegistroWisp");
  const urlParams = new URLSearchParams(window.location.search);
  const serv = urlParams.get("tiposervicio");

  const txtNrodocumento = document.getElementById("txtNrodocumento");
  const txtCliente = document.getElementById("txtCliente");
  const txtPlan = document.getElementById("txtPlan");

  const slcWireless = document.getElementById("slcWireless");
  const txtBase = document.getElementById("txtBase");
  const txtIp = document.getElementById("txtIp");
  const txtSenial = document.getElementById("txtSenial");

  const txtRouterSsid = document.getElementById("txtRouterSsid");
  const txtRouterSeguridad = document.getElementById("txtRouterSeguridad");
  const txtRouterpuertaEnlace = document.getElementById("txtRouterpuertaEnlace");
  const txtRouterWan = document.getElementById("txtRouterWan");
  const txtAcceso = document.getElementById("txtAcceso");

  const txtBaseNuevo = document.getElementById("txtBaseNuevo");
  const txtIpNuevo = document.getElementById("txtIpNuevo");
  const txtSenialNuevo = document.getElementById("txtSenialNuevo");

  const txtAccesoNuevo = document.getElementById("txtAccesoNuevo");
  const txtRouterCambioSsid = document.getElementById("txtRouterCambioSsid");
  const txtRouterCambioSeguridad = document.getElementById("txtRouterCambioSeguridad");
  const txtRouterCambiopuertaEnlace = document.getElementById("txtRouterCambiopuertaEnlace");
  const txtRouterCambioWan = document.getElementById("txtRouterCambioWan");

  const formularioCambiosRouter = document.getElementById("formularioCambiosRouter");
  const formularioCambiosRepetidor = document.getElementById("formularioCambiosRepetidor");
  const formularioCambiosAntena = document.getElementById("formularioCambiosAntena");

  const solutionTextarea = document.getElementById("txtaProceSolucion");
  const txtaEstadoInicial = document.getElementById("txtaEstadoInicial");

  const cardParametros = document.getElementById("cardParametros");
  const cardParametrosRepetidor = document.getElementById("cardParametrosRepetidor");
  const cardParametrosAntena = document.getElementById("cardParametrosAntena");

  const btnVerMas = document.getElementById("btnInformacion");
  btnVerMas.type = "button";

  const chkConfirmacion = document.getElementById("chkConfirmacion");
  const camposRequeridos = document.querySelectorAll(".form-control");

  let idSoporte = -1;
  let jsonRepetidores = [];
  let jsonAntenas = [];

  btnVerMas.disabled = true;
  chkConfirmacion.checked = false;
  chkConfirmacion.disabled = true;

  function verificarSeleccion() {
    if (slcWireless.value) {
      btnVerMas.disabled = false;
    } else {
      btnVerMas.disabled = true;
    }
  }

  function verificarCamposLlenos(formulario) {
    const inputs = formulario.querySelectorAll("input, select, textarea");
    for (const input of inputs) {
      if (input.value.trim() === "" && !input.disabled) {
        chkConfirmacion.checked = false;
        return;
      }
    }
    chkConfirmacion.checked = true;
  }

  function agregarEventListenersFormulario(formulario) {
    const inputs = formulario.querySelectorAll("input, select, textarea");
    for (const input of inputs) {
      input.addEventListener("input", () => verificarCamposLlenos(formulario));
    }
  }

  slcWireless.addEventListener("change", async function () {
    verificarSeleccion();
    const selectedOption = this.options[this.selectedIndex];
    const tipoDispositivo = selectedOption.getAttribute("data-modelo");

    cardParametros.style.display = "none";
    cardParametrosRepetidor.style.display = "none";
    cardParametrosAntena.style.display = "none";
    btnVerMas.textContent = "Ver más"; 

    if (tipoDispositivo === "router") {
      formularioCambiosRouter.style.display = "block";
      formularioCambiosRepetidor.style.display = "none";
      formularioCambiosAntena.style.display = "none";
      chkConfirmacion.disabled = false;
      agregarEventListenersFormulario(formularioCambiosRouter);
      await cargarEnInputs();
    } else if (tipoDispositivo === "repetidor") {
      formularioCambiosRouter.style.display = "none";
      formularioCambiosRepetidor.style.display = "block";
      formularioCambiosAntena.style.display = "none";
      chkConfirmacion.disabled = false;
      agregarEventListenersFormulario(formularioCambiosRepetidor);
      await cargarEnInputs();
    } else if (tipoDispositivo === "antena") {
      formularioCambiosRouter.style.display = "none";
      formularioCambiosRepetidor.style.display = "none";
      formularioCambiosAntena.style.display = "block";
      chkConfirmacion.disabled = false;
      agregarEventListenersFormulario(formularioCambiosAntena);
      await cargarEnInputs();
    } else if (tipoDispositivo === "ninguno") {
      formularioCambiosRouter.style.display = "none";
      formularioCambiosRepetidor.style.display = "none";
      formularioCambiosAntena.style.display = "none";
      btnVerMas.disabled = true;
      chkConfirmacion.disabled = true;
    }
    verificarCamposLlenos(formularioCambiosRouter);
    verificarCamposLlenos(formularioCambiosRepetidor);
    verificarCamposLlenos(formularioCambiosAntena);
  });

  btnVerMas.addEventListener("click", function (event) {
    event.stopPropagation();
    const selectedOption = slcWireless.options[slcWireless.selectedIndex];
    const tipoDispositivo = selectedOption.getAttribute("data-modelo");

    if (tipoDispositivo === "router") {
      if (cardParametros.style.display === "none") {
        cardParametros.style.display = "block";
        cargarDatosParametros();
        btnVerMas.textContent = "Ocultar";
      } else {
        cardParametros.style.display = "none";
        btnVerMas.textContent = "Ver más";
      }
    } else if (tipoDispositivo === "repetidor") {
      if (cardParametrosRepetidor.style.display === "none") {
        cardParametrosRepetidor.style.display = "block";
        cargarDatosParametrosRepetidor();
        btnVerMas.textContent = "Ocultar";
      } else {
        cardParametrosRepetidor.style.display = "none";
        btnVerMas.textContent = "Ver más";
      }
    } else if (tipoDispositivo === "antena") {
      if (cardParametrosAntena.style.display === "none") {
        cardParametrosAntena.style.display = "block";
        cargarDatosParametrosAntena();
        btnVerMas.textContent = "Ocultar";
      } else {
        cardParametrosAntena.style.display = "none";
        btnVerMas.textContent = "Ver más";
      }
    }
  });

  function cargarDatosParametros() {
    document.getElementById("paramBase").textContent = txtBase.value;
    document.getElementById("paramIp").textContent = txtIp.value;
    document.getElementById("paramAcceso").textContent = txtAcceso.value;
    document.getElementById("paramSenial").textContent = txtSenial.value;
    document.getElementById("paramRouterSsid").textContent = txtRouterSsid.value;
    document.getElementById("paramRouterSeguridad").textContent = txtRouterSeguridad.value;
    document.getElementById("paramRouterpuertaEnlace").textContent = txtRouterpuertaEnlace.value;
    document.getElementById("paramRouterWan").textContent = txtRouterWan.value;
    document.getElementById("paramRouterCodigoBarra").textContent = txtRouterCodigoBarra.value;
    document.getElementById("paramRouterMarca").textContent = txtRouterMarca.value;
    document.getElementById("paramRouterModelo").textContent = txtRouterModelo.value;
  }

  function cargarDatosParametrosRepetidor() {
    document.getElementById("paramRepetidorSsid").textContent = txtRepetidorSsid.value;
    document.getElementById("paramRepetidorIp").textContent = txtRepetidorIp.value;
    document.getElementById("paramRepetidorAcceso").textContent = txtRepetidorAcceso.value;
    document.getElementById("paramRepetidorCondicion").textContent = slcRepetidorCondicion.value;
    document.getElementById("paramRepetidorCodigoBarra").textContent = txtRepetidorCodigoBarra.value;
    document.getElementById("paramRepetidorMarca").textContent = txtRepetidorMarca.value;
    document.getElementById("paramRepetidorModelo").textContent = txtRepetidorModelo.value;
    document.getElementById("paramRepetidorSerie").textContent = txtRepetidorSerie.value;
    document.getElementById("paramRepetidorPrecio").textContent = txtRepetidorPrecio.value;
  }

  function cargarDatosParametrosAntena() {
    document.getElementById("paramAntenaMarca").textContent = txtAntenaMarca.value;
    document.getElementById("paramAntenaModelo").textContent = txtAntenaModelo.value;
    document.getElementById("paramAntenaMac").textContent = txtAntenaMac.value;
    document.getElementById("paramAntenaSerial").textContent = txtAntenaSerial.value;
    document.getElementById("paramAntenaDescripcion").textContent = txtAntenaDescripcion.value;
    document.getElementById("paramAntenaFrecuencia").textContent = slcFrecuenciaAntena.value;
  }

  chkConfirmacion.addEventListener("change", async () => {
    if (chkConfirmacion.checked) {
      await completarCamposVacios();
    } else {
      await borrarCamposVacios();
    }
  });

  async function completarCamposVacios() {
    const selectedOption = slcWireless.options[slcWireless.selectedIndex];
    const tipoDispositivo = selectedOption.getAttribute("data-modelo");

    if (tipoDispositivo === "router") {
      const parametrosRouter = {
        txtBaseNuevo: txtBase.value,
        txtIpNuevo: txtIp.value,
        txtAccesoNuevo: txtAcceso.value,
        txtSenialNuevo: txtSenial.value,
        txtRouterCambioSsid: txtRouterSsid.value,
        txtRouterCambioSeguridad: txtRouterSeguridad.value,
        txtRouterCambiopuertaEnlace: txtRouterpuertaEnlace.value,
        txtRouterCambioWan: txtRouterWan.value,
        txtRouterCambioCodigoBarra: txtRouterCodigoBarra.value,
        txtRouterCambioMarca: txtRouterMarca.value,
        txtRouterCambioModelo: txtRouterModelo.value,
      };

      for (const [id, value] of Object.entries(parametrosRouter)) {
        const input = document.getElementById(id);
        if (input && !input.value) {
          input.value = value;
        }
      }
    } else if (tipoDispositivo === "repetidor") {
      const parametrosRepetidor = {
        txtRepetidorCambioSsid: txtRepetidorSsid.value,
        txtRepetidorCambioIp: txtRepetidorIp.value,
        txtRepetidorCambioAcceso: txtRepetidorAcceso.value,
        slcRepetidorCambioCondicion: slcRepetidorCondicion.value,
        txtRepetidorCambioCodigoBarra: txtRepetidorCodigoBarra.value,
        txtRepetidorCambioMarca: txtRepetidorMarca.value,
        txtRepetidorCambioModelo: txtRepetidorModelo.value,
        txtRepetidorCambioSerie: txtRepetidorSerie.value,
        txtRepetidorCambioPrecio: txtRepetidorPrecio.value,
      };

      for (const [id, value] of Object.entries(parametrosRepetidor)) {
        const input = document.getElementById(id);
        if (input && !input.value) {
          input.value = value;
        }
      }
    } else if (tipoDispositivo === "antena") {
      const parametrosRepetidor = {
        txtAntenaMacCambios: txtAntenaMac.value,
        txtAntenaMarcaCambios: txtAntenaMarca.value,
        txtAntenaModeloCambios: txtAntenaModelo.value,
        txtAntenaSerialCambios: txtAntenaSerial.value,
        slcFrecuenciaAntenaCambios: slcFrecuenciaAntena.value,
        txtAntenaDescripcionCambios: txtAntenaDescripcion.value,
      };

      for (const [id, value] of Object.entries(parametrosRepetidor)) {
        const input = document.getElementById(id);
        if (input && !input.value) {
          input.value = value;
        }
      }
    }
  }

  async function borrarCamposVacios() {
    const selectedOption = slcWireless.options[slcWireless.selectedIndex];
    const tipoDispositivo = selectedOption.getAttribute("data-modelo");

    if (tipoDispositivo === "router") {
      const camposRouter = [
        'txtIpNuevo',
        'txtAccesoNuevo',
        'txtSenialNuevo',
        'txtRouterCambioSsid',
        'txtRouterCambioSeguridad',
        'txtRouterCambiopuertaEnlace',
        'txtRouterCambioWan',
        'txtRouterCambioCodigoBarra',
        'txtRouterCambioMarca',
        'txtRouterCambioModelo'
      ];

      camposRouter.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
          input.value = '';
        }
      });
    } else if (tipoDispositivo === "repetidor") {
      const camposRepetidor = [
        'txtRepetidorCambioSsid',
        'txtRepetidorCambioIp',
        'txtRepetidorCambioAcceso',
        'slcRepetidorCambioCondicion',
        'txtRepetidorCambioCodigoBarra',
        'txtRepetidorCambioMarca',
        'txtRepetidorCambioModelo',
        'txtRepetidorCambioSerie',
        'txtRepetidorCambioPrecio'
      ];

      camposRepetidor.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
          input.value = '';
        }
      });
    } else if (tipoDispositivo === "antena") {
      const camposRepetidor = [
        'txtAntenaMacCambios',
        'txtAntenaMarcaCambios',
        'txtAntenaModeloCambios',
        'txtAntenaSerialCambios',
        'txtAntenaDescripcionCambios'
      ];

      camposRepetidor.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
          input.value = '';
        }
      });
    }
  }

  camposRequeridos.forEach(campo => {
    campo.addEventListener("input", () => {
      const grupoFormulario = campo.closest('.form-floating');
      const etiqueta = grupoFormulario?.querySelector('label');
      const asterisco = etiqueta?.querySelector('.required-asterisk');
      const mensajeError = grupoFormulario?.querySelector('.invalid-feedback');

      if (asterisco) {
        if (campo.value.trim() !== "") {
          asterisco.style.display = "none";
          campo.classList.remove("is-invalid");
          if (mensajeError) {
            mensajeError.style.display = "none";
          }
        } else {
          asterisco.style.display = "inline";
          campo.classList.add("is-invalid");
          if (mensajeError) {
            mensajeError.style.display = "block";
          }
        }
      } else {
        console.warn("Asterisco no encontrado para el campo:", campo);
      }
    });
  });

  (async function () {
    const urlParams = new URLSearchParams(window.location.search);
    idSoporte = urlParams.get("idsoporte");
    if (idSoporte) {
      await cargarProblema(idSoporte);
      await crearSelectYBoton();
      await ObtenerValores();
    }
  })();

  async function ObtenerValores() {
    const urlParams = new URLSearchParams(window.location.search);
    const doc = urlParams.get("doc");
    const idSoporte = urlParams.get("idsoporte");
    const tiposervicio = urlParams.get("tiposervicio");
    const coordenada = urlParams.get("coordenada");

    const respuesta = await FichaSoporteporDocServCoordenada(doc, tiposervicio, coordenada);

    if (respuesta[0].soporte != "{}" && JSON.parse(respuesta[0].soporte).WISP) {
      const soporte = JSON.parse(respuesta[0].soporte).WISP;
      jsonRepetidores = soporte.parametros.repetidores || [];
      await cargarSoporteAnterior(soporte);
    } else {
      await traerDatosInstalacion(doc, idSoporte);
    }

    mostrarRepetidoresEnModal();
  }

  async function traerDatosInstalacion(doct, idSoporte, tiposervicio) {
    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${doct}`);
      const data = await respuesta.json();
      txtCliente.value = data[0].nombre;
      txtNrodocumento.value = doct;

    } catch (error) {
      console.error("Error en traer datos Instalacion:", error);
    }

    try {
      const datawisp = await FichaInstalacion(idSoporte);
      const wispFiltrado = JSON.parse(datawisp[0].ficha_instalacion);
      txtPlan.value = wispFiltrado.parametros.plan;
      txtBase.value = wispFiltrado.parametros.base[0].nombre;
      txtBaseNuevo.value = wispFiltrado.parametros.base[0].nombre;
      txtSenial.value = wispFiltrado.parametros.signalstrength;

      await cargarRouters(wispFiltrado.parametros.routers);
      await cargarAntena(wispFiltrado.venta?.antena || wispFiltrado.alquilado?.antena);
    } catch (error) {
      console.error("Error en data de WISP:", error);
    }
  }

  async function cargarRouters(routers) {
    slcWireless.innerHTML = '';

    slcWireless.innerHTML = '<option value="" disabled selected>Seleccione una opción</option>';

    const optionNinguno = document.createElement("option");
    optionNinguno.value = "ninguno";
    optionNinguno.textContent = "Restablecer Selección";
    optionNinguno.setAttribute("data-modelo", "ninguno");
    slcWireless.appendChild(optionNinguno);

    routers.forEach(router => {
      const option = document.createElement("option");
      option.value = router.numero; 
      option.textContent = `${router.ssid} (${router.modelo})`; 
      option.setAttribute("data-modelo", "router"); 
      slcWireless.appendChild(option);
    });

    verificarSeleccion();
  }

  async function cargarRepetidores(repetidores) {
    jsonRepetidores = repetidores;

    repetidores.forEach(repetidor => {
      const option = document.createElement("option");
      option.value = repetidor.numero;
      option.textContent = `${repetidor.ssid} (${repetidor.modelo})`;
      option.setAttribute("data-modelo", "repetidor");
      slcWireless.appendChild(option);
    });
  }

  async function cargarAntena(antena) {
    if (!antena) {
      console.warn("Antena no encontrada.");
      return;
    }
    const option = document.createElement("option");
    option.value = "antena";
    option.textContent = `${antena.marca} (${antena.modelo})`;
    option.setAttribute("data-modelo", "antena");
    slcWireless.appendChild(option);

    window.antenaDatos = antena;
  }

  slcWireless.addEventListener("change", async (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    let idReporte = urlParams.get("idReporte");
    if (idReporte) {
      await cargarDatosEnInputs();
    } else {
      await cargarEnInputs();
    }
  });

  async function cargarEnInputs() {
    try {
      const selectedValue = parseInt(slcWireless.value);
      const coordenada = urlParams.get("coordenada");
      const respuesta = await FichaInstalacion(idSoporte);
      const respuesta2 = await FichaSoporteporDocServCoordenada(txtNrodocumento.value, serv, coordenada);

      let wispFiltrado = null;
      let datosgenerales = null;
      let datosVenta = null;
      let datosAlquilado = null;
      let cambios = null;

      if (!respuesta2[0]?.soporte || respuesta2[0]?.soporte === "{}" || !JSON.parse(respuesta2[0].soporte)?.WISP) {
        const fichaInstalacion = JSON.parse(respuesta[0]?.ficha_instalacion || "{}");
        wispFiltrado = fichaInstalacion?.parametros?.routers || [];
        datosgenerales = fichaInstalacion?.parametros || null;
        datosVenta = fichaInstalacion?.venta || null;
        datosAlquilado = fichaInstalacion?.alquilado || null;
      } else {
        const soporte = JSON.parse(respuesta2[0].soporte);
        wispFiltrado = soporte.WISP.cambios.routers || [];
        datosgenerales = soporte.WISP.parametros || null;
        datosVenta = soporte.WISP.venta || null;
        datosAlquilado = soporte.WISP.alquilado || null;
        cambios = soporte.WISP.cambios || null;
      }

      const selectedOption = slcWireless.options[slcWireless.selectedIndex];
      const tipoDispositivo = selectedOption.getAttribute("data-modelo");

      if (tipoDispositivo === "router") {
        const routerseleccionado = wispFiltrado.find(
          (router) => router.numero === selectedValue
        );

        if (routerseleccionado) {
          txtIp.value = routerseleccionado.lan;
          txtRouterSsid.value = routerseleccionado.ssid;
          txtRouterSeguridad.value = routerseleccionado.seguridad;
          txtRouterpuertaEnlace.value = routerseleccionado.puertaenlace;
          txtRouterWan.value = routerseleccionado.wan;
          txtAcceso.value = routerseleccionado.acceso;
          txtRouterCodigoBarra.value = routerseleccionado.codigobarra;
          txtRouterMarca.value = routerseleccionado.marca;
          txtRouterModelo.value = routerseleccionado.modelo;
        } else {
          console.warn("No se encontró un router con el valor seleccionado.");
        }
      } else if (tipoDispositivo === "repetidor") {
        const repetidorseleccionado = jsonRepetidores.find(
          (repetidor) => repetidor.numero === selectedValue
        );

        if (repetidorseleccionado) {
          txtRepetidorSsid.value = repetidorseleccionado.ssid;
          txtRepetidorIp.value = repetidorseleccionado.ip;
          txtRepetidorAcceso.value = repetidorseleccionado.contrasenia;
          slcRepetidorCondicion.value = repetidorseleccionado.condicion;
          txtRepetidorCodigoBarra.value = repetidorseleccionado.codigobarrarepetidor;
          txtRepetidorMarca.value = repetidorseleccionado.marca;
          txtRepetidorModelo.value = repetidorseleccionado.modelo;
          txtRepetidorSerie.value = repetidorseleccionado.serie;
          txtRepetidorPrecio.value = repetidorseleccionado.precio;
        } else {
          console.warn("No se encontró un repetidor con el valor seleccionado.");
        }
      } else if (tipoDispositivo === "antena") {
        let antenaSeleccionada = null;

        if (cambios && cambios.antena) {
          antenaSeleccionada = cambios.antena;
        } else if (datosVenta && datosVenta.antena) {
          antenaSeleccionada = datosVenta.antena;
        } else if (datosAlquilado && datosAlquilado.antena) {
          antenaSeleccionada = datosAlquilado.antena;
        }

        if (antenaSeleccionada) {
          txtAntenaMarca.value = antenaSeleccionada.marca;
          txtAntenaModelo.value = antenaSeleccionada.modelo;
          txtAntenaMac.value = antenaSeleccionada.mac;
          txtAntenaSerial.value = antenaSeleccionada.serial;
          txtAntenaDescripcion.value = antenaSeleccionada.descripcion;

          if (datosgenerales && datosgenerales.frecuencia) {
            const frecuencia = datosgenerales.frecuencia[0];
            console.log(frecuencia);
            const slcFrecuenciaAntena = document.getElementById("slcFrecuenciaAntena");
            if (slcFrecuenciaAntena) {
              slcFrecuenciaAntena.value = frecuencia;
            }
          }
        } else {
          console.warn("No se encontró una antena con el valor seleccionado.");
        }
      }
    } catch (error) {
      console.error("Error al cargar datos del dispositivo:", error);
    }
  }

  async function cargarSoporteAnterior(data) {
    txtCliente.value = data.parametroscliente.usuario;
    txtNrodocumento.value = data.parametroscliente.nrodoc;
    txtPlan.value = data.parametroscliente.plan;
    txtBase.value = data.parametros.base;
    txtBaseNuevo.value = data.cambios.nuevabase;
    txtSenial.value = data.cambios.signalstrength;

    await cargarRouters(data.cambios.routers);
    await cargarRepetidores(data.cambios.repetidores);
    await cargarAntena(data.cambios.antena);
  }

  async function crearSelectYBoton() {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row g-2 mb-2 mt-2 justify-content-end";

    const buttonDiv = document.createElement("div");
    buttonDiv.className = "col-md-auto d-flex align-items-end";

    const guardarBtn = document.createElement("button");
    guardarBtn.id = "btnGuardarFicha";
    guardarBtn.className = "btn btn-success me-2";
    guardarBtn.type = "submit";
    guardarBtn.textContent = "Guardar Ficha";

    const cancelarBtn = document.createElement("button");
    cancelarBtn.id = "btnCancelarFicha";
    cancelarBtn.className = "btn btn-secondary";
    cancelarBtn.type = "button";
    cancelarBtn.textContent = "Cancelar";
    cancelarBtn.addEventListener("click", () => {
      window.location.href = `${config.HOST}views/Soporte/listarSoporte`;
    });

    buttonDiv.appendChild(guardarBtn);
    buttonDiv.appendChild(cancelarBtn);
    rowDiv.appendChild(buttonDiv);

    solutionTextarea.parentNode.parentNode.appendChild(rowDiv);
  }

  async function cargarProblema(idSoporte) {
    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
      const data = await respuesta.json();
      txtaEstadoInicial.value = (data[0].descripcion_problema);

    } catch (error) {
      console.log("Error en Obtener el estado Inicial:", error);
    }
  }

  function obtenerRutaSoporte(idSoporte) {
    return `${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`;
  }

  async function ArmadoJsonWisp() {
    const urlParams = new URLSearchParams(window.location.search);
    const doc = urlParams.get("doc");
    const tipoServicio = urlParams.get("tiposervicio");
    const coordenada = urlParams.get("coordenada");

    const respuesta = await FichaSoporteporDocServCoordenada(doc, tipoServicio, coordenada);
    const soporteAnterior = respuesta[0]?.soporte ? JSON.parse(respuesta[0].soporte) : {};
    const idSoporteAnterior = respuesta[0]?.idSoporte;

    const rutaSoporte = obtenerRutaSoporte(idSoporteAnterior);
    const response = await fetch(rutaSoporte);
    const result = await response.json();

    const dataWisp = await FichaInstalacion(idSoporte);
    const wispFiltrado = JSON.parse(dataWisp[0].ficha_instalacion).parametros;
    const antenaVenta = JSON.parse(dataWisp[0].ficha_instalacion).venta?.antena || {};

    const soporte = result[0]?.soporte ? JSON.parse(result[0].soporte) : {};
    const nuevoSoporte = { ...soporte };

    const yaTieneSoporte = soporteAnterior.WISP && Object.keys(soporteAnterior.WISP).length > 0;

    const repetidoresActualizados = await modificadoRepetidor(yaTieneSoporte ? soporteAnterior.WISP.parametros.repetidores : wispFiltrado.repetidores, soporteAnterior);

    const nuevosRepetidoresFiltrados = jsonRepetidores.filter(nuevoRepetidor =>
      !repetidoresActualizados.some(repetidorActualizado => repetidorActualizado.numero === nuevoRepetidor.numero)
    );

    const repetidoresCombinados = [...repetidoresActualizados, ...nuevosRepetidoresFiltrados];

    const wispData = {
      parametroscliente: {
        plan: txtPlan.value,
        usuario: txtCliente.value,
        nrodoc: txtNrodocumento.value,
      },
      parametros: {
        base: txtBase.value,
        routers: yaTieneSoporte ? (soporteAnterior.WISP?.cambios?.routers || JSON.parse(JSON.stringify(wispFiltrado.routers))) : JSON.parse(JSON.stringify(wispFiltrado.routers)),
        signalstrength: yaTieneSoporte ? (txtSenial.value || soporteAnterior.WISP?.cambios?.signalstrength) : wispFiltrado.signalstrength,
        repetidores: yaTieneSoporte ? (soporteAnterior.WISP?.cambios?.repetidores || JSON.parse(JSON.stringify(wispFiltrado.repetidores))) : JSON.parse(JSON.stringify(wispFiltrado.repetidores)),
        frecuencia: yaTieneSoporte ? (soporteAnterior.WISP?.cambios?.frecuencia || wispFiltrado.frecuencia) : wispFiltrado.frecuencia,
        antena: yaTieneSoporte ? (soporteAnterior.WISP?.cambios?.antena || JSON.parse(JSON.stringify(wispFiltrado.antena || antenaVenta))) : JSON.parse(JSON.stringify(wispFiltrado.antena || antenaVenta)),
      },
      cambios: {
        nuevabase: txtBaseNuevo.value,
        signalstrength: yaTieneSoporte ? (txtSenialNuevo.value || soporteAnterior.WISP?.parametros?.signalstrength) : txtSenialNuevo.value,
        routers: await modificadoRouter(yaTieneSoporte ? soporteAnterior.WISP.parametros.routers : wispFiltrado.routers, soporteAnterior),
        repetidores: repetidoresCombinados,
        frecuencia: yaTieneSoporte ? (slcFrecuenciaAntena.value || (soporteAnterior.WISP?.parametros?.frecuencia || wispFiltrado.frecuencia)) : wispFiltrado.frecuencia,
        antena: await modificadoAntena(yaTieneSoporte ? soporteAnterior.WISP.parametros.antena : wispFiltrado.antena || soporteAnterior.WISP?.cambios?.antena || antenaVenta),
      },
    };

    nuevoSoporte.WISP = wispData;
    console.log("Nuevo soporte:", nuevoSoporte);
    return nuevoSoporte;
  }

  async function modificadoRouter(routers, soporteAnterior) {
    return routers.map(router => {
      const ultimoSoporteRouter = soporteAnterior?.WISP?.cambios?.routers?.find(r => r.numero === router.numero) || {};
      router.acceso = txtAccesoNuevo?.value || ultimoSoporteRouter.acceso || router.acceso;
      router.ssid = txtRouterCambioSsid?.value || ultimoSoporteRouter.ssid || router.ssid;
      router.seguridad = txtRouterCambioSeguridad?.value || ultimoSoporteRouter.seguridad || router.seguridad;
      router.lan = txtIpNuevo?.value || ultimoSoporteRouter.lan || router.lan;
      router.puertaenlace = txtRouterCambiopuertaEnlace?.value || ultimoSoporteRouter.puertaenlace || router.puertaenlace;
      router.wan = txtRouterCambioWan?.value || ultimoSoporteRouter.wan || router.wan;
      router.codigobarra = txtRouterCambioCodigoBarra?.value || ultimoSoporteRouter.codigobarra || router.codigobarra;
      router.marca = txtRouterCambioMarca?.value || ultimoSoporteRouter.marca || router.marca;
      router.modelo = txtRouterCambioModelo?.value || ultimoSoporteRouter.modelo || router.modelo;
      return router;
    });
  }

  async function modificadoRepetidor(repetidor) {
    if (!jsonRepetidores) {
      return [];
    }

    return jsonRepetidores.map(repetidor => {
      repetidor.ssid = txtRepetidorCambioSsid.value || repetidor.ssid;
      repetidor.ip = txtRepetidorCambioIp.value || repetidor.ip;
      repetidor.contrasenia = txtRepetidorCambioAcceso.value || repetidor.contrasenia;
      repetidor.condicion = slcRepetidorCambioCondicion.value || repetidor.condicion;
      repetidor.codigobarrarepetidor = txtRepetidorCambioCodigoBarra.value || repetidor.codigobarrarepetidor;
      repetidor.marca = txtRepetidorCambioMarca.value || repetidor.marca;
      repetidor.modelo = txtRepetidorCambioModelo.value || repetidor.modelo;
      repetidor.serie = txtRepetidorCambioSerie.value || repetidor.serie;
      repetidor.precio = txtRepetidorCambioPrecio.value || repetidor.precio;
      return repetidor;
    });
  }

  async function modificadoAntena() {
    console.log("Antes de los cambios:", window.antenaDatos);
    const selectedValue = slcWireless.value;
    let antenaSeleccionada = {
      marca: txtAntenaMarcaCambios.value || (window.antenaDatos ? window.antenaDatos.marca : ""),
      modelo: txtAntenaModeloCambios.value || (window.antenaDatos ? window.antenaDatos.modelo : ""),
      mac: txtAntenaMacCambios.value || (window.antenaDatos ? window.antenaDatos.mac : ""),
      serial: txtAntenaSerialCambios.value || (window.antenaDatos ? window.antenaDatos.serial : ""),
      descripcion: txtAntenaDescripcionCambios.value || (window.antenaDatos ? window.antenaDatos.descripcion : ""),
      frecuencia: slcFrecuenciaAntenaCambios.value || (window.antenaDatos ? window.antenaDatos.frecuencia : "")
    };
    console.log("Después de los cambios:", antenaSeleccionada);
    return antenaSeleccionada;
  }

  async function guardarSoporte(data) {
    try {
      const response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operacion: 'actualizarSoporte',
          data: {
            idSoporte: idSoporte,
            idTecnico: user['idUsuario'],
            soporte: data,
            idUserUpdate: user['idUsuario'],
            descripcion_solucion: document.getElementById("txtaProceSolucion").value,
          },
        }),
      });

      const result = await response.json();
      console.log(result.status);
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    idSoporte = urlParams.get("idsoporte");
    const data = await ArmadoJsonWisp();
    if (await ask("¿Desea guardar la ficha?")) {
      await guardarSoporte(data)
      if (await CompletarSoporte(idSoporte)) {
        window.location.href = `${config.HOST}views/Soporte/listarSoporte`;
      }
    }
  });

  txtSenial, txtSenialNuevo.addEventListener("input", validarValorRango);

  [txtIp, txtRouterCambiopuertaEnlace, txtRouterCambioWan, txtIpNuevo, txtRepetidorCambioIp, txtIpRepetidorModal].forEach(element => {
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

  document.getElementById('txtAntenaMacCambios').addEventListener('input', async function () {
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
          document.getElementById('txtAntenaMarcaCambios').value = producto.marca;
          document.getElementById('txtAntenaModeloCambios').value = producto.modelo;
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

  document.getElementById('txtRepetidorCambioCodigoBarra').addEventListener('input', async function () {
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
          document.getElementById('txtRepetidorCambioMarca').value = producto.marca;
          document.getElementById('txtRepetidorCambioModelo').value = producto.modelo;
          document.getElementById('txtRepetidorCambioPrecio').value = producto.precio_actual;
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

  document.getElementById('txtRouterCambioCodigoBarra').addEventListener('input', async function () {
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
          document.getElementById('txtRouterCambioMarca').value = producto.marca;
          document.getElementById('txtRouterCambioModelo').value = producto.modelo;
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

  document.getElementById('btnAñadirRepetidor').addEventListener('click', async function () {
    await AgregarRepetidor();
  });

});
