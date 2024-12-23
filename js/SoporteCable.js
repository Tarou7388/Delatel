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
  const txtaEstadoInicial = document.getElementById("txtaEstadoInicial")

  const txtPotenciaCambio = document.getElementById("txtPotenciaCambio");
  const txtPrecioCableCambio = document.getElementById("txtPrecioCableCambio");
  const txtPrecioConectorCambio = document.getElementById("txtPrecioConectorCambio");
  const txtSintonizadorCambio = document.getElementById("txtSintonizadorCambio");

  const txtPlan = document.getElementById("txtPlan");
  const txtCliente = document.getElementById("txtCliente");
  const txtNrodocumento = document.getElementById("txtNrodocumento");

  const form = document.getElementById("form-cable");

  let idSoporte = -1;
  let idCaja = -1;

  (async function () {
    idSoporte = await obtenerReferencias();
    if (idSoporte) {
      crearSelectYBoton();
      await ObtenerValores();
      await llamarCajas();
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.get("idReporte");
      await reporte(urlParams.get("idReporte"));
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

  async function rellenarDocNombre(doct) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${doct}`);
    const data = await respuesta.json();
    $("#txtCliente").val(data[0].nombre);
    $("#txtNrodocumento").val(doct);
  }

  async function reporte(idReporte) {
    try {
      // Obtener datos del soporte
      const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idReporte}`);
      const data = await respuesta.json();
      const dataCable = await FichaInstalacion(idReporte);
      const cableFiltrado = JSON.parse(dataCable[0].ficha_instalacion).cable;
      const plan = document.getElementById("txtPlan")
      plan.value = cableFiltrado.plan

      // Llamada necesaria para rellenar el número de documento
      await rellenarDocNombre(data[0].nro_doc);

      // Parsear el campo `soporte`
      const soporteData = JSON.parse(data[0].soporte);

      // Extraer parámetros iniciales y cambios técnicos
      const parametrosCable = soporteData.cabl.parametroscable;
      const cambiosCable = soporteData.cabl.cambioscable;

      // Precios
      const precioCable = 1.50;
      const precioConector = 1.00;

      const setField = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
          element.value = value || '';
          element.setAttribute('disabled', 'true');
        }
      };

      // Calcular precios
      const calcularPrecio = (cantidadCable, cantidadConectores) => {
        const totalCable = cantidadCable * precioCable;
        const totalConectores = cantidadConectores * precioConector;
        return { totalCable, totalConectores };
      };

      // Cálculo para parámetros iniciales
      const preciosIniciales = calcularPrecio(parametrosCable.cable, parametrosCable.conectores);
      setField('txtPrecioCable', preciosIniciales.totalCable.toFixed(2));  // Precio del cable inicial
      setField('txtPrecioConector', preciosIniciales.totalConectores.toFixed(2));  // Precio de conectores iniciales

      // Cálculo para cambios técnicos
      const preciosCambios = calcularPrecio(cambiosCable.cable, cambiosCable.conectores);
      setField('txtPrecioCableCambio', preciosCambios.totalCable.toFixed(2));  // Precio del cable en cambios
      setField('txtPrecioConectorCambio', preciosCambios.totalConectores.toFixed(2));  // Precio de conectores en cambios

      // Rellenar campos con datos iniciales
      setField('txtPotencia', parametrosCable.potencia);
      setField('txtSintonizador', parametrosCable.sintonizador);
      setField('slcTriplexor', triplexorValue(parametrosCable.triplexor));
      setField('txtNumSpliter', parametrosCable.splitter[0]?.cantidad);
      setField('slcSpliter', parametrosCable.splitter[0]?.tipo);
      setField('txtCable', parametrosCable.cable);
      setField('txtConector', parametrosCable.conectores);
      setField('txtaEstadoInicial', data[0].descripcion_problema);

      // Rellenar campos con datos de cambios técnicos
      setField('txtPotenciaCambio', cambiosCable.potencia);
      setField('txtSintonizadorCambio', cambiosCable.sintonizador);
      setField('slcTriplexorCambio', triplexorValue(cambiosCable.triplexor));
      setField('txtNumSpliterCambio', cambiosCable.splitter[0]?.cantidad);
      setField('slcSpliterCambio', cambiosCable.splitter[0]?.tipo);
      setField('txtCableCambio', cambiosCable.cable);
      setField('txtConectorCambio', cambiosCable.conectores);
      setField('txtaEstadoFinal', data[0].descripcion_solucion);

    } catch (error) {
      console.error("Error en la función reporte:", error);
    }
  }

  function triplexorValue(triplexor) {
    switch (triplexor?.toLowerCase()) {
      case 'no lleva': return '1';
      case 'activo': return '2';
      case 'pasivo': return '3';
      default: return '';
    }
  }

  async function ObtenerValores() {

    const urlParams = new URLSearchParams(window.location.search);
    const doc = urlParams.get("doc");
    const idSoporte = urlParams.get("idsoporte");
    const tiposervicio = urlParams.get("tiposervicio");
    const coordenada = urlParams.get("coordenada");

    const respuesta = await FichaSoporteporDocServCoordenada(doc, tiposervicio, coordenada);
    console.log(respuesta);

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

      idCaja = JSON.parse(dataCable[0].ficha_instalacion).idcaja;
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

  function crearSelectYBoton() {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row g-2 mb-2 mt-2";

    const selectDiv = document.createElement("div");
    selectDiv.className = "col-md ";

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

    const solutionTextarea = document.getElementById("txtaEstadoFinal");
    solutionTextarea.parentNode.parentNode.appendChild(rowDiv);
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

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = await ArmadoJsonCable();
    if (await ask("¿Desea guardar la ficha?")) {
      await guardarSoporte(data);
      //window.location.href = `${config.HOST}views/Soporte/listarSoporte`;
    }
  });

  txtPotencia, txtPotenciaCambio, txtSintonizadorCambio.addEventListener("input", validarValorRango);

});
