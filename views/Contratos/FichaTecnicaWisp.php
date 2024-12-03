<?php require_once "../../header.php"; ?>

<?php
$idContrato = $_GET['idContrato'];
?>

<link rel="stylesheet" href="../../css/fichaWisp.css">

<!-- Datos del Usuario -->
<div class="container-fluid px-5">
  <div class="form-container mt-3">
    <h1 class="mt-4"><i class="fas fa-file-alt"></i> Formulario de Registro de Ficha de Wisp</h1>

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
        <div class="card-header">
          <h6 class="card-title text-white">Datos del Cliente</h6>
        </div>
        <div class="card-body">
          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCliente" placeholder="Cliente"
                  disabled>
                <label for="txtCliente">Cliente</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtPaquete" placeholder="Paquete"
                  disabled>
                <label for="txtPaquete">Paquete</label>
              </div>
            </div>
            <div class="col-md input-group">
              <span class="input-group-text">S/.</span>
              <div class="form-floating">
                <input type="text" class="form-control" id="txtPrecio" placeholder="Precio"
                  disabled>
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
      <div class="card-header">
        <h6 class="card-title text-white">Parámetros Técnicos</h6>
      </div>
      <div class="card-body">

        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <select id="slcFrecuenciaParametros" class="form-select" required>
                <option value="0" selected disabled>Seleccione</option>
                <option value="2.4GHZ">2.4GHZ</option>
                <option value="5GHZ">5GHZ</option>
              </select>
              <label for="slcFrecuenciaParametros">Frecuencia</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <select id="slcBaseParametros" class="form-select select2me" required>
                <option value="0" selected disabled>Seleccione</option>
              </select>
              <label for="slcBaseParametros">Base</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <select id="slcSubBaseParametros" class="form-select select2me" required>
                <option value="0" selected disabled>Seleccione</option>
              </select>
              <label for="slcSubBaseParametros">Sub-Base</label>
            </div>
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div class="col-md input-group">
            <div class="form-floating">
              <input type="number" id="txtSignalStrengthParametros" class="form-control"
                placeholder="Signal Strength" required min="-90" max="-20">
              <label for="txtSignalStrengthParametros">Signal Strength</label>
            </div>
            <span class="input-group-text">dBm</span>
          </div>
          <div class="col-md input-group">
            <div class="form-floating">
              <input type="number" id="txtNoiseFloorParametros" class="form-control"
                placeholder="Noise Floor" required min="-100" max="-30">
              <label for="txtNoiseFloorParametros">Noise Floor</label>
            </div>
            <span class="input-group-text">dBm</span>
          </div>
          <div class="col-md input-group">
            <div class="form-floating">
              <input type="number" id="txtTransmiTccqParametros" class="form-control"
                placeholder="Transmit CCQ" required min="40" max="100">
              <label for="txtTransmiTccqParametros">Transmit CCQ</label>
            </div>
            <span class="input-group-text">%</span>
          </div>
        </div>

        <div class="row g-2 mb-2">

          <div class="col-md">
            <div class="form-floating">
              <input type="number" id="txtTxRateParametros" class="form-control" placeholder="TX Rate"
                required min="20.00" max="90.00" step="0.01">
              <label for="txtTxRateParametros">TX Rate</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="number" id="txtRxRateParametros" class="form-control" placeholder="RX Rate"
                required min="20.00" max="90.00" step="0.01">
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
  <div class="row"></div>
</div>

