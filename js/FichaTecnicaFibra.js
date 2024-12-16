import config from '../env.js';
document.addEventListener('DOMContentLoaded', () => {
  const userid = user["idUsuario"];
  const urlParams = new URLSearchParams(window.location.search);
  const idCaja = urlParams.get('idCaja') || localStorage.getItem('idCaja');
  console.log("idCaja:", idCaja);
  var today = new Date().toISOString().split('T')[0];
  document.getElementById("txtFecha").value = today;
  const txtPeriodo = document.getElementById("txtPeriodo");

  const periodoDate = new Date();
  periodoDate.setMonth(periodoDate.getMonth() + 6);
  const DateFormateado = periodoDate.toISOString().split("T")[0];
  txtPeriodo.value = DateFormateado;
  txtPeriodo.min = DateFormateado;

  let jsonData = [];
  let jsonRepetidor = [];
  let flagFichaInstalacion = false;
  let numeroRepetidores = 0;

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
  document.getElementById("txtPotenciaFibra").addEventListener("input", validarValorRango);
  document.getElementById("txtVlan").addEventListener("input", validarValorRango);
  document.getElementById("txtAntenas").addEventListener("input", validarValorRango);

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

      document.getElementById("txtNumFicha").value = data[0].id_contrato;

      const nombreCliente = data[0].nombre_cliente.split(", ");
      const usuario =
        (
          (nombreCliente[0]?.substring(0, 3) || "") +
          (nombreCliente[1]?.substring(0, 3) || "")
        ).toUpperCase() + idContrato;

      const contrasenia = "@" + usuario;

      document.getElementById("txtUsuario").value = usuario;
      document.getElementById("txtClaveAcceso").value = contrasenia;
      document.getElementById("txtPlan").value = data[0].paquete;

      // Cargar datos de la ficha de instalación
      const fichaInstalacion = JSON.parse(data[0].ficha_instalacion);
      if (!fichaInstalacion || !fichaInstalacion.fibraOptica) {
        showToast('No se encontraron datos de fibra óptica', "INFO");
        return;
      }
      const fibraOptica = fichaInstalacion.fibraOptica;

      document.getElementById("txtPeriodo").value = fibraOptica.periodo;
      document.getElementById("txtUsuario").value = fibraOptica.usuario;
      document.getElementById("txtClaveAcceso").value = fibraOptica.claveAcceso;
      document.getElementById("txtVlan").value = fibraOptica.vlan;
      document.getElementById("txtPlan").value = fibraOptica.plan;
      document.getElementById("txtPotenciaFibra").value = fibraOptica.potencia;
      document.getElementById("txtSsid").value = fibraOptica.moden.ssid;
      document.getElementById("txtSeguridad").value = fibraOptica.moden.seguridad;
      document.getElementById("txtCodigoBarra").value = fibraOptica.moden.codigoBarra;
      document.getElementById("txtMarca").value = fibraOptica.moden.marca;
      document.getElementById("txtModelo").value = fibraOptica.moden.modelo;
      document.getElementById("txtSerieModen").value = fibraOptica.moden.serie;
      document.getElementById("slcBanda").value = fibraOptica.moden.banda.join(",");
      document.getElementById("txtAntenas").value = fibraOptica.moden.numeroantena;
      document.getElementById("chkCatv").checked = fibraOptica.moden.catv;
      document.getElementById("txtDetalles").value = fibraOptica.detalles;

      // Actualizar el texto del estado del CATV
      var statusText = document.getElementById('statusText');
      statusText.textContent = fibraOptica.moden.catv ? 'Sí' : 'No';

      // Cargar datos de los repetidores
      jsonRepetidor = fibraOptica.repetidores || [];
      numeroRepetidores = jsonRepetidor.length;
      const cardContainer = document.getElementById("cardContainer");
      const contenidoCarta = document.getElementById("cardsRow");

      jsonRepetidor.forEach(repetidor => {
        const nuevoRepetidor = document.createElement("div");
        nuevoRepetidor.classList.add("col-12", "col-md-6", "col-lg-3");
        nuevoRepetidor.innerHTML = `
                <div class="card repetidor-card mb-2" id="carta${repetidor.numero}">
                    <div class="header">
                        <h2 class="title">Repetidor - N° ${repetidor.numero}</h2>
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
                                <span>${repetidor.codigoBarraRepetidor}</span>
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

    } catch (error) {
      console.error(
        "Error al obtener los datos de la ficha de instalación:",
        error
      );
    }
  })();

  async function fibraOptica() {
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
    const txtSerieModen = document.querySelector("#txtSerieModen").value;
    const slcBanda = document.querySelector("#slcBanda").value;
    const txtAntenas = document.querySelector("#txtAntenas").value;
    const chkCatv = document.querySelector("#chkCatv").checked;
    const txtDetalles = document.querySelector("#txtDetalles").value;

    jsonData = {
      fibraOptica: {
        usuario: txtUsuario,
        claveAcceso: txtClaveAcceso,
        vlan: txtVlan,
        periodo: txtPeriodo,
        plan: txtPlan,
        potencia: txtPotencia,
        router: {
          ssid: txtSsid,
          seguridad: txtSeguridad,
          codigoBarra: txtMAC,
          marca: txtMarca,
          modelo: txtModelo,
          serie: txtSerieModen,
          banda: slcBanda.split(","),
          numeroantena: parseInt(txtAntenas),
          catv: chkCatv,
        },
        detalles: txtDetalles,
        repetidores: jsonRepetidor
      },
      idCaja: idCaja,
    }
  }

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
      codigoBarraRepetidor: codigoBarra,
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

  //Evento de escaneo de código de barras fibra óptica
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
      console.log('Resultado de la búsqueda:', resultado);

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

  function validarCampos() {
    const campos = [
      "txtUsuario",
      "txtClaveAcceso",
      "txtVlan",
      "txtPlan",
      "txtPeriodo",
      "txtPotenciaFibra",
      "txtSsid",
      "txtSeguridad",
      "txtCodigoBarra",
      "txtSerieModen",
      "slcBanda",
      "txtAntenas"
    ];

    let allValid = true;

    for (const campo of campos) {
      const elemento = document.getElementById(campo);

      // Validar si el campo está vacío
      if (!elemento || elemento.value.trim() === "") {
        if (elemento) {
          elemento.classList.add("is-invalid");
        }
        allValid = false;
        continue;
      } else {
        elemento.classList.remove("is-invalid");
      }

      // Validar solo si el campo es numérico
      if (!isNaN(elemento.value)) {
        const valor = parseFloat(elemento.value);
        const min = elemento.hasAttribute('min') ? parseFloat(elemento.min) : null;
        const max = elemento.hasAttribute('max') ? parseFloat(elemento.max) : null;

        // Validar valores negativos (solo si el campo permite negativos)
        if (min !== null && valor < min) {
          elemento.classList.add("is-invalid");
          allValid = false;
        }

        // Validar valores fuera de rango (solo si el campo tiene min y max definidos)
        if (max !== null && valor > max) {
          elemento.classList.add("is-invalid");
          allValid = false;
        }
      }
    }

    return allValid;
  }

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
    window.open(`${config.HOST}views/reports/Contrato_FIBRA/fichaInstalacion.php?id=${idContrato}`, '_blank');
  }); */

  $("#txtIpRepetidor").on("input", function (event) {
    formatoIPinput(event);
  });

  document.getElementById('chkCatv').addEventListener('change', function () {
    var statusText = document.getElementById('statusText');
    statusText.textContent = this.checked ? 'Sí' : 'No';
  });
});