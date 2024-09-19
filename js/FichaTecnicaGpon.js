import config from "../env.js";
document.addEventListener("DOMContentLoaded", () => {
  const txtCantCable = document.getElementById("txtCantCable");
  const txtPrecioCable = document.getElementById("txtPrecioCable");
  const txtCostoCable = document.getElementById("txtCostoCable");

  const txtCantConector = document.getElementById("txtCantConector");
  const txtPrecioConector = document.getElementById("txtPrecioConector");
  const txtCostoConector = document.getElementById("txtCostoConector");


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
    const response = await fetch(
      `${config.HOST}controllers/contrato.controllers.php?operacion=obtenerFichaInstalacion&id=${idContrato}`
    );
    const data = await response.json();
    const usuario = (data[0].nombre_cliente.split(", ")[0].substring(0, 3) + data[0].nombre_cliente.split(", ")[1].substring(0, 3)).toUpperCase() + idContrato;
    const contrasenia = "@" + usuario;
    document.getElementById("txtUsuario").value = usuario;
    document.getElementById("txtClaveAcceso").value = contrasenia;
    document.getElementById("txtPlan").value = data[0].servicio;

    if (data[0].tipo_paquete == "FIBR") {
      document.querySelector("#contenidoCable").setAttribute("hidden", "");
    } else {
      document.getElementById("txtPlanCable").value = data[0].servicio;
    }

    tipoPaquete = data[0].tipo_paquete;

    if (data[0].ficha_instalacion) {
      flagFichaInstalacion = true;
    } else {
      flagFichaInstalacion = false;
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
    const txtaDetallesModen = document.querySelector("#txtaDetallesModen").value;
    if (!flagFichaInstalacion) {
      if (txtUsuario === "" || txtPlan === "" || txtClaveAcceso === "" || txtPotencia === "" || txtSsdi === "" || txtSeguridad === "" || txtMarcaModelo === "" || slcBanda === "" || txtAntenas === "") {
        alert("Por favor, llene todos los campos.");
      } else {
        jsonData = JSON.stringify({
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
            repetidor: [],
            detalles: txtaDetallesModen,
          },
        });
      }
    }
  }

  async function cable() {
    const txtPagoInst = document.querySelector("#txtPagoInst").value;
    const txtPotencia = document.querySelector("#txtPotenciaCable").value;
    const slcTriplexor = document.querySelector("#slcTriplexor").value.split(',');
    const txtCantConector = document.querySelector("#txtCantConector").value;
    const txtPrecioConector = document.querySelector("#txtPrecioConector").value;
    const txtSpliter = document.querySelector("#txtCantSpliter").value;
    const slcSpliter = document.querySelector("#slcSpliter").value;
    const txtCantCable = document.querySelector("#txtCantCable").value;
    const txtPrecioCable = document.querySelector("#txtPrecioCable").value;

    if (txtPagoInst === "" || txtPotencia === "" || slcTriplexor === "" || txtCantConector === "" || txtPrecioConector === "" || txtSpliter === "" || slcSpliter === "" || txtCantCable === "" || txtPrecioCable === "") {
      alert("Por favor, llene todos los campos del Cable.");
    } else {
      jsonCable = JSON.stringify({
        pagoinstalacion: parseFloat(txtPagoInst),
        potencia: txtPotencia,
        sintonizador: {},
        triplexor: {
          requerido: slcTriplexor[0],
          cargador: slcTriplexor[1]
        },
        conector: {
          numeroconector: parseInt(txtCantConector),
          precio: parseFloat(txtPrecioConector)
        },
        spliter: [
          {
            cantidad: parseInt(txtSpliter),
            tipo: slcSpliter
          }
        ],
        cable: {
          metrosadicionales: parseInt(txtCantCable),
          preciometro: parseFloat(txtPrecioCable)
        }
      });
    }
  }

  async function costos() {
    const txtPagoAdelantado = document.querySelector("#txtPagoAdelantado").value;
    const txtCantSintotizador = document.querySelector("#txtCantSintotizador").value;
    const txtCostoAlquiler = document.querySelector("#txtCostoAlquiler").value;

    if(tipoPaquete == "GPON") {
      const jsonCostoClable = {
        numerosintotizadores: parseInt(txtCantSintotizador),
        costoAlquiler: parseFloat(txtCostoAlquiler),
        cantidadCable: txtCantCable,
        precioCable: txtPrecioCable,
        precioConector: txtPrecioConector,
        cantidadConector: txtCantConector,

      };
    }

    jsonCosto = JSON.stringify({
      
    });
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
    document.getElementById("txtCostoAlquiler").value = numeroSintotizadores * 40;
  }

  async function AgregarRepetidor() {
    const cardContainer = document.getElementById("cardContainer");
    const contenidoCarta = document.getElementById("cardsRow");
    const nuevoRepetidor = document.createElement("div");

    const ssid = document.getElementById("txtSsidRepetidor").value;
    const contrasenia = document.getElementById("txtContraseniaRepetidor").value;
    const marcaModelo = document.getElementById("txtMarcaModeloRepetidor").value;
    const ip = document.getElementById("txtIpRepetidor").value;

    if (ssid === "" || contrasenia === "" || marcaModelo === "" || ip === "") {
      alert("Por favor, llene todos los campos.");
    } else {
      numeroRepetidores++;
      const repetidor = {
        numero: numeroRepetidores,
        ssid: ssid,
        contrasenia: contrasenia,
        marca: marcaModelo,
        ip: ip
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
      serie: serie
    }
    jsonSintotizador.push(jsonSintotizadorNuevo);
    console.log(jsonSintotizador);
    const card = document.createElement("div");
    card.className = "card mt-2";
    card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">Sintetizador</h5>
                <p class="card-text"><strong>Marca y Modelo:</strong></p>
                <p class="card-text"><strong>Serie:</strong></p>
                <button class="btn btn-danger btn-sm mt-2 btnEliminar">Eliminar</button>
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

  txtCantCable.addEventListener("input", calcularCostos);

  txtCantConector.addEventListener("input", calcularCostos);

  document.getElementById("btnAñadirSintotizador").addEventListener("click", function () {
    AgregarSintotizador();
  });

  document.getElementById("btnAñadirRepetidor").addEventListener("click", async function () {
    AgregarRepetidor();
  });

  document.querySelector("#eliminarRepetidor").addEventListener("click", () => {
    const card = document.querySelector(`#carta${numeroRepetidores}`);
    card.remove();
    numeroRepetidores--;
    jsonRepetidor.pop();
    console.log(jsonRepetidor);
    if (numeroRepetidores === 0) {
      document.getElementById("cardContainer").hidden = true;
    }
  });
});
