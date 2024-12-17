import config from "../env.js";

document.addEventListener("DOMContentLoaded", () => {
  const userid = user["idUsuario"];
  const btnAgregarRouter = document.getElementById("btnAgregarRouter");
  const routersContainer = document.getElementById("routersContainer");
  const saveButton = document.getElementById("saveButton");
  const slcBase = document.getElementById("slcBaseParametros");
  // Check de Adelantado o cumpliendo el mes 
  const chkAdelantadoVenta = document.getElementById('chkAdelantadoVenta');
  const chkCumpliendoMesVenta = document.getElementById('chkCumpliendoMesVenta');
  const chkAdelantadoAlquilado = document.getElementById('chkAdelantadoAlquilados');
  const chkCumpliendoMesAlquilado = document.getElementById('chkCumpliendoMesAlquilados');
  const routerConfigModal = new bootstrap.Modal(document.getElementById('routerConfigModal'), {
    backdrop: 'static',
    keyboard: false
  });
  const txtPeriodo = document.getElementById('txtPeriodo');

  // Validar valores dentro del rango para campos con rango
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

  // Asignar eventos de validación en tiempo real a los campos
  document.getElementById("txtSignalStrengthParametros").addEventListener("input", validarValorRango);
  document.getElementById("txtNoiseFloorParametros").addEventListener("input", validarValorRango);
  document.getElementById("txtTransmiTccqParametros").addEventListener("input", validarValorRango);
  document.getElementById("txtTxRateParametros").addEventListener("input", validarValorRango);
  document.getElementById("txtRxRateParametros").addEventListener("input", validarValorRango);

  const periodoDate = new Date();
  periodoDate.setMonth(periodoDate.getMonth() + 6);
  const DateFormateado = periodoDate.toISOString().split("T")[0];
  txtPeriodo.value = DateFormateado;
  txtPeriodo.min = DateFormateado;

  var today = new Date().toISOString().split("T")[0];
  document.getElementById("txtFecha").value = today;

  let tipoPaquete = "";
  let numeroRouter = 0;
  let jsonParametros = {};
  let jsonRouter = [];
  let jsonVenta = {};
  let jsonAlquilado = {};
  let jsonDeuda = {};
  let jsonData = {};
  let flagFichaInstalacion = false;

  //Cargar datos del router
  const valoresRouter = {
    codigoBarra: '',
    modelo: '',
    marca: '',
    wan: '192.168.',
    mascara: '255.255.255.0',
    puertaEnlace: '192.168.',
    dns1: '8.8.8.8',
    dns2: '8.8.4.4',
    lanWireless: '192.168.',
    accesoWireless: '',
    ssidWireless: '',
    seguridadWireless: '',
    otrosWireless: ''
  };

  document.getElementById('routerConfigModal').addEventListener('show.bs.modal', (event) => {
    document.getElementById('txtCodigoBarraRouter').value = valoresRouter.codigoBarra;
    document.getElementById('txtModeloRouter').value = valoresRouter.modelo;
    document.getElementById('txtMarcaRouter').value = valoresRouter.marca;
    document.getElementById('txtWanRouter').value = valoresRouter.wan;
    document.getElementById('txtMascaraRouter').value = valoresRouter.mascara;
    document.getElementById('txtPuertaEnlaceRouter').value = valoresRouter.puertaEnlace;
    document.getElementById('txtDns1Router').value = valoresRouter.dns1;
    document.getElementById('txtDns2Router').value = valoresRouter.dns2;
    document.getElementById('txtLanWireless').value = valoresRouter.lanWireless;
    document.getElementById('txtAccesoWireless').value = valoresRouter.accesoWireless;
    document.getElementById('txtSsidWireless').value = valoresRouter.ssidWireless;
    document.getElementById('txtSeguridadWireless').value = valoresRouter.seguridadWireless;
    document.getElementById('txtOtrosWireless').value = valoresRouter.otrosWireless;
  });

  // Función para verificar si el formulario está lleno
  function isFormFilled(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    for (let input of inputs) {
      if (input.value.trim() !== '') {
        return true;
      }
    }
    return false;
  }

  // Código para manejar la selección de operación (Venta o Alquiler)
  document.getElementById('slcOperacion').addEventListener('change', function () {
    const tipoOperacion = this.value;
    const frmVenta = document.getElementById('frmVenta');
    const frmAlquiler = document.getElementById('frmAlquiler');

    // Ocultar ambos formularios
    frmVenta.classList.add('hidden');
    frmAlquiler.classList.add('hidden');

    // Limpiar ambos formularios (opcional, si deseas limpiar los campos al cambiar de operación)
    limpiarFormulario(frmVenta);
    limpiarFormulario(frmAlquiler);

    // Mostrar el formulario correspondiente según el tipo de operación
    if (tipoOperacion === 'venta') {
      frmVenta.classList.remove('hidden');
    } else if (tipoOperacion === 'alquiler') {
      frmAlquiler.classList.remove('hidden');
    }
  });

  // Función para limpiar los formularios (si es necesario)
  function limpiarFormulario(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.value = ''; // Limpiar el valor de cada campo
    });
  }

  // Función para iniciar con la visibilidad correcta (inicialmente oculto)
  window.addEventListener('DOMContentLoaded', function () {
    document.getElementById('frmVenta').classList.add('hidden');
    document.getElementById('frmAlquiler').classList.add('hidden');
  });

  // Fetch de los datos y otras funciones
  (async () => {
    try {
      const response = await fetch(
        `${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerFichaInstalacion&id=${idContrato}`
      );
      const data = await response.json();
      console.log(data);
      document.getElementById("txtCliente").value = data[0].nombre_cliente;
      document.getElementById("txtNumFicha").value = data[0].id_contrato;
      document.getElementById("txtPaquete").value = data[0].paquete;
      document.getElementById("txtPrecio").value = data[0].precio;

      if (data.length === 0 || !data[0].ficha_instalacion) {
        showToast("No hay datos en Ficha de Instalación", "INFO");
        return;
      }

      tipoPaquete = data[0].tipo_servicio;

      if (data[0].ficha_instalacion) {
        const installationData = JSON.parse(data[0].ficha_instalacion);

        // Cargar datos de parámetros
        const parametros = installationData.parametros;
        document.getElementById("slcFrecuenciaParametros").value = parametros.frecuencia.join(", ");
        // Cargar datos de base
        const slcBase = document.getElementById("slcBaseParametros");
        const base = parametros.base[0];
        const baseOption = document.createElement('option');
        baseOption.value = base.id;
        baseOption.textContent = base.nombre;
        baseOption.selected = true;
        slcBase.appendChild(baseOption);

        // Cargar datos de subBase
        const slcSubBase = document.getElementById("slcSubBaseParametros");
        const subBase = parametros.subbase[0];
        const subBaseOption = document.createElement('option');
        subBaseOption.value = subBase.id;
        subBaseOption.textContent = subBase.nombre;
        subBaseOption.selected = true;
        slcSubBase.appendChild(subBaseOption);

        document.getElementById("txtPeriodo").value = parametros.periodo;
        document.getElementById("txtSignalStrengthParametros").value = parametros.signalstrength;
        document.getElementById("txtNoiseFloorParametros").value = parametros.noisefloor;
        document.getElementById("txtTransmiTccqParametros").value = parametros.transmitccq;
        document.getElementById("txtTxRateParametros").value = parametros.txrate;
        document.getElementById("txtRxRateParametros").value = parametros.rxrate;

        // Cargar datos de routers
        jsonRouter = parametros.routers || [];
        numeroRouter = jsonRouter.length;
        const rowContainer = document.createElement("div");
        rowContainer.classList.add("row");

        jsonRouter.forEach((routerData, index) => {
          const routerCol = document.createElement("div");
          routerCol.classList.add("col-md-4", "mb-4");

          const routerCard = document.createElement("div");
          routerCard.classList.add("card", "shadow-sm");
          routerCard.style.maxWidth = '100%';

          routerCard.innerHTML = `
                    <div class="card-header text-white py-2">
                        <h5 class="card-title mb-0 d-flex justify-content-between align-items-center fs-6">
                            <span>Router N° ${routerData.numero}</span>
                        </h5>
                    </div>
                    <div class="card-body p-0" id="carta${routerData.numero}">
                        <table class="table table-sm table-hover mb-0">
                            <tbody>
                                <tr>
                                    <td class="py-1 px-2"><i class="fas fa-globe text-primary me-2"></i>Código de Barra</td>
                                    <td class="py-1 px-2">${routerData.codigobarra}</td>
                                </tr>
                                <tr>
                                    <td class="py-1 px-2"><i class="fas fa-globe text-primary me-2"></i>Modelo</td>
                                    <td class="py-1 px-2">${routerData.modelo}</td>
                                </tr>
                                <tr>
                                    <td class="py-1 px-2"><i class="fas fa-globe text-primary me-2"></i>Marca</td>
                                    <td class="py-1 px-2">${routerData.marca}</td>
                                </tr>
                                <tr>
                                    <td class="py-1 px-2"><i class="fas fa-globe text-primary me-2"></i>WAN</td>
                                    <td class="py-1 px-2">${routerData.wan}</td>
                                </tr>
                                <tr>
                                    <td class="py-1 px-2"><i class="fas fa-mask text-primary me-2"></i>Máscara</td>
                                    <td class="py-1 px-2">${routerData.mascara}</td>
                                </tr>
                                <tr>
                                    <td class="py-1 px-2"><i class="fas fa-door-open text-primary me-2"></i>Puerta de Enlace</td>
                                    <td class="py-1 px-2">${routerData.puertaenlace}</td>
                                </tr>
                                <tr>
                                    <td class="py-1 px-2"><i class="fas fa-server text-primary me-2"></i>DNS 1</td>
                                    <td class="py-1 px-2">${routerData.dns1}</td>
                                </tr>
                                <tr>
                                    <td class="py-1 px-2"><i class="fas fa-server text-primary me-2"></i>DNS 2</td>
                                    <td class="py-1 px-2">${routerData.dns2}</td>
                                </tr>
                                <tr>
                                    <td class="py-1 px-2"><i class="fas fa-wifi text-primary me-2"></i>LAN Wireless</td>
                                    <td class="py-1 px-2">${routerData.lan}</td>
                                </tr>
                                <tr>
                                    <td class="py-1 px-2"><i class="fas fa-key text-primary me-2"></i>Acceso Wireless</td>
                                    <td class="py-1 px-2">${routerData.acceso}</td>
                                </tr>
                                <tr>
                                    <td class="py-1 px-2"><i class="fas fa-broadcast-tower text-primary me-2"></i>SSID</td>
                                    <td class="py-1 px-2">${routerData.ssid}</td>
                                </tr>
                                <tr>
                                    <td class="py-1 px-2"><i class="fas fa-shield-alt text-primary me-2"></i>Seguridad</td>
                                    <td class="py-1 px-2">${routerData.seguridad}</td>
                                </tr>
                                <tr>
                                    <td class="py-1 px-2"><i class="fas fa-info-circle text-primary me-2"></i>Otros</td>
                                    <td class="py-1 px-2">${routerData.otros}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;

          const deleteButton = document.createElement("button");
          deleteButton.classList.add("btn", "btn-sm", "btn-outline-light", "mb-1", "me-2", "float-end");
          deleteButton.style.backgroundColor = '#0459ad';
          deleteButton.style.color = 'white';
          deleteButton.innerHTML = '<i class="fas fa-trash-alt" style="color: white;"></i> Eliminar';

          deleteButton.addEventListener("click", function () {
            ask("¿Está seguro de eliminar este router?", "Ficha Técnica Wisp").then((respuesta) => {
              if (respuesta) {
                rowContainer.removeChild(routerCol);
                jsonRouter.splice(index, 1);
                actualizarNumeros();
              }
            });
          });

          routerCard.querySelector(".card-body").appendChild(deleteButton);
          routerCol.appendChild(routerCard);
          rowContainer.appendChild(routerCol);
        });

        if (routersContainer) {
          routersContainer.appendChild(rowContainer);
        } else {
          console.error("El contenedor 'routersContainer' no existe en el DOM.");
        }

        // Mostrar y cargar datos de venta o alquiler
        const frmVenta = document.getElementById('frmVenta');
        const frmAlquiler = document.getElementById('frmAlquiler');

        if (installationData.venta) {
          frmVenta.classList.remove('hidden');
          frmAlquiler.classList.add('hidden');
          const venta = installationData.venta;
          document.getElementById("txtCostoAntenaVenta").value = venta.costoantena;
          document.getElementById("txtCostoRouterVenta").value = venta.costorouter;
          document.getElementById("txtSubTotalVenta").value = venta.subtotal;
          document.getElementById("txtAdelantoVenta").value = venta.adelanto;
          document.getElementById("txtSaldoEquipoVenta").value = venta.saldoequipos;
          document.getElementById("txtMaterialAdicionalVenta").value = venta.materialadicional;
          document.getElementById("txtMarcaVentaAntena").value = venta.antena.marca;
          document.getElementById("txtModeloVentaAntena").value = venta.antena.modelo;
          document.getElementById("txtMacVentaAntena").value = venta.antena.mac;
          document.getElementById("txtSerialVentaAntena").value = venta.antena.serial;
          document.getElementById("txtDescripcionVentaAntena").value = venta.antena.descripcion;
          document.getElementById("txtMarcaVentaRouter").value = venta.router.marca;
          document.getElementById("txtModeloVentaRouter").value = venta.router.modelo;
          document.getElementById("txtMacVentaRouter").value = venta.router.mac;
          document.getElementById("txtSerialVentaRouter").value = venta.router.serial;
          document.getElementById("txtDescripcionVentaRouter").value = venta.router.descripcion;
          document.getElementById("chkAdelantadoVenta").checked = venta.condicion["Adelantado"] === true;
          document.getElementById("chkCumpliendoMesVenta").checked = venta.condicion["Cumpliendo el mes"] === true;
          document.getElementById("txtDetalleVenta").value = venta.detalle;
        } else if (installationData.alquilado) {
          frmVenta.classList.add('hidden');
          frmAlquiler.classList.remove('hidden');
          const alquilado = installationData.alquilado;
          document.getElementById("slcCondicionAlquilados").value = alquilado.condicion ? "Alquilado" : "Prestado";
          document.getElementById("txtPeriodoAlquilados").value = alquilado.periodo;
          document.getElementById("txtFechaInicioAlquilados").value = alquilado.fechainicio;
          document.getElementById("txtFechaFinAlquilados").value = alquilado.fechafin;
          document.getElementById("txtCostoAlquilerAlquilados").value = alquilado.costoalquiler;
          document.getElementById("txtMarcaAntenaAlquilados").value = alquilado.antena.marca;
          document.getElementById("txtModeloAntenaAlquilados").value = alquilado.antena.modelo;
          document.getElementById("txtMacAntenaAlquilados").value = alquilado.antena.mac;
          document.getElementById("txtSerialAntenaAlquilados").value = alquilado.antena.serial;
          document.getElementById("txtDescripcionAntenaAlquilados").value = alquilado.antena.descripcion;
          document.getElementById("txtMarcaRouterAlquilados").value = alquilado.router.marca;
          document.getElementById("txtModeloRouterAlquilados").value = alquilado.router.modelo;
          document.getElementById("txtMacRouterAlquilados").value = alquilado.router.mac;
          document.getElementById("txtSerialRouterAlquilados").value = alquilado.router.serial;
          document.getElementById("txtDescripcionRouterAlquilados").value = alquilado.router.descripcion;
          document.getElementById("chkAdelantadoAlquilados").checked = alquilado.condiciontiempo["Adelantado"] === true;
          document.getElementById("chkCumpliendoMesAlquilados").checked = alquilado.condiciontiempo["Cumpliendo el mes"] === true;
          document.getElementById("txtDetalleAlquilados").value = alquilado.detalle;
        }

        // Cargar datos de deuda
        const deuda = installationData.deuda;
        document.getElementById("txtPagoServicio").value = deuda.pagoservicio;
        document.getElementById("txtAdelantoEquipo").value = deuda.adelantoequipo;
        document.getElementById("txtCostoAlquiler").value = deuda.costoalquiler;
        document.getElementById("txtMaterialAdicional").value = deuda.materialadicional;
        document.getElementById("txtTotalCancelado").value = deuda.totalcancelado;
        document.getElementById("txtSaldoPendiente").value = deuda.saldopendiente;
        document.getElementById("txtDetalleDeuda").value = deuda.detalle;
      } else {
        showToast("No hay datos en la Ficha de Instalación.", "INFO");
      }

    } catch (error) {
      console.error("Error al obtener los datos de la ficha de instalación:", error);
    }
  })();

  // Función para agregar un nuevo router
  async function agregarRouter() {
    routerConfigModal.show();

    saveButton.onclick = function () {
      const codigoBarra = document.getElementById("txtCodigoBarraRouter").value;
      const modelo = document.getElementById("txtModeloRouter").value;
      const marca = document.getElementById("txtMarcaRouter").value;
      const wan = document.getElementById("txtWanRouter").value;
      const mascara = document.getElementById("txtMascaraRouter").value;
      const puertaEnlace = document.getElementById("txtPuertaEnlaceRouter").value;
      const dns1 = document.getElementById("txtDns1Router").value;
      const dns2 = document.getElementById("txtDns2Router").value;
      const lan = document.getElementById("txtLanWireless").value;
      const acceso = document.getElementById("txtAccesoWireless").value;
      const ssid = document.getElementById("txtSsidWireless").value;
      const seguridad = document.getElementById("txtSeguridadWireless").value;
      const otros = document.getElementById("txtOtrosWireless").value;

      if (!codigoBarra || !wan || !mascara || !puertaEnlace || !dns1 || !dns2 || !lan || !acceso || !ssid || !seguridad) {
        showToast("Complete todo los campos del router", "INFO");
        return;
      }

      // Validar que WAN, LAN, máscara y puerta de enlace contengan al menos 3 puntos
      const camposTresPuntos = [wan, lan, mascara, puertaEnlace];
      for (const campo of camposTresPuntos) {
        if ((campo.match(/\./g) || []).length < 3) {
          showToast("WAN, LAN, Máscara y Puerta de Enlace deben contener al menos 3 puntos", "INFO");
          return;
        }
      }

      // Validar que DNS1 y DNS2 contengan al menos 4 puntos
      const camposCuatroPuntos = [dns1, dns2];
      for (const campo of camposCuatroPuntos) {
        if ((campo.match(/\./g) || []).length < 4) {
          showToast("DNS1 y DNS2 deben contener al menos 4 puntos", "INFO");
          return;
        }
      }

      const router = {
        numero: ++numeroRouter, // Incrementar el contador antes de asignarlo
        codigobarra: codigoBarra,
        modelo: modelo,
        marca: marca,
        wan: wan,
        mascara: mascara,
        puertaenlace: puertaEnlace,
        dns1: dns1,
        dns2: dns2,
        lan: lan,
        acceso: acceso,
        ssid: ssid,
        seguridad: seguridad,
        otros: otros,
      };
      jsonRouter.push(router);
      const routerCol = document.createElement("div");
      routerCol.classList.add("col-md-4", "mb-4");
      const routerCard = document.createElement("div");
      routerCard.classList.add("card", "shadow-sm");
      routerCard.style.maxWidth = '100%';
      routerCard.innerHTML = `
        <div class="card-header text-white py-2">
            <h5 class="card-title mb-0 d-flex justify-content-between align-items-center fs-6">
            <span>Router N° ${numeroRouter}</span>
            </h5>
        </div>
        <div class="card-body p-0" id="carta${numeroRouter}" >
            <table class="table table-sm table-hover mb-0">
            <tbody>
                <tr>
                <td class="py-1 px-2"><i class="fas fa-globe text-primary me-2"></i>Código de Barra</td>
                <td class="py-1 px-2">${codigoBarra}</td>
                </tr>
                <tr>
                <td class="py-1 px-2"><i class="fas fa-globe text-primary me-2"></i>Modelo</td>
                <td class="py-1 px-2">${modelo}</td>
                </tr>
                <tr>
                <td class="py-1 px-2"><i class="fas fa-globe text-primary me-2"></i>Marca</td>
                <td class="py-1 px-2">${marca}</td>
                </tr>
                <tr>
                <td class="py-1 px-2"><i class="fas fa-globe text-primary me-2"></i>WAN</td>
                <td class="py-1 px-2">${wan}</td>
                </tr>
                <tr>
                <td class="py-1 px-2"><i class="fas fa-mask text-primary me-2"></i>Máscara</td>
                <td class="py-1 px-2">${mascara}</td>
                </tr>
                <tr>
                <td class="py-1 px-2"><i class="fas fa-door-open text-primary me-2"></i>Puerta de Enlace</td>
                <td class="py-1 px-2">${puertaEnlace}</td>
                </tr>
                <tr>
                <td class="py-1 px-2"><i class="fas fa-server text-primary me-2"></i>DNS 1</td>
                <td class="py-1 px-2">${dns1}</td>
                </tr>
                <tr>
                <td class="py-1 px-2"><i class="fas fa-server text-primary me-2"></i>DNS 2</td>
                <td class="py-1 px-2">${dns2}</td>
                </tr>
                <tr>
                <td class="py-1 px-2"><i class="fas fa-wifi text-primary me-2"></i>LAN Wireless</td>
                <td class="py-1 px-2">${lan}</td>
                </tr>
                <tr>
                <td class="py-1 px-2"><i class="fas fa-key text-primary me-2"></i>Acceso Wireless</td>
                <td class="py-1 px-2">${acceso}</td>
                </tr>
                <tr>
                <td class="py-1 px-2"><i class="fas fa-broadcast-tower text-primary me-2"></i>SSID</td>
                <td class="py-1 px-2">${ssid}</td>
                </tr>
                <tr>
                <td class="py-1 px-2"><i class="fas fa-shield-alt text-primary me-2"></i>Seguridad</td>
                <td class="py-1 px-2">${seguridad}</td>
                </tr>
                <tr>
                <td class="py-1 px-2"><i class="fas fa-info-circle text-primary me-2"></i>Otros</td>
                <td class="py-1 px-2">${otros}</td>
                </tr>
            </tbody>
            </table>
        </div>
        `;

      showToast("Agregado correctamente", "SUCCESS", 1500);
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("btn", "btn-sm", "btn-outline-light", "mb-1", "me-2", "float-end");
      deleteButton.style.backgroundColor = '#0459ad';
      deleteButton.style.color = 'white';
      deleteButton.innerHTML = '<i class="fas fa-trash-alt" style="color: white;"></i> Eliminar';

      deleteButton.addEventListener("click", function () {
        ask("¿Está seguro de eliminar este router?", "Ficha Técnica Wisp").then((respuesta) => {
          if (respuesta) {
            const card = document.querySelector(`#carta${router.numero}`).closest('.col-md-4');
            if (card) {
              card.remove();
              jsonRouter.splice(jsonRouter.indexOf(router), 1);
              actualizarNumeros();
            } else {
              showToast("No se encontró el router a eliminar.", "ERROR");
            }
          }
        });
      });

      routerCard.querySelector(".card-body").appendChild(deleteButton);
      routerCol.appendChild(routerCard);
      routersContainer.appendChild(routerCol);

      routerConfigModal.hide();
    }
  }

  // Evento para el botón de agregar router
  btnAgregarRouter.addEventListener("click", async () => {
    await agregarRouter();
  });

  // Actualizar los números de los routers
  function actualizarNumeros() {
    const routerCards = routersContainer.querySelectorAll(".card");
    routerCards.forEach((card, index) => {
      const cardHeader = card.querySelector(".card-header span");
      cardHeader.textContent = `Router N° ${index + 1}`;

      // Actualizar el número del router en el array jsonRouter
      const routerId = card.id.replace('carta', '');
      const routerIndex = jsonRouter.findIndex(router => router.numero == routerId);
      if (routerIndex !== -1) {
        jsonRouter[routerIndex].numero = index + 1;
      }
    });
    numeroRouter = routerCards.length; // Actualizar el contador de routers
  }

  function formatDns(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 4) {
      value = value.substring(0, 4);
    }
    value = value.replace(/(\d{1,1})(?=\d)/g, '$1.');
    input.value = value;
  }
  const fieldsDns = ['txtDns1Router', 'txtDns2Router'];

  fieldsDns.forEach(fieldId => {
    const inputField = document.getElementById(fieldId);
    inputField.addEventListener('input', function () {
      formatDns(inputField);
    });
  });

  //Validacion de datos para ip
  $(document).ready(function () {
    $('#txtLanWireless, #txtWanRouter, #txtMascaraRouter, #txtPuertaEnlaceRouter').mask('0ZZ.0ZZ.0ZZ.0ZZ', {
      translation: {
        'Z': {
          pattern: /[0-9]/,
          optional: true
        }
      }
    });
  });

  function toggleCheckbox(checkbox1, checkbox2) {
    checkbox1.addEventListener('change', function () {
      if (checkbox1.checked) {
        checkbox2.checked = false;
      }
    });
  }

  toggleCheckbox(chkAdelantadoVenta, chkCumpliendoMesVenta);
  toggleCheckbox(chkCumpliendoMesVenta, chkAdelantadoVenta);
  toggleCheckbox(chkAdelantadoAlquilado, chkCumpliendoMesAlquilado);
  toggleCheckbox(chkCumpliendoMesAlquilado, chkAdelantadoAlquilado);

  //Json Parametros 
  async function parametros() {
    const txtPeriodo = document.getElementById('txtPeriodo').value;
    const txtPaquete = document.getElementById('txtPaquete').value;
    const slcFrecuencia = document.getElementById('slcFrecuenciaParametros').value;
    const slcBase = document.getElementById('slcBaseParametros');
    const slcSubBase = document.getElementById('slcSubBaseParametros');
    const txtSignalStrength = document.getElementById('txtSignalStrengthParametros').value;
    const txtNoiseFloor = document.getElementById('txtNoiseFloorParametros').value;
    const txtTransmiTccq = parseFloat(document.getElementById('txtTransmiTccqParametros').value);
    const txtTxRate = parseFloat(document.getElementById('txtTxRateParametros').value);
    const txtRxRate = parseFloat(document.getElementById('txtRxRateParametros').value);

    const base = {
      id: slcBase.value,
      nombre: slcBase.options[slcBase.selectedIndex].text
    };

    const subBase = {
      id: slcSubBase.value,
      nombre: slcSubBase.options[slcSubBase.selectedIndex].text
    };

    jsonParametros = {
      parametros: {
        periodo: txtPeriodo,
        plan: txtPaquete,
        frecuencia: slcFrecuencia.split(","),
        base: [base],
        subbase: [subBase],
        signalstrength: txtSignalStrength,
        noisefloor: txtNoiseFloor,
        transmitccq: txtTransmiTccq,
        txrate: txtTxRate,
        rxrate: txtRxRate,
        routers: jsonRouter
      },
    }
    jsonData.parametros = jsonParametros.parametros;
  }

  async function productoBarraBuscar(cajatxt) {
    const caja = document.getElementById(cajatxt);
    const response = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoBarra&codigoBarra=${caja.value}`);
    const data = await response.json();
    return data;
  }

  document.querySelector('#txtCodigoBarraRouter').addEventListener('change', async function () {
    const datos = await productoBarraBuscar('txtCodigoBarraRouter');
    document.querySelector('#txtMarcaRouter').value = datos[0].marca;
    document.querySelector('#txtModeloRouter').value = datos[0].modelo;
  });

  document.querySelector('#txtMacAntenaAlquilados').addEventListener('change', async function () {
    const datos = await productoBarraBuscar('txtMacAntenaAlquilados');
    document.querySelector('#txtMarcaAntenaAlquilados').value = datos[0].marca;
    document.querySelector('#txtModeloAntenaAlquilados').value = datos[0].modelo;
  });

  document.querySelector('#txtMacRouterAlquilados').addEventListener('change', async function () {
    const datos = await productoBarraBuscar('txtMacRouterAlquilados');
    document.querySelector('#txtMarcaRouterAlquilados').value = datos[0].marca;
    document.querySelector('#txtModeloRouterAlquilados').value = datos[0].modelo;
  });

  document.querySelector('#txtMacVentaRouter').addEventListener('change', async function () {
    const datos = await productoBarraBuscar('txtMacVentaRouter');
    txtMarcaVentaRouter.value = datos[0].marca;
    txtModeloVentaRouter.value = datos[0].modelo;
    txtCostoRouterVenta.value = datos[0].precio_actual;
  });

  document.querySelector('#txtMacVentaAntena').addEventListener('change', async function () {
    const datos = await productoBarraBuscar('txtMacVentaAntena');
    txtMarcaVentaAntena.value = datos[0].marca;
    txtModeloVentaAntena.value = datos[0].modelo;
    txtCostoAntenaVenta.value = datos[0].precio_actual;
  });

  //Json Venta
  async function venta() {
    const txtCostoAntenaVenta = parseFloat(document.getElementById('txtCostoAntenaVenta').value);
    const txtCostoRouterVenta = parseFloat(document.getElementById('txtCostoRouterVenta').value);
    const txtMarcaVentaAntena = document.getElementById('txtMarcaVentaAntena').value;
    const txtMarcaVentaRouter = document.getElementById('txtMarcaVentaRouter').value;
    const txtSubTotalVenta = parseFloat(document.getElementById('txtSubTotalVenta').value);
    const txtModeloVentaAntena = document.getElementById('txtModeloVentaAntena').value;
    const txtModeloVentaRouter = document.getElementById('txtModeloVentaRouter').value;
    const txtAdelantoVenta = parseFloat(document.getElementById('txtAdelantoVenta').value);
    const txtMacVentaAntena = document.getElementById('txtMacVentaAntena').value;
    const txtMacVentaRouter = document.getElementById('txtMacVentaRouter').value;
    const txtSaldoEquipoVenta = parseFloat(document.getElementById('txtSaldoEquipoVenta').value);
    const txtDescripcionVentaAntena = document.getElementById('txtDescripcionVentaAntena').value;
    const txtDescripcionVentaRouter = document.getElementById('txtDescripcionVentaRouter').value;
    const txtMaterialAdicionalVenta = document.getElementById('txtMaterialAdicionalVenta').value;
    const chkAdelantadoVenta = document.getElementById('chkAdelantadoVenta').checked;
    const chkCumpliendoMesVenta = document.getElementById('chkCumpliendoMesVenta').checked;
    const txtDetalleVenta = document.getElementById('txtDetalleVenta').value;

    jsonVenta = {
      venta: {
        costoantena: txtCostoAntenaVenta,
        costorouter: txtCostoRouterVenta,
        subtotal: txtSubTotalVenta,
        adelanto: txtAdelantoVenta,
        saldoequipos: txtSaldoEquipoVenta,
        materialadicional: txtMaterialAdicionalVenta,
        condicion: {
          "adelantado": chkAdelantadoVenta ? true : "",
          "cumpliendo el mes": chkCumpliendoMesVenta ? true : ""
        },
        antena: {
          marca: txtMarcaVentaAntena,
          modelo: txtModeloVentaAntena,
          mac: txtMacVentaAntena,
          serial: document.querySelector('#txtSerialVentaAntena').value,
          descripcion: txtDescripcionVentaAntena
        },
        router: {
          marca: txtMarcaVentaRouter,
          modelo: txtModeloVentaRouter,
          mac: txtMacVentaRouter,
          serial: document.querySelector('#txtSerialVentaRouter').value,
          descripcion: txtDescripcionVentaRouter
        },
        detalle: txtDetalleVenta,
      },
    };
    jsonData.venta = jsonVenta.venta;
    return true;
  }

  //Json Alquilado
  async function alquilado_prestado() {
    const slcCondicionAlquilado = document.getElementById('slcCondicionAlquilados').value;
    const txtPeriodoAlquilado = document.getElementById('txtPeriodoAlquilados').value;
    const txtMarcaAntenaAlquilado = document.getElementById('txtMarcaAntenaAlquilados').value;
    const txtMarcaRouterAlquilado = document.getElementById('txtMarcaRouterAlquilados').value;
    const txtFechaInicioAlquilado = document.getElementById('txtFechaInicioAlquilados').value;
    const txtModeloAntenaAlquilado = document.getElementById('txtModeloAntenaAlquilados').value;
    const txtModeloRouterAlquilado = document.getElementById('txtModeloRouterAlquilados').value;
    const txtFechaFinAlquilado = document.getElementById('txtFechaFinAlquilados').value;
    const txtMacAntenaAlquilado = document.getElementById('txtMacAntenaAlquilados').value;
    const txtMacRouterAlquilado = document.getElementById('txtMacRouterAlquilados').value;
    const txtCostoAlquilerAlquilado = parseFloat(document.getElementById('txtCostoAlquilerAlquilados').value);
    const txtDescripcionAntenaAlquilado = document.getElementById('txtDescripcionAntenaAlquilados').value;
    const txtDescripcionRouterAlquilado = document.getElementById('txtDescripcionRouterAlquilados').value;
    const chkAdelantadoAlquilado = document.getElementById('chkAdelantadoAlquilados').checked;
    const chkCumpliendoMesAlquilados = document.getElementById('chkCumpliendoMesAlquilados').checked;
    const txtDetalleAlquilado = document.getElementById('txtDetalleAlquilados').value;
    jsonAlquilado = {
      alquilado: {
        condicion: slcCondicionAlquilado,
        periodo: txtPeriodoAlquilado,
        fechainicio: txtFechaInicioAlquilado,
        fechafin: txtFechaFinAlquilado,
        costoalquiler: txtCostoAlquilerAlquilado,
        condiciontiempo: {
          "adelantado": chkAdelantadoAlquilado ? true : "",
          "cumpliendo el mes": chkCumpliendoMesAlquilados ? true : ""
        },
        antena: {
          marca: txtMarcaAntenaAlquilado,
          modelo: txtModeloAntenaAlquilado,
          mac: txtMacAntenaAlquilado,
          serial: document.querySelector('#txtSerialAntenaAlquilados').value,
          descripcion: txtDescripcionAntenaAlquilado
        },
        router: {
          marca: txtMarcaRouterAlquilado,
          modelo: txtModeloRouterAlquilado,
          mac: txtMacRouterAlquilado,
          serial: document.querySelector('#txtSerialRouterAlquilados').value,
          descripcion: txtDescripcionRouterAlquilado
        },
        detalle: txtDetalleAlquilado,
      },
    };
    jsonData.alquilado = jsonAlquilado.alquilado;
    return true;
  }

  //Json Pago
  async function deuda() {
    const txtPagoServicio = document.getElementById('txtPagoServicio').value;
    const txtAdelantoEquipo = document.getElementById('txtAdelantoEquipo').value;
    const txtCostoAlquiler = document.getElementById('txtCostoAlquiler').value;
    const txtMaterialAdicional = document.getElementById('txtMaterialAdicional').value;
    const txtTotalCancelado = document.getElementById('txtTotalCancelado').value;
    const txtSaldoPendiente = document.getElementById('txtSaldoPendiente').value;
    const txtDetalleDeuda = document.getElementById('txtDetalleDeuda').value;
    jsonDeuda = {
      deuda: {
        pagoservicio: txtPagoServicio,
        adelantoequipo: txtAdelantoEquipo,
        costoalquiler: txtCostoAlquiler,
        materialadicional: txtMaterialAdicional,
        totalcancelado: txtTotalCancelado,
        saldopendiente: txtSaldoPendiente,
        detalle: txtDetalleDeuda
      }
    }
    jsonData.deuda = jsonDeuda.deuda;
  }

  const camposVenta = [
    "txtMacVentaRouter",
    "txtMacVentaAntena",
    "txtAdelantoVenta",
    "txtSaldoEquipoVenta",
    "txtSerialVentaRouter",
    "txtSerialVentaAntena",
    "txtMaterialAdicionalVenta",
    "txtDescripcionVentaAntena",
    "txtDescripcionVentaRouter"
  ];

  const camposAlquiler = [
    "txtMacAntenaAlquilados",
    "txtMacRouterAlquilados",
    "txtPeriodoAlquilados",
    "txtFechaInicioAlquilados",
    "slcCondicionAlquilados",
    "txtFechaFinAlquilados",
    "txtSerialAntenaAlquilados",
    "txtSerialRouterAlquilados",
    "txtCostoAlquilerAlquilados",
    "txtDescripcionAntenaAlquilados",
    "txtDescripcionRouterAlquilados"
  ];

  function addInputEventListeners(campos) {
    campos.forEach(campo => {
      document.getElementById(campo).addEventListener('input', function () {
        const slcOperacion = document.getElementById('slcOperacion');
        const frmVenta = document.getElementById('frmVenta');
        const frmAlquiler = document.getElementById('frmAlquiler');

        // Volver a comprobar si el formulario está lleno o vacío
        if (isFormFilled(frmVenta) || isFormFilled(frmAlquiler)) {
          slcOperacion.disabled = true; // Deshabilitar si el formulario está lleno
        } else {
          slcOperacion.disabled = false; // Habilitar si los formularios están vacíos
        }
      });
    });
  }

  addInputEventListeners(camposVenta);
  addInputEventListeners(camposAlquiler);

  // Función para verificar si el formulario está lleno
  function isFormFilled(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    // Verificar si hay algún campo con valor
    for (const input of inputs) {
      if (input.value.trim() !== "") {
        return true; // Si algún campo tiene valor, el formulario está lleno
      }
    }
    return false; // Si todos los campos están vacíos, el formulario no está lleno
  }

  //Función Registrar Ficha Wisp
  async function registrarFichaWisp() {
    if (!validarCampos()) {
      showToast("Por favor, llene todos los campos requeridos.", "WARNING", 1500);
      return;
    }

    if (jsonRouter.length === 0) {
      showToast("Debe agregar al menos un router.", "WARNING", 1500);
      return;
    }

    await parametros();

    // Limpiar cualquier dato previo de venta y alquilado
    jsonData.venta = null;
    jsonData.alquilado = null;

    // Obtener el tipo de operación seleccionado (venta o alquilado)
    const tipoOperacion = document.getElementById('slcOperacion').value;

    // Si es venta, llamamos a la función venta(), y si es alquilado, llamamos a la función alquilado_prestado()
    if (tipoOperacion === 'venta') {
      await venta(); // Asigna jsonData.venta
    } else if (tipoOperacion === 'alquiler') {
      await alquilado_prestado(); // Asigna jsonData.alquilado
    } else {
      showToast("Debe seleccionar una operación válida (Venta o Alquiler).", "WARNING", 1500);
      return;
    }

    await deuda();

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
    const camposComunes = [
      "txtPeriodo",
      "slcFrecuenciaParametros",
      "slcBaseParametros",
      "slcSubBaseParametros",
      "txtSignalStrengthParametros",
      "txtNoiseFloorParametros",
      "txtTransmiTccqParametros",
      "txtTxRateParametros",
      "txtRxRateParametros",
      "txtPagoServicio",
      "txtAdelantoEquipo",
      "txtCostoAlquiler",
      "txtMaterialAdicional",
      "txtTotalCancelado",
      "txtSaldoPendiente"
    ];

    let campos = [...camposComunes];

    const tipoOperacion = document.getElementById('slcOperacion').value;
    if (tipoOperacion === 'venta') {
      campos = [...campos, ...camposVenta];
    } else if (tipoOperacion === 'alquiler') {
      campos = [...campos, ...camposAlquiler];
    }

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

  document.getElementById('btnRegistrar').addEventListener('click', async (event) => {
    await registrarFichaWisp();
  });

  document.getElementById("btnCancelar").addEventListener("click", () => {
    window.location.href = `${config.HOST}views/Contratos/`;
  });

  btnAgregarRouter.addEventListener("click", async () => {
    await agregarRouter();
  });

  function calcularSubtotal() {
    const adelanto = parseFloat(document.getElementById('txtAdelantoVenta').value) || 0;
    const materialAdicional = parseFloat(document.getElementById('txtMaterialAdicionalVenta').value) || 0;
    const subtotal = adelanto + materialAdicional;
    document.getElementById('txtSubTotalVenta').value = subtotal.toFixed(2);
  }

  document.getElementById('txtAdelantoVenta').addEventListener('input', calcularSubtotal);
  document.getElementById('txtMaterialAdicionalVenta').addEventListener('input', calcularSubtotal);

  $("#slcBaseParametros").on("change", function () {
    const provinciaId = this.value;
    cargarSubBases(provinciaId);
  });

  // Función para cargar las provincias
  (async () => {
    try {
      const response = await fetch(`${config.HOST}app/controllers/Base.controllers.php?operacion=listarBase`);
      const data = await response.json();

      if (Array.isArray(data)) {
        data.forEach(base => {
          const option = document.createElement('option');
          option.value = base.id_provincia;
          option.textContent = base.provincia;
          slcBase.appendChild(option);
        });
      } else {
        console.error("La estructura de los datos devueltos no es la esperada:", data);
      }

    } catch (error) {
      console.error("Error al cargar las bases:", error);
    }
  })();

  // Función para cargar las subBases
  async function cargarSubBases(provinciaId) {
    if (!provinciaId || provinciaId === "0") {
      console.warn("No hay provincia seleccionada para cargar sub-bases.");
      return;
    }
    try {
      const response = await fetch(`${config.HOST}app/controllers/Base.controllers.php?operacion=buscarBaseId&id=${provinciaId}`);
      const data = await response.json();

      const slcSubBase = document.getElementById('slcSubBaseParametros');
      slcSubBase.innerHTML = '<option value="0" selected disabled>Seleccione</option>';

      if (Array.isArray(data)) {
        data.forEach(subBase => {
          const option = document.createElement('option');
          option.value = subBase.id_distrito;
          option.textContent = subBase.distrito;
          slcSubBase.appendChild(option);
        });
      } else {
        console.error("La estructura de los datos devueltos no es la esperada:", data);
      }

    } catch (error) {
      console.error("Error al cargar las subBases:", error);
    }
  }

  $(document).ready(function () {
    $(".select2me").select2({
      theme: "bootstrap-5",
      allowClear: true,
      placeholder: "Seleccione"
    }).on('select2:clear', function (e) {
      const selectElement = $(this);
      const provinciaId = selectElement.val();
      if (provinciaId) {
        cargarSubBases(provinciaId);
      } else {
        console.warn("No hay provincia seleccionada para cargar sub-bases.");
        // Limpia las sub-bases si no hay provincia seleccionada
        $('#slcSubBaseParametros').html('<option value="0" selected disabled>Seleccione</option>');
      }
    });

    $(".select2me").parent("div").children("span").children("span").children("span").css("height", "calc(3.5rem + 2px)");
    $(".select2me").parent("div").children("span").children("span").children("span").children("span").css("margin-top", "18px");
    $(".select2me").parent("div").find("label").css("z-index", "1");
  });

  $(".select2me").select2({ theme: "bootstrap-5", allowClear: true });
  $(".select2me").parent("div").children("span").children("span").children("span").css("height", " calc(3.5rem + 2px)");
  $(".select2me").parent("div").children("span").children("span").children("span").children("span").css("margin-top", "18px");
  $(".select2me").parent("div").find("label").css("z-index", "1");
});

