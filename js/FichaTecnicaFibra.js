import config from '../env.js';
import * as Herramientas from "./Herramientas.js";
document.addEventListener('DOMContentLoaded', async () => {
  let login = await Herramientas.obtenerLogin();

  const userid = login.idUsuario;

  let jsonData = [];
  let jsonRepetidor = [];
  let numeroRepetidores = 0;
  let idCaja = 0;

  document.getElementById("txtFecha").value = new Date().toISOString().split('T')[0];

  const txtPeriodo = document.getElementById("txtPeriodo");
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
      console.log(data);

      if (data.length === 0) {
        console.warn('No se encontraron datos');
        return;
      }

      const fichaInstalacion = JSON.parse(data[0].ficha_instalacion);

      idCaja = fichaInstalacion.idcaja;

      const responseCajaNombre = await fetch(
        `${config.HOST}app/controllers/Caja.controllers.php?operacion=cajabuscarId&idCaja=${idCaja}`
      );
      const dataCaja = await responseCajaNombre.json();
      console.log(dataCaja);

      document.getElementById("txtNumFicha").value = data[0].id_contrato;

      const nombreCliente = data[0].nombre_cliente.split(", ");
      const nombres = nombreCliente[0].split(" ");
      let apellidos = nombreCliente[1].split(" ");

      const primerNombre = nombres[0];
      let primerApellido = apellidos[0];
      let segundoApellido = apellidos[1];

      // Saltar apellidos de dos caracteres
      apellidos = apellidos.filter(apellido => apellido.length > 2);
      primerApellido = apellidos[0];
      segundoApellido = apellidos[1];

      const usuario = (primerNombre.substring(0, 3) + primerApellido.substring(0, 6) + idContrato).toLowerCase();
      const contrasenia = "@" + segundoApellido.substring(0, 7).toLowerCase() + idContrato;

      document.getElementById("txtnombreCliente").textContent = data[0].nombre_cliente;
      document.getElementById("txtUsuario").value = usuario;
      document.getElementById("txtClaveAcceso").value = contrasenia;
      document.getElementById("txtPlan").value = data[0].paquete;
      document.getElementById("txtIdCaja").value = dataCaja[0].nombre;

      if (!fichaInstalacion || !fichaInstalacion.fibraoptica) {
        showToast('No se encontraron datos de fibra óptica', "INFO");
        return;
      }

    } catch (error) {
      console.error(
        "Error al obtener los datos de la ficha de instalación:",
        error
      );
    }
  })();

  /**
   * Función asincrónica que recopila datos de varios campos de entrada en un formulario
   * y los organiza en un objeto JSON para su posterior uso.
   *
   * @async
   * @function fibraOptica
   * @returns {void}
   *
   * @property {string} txtIdCaja - ID de la caja.
   * @property {string} txtPuerto - Puerto de conexión.
   * @property {string} txtUsuario - Nombre de usuario.
   * @property {string} txtClaveAcceso - Clave de acceso.
   * @property {string} txtVlan - VLAN.
   * @property {string} txtPlan - Plan de servicio.
   * @property {string} txtPeriodo - Periodo de servicio.
   * @property {string} txtPotencia - Potencia de la fibra.
   * @property {string} txtSsid - SSID del router.
   * @property {string} txtSeguridad - Tipo de seguridad del router.
   * @property {string} txtMAC - Dirección MAC del router.
   * @property {string} txtMarca - Marca del router.
   * @property {string} txtModelo - Modelo del router.
   * @property {string} txtIp - Dirección IP del router.
   * @property {string} txtSerie - Número de serie del router.
   * @property {string} slcBanda - Banda del router.
   * @property {string} txtAntenas - Número de antenas del router.
   * @property {boolean} chkCatv - Indica si CATV está habilitado.
   * @property {string} txtDetalles - Detalles adicionales.
   * @property {string} txtUsuarioRouter - Usuario del router.
   * @property {string} txtSeguridadRouter - Seguridad del router.
   * @property {Object} jsonData - Objeto JSON que contiene todos los datos recopilados.
   * @property {Object} jsonData.fibraoptica - Datos de la fibra óptica.
   * @property {Object} jsonData.fibraoptica.router - Datos del router.
   * @property {Object} jsonData.tipoentrada - Datos del tipo de entrada.
   * @property {number} jsonData.idcaja - ID de la caja.
   */
  async function fibraOptica() {
    const txtIdCaja = document.querySelector("#txtIdCaja").value;
    const txtPuerto = document.querySelector("#txtPuerto").value;
    const txtUsuario = document.querySelector("#txtUsuario").value;
    const txtClaveAcceso = document.querySelector("#txtClaveAcceso").value;
    const txtVlan = document.querySelector("#txtVlan").value;
    const txtPlan = document.querySelector("#txtPlan").value;
    const txtPeriodo = document.querySelector("#txtPeriodo").value;
    const txtPotencia = document.querySelector("#txtPotenciaFibra").value;
    const txtSsid = document.querySelector("#txtSsid").value;
    const txtSeguridad = document.querySelector("#txtSeguridad").value;
    const txtMAC = document.querySelector("#txtCodigoBarra").value;
    const txtMarca = document.querySelector("#txtMarca").value;
    const txtModelo = document.querySelector("#txtModelo").value;
    const txtIp = document.querySelector("#txtIp").value;
    const txtSerie = document.querySelector("#txtSerie").value;
    const slcBanda = document.querySelector("#slcBanda").value;
    const txtAntenas = document.querySelector("#txtAntenas").value;
    const chkCatv = document.querySelector("#chkCatv").checked;
    const txtDetalles = document.querySelector("#txtDetalles").value;
    const txtUsuarioRouter = document.querySelector("#txtUsuarioRouter").value;
    const txtSeguridadRouter = document.querySelector("#txtSeguridadRouter").value;

    jsonData = {
      periodo: txtPeriodo,
      fibraoptica: {
        usuario: txtUsuario,
        claveacceso: txtClaveAcceso,
        vlan: parseInt(txtVlan),
        plan: txtPlan,
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
      tipoentrada: {
        puerto: parseInt(txtPuerto)
      },
      idcaja: parseInt(idCaja)
    };
  }


  /**
   * Agrega un nuevo repetidor a la lista y lo muestra en la interfaz de usuario.
   * 
   * @async
   * @function AgregarRepetidor
   * @returns {void}
   * 
   * @description Esta función obtiene los valores de los campos de entrada del repetidor,
   * valida que todos los campos requeridos estén completos, crea un nuevo objeto repetidor,
   * lo agrega a la lista de repetidores y actualiza la interfaz de usuario para mostrar el nuevo repetidor.
   * 
   * @throws {Error} Si alguno de los campos requeridos no está completo, muestra un mensaje de advertencia.
   */
  async function AgregarRepetidor() {
    const cardContainer = document.getElementById("cardContainer");
    const contenidoCarta = document.getElementById("cardsRow");
    const nuevoRepetidor = document.createElement("div");
    nuevoRepetidor.classList.add("col-12", "col-md-6", "col-lg-3");

    const ssid = document.getElementById("txtSsidRepetidor")?.value;
    const contrasenia = document.getElementById("txtContraseniaRepetidor")?.value;
    const codigoBarra = document.getElementById("txtCodigoBarrasRepetidor")?.value;
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


  document.getElementById('txtCodigoBarra').addEventListener('input', async function () {
    const codigoBarra = this.value.trim();

    if (codigoBarra === "") {
      return;
    }

    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoBarraRouter&codigoBarra=${codigoBarra}`);
      const resultado = await respuesta.json();

      if (Array.isArray(resultado) && resultado.length > 0) {
        const producto = resultado[0];
        if (producto?.marca && producto?.modelo) {
          document.getElementById('txtMarca').value = producto.marca;
          document.getElementById('txtModelo').value = producto.modelo;
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
      const respuesta = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoBarraRepetidor&codigoBarra=${codigoBarra}`);
      const resultado = await respuesta.json();

      if (Array.isArray(resultado) && resultado.length > 0) {
        const producto = resultado[0];
        if (producto?.marca && producto?.modelo) {
          document.getElementById('txtMarcaRepetidor').value = producto.marca;
          document.getElementById('txtModeloRepetidor').value = producto.modelo;
          document.getElementById('txtPrecioRepetidor').value = producto.precio_actual;
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


  function validarCampos() {
    const campos = [
      "txtUsuario",
      "txtClaveAcceso",
      "txtVlan",
      "txtPlan",
      "txtPeriodo",
      "txtPotenciaFibra",
      "txtSsid",
      "txtIp",
      "txtSeguridad",
      "txtCodigoBarra",
      "txtSerie",
      "slcBanda",
      "txtPuerto",
      "txtAntenas"
    ];

    let todosValidos = true;

    for (const campo of campos) {
      const elemento = document.getElementById(campo);


      if (!elemento || elemento.value.trim() === "") {
        if (elemento) {
          elemento.classList.add("is-invalid");
        }
        todosValidos = false;
        continue;
      } else {
        elemento.classList.remove("is-invalid");
      }


      if (!isNaN(elemento.value)) {
        const valor = parseFloat(elemento.value);
        const minimo = elemento.hasAttribute('min') ? parseFloat(elemento.min) : null;
        const maximo = elemento.hasAttribute('max') ? parseFloat(elemento.max) : null;


        if (minimo !== null && valor < minimo) {
          elemento.classList.add("is-invalid");
          todosValidos = false;
        }


        if (maximo !== null && valor > maximo) {
          elemento.classList.add("is-invalid");
          todosValidos = false;
        }
      }
    }

    validarPuerto();

    return todosValidos;
  }

  /**
   * Muestra un mensaje de error si el valor es inválido.
   * 
   * Reglas de validación:
   * - Si la fila seleccionada es "1", el valor del puerto debe estar entre 1 y 8.
   * - Si la fila seleccionada es "2", el valor del puerto debe estar entre 1 y 16.
   * 
   * Si el valor del puerto es inválido, se muestra un mensaje de error y se añade la clase "is-invalid" al campo de texto.
   * Si el valor del puerto es válido, se oculta el mensaje de error y se elimina la clase "is-invalid".
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
   * Guarda la ficha de instalación de fibra óptica.
   * 
   * Esta función valida los campos requeridos, guarda la ficha de instalación
   * y maneja la respuesta del servidor. Muestra mensajes de éxito o error
   * según corresponda.
   * 
   * @async
   * @function Guardar
   * @returns {Promise<void>} No retorna un valor, pero redirige a otra página en caso de éxito.
   * @throws {Error} Muestra un mensaje de error si ocurre un problema al guardar la ficha de instalación.
   */
  async function Guardar() {
    if (!validarCampos()) {
      showToast("Por favor, llene todos los campos requeridos.", "WARNING");
      return;
    }

    await fibraOptica();

    const data = {
      operacion: "guardarFichaInstalacion",
      fichaInstalacion: jsonData,
      id: idContrato,
      idUsuario: userid,
    };

    try {
      const response = await fetch(
        `${config.HOST}app/controllers/Contrato.controllers.php`,
        {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
        }
      );
      const datos = await response.json();

      console.log(datos);

      if (response.ok) {
        showToast("Ficha de Instalación Guardarda Correctamente", "SUCCESS");
        setTimeout(() => {
          window.location.href = `${config.HOST}views/Contratos/`;
        }, 2500);
      } else {
        showToast("Error al guardar la ficha de instalación.", "ERROR");
      }
    } catch (error) {
      console.error('Error al guardar la ficha de instalación:', error);
      showToast("Hubo un error al guardar la ficha de instalación.", "ERROR");
    }
  }

  document.getElementById("btnAñadirRepetidor").addEventListener("click", async function () {
    const codigoBarra = document.getElementById("txtCodigoBarrasRepetidor").value.trim();
    const ssid = document.getElementById("txtSsidRepetidor").value.trim();
    const contrasenia = document.getElementById("txtContraseniaRepetidor").value.trim();
    const ip = document.getElementById("txtIpRepetidor").value.trim();
    const condicion = document.getElementById("slcCondicionRepetidor").value.trim();
    const serie = document.getElementById("txtSerieRepetidor").value.trim();

    const campos = [
      { id: "txtCodigoBarrasRepetidor", valor: codigoBarra },
      { id: "txtSsidRepetidor", valor: ssid },
      { id: "txtContraseniaRepetidor", valor: contrasenia },
      { id: "txtIpRepetidor", valor: ip },
      { id: "slcCondicionRepetidor", valor: condicion },
      { id: "txtSerieRepetidor", valor: serie }
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

    AgregarRepetidor();

    campos.forEach(campo => {
      document.getElementById(campo.id).value = "";
    });
    document.getElementById("txtPrecioRepetidor").value = "";
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
    await Guardar();
  });

  document.getElementById("btnCancelar").addEventListener("click", () => {
    window.location.href = `${config.HOST}views/Contratos/`;
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

  document.getElementById('chkCatv').addEventListener('change', function () {
    var statusText = document.getElementById('statusText');
    statusText.textContent = this.checked ? 'Sí' : 'No';
  });

  document.getElementById("txtPotenciaFibra").addEventListener("input", validarValorRango);
  document.getElementById("txtVlan").addEventListener("input", validarValorRango);
  document.getElementById("txtAntenas").addEventListener("input", validarValorRango);
});