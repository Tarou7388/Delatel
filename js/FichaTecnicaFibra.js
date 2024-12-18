import config from '../env.js';
document.addEventListener('DOMContentLoaded', () => {
  const userid = user["idUsuario"];
  let jsonData = [];
  let jsonRepetidor = [];
  let numeroRepetidores = 0;

  //Obtener el idCaja
  const urlParams = new URLSearchParams(window.location.search);
  const idCaja = urlParams.get('idCaja') || localStorage.getItem('idCaja');
  console.log("idCaja:", idCaja);

  document.getElementById("txtFecha").value = new Date().toISOString().split('T')[0];

  //Adelantar 6 meses al periodo por defecto 
  const txtPeriodo = document.getElementById("txtPeriodo");
  const periodoDate = new Date();
  periodoDate.setMonth(periodoDate.getMonth() + 6);
  txtPeriodo.value = txtPeriodo.min = periodoDate.toISOString().split("T")[0];

  const camposRequeridos = document.querySelectorAll(".form-control");

  // Validar campos requeridos en tiempo real
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

  // Validar valores en tiempo real para campos con rango
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

  //Cargar Datos de la Ficha de Instalación
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

  //Datos de Fibra Optica
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
    const txtIp = document.querySelector("#txtIp").value;
    const txtSerie = document.querySelector("#txtSerie").value;
    const slcBanda = document.querySelector("#slcBanda").value;
    const txtAntenas = document.querySelector("#txtAntenas").value;
    const chkCatv = document.querySelector("#chkCatv").checked;
    const txtDetalles = document.querySelector("#txtDetalles").value;

    jsonData = {
      fibraoptica: {
        usuario: txtUsuario,
        claveacceso: txtClaveAcceso,
        vlan: txtVlan,
        periodo: txtPeriodo,
        plan: txtPlan,
        potencia: txtPotencia,
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
        },
        detalles: txtDetalles,
        repetidores: jsonRepetidor
      },
      idcaja: idCaja,
    }
  }

  //Datos de Repetidor
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

  //Evento de escaneo de código de barras fibra óptica
  document.getElementById('txtCodigoBarra').addEventListener('input', async function () {
    const codigoBarra = this.value.trim();

    if (codigoBarra === "") {
      return;
    }

    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoBarra&codigoBarra=${encodeURIComponent(codigoBarra)}`);
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
      const respuesta = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoBarra&codigoBarra=${encodeURIComponent(codigoBarra)}`);
      const resultado = await respuesta.json();
      console.log('Resultado de la búsqueda:', resultado);

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

  //Validación
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
      "txtAntenas"
    ];

    let todosValidos = true;

    for (const campo of campos) {
      const elemento = document.getElementById(campo);

      // Validar si el campo está vacío
      if (!elemento || elemento.value.trim() === "") {
        if (elemento) {
          elemento.classList.add("is-invalid");
        }
        todosValidos = false;
        continue;
      } else {
        elemento.classList.remove("is-invalid");
      }

      // Validar solo si el campo es numérico
      if (!isNaN(elemento.value)) {
        const valor = parseFloat(elemento.value);
        const minimo = elemento.hasAttribute('min') ? parseFloat(elemento.min) : null;
        const maximo = elemento.hasAttribute('max') ? parseFloat(elemento.max) : null;

        // Validar valores negativos (solo si el campo permite negativos)
        if (minimo !== null && valor < minimo) {
          elemento.classList.add("is-invalid");
          todosValidos = false;
        }

        // Validar valores fuera de rango (solo si el campo tiene min y max definidos)
        if (maximo !== null && valor > maximo) {
          elemento.classList.add("is-invalid");
          todosValidos = false;
        }
      }
    }

    return todosValidos;
  }

  //Función para guardar la ficha de instalación
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

  //Añadir repetidor
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

    // Limpiar los campos
    campos.forEach(campo => {
      document.getElementById(campo.id).value = "";
    });
    document.getElementById("txtPrecioRepetidor").value = "";
  });

  //Eliminar repetidor
  document.querySelector("#eliminarRepetidor").addEventListener("click", () => {
    const card = document.querySelector(`#carta${numeroRepetidores}`);
    card.remove();
    numeroRepetidores--;
    jsonRepetidor.pop();
    if (numeroRepetidores === 0) {
      document.getElementById("cardContainer").hidden = true;
    }
  });

  //Boton guardar Ficha de Instalación
  document.getElementById("btnGuardar").addEventListener("click", async () => {
    await Guardar();
  });

  //Cancelar registros de la ficha de instalación
  document.getElementById("btnCancelar").addEventListener("click", () => {
    window.location.href = `${config.HOST}views/Contratos/`;
  });

  //Función para dar formato a la IP
  $(document).ready(function () {
    $('#txtIp, #txtIpRepetidor').mask('0ZZ.0ZZ.0ZZ.0ZZ', {
      translation: {
        'Z': {
          pattern: /[0-9]/, optional: true
        }
      }
    });
  });

  //Función para el Catv
  document.getElementById('chkCatv').addEventListener('change', function () {
    var statusText = document.getElementById('statusText');
    statusText.textContent = this.checked ? 'Sí' : 'No';
  });

  // Asignar eventos de validación en tiempo real
  document.getElementById("txtPotenciaFibra").addEventListener("input", validarValorRango);
  document.getElementById("txtVlan").addEventListener("input", validarValorRango);
  document.getElementById("txtAntenas").addEventListener("input", validarValorRango);
});