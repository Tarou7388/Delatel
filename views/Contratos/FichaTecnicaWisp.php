<?php require_once "../../header.php"; ?>

<?php
$idContrato = $_GET['idContrato'];
?>

<div class="container-fluid px-4">
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
        <div class="card-header">
          <h6 class="card-title">Wisp</h6>
        </div>
        <div class="card-body">
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCliente" placeholder="Cliente" disabled>
                <label for="txtCliente">Cliente</label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtPaquete" placeholder="Paquete" disabled>
                <label for="txtPaquete">Paquete</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Parametros Tecnicos -->
<div class="container-fluid px-4">
  <div class="conteiner">
    <div class="card mb-4">
      <div class="card-header">
        <h6 class="card-title">Parámetros Técnicos</h6>
      </div>
      <div class="card-body">
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-group">
              <div class="form-floating">
                <select id="slcRouter" class="form-control" required>
                  <option value="">Seleccione un equipo</option>
                  <option value="1">Equipo 1</option>
                  <option value="2">Equipo 2</option>
                  <option value="3">Equipo 3</option>
                </select>
                <label for="slcRouter">Router :</label>
              </div>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <select id="slcfrecuencia" class="form-control" required>
                <option value="">Seleccione un equipo</option>
                <option value="1">Equipo 1</option>
                <option value="2">Equipo 2</option>
                <option value="3">Equipo 3</option>
              </select>
              <label for="slcfrecuencia">Frecuencia:</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <select id="slcBase" class="form-control" required>
                <option value="">Seleccione un equipo</option>
                <option value="1">base 1</option>
                <option value="2">base 2</option>
                <option value="3">base 3</option>
              </select>
              <label for="slcBase">Base:</label>
            </div>
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <select id="slcSubBase" class="form-control" required>
                <option value="">Seleccione un equipo</option>
                <option value="1">subbase 1</option>
                <option value="2">subbase 2</option>
                <option value="3">subbase 3</option>
              </select>
              <label for="slcSubBase">Sub-Base:</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="text" id="txtSignalStrength" class="form-control" placeholder="asd" required>
              <label for="txtSignalStrength">Signal Strength:</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="text" id="txtNoiseFloor" class="form-control" placeholder="asda" required>
              <label for="txtNoiseFloor">Noise Floor:</label>
            </div>
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <input type="text" id="txtTransmiTccq" class="form-control" placeholder="asd" required>
              <label for="txtTransmiTccq">Transmit CCQ:</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="text" id="txtTxrxRate" class="form-control" placeholder="adas" required>
              <label for="txtTxrxRate">TX/RX Rate:</label>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<!-- Modo Router -->
<div class="container-fluid px-4">
  <div class="conteiner">
    <div class="card mb-4">
      <div class="card-header">
        <h6 class="card-title">Modo Router</h6>
      </div>
      <div class="card-body">
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <input type="text" id="txtWan" class="form-control" placeholder="asa" required>
              <label for="txtWan">WAN:</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" id="txtMascara" class="form-control" placeholder="asda" required>
              <label for="txtMascara">Máscara:</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" id="txtPuertaEnlace" class="form-control" placeholder="asda" required>
              <label for="txtPuertaEnlace">Puerta de Enlace:</label>
            </div>
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div class="col">
            <div class="form-floating">
              <input type="text" id="txtDns1" class="form-control" placeholder="asdad" required>
              <label for="txtDns1">DNS 1:</label>
            </div>
          </div>
          <div class="col">
            <div class="form-floating">
              <input type="text" id="txtDns2" class="form-control" placeholder="asdad">
              <label for="txtDns2">DNS 2:</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Configuración de Wireless -->
<div class="container-fluid px-4">
  <div class="conteiner">
    <div class="card mb-4">
      <div class="card-header">
        <h6 class="card-title">Conf. Wireless</h6>
      </div>
      <div class="card-body">
        <div class="row g-2 mb-2">
          <div class="col">
            <div class="form-floating">
              <input type="text" id="txtLan" class="form-control" placeholder="asdsad" required>
              <label for="txtLan">LAN:</label>
            </div>
          </div>
          <div class="col">
            <div class="form-floating">
              <input type="text" id="txtAcceso" class="form-control" placeholder="asdads" required>
              <label for="txtAcceso">Acceso:</label>
            </div>
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div class="col">
            <div class="form-floating">
              <input type="text" id="txtSsid" class="form-control" placeholder="asda" required>
              <label for="txtSsid">SSID:</label>
            </div>
          </div>
          <div class="col">
            <div class="form-floating">
              <input type="text" id="txtSeguridad" class="form-control" placeholder="asda" required>
              <label for="txtSeguridad">Seguridad:</label>
            </div>
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div class="col">
            <div class="form-floating">
              <input type="text" id="txtOtros" class="form-control" placeholder="asad">
              <label for="txtOtros">Otros:</label>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<!-- Detalle Equipos Venta -->
