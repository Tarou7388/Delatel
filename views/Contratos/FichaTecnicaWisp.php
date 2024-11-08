<?php require_once "../../header.php"; ?>

<?php
$idContrato = $_GET['idContrato'];
?>

<link rel="stylesheet" href="../../css/fichaWisp.css">

<!-- Datos del Usuario -->
<div class="container-fluid px-5">
  <div class="form-container mt-3">
    <h2 class="mt-4">Control Wisp Instalaciones</h2>

    <div class="row g-2 mb-2 justify-content-end">
      <div class="col-sm-1">
        <input type="text" class="form-control text-center" id="txtNumFicha" placeholder="N°" disabled>
      </div>
      <div class="col-sm-2">
        <input type="date" class="form-control text-center" id="txtFecha" placeholder="Fecha" disabled>
      </div>
    </div>
    <div class="conteiner">
      <div class="card mb-4">
        <div class="card-header bg-primary">
          <h6 class="card-title text-white">Datos del Cliente</h6>
        </div>
        <div class="card-body">
          <div class="row g-2 mb-2">
            <div class="col">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCliente" placeholder="Cliente" disabled>
                <label for="txtCliente">Cliente</label>
              </div>
            </div>
            <div class="col">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtPaquete" placeholder="Paquete" disabled>
                <label for="txtPaquete">Paquete</label>
              </div>
            </div>
            <div class="col input-group">
              <span class="input-group-text">S/.</span>
              <div class="form-floating">
                <input type="text" class="form-control" id="txtPrecio" placeholder="Precio" disabled>
                <label for="txtPrecio">Precio</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Parametros Tecnicos -->
<div class="container-fluid px-5">
  <div class="conteiner">
    <div class="card mb-4">
      <div class="card-header bg-primary">
        <h6 class="card-title text-white">Parámetros Técnicos</h6>
      </div>
      <div class="card-body">
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-group">
              <div class="form-floating">
                <select id="slcRouterParametros" class="form-select" required>
                  <option value="0" selected disabled>Seleccione</option>
                </select>
                <label for="slcRouterParametros">Router</label>
              </div>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <select id="slcfrecuenciaParametros" class="form-select" required>
                <option value="0" selected disabled>Seleccione</option>
                <option value="2.4GHZ">2.4GHZ</option>
                <option value="5GHZ">5GHZ</option>
              </select>
              <label for="slcfrecuenciaParametros">Frecuencia</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <select id="slcBaseParametros" class="form-select" required>
                <option value="0" selected disabled>Seleccione</option>
              </select>
              <label for="slcBaseParametros">Base</label>
            </div>
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <select id="slcSubBaseParametros" class="form-select" required>
                <option value="0" selected disabled>Seleccione</option>
              </select>
              <label for="slcSubBaseParametros">Sub-Base</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="text" id="txtSenialParametros" class="form-control" placeholder="Signal Strength" required>
              <label for="txtSenialParametros">Signal Strength</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="text" id="txtNoiseFloorParametros" class="form-control" placeholder="Noise Floor" required>
              <label for="txtNoiseFloorParametros">Noise Floor</label>
            </div>
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <input type="text" id="txtTransmisionParametros" class="form-control" placeholder="Transmit CCQ" required>
              <label for="txtTransmisionParametros">Transmit CCQ</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="text" id="txtTxRateParametros" class="form-control" placeholder="TX Rate" required>
              <label for="txtTxRateParametros">TX Rate</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="text" id="txtRxRateParametros" class="form-control" placeholder="RX Rate" required>
              <label for="txtRxRateParametros">RX Rate</label>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>


<!-- Botón para agregar router -->
<div class="container-fluid px-5 mb-3">
  <button id="btnAgregarRouter" class="btn btn-primary">Agregar Router</button>
</div>

<!-- Contenedor para los routers -->
<div id="routersContainer" class="container-fluid px-5">
  <!-- Los routers se agregarán aquí dinámicamente -->
</div>

