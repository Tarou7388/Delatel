import config from "../env.js";
import { FichaInstalacion, FichaSoporteporDocServCoordenada, formatoIPinput, validarValorRango, CompletarSoporte } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("frmRegistroWisp");
  const urlParams = new URLSearchParams(window.location.search);
  const serv = urlParams.get("tiposervicio");

  // Datos del Cliente
  const txtNrodocumento = document.getElementById("txtNrodocumento");
  const txtCliente = document.getElementById("txtCliente");
  const txtPlan = document.getElementById("txtPlan");

  // Parámetros Wireless
  const slcWireless = document.getElementById("slcWireless");
  const txtBase = document.getElementById("txtBase");
  const txtIp = document.getElementById("txtIp");
  const txtSenial = document.getElementById("txtSenial");

  const txtRouterSsid = document.getElementById("txtRouterSsid");
  const txtRouterSeguridad = document.getElementById("txtRouterSeguridad");
  const txtRouterpuertaEnlace = document.getElementById("txtRouterpuertaEnlace");
  const txtRouterWan = document.getElementById("txtRouterWan");
  const txtAcceso = document.getElementById("txtAcceso");

  // Cambios Wireless
  const txtBaseNuevo = document.getElementById("txtBaseNuevo");
  const txtIpNuevo = document.getElementById("txtIpNuevo");
  const txtSenialNuevo = document.getElementById("txtSenialNuevo");

  const txtAccesoNuevo = document.getElementById("txtAccesoNuevo");
  const txtRouterCambioSsid = document.getElementById("txtRouterCambioSsid");
  const txtRouterCambioSeguridad = document.getElementById("txtRouterCambioSeguridad");
  const txtRouterCambiopuertaEnlace = document.getElementById("txtRouterCambiopuertaEnlace");
  const txtRouterCambioWan = document.getElementById("txtRouterCambioWan");

  //Definicion de constantes
  const solutionTextarea = document.getElementById("txtaProceSolucion");
  const txtaEstadoInicial = document.getElementById("txtaEstadoInicial");

  let idSoporte = -1;
  let jsonRepetidores = [];
  let jsonAntenas = [];

  // Agregar estas constantes al inicio del DOMContentLoaded
  const btnVerMas = document.getElementById("btnInformacion");
  const formularioCambiosRouter = document.getElementById("formularioCambiosRouter");
  const formularioCambiosRepetidor = document.getElementById("formularioCambiosRepetidor");
  const cardParametros = document.getElementById("cardParametros");
  const cardParametrosRepetidor = document.getElementById("cardParametrosRepetidor");

  // Desactivar el botón inicialmente
  btnVerMas.disabled = true;

  // Función para verificar si hay una opción seleccionada
  function verificarSeleccion() {
    if (slcWireless.value) {
      btnVerMas.disabled = false;
    } else {
      btnVerMas.disabled = true;
    }
  }

  // Agregar estos event listeners dentro del DOMContentLoaded
  slcWireless.addEventListener("change", async function () {
    verificarSeleccion();
    const selectedOption = this.options[this.selectedIndex];
    const tipoDispositivo = selectedOption.getAttribute("data-modelo");
    console.log(tipoDispositivo);
    if (tipoDispositivo === "router") {
      formularioCambiosRouter.style.display = "block";
      await cargarEnInputs();
    } else {
      formularioCambiosRouter.style.display = "none";
    }
  });

  // Modificación del event listener para el botón Ver más
  btnVerMas.addEventListener("click", function () {
    console.log("Botón Ver más presionado");
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
    }
  });

  // Agregar esta función para cargar los datos de los parámetros en la card
  function cargarDatosParametros() {
    document.getElementById("paramBase").textContent = txtBase.value;
    document.getElementById("paramIp").textContent = txtIp.value;
    document.getElementById("paramAcceso").textContent = txtAcceso.value;
    document.getElementById("paramSenial").textContent = txtSenial.value;
    document.getElementById("paramRouterSsid").textContent = txtRouterSsid.value;
    document.getElementById("paramRouterSeguridad").textContent = txtRouterSeguridad.value;
    document.getElementById("paramRouterpuertaEnlace").textContent = txtRouterpuertaEnlace.value;
    document.getElementById("paramRouterWan").textContent = txtRouterWan.value;
  }

  function cargarDatosParametrosRepetidor() {
    document.getElementById("paramRepetidorSsid").textContent = txtRepetidorCambioSsid.value;
    document.getElementById("paramRepetidorIp").textContent = txtRepetidorCambioIp.value;
    document.getElementById("paramRepetidorAcceso").textContent = txtRepetidorCambioAcceso.value;
    document.getElementById("paramRepetidorCondicion").textContent = slcRepetidorCambioCondicion.value;
    document.getElementById("paramRepetidorMarca").textContent = txtRepetidorCambioMarca.value;
    document.getElementById("paramRepetidorModelo").textContent = txtRepetidorCambioModelo.value;
    document.getElementById("paramRepetidorSerie").textContent = txtRepetidorCambioSerie.value;
    document.getElementById("paramRepetidorPrecio").textContent = txtRepetidorCambioPrecio.value;
  }

  const chkConfirmacion = document.getElementById("chkConfirmacion");


  chkConfirmacion.addEventListener("change", async () => {
    if (chkConfirmacion.checked) {
      await completarCamposVacios();
    } else {
      await borrarCamposVacios();
    }
  });

  async function completarCamposVacios() {
    const parametros = {
      txtBaseNuevo: txtBase.value,
      txtIpNuevo: txtIp.value,
      txtAccesoNuevo: txtAcceso.value,
      txtSenialNuevo: txtSenial.value,
      txtRouterCambioSsid: txtRouterSsid.value,
      txtRouterCambioSeguridad: txtRouterSeguridad.value,
      txtRouterCambiopuertaEnlace: txtRouterpuertaEnlace.value,
      txtRouterCambioWan: txtRouterWan.value,
    };

    for (const [id, value] of Object.entries(parametros)) {
      const input = document.getElementById(id);
      if (input && !input.value) {
        input.value = value;
      }
    }
  }

  async function borrarCamposVacios() {
    const campos = [
      'txtBaseNuevo',
      'txtIpNuevo',
      'txtAccesoNuevo',
      'txtSenialNuevo',
      'txtRouterCambioSsid',
      'txtRouterCambioSeguridad',
      'txtRouterCambiopuertaEnlace',
      'txtRouterCambioWan'
    ];

    campos.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.value = '';
      }
    });
  }

  (async function () {
    const urlParams = new URLSearchParams(window.location.search);
    idSoporte = urlParams.get("idsoporte");
    if (idSoporte) {
      await cargarProblema(idSoporte);
      await crearSelectYBoton();
      await ObtenerValores();
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.get("idReporte");
      await reporte(urlParams.get("idReporte"));
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
  }

  async function traerDatosInstalacion(doct, idSoporte, tiposervicio) {
    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${doct}`);
      const data = await respuesta.json();
      //Asignacion del Nombre del cliente
      txtCliente.value = data[0].nombre;
      //Asignacion del Documento del cliente
      txtNrodocumento.value = doct;

    } catch (error) {
      console.error("Error en traer datos Instalacion:", error);
    }

    try {
      const datawisp = await FichaInstalacion(idSoporte);
      const wispFiltrado = JSON.parse(datawisp[0].ficha_instalacion).parametros;

      console.log(wispFiltrado);
      txtPlan.value = wispFiltrado.plan;

      console.log(wispFiltrado.base);
      txtBase.value = wispFiltrado.base[0].nombre;
      txtBaseNuevo.value = wispFiltrado.base[0].nombre;

      console.log(wispFiltrado.subbase[0].nombre);

      txtSenial.value = wispFiltrado.signalstrength;

      await cargarRouters(wispFiltrado.routers)
    } catch (error) {
      console.error("Error en data de WISP:", error);
    }
  }

  async function reporte(idReporte) {
    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idReporte}`);
      const data = await respuesta.json();
      const soporte = JSON.parse(data[0].soporte);

      await cargarRoutersReporte(data[0]);

      txtNrodocumento.value = data[0].nro_doc;
      txtCliente.value = soporte.WISP.parametroscliente.usuario;
      txtPlan.value = soporte.WISP.parametroscliente.plan;
      deshabilitar();
    } catch (error) {
      console.error("Error en reporte:", error);
    }
  }


  async function cargarRoutersReporte(data) {
    try {
      // Parsear el campo "soporte" para obtener el objeto con los routers y repetidores
      const soporte = JSON.parse(data.soporte);

      // Obtener la lista de routers y repetidores desde "soporte"
      const routers = soporte.WISP.parametros.routers;
      const repetidores = soporte.WISP.parametros.repetidores;

      // Limpiar el contenido del select
      slcWireless.innerHTML = '';
      slcWireless.innerHTML = '<option value="" disabled selected>Seleccione una opción</option>';

      // Iterar sobre los routers y crear las opciones del select
      routers.forEach(router => {
        const option = document.createElement("option");
        option.value = router.numero;
        option.textContent = router.ssid;
        option.setAttribute("data-modelo", "router"); // Agregar el atributo data-modelo
        slcWireless.appendChild(option);
      });

      // Iterar sobre los repetidores y crear las opciones del select
      repetidores.forEach(repetidor => {
        const option = document.createElement("option");
        option.value = repetidor.numero;
        option.textContent = repetidor.ssid;
        option.setAttribute("data-modelo", "repetidor"); // Agregar el atributo data-modelo
        slcWireless.appendChild(option);
      });

      verificarSeleccion();
    } catch (error) {
      console.error("Error al cargar los routers y repetidores:", error);
    }
  }

  function cargarDatosParametros() {
    document.getElementById("paramBase").textContent = txtBase.value;
    document.getElementById("paramIp").textContent = txtIp.value;
    document.getElementById("paramAcceso").textContent = txtAcceso.value;
    document.getElementById("paramSenial").textContent = txtSenial.value;
    document.getElementById("paramRouterSsid").textContent = txtRouterSsid.value;
    document.getElementById("paramRouterSeguridad").textContent = txtRouterSeguridad.value;
    document.getElementById("paramRouterpuertaEnlace").textContent = txtRouterpuertaEnlace.value;
    document.getElementById("paramRouterWan").textContent = txtRouterWan.value;
  }

  async function deshabilitar() {
    txtIpNuevo.disabled = true;
    txtRouterCambioSsid.disabled = true;
    txtRouterCambioSeguridad.disabled = true;
    txtRouterCambiopuertaEnlace.disabled = true;
    txtRouterCambioWan.disabled = true;
    txtSenialNuevo.disabled = true;
    txtRouterCambioSeguridad.disabled = true;
    txtRouterCambiopuertaEnlace.disabled = true;
    txtAccesoNuevo.disabled = true;
    solutionTextarea.disabled = true;
  }

  async function cargarRouters(routers) {
    slcWireless.innerHTML = '';

    slcWireless.innerHTML = '<option value="" disabled selected>Seleccione una opción</option>';

    routers.forEach(router => {
      const option = document.createElement("option");
      option.value = router.numero; // Usar "numero" como valor del option
      option.textContent = router.ssid; // Usar "ssid" como texto visible del option
      option.setAttribute("data-modelo", "router"); // Agregar el atributo data-modelo
      slcWireless.appendChild(option);
    });

    verificarSeleccion();
  }

  async function cargarRepetidores(repetidores) {
    repetidores.forEach(repetidor => {
      const option = document.createElement("option");
      option.value = repetidor.numero; // Usar "numero" como valor del option
      option.textContent = repetidor.ssid; // Usar "ssid" como texto visible del option
      option.setAttribute("data-modelo", "repetidor"); // Agregar el atributo data-modelo
      slcWireless.appendChild(option);
    });
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
      if (!respuesta2[0]?.soporte || respuesta2[0]?.soporte === "{}" || !JSON.parse(respuesta2[0].soporte)?.WISP) {
        const fichaInstalacion = JSON.parse(respuesta[0]?.ficha_instalacion || "{}");
        wispFiltrado = fichaInstalacion?.parametros?.routers || [];
        datosgenerales = fichaInstalacion?.parametros || null;
      } else {
        const soporte = JSON.parse(respuesta2[0].soporte);
        wispFiltrado = soporte.WISP.cambios.routers || [];
        datosgenerales = soporte.WISP.parametros || null;
      }

      const selectedOption = slcWireless.options[slcWireless.selectedIndex];
      const tipoDispositivo = selectedOption.getAttribute("data-modelo");

      if (tipoDispositivo === "router") {
        const routerseleccionado = wispFiltrado.find(
          (router) => router.numero === selectedValue
        );

        if (routerseleccionado) {
          console.log(routerseleccionado);
          txtIp.value = routerseleccionado.lan;
          txtRouterSsid.value = routerseleccionado.ssid;
          txtRouterSeguridad.value = routerseleccionado.seguridad;
          txtRouterpuertaEnlace.value = routerseleccionado.puertaenlace;
          txtRouterWan.value = routerseleccionado.wan;
          txtAcceso.value = routerseleccionado.acceso;

          // Mostrar los parámetros iniciales en los campos de cambios
        /*   txtIpNuevo.value = routerseleccionado.lan;
          txtRouterCambioSsid.value = routerseleccionado.ssid;
          txtRouterCambioSeguridad.value = routerseleccionado.seguridad;
          txtRouterCambiopuertaEnlace.value = routerseleccionado.puertaenlace;
          txtRouterCambioWan.value = routerseleccionado.wan;
          txtAccesoNuevo.value = routerseleccionado.acceso; */

          // Mostrar el formulario de cambios de router
          formularioCambiosRouter.style.display = "block";
          formularioCambiosRepetidor.style.display = "none";
        } else {
          console.warn("No se encontró un router con el valor seleccionado.");
        }
      } else if (tipoDispositivo === "repetidor") {
        const repetidorseleccionado = jsonRepetidores.find(
          (repetidor) => repetidor.numero === selectedValue
        );

        if (repetidorseleccionado) {
          console.log(repetidorseleccionado);
          txtRepetidorCambioIp.value = repetidorseleccionado.ip;
          txtRepetidorCambioSsid.value = repetidorseleccionado.ssid;
          txtRepetidorCambioAcceso.value = repetidorseleccionado.contrasenia;
          slcRepetidorCambioCondicion.value = repetidorseleccionado.condicion;
          txtRepetidorCambioMarca.value = repetidorseleccionado.marca;
          txtRepetidorCambioModelo.value = repetidorseleccionado.modelo;
          txtRepetidorCambioSerie.value = repetidorseleccionado.serie;
          txtRepetidorCambioPrecio.value = repetidorseleccionado.precio;

          // Mostrar el formulario de cambios de repetidor
          formularioCambiosRouter.style.display = "none";
          formularioCambiosRepetidor.style.display = "block";
        } else {
          console.warn("No se encontró un repetidor con el valor seleccionado.");
        }
      }
    } catch (error) {
      console.error("Error al cargar datos del dispositivo:", error);
    }
  }

  async function cargarSoporteAnterior(data) {
    console.log(data);

    // Datos del cliente
    txtCliente.value = data.parametroscliente.usuario;
    txtNrodocumento.value = data.parametroscliente.nrodoc;
    txtPlan.value = data.parametroscliente.plan;

    // Cambios realizados (mostrar en los campos principales)
    txtBase.value = data.parametros.base;
    txtBaseNuevo.value = data.cambios.nuevabase;
    txtSenial.value = data.cambios.signalstrength;

    // Cargar routers en el select
    await cargarRouters(data.cambios.routers);
    await cargarRepetidores(data.cambios.repetidores);
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

  async function ArmadoJsonWisp() {
    const Response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
    const result = await Response.json();

    let soporte = result[0].soporte ? JSON.parse(result[0].soporte) : {};

    const datawisp = await FichaInstalacion(idSoporte);
    const wispFiltrado = JSON.parse(datawisp[0].ficha_instalacion).parametros;

    const existeClave = Object.keys(soporte).includes(serv);

    if (!existeClave) {
      soporte[serv] = {
        parametroscliente: {
          plan: txtPlan.value,
          usuario: txtCliente.value,
          nrodoc: txtNrodocumento.value,
        },
        parametros: {
          base: txtBase.value,
          routers: JSON.parse(JSON.stringify(wispFiltrado.routers)),
          signalstrength: txtSenial.value,
          repetidores: jsonRepetidores,
          antenas: jsonAntenas
        },
        cambios: {
          nuevabase: txtBaseNuevo.value,
          signalstrength: txtSenialNuevo.value,
          routers: await moficadoRuter(wispFiltrado.routers),
          repetidores: jsonRepetidores,
          antenas: jsonAntenas
        },
      };
    } else {
      soporte[serv].parametros.repetidores = jsonRepetidores;
      soporte[serv].parametros.antenas = jsonAntenas;
      soporte[serv].cambios.repetidores = jsonRepetidores;
      soporte[serv].cambios.antenas = jsonAntenas;
    }

    console.log(soporte);
    return soporte;
  }

  async function moficadoRuter(routers) {
    console.log(routers);
    const selectedValue = parseInt(slcWireless.value);
    return routers.map(router => {
      if (router.numero === selectedValue) {
        router.acceso = txtAccesoNuevo.value;
        router.ssid = txtRouterCambioSsid.value;
        router.seguridad = txtRouterCambioSeguridad.value;
        router.lan = txtIpNuevo.value;
        router.puertaenlace = txtRouterCambiopuertaEnlace.value;
        router.wan = txtRouterCambioWan.value;
        console.log(router);
      }
      return router;
    });
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
        //window.location.href = `${config.HOST}views/Soporte/listarSoporte`;
      }
    }
  });

  txtSenial, txtSenialNuevo.addEventListener("input", validarValorRango);

  [txtIp, txtRouterCambiopuertaEnlace, txtRouterCambioWan, txtIpNuevo].forEach(element => {
    element.addEventListener("input", (event) => {
      formatoIPinput(event);
    });
  });

  //Evento de escaneo de código de barras fibra óptica
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

  //Evento de escaneo de código de barras Antena
  document.getElementById('txtCodigoBarrasAntena').addEventListener("input", async function () {
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
          document.getElementById('txtMarcaAntena').value = producto.marca;
          document.getElementById('txtModeloAntena').value = producto.modelo;
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

  // Función para cargar repetidores existentes en el modal
  function mostrarRepetidoresEnModal() {
    // Limpia el contenedor antes de agregar las nuevas tarjetas
    const modalBody = document.getElementById('mdlRepetidorBody');

    // Seleccionar solo las tarjetas dinámicas y no el formulario
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

      // Evento para eliminar el repetidor
      card.querySelector(".btnEliminar").addEventListener("click", function () {
        card.remove();
        jsonRepetidores = jsonRepetidores.filter(rep => rep.numero !== repetidor.numero);
      });
    });
  }

  // Función para agregar repetidores
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

    // Verificar si el repetidor ya existe
    const repetidorExistente = jsonRepetidores.find(rep => rep.codigobarrarepetidor === codigoBarra);

    if (repetidorExistente) {
      showToast("El repetidor con este código de barras ya existe.", "WARNING");
      return;
    }

    // Asegurar que el número sea único
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
    console.log("Nuevo repetidor agregado:", repetidor);

    // Actualizar la interfaz de usuario
    mostrarRepetidoresEnModal();

    // Limpiar el formulario del modal
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

  // Añadir Nuevo Repetidor
  document.getElementById('btnAñadirRepetidor').addEventListener('click', async function () {
    await AgregarRepetidor();
  });

  // Función para cargar antenas existentes en el modal
  function mostrarAntenasEnModal() {
    // Limpia el contenedor antes de agregar las nuevas tarjetas
    const modalBody = document.getElementById('mdlAntenaBody');

    // Seleccionar solo las tarjetas dinámicas y no el formulario
    const tarjetasDinamicas = modalBody.querySelectorAll('.card');
    tarjetasDinamicas.forEach(tarjeta => tarjeta.remove());

    jsonAntenas.forEach(antena => {
      const card = document.createElement('div');
      card.className = 'card mt-2';
      card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title"><i class="fa-solid fa-signal" style="color: #0459ad;"></i> ${antena.marca} - ${antena.modelo}</h5>
        <br>
        <div class="row">
          <div class="col-12 mb-2">
            <p class="card-text" style="color: gray;">
              Código de Barra:
              <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                ${antena.mac}
              </span>
            </p>
          </div>
          <div class="col-6 mb-2">
            <p class="card-text" style="color: gray;">
              Marca:
              <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
              ${antena.marca}
              </span>
            </p>
          </div>
          <div class="col-6 mb-2">
            <p class="card-text" style="color: gray;">
              Modelo:
              <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
              ${antena.modelo}
              </span>
            </p>
          </div>
          <div class="col-6 mb-2">
            <p class="card-text" style="color: gray;">
              Serie:
              <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                ${antena.serial}
              </span>
            </p>
          </div>
          <div class="col-6 mb-2">
            <p class="card-text" style="color: gray;">
              Frecuencia:
              <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                ${antena.frecuencia}
              </span>
            </p>
          </div>
          <div class="col-12 mb-2">
            <p class="card-text" style="color: gray;">
              Descripción:
              <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                ${antena.descripcion}
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

      // Evento para eliminar la antena
      card.querySelector(".btnEliminar").addEventListener("click", function () {
        card.remove();
        jsonAntenas = jsonAntenas.filter(ant => ant.numero !== antena.numero);
      });
    });
  }

  // Función para agregar antenas
  async function AgregarAntena() {
    try {
      const codigoBarra = document.getElementById('txtCodigoBarrasAntena')?.value;
      const marca = document.getElementById('txtMarcaAntena')?.value;
      const modelo = document.getElementById('txtModeloAntena')?.value;
      const serie = document.getElementById('txtSerieAntena')?.value;
      const frencuencia = document.getElementById('slcFrecuenciaAntena')?.value;
      const descripcion = document.getElementById('txtDescripcionAntena')?.value;

      if (!codigoBarra || !marca || !modelo || !serie || !frencuencia) {
        showToast("Por favor, complete todos los campos de la antena.", "WARNING");
        return;
      }

      // Verificar si la antena ya existe
      const antenaExistente = jsonAntenas.find(ant => ant.codigobarraantena === codigoBarra);

      if (antenaExistente) {
        showToast("La antena con este código de barras ya existe.", "WARNING");
        return;
      }

      // Asegurar que el número sea único
      const antenasExistentes = jsonAntenas.map(ant => ant.numero);
      const maxNumero = Math.max(0, ...antenasExistentes);
      const numeroAntenas = maxNumero + 1;

      const antena = {
        numero: numeroAntenas,
        marca: marca,
        modelo: modelo,
        mac: codigoBarra,
        serial: serie,
        frecuencia: frencuencia,
        descripcion: descripcion
      };

      jsonAntenas.push(antena);
      console.log("Nueva antena agregada:", antena);

      // Actualizar la interfaz de usuario
      mostrarAntenasEnModal();

      // Limpiar el formulario del modal
      document.getElementById('txtCodigoBarrasAntena').value = '';
      document.getElementById('txtMarcaAntena').value = '';
      document.getElementById('txtModeloAntena').value = '';
      document.getElementById('txtSerieAntena').value = '';
      document.getElementById('slcFrecuenciaAntena').value = '';
      document.getElementById('txtDescripcionAntena').value = '';
    } catch (error) {
      console.error('Error al agregar antena:', error);
      showToast("Hubo un error al agregar la antena.", "ERROR");
    }
  }

  // Añadir Nueva Antena
  document.getElementById('btnAñadirAntena').addEventListener('click', async function () {
    await AgregarAntena();
  });
});