<div class="container-fluid px-4">
  <div class="conteiner">
    <div class="row mb-2 align-items-center">
      <div class="col-3 col-md-2">Costo Antena</div>
      <div class="col-3 col-md-2">
        <input type="text" class="form-control cost-input border-dark" value="290.00">
      </div>
      <div class="col-3 col-md-4">
        <div class="antena-header p-1 text-center border">Antena</div>
      </div>
      <div class="col-3 col-md-4">
        <div class="router-header p-1 text-center border">Router</div>
      </div>
    </div>

    <div class="row mb-2 align-items-center">
      <div class="col-3 col-md-2">Costo router</div>
      <div class="col-3 col-md-2">
        <input type="text" class="form-control cost-input border-dark" value="80.00">
      </div>
      <div class="col-3 col-md-4">
        <div class="form-floating">
          <input type="text" id="txtMarca" class="form-control border-dark" placeholder="Marca">
          <label for="txtMarca" class="form-label mb-0">Marca</label>
        </div>
      </div>
      <div class="col-3 col-md-4">
        <div class="form-floating">
          <input type="text" id="txtMarca" class="form-control border-dark" placeholder="Marca">
          <label for="txtMarca" class="form-label mb-0">Marca</label>
        </div>
      </div>
    </div>

    <div class="row mb-2 align-items-center">
      <div class="col-3 col-md-2">SubTotal</div>
      <div class="col-3 col-md-2">
        <input type="text" class="form-control cost-input border-dark" value="370.00" readonly>
      </div>
      <div class="col-3 col-md-4">
        <div class="form-floating">
          <input type="text" id="txtModelo" placeholder="Modelo" class="form-control border-dark">
          <label class="form-label mb-0" id="txtModelo">Modelo</label>
        </div>
      </div>
      <div class="col-3 col-md-4">
        <div class="form-floating">
          <input type="text" id="txtModelo" placeholder="Modelo" class="form-control border-dark">
          <label class="form-label mb-0" id="txtModelo">Modelo</label>
        </div>
      </div>
    </div>

    <div class="row mb-2 align-items-center">
      <div class="col-3 col-md-2">Adelanto</div>
      <div class="col-3 col-md-2">
        <input type="text" class="form-control cost-input border-dark" value="200">
      </div>
      <div class="col-3 col-md-4">
        <div class="form-floating">
          <input type="text" class="form-control border-dark" id="txtMac" placeholder="MAC">
          <label class="form-label mb-0">MAC</label>
        </div>
      </div>
      <div class="col-3 col-md-4">
        <div class="form-floating">
          <input type="text" class="form-control border-dark" id="txtMac" placeholder="MAC">
          <label class="form-label mb-0">MAC</label>
        </div>
      </div>
    </div>

    <div class="row mb-2 align-items-center">
      <div class="col-3 col-md-2">Saldo Equipos</div>
      <div class="col-3 col-md-2">
        <input type="text" class="form-control cost-input border-dark" value="170.00" readonly>
      </div>
      <div class="col-3 col-md-4">
        <div class="form-floating">
          <input type="text" class="form-control border-dark" id="txtDescripcion" placeholder="Descripción">
          <label class="form-label mb-0">Descripción</label>
        </div>
      </div>
      <div class="col-3 col-md-4">
        <div class="form-floating">
          <input type="text" class="form-control border-dark" id="txtDescripcion" placeholder="Descripción">
          <label class="form-label mb-0">Descripción</label>
        </div>
      </div>
    </div>

    <div class="row mb-2 align-items-center">
      <div class="col-3 col-md-2 material-adicional">Material Adicional</div>
      <div class="col-3 col-md-2">
        <input type="text" class="form-control cost-input border-dark" value="35">
      </div>
      <div class="col-6 col-md-8">
        <input type="text" class="form-control border-dark">
      </div>
    </div>

    <div class="row mb-2">
      <div class="col-12">
        <span class="text-primary">CONDICION PAG</span>
        <div class="form-check form-check-inline ms-2">
          <input class="form-check-input" type="checkbox" id="adelantado">
          <label class="form-check-label" for="adelantado">ADELANTADO</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="cumpliendo">
          <label class="form-check-label" for="cumpliendo">CUMPLIENDO EL MES</label>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="form-floating">
          <textarea class="form-control border-dark" rows="3" id="txtDetalle" placeholder="Detalle"></textarea>
          <label class="form-label text-primary" for="txtDetalle">DETALLES</label>
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