<!-- Modal para la configuración del router -->
<div class="modal" id="routerConfigModal" tabindex="-1" aria-labelledby="routerConfigModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header bg-primary">
        <h5 class="modal-title text-white" id="routerConfigModalLabel">Configuración del Router</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="container">
          <!-- Modo Router -->
          <h5 class="mb-3">Modo Router</h5>
          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" id="txtWanRouter" class="form-control" placeholder="WAN" required>
                <label for="txtWanRouter">WAN</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="text" id="txtMascaraRouter" class="form-control" placeholder="Máscara" required>
                <label for="txtMascaraRouter">Máscara</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="text" id="txtPuertaEnlaceRouter" class="form-control" placeholder="Puerta de Enlace" required>
                <label for="txtPuertaEnlaceRouter">Puerta de Enlace</label>
              </div>
            </div>
          </div>
          <div class="row g-2 mb-4">
            <div class="col">
              <div class="form-floating">
                <input type="text" id="txtDns1Router" class="form-control" placeholder="DNS 1" required>
                <label for="txtDns1Router">DNS 1</label>
              </div>
            </div>
            <div class="col">
              <div class="form-floating">
                <input type="text" id="txtDns2Router" class="form-control" placeholder="DNS 2" required>
                <label for="txtDns2Router">DNS 2</label>
              </div>
            </div>
          </div>

          <!-- Configuración de Wireless -->
          <h5 class="mb-3">Configuración Wireless</h5>
          <div class="row g-2 mb-2">
            <div class="col">
              <div class="form-floating">
                <input type="text" id="txtLanWireless" class="form-control" placeholder="LAN" required>
                <label for="txtLanWireless">LAN</label>
              </div>
            </div>
            <div class="col">
              <div class="form-floating">
                <input type="text" id="txtAccesoWireless" class="form-control" placeholder="Acceso" required>
                <label for="txtAccesoWireless">Acceso</label>
              </div>
            </div>
          </div>
          <div class="row g-2 mb-2">
            <div class="col">
              <div class="form-floating">
                <input type="text" id="txtSsidWireless" class="form-control" placeholder="SSID" required>
                <label for="txtSsidWireless">SSID</label>
              </div>
            </div>
            <div class="col">
              <div class="form-floating">
                <input type="text" id="txtSeguridadWireless" class="form-control" placeholder="Seguridad" required>
                <label for="txtSeguridadWireless">Seguridad</label>
              </div>
            </div>
          </div>
          <div class="row g-2 mb-2">
            <div class="col">
              <div class="form-floating">
                <input type="text" id="txtOtrosWireless" class="form-control" placeholder="Otros">
                <label for="txtOtrosWireless">Otros</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" id="saveButton" class="btn btn-success">Guardar Configuración</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
      </div>
    </div>
  </div>
</div>



