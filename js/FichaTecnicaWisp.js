import config from "../env.js";

document.addEventListener("DOMContentLoaded", () => {
  const userid = user["idUsuario"];
  const btnAgregarRouter = document.getElementById("btnAgregarRouter");
  const routersContainer = document.getElementById("routersContainer");
  const saveButton = document.getElementById("saveButton");
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
  let wan, mascara, puertaEnlace, dns1, dns2, lan, acceso, ssid, seguridad, otros;

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
        document.getElementById("slcRouterParametros").value = parametros.router.join(", ");
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

        // Cargar datos de venta
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
        document.getElementById("txtDescripcionVentaAntena").value = venta.antena.descripcion;
        document.getElementById("txtMarcaVentaRouter").value = venta.router.marca;
        document.getElementById("txtModeloVentaRouter").value = venta.router.modelo;
        document.getElementById("txtMacVentaRouter").value = venta.router.mac;
        document.getElementById("txtDescripcionVentaRouter").value = venta.router.descripcion;
        document.getElementById("txtDetalleVenta").value = venta.detalle;

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

  //Cargar routers
  function cargarRouters(confiRouter) {
    confiRouter.forEach((router, index) => {
      const routerData = router.ConfiRouter;
      const routerCard = document.createElement("div");
      routerCard.classList.add("card", "mb-3");

      routerCard.innerHTML = `
            <div class="card-header">
                Router N° ${index + 1}
            </div>
            <div class="card-body">
                <ul>
                    <li><strong>WAN:</strong> ${routerData.wan}</li>
                    <li><strong>Máscara:</strong> ${routerData.mascara}</li>
                    <li><strong>Puerta de Enlace:</strong> ${routerData.puertaEnlace}</li>
                    <li><strong>DNS 1:</strong> ${routerData.dns1}</li>
                    <li><strong>DNS 2:</strong> ${routerData.dns2}</li>
                    <li><strong>LAN Wireless:</strong> ${routerData.ConfiWireless.lan}</li>
                    <li><strong>Acceso Wireless:</strong> ${routerData.ConfiWireless.acceso}</li>
                    <li><strong>SSID:</strong> ${routerData.ConfiWireless.ssid}</li>
                    <li><strong>Seguridad:</strong> ${routerData.ConfiWireless.seguridad}</li>
                    <li><strong>Otros:</strong> ${routerData.ConfiWireless.otros}</li>
                </ul>
            </div>
        `;

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("btn", "btn-danger", "ms-2");
      deleteButton.textContent = "Eliminar";

      deleteButton.addEventListener("click", function () {
        routersContainer.removeChild(routerCard);
        routerCount--;
        actualizarNumeros();
        jsonRouter.splice(index, 1);
      });

      routerCard.querySelector(".card-body").appendChild(deleteButton);
      routersContainer.appendChild(routerCard);
    });
  }

  // Función para agregar un nuevo router
  function agregarRouter() {
    routerCount++;

    routerConfigModal.show();

    saveButton.onclick = function () {
      wan = document.getElementById("txtWanRouter").value;
      mascara = document.getElementById("txtMascaraRouter").value;
      puertaEnlace = document.getElementById("txtPuertaEnlaceRouter").value;
      dns1 = document.getElementById("txtDns1Router").value;
      dns2 = document.getElementById("txtDns2Router").value;
      lan = document.getElementById("txtLanWireless").value;
      acceso = document.getElementById("txtAccesoWireless").value;
      ssid = document.getElementById("txtSsidWireless").value;
      seguridad = document.getElementById("txtSeguridadWireless").value;
      otros = document.getElementById("txtOtrosWireless").value;

      jsonRouter.push({
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
      });

      const routerCard = document.createElement("div");
      routerCard.classList.add("card", "mb-3");

      routerCard.innerHTML = `
        <div class="card-header">
          Router N° ${routerCount}
        </div>
        <div class="card-body">
          <ul>
            <li><strong>WAN:</strong> ${wan}</li>
            <li><strong>Máscara:</strong> ${mascara}</li>
            <li><strong>Puerta de Enlace:</strong> ${puertaEnlace}</li>
            <li><strong>DNS 1:</strong> ${dns1}</li>
            <li><strong>DNS 2:</strong> ${dns2}</li>
            <li><strong>LAN Wireless:</strong> ${lan}</li>
            <li><strong>Acceso Wireless:</strong> ${acceso}</li>
            <li><strong>SSID:</strong> ${ssid}</li>
            <li><strong>Seguridad:</strong> ${seguridad}</li>
            <li><strong>Otros:</strong> ${otros}</li>
          </ul>
        </div>
      `;

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("btn", "btn-danger", "ms-2");
      deleteButton.textContent = "Eliminar";

      deleteButton.addEventListener("click", function () {
        routersContainer.removeChild(routerCard);
        routerCount--;
        actualizarNumeros();
        jsonRouter.splice(routerCount, 1);
      });

      routerCard.querySelector(".card-body").appendChild(deleteButton);
      routersContainer.appendChild(routerCard);

      routerConfigModal.hide();

      limpiarCampos();
    };
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
    routerCount = routerCards.length;

    routerCards.forEach((card, index) => {
      const cardHeader = card.querySelector(".card-header");
      cardHeader.textContent = `Router N° ${index + 1}`;
    });
  }

  btnAgregarRouter.addEventListener("click", agregarRouter);

  function formatDns(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 4) {
      value = value.substring(0, 4);
    }
    value = value.replace(/(\d{1,1})(?=\d)/g, '$1.');
    input.value = value;
  }

  function formatIp(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 12) {
      value = value.substring(0, 12);
    }
    if (value.length > 3) {
      value = value.replace(/^(\d{1,3})(\d{1,2})$/, '$1.$2');
    }
    if (value.length > 6) {
      value = value.replace(/^(\d{1,3})(\d{1,2})(\d{1,3})$/, '$1.$2.$3');
    }
    if (value.length > 9) {
      value = value.replace(/^(\d{1,3})(\d{1,2})(\d{1,2})(\d{1,3})$/, '$1.$2.$3.$4');
    }

    input.value = value.substring(0, 15);
  }

  const fieldsIp = ['txtWanRouter', 'txtPuertaEnlaceRouter', 'txtLanWireless'];
  const fieldsDns = ['txtDns1Router', 'txtDns2Router'];

  fieldsDns.forEach(fieldId => {
    const inputField = document.getElementById(fieldId);
    inputField.addEventListener('input', function () {
      formatDns(inputField);
    });
  });

  fieldsIp.forEach(fieldId => {
    const inputField = document.getElementById(fieldId);
    inputField.addEventListener('input', function () {
      formatIp(inputField);
    });
  });


  // Check de Adelantado o cumpliendo el mes 
  const chkAdelantadoVenta = document.getElementById('chkAdelantadoVenta');
  const chkCumpliendoMesVenta = document.getElementById('chkCumpliendoMesVenta');
  const chkAdelantadoAlquilado = document.getElementById('chkAdelantadoAlquilados');
  const chkCumpliendoMesAlquilado = document.getElementById('chkCumpliendoMesAlquilados');

  chkAdelantadoVenta.addEventListener('change', function () {
    if (chkAdelantadoVenta.checked) {
      chkCumpliendoMesVenta.checked = false;
    }
  });

  chkCumpliendoMesVenta.addEventListener('change', function () {
    if (chkCumpliendoMesVenta.checked) {
      chkAdelantadoVenta.checked = false;
    }
  });

  chkAdelantadoAlquilado.addEventListener('change', function () {
    if (chkAdelantadoAlquilado.checked) {
      chkCumpliendoMesAlquilado.checked = false;
    }
  });

  chkCumpliendoMesAlquilado.addEventListener('change', function () {
    if (chkCumpliendoMesAlquilado.checked) {
      chkAdelantadoAlquilado.checked = false;
    }
  });

  //Json Parametros 
  async function parametros() {
    const slcRouter = document.getElementById('slcRouterParametros').value;
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
        slcRouter === "" ||
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
            router: slcRouter.split(","),
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
  }

  //Json Router
  async function router() {
    if (!flagFichaInstalacion) {
      jsonRouter.forEach((router, index) => {
        if (
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
        } else {
          jsonRouter[index] = {
            ConfiRouter: {
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
              }
            }
          }
        }
      });
    }
    jsonData.ConfiRouter = jsonRouter;
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
      return null; // Retornamos null si no se completan los campos
    } else {
      jsonVenta = {
        venta: {
          costoAntena: txtCostoAntenaVenta,
          costoRouter: txtCostoRouterVenta,
          subTotal: txtSubTotalVenta,
          adelanto: txtAdelantoVenta,
          saldoEquipos: txtSaldoEquipoVenta,
          materialAdicional: txtMaterialAdicionalVenta,
          condicion: chkAdelantadoVenta || chkCumpliendoMesVenta,
          antena: {
            marca: txtMarcaVentaAntena,
            modelo: txtModeloVentaAntena,
            mac: txtMacVentaAntena,
            descripcion: txtDescripcionVentaAntena
          },
          router: {
            marca: txtMarcaVentaRouter,
            modelo: txtModeloVentaRouter,
            mac: txtMacVentaRouter,
            descripcion: txtDescripcionVentaRouter
          },
          detalle: txtDetalleVenta,
        },
      };
    }
    jsonData.venta = jsonVenta.venta;
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
          condicion: chkAdelantadoAlquilado || chkCumpliendoMesAlquilados,
          antena: {
            marca: txtMarcaAntenaAlquilado,
            modelo: txtModeloAntenaAlquilado,
            mac: txtMacAntenaAlquilado,
            descripcion: txtDescripcionAntenaAlquilado
          },
          router: {
            marca: txtMarcaRouterAlquilado,
            modelo: txtModeloRouterAlquilado,
            mac: txtMacRouterAlquilado,
            descripcion: txtDescripcionRouterAlquilado
          },
          detalle: txtDetalleAlquilado,
        },
      };
    }
    jsonData.alquilado = jsonAlquilado.alquilado;
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
        //showToast("Por Favor, llene todos los campos requeridos.", "WARNING", 1500);
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
  }

  //Función Registrar Ficha Wisp
  async function registrarFichaWisp() {
    await parametros();
    await router();
    await venta();
    await alquilado_prestado();
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
    console.log(datos);
  }

  document.getElementById('btnRegistrar').addEventListener('click', async () => {
    if (!flagFichaInstalacion) {
      await registrarFichaWisp();
      showToast("Ficha de Instalación guardada correctamente", "SUCCESS");
      /* setTimeout(() => {
        window.location.href = `${config.HOST}views/Contratos/`;
      }, 2000); */
    } else {
      showToast("Ficha de Instalación ya guardada", "INFO");
    }
  });

  document.getElementById("btnCancelar").addEventListener("click", () => {
    window.location.href = `${config.HOST}views/Contratos/`;
  });

});

