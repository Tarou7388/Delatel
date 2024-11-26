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
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" maxlength="12" minlength="8" id="txtNrodocumento" placeholder="a" disabled>
                <label>Número Identificador</label>
              </div>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCliente" placeholder="a" disabled>
              <label>Cliente</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtPlan" placeholder="a" disabled>
              <label>Plan</label>
            </div>
          </div>

        </div> <!-- Fin de la Primera Fila -->

        <hr>

        <!-- Segunda Fila -->
        <h5>Parámetros Técnicos</h5>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtPppoe" placeholder="a" required>
              <label for="txtPppoe">PPPoE</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtPotenciaDos" placeholder="a" required>
              <label for="txtPotenciaDos">Potencia</label>
            </div>
          </div>

          <div class="col-md d-flex align-items-center">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="chkCatv">
              <label class="form-check-label" for="chkCatv">CATV</label>
            </div>
          </div>
        </div>
        <!-- Fin de la Segunda Fila -->

        <!-- Tercera Fila -->
        <div class="row g-2 mb-2">

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtClave" placeholder="A" required>
              <label>Clave</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtVlan" placeholder="A" required>
              <label>VLAN</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtPotencia" placeholder="A" required>
              <label>Potencia</label>
            </div>
          </div> <!-- Fin de Tercera Fila -->

        </div>

        <!-- Cuarta Fila -->
        <div class="row g-2 mb-2">

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtSsid" placeholder="A" required>
              <label>SSID</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtPass" placeholder="A" required>
              <label>Password</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtOtros" placeholder="A" required>
              <label>Otros</label>
            </div>
          </div>

        </div>
        <div>
          <div class="col-md">
            <div class="form-floating">
              <textarea type="text" class="form-control" id="txtaEstadoInicial" style="height: 100px" placeholder="A" required></textarea>
              <label>Estado Inicial</label>
            </div>
          </div>
        </div> <!-- Fin de Cuarta Fila -->

        <hr>

        <!-- Cambios Técnicos -->
        <!-- Primera Fila -->
        <h5>Cambios Técnicos GPON</h5>
        <div class="row g-2 mb-2">

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCambiosPppoe" placeholder="A" required>
              <label>PPPoE</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtCambiosPotenciaDos" placeholder="A" required>
              <label>Potencia</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCambiosCatv" placeholder="SI/NO" required>
              <label>CATV</label>
            </div>
          </div>
          <div class="col md-6 form-check form-switch d-flex align-items-center">
            <input class="form-check-input ms-5" type="checkbox" id="chkCambiosCatv">
            <label class="form-check-label" for="chkCambiosCatv">CATV</label>
          </div>

        </div> <!-- Fin de la Primera Fila -->

        <!-- Segunda Fila -->
        <div class="row g-2 mb-2">

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCambiosClave" placeholder="A" required>
              <label>Clave</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtCambiosVlan" placeholder="A" required>
              <label>VLAN</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtCambiosPotencia" placeholder="A" required>
              <label>Potencia</label>
            </div>
          </div> <!-- Fin de la Segunda Fila -->

        </div>

        <!-- Tercera Fila -->
        <div class="row g-2 mb-2">

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCambiosSsid" placeholder="A" required>
              <label>SSID</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCambiosPass" placeholder="A" required>
              <label>Password</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCambiosOtros" placeholder="A" required>
              <label>Otros</label>
            </div>
          </div>

        </div>

        <div>
          <div class="col-md">
            <div class="form-floating">
              <textarea type="text" class="form-control" id="txtaCambiosProceSolucion" style="height: 100px" placeholder="A" required></textarea>
              <label>Procedimiento de Solución</label>
            </div>
          </div>
        </div> <!-- Fin de la Tercera Fila -->

      </form>
    </div>
  </div>
</div>
<?php require_once "../../footer.php"; ?>

<script type="module" src="../../js/SoporteGPON.js"></script>
</body>

</html>