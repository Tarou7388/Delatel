import config from "../env.js";
import * as Herramientas from "./Herramientas.js";
document.addEventListener("DOMContentLoaded", async () => {
  let login = await Herramientas.obtenerLogin();

  const userid = login.idUsuario;

  const txtCantCable = document.getElementById("txtCantCable");
  const txtPrecioCable = document.getElementById("txtPrecioCable");
  const txtCostoCable = document.getElementById("txtCostoCable");

  const txtCantConector = document.getElementById("txtCantConector");
  const txtPrecioConector = document.getElementById("txtPrecioConector");
  const txtCostoConector = document.getElementById("txtCostoConector");

  document.getElementById("txtFecha").value = today;

  const periodoDate = new Date();
  periodoDate.setMonth(periodoDate.getMonth() + 6);
  const DateFormateado = periodoDate.toISOString().split("T")[0];
  txtPeriodo.value = DateFormateado;
  txtPeriodo.min = DateFormateado;

  var today = new Date().toISOString().split("T")[0];

  let tipoServicio = "";
  let numeroSintotizadores = 0;
  let numeroRepetidores = 0;
  let jsonData = {};
  let jsonCable = {};
  let jsonRepetidor = [];
  let jsonSintotizador = [];
  let idCaja = 0;
  let codigoRepetidor = "";
  let codigoRouterONT = "";
  let codigoBarraSintonizador = "";

  const requiredFields = document.querySelectorAll(".form-control");

  requiredFields.forEach(field => {
    field.addEventListener("input", function () {
      const formGroup = field.closest('.form-floating');
      const label = formGroup ? formGroup.querySelector('label') : null;
      const asterisk = label ? label.querySelector('.required-asterisk') : null;
      const invalidFeedback = formGroup ? formGroup.querySelector('.invalid-feedback') : null;

      if (asterisk) {
        if (field.value.trim() !== "") {
          asterisk.style.display = "none";
          field.classList.remove("is-invalid");
          if (invalidFeedback) {
            invalidFeedback.style.display = "none";
          }
        } else {
          asterisk.style.display = "inline";
          field.classList.add("is-invalid");
          if (invalidFeedback) {
            invalidFeedback.style.display = "block";
          }
        }
      } else {
        console.warn("Asterisco no encontrado para el campo:", field);
      }
    });
  });

  function validarValorNegativoPositivo(event) {
    const elemento = event.target;
    const min = 0;
    const mensaje = `${elemento.placeholder} debe ser ${min} o más.`;
    const invalidFeedback = elemento.nextElementSibling;

    if (parseFloat(elemento.value) < min) {
      elemento.classList.add("is-invalid");
      invalidFeedback.textContent = mensaje;
      invalidFeedback.style.display = "block";
    } else {
      elemento.classList.remove("is-invalid");
      invalidFeedback.style.display = "none";
    }
  }

  function validarValorRango(event) {
    const elemento = event.target;
    const min = parseFloat(elemento.min);
    const max = parseFloat(elemento.max);
    const mensaje = `${elemento.placeholder} debe estar entre ${min} y ${max}.`;
    const invalidFeedback = elemento.closest('.form-floating').querySelector('.invalid-feedback');

    if (parseFloat(elemento.value) < min || parseFloat(elemento.value) > max) {
      elemento.classList.add("is-invalid");
      if (invalidFeedback) {
        invalidFeedback.textContent = mensaje;
        invalidFeedback.style.display = "block";
      }
    } else {
      elemento.classList.remove("is-invalid");
      if (invalidFeedback) {
        invalidFeedback.style.display = "none";
      }
    }
  }

  txtPagoAdelantado.addEventListener("input", validarValorRango);
  txtDescuento.addEventListener("input", validarValorRango);
  document.getElementById("txtPotenciaFibra").addEventListener("input", validarValorRango);
  document.getElementById("txtVlan").addEventListener("input", validarValorRango);
  document.getElementById("txtAntenas").addEventListener("input", validarValorRango);
  document.getElementById("txtPotenciaCable").addEventListener("input", validarValorRango);
  txtCantConector.addEventListener("input", validarValorNegativoPositivo);
  txtCantCable.addEventListener("input", validarValorNegativoPositivo);
  txtSplitter.addEventListener("input", validarValorNegativoPositivo);
  txtPotenciaCable.addEventListener("input", validarValorRango);
  txtGponNap.addEventListener("input", validarValorRango);
  txtCatvNap.addEventListener("input", validarValorRango);
  txtGponCasa.addEventListener("input", validarValorRango);
  txtCatvCasa.addEventListener("input", validarValorRango);

  (async () => {
    try {
      const response = await fetch(
        `${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerFichaInstalacion&id=${idContrato}`
      );
      const data = await response.json();

      idCaja = JSON.parse(data[0].ficha_instalacion).idcaja;

      const responseCajaNombre = await fetch(
        `${config.HOST}app/controllers/Caja.controllers.php?operacion=cajabuscarId&idCaja=${idCaja}`
      );
      const dataCaja = await responseCajaNombre.json();
      console.log(dataCaja);

      if (!Array.isArray(data) || data.length === 0) {
        console.warn("No hay datos en ficha_instalacion.");
        return;
      }

      const ficha = data[0] || {};

      document.getElementById("txtNumFicha").value = ficha.id_contrato || "";

      tipoServicio = ficha.tipos_servicio || "";
      const nombreCliente = data[0].nombre_cliente.split(", ");

      if (nombreCliente.length === 2) {
        const nombres = nombreCliente[0].split(" ");
        let apellidos = nombreCliente[1].split(" ");

        const primerNombre = nombres[0];
        let primerApellido = apellidos[0];
        let segundoApellido = apellidos[1];

        // Saltar apellidos de dos caracteres
        apellidos = apellidos.filter(apellido => apellido.length > 2);
        primerApellido = apellidos[0];
        segundoApellido = apellidos[1];

        const usuario = (primerNombre.substring(0, 3) + primerApellido.substring(0, 6) + idContrato).toLowerCase().replace(/ñ/g, 'n');
        const contrasenia = "@" + segundoApellido.substring(0, 7).toLowerCase().replace(/ñ/g, 'n') + idContrato;
        document.getElementById("txtUsuario").value = usuario;
        document.getElementById("txtClaveAcceso").value = contrasenia;
      }
      else {
        document.getElementById("txtUsuario").disabled = false;
        document.getElementById("txtClaveAcceso").disabled = false;
      }

      document.getElementById("txtnombreCliente").textContent = ficha.nombre_cliente;
      document.getElementById("txtPlan").value = ficha.paquete;
      document.getElementById("txtPlanCable").value = ficha.paquete;
      document.getElementById("txtIdCaja").value = dataCaja[0].nombre;

      if (ficha.ficha_instalacion) {
        const installationData = JSON.parse(ficha.ficha_instalacion);

      } else {
        showToast("No hay datos en la Ficha de Instalación.", "INFO");
      }
    } catch (error) {
      console.error("Error al obtener los datos de la ficha de instalación:", error);
    }
  })();

  async function fibraOptica() {
    const txtPuerto = document.querySelector("#txtPuerto").value;
    const txtUsuario = document.querySelector("#txtUsuario").value;
    const txtClaveAcceso = document.querySelector("#txtClaveAcceso").value;
    const txtVlan = document.querySelector("#txtVlan").value;
    const txtPlan = document.querySelector("#txtPlan").value;
    const txtPeriodo = document.querySelector("#txtPeriodo").value;
    const txtPotencia = document.querySelector("#txtPotenciaFibra").value;
    const txtSsid = document.querySelector("#txtSsid").value;
    const txtSeguridad = document.querySelector("#txtSeguridad").value;
    const txtMAC = document.getElementById("slcCodigoBarraRouterOnt").options[
      document.getElementById("slcCodigoBarraRouterOnt").selectedIndex
    ]?.text?.split(" - ")[0] || "";
    const txtMarca = document.querySelector("#txtMarca").value;
    const txtModelo = document.querySelector("#txtModelo").value;
    const txtIp = document.querySelector("#txtIp").value;
    const txtSerie = document.querySelector("#txtSerie").value;
    const slcBanda = document.querySelector("#slcBanda").value;
    const txtAntenas = document.querySelector("#txtAntenas").value;
    const chkCatv = document.querySelector("#chkCatv").checked;
    const txtDetalles = document.querySelector("#txtDetalleRouter").value;
    const txtUsuarioRouter = document.querySelector("#txtUsuarioRouter").value;
    const txtSeguridadRouter = document.querySelector("#txtSeguridadRouter").value;

    jsonData = {
      periodo: txtPeriodo,
      fibraoptica: {
        usuario: txtUsuario,
        claveacceso: txtClaveAcceso,
        potencia: parseInt(txtPotencia),
        router: {
          ssid: txtSsid,
          seguridad: txtSeguridad,
          codigobarra: txtMAC,
          ip: txtIp,
          marca: txtMarca,
          modelo: txtModelo,
          serie: txtSerie,
          banda: slcBanda.split(","),
          numeroantena: parseInt(txtAntenas),
          catv: chkCatv,
          ingresouserrouter: txtUsuarioRouter,
          ingresopass: txtSeguridadRouter
        },
        detalles: txtDetalles,
        repetidores: jsonRepetidor
      },
      puerto: parseInt(txtPuerto),
      idcaja: parseInt(idCaja),
      vlan: parseInt(txtVlan)
    };
  }

  async function cable() {
    const txtPaquete = document.querySelector("#txtPlan").value;
    const txtPeriodo = document.querySelector("#txtPeriodo").value;
    const txtPagoInst = document.querySelector("#txtPagoInst").value;
    const txtPotencia = document.querySelector("#txtPotenciaCable").value;
    const slcTriplexor = document.querySelector("#slcTriplexor").value.split(",");
    const txtCantConector = document.querySelector("#txtCantConector").value;
    const txtPrecioConector = document.querySelector("#txtPrecioConector").value;
    const txtSplitter = document.querySelector("#txtSplitter").value;
    const slcSplitter = document.querySelector("#slcSplitter").value;
    const txtCantCable = document.querySelector("#txtCantCable").value;
    const txtPrecioCable = document.querySelector("#txtPrecioCable").value;

    if (
      txtPaquete === "" ||
      txtPagoInst === "" ||
      txtPeriodo === "" ||
      txtPotencia === "" ||
      slcTriplexor === "" ||
      txtCantConector === "" ||
      txtPrecioConector === "" ||
      txtSplitter === "" ||
      slcSplitter === "" ||
      txtCantCable === "" ||
      txtPrecioCable === ""
    ) {
      showToast("Por favor, llene todos los campos del Cable.", "WARNING");
      return;
    } else {
      jsonCable = {
        periodo: txtPeriodo,
        pagoinstalacion: parseFloat(txtPagoInst),
        potencia: parseInt(txtPotencia),
        triplexor: {
          requerido: slcTriplexor[0],
          cargador: slcTriplexor[1],
        },
        conector: {
          numeroconector: parseInt(txtCantConector),
          precio: txtPrecioConector,
        },
        splitter: [
          {
            cantidad: parseInt(txtSplitter),
            tipo: slcSplitter,
          },
        ],
        cable: {
          metrosadicionales: parseInt(txtCantCable),
          preciometro: txtPrecioCable,
        }
      };
    }
  }

  async function costos() {
    const txtPagoAdelantado =
      document.querySelector("#txtPagoAdelantado").value;
    const txtCantSintotizador = document.querySelector(
      "#txtCantSintotizador"
    ).value;
    const txtCostoAlquiler = document.querySelector("#txtCostoAlquiler").value;
    const txtDescuento = document.querySelector("#txtDescuento").value;
    const txtGponNap = document.querySelector("#txtGponNap").value;
    const txtCatvNap = document.querySelector("#txtCatvNap").value;
    const txtGponCasa = document.querySelector("#txtGponCasa").value;
    const txtCatvCasa = document.querySelector("#txtCatvCasa").value;

    const jsonCosto = {
      pagoadelantado: parseInt(txtPagoAdelantado),
      descuento: parseInt(txtDescuento),
      nap: {
        gpon: parseInt(txtGponNap),
        catv: parseInt(txtCatvNap),
      },
      casa: {
        gpon: parseInt(txtGponCasa),
        catv: parseInt(txtCatvCasa),
      },
    };

    if (typeof tipoServicio !== "undefined" && (tipoServicio === "FIBR,CABL" || tipoServicio === "CABL,FIBR")) {
      const txtCantCable = document.querySelector("#txtCantCable").value;
      const txtPrecioCable = document.querySelector("#txtPrecioCable").value;
      const txtPrecioConector = document.querySelector("#txtPrecioConector").value;
      const txtCantConector = document.querySelector("#txtCantConector").value;
      const txtDetalleCable = document.querySelector("#txtDetalleCable").value;
      const txtCostoCable = document.querySelector("#txtCostoCable").value;
      const txtCostoConector = document.querySelector("#txtCostoConector").value;

      const jsonCostoCable = {
        numerosintotizadores: parseInt(txtCantSintotizador) || 0,
        costoalquilersintotizador: parseFloat(txtCostoAlquiler) || 0,
        costocable: parseFloat(txtCostoCable) || 0,
        costoconector: parseFloat(txtCostoConector) || 0,
        cantidadcable: parseInt(txtCantCable),
        preciocable: txtPrecioCable,
        precioconector: txtPrecioConector,
        cantidadconector: parseInt(txtCantConector),
        detalle: txtDetalleCable,
      };
      jsonCosto.cablecosto = jsonCostoCable;
    }

    return jsonCosto;
  }

  function calcularCostos() {
    const cantCable = parseFloat(txtCantCable.value) || 0;
    const precioCable = parseFloat(txtPrecioCable.value) || 0;
    const costoCable = cantCable * precioCable;
    txtCostoCable.value = costoCable.toFixed(2);

    const cantConector = parseFloat(txtCantConector.value) || 0;
    const precioConector = parseFloat(txtPrecioConector.value) || 0;
    const costoConector = cantConector * precioConector;
    txtCostoConector.value = costoConector.toFixed(2);
  }

  async function ActualizarCantidadSintotizador() {
    document.getElementById("txtCantSintotizador").value = numeroSintotizadores;
    document.getElementById("txtCostoAlquiler").value =
      numeroSintotizadores * 40;
  }

  async function AgregarRepetidor() {
    const cardContainer = document.getElementById("cardContainer");
    const contenidoCarta = document.getElementById("cardsRow");
    const nuevoRepetidor = document.createElement("div");
    nuevoRepetidor.classList.add("col-12", "col-md-6", "col-lg-3");

    const ssid = document.getElementById("txtSsidRepetidor")?.value;
    const contrasenia = document.getElementById("txtContraseniaRepetidor")?.value;
    const codigoBarra = document.getElementById("slcCodigoBarrasRepetidor").options[
      document.getElementById("slcCodigoBarrasRepetidor").selectedIndex
    ]?.text?.split(" - ")[0] || "";
    const marca = document.getElementById("txtMarcaRepetidor")?.value;
    const modelo = document.getElementById("txtModeloRepetidor")?.value;
    const precio = document.getElementById("txtPrecioRepetidor")?.value;
    const serie = document.getElementById("txtSerieRepetidor")?.value;
    const ip = document.getElementById("txtIpRepetidor")?.value;
    const condicion = document.getElementById("slcCondicionRepetidor")?.value;

    if (!ssid || !contrasenia || !codigoBarra || !marca || !modelo || !serie || !ip) {
      showToast("Por favor, complete todos los campos del repetidor.", "WARNING");
      return;
    }

    numeroRepetidores++;
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
    console.log(repetidor);
    jsonRepetidor.push(repetidor);
    nuevoRepetidor.innerHTML = `
        <div class="card repetidor-card" id="carta${numeroRepetidores}">
            <div class="header">
                <h2 class="title">Repetidor - N° ${numeroRepetidores}</h2>
            </div>
            <div class="content">
                <div class="row">
                    <div class="field">
                        <i class="fas fa-wifi icon"></i>
                        <label>SSID:</label>
                        <span>${ssid}</span>
                    </div>
                    <div class="field">
                        <i class="fas fa-lock icon"></i>
                        <label>Contraseña:</label>
                        <span class="password">${contrasenia}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="field">
                        <i class="fas fa-server icon"></i>
                        <label>Serie:</label>
                        <span>${serie}</span>
                    </div>
                    <div class="field">
                        <i class="fas fa-desktop icon"></i>
                        <label>Modelo:</label>
                        <span>${modelo}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="field">
                        <i class="fas fa-box icon"></i>
                        <label>Marca:</label>
                        <span>${marca}</span>
                    </div>
                    <div class="field">
                        <i class="fas fa-network-wired icon"></i>
                        <label>IP:</label>
                        <span>${ip}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="field">
                        <i class="fas fa-dollar-sign icon"></i>
                        <label>Precio:</label>
                        <span>${precio}</span>
                    </div>
                    <div class="field">
                        <i class="fas fa-hand-holding-dollar icon"></i>
                        <label>Condición:</label>
                        <span>${condicion}</span>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="field">
                        <i class="fas fa-barcode icon"></i>
                        <label>Código de Barra:</label>
                        <span>${codigoBarra}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    if (cardContainer.hidden) {
      cardContainer.removeAttribute("hidden");
    }
    contenidoCarta.appendChild(nuevoRepetidor);
    document.getElementById("txtSsidRepetidor").value = "";
    document.getElementById("txtContraseniaRepetidor").value = "";
    document.getElementById("txtMarcaRepetidor").value = "";
    document.getElementById("txtModeloRepetidor").value = "";
    document.getElementById("txtIpRepetidor").value = "";
    document.getElementById("txtSerieRepetidor").value = "";
    $("#mdlRepetidor").modal("hide");
  }

  async function AgregarSintotizador() {

    const slcCodigoBarraSintonizador = document.getElementById("slcCodigoBarraSintonizador").options[
      document.getElementById("slcCodigoBarraSintonizador").selectedIndex
    ]?.text?.split(" - ")[0] || "";
    const txtMarcaSintonizador = document.getElementById("txtMarcaSintonizador").value;
    const txtModeloSintonizador = document.getElementById("txtModeloSintonizador").value;
    const txtSerieSintonizador = document.getElementById("txtSerieSintonizador").value;
    const txtPrecioSintonizador = document.getElementById("txtPrecioSintonizador").value;
    numeroSintotizadores++;
    const jsonSintotizadorNuevo = {
      numero: numeroSintotizadores,
      codigobarra: slcCodigoBarraSintonizador,
      marca: txtMarcaSintonizador,
      modelo: txtModeloSintonizador,
      serie: txtSerieSintonizador,
      precio: txtPrecioSintonizador,
    };
    jsonSintotizador.push(jsonSintotizadorNuevo);
    const card = document.createElement("div");
    card.className = "card mt-2";
    card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title"><i class="fa-solid fa-desktop" style="color: #0459ad;"></i> Sintonizador</h5>
          <p class="card-text" style="color: gray;">
            Código de Barra:
            <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
              ${slcCodigoBarraSintonizador}
            </span>
          </p>
          <p class="card-text" style="color: gray;">
            Marca:
            <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
            ${txtMarcaSintonizador}
            </span>
          </p>
          <p class="card-text" style="color: gray;">
            Modelo:
            <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
            ${txtModeloSintonizador}
            </span>
          </p>
          <p class="card-text" style="color: gray;">
            Serie:
            <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
              ${txtSerieSintonizador}
            </span>
          </p>
          <p class="card-text" style="color: gray;">
            Precio:
            <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
              ${txtPrecioSintonizador}
            </span>
          </p>
          <button class="btn btn-danger btn-sm mt-2 btnEliminar">
            <i class="fas fa-times"></i> Eliminar
          </button>
        </div>
      `;

    document.getElementById("mdlSintotizadorBody").appendChild(card);

    card.querySelector(".btnEliminar").addEventListener("click", async function () {
      card.remove();
      await ActualizarCantidadSintotizador();
      numeroSintotizadores--;
      jsonSintotizador.pop();
    });

    await ActualizarCantidadSintotizador();
  }

  document.getElementById("txtPuerto").addEventListener("input", function () {
    validarPuerto();
  });

  async function guardar() {

    const txtPuerto = document.getElementById("txtPuerto").value;
    if (!validarCampos()) {
      showToast("Por favor, llene todos los campos requeridos.", "WARNING");
      return;
    }

    await fibraOptica();
    await cable();
    const jsonCosto = await costos();

    // Inicializar sintonizadores como un array vacío
    jsonCable.sintonizadores = [];

    if (numeroSintotizadores > 0) {
      jsonCable.sintonizadores = jsonSintotizador;
    }

    if (numeroRepetidores > 0) {
      jsonData.fibraoptica.repetidores = jsonRepetidor;
    }

    if (tipoServicio === "FIBR,CABL" || tipoServicio === "CABL,FIBR") {
      if (numeroSintotizadores > 0) {
        jsonCable.sintonizadores = jsonSintotizador;
      }
      jsonData.cable = jsonCable;
    }
    const txtVlan = document.querySelector("#txtVlan").value;

    jsonData.costo = jsonCosto;
    jsonData.puerto = parseInt(txtPuerto);
    jsonData.idcaja = parseInt(idCaja);
    jsonData.vlan = parseInt(txtVlan);

    const data = {
      operacion: "guardarFichaInstalacion",
      fichaInstalacion: jsonData,
      id: idContrato,
      idUsuario: userid,
    };

    const response = await fetch(
      `${config.HOST}app/controllers/Contrato.controllers.php`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );

    const datos = await response.json();
    showToast("Ficha de Instalación Guardada Correctamente", "SUCCESS");
    setTimeout(() => {
      window.location.href = `${config.HOST}views/Contratos/`;
    }, 2500);
  }

  function validarCampos() {
    const campos = [
      "txtUsuario",
      "txtClaveAcceso",
      "txtVlan",
      "txtPlan",
      "txtPeriodo",
      "txtPaquete",
      "txtNumFicha",
      "txtPagoInst",
      "txtPotenciaCable",
      "txtPotenciaFibra",
      "slcTriplexor",
      "txtCantConector",
      "txtPrecioConector",
      "txtSplitter",
      "slcSplitter",
      "txtCantCable",
      "txtPrecioCable",
      "txtCantSintotizador",
      "txtCostoAlquiler",
      "txtGponNap",
      "txtCatvNap",
      "txtGponCasa",
      "txtCatvCasa",
      "txtPuerto",
      "txtSsid",
      "txtIp",
      "txtSeguridad",
      "txtSerie",
      "slcBanda",
      "txtAntenas",
      "txtUsuarioRouter",
      "txtSeguridadRouter"
    ];

    let esValido = true;

    for (const campo of campos) {
      const elemento = document.getElementById(campo);

      if (!elemento) continue;

      const valor = elemento.value.trim();

      // Validar campo vacío
      if (valor === "") {
        elemento.classList.add("is-invalid");
        esValido = false;
        continue;
      } else {
        elemento.classList.remove("is-invalid");
      }

      // Validar valores numéricos si aplica
      if (!isNaN(valor)) {
        const num = parseFloat(valor);
        const min = elemento.hasAttribute("min") ? parseFloat(elemento.min) : null;
        const max = elemento.hasAttribute("max") ? parseFloat(elemento.max) : null;

        if ((min !== null && num < min) || (max !== null && num > max)) {
          elemento.classList.add("is-invalid");
          esValido = false;
        }
      }
    }

    // Validar puerto si es necesario
    if (typeof validarPuerto === "function") {
      validarPuerto();
    }

    return esValido;
  }

  function validarPuerto() {
    const columnaEntrada = document.getElementById("txtPuerto").value;
    const columnaError = document.getElementById("columnaError");
    const mensajeError = columnaError.closest('.form-floating').querySelector('.invalid-feedback');

    let maxColumnas = 16;

    if (columnaEntrada === "" || columnaEntrada < 1 || columnaEntrada > maxColumnas) {
      columnaError.textContent = `Por favor, ingrese un valor válido (1 a ${maxColumnas}).`;
      document.getElementById("txtPuerto").classList.add("is-invalid");
      if (mensajeError) {
        mensajeError.style.display = "block";
      }
    } else {
      columnaError.textContent = "";
      document.getElementById("txtPuerto").classList.remove("is-invalid");
      if (mensajeError) {
        mensajeError.style.display = "none";
      }
    }
  }

  txtCantCable.addEventListener("input", calcularCostos);
  txtCantConector.addEventListener("input", calcularCostos);

  document.getElementById("btnAñadirSintotizador").addEventListener("click", async function () {
    const serie = document.getElementById("txtSerieSintonizador").value.trim();

    const campos = [
      { id: "slcCodigoBarraSintonizador", valor: codigoBarraSintonizador },
      { id: "txtSerieSintonizador", valor: serie }
    ];

    let todosValidos = true;

    campos.forEach(campo => {
      const elemento = document.getElementById(campo.id);
      if (campo.valor === "") {
        elemento.classList.add("is-invalid");
        todosValidos = false;
      } else {
        elemento.classList.remove("is-invalid");
      }
    });

    if (!todosValidos) {
      return;
    }

    await AgregarSintotizador();


    campos.forEach(campo => {
      document.getElementById(campo.id).value = "";
    });
    document.getElementById("txtMarcaSintonizador").value = "";
    document.getElementById("txtModeloSintonizador").value = "";
  });

  document.getElementById("btnAñadirRepetidor").addEventListener("click", async function () {
    const ssid = document.getElementById("txtSsidRepetidor").value.trim();
    const contrasenia = document.getElementById("txtContraseniaRepetidor").value.trim();
    const ip = document.getElementById("txtIpRepetidor").value.trim();
    const condicion = document.getElementById("slcCondicionRepetidor").value.trim();
    const serie = document.getElementById("txtSerieRepetidor").value.trim();
    const codigoBarra = $("#slcCodigoBarrasRepetidor").val();

    const campos = [
      { id: "slcCodigoBarrasRepetidor", valor: codigoBarra },
      { id: "txtSsidRepetidor", valor: ssid },
      { id: "txtContraseniaRepetidor", valor: contrasenia },
      { id: "txtIpRepetidor", valor: ip },
      { id: "slcCondicionRepetidor", valor: condicion },
      { id: "txtSerieRepetidor", valor: serie }
    ];

    let todosValidos = true;

    campos.forEach(campo => {
      const elemento = document.getElementById(campo.id) || document.getElementById("slcCodigoBarrasRepetidor");
      if (!campo.valor || campo.valor === "") {
        if (elemento) elemento.classList.add("is-invalid");
        todosValidos = false;
      } else {
        if (elemento) elemento.classList.remove("is-invalid");
      }
    });

    if (!todosValidos) {
      showToast("Por favor, complete todos los campos del repetidor.", "WARNING");
      return;
    }

    await AgregarRepetidor();

    // Limpiar campos después de agregar
    $("#slcCodigoBarrasRepetidor").val(null).trigger("change");
    document.getElementById("txtSsidRepetidor").value = "";
    document.getElementById("txtContraseniaRepetidor").value = "";
    document.getElementById("txtMarcaRepetidor").value = "";
    document.getElementById("txtModeloRepetidor").value = "";
    document.getElementById("txtPrecioRepetidor").value = "";
    document.getElementById("txtIpRepetidor").value = "";
    document.getElementById("txtSerieRepetidor").value = "";
    document.getElementById("slcCondicionRepetidor").value = "";
  });

  document.querySelector("#eliminarRepetidor").addEventListener("click", () => {
    if (numeroRepetidores > 0) {
      const card = document.querySelector(`#carta${numeroRepetidores}`);
      if (card) {
        card.remove();
        numeroRepetidores--;
        jsonRepetidor.pop();
        if (numeroRepetidores === 0) {
          document.getElementById("cardContainer").hidden = true;
        }
      } else {
        console.warn(`No se encontró la carta con ID carta${numeroRepetidores}`);
      }
    } else {
      console.warn("No hay repetidores para eliminar.");
    }
  });

  document.getElementById("btnGuardar").addEventListener("click", async () => {
    await guardar();
  });

  document.getElementById("btnCancelar").addEventListener("click", () => {
    window.location.href = `${config.HOST}views/Contratos/`;
  });

  document.getElementById('chkCatv').addEventListener('change', function () {
    var statusText = document.getElementById('statusText');
    statusText.textContent = this.checked ? 'Sí' : 'No';
  });

  $(document).ready(function () {
    $('#txtIp, #txtIpRepetidor').mask('0ZZ.0ZZ.0ZZ.0ZZ', {
      translation: {
        'Z': {
          pattern: /[0-9]/, optional: true
        }
      }
    });
  });


  $("#slcCodigoBarrasRepetidor").select2({
    theme: "bootstrap-5",
    dropdownParent: $("#mdlRepetidorBody"),
    placeholder: "Buscar producto...",
    allowClear: true,
    ajax: {
      url: `${config.HOST}app/controllers/Producto.controllers.php`,
      dataType: "json",
      delay: 300,
      data: function (params) {
        return {
          operacion: "listarProductosPorTipo",
          tipoProducto: "Repetidor",
          codigoBarra: params.term || ""
        };
      },
      processResults: function (data) {
        console.log(data)
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

  $("#slcCodigoBarrasRepetidor").on("select2:select", function (e) {
    const selected = e.params.data.data;
    codigoRepetidor = selected.codigo_barra;

    $("#txtMarcaRepetidor").val(selected.marca);
    $("#txtModeloRepetidor").val(selected.modelo);
    $("#txtPrecioRepetidor").val(selected.precio_actual);
  });

  $("#slcCodigoBarrasRepetidor").on("select2:clear", function () {
    $("#txtMarcaRepetidor").val("");
    $("#txtModeloRepetidor").val("");
    $("#txtPrecioRepetidor").val("");
  });

  $("#slcCodigoBarraRouterOnt").select2({
    theme: "bootstrap-5",
    placeholder: "Buscar producto...",
    allowClear: true,
    ajax: {
      url: `${config.HOST}app/controllers/Producto.controllers.php`,
      dataType: "json",
      delay: 300,
      data: function (params) {
        return {
          operacion: "listarProductosPorTipo",
          tipoProducto: "",
          codigoBarra: params.term || ""
        };
      },
      transport: function (params, success, failure) {
        const url = params.url;
        const term = params.data.codigoBarra;
        const fetchTipo = tipo =>
          $.ajax({
            url,
            dataType: "json",
            data: {
              operacion: "listarProductosPorTipo",
              tipoProducto: tipo,
              codigoBarra: term
            }
          });
        $.when(fetchTipo("Router"), fetchTipo("ONT"))
          .done(function (routerRes, ontRes) {
            const routerData = routerRes[0];
            const ontData = ontRes[0];

            const merged = []
              .concat(
                Array.isArray(routerData)
                  ? routerData.map(item => ({ ...item, _tipo: "Router" }))
                  : [],
                Array.isArray(ontData)
                  ? ontData.map(item => ({ ...item, _tipo: "ONT" }))
                  : []
              );
            success({ results: merged });
          })
          .fail(failure);
      },
      processResults: function (data) {
        return {
          results: Array.isArray(data.results)
            ? data.results.map(item => ({
              id: item.id_producto,
              text: `${item.codigo_barra} - ${item.precio_actual} - ${item.marca} (${item._tipo})`,
              data: item
            }))
            : []
        };
      },
      cache: true
    }
  });

  $("#slcCodigoBarraRouterOnt").on("select2:select", function (e) {
    const selected = e.params.data.data;
    codigoRouterONT = selected.codigo_barra;

    $("#txtMarca").val(selected.marca);
    $("#txtModelo").val(selected.modelo);
  });

  $("#slcCodigoBarraRouterOnt").on("select2:clear", function () {
    $("#txtMarca").val("");
    $("#txtModelo").val("");
  });

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
          codigoBarra: params.term || ""
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
