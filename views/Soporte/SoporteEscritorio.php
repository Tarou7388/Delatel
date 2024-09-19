<?php require_once '../../header.php'; ?>

<div class="container-fluid px-4">
  <h1 class="mt-4">Soporte de Escritorio</h1>

  <div class="row g-2 mb-2 justify-content-end">
    <div class="col-sm-1">
      <input type="text" class="form-control" id="txtNumFicha" placeholder="N°" disabled>
    </div>
    <div class="col-sm-2">
      <input type="date" class="form-control" id="txtFecha" placeholder="Fecha" disabled>
    </div>
  </div>

  <br>

  <div class="card mb-4">
    <div class="card-header">
      Complete los Datos
    </div>
    <div class="card-body">
      <form id="frmSoporteEscritorio" autocomplete="off">

        <!-- Primera Fila -->
        <h5>Datos del Usuario</h5>
        <div class="row g-2 mb-2">
          <div class="form-floating">
            <div class="input-group">
              <button class="input-group-text btn btn-secondary" type="button" id="btnNrodocumento">
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
              <input type="tel" class="form-control" id="txtNrodocumento" maxlength="11" minlength="11" pattern="[0-9]+" placeholder="Número de Identificador" autofocus required>
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

          <!-- Modal -->
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

        </div> <!-- Fin de la Primera Fila -->

        <nav class="mt-2">
          <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview">
            <!-- Inicio de Parámetros para WISP -->
            <li class="nav-item menu-open" id="lstWisp" hidden>
              <!-- Inicio de Parametros de WISP -->
              <!-- Primera Fila -->
              <h5>Parámetros Wireless</h5>
              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtBase" placeholder="Base" required>
                    <label>Base</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtIp" placeholder="IP" required>
                    <label>IP</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtSenial" placeholder="Señal" required>
                    <label>Señal</label>
                  </div>
                </div>

              </div>
              <!-- Inicio de la Segunda Fila -->
              <div>
                <div class="col-md">

                  <div class="form-floating">
                    <textarea type="text" class="form-control" id="txtaEstadoInicial" style="height: 100px" placeholder="Estado Inicial" required></textarea>
                    <label>Estado Inicial</label>
                  </div>
                </div>
              </div> <!-- Fin de Segunda Fila -->

              <br>

              <!-- Tercera Fila -->
              <h5>Cambios Wireless</h5>
              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtBase" placeholder="Nueva Base" required>
                    <label>Nueva Base</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtIp" placeholder="Nuevo IP" required>
                    <label>Nuevo IP</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="number" placeholder="Señal" class="form-control" id="txtSenial" required>
                    <label>Señal</label>
                  </div>
                </div>

              </div> <!-- Fin de la Tercera Fila -->

              <!-- Cuarta Fila -->
              <div>
                <div class="col-md">
                  <div class="form-floating">
                    <textarea type="text" class="form-control" id="txtaProceSolucion" placeholder="Procedimiento de Solución" style="height: 100px" required></textarea>
                    <label>Procedimiento de Solución</label>
                  </div>
                </div>
              </div> <!-- Fin de la Cuarta Fila -->

            </li> <!-- Fin de Parámetros para WISP -->

            <!-- Inicio de Parámetros para GPON -->
            <li class="nav-item menu-open" id="lstGpon" hidden>
              <h5>Parámetros de Gpon</h5>
              <!-- Inicio de Primera Fila -->
              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPppoe" placeholder="PPPoE" required>
                    <label>PPPoE</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtPotencia" required placeholder="Potencia">
                    <label>Potencia</label>
                  </div>
                </div>

                <div class="col md-6 form-check form-switch d-flex align-items-center">
                  <input class="form-check-input ms-5" type="checkbox" id="chkCatv">
                  <label class="form-check-label" for="chkCatv">CATV</label>
                </div>

              </div> <!-- Fin de la Primera Fila -->

              <!-- Segunda Fila -->
              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtClave" required placeholder="Clave">
                    <label>Clave</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtVlan" required placeholder="VLAN">
                    <label>VLAN</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtPotencia" required placeholder="Potencia">
                    <label>Potencia</label>
                  </div>
                </div> <!-- Fin de la Segunda Fila -->

              </div>

              <!-- Tercera Fila -->
              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPotencia" required placeholder="SSID">
                    <label>SSID</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPass" required placeholder="Password">
                    <label>Password</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtOtros" required placeholder="Otros">
                    <label>Otros</label>
                  </div>
                </div>

              </div> <!-- Fin de la Tercera Fila -->

              <!-- Inicio de Cuarta Fila -->
              <div>
                <div class="col-md">
                  <div class="form-floating">
                    <textarea type="text" class="form-control" id="txtaEstadoInicial" style="height: 100px" required placeholder="Estado Inicial"></textarea>
                    <label>Estado Inicial</label>
                  </div>
                </div>
              </div> <!-- Fin de la Cuarta Fila -->

              <hr>

              <!-- Cambios Técnicos -->
              <!-- Quinta Fila -->
              <h5>Cambios Técnicos de Gpon</h5>
              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPppoe" required placeholder="PPPoE">
                    <label>PPPoE</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtPotencia" required placeholder="Potencia">
                    <label>Potencia</label>
                  </div>
                </div>

                <div class="col md-6 form-check form-switch d-flex align-items-center">
                  <input class="form-check-input ms-5"" type=" checkbox" id="chkCatv">
                  <label class="form-check-label" for="chkCatv">CATV</label>
                </div>

              </div> <!-- Fin de la Quinta Fila -->

              <!-- Sexta Fila -->
              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtClave" required placeholder="Clave">
                    <label>Clave</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtVlan" required placeholder="VLAN">
                    <label>VLAN</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtPotencia" required placeholder="Potencia">
                    <label>Potencia</label>
                  </div>
                </div>

              </div> <!-- Fin de la Sexta Fila -->

              <!-- Septima Fila -->
              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtSsid" required placeholder="SSID">
                    <label>SSID</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPass" required placeholder="Password">
                    <label>Password</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtOtros" required placeholder="Otros">
                    <label>Otros</label>
                  </div>
                </div>

              </div> <!-- Fin de la Septima Fila -->

              <!-- Octava Fila -->
              <div>
                <div class="col-md">
                  <div class="form-floating">
                    <textarea type="text" class="form-control" id="txtaProceSolucion" style="height: 100px" required placeholder="Procdimiento de Solución"></textarea>
                    <label>Procedimiento de Solución</label>
                  </div>
                </div>
              </div> <!-- Fin de la Octava Fila -->

              <hr>

            </li> <!-- Fin de Parámetros para GPON -->

            <!-- Inicio de Parámetros para Cable -->
            <li class="nav-item menu-open" id="lstCable" hidden>
              <h5>Parámetros Cable</h5>

              <!-- Primera Fila -->
              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <select class="form-select" id="slcPeriodo" aria-label="Selecciona una opción">
                      <option selected disabled>Elige una opción</option>
                      <option value="1">Mensual</option>
                      <option value="2">Contado</option>
                    </select>
                    <label>Periodo</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPotencia" required placeholder="Potencia">
                    <label>Potencia</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtSintonizador" placeholder="Sintonizador">
                    <label>Sintonizador</label>
                  </div>
                </div>

              </div> <!-- Fin de Primera Fila -->

              <hr>

              <!-- Segunda Fila -->
              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating flex-fill">
                      <input type="text" id="txtNumTriplexor" class="form-control" placeholder="Triplexor">
                      <label>Triplexor</label>
                    </div>
                    <select class="form-select" id="slcTriplexor" aria-label="Selecciona una opción">
                      <option selected disabled>Elige una opción</option>
                      <option value="1">No</option>
                      <option value="2">Activo</option>
                      <option value="3">Pasivo</option>
                    </select>
                  </div>

                </div>

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="text" id="txtNumSpliter" class="form-control" placeholder="Spliter">
                      <label>Spliter</label>
                    </div>
                    <select class="form-select" id="slcSpliter" aria-label="Selecciona una opción">
                      <option selected disabled>Elige una opción</option>
                      <option value="1">1x3</option>
                      <option value="2">1x5</option>
                      <option value="3">1x8</option>
                    </select>
                  </div>
                </div>

                <div class="col-md">

                  <div class="input-group">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="txtCable" placeholder="Cable">
                      <label>Cable</label>
                    </div>
                    <div class="form-floating">
                      <input type="number" class="form-control" id="txtPrecioCable" disabled placeholder="Precio">
                      <label for="">Precio</label>
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="number" class="form-control" id="txtConector">
                      <label>Conectores</label>
                    </div>
                    <div class="form-control">
                      <input type="number" class="form-control" id="txtPrecioConector" disabled placeholder="Precio">
                      <label for="">Precio</label>
                    </div>
                  </div>
                </div> <!-- Fin de Segunda Fila -->

              </div>

              <!-- Tercera Fila -->
              <div>
                <div class="col-md">
                  <div class="form-floating">
                    <textarea type="text" class="form-control" id="txtaEstadoInicial" style="height: 100px" required placeholder="Estado Inicial"></textarea>
                    <label>Estado Inicial</label>
                  </div>
                </div>
              </div> <!-- Fin de Tercera Fila -->

              <hr>

              <h5>Cambios Técnicos de Cable</h5>
              <!-- Cuarta Fila -->
              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <select class="form-select" id="slcPeriodo" aria-label="Selecciona una opción">
                      <option selected disabled>Elige una opción</option>
                      <option value="1">Mensual</option>
                      <option value="2">Contado</option>
                    </select>
                    <label>Periodo</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPotencia" required placeholder="Potencia">
                    <label>Potencia</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtSintonizador" placeholder="Sintonizador">
                    <label>Sintonizador</label>
                  </div>
                </div>

              </div> <!-- Fin de Cuarta Fila -->

              <hr>

              <!-- Quinta Fila -->
              <div class="row g-2 mb-2">

                <div class="col-md">

                  <div class="input-group">
                    <div class="form-floating">
                      <input type="text" id="txtNumTriplexor" class="form-control" placeholder="Triplexor">
                      <label>Triplexor</label>
                    </div>
                    <select class="form-select" id="slcTriplexor" aria-label="Selecciona una opción">
                      <option selected disabled>Elige una opción</option>
                      <option value="1">No</option>
                      <option value="2">Activo</option>
                      <option value="3">Pasivo</option>
                    </select>
                  </div>
                </div>

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="text" id="txtNumSpliter" class="form-control" placeholder="Spliter">
                      <label>Spliter</label>
                    </div>
                    <select class="form-select" id="slcSpliter" aria-label="Selecciona una opción">
                      <option selected disabled>Elige una opción</option>
                      <option value="1">1x3</option>
                      <option value="2">1x5</option>
                      <option value="3">1x8</option>
                    </select>
                  </div>
                </div>

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="txtCable" placeholder="Cable">
                      <label>Cable</label>
                    </div>
                    <div class="form-floating">
                      <input type="number" class="form-control" id="txtPrecioCable" disabled placeholder="Precio">
                      <label for="">Precio</label>
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="number" class="form-control" id="txtConector" placeholder="Conectores">
                      <label>Conectores</label>
                    </div>
                    <div class="form-floating">
                      <input type="number" class="form-control" id="txtPrecioConector" disabled>
                      <label for="">Precio</label>
                    </div>
                  </div>
                </div>

              </div> <!-- Fin de Quinta Fila -->

              <!-- Sexta Fila -->
              <div>
                <div class="col-md">
                  <div class="form-floating">
                    <textarea type="text" class="form-control" id="txtaProceSolucion" style="height: 100px" required placeholder="Procedimiento de Solucion"></textarea>
                    <label>Procedimiento de Solución</label>
                  </div>
                </div>
              </div> <!-- Fin de Sexta Fila -->

              <hr>

            </li> <!-- Fin de Parámetros para Cable -->

            <hr>

          </ul>
        </nav>

        <!-- Botones -->
        <div class="row">
          <div class="col-12 text-center text-md-end mb-3">
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