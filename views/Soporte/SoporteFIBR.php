<?php require_once '../../header.php'; ?>

<div class="container-fluid px-4">
  <h1 class="mt-4">Control de Averías GPON</h1>

  <div class="row g-3 mb-2">
    <div class="row g-3 mb-2">
      <div class="col md-6">
        <input type="number" class="form-control" id="txtNumFicha" placeholder="N°" disabled>
      </div>
      <div class="col md-6">
        <input type="date" class="form-control" id="txtFecha" placeholder="Fecha" disabled>
      </div>
    </div>
  </div>

  <br>

  <div class="card mb-4">
    <div class="card-header">
      Complete los Datos
    </div>
    <div class="card-body">
      <form action="" id="frm-registro-gpon" autocomplete="off">

        <!-- Primera Fila -->
        <h5>Datos del Usuario</h5>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <label>Número Identificador</label>
            <div class="input-group">
              <input type="text" class="form-control" maxlength="12" minlength="8" id="txtNrodocumento" disabled>
            </div>
          </div>

          <div class="col-md">
            <label>Cliente</label>
            <input type="text" class="form-control" id="txtCliente" disabled>
          </div>

          <div class="col-md">
            <label>Plan</label>
            <input type="text" class="form-control" id="txtPlan" disabled>
          </div>

        </div> <!-- Fin de la Primera Fila -->

        <hr>

        <!-- Segunda Fila -->
        <h5>Parámetros Técnicos</h5>
        <div class="row g-2 mb-2">

          <div class="col-md">
            <label>PPPoE</label>
            <input type="text" class="form-control" id="txtPppoe" required>
          </div>

          <div class="col-md">
            <label>Potencia</label>
            <input type="number" class="form-control" id="txtPotenciaDos" required>
          </div>

          <div class="col md-6 form-check form-switch d-flex align-items-center">
            <input class="form-check-input ms-5" type="checkbox" id="chkCatv">
            <label class="form-check-label" for="chkCatv">CATV</label>
          </div>

        </div> <!-- Fin de la Segunda Fila -->

        <!-- Tercera Fila -->
        <div class="row g-2 mb-2">

          <div class="col-md">
            <label>Clave</label>
            <input type="text" class="form-control" id="txtClave" required>
          </div>

          <div class="col-md">
            <label>VLAN</label>
            <input type="number" class="form-control" id="txtVlan" required>
          </div>

          <div class="col-md">
            <label>Potencia</label>
            <input type="number" class="form-control" id="txtPotencia" required>
          </div> <!-- Fin de Tercera Fila -->

        </div>

        <!-- Cuarta Fila -->
        <div class="row g-2 mb-2">

          <div class="col-md">
            <label>SSID</label>
            <input type="text" class="form-control" id="txtSsid" required>
          </div>

          <div class="col-md">
            <label>Password</label>
            <input type="text" class="form-control" id="txtPass" required>
          </div>

          <div class="col-md">
            <label>Otros</label>
            <input type="text" class="form-control" id="txtOtros" required>
          </div>

        </div>
        <div>
          <div class="col-md">
            <label>Estado Inicial</label>
            <textarea type="text" class="form-control" id="txtaEstadoInicial" style="height: 100px" required></textarea>
          </div>
        </div> <!-- Fin de Cuarta Fila -->

        <hr>

        <!-- Cambios Técnicos -->
        <!-- Primera Fila -->
        <h5>Cambios Técnicos GPON</h5>
        <div class="row g-2 mb-2">

          <div class="col-md">
            <label>PPPoE</label>
            <input type="text" class="form-control" id="txtCambiosPppoe" required>
          </div>

          <div class="col-md">
            <label>Potencia</label>
            <input type="number" class="form-control" id="txtCambiosPotenciaDos" required>
          </div>

          <div class="col-md">
            <label>CATV</label>
            <input type="text" class="form-control" id="txtCambiosCatv" placeholder="SI/NO" required>
          </div>
          <div class="col md-6 form-check form-switch d-flex align-items-center">
            <input class="form-check-input ms-5" type="checkbox" id="chkCambiosCatv">
            <label class="form-check-label" for="chkCambiosCatv">CATV</label>
          </div>

        </div> <!-- Fin de la Primera Fila -->

        <!-- Segunda Fila -->
        <div class="row g-2 mb-2">

          <div class="col-md">
            <label>Clave</label>
            <input type="text" class="form-control" id="txtCambiosClave" required>
          </div>

          <div class="col-md">
            <label>VLAN</label>
            <input type="number" class="form-control" id="txtCambiosVlan" required>
          </div>

          <div class="col-md">
            <label>Potencia</label>
            <input type="number" class="form-control" id="txtCambiosPotencia" required>
          </div> <!-- Fin de la Segunda Fila -->

        </div>

        <!-- Tercera Fila -->
        <div class="row g-2 mb-2">

          <div class="col-md">
            <label>SSID</label>
            <input type="text" class="form-control" id="txtCambiosSsid" required>
          </div>

          <div class="col-md">
            <label>Password</label>
            <input type="text" class="form-control" id="txtCambiosPass" required>
          </div>

          <div class="col-md">
            <label>Otros</label>
            <input type="text" class="form-control" id="txtCambiosOtros" required>
          </div>

        </div>

        <div>
          <div class="col-md">
            <label>Procedimiento de Solución</label>
            <textarea type="text" class="form-control" id="txtaCambiosProceSolucion" style="height: 100px" required></textarea>
          </div>
        </div> <!-- Fin de la Tercera Fila -->

      </form>
    </div>
  </div>
</div>
<?php require_once "../../footer.php"; ?>

<script type="module" src="../../js/SoporteFibr.js"></script>
</body>

</html>