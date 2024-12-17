import config from "../env.js";
import { FichaInstalacion, formatoIPinput, FichaSoporteporDocServCoordenada } from "./Herramientas.js";

// Evento que se ejecuta cuando el DOM ha sido completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idContrato = urlParams.get("idContrato");
  const idReporte = urlParams.get("idReporte");
  const serv = urlParams.get("tiposervicio");
  const form = document.getElementById("frm-registro-gpon");
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

  //Cambios de la ficha
  const txtCambiosPppoe = document.getElementById("txtCambiosPppoe");
  const txtCambiosClave = document.getElementById("txtCambiosClave");
  const txtCambiosVlan = document.getElementById("txtCambiosVlan");

  const txtRepetidor = document.getElementById("txtRepetidor");

  const txtCambiosPotencia = document.getElementById("txtCambiosPotencia");
  const txtCambiosSsid = document.getElementById("txtCambiosSsid");
  const txtCambiosIp = document.getElementById("txtCambiosIp");
  const chkCambiosCatv = document.getElementById("chkCambiosCatv");
  const txtCambiosPass = document.getElementById("txtCambiosPass");


  const solutionTextarea = document.getElementById("txtaCambiosProceSolucion");

  let idSoporte = -1;

  // Función autoejecutable para inicializar datos
  (async function () {
    try {
      idSoporte = await obtenerReferencias();
      if (idSoporte) {
        await crearSelectYBoton();
        await ObtenerValores();
        await cargarProblema(idSoporte);
      } else {
        //Aqui puedes meterle mano
        await listarReporte(idContrato, idReporte);
        await cargarProblema(idReporte);
      }
    } catch (error) {
      console.error("Error durante la inicialización:", error);
    }
  })();
  async function listarReporte(idContrato, idSoporte) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Averias.controllers.php?operacion=buscarAveriaPorContrato&valor=${idContrato}`);
    const data = await respuesta.json();

    // Filtrar por idSoporte
    const soporteEspecifico = data.find(soporte => soporte.id_soporte === parseInt(idSoporte));

    if (soporteEspecifico) {
      console.log(soporteEspecifico);
      // Convertir el soporte a un objeto JSON
      const soporte = JSON.parse(soporteEspecifico.soporte);
      // Llenar los campos del formulario
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
        slcRpetidor.value = fibr.parametrosgpon.repetidor?.length || 0; // Cantidad de repetidores

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

  async function ObtenerValores() {
    const urlParams = new URLSearchParams(window.location.search);
    const doc = urlParams.get("doc");
    const idSoporte = urlParams.get("idsoporte");
    const tiposervicio = urlParams.get("tiposervicio");
    const coordenada = urlParams.get("coordenada");

    console.log(doc);

    const respuesta = await FichaSoporteporDocServCoordenada(doc, tiposervicio, coordenada);

    if (respuesta[0].soporte != "{}") {
      if (JSON.parse(respuesta[0].soporte).FIBR) {
        await cargardatos(JSON.parse(respuesta[0].soporte).FIBR);
      }
      else {
        await llenadoDeDatos(doc, idSoporte);
      }
    } else {
      await llenadoDeDatos(doc, idSoporte);
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

  async function cargardatos(data) {
    console.log(data);
    //Asignar el nombre del cliente
    txtCliente.value = data.parametroscliente.usuario;
    //Asignar el documento del cliente
    txtNrodocumento.value = data.parametroscliente.Nrodoc;
    //Asignar el plan
    txtPlan.value = data.parametroscliente.plan;

    //Asignar el usuario PPPoE
    txtPppoe.value = data.cambiosgpon.pppoe;
    //Asignar la clave PPPoE
    txtClave.value = data.cambiosgpon.clave;
    //Asignar la potencia
    txtPotencia.value = data.cambiosgpon.potencia;
    //Asignar si tiene CATV
    chkCatv.checked = data.cambiosgpon.catv;
    //Asignar la VLAN
    txtVlan.value = data.cambiosgpon.vlan;

    //Asignacion de los campos que no pueden cambiar sin procesos externos
    txtCambiosPppoe.value = data.cambiosgpon.pppoe;
    txtCambiosClave.value = data.cambiosgpon.clave;
    txtCambiosVlan.value = data.cambiosgpon.vlan;

    //Asignar el repetidor
    console.log(data.cambiosgpon);

    if (!data.cambiosgpon.repetidor || data.cambiosgpon.repetidor == null) {
      console.log(data.cambiosgpon);
      await cargardatosModem(data.cambiosgpon);
    }
    await cargarRepetidores(data.cambiosgpon.repetidor);
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
    // Obtener el id del soporte desde la URL
    return urlParams.get("idsoporte");
  };

  /**
   * Documentacion sobre que hace:
   * Llenado de datos del cliente y soporte de fibra.
   *
   * @async
   * @function llenadoDeDatos
   * @param {string} doct - Documento del cliente.
   * @param {number} idSoporte - ID del soporte.
   * @param {string} tiposervicio - Tipo de servicio.
   * @returns {Promise<void>} - Promesa que se resuelve cuando los datos han sido llenados.
   * @throws {Error} - Lanza un error si ocurre un problema al obtener los datos del cliente o del soporte.
   */
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
      const dataFibra = await FichaInstalacion(idSoporte);
      const fibraFiltrado = JSON.parse(dataFibra[0].ficha_instalacion).fibraOptica;
      console.log(dataFibra[0]);

      // Asignacion para el campo de plan.
      console.log(fibraFiltrado.plan);
      txtPlan.value = fibraFiltrado.plan;

      // Asignacion de Usuario PPPoE
      console.log(fibraFiltrado.usuario);
      txtPppoe.value = fibraFiltrado.usuario;

      // Asignacion de clave PPPoE
      console.log(fibraFiltrado.claveAcceso);
      txtClave.value = fibraFiltrado.claveAcceso;

      //Asignacion de los campos que no pueden cambiar sin procesos externos
      txtCambiosPppoe.value = fibraFiltrado.usuario;
      txtCambiosClave.value = fibraFiltrado.claveAcceso;
      txtCambiosVlan.value = fibraFiltrado.vlan;

      // Asignacion potencia 
      console.log(fibraFiltrado);
      txtPotencia.value = fibraFiltrado.potencia;

      // Catv
      console.log(fibraFiltrado.moden.catv);
      chkCatv.checked = fibraFiltrado.moden.catv;

      // Vlan
      console.log(fibraFiltrado.vlan);
      txtVlan.value = fibraFiltrado.vlan;

      // DATOS MODEN
      // Asignacion repetidores
      if (!fibraFiltrado.repetidores) {
        console.log(fibraFiltrado);
        await cargardatosModem(fibraFiltrado);
        return;
      } else {
        await cargarRepetidores(fibraFiltrado.repetidores);
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
      const nombreRepetidor = slcRpetidor.options[slcRpetidor.selectedIndex]?.text || "Sin nombre";
      const coordenada = urlParams.get("coordenada");
      const respuesta = await FichaInstalacion(idSoporte);
      const respuesta2 = await FichaSoporteporDocServCoordenada(txtNrodocumento.value, serv, coordenada);

      let fibraFiltrado = null;
      let datosgenerales = null;
      if (!respuesta2[0]?.soporte || respuesta2[0]?.soporte === "{}" || !JSON.parse(respuesta2[0].soporte)?.FIBR) {
        const fichaInstalacion = JSON.parse(respuesta[0]?.ficha_instalacion || "{}");
        fibraFiltrado = fichaInstalacion?.fibraOptica?.repetidores || null;
        datosgenerales = fichaInstalacion?.fibraOptica || null;
      } else {
        const soporte = JSON.parse(respuesta2[0]?.soporte || "{}");
        fibraFiltrado = soporte?.FIBR?.cambiosgpon?.repetidor || null;
        datosgenerales = soporte?.FIBR?.cambiosgpon || null;
      }
      if (!fibraFiltrado) {
        console.log(datosgenerales);
        await cargardatosModem(datosgenerales);
        return;
      }
      const repetidorSeleccionado = fibraFiltrado.find(
        (repetidor) => repetidor.numero === selectedValue
      );

      if (repetidorSeleccionado) {
        txtIp.value = repetidorSeleccionado.ip || "";
        txtSsid.value = repetidorSeleccionado.ssid || "";
        txtPass.value = repetidorSeleccionado.contrasenia || "";
        txtRepetidor.value = nombreRepetidor;
      } else {
        console.warn("No se encontró un repetidor con el valor seleccionado.");
      }
    } catch (error) {
      console.error("Error al cargar datos del repetidor:", error);
    }
  }


  //Funcion para cargar los datos del modem en caso no haya repetidor
  async function cargardatosModem(DatoModem) {
    console.log(DatoModem);
    slcRpetidor.innerHTML = 'No hay repetidores';

    slcRpetidor.disabled = true;
    //txtIp.value = DatoModem.moden.ip;
    txtSsid.value = DatoModem.moden.ssid;
    txtPass.value = DatoModem.moden.seguridad;
    txtRepetidor.value = "No hay repetidores";
  }


  async function ArmadoJsonGpon() {
    const response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
    const result = await response.json();

    const dataFibra = await FichaInstalacion(idSoporte);
    const fibraFiltrado = JSON.parse(dataFibra[0].ficha_instalacion).fibraOptica;

    let soporte = result[0].soporte ? JSON.parse(result[0].soporte) : {};

    const existeClave = Object.keys(soporte).includes(serv);

    if (!existeClave) {
      soporte[serv] = {
        parametroscliente: {
          plan: txtPlan.value,
          usuario: txtCliente.value,
          Nrodoc: txtNrodocumento.value,
        },
        parametrosgpon: {
          pppoe: document.getElementById("txtPppoe").value,
          clave: document.getElementById("txtClave").value,
          potencia: document.getElementById("txtPotencia").value,
          moden: JSON.parse(JSON.stringify(fibraFiltrado.moden)),
          catv: document.getElementById("chkCatv").checked,
          vlan: document.getElementById("txtVlan").value,
          repetidor: fibraFiltrado.repetidores ? JSON.parse(JSON.stringify(fibraFiltrado.repetidores)) : null
        },
        cambiosgpon: {
          pppoe: txtCambiosPppoe.value,
          clave: txtCambiosClave.value,
          potencia: txtCambiosPotencia.value,
          moden: await modificadoModem(fibraFiltrado.moden),
          catv: chkCambiosCatv.checked,
          vlan: txtCambiosVlan.value,
          repetidor: await moficadoRepetidor(fibraFiltrado.repetidores)
        }
      };
    }

    return soporte;
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
        repetidor.ip = txtCambiosIp.value;
      }
      return repetidor;
    });
  }

  async function modificadoModem(modem) {
    modem.ssid = txtCambiosSsid.value;
    modem.seguridad = txtCambiosPass.value;
    //modem.ip = txtCambiosIp.value;
    console.log(modem);
    return modem;
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
      console.log(result.status);
      if (result.status === "success") {
        console.log("Soporte actualizado correctamente.");
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }


  /**
   * Llama a la función ArmadoJsonCable para recuperar datos.
   * 
   * @returns {Promise<Object>} Los datos devueltos por la función ArmadoJsonCable.
   */
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = await ArmadoJsonGpon();
    if (await ask("¿Desea guardar la ficha?")) {
      await guardarSoporte(data);
      window.location.href = `${config.HOST}views/Soporte/listarSoporte`;
    }
  });

  txtCambiosIp.addEventListener("input", async (event) => {
    await formatoIPinput(event);
  });

});
