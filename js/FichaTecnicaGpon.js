import config from "../env.js";
document.addEventListener("DOMContentLoaded", () => {
  const userid = user["idUsuario"];
  const txtCantCable = document.getElementById("txtCantCable");
  const txtPrecioCable = document.getElementById("txtPrecioCable");
  const txtCostoCable = document.getElementById("txtCostoCable");

  const txtCantConector = document.getElementById("txtCantConector");
  const txtPrecioConector = document.getElementById("txtPrecioConector");
  const txtCostoConector = document.getElementById("txtCostoConector");

  var today = new Date().toISOString().split("T")[0];

  let tipoPaquete = "";
  let numeroSintotizadores = 0;
  let numeroRepetidores = 0;
  let jsonCosto = {};
  let jsonData = {};
  let jsonCable = {};
  let jsonRepetidor = [];
  let jsonSintotizador = [];
  let flagFichaInstalacion = false;

  (async () => {
    try {
      const response = await fetch(
        `${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerFichaInstalacion&id=${idContrato}`
      );
      const data = await response.json();
      console.log(data);
  
      if (data.length === 0) {
        console.warn("No hay datos en ficha_instalacion.");
        return;
      }
  
      document.getElementById("txtNumFicha").value = data[0].id_contrato;
  
      tipoPaquete = data[0].tipo_paquete;
      const nombreCliente = data[0].nombre_cliente.split(", ");
      const usuario =
        (
          (nombreCliente[0]?.substring(0, 3) || "") +
          (nombreCliente[1]?.substring(0, 3) || "")
        ).toUpperCase() + idContrato;
  
      const contrasenia = "@" + usuario;
  
      document.getElementById("txtUsuario").value = usuario;
      document.getElementById("txtClaveAcceso").value = contrasenia;
      document.getElementById("txtPlan").value = data[0].servicio;
      document.getElementById("txtPlanCable").value = data[0].servicio;
  
      // Verificar si existe ficha_instalacion
      if (data[0].ficha_instalacion) {
        const installationData = JSON.parse(data[0].ficha_instalacion);
        const fibra = installationData.fibraoptica;
        const cable = installationData.cable;
        document.getElementById("txtPotenciaFibra").value =
          fibra.potencia || "";
        document.getElementById("txtSsdi").value = fibra.moden?.ssid || "";
        document.getElementById("txtSeguridad").value =
          fibra.moden?.seguridad || "";
        document.getElementById("txtMarcaModelo").value =
          fibra.moden?.marca || "";
        document.getElementById("txtSerieModen").value =
          fibra.moden?.serie || "";
        document.getElementById("slcBanda").value = fibra.moden?.banda || "";
        document.getElementById("txtAntenas").value =
          fibra.moden?.numeroantena || "";
        document.getElementById("chkCatv").checked = fibra.moden?.catv || false;
        document.getElementById("txtaDetallesModen").value =
          fibra.detalles || "";
        if (fibra.repetidores && fibra.repetidores.length > 0) {
          document.getElementById("txtSsidRepetidor").value =
            fibra.repetidores[0].ssid;
          document.getElementById("txtContraseniaRepetidor").value =
            fibra.repetidores[0].contrasenia;
          document.getElementById("txtMarcaModeloRepetidor").value =
            fibra.repetidores[0].marca;
          document.getElementById("txtIpRepetidor").value =
            fibra.repetidores[0].ip;
  
          const cardContainer = document.getElementById("cardContainer");
          cardContainer.removeAttribute("hidden");
  
          const contenidoCarta = document.getElementById("cardsRow");
          fibra.repetidores.forEach((repetidor, index) => {
            numeroRepetidores++;
            const nuevoRepetidor = document.createElement("div");
            nuevoRepetidor.innerHTML = `
              <div class="card mb-2" id="carta${numeroRepetidores}">
                  <div class="card-body">
                      <h5 class="card-title">Repetidor - N° ${numeroRepetidores}</h5>
                      <div class="row">
                          <div class="col-6">
                              <p class="card-text"><strong>SSID:</strong> ${repetidor.ssid}</p>
                          </div>
                          <div class="col-6">
                              <p class="card-text"><strong>Contraseña:</strong> ${repetidor.contrasenia}</p>
                          </div>
                      </div>
                      <div class="row">
                          <div class="col-6">
                              <p class="card-text"><strong>Producto:</strong> ${repetidor.marca}</p>
                          </div>
                          <div class="col-6">
                              <p class="card-text"><strong>IP:</strong> ${repetidor.ip}</p>
                          </div>
                      </div>
                  </div>
              </div>
            `;
            contenidoCarta.appendChild(nuevoRepetidor);
          });
        }
  
        if (data[0].tipo_paquete == "FIBR" && fibra) {
          document.querySelector("#contenidoCable").setAttribute("hidden", "true");
        } else if (cable) {
          document.querySelector("#contenidoCable").removeAttribute("hidden");
          
          document.getElementById("txtPotenciaCable").value =
            cable.potencia || "";
          document.getElementById("slcTriplexor").value =
            `${cable.triplexor?.requerido},${cable.triplexor?.cargador}` || "";
          document.getElementById("txtCantConector").value =
            cable.conector?.numeroconector || "";
          document.getElementById("txtPrecioConector").value =
            cable.conector?.precio || "";
          document.getElementById("txtSpliter").value =
            cable.spliter?.[0]?.cantidad || "";
          document.getElementById("slcSpliter").value =
            cable.spliter?.[0]?.tipo || "";
          document.getElementById("txtCantCable").value =
            cable.cable?.metrosadicionales || "";
          document.getElementById("txtPrecioCable").value =
            cable.cable?.preciometro || "";
          document.getElementById("txtCantSintotizador").value =
            cable.sintonizadores?.[0]?.numero || "";
  
          if (cable.sintonizadores && cable.sintonizadores.length > 0) {
            const sintotizadorContainer = document.getElementById("mdlSintotizadorBody");
            cable.sintonizadores.forEach((sintonizador, index) => {
              numeroSintotizadores++;
              const card = document.createElement("div");
              card.className = "card mt-2";
              card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">Sintonizador</h5>
                    <p class="card-text"><strong>Marca y Modelo:</strong> ${sintonizador.marcaModelo}</p>
                    <p class="card-text"><strong>Serie:</strong> ${sintonizador.serie}</p>
                    <button class="btn btn-danger btn-sm mt-2 btnEliminar">Eliminar</button>
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
  
        // Calcular costos de cable y conector
        calcularCostos();
      } else {
        showToast("No hay datos en la Ficha de Instalación.", "INFO");
      }
    } catch (error) {
      console.error(
        "Error al obtener los datos de la ficha de instalación:",
        error
      );
    }
  })();

  async function fibraOptica() {
    const txtUsuario = document.querySelector("#txtUsuario").value;
    const txtPlan = document.querySelector("#txtPlan").value;
    const txtClaveAcceso = document.querySelector("#txtClaveAcceso").value;
    const txtPotencia = document.querySelector("#txtPotenciaFibra").value;
    const txtSsdi = document.querySelector("#txtSsdi").value;
    const txtSeguridad = document.querySelector("#txtSeguridad").value;
    const txtMarcaModelo = document.querySelector("#txtMarcaModelo").value;
    const txtSerieModen = document.querySelector("#txtSerieModen").value;
    const slcBanda = document.querySelector("#slcBanda").value;
    const txtAntenas = document.querySelector("#txtAntenas").value;
    const chkCatv = document.querySelector("#chkCatv").checked;
    const txtaDetallesModen =
      document.querySelector("#txtaDetallesModen").value;
    if (!flagFichaInstalacion) {
      if (
        txtUsuario === "" ||
        txtPlan === "" ||
        txtClaveAcceso === "" ||
        txtPotencia === "" ||
        txtSsdi === "" ||
        txtSeguridad === "" ||
        txtMarcaModelo === "" ||
        slcBanda === "" ||
        txtAntenas === ""
      ) {
        showToast("Por favor, llene todos los campos.", "WARNING");
        return;
      } else {
        jsonData = {
          fibraoptica: {
            usuario: txtUsuario,
            claveacceso: txtClaveAcceso,
            plan: txtPlan,
            potencia: parseInt(txtPotencia),
            moden: {
              ssid: txtSsdi,
              seguridad: txtSeguridad,
              marca: txtMarcaModelo,
              serie: txtSerieModen,
              banda: slcBanda.split(","),
              numeroantena: parseInt(txtAntenas),
              catv: chkCatv,
            },
            detalles: txtaDetallesModen,
          },
        };
      }
    }
  }

  async function cable() {
    const txtPagoInst = document.querySelector("#txtPagoInst").value;
    const txtPotencia = document.querySelector("#txtPotenciaCable").value;
    const slcTriplexor = document
      .querySelector("#slcTriplexor")
      .value.split(",");
    const txtCantConector = document.querySelector("#txtCantConector").value;
    const txtPrecioConector =
      document.querySelector("#txtPrecioConector").value;
    const txtSpliter = document.querySelector("#txtSpliter").value;
    const slcSpliter = document.querySelector("#slcSpliter").value;
    const txtCantCable = document.querySelector("#txtCantCable").value;
    const txtPrecioCable = document.querySelector("#txtPrecioCable").value;

    if (
      txtPagoInst === "" ||
      txtPotencia === "" ||
      slcTriplexor === "" ||
      txtCantConector === "" ||
      txtPrecioConector === "" ||
      txtSpliter === "" ||
      slcSpliter === "" ||
      txtCantCable === "" ||
      txtPrecioCable === ""
    ) {
      showToast("Por favor, llene todos los campos del Cable.", "WARNING");
      return;
    } else {
      jsonCable = {
        pagoinstalacion: parseFloat(txtPagoInst),
        potencia: txtPotencia,
        sintonizador: {},
        triplexor: {
          requerido: slcTriplexor[0],
          cargador: slcTriplexor[1],
        },
        conector: {
          numeroconector: parseInt(txtCantConector),
          precio: parseFloat(txtPrecioConector),
        },
        spliter: [
          {
            cantidad: parseInt(txtSpliter),
            tipo: slcSpliter,
          },
        ],
        cable: {
          metrosadicionales: parseInt(txtCantCable),
          preciometro: parseFloat(txtPrecioCable),
        },
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
    console.log(jsonCosto);

    if (typeof tipoPaquete !== "undefined" && tipoPaquete === "GPON") {
      const txtCantCable = document.querySelector("#txtCantCable").value;
      const txtPrecioCable = document.querySelector("#txtPrecioCable").value;
      const txtPrecioConector =
        document.querySelector("#txtPrecioConector").value;
      const txtCantConector = document.querySelector("#txtCantConector").value;

      const jsonCostoCable = {
        numerosintotizadores: parseInt(txtCantSintotizador) || 0,
        costoAlquilerSintotizador: parseFloat(txtCostoAlquiler) || 0,
        cantidadCable: txtCantCable,
        precioCable: txtPrecioCable,
        precioConector: txtPrecioConector,
        cantidadConector: txtCantConector,
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

    const ssid = document.getElementById("txtSsidRepetidor").value;
    const contrasenia = document.getElementById(
      "txtContraseniaRepetidor"
    ).value;
    const marcaModelo = document.getElementById(
      "txtMarcaModeloRepetidor"
    ).value;
    const ip = document.getElementById("txtIpRepetidor").value;

    if (ssid === "" || contrasenia === "" || marcaModelo === "" || ip === "") {
      showToast("Por favor, llene todos los campos.", "WARNING");
      return;
    } else {
      numeroRepetidores++;
      const repetidor = {
        numero: numeroRepetidores,
        ssid: ssid,
        contrasenia: contrasenia,
        marca: marcaModelo,
        ip: ip,
      };
      jsonRepetidor.push(repetidor);
      nuevoRepetidor.innerHTML = `
              <div class="card mb-2" id="carta${numeroRepetidores}">
                  <div class="card-body">
                      <h5 class="card-title">Repetidor - N° ${numeroRepetidores}</h5>
                      <div class="row">
                          <div class="col-6">
                              <p class="card-text"><strong>SSID:</strong> ${ssid}</p>
                          </div>
                          <div class="col-6">
                              <p class="card-text"><strong>Contraseña:</strong> ${contrasenia}</p>
                          </div>
                      </div>
                      <div class="row">
                          <div class="col-6">
                              <p class="card-text"><strong>Producto:</strong> ${marcaModelo}</p>
                          </div>
                          <div class="col-6">
                              <p class="card-text"><strong>IP:</strong> ${ip}</p>
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
      document.getElementById("txtMarcaModeloRepetidor").value = "";
      document.getElementById("txtIpRepetidor").value = "";
      document.getElementById("txtSerieRepetidor").value = "";
      $("#mdlRepetidor").modal("hide");
    }
  }

  async function AgregarSintotizador() {
    const marcaModelo = "ASUS";
    const serie = "1234567890";
    numeroSintotizadores++;
    const jsonSintotizadorNuevo = {
      numero: numeroSintotizadores,
      marcaModelo: marcaModelo,
      serie: serie,
    };
    jsonSintotizador.push(jsonSintotizadorNuevo);
    const card = document.createElement("div");
    card.className = "card mt-2";
    card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">Sintonizador</h5>
                <p class="card-text"><strong>Marca y Modelo:</strong> ${marcaModelo}</p>
                <p class="card-text"><strong>Serie:</strong> ${serie}</p>
                <button class="btn btn-danger btn-sm mt-2 btnEliminar">Eliminar</button>
            </div>
        `;

    document.getElementById("mdlSintotizadorBody").appendChild(card);

    card
      .querySelector(".btnEliminar")
      .addEventListener("click", async function () {
        card.remove();
        await ActualizarCantidadSintotizador();
        numeroSintotizadores--;
        jsonSintotizador.pop();
      });

    await ActualizarCantidadSintotizador();
  }

  async function guardar() {
    await fibraOptica();
    await cable();
    const jsonCosto = await costos();
    if (numeroRepetidores > 0) {
      jsonData.fibraoptica.repetidores = jsonRepetidor;
    }
    console.log(tipoPaquete);
    if (tipoPaquete == "GPON") {
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
  }

  txtCantCable.addEventListener("input", calcularCostos);

  txtCantConector.addEventListener("input", calcularCostos);

  document
    .getElementById("btnAñadirSintotizador")
    .addEventListener("click", function () {
      AgregarSintotizador();
    });

  document
    .getElementById("btnAñadirRepetidor")
    .addEventListener("click", async function () {
      AgregarRepetidor();
    });

  document.querySelector("#eliminarRepetidor").addEventListener("click", () => {
    const card = document.querySelector(`#carta${numeroRepetidores}`);
    card.remove();
    numeroRepetidores--;
    jsonRepetidor.pop();
    if (numeroRepetidores === 0) {
      document.getElementById("cardContainer").hidden = true;
    }
  });

  document.getElementById("btnGuardar").addEventListener("click", async () => {
    if (!flagFichaInstalacion) {
      await guardar();
      showToast("Ficha de Instalación Guardarda Correctamente", "SUCCESS");
      setTimeout(() => {
        window.location.href = `${config.HOST}views/Contratos/Index.php`;
      }, 2500);
    } else {
      showToast("La ficha de instalación ya ha sido guardada.", "WARNING");
    }
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
    window.location.href = `${config.HOST}views/Contratos/Index.php`;
  });

  $("#txtIpRepetidor").on("input", function (event) {
    formatoIPinput(event);
  });
});
