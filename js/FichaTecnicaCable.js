import config from "../env.js";

document.addEventListener("DOMContentLoaded", () => {
  const userid = user["idUsuario"];
  const txtCantCable = document.getElementById("txtCantCable");
  const txtPrecioCable = document.getElementById("txtPrecioCable");
  const txtCostoCable = document.getElementById("txtCostoCable");
  const txtCantConector = document.getElementById("txtCantConector");
  const txtPrecioConector = document.getElementById("txtPrecioConector");
  const txtCostoConector = document.getElementById("txtCostoConector");
  const txtSplitter = document.getElementById("txtSplitter");
  const txtPeriodo = document.getElementById("txtPeriodo");
  const txtPotenciaCable = document.getElementById("txtPotenciaCable");
  let numeroSintotizadores = 0;
  let jsonSintotizador = [];
  let jsonCosto = {};
  let jsonData = {};
  let jsonCable = {};

  
  document.getElementById("txtFecha").value = new Date().toISOString().split('T')[0];

  
  const periodoDate = new Date();
  periodoDate.setMonth(periodoDate.getMonth() + 6);
  txtPeriodo.value = txtPeriodo.min = periodoDate.toISOString().split("T")[0];

  const camposRequeridos = document.querySelectorAll(".form-control");

  
  camposRequeridos.forEach(campo => {
    campo.addEventListener("input", () => {
      const grupoFormulario = campo.closest('.form-floating');
      const etiqueta = grupoFormulario?.querySelector('label');
      const asterisco = etiqueta?.querySelector('.required-asterisk');
      const mensajeError = grupoFormulario?.querySelector('.invalid-feedback');

      if (asterisco) {
        if (campo.value.trim() !== "") {
          asterisco.style.display = "none";
          campo.classList.remove("is-invalid");
          if (mensajeError) {
            mensajeError.style.display = "none";
          }
        } else {
          asterisco.style.display = "inline";
          campo.classList.add("is-invalid");
          if (mensajeError) {
            mensajeError.style.display = "block";
          }
        }
      } else {
        console.warn("Asterisco no encontrado para el campo:", campo);
      }
    });
  });

  
  function validarValorNegativoPositivo(event) {
    const elemento = event.target;
    const min = 0;
    const mensaje = `${elemento.placeholder} debe ser ${min} o más.`;
    const mensajeError = elemento.nextElementSibling;

    if (parseFloat(elemento.value) < min) {
      elemento.classList.add("is-invalid");
      mensajeError.textContent = mensaje;
      mensajeError.style.display = "block";
    } else {
      elemento.classList.remove("is-invalid");
      mensajeError.style.display = "none";
    }
  }

  
  function validarValorRango(event) {
    const elemento = event.target;
    const min = parseFloat(elemento.min);
    const max = parseFloat(elemento.max);
    const mensaje = `${elemento.placeholder} debe estar entre ${min} y ${max}.`;
    const mensajeError = elemento.closest('.form-floating').querySelector('.invalid-feedback');

    if (parseFloat(elemento.value) < min || parseFloat(elemento.value) > max) {
      elemento.classList.add("is-invalid");
      if (mensajeError) {
        mensajeError.textContent = mensaje;
        mensajeError.style.display = "block";
      }
    } else {
      elemento.classList.remove("is-invalid");
      if (mensajeError) {
        mensajeError.style.display = "none";
      }
    }
  }

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


      const idCaja = fichaInstalacion.idcaja;


      document.getElementById("txtUsuario").value = data[0].nombre_cliente;
      document.getElementById("txtPaquete").value = data[0].paquete;
      document.getElementById("txtNumFicha").value = data[0].id_contrato;
      document.getElementById("txtIdCaja").value = idCaja;

    } catch (error) {
      console.error(
        "Error al obtener los datos de la ficha de Instalación:",
        error
      );
    }
  })();

  
  async function cable() {
    const txtIdCaja = document.querySelector("#txtIdCaja").value;
    const slcFilaEntrada = document.querySelector("#slcFilaEntrada").value;
    const txtPuerto = document.querySelector("#txtPuerto").value;
    const txtPaquete = document.querySelector("#txtPaquete").value;
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
        plan: txtPaquete,
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
        },
        idcaja: parseInt(txtIdCaja),
        tipoEntrada: {
          fila: slcFilaEntrada.split(","),
          puerto: parseInt(txtPuerto)
        }
      };
    }
  }

  
  async function costos() {
    const txtCantSintotizador = document.querySelector("#txtCantSintotizador").value;
    const txtCostoAlquiler = document.querySelector("#txtCostoAlquiler").value;
    const txtCostoCable = document.querySelector("#txtCostoCable").value;
    const txtCostoConector = document.querySelector("#txtCostoConector").value;
    const txtGponNap = document.querySelector("#txtGponNap").value;
    const txtCatvNap = document.querySelector("#txtCatvNap").value;
    const txtGponCasa = document.querySelector("#txtGponCasa").value;
    const txtCatvCasa = document.querySelector("#txtCatvCasa").value;

    const jsonCosto = {
      nap: {
        gpon: parseInt(txtGponNap),
        catv: parseInt(txtCatvNap),
      },
      casa: {
        gpon: parseInt(txtGponCasa),
        catv: parseInt(txtCatvCasa),
      },
    };

    const txtCantCable = document.querySelector("#txtCantCable").value;
    const txtPrecioCable = document.querySelector("#txtPrecioCable").value;
    const txtPrecioConector = document.querySelector("#txtPrecioConector").value;
    const txtCantConector = document.querySelector("#txtCantConector").value;
    const txtDetalle = document.querySelector("#txtDetalle").value;

    const jsonCostoCable = {
      numerosintotizadores: parseInt(txtCantSintotizador) || 0,
      costoalquilersintotizador: parseFloat(txtCostoAlquiler) || 0,
      costocable: parseFloat(txtCostoCable) || 0,
      costoconector: txtCostoConector,
      cantidadcable: parseInt(txtCantCable),
      preciocable: txtPrecioCable,
      precioconector: txtPrecioConector,
      cantidadconector: parseInt(txtCantConector),
      detalle: txtDetalle,
    };
    jsonCosto.cablecosto = jsonCostoCable;

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
    document.getElementById("txtCostoAlquiler").value = numeroSintotizadores * 40;
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

  document.getElementById("txtPuerto").addEventListener("input", function () {
    validarPuerto();
  });

  
  function validarCampos() {
    const campos = [
      "txtUsuario",
      "txtPeriodo",
      "txtPaquete",
      "txtNumFicha",
      "txtPagoInst",
      "txtPotenciaCable",
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

  
  async function guardar() {
    if (!validarCampos()) {
      showToast("Todos los campos son obligatorios.", "WARNING");
      return;
    }

    await cable();
    jsonCosto = await costos();

    if (numeroSintotizadores > 0) {
      jsonCable.sintonizadores = jsonSintotizador;
    }
    jsonData.cable = jsonCable;
    jsonData.costo = jsonCosto;

    console.log("jsonData:", jsonData);

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

  
  document.getElementById("btnAñadirSintotizador").addEventListener("click", function () {
    const codigoBarra = document.getElementById("txtCodigoBarraSintonizador").value.trim();
    const serie = document.getElementById("txtSerieSintonizador").value.trim();

    const campos = [
      { id: "txtCodigoBarraSintonizador", valor: codigoBarra },
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

    AgregarSintotizador();

    
    campos.forEach(campo => {
      document.getElementById(campo.id).value = "";
    });
    document.getElementById("txtMarcaSintonizador").value = "";
    document.getElementById("txtModeloSintonizador").value = "";
  });

  
  document.getElementById("btnGuardar").addEventListener("click", async () => {
    await guardar();
  });

  
  document.getElementById("btnCancelar").addEventListener("click", () => {
    window.location.href = `${config.HOST}views/Contratos/`;
  });

  
  document.getElementById('txtCodigoBarraSintonizador').addEventListener('input', async function () {
    const codigoBarra = this.value.trim();

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

  txtCantCable.addEventListener("input", calcularCostos);
  txtCantConector.addEventListener("input", calcularCostos);
  
  txtCantConector.addEventListener("input", validarValorNegativoPositivo);
  txtCantCable.addEventListener("input", validarValorNegativoPositivo);
  txtSplitter.addEventListener("input", validarValorNegativoPositivo);
  txtPotenciaCable.addEventListener("input", validarValorRango);
  txtGponNap.addEventListener("input", validarValorRango);
  txtCatvNap.addEventListener("input", validarValorRango);
  txtGponCasa.addEventListener("input", validarValorRango);
  txtCatvCasa.addEventListener("input", validarValorRango);
});