<!-- Detalle Equipos Venta -->
<div class="container-fluid px-5"> <!-- Ajustamos el contenedor a un tamaño más pequeño -->
  <div class="conteiner">
    <div class="card mb-4">
      <div class="card-header bg-primary">
        <h6 class="card-title text-white">Detalle Equipo Venta</h6>
      </div>

      <div class="card-body">

        <!-- Fila de Costo Antena, Antena y Router -->
        <div class="row mb-2">
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCostoAntenaVenta" placeholder="Costo Antena">
              <label for="txtCostoAntenaVenta">Costo Antena</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="antena-header p-3 text-center border py-3">Antena</div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="router-header p-3 text-center border py-3">Router</div>
          </div>

        </div>

        <!-- Fila de Costo Router, Marca Antena y Marca Router -->
        <div class="row mb-2">
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCostoRouterVenta" placeholder="Costo Router">
              <label for="txtCostoRouterVenta">Costo Router</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" id="txtMarcaVentaAntena" class="form-control" placeholder="Marca">
              <label for="txtMarcaVentaAntena" class="form-label mb-0">Marca</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" id="txtMarcaVentaRouter" class="form-control" placeholder="Marca">
              <label for="txtMarcaVentaRouter" class="form-label mb-0">Marca</label>
            </div>
          </div>
        </div>

        <!-- Fila de SubTotal, Modelo Antena y Modelo Router -->
        <div class="row mb-2">
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtSubTotalVenta" placeholder="SubTotal">
              <label for="txtSubTotalVenta">SubTotal</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" id="txtModeloVentaAntena" placeholder="Modelo" class="form-control">
              <label for="txtModeloVentaAntena">Modelo</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" id="txtModeloVentaRouter" placeholder="Modelo" class="form-control">
              <label for="txtModeloVentaRouter">Modelo</label>
            </div>
          </div>
        </div>

        <!-- Fila de Adelanto, MAC Antena y MAC Router -->
        <div class="row mb-2">
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtAdelantoVenta" placeholder="Adelanto">
              <label for="txtAdelantoVenta">Adelanto</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtMacVentaAntena" placeholder="MAC">
              <label for="txtMacVentaAntena">MAC</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtMacVentaRouter" placeholder="MAC">
              <label for="txtMacVentaRouter">MAC</label>
            </div>
          </div>
        </div>

        <!-- Fila de Saldo Equipos, Descripción Antena y Descripción Router -->
        <div class="row mb-2">
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtSaldoEquipoVenta" placeholder="Saldo Equipos">
              <label for="txtSaldoEquipoVenta">Saldo Equipos</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtDescripcionVentaAntena" placeholder="Descripción">
              <label for="txtDescripcionVentaAntena">Descripción</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtDescripcionVentaRouter" placeholder="Descripción">
              <label for="txtDescripcionVentaRouter">Descripción</label>
            </div>
          </div>
        </div>

        <!-- Fila de Material Adicional -->
        <div class="row mb-2">
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtMaterialAdicionalVenta" placeholder="txtMaterialAdicional">
              <label for="txtMaterialAdicionalVenta">Material Adicional</label>
            </div>
          </div>
          <div class="col-12 col-md-8 mt-1">
            <input type="text" class="form-control py-3">
          </div>
        </div>

        <!-- Condición de pago -->
        <div class="row mb-2">
          <div class="col-12 mt-1">
            <span class="text-primary">Condición Pág.</span>
            <div class="form-check form-check-inline ms-2">
              <input class="form-check-input" type="checkbox" id="chkAdelantadoVenta">
              <label class="form-check-label" for="chkAdelantadoVenta">Adelantado</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="checkbox" id="chkCumpliendoMesVenta">
              <label class="form-check-label" for="chkCumpliendoMesVenta">Cumpliendo el Mes</label>
            </div>
          </div>
        </div>

        <!-- Detalles adicionales -->
        <div class="row">
          <div class="col-12">
            <div class="form-floating">
              <textarea class="form-control" rows="3" id="txtDetalleVenta" placeholder="Detalle"></textarea>
              <label class="form-label" for="txtDetalleVenta">Detalles</label>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<!-- Detalle Equipos Alquilados / Prestados -->
