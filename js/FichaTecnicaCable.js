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
  let jsonSintotizador = [];
  let jsonCosto = {};
  let jsonData = {};
  let jsonCable = {};
  let flagFichaInstalacion = false;

  // Cargar Datos de Ficha del Cliente y la Ficha Tecnica
  (async () => {
    try {
      const response = await fetch(
        `${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerFichaInstalacion&id=${idContrato}`
      );
      const data = await response.json();
      console.log(data);

      if (data.length === 0) {
        console.warn("No hay datos en Ficha Instalación");
        return;
      }

      document.getElementById("txtUsuario").value = data[0].nombre_cliente;
      document.getElementById("txtPlanCable").value = data[0].servicio;
      document.getElementById("txtPaquete").value = data[0].tipo_paquete;

      document.getElementById("txtNumFicha").value = data[0].id_contrato;

      tipoPaquete = data[0].tipo_paquete;

      
    } catch (error) {
      console.error(
        "Error al obtener los datos de la ficha de Instalación:",
        error
      );
    }
  })();

  // Cable
  async function cable() {
    const txtPagoInst = document.querySelector("#txtPagoInst").value;
    const txtPotencia = document.querySelector("#txtPotenciaCable").value;
    const slcTriplexor = document.querySelector("#slcTriplexor").value.split(",");
    const txtCantConector = document.querySelector("#txtCantConector").value;
    const txtPrecioConector = document.querySelector("#txtPrecioConector").value;
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

  // Costos
  async function costos() {
    const txtCantSintotizador = document.querySelector("#txtCantSintotizador").value;
    const txtCostoAlquiler = document.querySelector("#txtCostoAlquiler").value;
    const txtGponNap = document.querySelector("#txtGponNap").value;
    const txtCatvNap = document.querySelector("#txtCatvNap").value;
    const txtGponCasa = document.querySelector("#txtGponCasa").value;
    const txtCatvCasa = document.querySelector("#txtCatvCasa").value;

    const jsonCosto = {
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
      const txtPrecioConector = document.querySelector("#txtPrecioConector").value;
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
    // Cálculo del costo del cable
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

    card.querySelector(".btnEliminar").addEventListener("click", async function () {
      card.remove();
      await ActualizarCantidadSintotizador();
      numeroSintotizadores--;
      jsonSintotizador.pop();
    });

    await ActualizarCantidadSintotizador();
  }

  async function guardar() {
    await cable();
    const jsonCosto = await costos();

    if (!validarDatos()) {
      showToast("Por favor, complete todos los campos requeridos", "WARNING");
      return;
    }

    if (numeroSintotizadores > 0) {
      jsonCable.sintonizadores = jsonSintotizador;
    }
    jsonData.cable = jsonCable;
    jsonData.costo = jsonCosto;

    console.log("Datos a guardar:", jsonData);

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
    console.log("Respuesta del servidor:", datos);
  }

  function validarDatos() {
    const txtPagoInst = document.querySelector("#txtPagoInst").value;
    const txtPotencia = document.querySelector("#txtPotenciaCable").value;
    const slcTriplexor = document.querySelector("#slcTriplexor").value.split(",");
    const txtCantConector = document.querySelector("#txtCantConector").value;
    const txtPrecioConector = document.querySelector("#txtPrecioConector").value;
    const txtSpliter = document.querySelector("#txtSpliter").value;
    const slcSpliter = document.querySelector("#slcSpliter").value;
    const txtCantCable = document.querySelector("#txtCantCable").value;
    const txtPrecioCable = document.querySelector("#txtPrecioCable").value;

    return (
      txtPagoInst !== "" &&
      txtPotencia !== "" &&
      slcTriplexor.length > 1 &&
      txtCantConector !== "" &&
      txtPrecioConector !== "" &&
      txtSpliter !== "" &&
      slcSpliter !== "" &&
      txtCantCable !== "" &&
      txtPrecioCable !== ""
    );
  }

  txtCantCable.addEventListener("input", calcularCostos);
  txtCantConector.addEventListener("input", calcularCostos);

  document.getElementById("btnAñadirSintotizador").addEventListener("click", function () {
    AgregarSintotizador();
  });

  document.getElementById("btnGuardar").addEventListener("click", async () => {
    if (!flagFichaInstalacion) {
      await guardar();
      showToast("Ficha de Instalación Guardarda Correctamente", "SUCCESS");
      /* setTimeout(() => {
        window.location.href = `${config.HOST}views/Contratos/Index.php`;
      }, 2500); */
    } else {
      showToast("La ficha de instalación ya ha sido guardada.", "WARNING");
    }
  });

  document.getElementById("btnCancelar").addEventListener("click", () => {
    window.location.href = `${config.HOST}views/Contratos/Index.php`;
  });

  document.getElementById("txtFecha").value = today;
});