<!-- Modal para la configuración del router -->
<div class="modal" id="routerConfigModal" tabindex="-1" aria-labelledby="routerConfigModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header card-header">
        <h5 class="modal-title" id="routerConfigModalLabel">Configuración del Router</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="container">
          <!-- Modo Router -->
          <h5 class="mb-3">Modo Router</h5>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" id="txtCodigoBarraRouter" class="form-control" value="" placeholder="Código de Barra" required>
                <label for="txtCodigoBarraRouter">Código de Barra</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="text" id="txtModeloRouter" class="form-control" value="" placeholder="Modelo" disabled>
                <label for="txtModeloRouter">Modelo</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="text" id="txtMarcaRouter" class="form-control" value="" placeholder="MARCA" disabled>
                <label for="txtMarcaRouter">Marca</label>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" id="txtWanRouter" class="form-control" value="172.16.16.159"
                  placeholder="WAN" required>
                <label for="txtWanRouter">WAN</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="text" id="txtMascaraRouter" class="form-control" value="255.255.255.0"
                  placeholder="Máscara" required>
                <label for="txtMascaraRouter">Máscara</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="text" id="txtPuertaEnlaceRouter" class="form-control"
                  value="172.16.16.1" placeholder="Puerta de Enlace" required>
                <label for="txtPuertaEnlaceRouter">Puerta de Enlace</label>
              </div>
            </div>
          </div>
          <div class="row g-2 mb-4">
            <div class="col">
              <div class="form-floating">
                <input type="text" id="txtDns1Router" class="form-control" placeholder="DNS 1"
                  value="8.8.8.8" required>
                <label for="txtDns1Router">DNS 1</label>
              </div>
            </div>
            <div class="col">
              <div class="form-floating">
                <input type="text" id="txtDns2Router" class="form-control" placeholder="DNS 2"
                  value="8.8.4.4" required>
                <label for="txtDns2Router">DNS 2</label>
              </div>
            </div>
          </div>


          <!-- Configuración de Wireless -->
          <h5 class="mb-3">Configuración Wireless</h5>
          <div class="row g-2 mb-2">
            <div class="col">
              <div class="form-floating">
                <input type="text" id="txtLanWireless" value="192.168.10.1" class="form-control"
                  placeholder="LAN" required>
                <label for="txtLanWireless">LAN</label>
              </div>
            </div>
            <div class="col">
              <div class="form-floating">
                <input type="text" id="txtAccesoWireless" class="form-control" placeholder="Acceso"
                  required>
                <label for="txtAccesoWireless">Acceso</label>
              </div>
            </div>
          </div>
          <div class="row g-2 mb-2">
            <div class="col">
              <div class="form-floating">
                <input type="text" id="txtSsidWireless" class="form-control" placeholder="SSID"
                  required>
                <label for="txtSsidWireless">SSID</label>
              </div>
            </div>
            <div class="col">
              <div class="form-floating">
                <input type="text" id="txtSeguridadWireless" class="form-control"
                  placeholder="Seguridad" required>
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

