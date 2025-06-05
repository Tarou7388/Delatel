import config from "../env.js";
import { FichaInstalacion, FichaSoporteporDocServCoordenada, validarValorRango, CompletarSoporte } from "./Herramientas.js";
import * as mapa from "./Mapa.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener("DOMContentLoaded", async () => {
  const txtPotencia = document.getElementById("txtPotencia");
  const txtSintonizador = document.getElementById("txtSintonizador");
  const slcTriplexor = document.getElementById("slcTriplexor");
  const txtNumSpliter = document.getElementById("txtNumSpliter");
  const txtCable = document.getElementById("txtCable");
  const txtConector = document.getElementById("txtConector");
  const txtPrecioCable = document.getElementById("txtPrecioCable");
  const txtPrecioConector = document.getElementById("txtPrecioConector");
  const txtaEstadoInicial = document.getElementById("txtaEstadoInicial");
  const slcSpliter = document.getElementById("slcSpliter");
  const lblTriplexor = document.getElementById("lblTriplexor");
  const lblSpliter = document.getElementById("lblSpliter");
  const lblNumSpliter = document.getElementById("lblNumSpliter");
  const lblCable = document.getElementById("lblCable");
  const lblPrecioCable = document.getElementById("lblPrecioCable");
  const lblConector = document.getElementById("lblConector");
  const lblPrecioConector = document.getElementById("lblPrecioConector");
  const lblEstadoInicial = document.getElementById("lblEstadoInicial");
  const txtDetalleCosto = document.getElementById("txtDetalleCosto");

  const txtNapGpon = document.getElementById("txtNapGpon");
  const txtNapCatv = document.getElementById("txtNapCatv");
  const txtCasaGpon = document.getElementById("txtCasaGpon");
  const txtCasaCatv = document.getElementById("txtCasaCatv");

  const lblnapgpon = document.getElementById("lblnapgpon");
  const lblnapcatv = document.getElementById("lblnapcatv");
  const lblcasagpon = document.getElementById("lblcasagpon");
  const lblcasacatv = document.getElementById("lblcasacatv");

  const txtCambioNapGpon = document.getElementById("txtCambioNapGpon");
  const txtCambioNapCatv = document.getElementById("txtCambioNapCatv");
  const txtCambioCasaGpon = document.getElementById("txtCambioCasaGpon");
  const txtCambioCasaCatv = document.getElementById("txtCambioCasaCatv");

  const txtPotenciaCambio = document.getElementById("txtPotenciaCambio");
  const txtPrecioCableCambio = document.getElementById("txtPrecioCableCambio");
  const txtPrecioConectorCambio = document.getElementById("txtPrecioConectorCambio");
  const txtSintonizadorCambio = document.getElementById("txtSintonizadorCambio");

  const txtPlan = document.getElementById("txtPlan");
  const txtCliente = document.getElementById("txtCliente");
  const txtNrodocumento = document.getElementById("txtNrodocumento");
  const slcCaja = document.getElementById("slcCaja");
  const txtPuerto = document.getElementById("txtPuerto");
  const txtPuertoCambio = document.getElementById("txtPuertoCambio");
  const checkConfirmacion = document.getElementById("chkConfirmacion");

  const form = document.getElementById("form-cable");
  const btnReporte = document.getElementById("btnReporte");

  const urlParams = new URLSearchParams(window.location.search);
  const idReporte = urlParams.get("idReporte");
  const formulario = document.getElementById("form-sintonizador");

  let CostosCable = 0;
  let CostosConector = 0;

  let infoSintonizadores = [];
  let jsonSintonizadorOriginal = [];
  let login = await Herramientas.obtenerLogin();
  let idSector = -1;
  let codigoBarraSintonizador = "";

  if (!idReporte) {
    btnReporte.style.display = "none";
  }

  let jsonSintonizador = [];
  let sintonizadoresData = [];
  let idSoporte = -1;
  let idCaja = -1;

  (async function () {
    idSoporte = await obtenerReferencias();
    if (idSoporte) {
      await ObtenerValores();
      crearBotones();
      configurarVerMas();
    }
  })();

  async function cargarSoporteAnterior(data, idSoporte) {
    const dataCambioCable = JSON.parse(data[0].soporte).cabl.cambioscable
    try {

      const respuestaProblema = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
      const dataProblema = await respuestaProblema.json();

      const nombreCliente = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${dataProblema[0].nro_doc}`);
      const dataCliente = await nombreCliente.json();

      const dataCable = await FichaInstalacion(idSoporte);
      const cableFiltrado = JSON.parse(dataCable[0].ficha_instalacion).cable;

      idCaja = JSON.parse(dataCable[0].ficha_instalacion).idcaja;

      console.log(data);
      txtCliente.value = dataCliente[0].nombre;
      txtNrodocumento.value = dataProblema[0].nro_doc;

      if (dataProblema.length > 0 && dataProblema[0].descripcion_problema) {
        $("#txtaEstadoInicial").val(dataProblema[0].descripcion_problema);
      } else {
        console.warn("No se encontró descripción del problema.");
      }

      txtPotencia.value = dataCambioCable.potencia || "";
      txtNapGpon.value = dataCambioCable.costo.nap.gpon;
      txtNapCatv.value = dataCambioCable.costo.nap.catv;
      txtCasaGpon.value = dataCambioCable.costo.casa.gpon;
      txtCasaCatv.value = dataCambioCable.costo.casa.catv;

      txtDetalleCosto.value = dataCambioCable.costo.cablecosto.detalle;

      infoSintonizadores = await contabilizarSintonizadores(dataCambioCable.sintonizadores);
      sintonizadoresData = infoSintonizadores;
      txtSintonizador.value = infoSintonizadores.length;

      for (let i = 0; i < slcTriplexor.options.length; i++) {
        if (slcTriplexor.options[i].text.trim().toLowerCase() === dataCambioCable.triplexor?.trim().toLowerCase()) {
          slcTriplexor.selectedIndex = i;
          break;
        }
      }

      txtNumSpliter.value = dataCambioCable.splitter?.[0]?.cantidad || "";
      const tipoSpliter = dataCambioCable.splitter?.[0]?.tipo || 0;
      const opcionesSpliter = slcSpliter.options;

      for (let i = 0; i < opcionesSpliter.length; i++) {
        if (opcionesSpliter[i].value == tipoSpliter) {
          slcSpliter.selectedIndex = i;
          break;
        }
      }

      const response = await fetch(
        `${config.HOST}app/controllers/Paquete.controllers.php?operacion=buscarPaqueteId&idPaquete=${dataCable[0].id_paquete}`
      );
      const paquete = await response.json();

      txtPlan.value = paquete[0].paquete;
      txtPuerto.value = JSON.parse(data[0].soporte).puerto;

      txtCable.value = dataCambioCable.cable?.metrosadicionales || 0;

      txtPrecioCable.value = parseFloat((
        (dataCambioCable.cable?.metrosadicionales || 0) *
        (parseFloat(cableFiltrado.cable.preciometro) || 0)
      ).toFixed(2));

      txtConector.value = dataCambioCable.conector?.numeroconector || 0;
      txtPrecioConector.value = parseFloat((
        (dataCambioCable.conector?.numeroconector || 0) *
        (parseFloat(cableFiltrado.conector.precio) || 0)
      ).toFixed(2));


      txtPrecioCableCambio.value = parseFloat(cableFiltrado.cable.preciometro) || 0;
      txtPrecioConectorCambio.value = parseFloat(cableFiltrado.conector.precio) || 0;


    } catch (error) {
      console.error("Error al cargar los datos del soporte:", error);
    }
  };
  async function CargardatosInstalacion(doc, idSoporte) {
    try {
      const respuestaProblema = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
      const dataProblema = await respuestaProblema.json();
      $("#txtaEstadoInicial").val(dataProblema[0].descripcion_problema);
    } catch (error) {
      console.error("Error en descripcion_problema:", error);
    };

    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${doc}`);
      const data = await respuesta.json();
      txtCliente.value = data[0].nombre;
      txtNrodocumento.value = doc;
    } catch (error) {
      console.error("Error en CargarDatosInstalacion:", error);
    }

    try {
      const dataCable = await FichaInstalacion(idSoporte);
      const fichaInstalacion = JSON.parse(dataCable[0].ficha_instalacion);
      console.log(JSON.parse(dataCable[0].ficha_instalacion).cable.periodo);
      const cableFiltrado = fichaInstalacion.cable;

      console.log(fichaInstalacion.costo);

      txtNapGpon.value = fichaInstalacion.costo.nap.gpon;
      txtNapCatv.value = fichaInstalacion.costo.nap.catv;
      txtCasaGpon.value = fichaInstalacion.costo.casa.gpon;
      txtCasaCatv.value = fichaInstalacion.costo.casa.catv;

      txtDetalleCosto.value = fichaInstalacion.costo.cablecosto.detalle;

      let sintonizadores = null;
      if (cableFiltrado.sintonizadores) {
        sintonizadores = cableFiltrado.sintonizadores.length;
      } else {
        sintonizadores = 0;
      }

      infoSintonizadores = await contabilizarSintonizadores(cableFiltrado.sintonizadores);

      const cargador = JSON.parse(cableFiltrado.triplexor.cargador);
      const requerido = JSON.parse(cableFiltrado.triplexor.requerido);

      const response = await fetch(
        `${config.HOST}app/controllers/Paquete.controllers.php?operacion=buscarPaqueteId&idPaquete=${dataCable[0].id_paquete}`
      );
      const paquete = await response.json();

      txtPlan.value = paquete[0].paquete;
      idSector = dataCable[0].id_sector;
      txtPotencia.value = cableFiltrado.potencia;
      txtSintonizador.value = sintonizadores;

      if (!cargador && requerido) {
        slcTriplexor.selectedIndex = 3;
      } else if (cargador && requerido) {
        slcTriplexor.selectedIndex = 2;
      } else {
        slcTriplexor.selectedIndex = 1;
      }

      txtNumSpliter.value = cableFiltrado.splitter[0].cantidad;
      slcSpliter.value = cableFiltrado.splitter[0].tipo;

      txtCable.value = cableFiltrado.cable.metrosadicionales;
      txtPrecioCable.value = (cableFiltrado.cable.metrosadicionales * parseFloat(cableFiltrado.cable.preciometro));

      txtConector.value = cableFiltrado.conector.numeroconector;
      txtPrecioCableCambio.value = parseFloat(cableFiltrado.cable.preciometro);

      console.log(cableFiltrado);

      txtPrecioConectorCambio.value = cableFiltrado.conector.precio;
      txtPrecioConector.value = cableFiltrado.conector.numeroconector * cableFiltrado.conector.precio;

      txtPuerto.value = parseInt(fichaInstalacion.puerto) || 0;

      idCaja = fichaInstalacion.idcaja;

      document.getElementById('btnlistar').addEventListener('click', async () => {
        try {

          const dataCable = await FichaInstalacion(idSoporte);
          const cableFiltrado = JSON.parse(dataCable[0].ficha_instalacion).cable;

          const sintonizadores = cableFiltrado.sintonizadores || [];
          const container = document.getElementById('sintonizadoresContainer');
          container.innerHTML = '';


          sintonizadores.forEach((sintonizador, index) => {
            const card = document.createElement('div');
            card.className = 'col-12 col-md-6 col-lg-4';

            card.innerHTML = `
              <div class="card border-primary">
                <div class="card-body">
                  <h5 class="card-title">Sintonizador ${index + 1}</h5>
                  <p class="card-text">
                    <strong>Código de barra:</strong> ${sintonizador.codigobarra}<br>
                    <strong>Marca:</strong> ${sintonizador.marca}<br>
                    <strong>Modelo:</strong> ${sintonizador.modelo}<br>
                    <strong>Precio:</strong> ${sintonizador.precio}<br>
                    <strong>Serie:</strong> ${sintonizador.serie}
                  </p>
                </div>
              </div>
            `;

            container.appendChild(card);
          });
        } catch (error) {
          console.error("Error al listar los sintonizadores:", error);
        }
      });

    } catch (error) {
      console.error("Error en FichaInstalacion:", error);
    }

    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
      const data = await respuesta.json();
      txtaEstadoInicial.value = data[0].descripcion_problema;

    } catch (error) {
      console.error("Error en obtener el problema:", error);
    }
  };
  async function llamarCajas() {
    let cajas = [];
    console.log("idCaja", idCaja);
    console.log("idSector", idSector);

    if (!idCaja || idCaja == 0 || idCaja == -1) {
      cajas = await mapa.buscarCajasporSector(idSector);
    } else {
      cajas = await mapa.buscarCercanos(idCaja);
    }

    const slcCaja = document.getElementById('slcCaja');
    slcCaja.innerHTML = ''; // Limpiar el select

    if (idCaja !== undefined && idCaja !== null) {
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
  };
  async function completarCamposDeCambio() {
    const parametrosTecnicos = {
      txtPotenciaCambio: txtPotencia.value,
      txtSintonizadorCambio: parseInt(infoSintonizadores.length),
      slcTriplexorCambio: slcTriplexor.value,
      txtNumSpliterCambio: txtNumSpliter.value,
      slcSpliterCambio: slcSpliter.value,
      txtCableCambio: txtCable.value,
      txtPuertoCambio: txtPuerto.value,
      txtConectorCambio: txtConector.value,
      txtCambioCasaCatv: txtCasaCatv.value,
      txtCambioCasaGpon: txtCasaGpon.value,
      txtCambioNapCatv: txtNapCatv.value,
      txtCambioNapGpon: txtNapGpon.value,
    };

    for (const [id, value] of Object.entries(parametrosTecnicos)) {
      const input = document.getElementById(id);
      if (input && !input.value) {
        input.value = value;
      }
    }

    infoSintonizadores.forEach((sintonizador) => {
      jsonSintonizador.push(sintonizador);
    });

    jsonSintonizadorOriginal = JSON.parse(JSON.stringify(jsonSintonizador));

    await pintarSintonizador(infoSintonizadores);
  };
  async function borrarCamposDeCambio() {
    const camposCambio = [
      'txtPotenciaCambio',
      'txtSintonizadorCambio',
      'slcTriplexorCambio',
      'txtNumSpliterCambio',
      'slcSpliterCambio',
      'txtCableCambio',
      'txtPuertoCambio',
      'txtConectorCambio',
      'txtCambioCasaCatv',
      'txtCambioCasaGpon',
      'txtCambioNapCatv',
      'txtCambioNapGpon',

    ];

    camposCambio.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        if (input.tagName === "SELECT") {
          input.selectedIndex = 0;
        } else {
          input.value = '';
        }
      }
    });

    jsonSintonizador = [];

  };
  function configurarVerMas() {
    const elementosOcultar = [
      slcTriplexor, slcSpliter, txtNumSpliter, txtCable, txtConector, txtPrecioCable,
      txtPrecioConector, txtaEstadoInicial, lblTriplexor, lblSpliter,
      lblNumSpliter, lblCable, lblPrecioCable, lblConector, lblPrecioConector, lblEstadoInicial, txtNapGpon,
      txtNapCatv, txtCasaGpon, txtCasaCatv, lblnapgpon, lblnapcatv, lblcasagpon, lblcasacatv
    ];

    elementosOcultar.forEach(elemento => {
      if (elemento) {
        elemento.style.display = "none";
      }
    });
    const verMasBtn = document.createElement("button");
    verMasBtn.textContent = "Ver más";
    verMasBtn.className = "btn btn-link mt-2 mb-2";
    verMasBtn.type = "button";
    let mostrando = false;
    verMasBtn.addEventListener("click", () => {
      mostrando = !mostrando;
      elementosOcultar.forEach(elemento => {
        if (elemento) {
          elemento.style.display = mostrando ? "block" : "none";
        }
      });
      verMasBtn.textContent = mostrando ? "Ver menos" : "Ver más";
    });

    const form = document.getElementById("form-cable");
    const hrElements = form.querySelectorAll("hr");
    if (hrElements.length > 1) {
      hrElements[1].insertAdjacentElement("afterend", verMasBtn);
    } else {
      form.appendChild(verMasBtn);
    }
  };
  async function ObtenerValores() {
    const urlParams = new URLSearchParams(window.location.search);
    const doc = urlParams.get("doc");
    const idSoporte = urlParams.get("idsoporte");
    const tiposervicio = urlParams.get("tiposervicio");
    const coordenada = urlParams.get("coordenada");

    const respuesta = await FichaSoporteporDocServCoordenada(doc, tiposervicio, coordenada);

    console.log(JSON.parse(respuesta[0].soporte));

    if (respuesta[0].soporte != "{}" && JSON.parse(respuesta[0].soporte).cabl) {
      console.log("ANTERIOR")
      await cargarSoporteAnterior(respuesta, idSoporte);
    } else {
      console.log("INSTALACION")
      await CargardatosInstalacion(doc, idSoporte);
    }

    await llamarCajas();
  };
  function mostrarSintonizadoresEnModal() {
    const container = document.getElementById("sintonizadoresContainer");
    container.innerHTML = "";

    if (sintonizadoresData.length == 0) {
      container.innerHTML = "<p class='text-center'>No hay sintonizadores disponibles.</p>";
      return;
    }

    sintonizadoresData.forEach((sintonizador, index) => {
      const card = document.createElement("div");
      card.className = "col-md-4";
      card.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Sintonizador ${index + 1}</h5>
            <p class="card-text">Código de Barra: ${sintonizador.codigobarra || "N/A"}</p>
            <p class="card-text">Marca: ${sintonizador.marca || "N/A"}</p>
            <p class="card-text">Modelo: ${sintonizador.modelo || "N/A"}</p>
            <p class="card-text">Precio: ${sintonizador.precio || "N/A"}</p>
            <p class="card-text">Serie: ${sintonizador.serie || "N/A"}</p>
        </div>
      `;
      container.appendChild(card);
    });
  };
  async function obtenerReferencias() {
    const urlParams = new URLSearchParams(window.location.search);
    const idSoporte = urlParams.get("idsoporte");
    return idSoporte;
  };
  async function contabilizarSintonizadores(sintonizadores) {
    let sintonizadorContador = [];


    if (!Array.isArray(sintonizadores)) {
      sintonizadores = [sintonizadores];
    }


    sintonizadores.forEach((sintonizador) => {
      if (!sintonizadorContador.some(existing => existing.serie === sintonizador.serie)) {
        sintonizadorContador.push(sintonizador);
      }
    });

    return sintonizadorContador;
  };
  async function actualizarContadorSintonizadores() {
    txtSintonizadorCambio.value = parseInt(jsonSintonizador.length);
  };
  async function pintarSintonizador(sintonizadores) {
    const divSintonizadores = document.getElementById("divSintonizadores");
    divSintonizadores.innerHTML = "";

    let numeroSintonizadores = 0;

    sintonizadores.forEach((element, index) => {
      numeroSintonizadores++;

      const card = document.createElement("div");
      card.className = "card mt-2";
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">Sintonizador #${numeroSintonizadores}</h5>
          <p class="card-text"><strong>Código de Barra:</strong> ${element.codigobarra}</p>
          <p class="card-text"><strong>Marca:</strong> ${element.marca}</p>
          <p class="card-text"><strong>Modelo:</strong> ${element.modelo}</p>
          <p class="card-text"><strong>Precio:</strong> ${element.precio}</p>
          <p class="card-text"><strong>Serie:</strong> ${element.serie}</p>
          <button class="btn btn-danger btn-sm mt-2 btnEliminar">
            <i class="fas fa-times"></i> Eliminar
          </button>
        </div>
      `;


      divSintonizadores.appendChild(card);


      const btnEliminar = card.querySelector(".btnEliminar");
      btnEliminar.addEventListener("click", function () {
        const index = jsonSintonizador.findIndex(
          (sintonizador) => sintonizador.serie === element.serie
        );
        if (index !== -1) {
          jsonSintonizador.splice(index, 1);
        }

        card.remove();

        actualizarContadorSintonizadores();
      });
    });

    await actualizarContadorSintonizadores();
  };
  async function AgregarSintotizador() {
    const slcCodigoBarraSintonizador = document.getElementById("slcCodigoBarraSintonizador").options[
      document.getElementById("slcCodigoBarraSintonizador").selectedIndex
    ]?.text?.split(" - ")[0] || "";
    const txtMarcaSintonizador = document.getElementById("txtMarcaSintonizador").value;
    const txtModeloSintonizador = document.getElementById("txtModeloSintonizador").value;
    const txtSerieSintonizador = document.getElementById("txtSerieSintonizador").value;
    const txtPrecioSintonizador = parseFloat(document.getElementById("txtPrecioSintonizador").value) || 0;

    if (!slcCodigoBarraSintonizador || !txtMarcaSintonizador || !txtModeloSintonizador || !txtSerieSintonizador || !txtPrecioSintonizador) {
      showToast("Por favor, complete todos los campos del sintonizador.", "ERROR");
      return;
    }

    const repetidoresExistentes = jsonSintonizador.map(rep => rep.numero);
    const maxNumero = Math.max(0, ...repetidoresExistentes);
    const numeroSintonizadores = maxNumero + 1;

    const nuevoSintonizador = {
      numero: numeroSintonizadores,
      codigobarra: slcCodigoBarraSintonizador,
      marca: txtMarcaSintonizador,
      modelo: txtModeloSintonizador,
      serie: txtSerieSintonizador,
      precio: txtPrecioSintonizador,
    };


    jsonSintonizador.push(nuevoSintonizador);


    const card = document.createElement("div");
    card.className = "card mt-3 shadow-sm border-light rounded";
    card.innerHTML = `
      <div class="card-body p-4">
        <h5 class="card-title text-primary">Sintonizador #${nuevoSintonizador.numero}</h5>
        <p class="card-text"><strong>Código de Barra:</strong> ${slcCodigoBarraSintonizador}</p>
        <p class="card-text"><strong>Marca:</strong> ${txtMarcaSintonizador}</p>
        <p class="card-text"><strong>Modelo:</strong> ${txtModeloSintonizador}</p>
        <p class="card-text"><strong>Precio:</strong> $${txtPrecioSintonizador.toFixed(2)}</p>  <!-- Mejor formato para el precio -->
        <p class="card-text"><strong>Serie:</strong> ${txtSerieSintonizador}</p>
        <button class="btn btn-danger btn-sm mt-3 btnEliminar">
          <i class="fas fa-times"></i> Eliminar
        </button>
      </div>
    `;

    document.getElementById("divSintonizadores").appendChild(card);

    const btnEliminar = card.querySelector(".btnEliminar");
    btnEliminar.addEventListener("click", function () {
      const index = jsonSintonizador.findIndex(
        (sintonizador) => sintonizador.serie === txtSerieSintonizador
      );
      if (index !== -1) {

        jsonSintonizador.splice(index, 1);
      }
      card.remove();
      actualizarContadorSintonizadores();
    });
    actualizarContadorSintonizadores();
  };
  async function ArmadoJsonCable() {
    const response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
    const result = await response.json();

    const soporte = result[0]?.soporte ? JSON.parse(result[0].soporte) : {};
    const nuevoSoporte = { ...soporte };
    const dataCable = await FichaInstalacion(idSoporte);

    calcularCostos();

    const cableData = {
      parametroscable: {
        potencia: parseInt(document.getElementById("txtPotencia").value) || 0,
        sintonizadores: jsonSintonizadorOriginal,
        triplexor: document.getElementById("slcTriplexor").value === "2" ? "activo" :
          (document.getElementById("slcTriplexor").value === "3" ? "pasivo" : "no lleva"),
        splitter: [
          {
            cantidad: parseInt(document.getElementById("txtNumSpliter").value) || 0,
            tipo: document.getElementById("slcSpliter").value,
          }
        ],
        conector: {
          numeroconector: parseInt(document.getElementById("txtConector").value) || 0,
          precio: parseFloat(document.getElementById("txtPrecioConector").value) || 0,
        },
        cable: {
          metrosadicionales: parseInt(document.getElementById("txtCable").value) || 0,
          preciometro: parseFloat(document.getElementById("txtPrecioCable").value) || 0,
        },
        costo: {
          cablecosto: JSON.parse(dataCable[0].ficha_instalacion).costo.cablecosto,
          casa: {
            gpon: txtCasaGpon.value,
            catv: txtCasaCatv.value
          },
          nap: {
            gpon: txtNapGpon.value,
            catv: txtNapCatv.value
          },
          pagoinstalacion: JSON.parse(dataCable[0].ficha_instalacion).cable.pagoinstalacion
        }
      },
      cambioscable: {
        potencia: parseInt(document.getElementById("txtPotenciaCambio").value) || 0,
        sintonizadores: jsonSintonizador,
        triplexor: document.getElementById("slcTriplexorCambio").value === "2" ? "activo" :
          (document.getElementById("slcTriplexorCambio").value === "3" ? "pasivo" : "no lleva"),
        splitter: [
          {
            cantidad: parseInt(document.getElementById("txtNumSpliterCambio").value) || 0,
            tipo: document.getElementById("slcSpliterCambio").value,
          }
        ],
        conector: {
          numeroconector: parseInt(document.getElementById("txtConectorCambio").value) || 0,
          precio: parseFloat(document.getElementById("txtPrecioConectorCambio").value) * parseInt(document.getElementById("txtConectorCambio").value) || 0,
        },
        cable: {
          metrosadicionales: parseInt(document.getElementById("txtCableCambio").value) || 0,
          preciometro: parseFloat(document.getElementById("txtPrecioCableCambio").value) * parseInt(document.getElementById("txtCableCambio").value) || 0,
        },
        costo: {
          cablecosto: {
            numerosintotizadores: parseInt(document.getElementById("txtSintonizadorCambio").value),
            costoalquilersintotizador: 40,
            costocable: CostosCable,
            costoconector: CostosConector,
            detalle: txtDetalleCosto.value,
            costoalquilersintotizadortotal: parseInt(document.getElementById("txtSintonizadorCambio").value) * 40
          },
          casa: {
            gpon: txtCambioCasaGpon.value,
            catv: txtCambioCasaCatv.value
          },
          nap: {
            gpon: txtCambioNapGpon.value,
            catv: txtCambioNapCatv.value
          },
          pagoinstalacion: JSON.parse(dataCable[0].ficha_instalacion).cable.pagoinstalacion
        }
      }
    };

    idCaja = slcCaja.value;

    nuevoSoporte.cabl = cableData;
    nuevoSoporte.idcaja = parseInt(idCaja);
    nuevoSoporte.puerto = parseInt(txtPuertoCambio.value) || 0;
    nuevoSoporte.periodo = JSON.parse(dataCable[0].ficha_instalacion).cable.periodo;

    return nuevoSoporte;
  };
  slcCaja.addEventListener("change", async () => {
    idCaja = slcCaja.value;
    console.log("ID Caja:", idCaja);
  });
  async function CompletarSoporteSiestaTodo(idSoporte, JSONsoporte) {
    const ServiciosTotales = await FichaInstalacion(idSoporte);
    const tiposServicio = (ServiciosTotales[0].tipos_servicio).toLowerCase().split(",");
    const todosValidos = tiposServicio.every(servicio =>
      JSONsoporte?.[servicio] && Object.keys(JSONsoporte[servicio]).length > 0
    );

    if (todosValidos) {
      await CompletarSoporte(idSoporte);
    }
  };
  function crearBotones() {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row g-2 mb-2 mt-2";

    const buttonDiv = document.createElement("div");
    buttonDiv.className = "col-md d-flex align-items-end";

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
    checkboxDiv.className = "form-check d-flex align-items-center me-2";

    const chkConfirmacion = document.createElement("input");
    chkConfirmacion.type = "checkbox";
    chkConfirmacion.id = "chkConfirmacion";
    chkConfirmacion.className = "form-check-input me-2";
    chkConfirmacion.name = "chkConfirmacion";
    chkConfirmacion.required = true;

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


    const solutionTextarea = document.getElementById("txtaEstadoFinal");
    solutionTextarea.parentNode.parentNode.appendChild(rowDiv);


    chkConfirmacion.addEventListener("change", async () => {
      if (chkConfirmacion.checked) {
        await completarCamposDeCambio();
      } else {
        await borrarCamposDeCambio();
      }
    });
  };
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
            idTecnico: login.idUsuario,
            soporte: data,
            idUserUpdate: login.idUsuario,
            descripcion_solucion: document.getElementById("txtaEstadoFinal").value,
          },
        }),
      });

      await CompletarSoporteSiestaTodo(idSoporte, data);

    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };
  function calcularCostos() {
    const cantCable = parseFloat(txtCableCambio.value) || 0;
    const precioCable = parseFloat(txtPrecioCableCambio.value) || 0;
    const costoCable = cantCable * precioCable;
    CostosCable = costoCable.toFixed(2);

    const cantConector = parseFloat(txtConectorCambio.value) || 0;
    const precioConector = parseFloat(txtPrecioConectorCambio.value) || 0;
    const costoConector = cantConector * precioConector;
    CostosConector = costoConector.toFixed(2);
  };
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = await ArmadoJsonCable();
    if (await ask("¿Desea guardar la ficha?")) {
      await guardarSoporte(data);
      showToast("Ficha guardada correctamente", "SUCCESS");
      window.location.href = `${config.HOST}views/Soporte/listarSoporte`;
    }
  });
  document.getElementById("btnlistar").addEventListener("click", () => {
    mostrarSintonizadoresEnModal();
  });
  document.getElementById("btnReporte").addEventListener("click", async () => {
    if (idReporte) {
      window.open(`${config.HOST}views/reports/Averia_Cable/soporte.php?idSoporte=${idReporte}`, '_blank');
    } else {
      console.error("No se ha encontrado el id del reporte");
    }
  });
  document.getElementById("btnAgregarSintonizador").addEventListener("click", async function () {
    await AgregarSintotizador();
  });

  txtPotencia, txtPotenciaCambio, txtSintonizadorCambio.addEventListener("input", validarValorRango);

  $("#slcCodigoBarraSintonizador").select2({
    theme: "bootstrap-5",
    dropdownParent: $("#mdlSintotizadorBody"), // importante para modales
    placeholder: "Buscar producto...",
    allowClear: true,
    ajax: {
      url: `${config.HOST}app/controllers/Producto.controllers.php`,
      dataType: "json",
      delay: 300,
      data: function (params) {
        return {
          operacion: "listarProductosPorTipo",
          tipoProducto: "Sintonizador",
          codigoBarra: params.term || "",
          categoria: ""
        };
      },
      processResults: function (data) {
        return {
          results: Array.isArray(data)
            ? data.map(item => ({
              id: item.id_producto,
              text: `${item.codigo_barra} - ${item.precio_actual} - ${item.marca}`,
              data: item
            }))
            : []
        };
      },
      cache: true
    }
  });

  $("#slcCodigoBarraSintonizador").on("select2:select", function (e) {
    const selected = e.params.data.data;
    codigoBarraSintonizador = selected.codigo_barra;

    $("#txtMarcaSintonizador").val(selected.marca);
    $("#txtModeloSintonizador").val(selected.modelo);
    $("#txtPrecioSintonizador").val(selected.precio_actual);
  });

  $("#slcCodigoBarraSintonizador").on("select2:clear", function () {
    $("#txtMarcaSintonizador").val("");
    $("#txtModeloSintonizador").val("");
    $("#txtPrecioSintonizador").val("");
  });

  $(".select2me").parent("div").children("span").children("span").children("span").css("height", " calc(3.5rem + 2px)");
  $(".select2me").parent("div").children("span").children("span").children("span").children("span").css("margin-top", "18px");
  $(".select2me").parent("div").find("label").css("z-index", "1");
});
