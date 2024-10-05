<?php require_once '../../header.php'; ?>

<div class="container-fluid px-4">
  <h1 class="mt-4">Ficha de Control de Averías</h1>

  <div class="row g-2 mb-2 justify-content-end">
    <div class="col-sm-1">
      <input type="text" class="form-control text-center" id="txtNumFicha" placeholder="N°" disabled>
    </div>
    <div class="col-sm-2">
      <input type="date" class="form-control text-center" id="txtFecha" placeholder="Fecha" disabled>
    </div>
  </div>

  <div class="card mb-4">
    <div class="card-header">
      <i class="fas fa-table me-1"></i> Complete los Datos del Soporte 
    </div>
    <div class="card-body">
      <form action="" id="frmSoporteMovil" autocomplete="off">

        <h5>Datos del Usuario</h5>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="input-group">
              <div class="form-floating">
                <input type="tel" class="form-control" maxlength="11" minlength="11" pattern="[0-11]+" id="txtNrodocumento" placeholder="Número de Documento" autofocus required>
                <label for="txtNrodocumento">Número de Documento</label>
              </div>
              <button class="input-group-text btn btn-primary" type="button" id="btnNrodocumento"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCliente" placeholder="Cliente" disabled>
              <label for="txtCliente">Cliente</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <button id="btnModal" type="button" class="btn btn-info w-100 py-3" data-bs-toggle="modal" data-bs-target="#exampleModal">Seleccionar</button>
            </div>
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
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtBase" placeholder="Base" required>
                    <label for="txtBase">Base</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtIp" placeholder="IP" required>
                    <label for="txtIp">IP</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtSenial" placeholder="Señal" required>
                    <label for="txtSenial">Señal</label>
                  </div>
                </div>
              </div>

              <!-- Inicio de la Segunda Fila -->
              <div>
                <div class="col-md">
                  <div class="form-floating">
                    <textarea type="text" class="form-control" id="txtaEstadoInicial" placeholder="Estado Inicial" style="height: 100px" required></textarea>
                    <label for="txtEstadoInicial">Estado Inicial</label>
                  </div>
                </div>
              </div> <!-- Fin de Segunda Fila -->

              <br>

              <!-- Tercera Fila -->
              <h5>Cambios Wireless</h5>
              <div class="row g-2 mb-2">
                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtBase" placeholder="Nueva Base">
                    <label for="txtNuevaBase">Nueva Base</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtIp" placeholder="Nuevo IP">
                    <label for="txtIp">Nuevo IP</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtSenial" placeholder="Señal">
                    <label for="txtSenial">Señal</label>
                  </div>
                </div>
              </div> <!-- Fin de la Tercera Fila -->

              <!-- Cuarta Fila -->
              <div>
                <div class="col-md">
                  <div class="form-floating">
                    <textarea type="text" class="form-control" id="txtProcedimiento" style="height: 100px" placeholder="Procedimiento de Solución" required></textarea>
                    <label for="txtProcedimiento">Procedimiento de Solución</label>
                  </div>
                </div>
              </div> <!-- Fin de la Cuarta Fila -->

            </li>


            <li class="nav-item menu-open" id="lstGpon" hidden>
              <h5>Parámetros de Gpon</h5>

              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPppoe" placeholder="PPPoE" required>
                    <label for="txtPppoe">PPPoE</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtPotencia" placeholder="Potencia" required>
                    <label for="txtPotencia">Potencia</label>
                  </div>
                </div>

                <div class="col-md-4 d-flex flex-column align-items-start justify-content-end">
                  <label class="form-check-label mb-1" for="chkCatv1">CATV</label>
                  <div class="form-check form-switch d-flex align-items-center">
                    <input class="form-check-input" type="checkbox" id="chkCatv1">
                    <span id="checkboxText1" class="ms-2">No</span>
                  </div>
                </div>

              </div>

              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtClave" placeholder="Clave" required>
                    <label for="txtClave">Clave</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtVlan" placeholder="Vlan" required>
                    <label for="txtVlan">VLAN</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtPotencia" placeholder="Potencia" required>
                    <label for="txtPotencia">Potencia</label>
                  </div>
                </div>

              </div>

              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtSsid" placeholder="SSID" required>
                    <label for="txtSsid">SSID</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPassword" placeholder="Password" required>
                    <label for="txtPassword">Password</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtOtros" placeholder="Otros" required>
                    <label for="txtOtros">Otros</label>
                  </div>
                </div>

              </div>

              <div>
                <div class="col-md">
                  <div class="form-floating">
                    <textarea type="text" class="form-control" id="txtaEstadoInicial" placeholder="Estado Inicial" required></textarea>
                    <label for="txtEstadoInicial">Estado Inicial</label>
                  </div>
                </div>
              </div>

              <hr>

              <h5>Cambios Técnicos de Gpon</h5>
              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPppoe" placeholder="PPPoE" required>
                    <label for="txtPppoe">PPPoE</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtPotencia" placeholder="Potencia" required>
                    <label for="txtPotencia">Potencia</label>
                  </div>
                </div>

                <div class="col-md-4 d-flex flex-column align-items-start justify-content-end">
                  <label class="form-check-label mb-1" for="chkCatv2">CATV</label>
                  <div class="form-check form-switch d-flex align-items-center">
                    <input class="form-check-input" type="checkbox" id="chkCatv2">
                    <span id="checkboxText2" class="ms-2">No</span>
                  </div>
                </div>

              </div>

              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtClave" placeholder="Clave" required>
                    <label for="txtClave">Clave</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtVlan" placeholder="VLAN" required>
                    <label for="txtVlan">VLAN</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtPotencia" placeholder="Potencia" required>
                    <label for="txtPotencia">Potencia</label>
                  </div>
                </div>

              </div>

              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtSsid" placeholder="SSID" required>
                    <label for="txtSsid">SSID</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPassword" placeholder="Password" required>
                    <label for="txtPassword">Password</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtOtros" placeholder="Otros" required>
                    <label for="txtOtros">Otros</label>
                  </div>
                </div>

              </div>

              <div>
                <div class="col-md">
                  <div class="form-floating">
                    <textarea type="text" class="form-control" id="txtaProcedimiento" placeholder="Procedimiento de Solución" required></textarea>
                    <label for="txtProcedimiento">Procedimiento de Solución</label>
                  </div>
                </div>
              </div>

              <hr>

            </li>

            <li class="nav-item menu-open" id="lstCable" hidden>
              <h5>Parámetros Cable</h5>

              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <select class="form-select" id="slcPeriodo" aria-label="Selecciona una opción">
                      <option selected disabled>Elige una opción</option>
                      <option value="1">Mensual</option>
                      <option value="2">Contado</option>
                    </select>
                    <label for="slcPeriodo">Periodo</label>
                  </div>
                </div>

              </div>

              <div class="row g-2 mb-2">
                <div class="col md-6">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPotencia" placeholder="Potencia" required>
                    <label for="txtPotencia">Potencia</label>
                  </div>
                </div>

                <div class="col md-6">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtSintonizador" placeholder="Sintonizador">
                    <label for="txtSintonizador">Sintonizador</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="text" id="txtNumTriplexor" placeholder="N° Triplexor" class="form-control">
                      <label for="txtTriplexor">N° Triplexor</label>
                    </div>
                    <div class="form-floating">
                      <select class="form-select" id="slcTriplexor" aria-label="Selecciona una opción">
                        <option selected disabled>Seleccione</option>
                        <option value="1">No</option>
                        <option value="2">Activo</option>
                        <option value="3">Pasivo</option>
                      </select>
                      <label for="slcTriplexor">Triplexor</label>
                    </div>
                  </div>
                </div>

              </div>


              <hr>

              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="text" id="txtNumSpliter" class="form-control" placeholder="N° Spliter">
                      <label for="txtSpliter">N° Spliter</label>
                    </div>
                    <div class="form-floating">
                      <select class="form-select" id="slcSpliter" aria-label="Selecciona una opción">
                        <option selected disabled>Seleccione</option>
                        <option value="1">1x3</option>
                        <option value="2">1x5</option>
                        <option value="3">1x8</option>
                      </select>
                      <label for="slcSpliter">Spliter</label>
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="txtCable" placeholder="Cable">
                      <label for="txtCable">Cable</label>
                    </div>
                    <div class="form-floating">
                      <input type="number" class="form-control" id="txtPrecioCable" placeholder="Precio del Cable" disabled>
                      <label for="txtPrecioCable">Precio del Cable</label>
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="number" class="form-control" id="txtConector" placeholder="Conectores">
                      <label for="txtConectores">Conectores</label>
                    </div>
                    <div class="form-floating">
                      <input type="number" class="form-control" id="txtPrecioConector" placeholder="Precio del Conector" disabled>
                      <label for="txtPrecioConector">Precio del Conector</label>
                    </div>
                  </div>
                </div>

              </div>

              <div>
                <div class="col-md">
                  <div class="form-floating">
                    <textarea type="text" class="form-control" id="txtaEstadoInicial" placeholder="Estado Inicial" required></textarea>
                    <label for="txtEstadoInicial">Estado Inicial</label>
                  </div>
                </div>
              </div>

              <hr>

              <h5>Cambios Técnicos de Cable</h5>
              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <select class="form-select" id="slcPeriodo" aria-label="Selecciona una opción">
                      <option selected disabled>Elige una opción</option>
                      <option value="1">Mensual</option>
                      <option value="2">Contado</option>
                    </select>
                    <label for="slcPeriodo">Periodo</label>
                  </div>
                </div>

              </div>

              <div class="row g-2 mb-2">
                <div class="col md-6">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPotencia" placeholder="Potencia" required>
                    <label for="txtPotencia">Potencia</label>
                  </div>
                </div>

                <div class="col md-6">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtSintonizador" placeholder="Sintonizador">
                    <label for="txtSintonizador">Sintonizador</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="text" id="txtNumTriplexor" class="form-control" placeholder="N° Triplexor">
                      <label for="txtTriplexor">N° Triplexor</label>
                    </div>
                    <div class="form-floating">
                      <select class="form-select" id="slcTriplexor" aria-label="Selecciona una opción">
                        <option selected disabled>Seleccione</option>
                        <option value="1">No</option>
                        <option value="2">Activo</option>
                        <option value="3">Pasivo</option>
                      </select>
                      <label for="slcTriplexor">Triplexor</label>
                    </div>
                  </div>
                </div>
              </div>

              <hr>

              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="text" id="txtNumSpliter" class="form-control" placeholder="N° Spliter">
                      <label for="txtNumSpliter">N° Spliter</label>
                    </div>
                    <div class="form-floating">
                      <select class="form-select" id="slcSpliter" aria-label="Selecciona una opción">
                        <option selected disabled>Seleccione</option>
                        <option value="1">1x3</option>
                        <option value="2">1x5</option>
                        <option value="3">1x8</option>
                      </select>
                      <label for="slcSpliter">Spliter</label>
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="txtCable" placeholder="Cable">
                      <label for="txtCable">Cable</label>
                    </div>
                    <div class="form-floating">
                      <input type="number" class="form-control" id="txtPrecioCable" placeholder="Precio del Cable" disabled>
                      <label for="txtPrecioCable">Precio del Cable</label>
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="number" class="form-control" id="txtConector" placeholder="Conectores">
                      <label for="txtConector">Conectores</label>
                    </div>
                    <div class="form-floating">
                      <input type="number" class="form-control" id="txtPrecioConector" placeholder="Precio del Conector" disabled>
                      <label for="txtPrecioConector">Precio del Conector</label>
                    </div>
                  </div>
                </div>

              </div>

              <div>
                <div class="col-md">
                  <div class="form-floating">
                    <textarea type="text" class="form-control" id="txtProcedimiento" placeholder="Procedimiento de Solución"></textarea>
                    <label for="txtProcedimiento">Procedimiento de Solución</label>
                  </div>
                </div>
              </div>

              <hr>

            </li>

            <hr>

          </ul>
        </nav>

        <div class="row">
          <div class="col-12 text-center text-md-end mb-3">
            <div class="d-flex flex-column flex-md-row justify-content-center justify-content-md-end">
              <button type="button" id="btnCodigoBarra" class="btn btn-warning mb-2 me-md-2">Verificar Código</button>
              <button type="submit" id="btnRegistrarSoporte" class="btn btn-success mb-2 me-md-2">Registrar Soporte</button>
              <button type="reset" id="btnCancelar" class="btn btn-secondary mb-2">Cancelar Proceso</button>
            </div>
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