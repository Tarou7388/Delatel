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
  const checkConfirmacion = document.getElementById("chkConfirmacion");

  const form = document.getElementById("form-cable");
  const btnReporte = document.getElementById("btnReporte");

  const urlParams = new URLSearchParams(window.location.search);
  const idReporte = urlParams.get("idReporte");

  if (!idReporte) {
    btnReporte.style.display = "none";
  }
  let numeroSintotizadores = 0;
  let jsonSintonizador = [];
  let sintonizadoresData = [];
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

  // Función para completar los campos de cambio con los valores de los parámetros técnicos
  async function completarCamposDeCambio() {
    const parametrosTecnicos = {
      txtPotenciaCambio: txtPotencia.value,
      txtSintonizadorCambio: txtSintonizador.value,
      slcTriplexorCambio: slcTriplexor.value,
      txtNumSpliterCambio: txtNumSpliter.value,
      slcSpliterCambio: slcSpliter.value,
      txtCableCambio: txtCable.value,
      txtPrecioCableCambio: txtPrecioCable.value,
      txtConectorCambio: txtConector.value,
      txtPrecioConectorCambio: txtPrecioConector.value
    };
  
    for (const [id, value] of Object.entries(parametrosTecnicos)) {
      const input = document.getElementById(id);
      if (input && !input.value) {
        input.value = value;
      }
    }
  }
  
  // Función para borrar los valores de los campos de cambio
  async function borrarCamposDeCambio() {
    const camposCambio = [
      'txtPotenciaCambio',
      'txtSintonizadorCambio',
      'slcTriplexorCambio',
      'txtNumSpliterCambio',
      'slcSpliterCambio',
      'txtCableCambio',
      'txtPrecioCableCambio',
      'txtConectorCambio',
      'txtPrecioConectorCambio'
    ];
  
    camposCambio.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        if (input.tagName === "SELECT") {
          input.selectedIndex = 0; // Reiniciar a la primera opción si es un select
        } else {
          input.value = ''; // Vaciar si es un input
        }
      }
    });
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
      const nombreCliente = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${dataProblema[0].nro_doc}`);
      const dataCliente = await nombreCliente.json();
      await llamarCajas();
      txtCliente.value = dataCliente[0].nombre;
      txtNrodocumento.value = dataProblema[0].nro_doc;

      if (dataProblema.length > 0 && dataProblema[0].descripcion_problema) {
        $("#txtaEstadoInicial").val(dataProblema[0].descripcion_problema);
      } else {
        console.warn("No se encontró descripción del problema.");
      }
    } catch (error) {
      console.error("Error en descripcion_problema:", error);
    }
    try {
      const dataCable = await FichaInstalacion(idSoporte);
      const cableFiltrado = JSON.parse(dataCable[0].ficha_instalacion).cable;

      txtPotencia.value = data.potencia || "";
      sintonizadoresData = data.sintonizadores || [];
      txtSintonizador.value = data.sintonizadores.length || 0;
      for (let i = 0; i < slcTriplexor.options.length; i++) {
        if (
          slcTriplexor.options[i].text.trim().toLowerCase() ===
          data.triplexor?.trim().toLowerCase()
        ) {
          slcTriplexor.selectedIndex = i;
          break;
        }
      }
      txtNumSpliter.value = data.splitter?.[0]?.cantidad || "";

      const tipoSpliter = data.splitter?.[0]?.tipo || 0;
      const opcionesSpliter = slcSpliter.options;

      for (let i = 0; i < opcionesSpliter.length; i++) {
        if (opcionesSpliter[i].value == tipoSpliter) {
          slcSpliter.selectedIndex = i;
          break;
        }
      }
      txtPlan.value = data.plan || "";
      txtCable.value = data.cable?.metrosadicionales || 0;
      txtPrecioCable.value = (data.cable?.metrosadicionales || 0) * (parseFloat(cableFiltrado.cable.preciometro) || 0);
      txtConector.value = data.conector?.numeroconector || 0;
      txtPrecioConector.value = (data.conector?.numeroconector || 0) * (parseFloat(cableFiltrado.conector.precio) || 0);
      //también para cambios 
      txtPrecioCableCambio.value = parseFloat(cableFiltrado.cable.preciometro) || 0;
      txtPrecioConectorCambio.value = parseFloat(cableFiltrado.conector.precio) || 0;
    } catch (error) {
      console.error("Error al asignar valores al formulario:", error);
    }
  }

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
            <p class="card-text">Código de Barra: ${sintonizador.codigoBarra || "N/A"}</p>
            <p class="card-text">Marca: ${sintonizador.marca || "N/A"}</p>
            <p class="card-text">Modelo: ${sintonizador.modelo || "N/A"}</p>
            <p class="card-text">Precio: ${sintonizador.precio || "N/A"}</p>
            <p class="card-text">Serie: ${sintonizador.serie || "N/A"}</p>
        </div>
      `;
      container.appendChild(card);
    });
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
    const txtPrecioSintonizador = parseFloat(document.getElementById("txtPrecioSintonizador").value) || 0;

    numeroSintotizadores++;

    const nuevoSintonizador = {
      codigoBarra: txtCodigoBarraSintonizador,
      marca: txtMarcaSintonizador,
      modelo: txtModeloSintonizador,
      serie: txtSerieSintonizador,
      precio: txtPrecioSintonizador,
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
    document.getElementById("divSintonizadores").appendChild(card);

    const btnEliminar = card.querySelector("#btnEliminar");
    btnEliminar.addEventListener("click", function () {
      card.remove();
      numeroSintotizadores--;
      cableData.parametroscable.sintonizadores.pop(); // Elimina el último sintonizador agregado
      actualizarContadorSintonizadores();
    });
    actualizarContadorSintonizadores();
  }

  async function ArmadoJsonCable() {
    const response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
    const result = await response.json();

    const soporte = result[0]?.soporte ? JSON.parse(result[0].soporte) : {};
    const nuevoSoporte = { ...soporte };

    const dataCable = await FichaInstalacion(idSoporte);
    const cableFiltrado = JSON.parse(dataCable[0].ficha_instalacion).cable;

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
        }
      }
    };

    nuevoSoporte.cabl = cableData;
    nuevoSoporte.idcaja = idCaja;

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
  
    // Botón Guardar
    const guardarBtn = document.createElement("button");
    guardarBtn.id = "btnGuardarFicha";
    guardarBtn.className = "btn btn-success me-2";
    guardarBtn.type = "submit";
    guardarBtn.textContent = "Guardar Ficha";
  
    // Botón Cancelar
    const cancelarBtn = document.createElement("button");
    cancelarBtn.id = "btnCancelarFicha";
    cancelarBtn.className = "btn btn-secondary me-2";
    cancelarBtn.type = "button";
    cancelarBtn.textContent = "Cancelar";
    cancelarBtn.addEventListener("click", () => {
      window.location.href = `${config.HOST}views/Soporte/listarSoporte`;
    });
  
    // Checkbox Confirmación
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
  
    // Añadir elementos al contenedor
    buttonDiv.appendChild(guardarBtn);
    buttonDiv.appendChild(cancelarBtn);
    buttonDiv.appendChild(checkboxDiv); // Agregar el checkbox al contenedor
  
    rowDiv.appendChild(buttonDiv);
  
    // Insertar el rowDiv en el DOM
    const solutionTextarea = document.getElementById("txtaEstadoFinal");
    solutionTextarea.parentNode.parentNode.appendChild(rowDiv);
  
    // Lógica para el checkbox (después de agregarlo al DOM)
    chkConfirmacion.addEventListener("change", async () => {
      if (chkConfirmacion.checked) {
        await completarCamposDeCambio();
      } else {
        await borrarCamposDeCambio();
      }
    });
  }
  
  async function guardarSoporte(data) {
    console.log(data);
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
            descripcion_solucion: document.getElementById("txtaEstadoFinal").value,
          },
        }),
      });

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
  txtPotencia, txtPotenciaCambio, txtSintonizadorCambio.addEventListener("input", validarValorRango);
});
