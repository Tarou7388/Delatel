import config from "../env.js";
document.addEventListener("DOMContentLoaded", () => {
  const userid = user["idUsuario"];
  const urlParams = new URLSearchParams(window.location.search);
  const idCaja = urlParams.get('idCaja') || localStorage.getItem('idCaja');
  console.log("idCaja:", idCaja);
  const txtCantCable = document.getElementById("txtCantCable");
  const txtPrecioCable = document.getElementById("txtPrecioCable");
  const txtCostoCable = document.getElementById("txtCostoCable");

  const txtCantConector = document.getElementById("txtCantConector");
  const txtPrecioConector = document.getElementById("txtPrecioConector");
  const txtCostoConector = document.getElementById("txtCostoConector");

  //Periodo por ficha tecnica 
  const periodoDate = new Date();
  periodoDate.setMonth(periodoDate.getMonth() + 6);
  const DateFormateado = periodoDate.toISOString().split("T")[0];
  txtPeriodo.value = DateFormateado;
  txtPeriodo.min = DateFormateado;

  var today = new Date().toISOString().split("T")[0];

  let tipoServicio = "";
  let numeroSintotizadores = 0;
  let numeroRepetidores = 0;
  let jsonCosto = {};
  let jsonData = {};
  let jsonCable = {};
  let jsonRepetidor = [];
  let jsonSintotizador = [];
  let flagFichaInstalacion = false;

  const requiredFields = document.querySelectorAll(".form-control");

  // Validar campos requeridos en tiempo real
  requiredFields.forEach(field => {
    field.addEventListener("input", function () {
      const formGroup = field.closest('.form-floating');
      const label = formGroup ? formGroup.querySelector('label') : null; // Encontrar el label
      const asterisk = label ? label.querySelector('.required-asterisk') : null; // Encontrar el asterisco
      const invalidFeedback = formGroup ? formGroup.querySelector('.invalid-feedback') : null; // El mensaje de error

      // Comprobar si encontramos el asterisco
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

  // Validar valores negativos en tiempo real para campos positivos
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

  // Validar valores en tiempo real para campos con rango
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

  // Asignar eventos de validación en tiempo real
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

      // Verificar si existe ficha_instalacion
      if (ficha.ficha_instalacion) {
        const installationData = JSON.parse(ficha.ficha_instalacion);
        const fibra = installationData.fibraOptica || {};
        const cable = installationData.cable || {};

        document.getElementById("txtPotenciaFibra").value = fibra.potencia || "";
        document.getElementById("txtSsdi").value = fibra.moden?.ssid || "";
        document.getElementById("txtPeriodo").value = fibra.periodo || "";
        document.getElementById("txtPlan").value = fibra.plan || "";
        document.getElementById("txtVlan").value = fibra.vlan || "";
        document.getElementById("txtSeguridad").value = fibra.moden?.seguridad || "";
        document.getElementById("txtCodigoBarra").value = fibra.moden?.codigoBarra || "";
        document.getElementById("txtMarca").value = fibra.moden?.marca || "";
        document.getElementById("txtModelo").value = fibra.moden?.modelo || "";
        document.getElementById("txtSerieModen").value = fibra.moden?.serie || "";
        document.getElementById("slcBanda").value = fibra.moden?.banda || "";
        document.getElementById("txtAntenas").value = fibra.moden?.numeroantena || "";
        document.getElementById("chkCatv").checked = fibra.moden?.catv || false;
        document.getElementById("txtaDetallesModen").value = fibra.detalles || "";

        // Actualizar el texto del estado del CATV
        var statusText = document.getElementById('statusText');
        statusText.textContent = fibra.moden?.catv ? 'Sí' : 'No';

        const jsonRepetidor = fibra.repetidores || [];
        if (jsonRepetidor.length > 0) {
          document.getElementById("txtSsidRepetidor").value = jsonRepetidor[0]?.ssid || "";
          document.getElementById("txtContraseniaRepetidor").value = jsonRepetidor[0]?.contrasenia || "";
          document.getElementById("txtCodigoBarrasRepetidor").value = jsonRepetidor[0]?.codigoBarra || "";
          document.getElementById("txtMarcaRepetidor").value = jsonRepetidor[0]?.marca || "";
          document.getElementById("txtModeloRepetidor").value = jsonRepetidor[0]?.modelo || "";
          document.getElementById("txtPrecioRepetidor").value = jsonRepetidor[0]?.precio || "";
          document.getElementById("txtSerieRepetidor").value = jsonRepetidor[0]?.serie || "";
          document.getElementById("txtIpRepetidor").value = jsonRepetidor[0]?.ip || "";
        }

        const numeroRepetidores = jsonRepetidor.length;
        const cardContainer = document.getElementById("cardContainer");
        const contenidoCarta = document.getElementById("cardsRow");

        jsonRepetidor.forEach((repetidor, index) => {
          const nuevoRepetidor = document.createElement("div");
          nuevoRepetidor.classList.add("col-12", "col-md-6", "col-lg-3");
          nuevoRepetidor.innerHTML = `
            <div class="card repetidor-card mb-2" id="carta${index + 1}">
              <div class="header">
                <h2 class="title">Repetidor - N° ${index + 1}</h2>
              </div>
              <div class="content">
                <div class="row">
                  <div class="field">
                    <i class="fas fa-wifi icon"></i>
                    <label>SSID:</label>
                    <span>${repetidor.ssid}</span>
                  </div>
                  <div class="field">
                    <i class="fas fa-lock icon"></i>
                    <label>Contraseña:</label>
                    <span class="password">${repetidor.contrasenia}</span>
                  </div>
                </div>
                <div class="row">
                  <div class="field">
                    <i class="fas fa-server icon"></i>
                    <label>Serie:</label>
                    <span>${repetidor.serie}</span>
                  </div>
                  <div class="field">
                    <i class="fas fa-desktop icon"></i>
                    <label>Modelo:</label>
                    <span>${repetidor.modelo}</span>
                  </div>
                </div>
                <div class="row">
                  <div class="field">
                    <i class="fas fa-box icon"></i>
                    <label>Marca:</label>
                    <span>${repetidor.marca}</span>
                  </div>
                  <div class="field">
                    <i class="fas fa-dollar-sign icon"></i>
                    <label>Precio:</label>
                    <span>${repetidor.precio}</span>
                  </div>
                </div>
                <div class="row">
                  <div class="field">
                    <i class="fas fa-network-wired icon"></i>
                    <label>IP:</label>
                    <span>${repetidor.ip}</span>
                  </div>
                  <div class="field">
                     <i class="fas fa-hand-holding-dollar icon"></i>
                    <label>Condición:</label>
                    <span>${repetidor.condicion}</span>
                  </div>
                </div>
                <hr>
                <div class="row">
                  <div class="field">
                    <i class="fas fa-barcode icon"></i>
                    <label>Código de Barra:</label>
                    <span>${repetidor.codigoBarra}</span>
                  </div>
                </div>
              </div>
            </div>
          `;
          contenidoCarta.appendChild(nuevoRepetidor);
        });

        if (numeroRepetidores > 0) {
          cardContainer.removeAttribute("hidden");
        }

        if (ficha.tipo_servicio === "FIBR" && fibra) {
          document.querySelector("#contenidoCable").setAttribute("hidden", "true");
        } else if (cable) {
          document.querySelector("#contenidoCable").removeAttribute("hidden");
          document.getElementById("txtPagoInst").value = cable.pagoinstalacion || "";
          document.getElementById("txtPotenciaCable").value = cable.potencia || "";
          document.getElementById("txtPlanCable").value = cable.planCable || "";
          document.getElementById("slcTriplexor").value = `${cable.triplexor?.requerido},${cable.triplexor?.cargador}` || "";
          document.getElementById("txtCantConector").value = cable.conector?.numeroconector || "";
          document.getElementById("txtPrecioConector").value = cable.conector?.precio || "";
          document.getElementById("txtSplitter").value = cable.splitter?.[0]?.cantidad || "";
          document.getElementById("slcSplitter").value = cable.splitter?.[0]?.tipo || "";
          document.getElementById("txtCantCable").value = cable.cable?.metrosadicionales || "";
          document.getElementById("txtPrecioCable").value = cable.cable?.preciometro || "";
          document.getElementById("txtCantSintotizador").value = cable.sintonizadores?.[0]?.numero || "";

          if (cable.sintonizadores && cable.sintonizadores.length > 0) {
            const sintotizadorContainer = document.getElementById("mdlSintotizadorBody");
            cable.sintonizadores.forEach((sintonizador, index) => {
              numeroSintotizadores++;
              const card = document.createElement("div");
              card.className = "card mt-2";
              card.innerHTML = `
                <div class="card-body">
                  <h5 class="card-title"><i class="fa-solid fa-desktop" style="color: #0459ad;"></i> Sintonizador</h5>
                  <p class="card-text" style="color: gray;">
                    Código de Barra:
                    <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                      ${sintonizador.codigoBarra}
                    </span>
                  </p>
                  <p class="card-text" style="color: gray;">
                    Marca:
                    <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                      ${sintonizador.marca}
                    </span>
                  </p>
                  <p class="card-text" style="color: gray;">
                    Modelo:
                    <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                      ${sintonizador.modelo}
                    </span>
                  </p>
                  <p class="card-text" style="color: gray;">
                    Serie:
                    <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                      ${sintonizador.serie}
                    </span>
                  </p>
                  <p class="card-text" style="color: gray;">
                    Precio:
                    <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                      ${sintonizador.precio}
                    </span>
                  </p>
                  <button class="btn btn-danger btn-sm mt-2 btnEliminar">
                    <i class="fas fa-times"></i> Eliminar
                  </button>
                </div>
              `;
              sintotizadorContainer.appendChild(card);

              card.querySelector(".btnEliminar").addEventListener("click", async function () {
                card.remove();
                await ActualizarCantidadSintotizador();
                numeroSintotizadores--;
                jsonSintotizador.pop();
              });

              jsonSintotizador.push(sintonizador);
            });
            await ActualizarCantidadSintotizador();
          }
        }

        // Mostrar Costos
        const costo = installationData.costo || {};
        document.getElementById("txtPagoAdelantado").value = costo.pagoAdelantado || "";
        document.getElementById("txtDescuento").value = costo.descuento || "";
        document.getElementById("txtGponNap").value = costo.nap?.gpon || "";
        document.getElementById("txtCatvNap").value = costo.nap?.catv || "";
        document.getElementById("txtGponCasa").value = costo.casa?.gpon || "";
        document.getElementById("txtCatvCasa").value = costo.casa?.catv || "";
        document.getElementById("txtCantSintotizador").value = costo.cableCosto?.numerosintotizadores || "";
        document.getElementById("txtCostoAlquiler").value = costo.cableCosto?.costoAlquilerSintotizador || "";
        document.getElementById("txtCantCable").value = costo.cableCosto?.cantidadCable || "";
        document.getElementById("txtPrecioCable").value = costo.cableCosto?.precioCable || "";
        document.getElementById("txtPrecioConector").value = costo.cableCosto?.precioConector || "";
        document.getElementById("txtCantConector").value = costo.cableCosto?.cantidadConector || "";
        document.getElementById("txtDetalle").value = costo.cableCosto?.detalle || "";

        // Calcular costos de cable y conector
        calcularCostos();
      } else {
        showToast("No hay datos en la Ficha de Instalación.", "INFO");
      }
    } catch (error) {
      console.error("Error al obtener los datos de la ficha de instalación:", error);
    }
  })();

  async function fibraOptica() {
    const txtUsuario = document.querySelector("#txtUsuario").value;
    const txtPlan = document.querySelector("#txtPlan").value;
    const txtClaveAcceso = document.querySelector("#txtClaveAcceso").value;
    const txtPeriodo = document.querySelector("#txtPeriodo").value;
    const txtVlan = document.querySelector("#txtVlan").value;
    const txtPotencia = document.querySelector("#txtPotenciaFibra").value;
    const txtSsdi = document.querySelector("#txtSsdi").value;
    const txtSeguridad = document.querySelector("#txtSeguridad").value;
    const txtCodigoBarra = document.querySelector("#txtCodigoBarra").value;
    const txtMarca = document.querySelector("#txtMarca").value;
    const txtModelo = document.querySelector("#txtModelo").value;
    const txtSerieModen = document.querySelector("#txtSerieModen").value;
    const slcBanda = document.querySelector("#slcBanda").value;
    const txtAntenas = document.querySelector("#txtAntenas").value;
    const chkCatv = document.querySelector("#chkCatv").checked;
    const txtaDetallesModen = document.querySelector("#txtaDetallesModen").value;

    jsonData = {
      fibraOptica: {
        usuario: txtUsuario,
        claveacceso: txtClaveAcceso,
        vlan: txtVlan,
        periodo: txtPeriodo,
        plan: txtPlan,
        potencia: parseInt(txtPotencia),
        moden: {
          ssid: txtSsdi,
          seguridad: txtSeguridad,
          codigoBarra: parseInt(txtCodigoBarra),
          marca: txtMarca,
          modelo: txtModelo,
          serie: txtSerieModen,
          banda: slcBanda.split(","),
          numeroantena: parseInt(txtAntenas),
          catv: chkCatv,
        },
        detalles: txtaDetallesModen,
      },
      idCaja: idCaja, // id de la caja
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
      potencia: txtPotencia,
      planCable: txtPlanCable,
      triplexor: {
        requerido: slcTriplexor[0],
        cargador: slcTriplexor[1],
      },
      conector: {
        numeroconector: parseInt(txtCantConector),
        precio: parseFloat(txtPrecioConector),
      },
      splitter: [
        {
          cantidad: parseInt(txtSplitter),
          tipo: slcSplitter,
        },
      ],
      cable: {
        metrosadicionales: parseInt(txtCantCable),
        preciometro: parseFloat(txtPrecioCable),
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
      pagoAdelantado: txtPagoAdelantado,
      descuento: txtDescuento,
      nap: {
        gpon: txtGponNap,
        catv: txtCatvNap,
      },
      casa: {
        gpon: txtGponCasa,
        catv: txtCatvCasa,
      },
    };

    if (typeof tipoServicio !== "undefined" && (tipoServicio === "FIBR,CABL" || tipoServicio === "CABL,FIBR")) {
      const txtCantCable = document.querySelector("#txtCantCable").value;
      const txtPrecioCable = document.querySelector("#txtPrecioCable").value;
      const txtPrecioConector = document.querySelector("#txtPrecioConector").value;
      const txtCantConector = document.querySelector("#txtCantConector").value;
      const txtDetalle = document.querySelector("#txtDetalle").value;
      const txtCostoCable = document.querySelector("#txtCostoCable").value;
      const txtCostoConector = document.querySelector("#txtCostoConector").value;

      const jsonCostoCable = {
        numerosintotizadores: parseInt(txtCantSintotizador) || 0,
        costoAlquilerSintotizador: parseFloat(txtCostoAlquiler) || 0,
        costoCable: parseFloat(txtCostoCable) || 0,
        costoConector: parseFloat(txtCostoConector) || 0,
        cantidadCable: txtCantCable,
        precioCable: txtPrecioCable,
        precioConector: txtPrecioConector,
        cantidadConector: txtCantConector,
        detalle: txtDetalle,
      };
      jsonCosto.cableCosto = jsonCostoCable;
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
        codigoBarra: codigoBarra,
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
      codigoBarra: txtCodigoBarraSintonizador,
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
  //Evento de escaneo de código de barras fibra óptica
  document.getElementById('txtCodigoBarra').addEventListener('input', async function () {
    const codigoBarra = this.value.trim();

    if (codigoBarra === "") {
      return; // Si está vacío, no hacemos nada
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

  //Evento de escaneo de código de barras repetidor
  document.getElementById('txtCodigoBarrasRepetidor').addEventListener('input', async function () {
    const codigoBarra = this.value.trim();

    if (codigoBarra === "") {
      return; // No hacer nada si el campo está vacío
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

  async function guardar() {
    if (!validarCampos()) {
      showToast("Por favor, llene todos los campos requeridos.", "WARNING");
      return;
    }

    // El resto de la función sigue igual
    await fibraOptica();
    await cable();
    const jsonCosto = await costos();

    if (numeroRepetidores > 0) {
      jsonData.fibraOptica.repetidores = jsonRepetidor;
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
    // Campos a validar
    const campos = [
      "txtVlan",
      "txtPeriodo",
      "txtPotenciaFibra",
      "txtSsdi",
      "txtSeguridad",
      "txtCodigoBarra",
      "txtSerieModen",
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
      "txtCatvCasa"
    ];

    let esValido = true;

    // Recorrer cada campo y validar
    for (const campo of campos) {
      const elemento = document.getElementById(campo);

      // Validar si el campo está vacío
      if (elemento.value.trim() === "") {
        elemento.classList.add("is-invalid");
        esValido = false;
      } else {
        elemento.classList.remove("is-invalid");
      }

      // Obtener el valor numérico del campo
      const valor = parseFloat(elemento.value);
      const min = parseFloat(elemento.min);  // Obtener valor mínimo del atributo min
      const max = parseFloat(elemento.max);  // Obtener valor máximo del atributo max

      // Validar valores negativos (solo si el campo permite negativos)
      if (valor < 0 && elemento.hasAttribute('min') && valor < min) {
        elemento.classList.add("is-invalid");
        esValido = false;
      }

      // Validar valores fuera de rango (solo si el campo tiene min y max definidos)
      if (valor < min || valor > max) {
        elemento.classList.add("is-invalid");
        esValido = false;
      }
    }

    return esValido;
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

    // Limpiar los campos después de agregar un sintonizador
    document.getElementById("txtCodigoBarraSintonizador").value = "";
    document.getElementById("txtMarcaSintonizador").value = "";
    document.getElementById("txtModeloSintonizador").value = "";
    document.getElementById("txtSerieSintonizador").value = "";
  });

  document.getElementById("btnAñadirRepetidor").addEventListener("click", async function () {
    const codigoBarra = document.getElementById("txtCodigoBarrasRepetidor").value;
    const ssdi = document.getElementById("txtSsidRepetidor").value;
    const contrasenia = document.getElementById("txtContraseniaRepetidor").value;
    const ip = document.getElementById("txtIpRepetidor").value;
    const condicion = document.getElementById("slcCondicionRepetidor").value;
    const serie = document.getElementById("txtSerieRepetidor").value;

    if (codigoBarra === "" || ssdi === "" || contrasenia === "" || ip === "" || condicion === "") {
      if (!codigoBarra) {
        document.getElementById("txtCodigoBarrasRepetidor").classList.add("is-invalid");
      } else {
        document.getElementById("txtCodigoBarrasRepetidor").classList.remove("is-invalid");
      }

      if (!ssdi) {
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

    //Limpiar los campos 
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

  function formatoIPinput(event) {
    let input = event.target.value.replace(/[^0-9.]/g, "");
    let formattedInput = "192.168.";
    let count = 0;

    input = input.replace(/^192\.168\./, "");

    for (let i = 0; i < input.length; i++) {
      if (input[i] !== ".") {
        formattedInput += input[i];
        count++;
        if (count % 3 === 0 && i < input.length - 1 && input[i + 1] !== ".") {
          formattedInput += ".";
        }
      } else {
        if (formattedInput[formattedInput.length - 1] !== ".") {
          formattedInput += ".";
        }
        count = 0;
      }
    }
    event.target.value = formattedInput.slice(0, 15);
  }

  document.getElementById("btnCancelar").addEventListener("click", () => {
    window.location.href = `${config.HOST}views/Contratos/`;
  });

  /* document.getElementById("btnReporte").addEventListener("click", () => {
    window.open(`${config.HOST}views/reports/Contrato_GPON/soporte.php?id=${idContrato}`, '_blank');
  }); */

  $("#txtIpRepetidor").on("input", function (event) {
    formatoIPinput(event);
  });

  document.getElementById('chkCatv').addEventListener('change', function () {
    var statusText = document.getElementById('statusText');
    statusText.textContent = this.checked ? 'Sí' : 'No';
  });

  //Evento de escaneo de código de barras fibra óptica
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
