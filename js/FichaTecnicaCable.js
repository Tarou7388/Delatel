import config from "../env.js";

document.addEventListener("DOMContentLoaded", () => {
  const userid = user["idUsuario"];
  const txtCantCable = document.getElementById("txtCantCable");
  const txtPrecioCable = document.getElementById("txtPrecioCable");
  const txtCostoCable = document.getElementById("txtCostoCable");

  const txtCantConector = document.getElementById("txtCantConector");
  const txtPrecioConector = document.getElementById("txtPrecioConector");
  const txtCostoConector = document.getElementById("txtCostoConector");

  const txtSpliter = document.getElementById("txtSpliter");
  const txtPeriodo = document.getElementById("txtPeriodo");

  var today = new Date().toISOString().split("T")[0];

  const periodoDate = new Date();
  periodoDate.setMonth(periodoDate.getMonth() + 6);
  const DateFormateado = periodoDate.toISOString().split("T")[0];
  txtPeriodo.value = DateFormateado;
  txtPeriodo.min = DateFormateado;

  let tipoPaquete = "";
  let numeroSintotizadores = 0;
  let jsonSintotizador = [];
  let jsonCosto = {};
  let jsonData = {};
  let jsonCable = {};

  // Script para manejar la visibilidad de los asteriscos rojos y mostrar advertencias
  const requiredFields = document.querySelectorAll(".form-control");

  requiredFields.forEach(field => {
    field.addEventListener("input", function () {
      const label = field.nextElementSibling.nextElementSibling;
      const asterisk = label.querySelector(".required-asterisk");
      const invalidFeedback = field.nextElementSibling;

      if (field.value.trim() !== "") {
        asterisk.style.display = "none";
        field.classList.remove("is-invalid");
        invalidFeedback.style.display = "none";
      } else {
        asterisk.style.display = "inline";
        field.classList.add("is-invalid");
        invalidFeedback.style.display = "block";
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
    const invalidFeedback = elemento.nextElementSibling;

    if (parseFloat(elemento.value) < min || parseFloat(elemento.value) > max) {
      elemento.classList.add("is-invalid");
      invalidFeedback.textContent = mensaje;
      invalidFeedback.style.display = "block";
    } else {
      elemento.classList.remove("is-invalid");
      invalidFeedback.style.display = "none";
    }
  }

  // Asignar eventos de validación en tiempo real
  txtCantConector.addEventListener("input", validarValorNegativoPositivo);
  txtCantCable.addEventListener("input", validarValorNegativoPositivo);
  txtSpliter.addEventListener("input", validarValorNegativoPositivo);
  txtPotenciaCable.addEventListener("input", validarValorRango);
  txtGponNap.addEventListener("input", validarValorRango);
  txtCatvNap.addEventListener("input", validarValorRango);
  txtGponCasa.addEventListener("input", validarValorRango);
  txtCatvCasa.addEventListener("input", validarValorRango);

  // Cargar Datos de Ficha del Cliente y la Ficha Tecnica
  (async () => {
    try {
      const response = await fetch(
        `${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerFichaInstalacion&id=${idContrato}`
      );
      const data = await response.json();
      console.log(data);

      if (data.length === 0 || !data[0].ficha_instalacion) {
        showToast("No hay datos en Ficha de Instalación", "INFO");
      }

      const fichaInstalacion = JSON.parse(data[0].ficha_instalacion);

      document.getElementById("txtUsuario").value = data[0].nombre_cliente;
      document.getElementById("txtPaquete").value = data[0].paquete;
      document.getElementById("txtNumFicha").value = data[0].id_contrato;

      tipoPaquete = data[0].tipo_servicio;

      // Cargar datos del cable
      if (fichaInstalacion && fichaInstalacion.cable) {
        const cable = fichaInstalacion.cable;
        document.querySelector("#txtPagoInst").value = cable.pagoinstalacion;
        document.querySelector("#txtPeriodo").value = cable.periodo;
        document.querySelector("#txtPotenciaCable").value = cable.potencia;
        document.querySelector("#slcTriplexor").value = `${cable.triplexor.requerido},${cable.triplexor.cargador}`;
        document.querySelector("#txtCantConector").value = cable.conector.numeroconector;
        document.querySelector("#txtPrecioConector").value = cable.conector.precio;
        document.querySelector("#txtSpliter").value = cable.spliter[0].cantidad;
        document.querySelector("#slcSpliter").value = cable.spliter[0].tipo;
        document.querySelector("#txtCantCable").value = cable.cable.metrosadicionales;
        document.querySelector("#txtPrecioCable").value = cable.cable.preciometro;
        calcularCostos();
      }

      // Cargar datos de costos
      if (fichaInstalacion && fichaInstalacion.costo) {
        const costo = fichaInstalacion.costo;
        document.querySelector("#txtGponNap").value = costo.nap.gpon;
        document.querySelector("#txtCatvNap").value = costo.nap.catv;
        document.querySelector("#txtGponCasa").value = costo.casa.gpon;
        document.querySelector("#txtCatvCasa").value = costo.casa.catv;

        if (costo.cableCosto) {
          document.querySelector("#txtCantSintotizador").value = costo.cableCosto.numerosintotizadores;
          document.querySelector("#txtCostoAlquiler").value = costo.cableCosto.costoAlquilerSintotizador;
          document.querySelector("#txtCantCable").value = costo.cableCosto.cantidadCable;
          document.querySelector("#txtPrecioCable").value = costo.cableCosto.precioCable;
          document.querySelector("#txtPrecioConector").value = costo.cableCosto.precioConector;
          document.querySelector("#txtCantConector").value = costo.cableCosto.cantidadConector;
        }
      }

      // Cargar datos de sintonizadores
      if (fichaInstalacion && fichaInstalacion.cable && fichaInstalacion.cable.sintonizadores) {
        jsonSintotizador = fichaInstalacion.cable.sintonizadores;
        numeroSintotizadores = jsonSintotizador.length;
        jsonSintotizador.forEach(sintonizador => {
          const card = document.createElement("div");
          card.className = "card mt-2";
          card.innerHTML = `
            <div class="card-body">
              <h5 class="card-title"><i class="fa-solid fa-desktop" style="color: #0459ad;"></i> Sintonizador</h5>
              <p class="card-text" style="color: gray;">
                Marca y Modelo:
                <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                  ${sintonizador.marcaModelo}
                </span>
              </p>
              <p class="card-text" style="color: gray;">
                Serie:
                <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
                  ${sintonizador.serie}
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
            jsonSintotizador = jsonSintotizador.filter(s => s.numero !== sintonizador.numero);
          });
        });
        await ActualizarCantidadSintotizador();
      }

    } catch (error) {
      console.error(
        "Error al obtener los datos de la ficha de Instalación:",
        error
      );
    }
  })();

  // Cable
  async function cable() {
    const txtPaquete = document.querySelector("#txtPaquete").value;
    const txtPeriodo = document.querySelector("#txtPeriodo").value;
    const txtPagoInst = document.querySelector("#txtPagoInst").value;
    const txtPotencia = document.querySelector("#txtPotenciaCable").value;
    const slcTriplexor = document.querySelector("#slcTriplexor").value.split(",");
    const txtCantConector = document.querySelector("#txtCantConector").value;
    const txtPrecioConector = document.querySelector("#txtPrecioConector").value;
    const txtSpliter = document.querySelector("#txtSpliter").value;
    const slcSpliter = document.querySelector("#slcSpliter").value;
    const txtCantCable = document.querySelector("#txtCantCable").value;
    const txtPrecioCable = document.querySelector("#txtPrecioCable").value;

    console.log("txtPaquete:", txtPaquete);
    console.log("txtPeriodo:", txtPeriodo);

    if (
      txtPaquete === "" ||
      txtPagoInst === "" ||
      txtPeriodo === "" ||
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
        paquete: txtPaquete,
        periodo: txtPeriodo,
        pagoinstalacion: parseFloat(txtPagoInst),
        potencia: txtPotencia,
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
          <h5 class="card-title"><i class="fa-solid fa-desktop" style="color: #0459ad;"></i> Sintonizador</h5>
          <p class="card-text" style="color: gray;">
            Marca y Modelo:
            <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
            ${marcaModelo}
            </span>
          </p>
          <p class="card-text" style="color: gray;">
            Serie:
            <span style="background-color: #d3d3d3; border-radius: 10px; padding: 2px 5px; color: black;">
              ${serie}
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

  async function guardar() {
    await cable();
    jsonCosto = await costos();

    if (numeroSintotizadores > 0) {
      jsonCable.sintonizadores = jsonSintotizador;
    }
    jsonData.cable = jsonCable;
    jsonData.costo = jsonCosto;

    console.log("jsonData:", jsonData);

    // Validación de campos obligatorios
    if (!validarCampos()) {
      showToast("Todos los campos son obligatorios.", "WARNING");
      return;
    }

    const data = {
      operacion: "guardarFichaInstalacion",
      fichaInstalacion: jsonData,
      id: idContrato,
      idUsuario: userid,
    };
    console.log(data);
    const response = await fetch(
      `${config.HOST}app/controllers/Contrato.controllers.php`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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
      "txtPaquete",
      "txtNumFicha",
      "txtPagoInst",
      "txtPotenciaCable",
      "slcTriplexor",
      "txtCantConector",
      "txtPrecioConector",
      "txtSpliter",
      "slcSpliter",
      "txtCantCable",
      "txtPrecioCable",
      "txtCantSintotizador",
      "txtCostoAlquiler",
      "txtGponNap",
      "txtCatvNap",
      "txtGponCasa",
      "txtCatvCasa"
    ];

    for (const campo of campos) {
      const elemento = document.getElementById(campo);
      if (!elemento || elemento.value.trim() === "") {
        elemento.classList.add("is-invalid");
        return false;
      } else {
        elemento.classList.remove("is-invalid");
      }
    }
    return true;
  }

  txtCantCable.addEventListener("input", calcularCostos);
  txtCantConector.addEventListener("input", calcularCostos);

  document.getElementById("btnAñadirSintotizador").addEventListener("click", function () {
    AgregarSintotizador();
  });

  document.getElementById("btnGuardar").addEventListener("click", async () => {
    await guardar();
  });

  document.getElementById("btnReporte").addEventListener("click", () => {
    window.open(`${config.HOST}views/reports/Contrato_CABLE/fichaInstalacion.php?id=${idContrato}`, '_blank');
  });

  document.getElementById("btnCancelar").addEventListener("click", () => {
    window.location.href = `${config.HOST}views/Contratos/`;
  });

  document.getElementById("txtFecha").value = today;
});