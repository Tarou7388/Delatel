import config from "../env.js";
document.addEventListener("DOMContentLoaded", () => {
  const userid = user["idUsuario"];

  const txtCantCable = document.getElementById("txtCantCable");
  const txtPrecioCable = document.getElementById("txtPrecioCable");
  const txtCostoCable = document.getElementById("txtCostoCable");

  const txtCantConector = document.getElementById("txtCantConector");
  const txtPrecioConector = document.getElementById("txtPrecioConector");
  const txtCostoConector = document.getElementById("txtCostoConector");

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

      const idCaja = JSON.parse(data[0].ficha_instalacion).idcaja;

      if (!Array.isArray(data) || data.length === 0) {
        console.warn("No hay datos en ficha_instalacion.");
        return;
      }

      const ficha = data[0] || {};

      document.getElementById("txtNumFicha").value = ficha.id_contrato || "";

      tipoServicio = ficha.tipos_servicio || "";
      const nombreCliente = (ficha.nombre_cliente || "").split(", ");
      const usuario =
        (
          (nombreCliente[0]?.substring(0, 3) || "") +
          (nombreCliente[1]?.substring(0, 3) || "")
        ).toUpperCase() + idContrato;

      const contrasenia = "@" + usuario;
      document.getElementById("txtUsuario").value = usuario;
      document.getElementById("txtClaveAcceso").value = contrasenia;
      document.getElementById("txtPlan").value = data[0].paquete;
      document.getElementById("txtPlanCable").value = data[0].paquete;
      document.getElementById("txtIdCaja").value = idCaja;

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
    const txtIdCaja = document.querySelector("#txtIdCaja").value;
    const slcFilaEntrada = document.querySelector("#slcFilaEntrada").value;
    const txtPuerto = document.querySelector("#txtPuerto").value;
    const txtUsuario = document.querySelector("#txtUsuario").value;
    const txtPlan = document.querySelector("#txtPlan").value;
    const txtClaveAcceso = document.querySelector("#txtClaveAcceso").value;
    const txtPeriodo = document.querySelector("#txtPeriodo").value;
    const txtVlan = document.querySelector("#txtVlan").value;
    const txtPotencia = document.querySelector("#txtPotenciaFibra").value;
    const txtSsid = document.querySelector("#txtSsid").value;
    const txtSeguridad = document.querySelector("#txtSeguridad").value;
    const txtCodigoBarra = document.querySelector("#txtCodigoBarra").value;
    const txtMarca = document.querySelector("#txtMarca").value;
    const txtModelo = document.querySelector("#txtModelo").value;
    const txtIp = document.querySelector("#txtIp").value;
    const txtSerie = document.querySelector("#txtSerie").value;
    const slcBanda = document.querySelector("#slcBanda").value;
    const txtAntenas = document.querySelector("#txtAntenas").value;
    const chkCatv = document.querySelector("#chkCatv").checked;
    const txtDetallesRouter = document.querySelector("#txtDetalleRouter").value;
    const txtUsuarioRouter = document.querySelector("#txtUsuarioRouter").value;
    const txtSeguridadRouter = document.querySelector("#txtSeguridadRouter").value;

    jsonData = {
      fibraoptica: {
        usuario: txtUsuario,
        claveacceso: txtClaveAcceso,
        vlan: parseInt(txtVlan),
        periodo: txtPeriodo,
        plan: txtPlan,
        potencia: parseInt(txtPotencia),
        router: {
          ssid: txtSsid,
          seguridad: txtSeguridad,
          codigobarra: txtCodigoBarra,
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
        detalles: txtDetallesRouter,
      },
      tipoentrada: {
        fila: slcFilaEntrada.split(","),
        puerto: parseInt(txtPuerto)
      },
      idcaja: parseInt(txtIdCaja)
    };
  }

  async function cable() {
    const txtPlanCable = document.querySelector("#txtPlanCable").value;
    const txtPagoInst = document.querySelector("#txtPagoInst").value;
    const txtPotencia = document.querySelector("#txtPotenciaCable").value;
    const slcTriplexor = document.querySelector("#slcTriplexor").value.split(",");
    const txtCantConector = document.querySelector("#txtCantConector").value;
    const txtPrecioConector = document.querySelector("#txtPrecioConector").value;
    const txtSplitter = document.querySelector("#txtSplitter").value;
    const slcSplitter = document.querySelector("#slcSplitter").value;
    const txtCantCable = document.querySelector("#txtCantCable").value;
    const txtPrecioCable = document.querySelector("#txtPrecioCable").value;

    jsonCable = {
      pagoinstalacion: parseFloat(txtPagoInst),
      potencia: parseInt(txtPotencia),
      plan: txtPlanCable,
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
      },
    };
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

    const ssid = document.getElementById("txtSsidRepetidor").value;
    const contrasenia = document.getElementById("txtContraseniaRepetidor").value;
    const codigoBarra = document.getElementById("txtCodigoBarrasRepetidor").value;
    const marca = document.getElementById("txtMarcaRepetidor")?.value;
    const modelo = document.getElementById("txtModeloRepetidor")?.value;
    const precio = document.getElementById("txtPrecioRepetidor")?.value;
    const serie = document.getElementById("txtSerieRepetidor")?.value;
    const ip = document.getElementById("txtIpRepetidor").value;
    const condicion = document.getElementById("slcCondicionRepetidor").value;

    if (ssid === "" || contrasenia === "" || codigoBarra === "" || ip === "") {
      showToast("Por favor, llene todos los campos.", "WARNING");
      return;
    } else {
      numeroRepetidores++;
      const repetidor = {
        numero: numeroRepetidores,
        ssid: ssid,
        contrasenia: contrasenia,
        codigobarra: codigoBarra,
        modelo: modelo,
        marca: marca,
        precio: precio,
        serie: serie,
        ip: ip,
        condicion: condicion
      };
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
      document.getElementById("txtCodigoBarrasRepetidor").value = "";
      document.getElementById("txtMarcaRepetidor").value = "";
      document.getElementById("txtModeloRepetidor").value = "";
      document.getElementById("txtIpRepetidor").value = "";
      document.getElementById("txtSerieRepetidor").value = "";
      $("#mdlRepetidor").modal("hide");
    }
  }

  async function AgregarSintotizador() {
    const txtCodigoBarraSintonizador = document.getElementById("txtCodigoBarraSintonizador").value;
    const txtMarcaSintonizador = document.getElementById("txtMarcaSintonizador").value;
    const txtModeloSintonizador = document.getElementById("txtModeloSintonizador").value;
    const txtSerieSintonizador = document.getElementById("txtSerieSintonizador").value;
    const txtPrecioSintonizador = document.getElementById("txtPrecioSintonizador").value;
    numeroSintotizadores++;
    const jsonSintotizadorNuevo = {
      numero: numeroSintotizadores,
      codigobarra: txtCodigoBarraSintonizador,
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
                  ${txtCodigoBarraSintonizador}
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
  document.getElementById('txtCodigoBarra').addEventListener('input', async function () {
    const codigoBarra = this.value.trim();

    if (codigoBarra === "") {
      return;
    }

    try {
      const response = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoBarra&codigoBarra=${encodeURIComponent(codigoBarra)}`);
      const resultado = await response.json();

      if (Array.isArray(resultado) && resultado.length > 0) {
        const producto = resultado[0];
        if (producto && producto.marca && producto.modelo) {
          const marca = producto.marca;
          const modelo = producto.modelo;
          document.getElementById('txtMarca').value = marca;
          document.getElementById('txtModelo').value = modelo;
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

  document.getElementById('txtCodigoBarrasRepetidor').addEventListener('input', async function () {
    const codigoBarra = this.value.trim();

    if (codigoBarra === "") {
      return;
    }

    try {
      const response = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoBarra&codigoBarra=${encodeURIComponent(codigoBarra)}`);
      const resultado = await response.json();

      if (Array.isArray(resultado) && resultado.length > 0) {
        const producto = resultado[0];
        if (producto && producto.marca && producto.modelo) {
          const marca = producto.marca;
          const modelo = producto.modelo;
          const precio = producto.precio_actual;
          document.getElementById('txtMarcaRepetidor').value = marca;
          document.getElementById('txtModeloRepetidor').value = modelo;
          document.getElementById('txtPrecioRepetidor').value = precio;
          showToast(`Producto encontrado: ${producto.marca} - ${producto.modelo}`, "SUCCESS");
        } else {
          showToast("Producto no encontrado o datos incompletos.", "INFO");
        }
      } else {
        showToast("Producto no encontrado o datos incompletos.", "INFO");
      }
    } catch (error) {
      console.error('Error:', error);
      showToast("Hubo un error al buscar el producto.", "ERROR");
    }
  });

  document.getElementById("txtPuerto").addEventListener("input", function () {
    validarPuerto();
  });

  async function guardar() {
    if (!validarCampos()) {
      showToast("Por favor, llene todos los campos requeridos.", "WARNING");
      return;
    }

    await fibraOptica();
    await cable();
    const jsonCosto = await costos();

    if (numeroRepetidores > 0) {
      jsonData.fibraoptica.repetidores = jsonRepetidor;
    }

    if (tipoServicio === "FIBR,CABL" || tipoServicio === "CABL,FIBR") {
      if (numeroSintotizadores > 0) {
        jsonCable.sintonizadores = jsonSintotizador;
      }
      jsonData.cable = jsonCable;
    }

    jsonData.costo = jsonCosto;

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
      "txtVlan",
      "txtPeriodo",
      "txtPotenciaFibra",
      "txtSsid",
      "txtSeguridad",
      "txtCodigoBarra",
      "txtIp",
      "txtSerie",
      "txtAntenas",
      "txtPotenciaCable",
      "txtCantConector",
      "txtSplitter",
      "txtCantCable",
      "txtPagoAdelantado",
      "txtDescuento",
      "txtGponNap",
      "txtCatvNap",
      "txtGponCasa",
      "txtCatvCasa",
      "txtPuerto"
    ];

    let esValido = true;

    for (const campo of campos) {
      const elemento = document.getElementById(campo);

      if (elemento.value.trim() === "") {
        elemento.classList.add("is-invalid");
        esValido = false;
      } else {
        elemento.classList.remove("is-invalid");
      }

      const valor = parseFloat(elemento.value);
      const min = parseFloat(elemento.min);
      const max = parseFloat(elemento.max);

      if (valor < 0 && elemento.hasAttribute('min') && valor < min) {
        elemento.classList.add("is-invalid");
        esValido = false;
      }

      if (valor < min || valor > max) {
        elemento.classList.add("is-invalid");
        esValido = false;
      }
    }

    validarPuerto();

    return esValido;
  }

  function validarPuerto() {
    const filaEntrada = document.getElementById("slcFilaEntrada").value;
    const columnaEntrada = document.getElementById("txtPuerto").value;
    const columnaError = document.getElementById("columnaError");
    const mensajeError = columnaError.closest('.form-floating').querySelector('.invalid-feedback');

    let maxColumnas = 16;

    if (filaEntrada === "1") {
      maxColumnas = 8;
    } else if (filaEntrada === "2") {
      maxColumnas = 16;
    }

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

  document.getElementById("btnAñadirSintotizador").addEventListener("click", function () {
    const codigoBarra = document.getElementById("txtCodigoBarraSintonizador").value.trim();
    const serie = document.getElementById("txtSerieSintonizador").value.trim();

    if (!codigoBarra || !serie) {
      if (!codigoBarra) {
        document.getElementById("txtCodigoBarraSintonizador").classList.add("is-invalid");
      } else {
        document.getElementById("txtCodigoBarraSintonizador").classList.remove("is-invalid");
      }

      if (!serie) {
        document.getElementById("txtSerieSintonizador").classList.add("is-invalid");
      } else {
        document.getElementById("txtSerieSintonizador").classList.remove("is-invalid");
      }

      return;
    }

    document.getElementById("txtCodigoBarraSintonizador").classList.remove("is-invalid");
    document.getElementById("txtSerieSintonizador").classList.remove("is-invalid");

    AgregarSintotizador();

    document.getElementById("txtCodigoBarraSintonizador").value = "";
    document.getElementById("txtMarcaSintonizador").value = "";
    document.getElementById("txtModeloSintonizador").value = "";
    document.getElementById("txtSerieSintonizador").value = "";
  });

  document.getElementById("btnAñadirRepetidor").addEventListener("click", async function () {
    const codigoBarra = document.getElementById("txtCodigoBarrasRepetidor").value;
    const ssid = document.getElementById("txtSsidRepetidor").value;
    const contrasenia = document.getElementById("txtContraseniaRepetidor").value;
    const ip = document.getElementById("txtIpRepetidor").value;
    const condicion = document.getElementById("slcCondicionRepetidor").value;
    const serie = document.getElementById("txtSerieRepetidor").value;

    if (codigoBarra === "" || ssid === "" || contrasenia === "" || ip === "" || condicion === "") {
      if (!codigoBarra) {
        document.getElementById("txtCodigoBarrasRepetidor").classList.add("is-invalid");
      } else {
        document.getElementById("txtCodigoBarrasRepetidor").classList.remove("is-invalid");
      }

      if (!ssid) {
        document.getElementById("txtSsidRepetidor").classList.add("is-invalid");
      } else {
        document.getElementById("txtSsidRepetidor").classList.remove("is-invalid");
      }

      if (!contrasenia) {
        document.getElementById("txtContraseniaRepetidor").classList.add("is-invalid");
      } else {
        document.getElementById("txtContraseniaRepetidor").classList.remove("is-invalid");
      }

      if (!ip) {
        document.getElementById("txtIpRepetidor").classList.add("is-invalid");
      } else {
        document.getElementById("txtIpRepetidor").classList.remove("is-invalid");
      }

      if (!condicion) {
        document.getElementById("slcCondicionRepetidor").classList.add("is-invalid");
      } else {
        document.getElementById("slcCondicionRepetidor").classList.remove("is-invalid");
      }

      if (!serie) {
        document.getElementById("txtSerieRepetidor").classList.add("is-invalid");
      } else {
        document.getElementById("txtSerieRepetidor").classList.remove("is-invalid");
      }

      return;
    }

    document.getElementById("txtCodigoBarrasRepetidor").classList.remove("is-invalid");
    document.getElementById("txtSsidRepetidor").classList.remove("is-invalid");
    document.getElementById("txtContraseniaRepetidor").classList.remove("is-invalid");
    document.getElementById("txtIpRepetidor").classList.remove("is-invalid");
    document.getElementById("slcCondicionRepetidor").classList.remove("is-invalid");
    document.getElementById("txtSerieRepetidor").classList.remove("is-invalid");
    AgregarRepetidor();

    document.getElementById("txtCodigoBarrasRepetidor").value = "";
    document.getElementById("txtSsidRepetidor").value = "";
    document.getElementById("txtContraseniaRepetidor").value = "";
    document.getElementById("txtIpRepetidor").value = "";
    document.getElementById("slcCondicionRepetidor").value = "";
    document.getElementById("txtSerieRepetidor").value = "";
    document.getElementById("txtPrecioRepetidor").value = "";
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

  document.getElementById("txtFecha").value = today;

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

  document.getElementById('txtCodigoBarraSintonizador').addEventListener('input', async function () {
    const codigoBarra = this.value.trim();

    if (codigoBarra === "") {
      return;
    }

    try {
      const response = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoBarra&codigoBarra=${encodeURIComponent(codigoBarra)}`);
      const resultado = await response.json();

      if (Array.isArray(resultado) && resultado.length > 0) {
        const producto = resultado[0];
        if (producto && producto.marca && producto.modelo && producto.precio_actual) {
          const marca = producto.marca;
          const modelo = producto.modelo;
          const precio = producto.precio_actual;
          document.getElementById("txtMarcaSintonizador").value = marca;
          document.getElementById("txtModeloSintonizador").value = modelo;
          document.getElementById("txtPrecioSintonizador").value = precio;
          showToast(`Producto encontrado: ${producto.marca} - ${producto.modelo} - Precio: ${producto.precio}`, "SUCCESS");
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
});