<div class="container-fluid px-5">
  <div class="conteiner">
    <div class="card mb-4">
      <div class="card-header bg-primary">
        <h6 class="card-title text-white">Detalle Equipos Alquilados / Prestados</h6>
      </div>

      <div class="card-body">

        <div class="row mb-2">
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <select class="form-select" id="slcCondicionAlquilados" aria-label="Condición de equipos">
                <option value="" selected disabled>Seleccione</option>
                <option value="Alquilado">Alquilado</option>
                <option value="Prestado">Prestado</option>
              </select>
              <label for="slcCondicionAlquilados">Condición</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="antena-header p-3 text-center border py-3">Antena</div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="router-header p-3 text-center border py-3">Router</div>
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtPeriodoAlquilados" placeholder="Periodo">
              <label for="txtPeriodoAlquilados">Periodo</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" id="txtMarcaAntenaAlquilados" class="form-control" placeholder="Marca">
              <label for="txtMarcaAlquilados" class="form-label mb-0">Marca</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" id="txtMarcaRouterAlquilados" class="form-control" placeholder="Marca">
              <label for="txtMarcaRouterAlquilados" class="form-label mb-0">Marca</label>
            </div>
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="date" class="form-control" id="txtFechaInicioAlquilados" placeholder="Fecha de Inicio" disabled>
              <label for="txtFechaInicioAlquilados">Fecha de Inicio</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" id="txtModeloAntenaAlquilados" placeholder="Modelo" class="form-control">
              <label class="form-label mb-0" id="txtModeloAntenaAlquilados">Modelo</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" id="txtModeloRouterAlquilados" placeholder="Modelo" class="form-control">
              <label class="form-label mb-0" id="txtModeloRouterAlquilados">Modelo</label>
            </div>
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="date" class="form-control" id="txtFechaFinAlquilados" placeholder="Fecha de Fin" disabled>
              <label for="txtFechaFinAlquilados">Fecha de Termino</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtMacAntenaAlquilados" placeholder="MAC">
              <label for="txtMacAntenaAlquilados">MAC</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtMacRouterAlquilados" placeholder="MAC">
              <label for="txtMacRouterAlquilados">MAC</label>
            </div>
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCostoAlquilerAlquilados" placeholder="Costo Alquiler">
              <label for="txtCostoAlquilerAlquilados">Costo Alquiler</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtDescripcionAntenaAlquilados" placeholder="Descripción">
              <label for="txtDescripcionAntenaAlquilados">Descripción</label>
            </div>
          </div>
          <div class="col-12 col-md-4 mt-1">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtDescripcionRouterAlquilados" placeholder="Descripción">
              <label for="txtDescripcionRouterAlquilados">Descripción</label>
            </div>
          </div>
        </div>

        <!-- Condición de Pago -->
        <div class="row mb-2">
          <div class="col-12 mt-1">
            <span class="text-primary">Condición Pág.</span>
            <div class="form-check form-check-inline ms-2">
              <input class="form-check-input" type="checkbox" id="chkAdelantadoAlquilados">
              <label class="form-check-label" for="chkAdelantadoAlquilados">Adelantado</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="checkbox" id="chkCumpliendoAlquilados">
              <label class="form-check-label" for="chkCumpliendoAlquilados">Cumpliendo el Mes</label>
            </div>
          </div>
        </div>

        <!-- Detalles -->
        <div class="row">
          <div class="col-12">
            <div class="form-floating">
              <textarea class="form-control" rows="3" id="txtDetalleAlquilados" placeholder="Detalle"></textarea>
              <label class="form-label" for="txtDetalleAlquilados">Detalles</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones -->
      <div class="row">
        <div class="col-12 text-center text-md-end mb-3 btn-container">
          <button type="button" id="btnGuardar" class="btn btn-success px-4 py-2">Guardar</button>
          <button type="button" id="btnCancelar" class="btn btn-outline-secondary px-4 py-2">Cancelar</button>
        </div>
      </div>


    </div>
  </div>
</div>




<script>
  const idContrato = <?= $idContrato ?>;
</script>
<!-- <script>
 document.addEventListener("DOMContentLoaded", function () {
  let routerCount = 0; 
  const btnAgregarRouter = document.getElementById("btnAgregarRouter");
  const routersContainer = document.getElementById("routersContainer");
  const configFormContainer = document.getElementById("configFormContainer");
  const saveButton = document.getElementById("saveButton");
  const routerConfigCard = document.getElementById("routerConfigCard");

  function actualizarContador() {
    if (routersContainer.children.length === 0) {
      routerCount = 0; 
    }
  }

  function agregarRouter() {
    routerCount++; 
    const routerNumberSpan = routerConfigCard.querySelector(".router-number");
    routerNumberSpan.textContent = routerCount;
    configFormContainer.style.display = "block"; 
    saveButton.style.display = "inline-block";

    limpiarCampos();

    saveButton.onclick = function () {
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
        actualizarContador();
      });

      routerCard.querySelector(".card-body").appendChild(deleteButton);
      routersContainer.appendChild(routerCard);

      configFormContainer.style.display = "none";
      saveButton.style.display = "none"; 
    };
  }

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

  btnAgregarRouter.addEventListener("click", agregarRouter);
});


</script> -->
<script src="../../js/FichaTecnicaWisp.js" type="module"></script>
</body>

</html>
<?php require_once "../../footer.php"; ?>