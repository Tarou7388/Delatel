import config from "../env.js";

document.addEventListener("DOMContentLoaded", () => {
  const userid = user["idUsuario"];
  const btnAgregarRouter = document.getElementById("btnAgregarRouter");
  const routersContainer = document.getElementById("routersContainer");
  const saveButton = document.getElementById("saveButton");
  // Check de Adelantado o cumpliendo el mes 
  const chkAdelantadoVenta = document.getElementById('chkAdelantadoVenta');
  const chkCumpliendoMesVenta = document.getElementById('chkCumpliendoMesVenta');
  const chkAdelantadoAlquilado = document.getElementById('chkAdelantadoAlquilados');
  const chkCumpliendoMesAlquilado = document.getElementById('chkCumpliendoMesAlquilados');
  const routerConfigModal = new bootstrap.Modal(document.getElementById('routerConfigModal'), {
    backdrop: 'static',
    keyboard: false
  });

  var today = new Date().toISOString().split("T")[0];
  document.getElementById("txtFecha").value = today;

  let tipoPaquete = "";
  let routerCount = 0;
  let jsonParametros = {};
  let jsonRouter = [];
  let jsonVenta = {};
  let jsonAlquilado = {};
  let jsonDeuda = {};
  let jsonData = {};
  let flagFichaInstalacion = false;

  // Código para manejar la selección de operación (Venta o Alquiler)
  document.getElementById('slcOperacion').addEventListener('change', function () {
    const tipoOperacion = this.value;
    const frmVenta = document.getElementById('frmVenta');
    const frmAlquiler = document.getElementById('frmAlquiler');

    // Ocultar ambos formularios
    frmVenta.classList.add('hidden');
    frmAlquiler.classList.add('hidden');

    // Mostrar el formulario correspondiente según el tipo de operación
    if (tipoOperacion === 'venta') {
      frmVenta.classList.remove('hidden');
    } else if (tipoOperacion === 'alquiler') {
      frmAlquiler.classList.remove('hidden');
    }
  });

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

      if (data.length === 0 || !data[0].ficha_instalacion) {
        showToast("No hay datos en Ficha de Instalación", "INFO");
      }

      //const fichaInstalacion = JSON.parse(data[0].ficha_instalacion);

      document.getElementById("txtCliente").value = data[0].nombre_cliente;
      document.getElementById("txtNumFicha").value = data[0].id_contrato;
      document.getElementById("txtPaquete").value = data[0].paquete;
      document.getElementById("txtPrecio").value = data[0].precio;

      tipoPaquete = data[0].tipo_servicio;

      if (data[0].ficha_instalacion) {
        const installationData = JSON.parse(data[0].ficha_instalacion);

        // Cargar datos de parámetros
        const parametros = installationData.parametros;
        document.getElementById("slcFrecuenciaParametros").value = parametros.frecuencia.join(", ");
        document.getElementById("slcBaseParametros").value = parametros.base.join(", ");
        document.getElementById("slcSubBaseParametros").value = parametros.subBase.join(", ");
        document.getElementById("txtSignalStrengthParametros").value = parametros.signalStrength;
        document.getElementById("txtNoiseFloorParametros").value = parametros.noiseFloor;
        document.getElementById("txtTransmiTccqParametros").value = parametros.transmiTccq;
        document.getElementById("txtTxRateParametros").value = parametros.txRate;
        document.getElementById("txtRxRateParametros").value = parametros.rxRate;

        // Cargar datos de configuración del router
        cargarRouters(installationData.ConfiRouter);

        // Actualizar el contador de routers
        routerCount = installationData.ConfiRouter.length;

        // Mostrar y cargar datos de venta o alquiler
        const frmVenta = document.getElementById('frmVenta');
        const frmAlquiler = document.getElementById('frmAlquiler');

        if (installationData.venta) {
          frmVenta.classList.remove('hidden');
          frmAlquiler.classList.add('hidden');
          const venta = installationData.venta;
          document.getElementById("txtCostoAntenaVenta").value = venta.costoAntena;
          document.getElementById("txtCostoRouterVenta").value = venta.costoRouter;
          document.getElementById("txtSubTotalVenta").value = venta.subTotal;
          document.getElementById("txtAdelantoVenta").value = venta.adelanto;
          document.getElementById("txtSaldoEquipoVenta").value = venta.saldoEquipos;
          document.getElementById("txtMaterialAdicionalVenta").value = venta.materialAdicional;
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
          document.getElementById("txtFechaInicioAlquilados").value = alquilado.fechaInicio;
          document.getElementById("txtFechaFinAlquilados").value = alquilado.fechaFin;
          document.getElementById("txtCostoAlquilerAlquilados").value = alquilado.costoAlquiler;
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
          document.getElementById("chkAdelantadoAlquilados").checked = alquilado.condicionTiempo["Adelantado"] === true;
          document.getElementById("chkCumpliendoMesAlquilados").checked = alquilado.condicionTiempo["Cumpliendo el mes"] === true;
          document.getElementById("txtDetalleAlquilados").value = alquilado.detalle;
        }

        // Cargar datos de deuda
        const deuda = installationData.deuda;
        document.getElementById("txtPagoServicio").value = deuda.pagoServicio;
        document.getElementById("txtAdelantoEquipo").value = deuda.adelantoEquipo;
        document.getElementById("txtCostoAlquiler").value = deuda.costoAlquiler;
        document.getElementById("txtMaterialAdicional").value = deuda.materialAdicional;
        document.getElementById("txtTotalCancelado").value = deuda.totalCancelado;
        document.getElementById("txtSaldoPendiente").value = deuda.saldoPendiente;
        document.getElementById("txtDetalleDeuda").value = deuda.detalle;
      } else {
        showToast("No hay datos en la Ficha de Instalación.", "INFO");
      }

    } catch (error) {
      console.error("Error al obtener los datos de la ficha de instalación:", error);
    }
  })();

  function cargarRouters(confiRouter) {
    const rowContainer = document.createElement("div");
    rowContainer.classList.add("row");

    // Primero, vacía el contenedor de routers para evitar duplicados al recargar
    routersContainer.innerHTML = '';

    confiRouter.forEach((router, index) => {
      const routerData = router.ConfiRouter;
      const routerCol = document.createElement("div");
      routerCol.classList.add("col-md-4", "mb-4");

      const routerCard = document.createElement("div");
      routerCard.classList.add("card", "shadow-sm");
      routerCard.style.maxWidth = '100%';

      routerCard.innerHTML = `
        <div class="card-header text-white py-2">
          <h5 class="card-title mb-0 d-flex justify-content-between align-items-center fs-6">
            <span>Router N° ${index + 1}</span>
          </h5>
        </div>
        <div class="card-body p-0">
          <table class="table table-sm table-hover mb-0">
            <tbody>
              <tr>
                <td class="py-1 px-2"><i class="fas fa-globe text-primary me-2"></i>Código de Barra</td>
                <td class="py-1 px-2">${routerData.codigoBarra}</td>
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
                <td class="py-1 px-2">${routerData.puertaEnlace}</td>
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
                <td class="py-1 px-2">${routerData.ConfiWireless.lan}</td>
              </tr>
              <tr>
                <td class="py-1 px-2"><i class="fas fa-key text-primary me-2"></i>Acceso Wireless</td>
                <td class="py-1 px-2">${routerData.ConfiWireless.acceso}</td>
              </tr>
              <tr>
                <td class="py-1 px-2"><i class="fas fa-broadcast-tower text-primary me-2"></i>SSID</td>
                <td class="py-1 px-2">${routerData.ConfiWireless.ssid}</td>
              </tr>
              <tr>
                <td class="py-1 px-2"><i class="fas fa-shield-alt text-primary me-2"></i>Seguridad</td>
                <td class="py-1 px-2">${routerData.ConfiWireless.seguridad}</td>
              </tr>
              <tr>
                <td class="py-1 px-2"><i class="fas fa-info-circle text-primary me-2"></i>Otros</td>
                <td class="py-1 px-2">${routerData.ConfiWireless.otros}</td>
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
        routersContainer.removeChild(routerCol);
        jsonRouter.splice(index, 1); // Eliminar router de jsonRouter
        actualizarNumeros(); // Actualizar el contador de routers
      });

      routerCard.querySelector(".card-body").appendChild(deleteButton);
      routerCol.appendChild(routerCard);
      rowContainer.appendChild(routerCol);
    });

    routersContainer.appendChild(rowContainer);
    routerConfigModal.hide();
    limpiarCampos();
    actualizarNumeros();

    // Agregar console.log para mostrar los routers existentes
    console.log("Routers existentes:", confiRouter);
  }

  // Función para agregar un nuevo router
  function agregarRouter() {
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

      if (!wan || !mascara || !puertaEnlace || !dns1 || !dns2 || !lan || !acceso || !ssid || !seguridad || !otros) {
        showToast("Complete los campos", "INFO");
        return; // Interrumpir la ejecución
      }

      const newRouter = {
        codigoBarra,
        modelo,
        marca,
        wan,
        mascara,
        puertaEnlace,
        dns1,
        dns2,
        lan,
        acceso,
        ssid,
        seguridad,
        otros
      };

      jsonRouter.push(newRouter);
      routerCount++;

      const routerCol = document.createElement("div");
      routerCol.classList.add("col-md-4", "mb-4");

      const routerCard = document.createElement("div");
      routerCard.classList.add("card", "shadow-sm");
      routerCard.style.maxWidth = '100%';

      routerCard.innerHTML = `
        <div class="card-header text-white py-2">
          <h5 class="card-title mb-0 d-flex justify-content-between align-items-center fs-6">
            <span>Router N° ${routerCount}</span>
          </h5>
        </div>
        <div class="card-body p-0">
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
            routersContainer.removeChild(routerCol);
            jsonRouter.splice(jsonRouter.indexOf(newRouter), 1);
            routerCount--; // Decrementar el contador de routers
            actualizarNumeros();
          }
        });
      });

      routerCard.querySelector(".card-body").appendChild(deleteButton);
      routerCol.appendChild(routerCard);
      routersContainer.appendChild(routerCol);

      routerConfigModal.hide();

      limpiarCampos();
    }
  }

  // Limpiar campos de configuración del router
  function limpiarCampos() {
    document.getElementById("txtWanRouter").value = "";
    document.getElementById("txtMascaraRouter").value = "";
    document.getElementById("txtPuertaEnlaceRouter").value = "";
    document.getElementById("txtDns1Router").value = "";
    document.getElementById("txtDns2Router").value = "";
    document.getElementById("txtLanWireless").value = "";
    document.getElementById("txtAccesoWireless").value = "";
    document.getElementById("txtSsidWireless").value = "";
    document.getElementById("txtSeguridadWireless").value = "";
    document.getElementById("txtOtrosWireless").value = "";
  }

  // Actualizar los números de los routers
  function actualizarNumeros() {
    const routerCards = routersContainer.querySelectorAll(".card");
    routerCards.forEach((card, index) => {
      const cardHeader = card.querySelector(".card-header span");
      cardHeader.textContent = `Router N° ${index + 1}`;
    });
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

    //Validacion de datos para money
    $(`#txtAdelantoVenta, 
      #txtCostoAlquilerAlquilados, 
      #txtSubTotalVenta, 
      #txtSaldoEquipoVenta, 
      #txtCostoAntenaVenta, 
      #txtCostoRouterVenta`)
      .mask('000.000.000.000.000,00', { reverse: true });
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
    const slcFrecuencia = document.getElementById('slcFrecuenciaParametros').value;
    const slcBase = document.getElementById('slcBaseParametros').value;
    const slcSubBase = document.getElementById('slcSubBaseParametros').value;
    const txtSignalStrength = document.getElementById('txtSignalStrengthParametros').value;
    const txtNoiseFloor = document.getElementById('txtNoiseFloorParametros').value;
    const txtTransmiTccq = parseFloat(document.getElementById('txtTransmiTccqParametros').value);
    const txtTxRate = parseFloat(document.getElementById('txtTxRateParametros').value);
    const txtRxRate = parseFloat(document.getElementById('txtRxRateParametros').value);
    if (!flagFichaInstalacion) {
      if (
        slcFrecuencia === "" ||
        slcBase === "" ||
        slcSubBase === "" ||
        txtSignalStrength === "" ||
        txtNoiseFloor === "" ||
        txtTransmiTccq === "" ||
        txtTxRate === "" ||
        txtRxRate === ""
      ) {
        showToast("Por Favor, llene todos los campos requeridos.", "WARNING", 1500);
      } else {
        jsonParametros = {
          parametros: {
            frecuencia: slcFrecuencia.split(","),
            base: slcBase.split(","),
            subBase: slcSubBase.split(","),
            signalStrength: txtSignalStrength,
            noiseFloor: txtNoiseFloor,
            transmiTccq: txtTransmiTccq,
            txRate: txtTxRate,
            rxRate: txtRxRate,
          }
        }
      }
    }
    jsonData.parametros = jsonParametros.parametros;
    if (!jsonData.ConfiRouter) {
      jsonData.ConfiRouter = [];
    }
  }

  async function productoBarraBuscar(cajatxt) {
    const caja = document.getElementById(cajatxt);
    const response = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoBarra&codigoBarra=${caja.value}`);
    const data = await response.json();
    console.log(data);
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
    txtMarcaVentaAntena.value = datos[0].marca;
    txtModeloVentaAntena.value = datos[0].modelo;
    txtCostoAntenaVenta.value = datos[0].precio_actual;
  });

  document.querySelector('#txtMacVentaAntena').addEventListener('change', async function () {
    const datos = await productoBarraBuscar('txtMacVentaAntena');
    txtMarcaVentaRouter.value = datos[0].marca;
    txtModeloVentaRouter.value = datos[0].modelo;
    txtCostoRouterVenta.value = datos[0].precio_actual;
  });

  //Json Router
  async function router() {
    if (!flagFichaInstalacion) {
      let allFieldsFilled = true;
      const updatedRouters = [];

      jsonRouter.forEach((router, index) => {
        if (
          router.codigoBarra === "" ||
          router.modelo === "" ||
          router.marca === "" ||
          router.wan === "" ||
          router.mascara === "" ||
          router.puertaEnlace === "" ||
          router.dns1 === "" ||
          router.dns2 === "" ||
          router.lan === "" ||
          router.acceso === "" ||
          router.ssid === "" ||
          router.seguridad === "" ||
          router.otros === ""
        ) {
          showToast(`Por Favor, llene todos los campos requeridos para el Router N° ${index + 1}.`, "WARNING", 1500);
          allFieldsFilled = false;
        } else {
          updatedRouters.push({
            codigoBarra: router.codigoBarra,
            modelo: router.modelo,
            marca: router.marca,
            wan: router.wan,
            mascara: router.mascara,
            puertaEnlace: router.puertaEnlace,
            dns1: router.dns1,
            dns2: router.dns2,
            lan: router.lan,
            acceso: router.acceso,
            ssid: router.ssid,
            seguridad: router.seguridad,
            otros: router.otros,
            isNew: router.isNew
          });
        }
      });

      if (allFieldsFilled) {
        //jsonData.ConfiRouter = jsonData.ConfiRouter || [];
        jsonData.ConfiRouter = jsonData.ConfiRouter.concat(updatedRouters.map(router => ({
          ConfiRouter: {
            codigoBarra: router.codigoBarra,
            modelo: router.modelo,
            marca: router.marca,
            wan: router.wan,
            mascara: router.mascara,
            puertaEnlace: router.puertaEnlace,
            dns1: router.dns1,
            dns2: router.dns2,
            ConfiWireless: {
              lan: router.lan,
              acceso: router.acceso,
              ssid: router.ssid,
              seguridad: router.seguridad,
              otros: router.otros
            },
            isNew: router.isNew
          }
        })));
      }
    }
  }

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

    // Solo procesamos si todos los campos están completos
    if (
      txtCostoAntenaVenta === "" ||
      txtCostoRouterVenta === "" ||
      txtMarcaVentaAntena === "" ||
      txtMarcaVentaRouter === "" ||
      txtSubTotalVenta === "" ||
      txtModeloVentaAntena === "" ||
      txtModeloVentaRouter === "" ||
      txtAdelantoVenta === "" ||
      txtMacVentaAntena === "" ||
      txtMacVentaRouter === "" ||
      txtSaldoEquipoVenta === "" ||
      txtDescripcionVentaAntena === "" ||
      txtDescripcionVentaRouter === "" ||
      txtMaterialAdicionalVenta === "" ||
      txtDetalleVenta === ""
    ) {
      showToast("Por Favor, llene todos los campos requeridos.", "WARNING", 1500);
      return null;
    } else {
      jsonVenta = {
        venta: {
          costoAntena: txtCostoAntenaVenta,
          costoRouter: txtCostoRouterVenta,
          subTotal: txtSubTotalVenta,
          adelanto: txtAdelantoVenta,
          saldoEquipos: txtSaldoEquipoVenta,
          materialAdicional: txtMaterialAdicionalVenta,
          condicion: {
            "Adelantado": chkAdelantadoVenta ? true : "",
            "Cumpliendo el mes": chkCumpliendoMesVenta ? true : ""
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
    }
    jsonData.venta = jsonVenta.venta;
    if (!jsonData.ConfiRouter) {
      jsonData.ConfiRouter = [];
    }
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

    // Solo procesamos si todos los campos están completos
    if (
      slcCondicionAlquilado === "" ||
      txtPeriodoAlquilado === "" ||
      txtCostoAlquilerAlquilado === "" ||
      txtMarcaAntenaAlquilado === "" ||
      txtMarcaRouterAlquilado === "" ||
      txtFechaInicioAlquilado === "" ||
      txtModeloAntenaAlquilado === "" ||
      txtModeloRouterAlquilado === "" ||
      txtFechaFinAlquilado === "" ||
      txtMacAntenaAlquilado === "" ||
      txtMacRouterAlquilado === "" ||
      txtDescripcionAntenaAlquilado === "" ||
      txtDescripcionRouterAlquilado === "" ||
      txtDetalleAlquilado === ""
    ) {
      showToast("Por Favor, llene todos los campos requeridos.", "WARNING", 1500);
      return null;
    } else {
      jsonAlquilado = {
        alquilado: {
          condicion: slcCondicionAlquilado,
          periodo: txtPeriodoAlquilado,
          fechaInicio: txtFechaInicioAlquilado,
          fechaFin: txtFechaFinAlquilado,
          costoAlquiler: txtCostoAlquilerAlquilado,
          condicionTiempo : {
            "Adelantado": chkAdelantadoAlquilado ? true : "",
            "Cumpliendo el mes": chkCumpliendoMesAlquilados ? true : ""
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
    }
    jsonData.alquilado = jsonAlquilado.alquilado;
    if (!jsonData.ConfiRouter) {
      jsonData.ConfiRouter = [];
    }
  }

  //Json Pago
  async function deuda() {
    const txtPagoServicio = parseFloat(document.getElementById('txtPagoServicio').value);
    const txtAdelantoEquipo = parseFloat(document.getElementById('txtAdelantoEquipo').value);
    const txtCostoAlquiler = parseFloat(document.getElementById('txtCostoAlquiler').value);
    const txtMaterialAdicional = parseFloat(document.getElementById('txtMaterialAdicional').value);
    const txtTotalCancelado = parseFloat(document.getElementById('txtTotalCancelado').value);
    const txtSaldoPendiente = parseFloat(document.getElementById('txtSaldoPendiente').value);
    const txtDetalleDeuda = document.getElementById('txtDetalleDeuda').value;
    if (!flagFichaInstalacion) {
      if (
        txtPagoServicio === "" ||
        txtAdelantoEquipo === "" ||
        txtCostoAlquiler === "" ||
        txtMaterialAdicional === "" ||
        txtTotalCancelado === "" ||
        txtSaldoPendiente === "" ||
        txtDetalleDeuda === ""
      ) {
        showToast("Por Favor, llene todos los campos requeridos.", "WARNING", 1500);
        return;
      } else {
        jsonDeuda = {
          deuda: {
            pagoServicio: txtPagoServicio,
            adelantoEquipo: txtAdelantoEquipo,
            costoAlquiler: txtCostoAlquiler,
            materialAdicional: txtMaterialAdicional,
            totalCancelado: txtTotalCancelado,
            saldoPendiente: txtSaldoPendiente,
            detalle: txtDetalleDeuda
          }
        }
      }
    }
    jsonData.deuda = jsonDeuda.deuda;
    if (!jsonData.ConfiRouter) {
      jsonData.ConfiRouter = [];
    }
  }

  //Función Registrar Ficha Wisp
  async function registrarFichaWisp() {
    await parametros();
    await router();
    await venta();
    await alquilado_prestado();
    await deuda();

    jsonData.ConfiRouter = jsonRouter.map(router => ({
      ConfiRouter: {
        codigoBarra: router.codigoBarra,
        modelo: router.modelo,
        marca: router.marca,
        wan: router.wan,
        mascara: router.mascara,
        puertaEnlace: router.puertaEnlace,
        dns1: router.dns1,
        dns2: router.dns2,
        ConfiWireless: {
          lan: router.lan,
          acceso: router.acceso,
          ssid: router.ssid,
          seguridad: router.seguridad,
          otros: router.otros
        },
        isNew: router.isNew
      }
    }));

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
    console.log(datos);
  }

  document.getElementById('btnRegistrar').addEventListener('click', async (event) => {
    if (!validarFormulario()) {
      event.preventDefault();
      return;
    }
    if (!flagFichaInstalacion) {
      await registrarFichaWisp();
      showToast("Ficha de Instalación guardada correctamente", "SUCCESS");
      setTimeout(() => {
        window.location.href = `${config.HOST}views/Contratos/`;
      }, 2000);
    } else {
      showToast("Ficha de Instalación ya guardada", "INFO");
    }
  });

  document.getElementById("btnCancelar").addEventListener("click", () => {
    window.location.href = `${config.HOST}views/Contratos/`;
  });

  document.getElementById("btnReporte").addEventListener("click", () => {
    window.open(`${config.HOST}views/reports/Instalacion_WISP/soporte.php?id=${idContrato}`, '_blank');
  });

  btnAgregarRouter.addEventListener("click", agregarRouter);

  function validarFormulario() {
    const signalStrength = parseFloat(document.getElementById('txtSignalStrengthParametros').value);
    const noiseFloor = parseFloat(document.getElementById('txtNoiseFloorParametros').value);
    const txRate = parseFloat(document.getElementById('txtTxRateParametros').value);
    const rxRate = parseFloat(document.getElementById('txtRxRateParametros').value);
    const transmiTccq = parseFloat(document.getElementById('txtTransmiTccqParametros').value);
    const fechaInicioAlquilados = document.getElementById('txtFechaInicioAlquilados').value;
    const today = new Date().toISOString().split("T")[0];
    const frmAlquiler = document.getElementById('frmAlquiler');

    if (signalStrength < -90 || signalStrength > -20) {
      showToast("El valor de Signal Strength debe estar entre -90 y -20.", "INFO");
      return false;
    }
    if (noiseFloor < -100 || noiseFloor > -30) {
      showToast("El valor de Noise Floor debe estar entre -100 y -30.", "INFO");
      return false;
    }
    if (txRate < 20.00 || txRate > 90.00) {
      showToast("El valor de Tx Rate debe estar entre 20.00 y 90.00.", "INFO");
      return false;
    }
    if (rxRate < 20.00 || rxRate > 90.00) {
      showToast("El valor de Rx Rate debe estar entre 20.00 y 90.00.", "INFO");
      return false;
    }
    if (transmiTccq < 40 || transmiTccq > 100) {
      showToast("El valor de Transmit CCQ debe estar entre 40 y 100.", "INFO");
      return false;
    }
    if (!frmAlquiler.classList.contains('hidden') && fechaInicioAlquilados < today) {
      showToast("La fecha de inicio no puede ser menor a la fecha actual.", "INFO");
      return false;
    }
    return true;
  }

  function calcularSubtotal() {
    const adelanto = parseFloat(document.getElementById('txtAdelantoVenta').value) || 0;
    const materialAdicional = parseFloat(document.getElementById('txtMaterialAdicionalVenta').value) || 0;
    const subtotal = adelanto + materialAdicional;
    document.getElementById('txtSubTotalVenta').value = subtotal.toFixed(2);
  }

  document.getElementById('txtAdelantoVenta').addEventListener('input', calcularSubtotal);
  document.getElementById('txtMaterialAdicionalVenta').addEventListener('input', calcularSubtotal);

});

