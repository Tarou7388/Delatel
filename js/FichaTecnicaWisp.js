import config from "../env.js";

document.addEventListener("DOMContentLoaded", async () => {
  let login = await Herramientas.obtenerLogin();
  const userid = login.idUsuario;
  document.getElementById("txtFecha").value = new Date().toISOString().split('T')[0];
  const btnAgregarRouter = document.getElementById("btnAgregarRouter");
  const routersContainer = document.getElementById("routersContainer");
  const saveButton = document.getElementById("saveButton");
  const slcBase = document.getElementById("slcBaseParametros");

  const chkAdelantadoVenta = document.getElementById('chkAdelantadoVenta');
  const chkCumpliendoMesVenta = document.getElementById('chkCumpliendoMesVenta');
  const chkAdelantadoAlquilado = document.getElementById('chkAdelantadoAlquilados');
  const chkCumpliendoMesAlquilado = document.getElementById('chkCumpliendoMesAlquilados');
  const routerConfigModal = new bootstrap.Modal(document.getElementById('routerConfigModal'), {
    backdrop: 'static',
    keyboard: false
  });

  let numeroRouter = 0;
  let jsonParametros = {};
  let jsonRouter = [];
  let jsonVenta = {};
  let jsonAlquilado = {};
  let jsonDeuda = {};
  let jsonData = {};

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

  function formularioLleno(formulario) {
    const campos = formulario.querySelectorAll('input, textarea, select');
    for (const campo of campos) {
      if (campo.value.trim() !== "") {
        return true;
      }
    }
    return false;
  }

  document.getElementById('slcOperacion').addEventListener('change', function () {
    const tipoOperacion = this.value;
    const formularioVenta = document.getElementById('frmVenta');
    const formularioAlquiler = document.getElementById('frmAlquiler');

    formularioVenta.classList.add('hidden');
    formularioAlquiler.classList.add('hidden');

    limpiarFormulario(formularioVenta);
    limpiarFormulario(formularioAlquiler);

    if (tipoOperacion === 'venta') {
      formularioVenta.classList.remove('hidden');
    } else if (tipoOperacion === 'alquiler') {
      formularioAlquiler.classList.remove('hidden');
    }
  });

  function limpiarFormulario(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.value = ''; 
    });
  }

  (async () => {
    try {
      const response = await fetch(`${config.HOST}app/controllers/Base.controllers.php?operacion=listarBase`);
      const data = await response.json();

      if (Array.isArray(data)) {
        data.forEach(base => {
          const option = document.createElement('option');
          option.value = base.id_base;
          option.textContent = base.nombre_base;
          slcBase.appendChild(option);
        });
      } else {
        console.error("La estructura de los datos devueltos no es la esperada:", data);
      }

    } catch (error) {
      console.error("Error al cargar las bases:", error);
    }
  })();

  async function cargarSubBases(baseId) {
    if (!baseId || baseId === "0") {
      console.warn("No hay provincia seleccionada para cargar sub-bases.");
      return;
    }
    try {
      const response = await fetch(`${config.HOST}app/controllers/Base.controllers.php?operacion=buscarBaseId&id=${baseId}`);
      const data = await response.json();

      const slcSubBase = document.getElementById('slcSubBaseParametros');
      slcSubBase.innerHTML = '<option value="0" selected disabled>Seleccione</option>';

      if (Array.isArray(data)) {
        data.forEach(subBase => {
          const option = document.createElement('option');
          option.value = subBase.id_sub_base;
          option.textContent = subBase.nombre_sub_base;
          slcSubBase.appendChild(option);
        });
      } else {
        console.error("La estructura de los datos devueltos no es la esperada:", data);
      }

    } catch (error) {
      console.error("Error al cargar las subBases:", error);
    }
  }

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

    } catch (error) {
      console.error("Error al obtener los datos de la ficha de instalación:", error);
    }
  })();

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

      const campos = [
        { id: 'txtCodigoBarraRouter', valor: codigoBarra },
        { id: 'txtWanRouter', valor: wan },
        { id: 'txtMascaraRouter', valor: mascara },
        { id: 'txtPuertaEnlaceRouter', valor: puertaEnlace },
        { id: 'txtDns1Router', valor: dns1 },
        { id: 'txtDns2Router', valor: dns2 },
        { id: 'txtLanWireless', valor: lan },
        { id: 'txtAccesoWireless', valor: acceso },
        { id: 'txtSsidWireless', valor: ssid },
        { id: 'txtSeguridadWireless', valor: seguridad }
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

      const camposTresPuntos = [
        { id: 'txtWanRouter', valor: wan },
        { id: 'txtLanWireless', valor: lan },
        { id: 'txtMascaraRouter', valor: mascara },
        { id: 'txtPuertaEnlaceRouter', valor: puertaEnlace },
        { id: 'txtDns1Router', valor: dns1 },
        { id: 'txtDns2Router', valor: dns2 }
      ];

      camposTresPuntos.forEach(campo => {
        const elemento = document.getElementById(campo.id);
        if ((campo.valor.match(/\./g) || []).length < 3) {
          elemento.classList.add("is-invalid");
          todosValidos = false;
        } else {
          elemento.classList.remove("is-invalid");
        }
      });

      if (!todosValidos) {
        return;
      }

      const router = {
        numero: ++numeroRouter,
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

  function actualizarNumeros() {
    const routerCards = routersContainer.querySelectorAll(".card");
    routerCards.forEach((card, index) => {
      const cardHeader = card.querySelector(".card-header span");
      cardHeader.textContent = `Router N° ${index + 1}`;

      const routerId = card.id.replace('carta', '');
      const routerIndex = jsonRouter.findIndex(router => router.numero == routerId);
      if (routerIndex !== -1) {
        jsonRouter[routerIndex].numero = index + 1;
      }
    });
    numeroRouter = routerCards.length; 
  }

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
        routers: jsonRouter,
        repetidores: [],
      },
    }
    jsonData.parametros = jsonParametros.parametros;
  }

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

  async function productoBarraBuscar(cajatxt) {
    const caja = document.getElementById(cajatxt);
    const response = await fetch(`${config.HOST}app/controllers/Producto.controllers.php?operacion=buscarProductoBarra&codigoBarra=${caja.value}`);
    const data = await response.json();
    return data;
  }

  document.querySelector('#txtCodigoBarraRouter').addEventListener('input', async function () {
    const datos = await productoBarraBuscar('txtCodigoBarraRouter');
    if (datos.length > 0) {
      document.querySelector('#txtMarcaRouter').value = datos[0].marca;
      document.querySelector('#txtModeloRouter').value = datos[0].modelo;
    } else {
      showToast("Producto no encontrado", "WARNING");
    }
  });

  document.querySelector('#txtMacAntenaAlquilados').addEventListener('input', async function () {
    const datos = await productoBarraBuscar('txtMacAntenaAlquilados');
    if (datos.length > 0) {
      document.querySelector('#txtMarcaAntenaAlquilados').value = datos[0].marca;
      document.querySelector('#txtModeloAntenaAlquilados').value = datos[0].modelo;
    } else {
      showToast("Producto no encontrado", "WARNING");
    }
  });

  document.querySelector('#txtMacRouterAlquilados').addEventListener('input', async function () {
    const datos = await productoBarraBuscar('txtMacRouterAlquilados');
    if (datos.length > 0) {
      document.querySelector('#txtMarcaRouterAlquilados').value = datos[0].marca;
      document.querySelector('#txtModeloRouterAlquilados').value = datos[0].modelo;
    } else {
      showToast("Producto no encontrado", "WARNING");
    }
  });

  document.querySelector('#txtMacVentaRouter').addEventListener('input', async function () {
    const datos = await productoBarraBuscar('txtMacVentaRouter');
    if (datos.length > 0) {
      txtMarcaVentaRouter.value = datos[0].marca;
      txtModeloVentaRouter.value = datos[0].modelo;
      txtCostoRouterVenta.value = datos[0].precio_actual;
    } else {
      showToast("Producto no encontrado", "WARNING");
    }
  });

  document.querySelector('#txtMacVentaAntena').addEventListener('input', async function () {
    const datos = await productoBarraBuscar('txtMacVentaAntena');
    if (datos.length > 0) {
      txtMarcaVentaAntena.value = datos[0].marca;
      txtModeloVentaAntena.value = datos[0].modelo;
      txtCostoAntenaVenta.value = datos[0].precio_actual;
    } else {
      showToast("Producto no encontrado", "WARNING");
    }
  });

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
    "slcCondicionAlquilados",
    "txtMacAntenaAlquilados",
    "txtMacRouterAlquilados",
    "txtPeriodoAlquilados",
    "txtFechaInicioAlquilados",
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

        if (formularioLleno(frmVenta) || formularioLleno(frmAlquiler)) {
          slcOperacion.disabled = true; 
        } else {
          slcOperacion.disabled = false; 
        }
      });
    });
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


      if (!elemento || elemento.value.trim() === "" || elemento.value === "0") {
        if (elemento) {
          elemento.classList.add("is-invalid");
        }
        allValid = false;
        continue;
      } else {
        elemento.classList.remove("is-invalid");
      }

      if (!isNaN(elemento.value)) {
        const valor = parseFloat(elemento.value);
        const min = elemento.hasAttribute('min') ? parseFloat(elemento.min) : null;
        const max = elemento.hasAttribute('max') ? parseFloat(elemento.max) : null;

        if (min !== null && valor < min) {
          elemento.classList.add("is-invalid");
          allValid = false;
        }

        if (max !== null && valor > max) {
          elemento.classList.add("is-invalid");
          allValid = false;
        }
      }
    }

    return allValid;
  }

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

    jsonData.venta = null;
    jsonData.alquilado = null;

    const tipoOperacion = document.getElementById('slcOperacion').value;

    if (tipoOperacion === 'venta') {
      await venta(); 
    } else if (tipoOperacion === 'alquiler') {
      await alquilado_prestado();
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

  $("#slcBaseParametros").on("change", function () {
    const baseId = this.value;
    cargarSubBases(baseId);
  });

  $(document).ready(function () {
    $(".select2me").select2({
      theme: "bootstrap-5",
      allowClear: true,
      placeholder: "Seleccione"
    }).on('select2:clear', function (e) {
      const selectElement = $(this);
      const baseId = selectElement.val();
      if (baseId) {
        cargarSubBases(baseId);
      } else {
        console.warn("No hay Bases seleccionada para cargar sub-bases.");
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

  document.getElementById("txtSignalStrengthParametros").addEventListener("input", validarValorRango);
  document.getElementById("txtNoiseFloorParametros").addEventListener("input", validarValorRango);
  document.getElementById("txtTransmiTccqParametros").addEventListener("input", validarValorRango);
  document.getElementById("txtTxRateParametros").addEventListener("input", validarValorRango);
  document.getElementById("txtRxRateParametros").addEventListener("input", validarValorRango);

  addInputEventListeners(camposVenta);
  addInputEventListeners(camposAlquiler);

  toggleCheckbox(chkAdelantadoVenta, chkCumpliendoMesVenta);
  toggleCheckbox(chkCumpliendoMesVenta, chkAdelantadoVenta);
  toggleCheckbox(chkAdelantadoAlquilado, chkCumpliendoMesAlquilado);
  toggleCheckbox(chkCumpliendoMesAlquilado, chkAdelantadoAlquilado);

  document.getElementById('txtAdelantoVenta').addEventListener('input', calcularSubtotal);
  document.getElementById('txtMaterialAdicionalVenta').addEventListener('input', calcularSubtotal);
});

