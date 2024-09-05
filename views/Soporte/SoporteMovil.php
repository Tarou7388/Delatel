<?php require_once '../../header.php'; ?>

<div class="container-fluid px-4">
  <h1 class="mt-4">Soporte Vista Móvil</h1>

  <div class="row g-3 mb-2">
    <div class="col md-6">
      <input type="number" class="form-control" id="txtNumFicha" placeholder="N°" disabled>
    </div>
    <div class="col md-6">
      <input type="date" class="form-control" id="txtFecha" placeholder="Fecha" disabled>
    </div>
  </div>

  <div class="card mb-4">
    <div class="card-header">
      Complete los Datos
    </div>
    <div class="card-body">
      <form action="" id="frmSoporteMovil" autocomplete="off">

        <h5>Datos del Usuario</h5>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <label>Número de Indetificador</label>
            <div class="input-group">
              <input type="tel" class="form-control" maxlength="11" minlength="11" pattern="[0-11]+" id="txtNrodocumento" autofocus required>
              <button class="input-group-text btn btn-secondary" type="button" id="btnNrodocumento"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
          </div>

          <div class="col-md">
            <label>Cliente</label>
            <input type="text" class="form-control" id="txtCliente" disabled>
          </div>

          <div class="col-md">
            <label>Planes</label>
            <button id="btnModal" type="button" class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#exampleModal">Seleccionar</button>
          </div>

          <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Selecciona un Plan</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <ul class="list-group">

                    <li class="list-group-item" data-value="1" data-name="WISP">
                      WISP <br>
                    </li>

                    <li class="list-group-item" data-value="2" data-name="GPON">
                      GPON <br>
                    </li>

                    <li class="list-group-item" data-value="3" data-name="CABLE">
                      CABLE <br>
                    </li>

                  </ul>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <nav class="mt-2">
          <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview">

            <li class="nav-item menu-open" id="lstWisp" hidden>
              <!-- Inicio de Parametros de WISP -->
              <!-- Primera Fila -->
              <h5>Parámetros Wireless</h5>
              <div class="row g-2 mb-2">
                <div class="col-md">
                  <label>Base</label>
                  <input type="text" class="form-control" id="txtBase" required>
                </div>
              </div>

              <div class="row g-2 mb-2">
                <div class="col md-6">
                  <label>IP</label>
                  <input type="text" class="form-control" id="txtIp" required>
                </div>
                <div class="col md-6">
                  <label>Señal</label>
                  <input type="number" class="form-control" id="txtSenial" required>
                </div>
              </div>

              <!-- Inicio de la Segunda Fila -->
              <div>
                <div class="col-md">
                  <label>Estado Inicial</label>
                  <textarea type="text" class="form-control" id="txtaEstadoInicial" style="height: 100px" required></textarea>
                </div>
              </div> <!-- Fin de Segunda Fila -->

              <br>

              <!-- Tercera Fila -->
              <h5>Cambios Wireless</h5>
              <div class="row g-2 mb-2">
                <div class="col-md">
                  <label>Nueva Base</label>
                  <input type="text" class="form-control" id="txtBase" required>
                </div>
              </div>
              <div class="row g-2 mb-2">
                <div class="col md-6">
                  <label>Nuevo IP</label>
                  <input type="text" class="form-control" id="txtIp" required>
                </div>

                <div class="col md-6">
                  <label>Señal</label>
                  <input type="number" class="form-control" id="txtSenial" required>
                </div>
              </div> <!-- Fin de la Tercera Fila -->

              <!-- Cuarta Fila -->
              <div>
                <div class="col-md">
                  <label>Procedimiento de Solución</label>
                  <textarea type="text" class="form-control" id="txtaProceSolucion" style="height: 100px" required></textarea>
                </div>
              </div> <!-- Fin de la Cuarta Fila -->

            </li>


            <li class="nav-item menu-open" id="lstGpon" hidden>
              <h5>Parámetros de Gpon</h5>

              <div class="row g-2 mb-2">

                <div class="col-md">
                  <label>PPPoE</label>
                  <input type="text" class="form-control" id="txtPppoe" required>
                </div>
              </div>

              <div class="row g-2 mb-2">
                <div class="col md-6">
                  <label>Potencia</label>
                  <input type="number" class="form-control" id="txtPotencia" required>
                </div>

                <div class="col md-6 form-check form-switch d-flex align-items-center">
                  <input class="form-check-input ms-4" type="checkbox" id="chkCatv">
                  <label class="form-check-label" for="chkCatv">CATV</label>
                </div>
              </div>

              <div class="row g-2 mb-2">

                <div class="col-md">
                  <label>Clave</label>
                  <input type="text" class="form-control" id="txtClave" required>
                </div>
              </div>

              <div class="row g-2 mb-2">
                <div class="col md-6">
                  <label>VLAN</label>
                  <input type="number" class="form-control" id="txtVlan" required>
                </div>

                <div class="col md-6">
                  <label>Potencia</label>
                  <input type="number" class="form-control" id="txtPotencia" required>
                </div>
              </div>



              <div class="row g-2 mb-2">

                <div class="col-md">
                  <label>SSID</label>
                  <input type="text" class="form-control" id="txtPotencia" required>
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
              </div>

              <hr>

              <h5>Cambios Técnicos de Gpon</h5>
              <div class="row g-2 mb-2">

                <div class="col-md">
                  <label>PPPoE</label>
                  <input type="text" class="form-control" id="txtPppoe" required>
                </div>

              </div>

              <div class="row g-2 mb-2">
                <div class="col md-6">
                  <label>Potencia</label>
                  <input type="number" class="form-control" id="txtPotencia" required>
                </div>

                <div class="col md-6 form-check form-switch d-flex align-items-center">
                  <input class="form-check-input ms-4" type="checkbox" id="chkCatv">
                  <label class="form-check-label" for="chkCatv">CATV</label>
                </div>
              </div>

              <div class="row g-2 mb-2">
                <div class="col-md">
                  <label>Clave</label>
                  <input type="text" class="form-control" id="txtClave" required>
                </div>
              </div>

              <div class="row g-2 mb-2">
                <div class="col md-6">
                  <label>VLAN</label>
                  <input type="number" class="form-control" id="txtVlan" required>
                </div>

                <div class="col md-6">
                  <label>Potencia</label>
                  <input type="number" class="form-control" id="txtPotencia" required>
                </div>
              </div>

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
                  <label>Procedimiento de Solución</label>
                  <textarea type="text" class="form-control" id="txtaProceSolucion" style="height: 100px" required></textarea>
                </div>
              </div>

              <hr>

            </li>

            <li class="nav-item menu-open" id="lstCable" hidden>
              <h5>Parámetros Cable</h5>

              <div class="row g-2 mb-2">

                <div class="col-md">
                  <label>Periodo</label>
                  <select class="form-select" id="slcPeriodo" aria-label="Selecciona una opción">
                    <option selected disabled>Elige una opción</option>
                    <option value="1">Mensual</option>
                    <option value="2">Contado</option>
                  </select>
                </div>

              </div>

              <div class="row g-2 mb-2">
                <div class="col md-6">
                  <label>Potencia</label>
                  <input type="text" class="form-control" id="txtPotencia" required>
                </div>

                <div class="col md-6">
                  <label>Sintonizador</label>
                  <input type="text" class="form-control" id="txtSintonizador">
                </div>
              </div>


              <hr>

              <div class="row g-2 mb-2">

                <div class="col-md">
                  <label>Triplexor</label>
                  <div class="input-group">
                    <input type="text" id="txtNumTriplexor" class="form-control">
                    <select class="form-select" id="slcTriplexor" aria-label="Selecciona una opción">
                      <option selected disabled>Elige una opción</option>
                      <option value="1">No</option>
                      <option value="2">Activo</option>
                      <option value="3">Pasivo</option>
                    </select>
                  </div>
                </div>

                <div class="col-md">
                  <label>Spliter</label>
                  <div class="input-group">
                    <input type="text" id="txtNumSpliter" class="form-control">
                    <select class="form-select" id="slcSpliter" aria-label="Selecciona una opción">
                      <option selected disabled>Elige una opción</option>
                      <option value="1">1x3</option>
                      <option value="2">1x5</option>
                      <option value="3">1x8</option>
                    </select>
                  </div>
                </div>

                <div class="col-md">
                  <label>Cable</label>
                  <div class="input-group">
                    <input type="text" class="form-control" id="txtCable">
                    <input type="number" class="form-control" id="txtPrecioCable" disabled>
                  </div>
                </div>

                <div class="col-md">
                  <label>Conectores</label>
                  <div class="input-group">
                    <input type="number" class="form-control" id="txtConector">
                    <input type="number" class="form-control" id="txtPrecioConector" disabled>
                  </div>
                </div>

              </div>

              <div>
                <div class="col-md">
                  <label>Estado Inicial</label>
                  <textarea type="text" class="form-control" id="txtaEstadoInicial" style="height: 100px" required></textarea>
                </div>
              </div>

              <hr>

              <h5>Cambios Técnicos de Cable</h5>
              <div class="row g-2 mb-2">

                <div class="col-md">
                  <label>Periodo</label>
                  <select class="form-select" id="slcPeriodo" aria-label="Selecciona una opción">
                    <option selected disabled>Elige una opción</option>
                    <option value="1">Mensual</option>
                    <option value="2">Contado</option>
                  </select>
                </div>

              </div>

              <div class="row g-2 mb-2">
                <div class="col md-6">
                  <label>Potencia</label>
                  <input type="text" class="form-control" id="txtPotencia" required>
                </div>

                <div class="col md-6">
                  <label>Sintonizador</label>
                  <input type="text" class="form-control" id="txtSintonizador">
                </div>
              </div>

              <hr>

              <div class="row g-2 mb-2">

                <div class="col-md">
                  <label>Triplexor</label>
                  <div class="input-group">
                    <input type="text" id="txtNumTriplexor" class="form-control">
                    <select class="form-select" id="slcTriplexor" aria-label="Selecciona una opción">
                      <option selected disabled>Elige una opción</option>
                      <option value="1">No</option>
                      <option value="2">Activo</option>
                      <option value="3">Pasivo</option>
                    </select>
                  </div>
                </div>

                <div class="col-md">
                  <label>Spliter</label>
                  <div class="input-group">
                    <input type="text" id="txtNumSpliter" class="form-control">
                    <select class="form-select" id="slcSpliter" aria-label="Selecciona una opción">
                      <option selected disabled>Elige una opción</option>
                      <option value="1">1x3</option>
                      <option value="2">1x5</option>
                      <option value="3">1x8</option>
                    </select>
                  </div>
                </div>

                <div class="col-md">
                  <label>Cable</label>
                  <div class="input-group">
                    <input type="text" class="form-control" id="txtCable">
                    <input type="number" class="form-control" id="txtPrecioCable" disabled>
                  </div>
                </div>

                <div class="col-md">
                  <label>Conectores</label>
                  <div class="input-group">
                    <input type="number" class="form-control" id="txtConector">
                    <input type="number" class="form-control" id="txtPrecioConector" disabled>
                  </div>
                </div>

              </div>

              <div>
                <div class="col-md">
                  <label>Procedimiento de Solución</label>
                  <textarea type="text" class="form-control" id="txtaProceSolucion" style="height: 100px" required></textarea>
                </div>
              </div>

              <hr>

            </li>

            <hr>

          </ul>
        </nav>

        <div class="row">
          <div class="col-12 text-center text-md-end mb-3">
            <button type="button" id="btnCodigoBarra" class="btn btn-warning btn-sm me-2 mb-2 mb-md-0">Verificar Código</button>
            <button type="submit" id="btnRegistrarSoporte" class="btn btn-primary btn-sm me-2 mb-2 mb-md-0">Registrar Soporte</button>
            <button type="reset" id="btnCancelar" class="btn btn-secondary btn-sm mb-2 mb-md-0">Cancelar Proceso</button>
          </div>
        </div>

      </form>
    </div>
  </div>
</div>
<?php require_once "../../footer.php"; ?>

<script type="module" src="../../js/soporteEscritorio.js"></script>

</body>

</html>