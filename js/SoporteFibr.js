import config from "../env.js";
import { FichaInstalacion, formatoIPinput, FichaSoporteporDocServCoordenada, CompletarSoporte } from "./Herramientas.js";
import * as mapa from "./Mapa.js";

// Evento que se ejecuta cuando el DOM ha sido completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idContrato = urlParams.get("idContrato");
  const idReporte = urlParams.get("idReporte");
  const chkConfirmacion = document.getElementById("chkConfirmacion");

  document.getElementById('btnInformacion').addEventListener('click', function () {
    const parametrosContainer = document.getElementById('parametrosContainer');
    if (parametrosContainer.style.display === 'none') {
      parametrosContainer.style.display = 'block';
      this.textContent = 'Ver menos';
    } else {
      parametrosContainer.style.display = 'none';
      this.textContent = 'Ver más';
    }
  });

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
  const repetidorCambiosContainer = document.getElementById("repetidorCambiosContainer");
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
  const txtIpRepetidorModal = document.getElementById("txtIpRepetidorModal");

  const txtCambiosPassRepetidor = document.getElementById("txtCambiosPassRepetidor");
  const txtCambiosSsidRepetidor = document.getElementById("txtCambiosSsidRepetidor");

  //Área de solución
  const solutionTextarea = document.getElementById("txtaCambiosProceSolucion");

  const camposRequeridos = document.querySelectorAll(".form-control");

  let idSoporte = -1;
  let idCaja = -1;
  let jsonRepetidores = [];
  let numeroRepetidores = 0;

  // Función autoejecutable para inicializar datos
  (async function () {
    idSoporte = await obtenerReferencias();
    if (idSoporte) {
      await crearSelectYBoton();
      await cargarDatosdelSoporte();
      await cargarProblema(idSoporte);
      await llamarCajas();
    } else {
      //Aqui puedes meterle mano
      await listarReporte(idContrato, idReporte);
      await cargarProblema(idReporte);
    }
  })();

  if (slcRpetidor) {
    slcRpetidor.addEventListener("change", async () => {
      if (slcRpetidor.value) {
        repetidorCambiosContainer.style.display = 'block';
        txtCambiosSsidRepetidor.disabled = false;
        txtCambiosPassRepetidor.disabled = false;
        txtCambiosIpRepetidor.disabled = false;
      } else {
        repetidorCambiosContainer.style.display = 'none';
        txtCambiosSsidRepetidor.disabled = true;
        txtCambiosPassRepetidor.disabled = true;
        txtCambiosIpRepetidor.disabled = true;
      }
      await cargarEnInputs();
    });
  } else {
    console.error("slcRpetidor no encontrado");
  }

  chkConfirmacion.addEventListener("change", async () => {
    if (chkConfirmacion.checked) {
      await completarCamposVacios();
    } else {
      await borrarCamposVacios();
    }
  });

  async function completarCamposVacios() {
    const parametros = {
      txtCambiosPass: txtPass.value,
      txtCambiosPppoe: txtPppoe.value,
      txtCambiosClave: txtClave.value,
      txtCambiosVlan: txtVlan.value,
      txtCambiosPotencia: txtPotencia.value,
      txtCambiosSsid: txtSsid.value,
      txtCambiosIpRouter: txtIpRouter.value,
      txtCambiosSsidRepetidor: txtSSIDRepetidor.value,
      txtCambiosPassRepetidor: txtPassRepetidor.value,
      txtCambiosIpRepetidor: txtIpRepetidor.value
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
      'txtCambiosPotencia',
      'txtCambiosPass',
      'txtCambiosSsid',
      'txtCambiosIpRouter',
      'txtCambiosSsidRepetidor',
      'txtCambiosPassRepetidor',
      'txtCambiosIpRepetidor'
    ];

    campos.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.value = '';
      }
    });
  }

  // Validar campos requeridos en tiempo real
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

  async function llamarCajas() {
    const cajas = await mapa.buscarCercanos(idCaja);
    const slcCaja = document.getElementById('slcCaja');

    // Limpiar opciones anteriores
    slcCaja.innerHTML = '';

    // Agregar la opción de idCaja actual
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

    // Agregar otras opciones de cajas cercanas
    cajas.forEach(caja => {
      // Verificar si la opción ya existe
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
    const coordenada = urlParams.get("coordenada");
    const respuesta = await FichaSoporteporDocServCoordenada(doc, tiposervicio, coordenada);

    try {
      const soporte = JSON.parse(respuesta[0].soporte);

      if (soporte && soporte.fibr) {
        await cargarSoporteAnterior(soporte);
      } else {
        await CargarDatosInstalacion(doc, idSoporte);
      }

      if (idCaja === undefined) {
        console.error("Error: idCaja es undefined");
      }
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
      console.log("Error en Obtener el estado Inicial:", error);
    }
  }

  async function cargarSoporteAnterior(data) {

    const fibr = data.fibr;

    txtCliente.value = fibr.parametroscliente.usuario;
    txtNrodocumento.value = fibr.parametroscliente.Nrodoc;
    txtPlan.value = fibr.parametroscliente.plan;

    txtPppoe.value = fibr.cambiosgpon.pppoe;
    txtClave.value = fibr.cambiosgpon.clave;
    txtPotencia.value = fibr.cambiosgpon.potencia;
    chkCatv.checked = fibr.cambiosgpon.catv;
    txtVlan.value = fibr.cambiosgpon.vlan;

    txtCambiosPppoe.value = fibr.cambiosgpon.pppoe;
    txtCambiosClave.value = fibr.cambiosgpon.clave;
    txtCambiosVlan.value = fibr.cambiosgpon.vlan;

    // Asignar idCaja
    idCaja = data.idcaja;

    if (idCaja === undefined) {
      console.error("Error: idCaja es undefined");
      return;
    }

    const repetidorContainers = $('.repetidor-container');
    if (Array.isArray(fibr.cambiosgpon.repetidores) && fibr.cambiosgpon.repetidores.length > 0) {
      repetidorContainers.show();
      jsonRepetidores = fibr.cambiosgpon.repetidores;
      await cargarRepetidores(fibr.cambiosgpon.repetidores);
      mostrarRepetidoresEnModal();
    } else {
      repetidorContainers.hide();
    }

    // Cargar siempre los datos del router
    await cargarDatosRouter(fibr.cambiosgpon);
  }

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

  function crearSelectYBoton() {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row g-2 mb-2 mt-2";

    const buttonDiv = document.createElement("div");
    buttonDiv.className = "col-md d-flex justify-content-end align-items-end";

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

      // Asignar datos de la caja
      console.log(fichaInstalacion.idcaja);
      idCaja = fichaInstalacion.idcaja;

      await cargarDatosRouter(fibraFiltrado);
      if (fibraFiltrado.repetidores) {
        await cargarRepetidores(fibraFiltrado.repetidores);
        return;
      }
    } catch (error) {
      console.error("Error en data de Fibra:", error);
    }
  }

  async function cargarRepetidores(repetidorJson) {
    const slcRpetidor = document.getElementById('slcRpetidor');
    const txtCambiosSsidRepetidor = document.getElementById('txtCambiosSsidRepetidor');
    const txtCambiosPassRepetidor = document.getElementById('txtCambiosPassRepetidor');
    const txtCambiosIpRepetidor = document.getElementById('txtCambiosIpRepetidor');
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
    } else {
      repetidorContainers.hide();
      slcRpetidor.disabled = true;
      txtCambiosSsidRepetidor.disabled = true;
      txtCambiosPassRepetidor.disabled = true;
      txtCambiosIpRepetidor.disabled = true;
    }
  }

  slcRpetidor.addEventListener("change", async () => {
    await cargarEnInputs();
  });

  async function cargarEnInputs() {
    try {
      const selectedValue = parseInt(slcRpetidor.value);
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
    txtIpRouter.value = datoRouters.router.ip || "";
    txtSsid.value = datoRouters.router.ssid || "";
    txtPass.value = datoRouters.router.seguridad || "";
    console.log("Datos del router:", datoRouters.router);
  }

  async function armadoJsonFibra() {
    const response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
    const result = await response.json();

    const dataFibra = await FichaInstalacion(idSoporte);
    const fibrafiltrado = JSON.parse(dataFibra[0].ficha_instalacion).fibraoptica;

    const soporte = result[0]?.soporte ? JSON.parse(result[0].soporte) : {};
    const nuevoSoporte = { ...soporte };

    // Verificar si el cliente ya ha tenido un soporte registrado
    const yaTieneSoporte = soporte.fibr && Object.keys(soporte.fibr).length > 0;

    // Actualizar repetidores existentes
    const repetidoresActualizados = await moficadoRepetidor(fibrafiltrado.repetidores || []);

    // Filtrar los nuevos repetidores para excluir los que ya existen en la lista de repetidores actualizados
    const nuevosRepetidoresFiltrados = jsonRepetidores.filter(nuevoRepetidor =>
      !repetidoresActualizados.some(repetidorActualizado => repetidorActualizado.numero === nuevoRepetidor.numero)
    );

    // Combinar repetidores actualizados con los nuevos repetidores filtrados
    const repetidoresCombinados = [...repetidoresActualizados, ...nuevosRepetidoresFiltrados];

    const fibraData = {
      parametroscliente: {
        plan: yaTieneSoporte ? (txtPlan.value || soporte.fibr?.parametroscliente?.plan) : fibrafiltrado.plan,
        usuario: yaTieneSoporte ? (txtCliente.value || soporte.fibr?.parametroscliente?.usuario) : fibrafiltrado.usuario,
        Nrodoc: yaTieneSoporte ? (txtNrodocumento.value || soporte.fibr?.parametroscliente?.Nrodoc) : txtNrodocumento.value,
      },
      parametrosgpon: {
        pppoe: yaTieneSoporte ? (document.getElementById("txtPppoe").value || soporte.fibr?.cambiosgpon?.pppoe) : fibrafiltrado.usuario,
        clave: yaTieneSoporte ? (document.getElementById("txtClave").value || soporte.fibr?.cambiosgpon?.clave) : fibrafiltrado.claveacceso,
        potencia: yaTieneSoporte ? (document.getElementById("txtPotencia").value || soporte.fibr?.cambiosgpon?.potencia) : fibrafiltrado.potencia,
        router: yaTieneSoporte ? (soporte.fibr?.cambiosgpon?.router || JSON.parse(JSON.stringify(fibrafiltrado.router))) : JSON.parse(JSON.stringify(fibrafiltrado.router)),
        catv: yaTieneSoporte ? (soporte.fibr?.cambiosgpon?.catv || document.getElementById("chkCatv").checked) : fibrafiltrado.router.catv,
        vlan: yaTieneSoporte ? (document.getElementById("txtVlan").value || soporte.fibr?.cambiosgpon?.vlan) : fibrafiltrado.vlan,
        repetidores: yaTieneSoporte ? (soporte.fibr?.cambiosgpon?.repetidores || repetidoresCombinados) : repetidoresCombinados,
      },
      cambiosgpon: {
        pppoe: txtCambiosPppoe.value || soporte.fibr?.cambiosgpon?.pppoe,
        clave: txtCambiosClave.value || soporte.fibr?.cambiosgpon?.clave,
        potencia: txtCambiosPotencia.value || soporte.fibr?.cambiosgpon?.potencia,
        router: await modificadoRouter(fibrafiltrado.router) || soporte.fibr?.cambiosgpon?.router,
        catv: chkCambiosCatv.checked || soporte.fibr?.cambiosgpon?.catv,
        vlan: txtCambiosVlan.value || soporte.fibr?.cambiosgpon?.vlan,
        repetidores: repetidoresCombinados,
      },
    };

    nuevoSoporte.fibr = fibraData;
    nuevoSoporte.idcaja = idCaja;
    nuevoSoporte.tipoentrada = JSON.parse(dataFibra[0].ficha_instalacion).tipoentrada;

    return nuevoSoporte;
  }

  async function moficadoRepetidor() {
    if (!jsonRepetidores) {
      return null;
    }
    console.log(jsonRepetidores);
    const selectedValue = parseInt(slcRpetidor.value);
    return jsonRepetidores.map(repetidor => {
      if (repetidor.numero === selectedValue) {
        console.log("Repetidor antes de actualizar:", repetidor);
        repetidor.ssid = txtCambiosSsidRepetidor.value;
        repetidor.contrasenia = txtCambiosPassRepetidor.value;
        repetidor.ip = txtCambiosIpRepetidor.value;
        console.log("Repetidor después de actualizar:", repetidor);
      }
      return repetidor;
    });
  }

  async function modificadoRouter(router) {
    router.ssid = txtCambiosSsid.value || router.ssid;
    router.seguridad = txtCambiosPass.value || router.seguridad;
    router.ip = txtCambiosIpRouter.value || router.ip;
    console.log(router);
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
      await completarCamposVacios();

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
            //idTipoSoporte: document.getElementById("slcTipoSoporte").value,
            soporte: soporteData,
            idUserUpdate: user['idUsuario'],
            descripcion_solucion: solutionTextarea.value,
          },
        }),
      });

      const result = await response.json();
      console.log(result);

      await verificarServicioEnSoporte(idSoporte, data);
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
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
        // Eliminar la tarjeta del DOM
        card.remove();

        // Filtrar el repetidor del array jsonRepetidores
        jsonRepetidores = jsonRepetidores.filter(rep => rep.numero !== repetidor.numero);

        // Verificar si el repetidor fue eliminado correctamente
        console.log("Repetidores restantes:", jsonRepetidores);
      });
    });
  }

  // Añadir Nuevo Repetidor
  document.getElementById('btnAñadirRepetidor').addEventListener('click', async function () {
    await AgregarRepetidor();
  });

  // Cargar datos del soporte y mostrar repetidores existentes en el modal
  cargarDatosdelSoporte();
});
