import config from "../env.js";
import { FichaInstalacion, FichaSoporteporDocServCoordenada, validarValorRango, CompletarSoporte } from "./Herramientas.js";
import * as mapa from "./Mapa.js";

document.addEventListener("DOMContentLoaded", () => {
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

  const txtPotenciaCambio = document.getElementById("txtPotenciaCambio");
  const txtPrecioCableCambio = document.getElementById("txtPrecioCableCambio");
  const txtPrecioConectorCambio = document.getElementById("txtPrecioConectorCambio");
  const txtSintonizadorCambio = document.getElementById("txtSintonizadorCambio");

  const txtPlan = document.getElementById("txtPlan");
  const txtCliente = document.getElementById("txtCliente");
  const txtNrodocumento = document.getElementById("txtNrodocumento");
  const slcCaja = document.getElementById("slcCaja");

  const form = document.getElementById("form-cable");
  const btnReporte = document.getElementById("btnReporte");

  const urlParams = new URLSearchParams(window.location.search);
  const idReporte = urlParams.get("idReporte");

  if (!idReporte) {
    btnReporte.style.display = "none";
  }
  let numeroSintotizadores = 0;
  let jsonSintonizador = [];
  let sintonizadores = [];
  let idSoporte = -1;
  let idCaja = -1;

  (async function () {
    idSoporte = await obtenerReferencias();
    if (idSoporte) {
      crearBotones();
      configurarVerMas();
      await ObtenerValores();
      await llamarCajas();
    }
  })();

  async function llamarCajas() {
    const cajas = await mapa.buscarCercanos(idCaja);
    cajas.forEach(caja => {
      const option = document.createElement('option');
      option.value = caja.id_caja;
      option.text = caja.nombre;
      slcCaja.appendChild(option);
    });
    slcCaja.value = idCaja;
  }

  function configurarVerMas() {
    const elementosOcultar = [
      slcTriplexor, slcSpliter, txtNumSpliter, txtCable, txtConector, txtPrecioCable,
      txtPrecioConector, txtaEstadoInicial, lblTriplexor, lblSpliter,
      lblNumSpliter, lblCable, lblPrecioCable, lblConector, lblPrecioConector, lblEstadoInicial,
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
  }

  async function ObtenerValores() {
    const urlParams = new URLSearchParams(window.location.search);
    const doc = urlParams.get("doc");
    const idSoporte = urlParams.get("idsoporte");
    const tiposervicio = urlParams.get("tiposervicio");
    const coordenada = urlParams.get("coordenada");

    const respuesta = await FichaSoporteporDocServCoordenada(doc, tiposervicio, coordenada);

    if (respuesta[0].soporte != "{}" && JSON.parse(respuesta[0].soporte).cabl) {
      await cargarSoporteAnterior(JSON.parse(respuesta[0].soporte).cabl.cambioscable, idSoporte);
    } else {
      await CargardatosInstalacion(doc, idSoporte);
    }
  }

  async function cargarSoporteAnterior(data, idSoporte) {
    try {
      const respuestaProblema = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
      const dataProblema = await respuestaProblema.json();
      $("#txtaEstadoInicial").val(dataProblema[0].descripcion_problema);
    } catch (error) {
      console.error("Error en descripcion_problema:", error);
    };

    console.log(data);
    txtPotencia.value = data.potencia;
    txtSintonizador.value = data.sintonizador;

    for (let i = 0; i < slcTriplexor.options.length; i++) {
      if (slcTriplexor.options[i].text.trim().toLowerCase() === data.triplexor.trim().toLowerCase()) {
        slcTriplexor.selectedIndex = i;
        break;
      }
    }
    console.log(data);
    txtNumSpliter.value = data.splitter[0].cantidad;
    slcSpliter.selectedIndex = data.splitter[0].tipo;
    txtPlan.value = data.plan;
    txtCable.value = data.cable.metrosadicionales;
    txtPrecioCable.value = data.cable.metrosadicionales * data.cable.preciometro;
    txtConector.value = data.conector.numeroconector;
    txtPrecioConector.value = data.conector.precio * data.conector.numeroconector;
  }

  async function obtenerReferencias() {
    const urlParams = new URLSearchParams(window.location.search);
    const idSoporte = urlParams.get("idsoporte");
    return idSoporte;
  }

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
      const cableFiltrado = JSON.parse(dataCable[0].ficha_instalacion).cable;

      // Validar si sintonizadores existe
      const sintonizadores = cableFiltrado.sintonizadores ? cableFiltrado.sintonizadores.length : 0;

      const cargador = JSON.parse(cableFiltrado.triplexor.cargador);
      const requerido = JSON.parse(cableFiltrado.triplexor.requerido);

      txtPlan.value = cableFiltrado.plan;
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

      txtPrecioConectorCambio.value = cableFiltrado.conector.precio;
      txtPrecioConector.value = cableFiltrado.conector.numeroconector * cableFiltrado.conector.precio;

      idCaja = cableFiltrado.idcaja;

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
  }
  function actualizarContadorSintonizadores() {
    txtSintonizadorCambio.value = numeroSintotizadores;
  }

  async function AgregarSintotizador() {
    const txtCodigoBarraSintonizador = document.getElementById("txtCodigoBarraSintonizador").value;
    const txtMarcaSintonizador = document.getElementById("txtMarcaSintonizador").value;
    const txtModeloSintonizador = document.getElementById("txtModeloSintonizador").value;
    const txtSerieSintonizador = document.getElementById("txtSerieSintonizador").value;
    const txtPrecioSintonizador = document.getElementById("txtPrecioSintonizador").value;

    numeroSintotizadores++;

    const nuevoSintonizador = {
      codigoBarra: txtCodigoBarraSintonizador,
      marca: txtMarcaSintonizador,
      modelo: txtModeloSintonizador,
      serie: txtSerieSintonizador,
      precio: txtPrecioSintonizador
    };

    jsonSintonizador.push(nuevoSintonizador);

    const card = document.createElement("div");
    card.className = "card mt-2";
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">Sintonizador #${numeroSintotizadores}</h5>
        <p class="card-text"><strong>Código de Barra:</strong> ${txtCodigoBarraSintonizador}</p>
        <p class="card-text"><strong>Marca:</strong> ${txtMarcaSintonizador}</p>
        <p class="card-text"><strong>Modelo:</strong> ${txtModeloSintonizador}</p>
        <p class="card-text"><strong>Precio:</strong> ${txtPrecioSintonizador}</p>
        <p class="card-text"><strong>Serie:</strong> ${txtSerieSintonizador}</p>
        <button class="btn btn-danger btn-sm mt-2" id="btnEliminar">
          <i class="fas fa-times"></i> Eliminar
        </button>
      </div>
    `;
    actualizarContadorSintonizadores();

    document.getElementById("divSintonizadores").appendChild(card);
    const btnEliminar = card.querySelector("#btnEliminar");
    btnEliminar.addEventListener("click", async function () {
      card.remove();
      numeroSintotizadores--;
      jsonSintonizador.pop();
      actualizarContadorSintonizadores();
    });
  }

  async function ArmadoJsonCable() {
    const response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
    const result = await response.json();

    const soporte = result[0]?.soporte ? JSON.parse(result[0].soporte) : {};
    const nuevoSoporte = { ...soporte };

    const dataCable = await FichaInstalacion(idSoporte);

    const cableData = {
      parametroscliente: {
        plan: txtPlan.value,
        usuario: txtCliente.value,
        nrodoc: txtNrodocumento.value,
      },
      parametroscable: {
        plan: document.getElementById("txtPlan").value,
        potencia: parseInt(document.getElementById("txtPotencia").value) || 0,
        sintonizador: parseInt(document.getElementById("txtSintonizador").value) || 0,
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
        }
      },
      cambioscable: {
        plan: document.getElementById("txtPlan").value,
        potencia: parseInt(document.getElementById("txtPotenciaCambio").value) || 0,
        sintonizador: parseInt(document.getElementById("txtSintonizadorCambio").value) || 0,
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
          precio: parseFloat(document.getElementById("txtPrecioConectorCambio").value) || 0,
        },
        cable: {
          metrosadicionales: parseInt(document.getElementById("txtCableCambio").value) || 0,
          preciometro: parseFloat(document.getElementById("txtPrecioCableCambio").value) || 0,
        }
      }
    };

    nuevoSoporte.cabl = cableData;
    nuevoSoporte.idcaja = idCaja;
    nuevoSoporte.tipoentrada = JSON.parse(dataCable[0].ficha_instalacion).tipoentrada;

    console.log(nuevoSoporte);

    return nuevoSoporte;
  }

  async function CompletarSoporteSiestaTodo(idSoporte, JSONsoporte) {
    const ServiciosTotales = await FichaInstalacion(idSoporte);
    const tiposServicio = (ServiciosTotales[0].tipos_servicio).toLowerCase().split(",");
    const todosValidos = tiposServicio.every(servicio =>
      JSONsoporte?.[servicio] && Object.keys(JSONsoporte[servicio]).length > 0
    );

    if (todosValidos) {
      await CompletarSoporte(idSoporte);
    }
  }

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
    cancelarBtn.className = "btn btn-secondary";
    cancelarBtn.type = "button";
    cancelarBtn.textContent = "Cancelar";
    cancelarBtn.addEventListener("click", () => {
      window.location.href = `${config.HOST}views/Soporte/listarSoporte`;
    });

    buttonDiv.appendChild(guardarBtn);
    buttonDiv.appendChild(cancelarBtn);
    rowDiv.appendChild(buttonDiv);

    const solutionTextarea = document.getElementById("txtaEstadoFinal");
    solutionTextarea.parentNode.parentNode.appendChild(rowDiv);
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
            descripcion_solucion: document.getElementById("txtaEstadoFinal").value,
          },
        }),
      });
      const result = await response.json();

      await CompletarSoporteSiestaTodo(idSoporte, data);

    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }
  document.getElementById("btnAgregarSintonizador").addEventListener("click", async function () {
    await AgregarSintotizador();
  });
  document.getElementById("btnBuscarSintonizador").addEventListener("click", async function () {
    const codigoBarra = document.getElementById("txtCodigoBarraSintonizador").value.trim();
    if (codigoBarra === "") {
      return;
    }
    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoBarra&codigoBarra=${encodeURIComponent(codigoBarra)}`);
      const resultado = await respuesta.json();
      console.log(resultado);

      if (Array.isArray(resultado) && resultado.length > 0) {
        const producto = resultado[0];
        if (producto?.marca && producto?.modelo && producto?.precio_actual) {
          document.getElementById("txtMarcaSintonizador").value = producto.marca;
          document.getElementById("txtModeloSintonizador").value = producto.modelo;
          document.getElementById("txtPrecioSintonizador").value = producto.precio_actual;
          showToast(`Producto encontrado: ${producto.marca} - ${producto.modelo} - Precio: ${producto.precio_actual}`, "SUCCESS");
        } else {
          showToast("Producto no encontrado o datos incompletos", "INFO");
        }
      } else {
        showToast("Producto no encontrado", "INFO");
      }
    } catch (error) {
      console.error('Error:', error);
      showToast("Hubo un error al escanear el código de barras.", "ERROR");
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = await ArmadoJsonCable();
    if (await ask("¿Desea guardar la ficha?")) {
      await guardarSoporte(data);
      window.location.href = `${config.HOST}views/Soporte/listarSoporte`;
    }
  });

  document.getElementById("btnReporte").addEventListener("click", async () => {
    if (idReporte) {
      window.open(`${config.HOST}views/reports/Averia_Cable/soporte.php?idSoporte=${idReporte}`, '_blank');
    } else {
      console.error("No se ha encontrado el id del reporte");
    }
  });
  txtPotencia, txtPotenciaCambio, txtSintonizadorCambio.addEventListener("input", validarValorRango);
});
