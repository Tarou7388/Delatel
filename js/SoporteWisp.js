import config from "../env.js";
import { FichaSoporte, FichaSoportePorId, formatoIPinput } from "./Herramientas.js";

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

  // Cambios Wireless
  const txtBaseNuevo = document.getElementById("txtBaseNuevo");
  const txtIpNuevo = document.getElementById("txtIpNuevo");
  const txtSenialNuevo = document.getElementById("txtSenialNuevo");

  const txtRouterCambioSsid = document.getElementById("txtRouterCambioSsid");
  const txtRouterCambioSeguridad = document.getElementById("txtRouterCambioSeguridad");
  const txtRouterCambiopuertaEnlace = document.getElementById("txtRouterCambiopuertaEnlace");
  const txtRouterCambioWan = document.getElementById("txtRouterCambioWan");

  //Definicion de constantes
  const solutionTextarea = document.getElementById("txtaProceSolucion");
  const txtaEstadoInicial = document.getElementById("txtaEstadoInicial");

  let idSoporte = -1;

  (async function () {
    idSoporte = await obtenerReferencias();
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

  async function obtenerReferencias() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("idsoporte");
  };

  async function ObtenerValores() {
    const urlParams = new URLSearchParams(window.location.search);
    const doc = urlParams.get("doc");
    const idSoporte = urlParams.get("idsoporte");
    const tiposervicio = urlParams.get("tiposervicio");
    const coordenada = urlParams.get("coordenada");

    const respuesta = await FichaSoportePorId(doc, tiposervicio, coordenada);

    if (respuesta[0].soporte != "{}" && JSON.parse(respuesta[0].soporte).WISP) {
      await cargardatos(JSON.parse(respuesta[0].soporte).WISP);
    } else {
      await llenadoDeDatos(doc, idSoporte);
    }
  }

  async function llenadoDeDatos(doct, idSoporte, tiposervicio) {
    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${doct}`);
      const data = await respuesta.json();
      //Asignacion del Nombre del cliente
      txtCliente.value = data[0].nombre;
      //Asignacion del Documento del cliente
      txtNrodocumento.value = doct;

    } catch (error) {
      console.error("Error en llenadoDeDatos:", error);
    }

    try {
      const datawisp = await FichaSoporte(idSoporte);
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
  };

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
    await cargarEnInputs();
  });

  async function cargarEnInputs() {
    try {
      const selectedValue = parseInt(slcWireless.value);
      const coordenada = urlParams.get("coordenada");
      const respuesta = await FichaSoporte(idSoporte);
      const respuesta2 = await FichaSoportePorId(txtNrodocumento.value, serv, coordenada);

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
      } else {
        console.warn("No se encontró un repetidor con el valor seleccionado.");
      }
    } catch (error) {
      console.error("Error al cargar datos del repetidor:", error);
    }
  }

  async function cargardatos(data) {
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

    const datawisp = await FichaSoporte(idSoporte);
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
        router.contrasenia = txtRouterCambioSeguridad.value;
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
    const data = await ArmadoJsonWisp();
    if (await ask("¿Desea guardar la ficha?")) {
      await guardarSoporte(data)
      //window.location.href = `${config.HOST}views/Soporte/listarSoporte`;
    }
  });

  txtIp, txtIpNuevo.addEventListener("input", (event) => {
    formatoIPinput(event);
  });

});