<!-- Selección de Venta o Alquilado -->
<div class="container-fluid px-5">
  <div class="conteiner">
    <div class="card mb-4">
      <div class="card-header">
        <h6 class="card-title text-white">Seleccionar tipo de operación</h6>
      </div>
      <div class="card-body">
        <!-- Select para elegir tipo de operación -->
        <div class="row g-2 mb-2">
          <div class="col-12">
            <div class="form-floating">
              <select class="form-select" id="slcOperacion" aria-label="Seleccione operación">
                <option value="" selected disabled>Seleccione una opción</option>
                <option value="venta">Venta de Equipos</option>
                <option value="alquiler">Alquiler de Equipos</option>
              </select>
              <label for="slcOperacion">Tipo de Operación</label>
            </div>
          </div>
        </div>

        <!-- Sección de Venta de Equipos (oculta inicialmente) -->
        <form id="frmVenta" class="hidden">
          <h4 class="ms-3">Detalle Equipo Venta</h4>
          <div class="card-body">

            <!-- Fila de Costo Antena, Antena y Router -->
            <div class="row mb-2">
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCostoAntenaVenta"
                    placeholder="Costo Antena" disabled>
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
                  <input type="text" min="0" class="form-control" id="txtCostoRouterVenta"
                    placeholder="Costo Router" disabled>
                  <label for="txtCostoRouterVenta">Costo Router</label>
                </div>
              </div>

              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtMacVentaRouter"
                    placeholder="MAC">
                  <label for="txtMacVentaRouter">MAC</label>
                </div>
              </div>

              <div class="col-12 col-md-4 mt-1">
                <div class="input-group">
                  <div class="form-floating flex-fill">
                    <input type="text" class="form-control" id="txtMacVentaAntena"
                      placeholder="MAC">
                    <label for="txtMacVentaAntena">MAC</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fila de SubTotal, Modelo Antena y Modelo Router -->
            <div class="row mb-2">
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" min="0" class="form-control" id="txtSubTotalVenta"
                    placeholder="SubTotal" disabled>
                  <label for="txtSubTotalVenta">SubTotal</label>
                </div>
              </div>

              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" id="txtMarcaVentaAntena" class="form-control"
                    placeholder="Marca" disabled>
                  <label for="txtMarcaVentaAntena" class="form-label mb-0">Marca</label>
                </div>
              </div>

              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" id="txtMarcaVentaRouter" class="form-control"
                    placeholder="Marca" disabled>
                  <label for="txtMarcaVentaRouter" class="form-label mb-0">Marca</label>
                </div>
              </div>
            </div>

            <!-- Fila de Adelanto, MAC Antena y MAC Router -->
            <div class="row mb-2">
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" min="0" class="form-control" id="txtAdelantoVenta"
                    placeholder="Adelanto">
                  <label for="txtAdelantoVenta">Adelanto</label>
                </div>
              </div>

              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" id="txtModeloVentaAntena" placeholder="Modelo"
                    class="form-control" disabled>
                  <label for="txtModeloVentaAntena">Modelo</label>
                </div>
              </div>
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" id="txtModeloVentaRouter" placeholder="Modelo"
                    class="form-control" disabled>
                  <label for="txtModeloVentaRouter">Modelo</label>
                </div>
              </div>
            </div>

            <!-- Fila de Saldo Equipos, Descripción Antena y Descripción Router -->
            <div class="row mb-2">
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" min="0" class="form-control" id="txtSaldoEquipoVenta"
                    placeholder="Saldo Equipos">
                  <label for="txtSaldoEquipoVenta">Saldo Equipos</label>
                </div>
              </div>
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtSerialVentaRouter"
                    placeholder="Serial">
                  <label for="txtSerialVentaRouter">Serial</label>
                </div>
              </div>
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtSerialVentaAntena"
                    placeholder="Serial">
                  <label for="txtSerialVentaAntena">Serial</label>
                </div>
              </div>
            </div>

            <!-- Fila de Material Adicional -->
            <div class="row mb-2">
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" min="0" class="form-control" id="txtMaterialAdicionalVenta"
                    placeholder="Material Adicional">
                  <label for="txtMaterialAdicionalVenta">Material Adicional</label>
                </div>
              </div>
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtDescripcionVentaAntena"
                    placeholder="Descripción">
                  <label for="txtDescripcionVentaAntena">Descripción</label>
                </div>
              </div>
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtDescripcionVentaRouter"
                    placeholder="Descripción">
                  <label for="txtDescripcionVentaRouter">Descripción</label>
                </div>
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
                  <label class="form-check-label" for="chkCumpliendoMesVenta">Cumpliendo el
                    Mes</label>
                </div>
              </div>
            </div>

            <!-- Detalles adicionales -->
            <div class="row">
              <div class="col-12">
                <div class="form-floating">
                  <textarea class="form-control" rows="3" id="txtDetalleVenta"
                    placeholder="Detalle"></textarea>
                  <label class="form-label" for="txtDetalleVenta">Detalles</label>
                </div>
              </div>
            </div>

          </div>
        </form>


        <!-- Sección de Alquiler de Equipos (oculta inicialmente) -->
        <form id="frmAlquiler" class="hidden">
          <h4 class="ms-3">Detalle Equipos Alquilados / Prestados</h4>
          <div class="card-body">

            <div class="row mb-2">
              <div class="col-12 col-md-4 mt-1"></div>
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
                  <select class="form-select" id="slcCondicionAlquilados" aria-label="Condición de equipos">
                    <option value="" selected disabled>Seleccione</option>
                    <option value="Alquilado">Alquilado</option>
                    <option value="Prestado">Prestado</option>
                  </select>
                  <label for="slcCondicionAlquilados">Condición</label>
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
                  <input type="text" class="form-control" id="txtPeriodoAlquilados" placeholder="Periodo">
                  <label for="txtPeriodoAlquilados">Periodo</label>
                </div>
              </div>
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" id="txtMarcaAntenaAlquilados" class="form-control" placeholder="Marca" disabled>
                  <label for="txtMarcaAntenaAlquilados" class="form-label mb-0">Marca</label>
                </div>
              </div>
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" id="txtMarcaRouterAlquilados" class="form-control" placeholder="Marca" disabled>
                  <label for="txtMarcaRouterAlquilados" class="form-label mb-0">Marca</label>
                </div>
              </div>
            </div>

            <div class="row mb-2">
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="date" class="form-control" id="txtFechaInicioAlquilados" placeholder="Fecha de Inicio">
                  <label for="txtFechaInicioAlquilados">Fecha de Inicio</label>
                </div>
              </div>
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" id="txtModeloAntenaAlquilados" placeholder="Modelo" class="form-control" disabled>
                  <label for="txtModeloAntenaAlquilados" class="form-label mb-0">Modelo</label>
                </div>
              </div>
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" id="txtModeloRouterAlquilados" placeholder="Modelo" class="form-control" disabled>
                  <label for="txtModeloRouterAlquilados" class="form-label mb-0">Modelo</label>
                </div>
              </div>
            </div>

            <div class="row mb-2">
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="date" class="form-control" id="txtFechaFinAlquilados" placeholder="Fecha de Fin">
                  <label for="txtFechaFinAlquilados">Fecha de Termino</label>
                </div>
              </div>
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtSerialAntenaAlquilados" placeholder="Serial">
                  <label for="txtSerialAntenaAlquilados">Serial</label>
                </div>
              </div>
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtSerialRouterAlquilados" placeholder="Serial">
                  <label for="txtSerialRouterAlquilados">Serial</label>
                </div>
              </div>
            </div>

            <div class="row mb-2">
              <div class="col-12 col-md-4 mt-1">
                <div class="form-floating">
                  <input type="text" class="form-control" min="0" id="txtCostoAlquilerAlquilados" placeholder="Costo Alquiler">
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
                  <input class="form-check-input" type="checkbox" id="chkCumpliendoMesAlquilados">
                  <label class="form-check-label" for="chkCumpliendoMesAlquilados">Cumpliendo el Mes</label>
                </div>
              </div>
            </div>

            <!-- Detalles -->
            <div class="row">
              <div class="col-12">
                <div class="form-floating">
                  <textarea class="form-control" rows="3" id="txtDetalleAlquilados" placeholder="Detalles"></textarea>
                  <label for="txtDetalleAlquilados">Detalles</label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="container-fluid px-5">
  <div class="conteiner">
    <div class="card mb-4">
      <div class="card-header">
        <h6 class="card-title text-white">Deuda</h6>
      </div>
      <div class="card-body">
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtPagoServicio"
                placeholder="Pago Servicio" min="0" step="0.01" value="0.00">
              <label for="txtPagoServicio">Pago Servicio</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtAdelantoEquipo"
                placeholder="Adelanto Equipo" min="0" step="0.01" value="0.00">
              <label for="txtAdelantoEquipo">Adelanto Equipo</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtCostoAlquiler" placeholder="Anticipo"
                min="0" step="0.01" value="0.00" >
              <label for="txtCostoAlquiler">Costo de Alquiler</label>
            </div>
          </div>
        </div>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtMaterialAdicional"
                placeholder="Material Adicional" min="0" step="0.01" value="0.00" >
              <label for="txtMaterialAdicional">Material Adicional</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtTotalCancelado"
                placeholder="Total Cancelado" min="0" step="0.01" value="0.00">
              <label for="txtTotalCancelado">Total Cancelado</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtSaldoPendiente"
                placeholder="Saldo Pendiente" min="0" step="0.01" value="0.00">
              <label for="txtSaldoPendiente">Saldo Pendiente</label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="form-floating">
              <textarea class="form-control" id="txtDetalleDeuda" placeholder="Detalles"></textarea>
              <label for="txtDetalleDeuda">Detalles</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Botones -->
    <div class="row">
      <div class="col-12 mb-3 btn-container">
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <button type="button" id="btnReporte" class="btn btn-info px-4 py-2 mb-2 mb-md-0">
            <i class="fas fa-file-alt"></i> Generar Reporte
          </button>
          <button type="button" id="btnRegistrar" class="btn btn-success px-4 py-2 mb-2 mb-md-0">
            <i class="fas fa-save"></i> Guardar
          </button>
          <button type="button" id="btnCancelar" class="btn btn-outline-secondary px-4 py-2 mb-2 mb-md-0">
            <i class="fas fa-times"></i> Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</div>


<script>
  const idContrato = <?= $idContrato ?>;
</script>
<script src="../../js/FichaTecnicaWisp.js" type="module"></script>
</body>

</html>
<?php require_once "../../footer.php"; ?>