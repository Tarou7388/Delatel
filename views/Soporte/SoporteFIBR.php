<?php require_once '../../header.php'; ?>

<div class="container-fluid px-4">
  <h1 class="mt-4">Control de Averías Fibra</h1>

  <br>

  <div class="card mb-4">
    <div class="card-header">
      Complete los Datos
    </div>
    <div class="card-body">
      <form action="" id="frm-registro-fibr" autocomplete="off">

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
        <h4 class="mb-4">Parámetros Técnicos de Fibra</h4>

        <div class="row g-3 mb-3 align-items-center">
          <div class="col-md">
            <div class="form-floating">
              <select id="slcCaja" class="form-select">
                <option value="" disabled selected>Seleccione una opción</option>
              </select>
              <label for="slcCaja">Caja</label>
            </div>
          </div>
        </div>

        <div class="">
          <!-- Primera Fila -->
          <div class="row g-3 mb-3 align-items-center">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtPppoe" placeholder="PPPoE" disabled required>
                <label for="txtPppoe">PPPoE</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtClave" placeholder="Clave" disabled required>
                <label for="txtClave">Clave</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtPotencia" placeholder="Potencia" disabled required>
                <label for="txtPotencia">Potencia</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtVlan" placeholder="VLAN" disabled required>
                <label for="txtVlan">VLAN</label>
              </div>
            </div>
            <div class="col-md d-flex align-items-center">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="chkCatv" disabled>
                <label class="form-check-label ms-2" for="chkCatv">CATV</label>
              </div>
            </div>

          </div>

          <!-- Segunda Fila -->
          <div class="mt-3 mb-3">
            <h5> Datos del router </h5>
          </div>
          <div class="row g-3 mb-3 align-items-center">
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtSsid" placeholder="SSID" disabled required>
                <label for="txtSsid">SSID</label>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtPass" placeholder="Password" disabled required>
                <label for="txtPass">Password</label>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtIpRouter" placeholder="IP" disabled required>
                <label for="txtIpRouter">IP</label>
              </div>
            </div>
          </div>
          <!-- repetidor -->
          <div class="mt-3 mb-3">
            <h5> Datos del repetidor </h5>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-mb-4">
              <div class="form-floating">
                <select id="slcRpetidor" class="form-select">
                  <option value="" disabled selected>Seleccione una opción</option>
                </select>
                <label for="slcRpetidor">Repetidor</label>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtSSIDRepetidor" placeholder="SSID" disabled required>
                <label for="txtSsid">SSID</label>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtPassRepetidor" placeholder="Password" disabled required>
                <label for="txtPass">Password</label>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtIpRepetidor" placeholder="IP" disabled required>
                <label for="txtIpRepetidor">IP</label>
              </div>
            </div>
          </div>


          <!-- Cuarta Fila -->
          <div class="row g-3 mb-3">
            <div class="col-md-12">
              <div class="form-floating">
                <textarea class="form-control" id="txtaEstadoInicial" style="height: 100px;" placeholder="Estado Inicial" disabled required></textarea>
                <label for="txtaEstadoInicial">Estado Inicial</label>
              </div>
            </div>
          </div>
        </div>


        <hr>

        <!-- Cambios Técnicos -->
        <h5 class="mb-4">Cambios Técnicos de Fibra</h5>
        <div>
          <!-- Primera Fila -->
          <div class="">
            <!-- Primera Fila -->
            <div class="row g-3 mb-3 align-items-center">
              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosPppoe" placeholder="PPPoE" disabled required>
                  <label for="txtCambiosPppoe">PPPoE</label>
                </div>
              </div>
              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosClave" placeholder="Clave" disabled required>
                  <label for="txtCambiosClave">Clave</label>
                </div>
              </div>
              <div class="col-md">
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtCambiosPotencia" placeholder="Potencia" required>
                  <label for="txtCambiosPotencia">Potencia</label>
                </div>
              </div>
              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosVlan" placeholder="VLAN" disabled required>
                  <label for="txtCambiosVlan">VLAN</label>
                </div>
              </div>
              <div class="col-md d-flex align-items-center">
                <div class="form-check form-switch tgl-default">
                  <input class="form-check-input" type="checkbox" id="chkCambiosCatv">
                  <label class="form-check-label ms-2" for="chkCambiosCatv">CATV</label>
                </div>
              </div>
            </div>


            <!-- Segunda Fila -->
            <div class="row g-3 mb-3 align-items-center">
              <div class="col-md-4">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosSsid" placeholder="SSID" required>
                  <label for="txtCambiosSsid">SSID</label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosPass" placeholder="Password" required>
                  <label for="txtCambiosPass">Password</label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosIpRouter" placeholder="IP" required>
                  <label for="txtCambiosIpRouter">IP</label>
                </div>
              </div>
            </div>
            <!-- repetidor -->
            <div class="mt-3 mb-3">
              <h5> Datos del repetidor asignado </h5>
            </div>
            <div class="row g-3 mb-3">


              <div class="col-md-4">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosSsidRepetidor" placeholder="SSID" required>
                  <label for="txtCambiosSsidRepetidor">SSID</label>
                </div>
              </div>


              <div class="col-md-4">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosPassRepetidor" placeholder="Password" required>
                  <label for="txtCambiosPassRepetidor">Password</label>
                </div>
              </div>

              <div class="col-md-4">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosIpRepetidor" placeholder="IP" required>
                  <label for="txtCambiosIpRepetidor">IP</label>
                </div>
              </div>
            </div>

            <!-- Cuarta Fila -->
            <div class="row g-3 mb-3">
              <div class="col-md-12">
                <div class="form-floating">
                  <textarea class="form-control" id="txtaCambiosProceSolucion" style="height: 100px;" placeholder="Procedimiento de Solución" required></textarea>
                  <label for="txtaCambiosProceSolucion">Procedimiento de Solución</label>
                </div>
              </div>
            </div>

            <!-- Botón de Reporte -->
            <div class="row g-3 mb-3">
              <div class="col-md-12 text-center">
                <button type="button" id="btnReporte" class="btn btn-primary">Generar Reporte</button>
              </div>
            </div>
          </div>

      </form>
    </div>
  </div>
</div>
<?php require_once "../../footer.php"; ?>

<script type="module" src="../../js/SoporteFibr.js"></script>
</body>