import config from "../env.js";
import { FichaInstalacion, formatoIPinput, FichaSoporteporDocServCoordenada } from "./Herramientas.js";
import * as mapa from "./Mapa.js";

// Evento que se ejecuta cuando el DOM ha sido completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idContrato = urlParams.get("idContrato");
  const idReporte = urlParams.get("idReporte");

  const serv = urlParams.get("tiposervicio").toLocaleLowerCase();
  const form = document.getElementById("frm-registro-fibr");

  //Parametros tecnicos de la ficha
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
  const txtaEstadoInicial = document.getElementById("txtaEstadoInicial");
  const slcCaja = document.getElementById("slcCaja");

  const txtIpRouter = document.getElementById("txtIpRouter");
  const txtIpRepetidor = document.getElementById("txtIpRepetidor");

  const txtSSIDRepetidor = document.getElementById("txtSSIDRepetidor");
  const txtPassRepetidor = document.getElementById("txtPassRepetidor");

  //Cambios de la ficha
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

  //Área de solución
  const solutionTextarea = document.getElementById("txtaCambiosProceSolucion");

  let idSoporte = -1;
  let idCaja = -1;

  // Función autoejecutable para inicializar datos
  (async function () {
    idSoporte = await obtenerReferencias();
    if (idSoporte) {
      await crearSelectYBoton();
      await cargarDatosdelSoporte();
      await cargarProblema(idSoporte);
    } else {
      //Aqui puedes meterle mano
      await listarReporte(idContrato, idReporte);
      await cargarProblema(idReporte);
    }

    const cajas = await mapa.buscarCercanos(idCaja);
    cajas.forEach(caja => {
      const option = document.createElement('option');
      option.value = caja.id_caja;
      option.text = caja.nombre;
      slcCaja.appendChild(option);
    });
    slcCaja.value = idCaja;
  })();

  async function listarReporte(idContrato, idSoporte) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Averias.controllers.php?operacion=buscarAveriaPorContrato&valor=${idContrato}`);
    const data = await respuesta.json();

    // Filtrar por idSoporte
    const soporteEspecifico = data.find(soporte => soporte.id_soporte === parseInt(idSoporte));

    if (soporteEspecifico) {
      const soporte = JSON.parse(soporteEspecifico.soporte);
      if (soporte && soporte.FIBR) {
        const fibr = soporte.FIBR;
        // Parámetros del cliente
        txtPlan.value = fibr.parametroscliente.plan || "";
        txtCliente.value = fibr.parametroscliente.usuario || "";
        txtNrodocumento.value = fibr.parametroscliente.Nrodoc || "";
        // Parámetros iniciales (parametrosgpon)
        txtPppoe.value = fibr.parametrosgpon.pppoe || "";
        txtPotencia.value = fibr.parametrosgpon.potencia || "";
        chkCatv.checked = fibr.parametrosgpon.catv || false;
        txtClave.value = fibr.parametrosgpon.clave || "";
        txtVlan.value = fibr.parametrosgpon.vlan || "";
        txtSsid.value = fibr.parametrosgpon.moden?.ssid || "";
        txtPass.value = fibr.parametrosgpon.moden?.seguridad || "";
        txtIp.value = fibr.parametrosgpon.repetidor?.[0]?.ip || "";
        slcRpetidor.value = fibr.parametrosgpon.repetidor?.length || 0;

        // Cambios realizados (cambiosgpon)
        txtCambiosPppoe.value = fibr.cambiosgpon.pppoe || "";
        txtCambiosClave.value = fibr.cambiosgpon.clave || "";
        txtCambiosVlan.value = fibr.cambiosgpon.vlan || "";
        txtCambiosPotencia.value = fibr.cambiosgpon.potencia || "";
        txtCambiosSsid.value = fibr.cambiosgpon.moden?.ssid || "";
        txtCambiosIp.value = fibr.cambiosgpon.repetidor?.[0]?.ip || "";
        chkCambiosCatv.checked = fibr.cambiosgpon.catv || false;
        txtCambiosPass.value = fibr.cambiosgpon.moden?.seguridad || "";
        deshabilitarCampos();
        // Llenar repetidor si existe
        if (fibr.parametrosgpon.repetidor?.[0]) {
          const repetidor = fibr.parametrosgpon.repetidor[0];
          txtRepetidor.value = JSON.stringify(repetidor, null, 2);
        } else {
          txtRepetidor.value = "Sin repetidores configurados";
        }
        // Solución
        solutionTextarea.value = soporteEspecifico.descripcion_solucion || "";
      }
    } else {
      console.error('No se encontró el soporte con el id especificado.');
    }
  }

  async function deshabilitarCampos() {
    txtCambiosPppoe.disabled = true;
    txtCambiosClave.disabled = true;
    txtCambiosVlan.disabled = true;
    txtCambiosPotencia.disabled = true;
    txtCambiosSsid.disabled = true;
    txtCambiosIp.disabled = true;
    chkCambiosCatv.disabled = true;
    txtCambiosPass.disabled = true;
    solutionTextarea.disabled = true;
  }

  async function cargarDatosdelSoporte() {
    const urlParams = new URLSearchParams(window.location.search);
    const doc = urlParams.get("doc");
    const tiposervicio = urlParams.get("tiposervicio");
    const coordenada = urlParams.get("coordenada");
    const respuesta = await FichaSoporteporDocServCoordenada(doc, tiposervicio, coordenada);

    if (respuesta[0].soporte != "{}" && JSON.parse(respuesta[0].soporte).FIBR) {
      await cargarSoporteAnterior(JSON.parse(respuesta[0].soporte).FIBR)
    } else {
      await CargarDatosInstalacion(doc, idSoporte);
    }
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

  async function cargarSoporteAnterior(data) {
    console.log(data);
    txtCliente.value = data.parametroscliente.usuario;
    txtNrodocumento.value = data.parametroscliente.Nrodoc;
    txtPlan.value = data.parametroscliente.plan;

    txtPppoe.value = data.cambiosgpon.pppoe;
    txtClave.value = data.cambiosgpon.clave;
    txtPotencia.value = data.cambiosgpon.potencia;
    chkCatv.checked = data.cambiosgpon.catv;
    txtVlan.value = data.cambiosgpon.vlan;

    txtCambiosPppoe.value = data.cambiosgpon.pppoe;
    txtCambiosClave.value = data.cambiosgpon.clave;
    txtCambiosVlan.value = data.cambiosgpon.vlan;


    console.log(data.cambiosgpon.repetidores);
    await cargarDatosRouter(data.cambiosgpon);
    if (data.cambiosgpon.repetidores) {
      await cargarRepetidores(data.cambiosgpon.repetidores);
      return;
    }
  }

  function crearSelectYBoton() {
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
      const fibraFiltrado = JSON.parse(dataFibra[0].ficha_instalacion).fibraoptica;
      console.log(dataFibra[0]);

      txtPlan.value = fibraFiltrado.plan;
      txtPppoe.value = fibraFiltrado.usuario;
      txtClave.value = fibraFiltrado.claveacceso;
      txtCambiosPppoe.value = fibraFiltrado.usuario;
      txtCambiosClave.value = fibraFiltrado.claveacceso;
      txtCambiosVlan.value = fibraFiltrado.vlan;
      txtPotencia.value = fibraFiltrado.potencia;
      chkCatv.checked = fibraFiltrado.router.catv;
      txtVlan.value = fibraFiltrado.vlan;

      //Asignar datos de la caja
      console.log(JSON.parse(dataFibra[0].ficha_instalacion).idcaja);
      idCaja = JSON.parse(dataFibra[0].ficha_instalacion).idcaja;

      await cargarDatosRouter(fibraFiltrado);
      if (fibraFiltrado.repetidores) {
        await cargarRepetidores(fibraFiltrado.repetidores);
        return;
      }

    } catch (error) {
      console.error("Error en data de Fibra:", error);
    }
  };

  async function cargarRepetidores(repetidorJson) {
    if (repetidorJson) {
      console.log(repetidorJson);
      const slcRpetidor = document.getElementById('slcRpetidor');
      slcRpetidor.innerHTML = '';

      slcRpetidor.innerHTML = '<option value="" disabled selected>Seleccione una opción</option>';
      if (Array.isArray(repetidorJson) && repetidorJson.length > 0) {

        repetidorJson.forEach(repetidor => {
          const option = document.createElement('option');
          option.value = repetidor.numero;
          option.text = `${repetidor.ssid} (${repetidor.ip})`;
          slcRpetidor.appendChild(option);
        });


      } else {
        console.error('No se encontraron repetidores o el formato es incorrecto.');
      }
    }
  }

  slcRpetidor.addEventListener("change", async () => {
    await cargarEnInputs();
  });

  async function cargarEnInputs() {
    try {
      const selectedValue = parseInt(slcRpetidor.value);
      const coordenada = urlParams.get("coordenada");
      const respuesta = await FichaInstalacion(idSoporte);
      const respuesta2 = await FichaSoporteporDocServCoordenada(txtNrodocumento.value, serv, coordenada);

      let fibraFiltrado = null;
      let datosgenerales = null;
      if (!respuesta2[0]?.soporte || respuesta2[0]?.soporte === "{}" || !JSON.parse(respuesta2[0].soporte)?.FIBR) {
        const fichaInstalacion = JSON.parse(respuesta[0]?.ficha_instalacion || "{}");

        fibraFiltrado = fichaInstalacion?.fibraoptica?.repetidores || null;
        datosgenerales = fichaInstalacion?.fibraoptica || null;
      } else {
        const soporte = JSON.parse(respuesta2[0]?.soporte || "{}");
        fibraFiltrado = soporte?.FIBR?.cambiosgpon?.repetidores || null;
        datosgenerales = soporte?.FIBR?.cambiosgpon || null;
      }
      if (!fibraFiltrado) {
        console.log(datosgenerales);
        await cargarDatosRouter(datosgenerales);
        return;
      }
      const repetidorSeleccionado = fibraFiltrado.find(
        (repetidor) => repetidor.numero === selectedValue
      );

      if (repetidorSeleccionado) {
        txtIpRepetidor.value = repetidorSeleccionado.ip || "";
        txtSSIDRepetidor.value = repetidorSeleccionado.ssid || "";
        txtPassRepetidor.value = repetidorSeleccionado.contrasenia || "";
      } else {
        console.warn("No se encontró un repetidor con el valor seleccionado.");
      }
    } catch (error) {
      console.error("Error al cargar datos del repetidor:", error);
    }
  }

  async function cargarDatosRouter(datoRouters) {
    console.log(datoRouters);
    txtIpRouter.value = datoRouters.router.ip;
    txtSsid.value = datoRouters.router.ssid;
    txtPass.value = datoRouters.router.seguridad;
  }

  async function armadoJsonFibra() {
    const response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
    const result = await response.json();

    const dataFibra = await FichaInstalacion(idSoporte);
    const fibrafiltrado = JSON.parse(dataFibra[0].ficha_instalacion).fibraoptica;

    let soporte = result[0].soporte ? JSON.parse(result[0].soporte) : {};

    const existeClave = Object.keys(soporte).includes(serv);

    let fibraData = {
      parametroscliente: {
        plan: txtPlan.value,
        usuario: txtCliente.value,
        Nrodoc: txtNrodocumento.value,
      },
      parametrosgpon: {
        pppoe: document.getElementById("txtPppoe").value,
        clave: document.getElementById("txtClave").value,
        potencia: document.getElementById("txtPotencia").value,
        router: JSON.parse(JSON.stringify(fibrafiltrado.router)),
        catv: document.getElementById("chkCatv").checked,
        vlan: document.getElementById("txtVlan").value,
        repetidores: JSON.parse(JSON.stringify(fibrafiltrado.repetidores))
      },
      cambiosgpon: {
        pppoe: txtCambiosPppoe.value,
        clave: txtCambiosClave.value,
        potencia: txtCambiosPotencia.value,
        router: await modificadoRouter(fibrafiltrado.router),
        catv: chkCambiosCatv.checked,
        vlan: txtCambiosVlan.value,
        repetidores: await moficadoRepetidor(fibrafiltrado.repetidores)
      }
    };

    // Mover `idcaja` y `tipoentrada` fuera de `soporte[serv]`
    if (!existeClave) {
      soporte[serv] = fibraData;
    }

    return {
      idcaja: idCaja,
      tipoentrada: JSON.parse(dataFibra[0].ficha_instalacion).tipoentrada,
      soporte
    };
  }


  async function moficadoRepetidor(repetidores) {
    if (!repetidores) {
      return null;
    }
    console.log(repetidores);
    const selectedValue = parseInt(slcRpetidor.value);
    return repetidores.map(repetidor => {
      if (repetidor.numero === selectedValue) {
        repetidor.ssid = txtCambiosSsid.value;
        repetidor.contrasenia = txtCambiosPass.value;
        repetidor.ip = txtCambiosIpRepetidor.value;
      }
      return repetidor;
    });
  }

  async function modificadoRouter(router) {
    router.ssid = txtCambiosSsid.value;
    router.seguridad = txtCambiosPass.value;
    router.ip = txtCambiosIpRouter.value;
    console.log(router);
    return router;
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
            idTecnico: user['idUsuario'],
            idTipoSoporte: document.getElementById("slcTipoSoporte").value,
            soporte: soporteData,
            idUserUpdate: user['idUsuario'],
            descripcion_solucion: solutionTextarea.value,
          },
        }),
      });

      const result = await response.json();

    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = await armadoJsonFibra();
    if (await ask("¿Desea guardar la ficha?")) {
      await guardarSoporte(data);
      //window.location.href = `${config.HOST}views/Soporte/listarSoporte`;
    }
  });

  txtIpRouter, txtIpRepetidor, txtCambiosIpRouter, txtCambiosIpRepetidor.addEventListener("input", formatoIPinput);

});
