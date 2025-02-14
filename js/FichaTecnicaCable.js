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
  const txtSplitter = document.getElementById("txtSplitter");
  const txtPeriodo = document.getElementById("txtPeriodo");
  const txtPotenciaCable = document.getElementById("txtPotenciaCable");
  let numeroSintotizadores = 0;
  let jsonSintotizador = [];
  let jsonCosto = {};
  let jsonData = {};
  let jsonCable = {};
  let idCaja = 0;


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


  /**
   * Valida si el valor de un elemento de entrada es negativo o positivo.
   * Si el valor es menor que el mínimo permitido, muestra un mensaje de error.
   * 
   * @param {Event} event - El evento que desencadena la validación.
   */
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


  /**
   * Valida si el valor de un elemento de entrada está dentro de un rango especificado.
   * Si el valor está fuera del rango, agrega una clase de error y muestra un mensaje de error.
   * Si el valor está dentro del rango, elimina la clase de error y oculta el mensaje de error.
   *
   * @param {Event} event - El evento que desencadena la validación.
   */
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

      if (data.length === 0 || !data[0].ficha_instalacion) {
        showToast("No hay datos en Ficha de Instalación", "INFO");
      }

      const fichaInstalacion = JSON.parse(data[0].ficha_instalacion);


      idCaja = fichaInstalacion.idcaja;

      const responseCajaNombre = await fetch(
        `${config.HOST}app/controllers/Caja.controllers.php?operacion=cajabuscarId&idCaja=${idCaja}`
      );
      const dataCaja = await responseCajaNombre.json();
      console.log(dataCaja);

      document.getElementById("txtUsuario").value = data[0].nombre_cliente;
      document.getElementById("txtPaquete").value = data[0].paquete;
      document.getElementById("txtNumFicha").value = data[0].id_contrato;
      document.getElementById("txtIdCaja").value = dataCaja[0].nombre;

    } catch (error) {
      console.error(
        "Error al obtener los datos de la ficha de Instalación:",
        error
      );
    }
  })();


  /**
   * Función asíncrona que recopila datos de varios campos de entrada en un formulario,
   * valida que todos los campos estén llenos y crea un objeto JSON con los datos recopilados.
   * Muestra un mensaje de advertencia si algún campo está vacío.
   *
   * @async
   * @function cable
   * @returns {void}
   */
  async function cable() {
    const txtIdCaja = document.querySelector("#txtIdCaja").value;
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
        tipoEntrada: {
          puerto: parseInt(txtPuerto)
        },
        idcaja: parseInt(idCaja),
      };
    }
  }


  /**
   * Calcula los costos relacionados con la ficha técnica del cable.
   * 
   * @async
   * @function costos
   * @returns {Promise<Object>} Un objeto JSON que contiene los costos de NAP, casa y cable.
   * 
   * @property {Object} nap - Costos relacionados con NAP.
   * @property {number} nap.gpon - Costo de GPON en NAP.
   * @property {number} nap.catv - Costo de CATV en NAP.
   * 
   * @property {Object} casa - Costos relacionados con la casa.
   * @property {number} casa.gpon - Costo de GPON en la casa.
   * @property {number} casa.catv - Costo de CATV en la casa.
   * 
   * @property {Object} cablecosto - Costos relacionados con el cable.
   * @property {number} cablecosto.numerosintotizadores - Número de sintetizadores.
   * @property {number} cablecosto.costoalquilersintotizador - Costo de alquiler del sintetizador.
   * @property {number} cablecosto.costocable - Costo del cable.
   * @property {string} cablecosto.costoconector - Costo del conector.
   * @property {number} cablecosto.cantidadcable - Cantidad de cable.
   * @property {string} cablecosto.preciocable - Precio del cable.
   * @property {string} cablecosto.precioconector - Precio del conector.
   * @property {number} cablecosto.cantidadconector - Cantidad de conectores.
   * @property {string} cablecosto.detalle - Detalle adicional.
   */
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


  /**
   * Calcula los costos de cable y conector y actualiza los campos correspondientes.
   * 
   * La función toma las cantidades y precios de cable y conector desde los elementos
   * de entrada (input) del DOM, calcula los costos multiplicando la cantidad por el precio,
   * y luego actualiza los valores de los campos de costo con el resultado formateado a dos decimales.
   * 
   * @function
   */
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


  /**
   * Actualiza la cantidad de sintetizadores y el costo de alquiler en la interfaz de usuario.
   * 
   * @async
   * @function ActualizarCantidadSintotizador
   * @returns {void}
   */
  async function ActualizarCantidadSintotizador() {
    document.getElementById("txtCantSintotizador").value = numeroSintotizadores;
    document.getElementById("txtCostoAlquiler").value = numeroSintotizadores * 40;
  }


  /**
   * Agrega un nuevo sintonizador a la lista y actualiza la interfaz de usuario.
   * 
   * Esta función obtiene los valores de los campos de entrada del sintonizador,
   * crea un nuevo objeto sintonizador y lo agrega a la lista de sintonizadores.
   * Luego, crea una tarjeta visual para el sintonizador y la agrega al DOM.
   * También agrega un evento de clic al botón de eliminar para eliminar la tarjeta
   * y actualizar la cantidad de sintonizadores.
   * 
   * @async
   * @function AgregarSintotizador
   * @returns {Promise<void>} Una promesa que se resuelve cuando la cantidad de sintonizadores se ha actualizado.
   */
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


  /**
   * Valida el valor del puerto de entrada basado en la fila seleccionada.
   * 
   * Si la fila seleccionada es "1", el valor del puerto debe estar entre 1 y 8.
   * Si la fila seleccionada es "2", el valor del puerto debe estar entre 1 y 16.
   * 
   * Muestra un mensaje de error si el valor del puerto es inválido.
   * 
   * @function
   */
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


  /**
   * Función asincrónica para guardar la ficha técnica del cable.
   * 
   * Esta función valida los campos requeridos, guarda la información del cable y los costos,
   * y envía una solicitud para guardar la ficha de instalación en el servidor.
   * 
   * @async
   * @function guardar
   * @returns {Promise<void>} No retorna ningún valor.
   */
  async function guardar() {
    if (!validarCampos()) {
      showToast("Todos los campos son obligatorios.", "WARNING");
      return;
    }

    await cable();
    jsonCosto = await costos();

    jsonCable.sintonizadores = [];

    if (numeroSintotizadores > 0) {
      jsonCable.sintonizadores = jsonSintotizador;
    }
    jsonData.cable = jsonCable;
    jsonData.costo = jsonCosto;
    const txtIdCaja = document.querySelector("#txtIdCaja").value;
    jsonData.idcaja = parseInt(txtIdCaja);

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


  document.getElementById("btnAñadirSintotizador").addEventListener("click", async function () {
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

    await AgregarSintotizador();


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
      const respuesta = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoBarraSintonizador&codigoBarra=${codigoBarra}`);
      const resultado = await respuesta.json();

      console.log('Resultado:', resultado);

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