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
      await cargarSoporteAnterior(JSON.parse(respuesta[0].soporte).WISP);
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
      // Parsear el campo "soporte" para obtener el objeto con los routers
      const soporte = JSON.parse(data.soporte);

      // Obtener la lista de routers desde "soporte"
      const routers = soporte.WISP.parametros.routers;

      // Limpiar el contenido del select
      slcWireless.innerHTML = '';
      slcWireless.innerHTML = '<option value="" disabled selected>Seleccione una opción</option>';

      // Iterar sobre los routers y crear las opciones del select
      routers.forEach(router => {
        const option = document.createElement("option");
        option.value = router.numero;
        option.textContent = router.ssid;
        slcWireless.appendChild(option);
      });
    } catch (error) {
      console.error("Error al cargar los routers:", error);
    }
  }

  async function cargarDatosEnInputs() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.get("idReporte");
      let idReporte = urlParams.get("idReporte");
      const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idReporte}`);
      const data = await respuesta.json();
      console.log(data);

      const datos = JSON.parse(data[0].soporte);
      console.log(datos);
      txtBase.value = datos.WISP.parametros.base;
      txtIp.value = datos.WISP.parametros.routers[0].lan;
      txtAcceso.value = datos.WISP.parametros.routers[0].acceso;
      txtSenial.value = datos.WISP.parametros.signalstrength;
      txtRouterSsid.value = datos.WISP.parametros.routers[0].ssid;
      txtRouterSeguridad.value = datos.WISP.parametros.routers[0].seguridad;
      txtRouterpuertaEnlace.value = datos.WISP.parametros.routers[0].puertaenlace;
      txtRouterWan.value = datos.WISP.parametros.routers[0].wan;
      txtaEstadoInicial.value = data[0].descripcion_problema;
      solutionTextarea.value = data[0].descripcion_solucion;

      txtBaseNuevo.value = datos.WISP.cambios.nuevabase;
      txtIpNuevo.value = datos.WISP.cambios.routers[0].lan;
      txtRouterCambioSsid.value = datos.WISP.cambios.routers[0].ssid;
      txtAccesoNuevo.value = datos.WISP.cambios.routers[0].acceso;
      txtRouterCambioSeguridad.value = datos.WISP.cambios.routers[0].seguridad;
      txtRouterCambiopuertaEnlace.value = datos.WISP.cambios.routers[0].puertaEnlace;
      txtRouterCambioWan.value = datos.WISP.cambios.routers[0].wan;
      txtSenialNuevo.value = datos.WISP.cambios.signalstrength;
      deshabilitar();

    } catch (error) {
      console.error("Error en cargarDatosEnInputs:", error);
    }
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
        wispFiltrado = fichaInstalacion?.parametros?.routers || null;
        datosgenerales = fichaInstalacion?.parametros || null;
      }

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
      } else {
        console.warn("No se encontró un repetidor con el valor seleccionado.");
      }
    } catch (error) {
      console.error("Error al cargar datos del repetidor:", error);
    }
  }

  async function cargarSoporteAnterior(data) {
    console.log(data);
  }

  async function crearSelectYBoton() {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row g-2 mb-2 mt-2";

    const selectDiv = document.createElement("div");
    selectDiv.className = "col-md";

    const labelSelect = document.createElement("label");
    labelSelect.innerText = "Tipo de Soporte";
    selectDiv.appendChild(labelSelect);

    const selectSoporte = document.createElement("select");
    selectSoporte.id = "slcTipoSoporte";
    selectSoporte.className = "form-floating form-select";
    selectSoporte.required = true;
    selectDiv.appendChild(selectSoporte);
    rowDiv.appendChild(selectDiv);

    (async () => {
      const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=listarTipoSoporte`);
      const datos = await respuesta.json();
      selectSoporte.innerHTML = "";
      datos.forEach((element) => {
        const option = new Option(
          `${element.tipo_soporte}`,
          element.id_tipo_soporte
        );
        selectSoporte.append(option);
      });

      // Inicializar Select2 después de cargar las opciones
      $(selectSoporte).select2();
    })();

    const buttonDiv = document.createElement("div");
    buttonDiv.className = "col-md d-flex align-items-end";

    const guardarBtn = document.createElement("button");
    guardarBtn.id = "btnGuardarFicha";
    guardarBtn.className = "btn btn-primary";
    guardarBtn.type = "submit";
    guardarBtn.textContent = "Guardar Ficha";

    buttonDiv.appendChild(guardarBtn);
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
          signalstrength: txtSenial.value
        },
        cambios: {
          nuevabase: txtBaseNuevo.value,
          signalstrength: txtSenialNuevo.value,
          routers: await moficadoRuter(wispFiltrado.routers)
        },
      };
    }

    console.log(soporte);
    return soporte;

  };

  async function moficadoRuter(routers) {
    console.log(routers);
    const selectedValue = parseInt(slcWireless.value);
    return routers.map(router => {
      if (router.numero === selectedValue) {
        router.ssid = txtRouterCambioSsid.value;
        router.seguridad = txtRouterCambioSeguridad.value;
        router.lan = txtIpNuevo.value;
        router.puertaEnlace = txtRouterCambiopuertaEnlace.value;
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
            idTipoSoporte: document.getElementById("slcTipoSoporte").value,
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

  txtIp, txtIpNuevo.addEventListener("input", (event) => {
    formatoIPinput(event);
  });

  document.getElementById("btnReporte").addEventListener("click", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idReporte = urlParams.get("idReporte");
    if (idReporte) {
      window.open(`${config.HOST}views/reports/Averia_WISP/soporte.php?idSoporte=${idReporte}`, '_blank');
    } else {
      console.error("No se pudo obtener el idReporte.");
    }
  });

});
