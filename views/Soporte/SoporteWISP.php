  <?php require_once '../../header.php'; ?>

  <div class="container-fluid px-4">
    <h1 class="mt-4">Control de Averías WISP</h1>

    <br>

    <div class="card mb-4">
      <div class="card-header">
        Complete los datos
      </div>
      <div class="card-body">
        <form action="" id="frmRegistroWisp" autocomplete="off">

          <!-- Primera Fila -->
          <h5>Datos del Cliente</h5>
          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="input-group">
                <div class="form-floating">
                  <input type="text" class="form-control" maxlength="12" minlength="8" id="txtNrodocumento" placeholder="Fecha" disabled>
                  <label>Número Identificador</label>
                </div>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCliente" placeholder="Fecha" disabled>
                <label>Cliente</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtPlan" placeholder="Fecha" disabled>
                <label>Plan</label>
              </div>
            </div>
          </div> <!-- Fin de la Primera Fila -->

          <hr>

          <!-- Segunda Fila -->
          <h5>Parámetros Wireless</h5>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <select class="form-select" id="slcWireless" required>
                  <option value="" disabled selected>Seleccione una opción</option>
                </select>
                <label for="slcWireless">Parámetro Wireless</label>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtBase" placeholder="Base" required disabled>
                <label>Base</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtIp" placeholder="IP" required disabled>
                <label>Dirección IP (LAN)</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtSenial" placeholder="Señal" required disabled>
                <label>Señal (ST)</label>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterSsid" placeholder="Base" required disabled>
                <label>Router SSID (Nombre)</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterSeguridad" placeholder="IP" required disabled>
                <label>Seguridad (Clave)</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterpuertaEnlace" placeholder="Señal" required disabled>
                <label>Puerta de Enlace (Gateway)</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterWan" placeholder="Señal" required disabled>
                <label>WAN</label>
              </div>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <textarea type="text" class="form-control" id="txtaEstadoInicial" style="height: 100px" placeholder="Fecha" disabled></textarea>
              <label>Estado Inicial</label>
            </div>
          </div> <!-- Fin de la Segunda Fila -->

          <hr>

          <!-- Tercera Fila -->
          <h5>Cambios Wireless</h5>
          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtBaseNuevo" placeholder="Fecha" required disabled>
                <label>Base</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtIpNuevo" placeholder="Fecha" required>
                <label>IP</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtSenialNuevo" placeholder="Fecha" required>
                <label>Señal (ST)</label>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterCambioSsid" placeholder="Base" required >
                <label>Router SSID (Nombre)</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterCambioSeguridad" placeholder="IP" required >
                <label>Seguridad (Clave)</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterCambiopuertaEnlace" placeholder="Señal" required >
                <label>Puerta de Enlace</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterCambioWan" placeholder="Señal" required >
                <label>WAN</label>
              </div>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <textarea type="text" class="form-control" id="txtaProceSolucion" style="height: 100px" placeholder="Fecha" required></textarea>
              <label>Procedimiento de Solución</label>
            </div>
          </div> <!-- Fin de la Tercera Fila -->

        </form>
      </div>
    </div>
  </div>

  <?php require_once "../../footer.php"; ?>

  <script type="module" src="../../js/SoporteWisp.js"></script>
  </body>

  </html>