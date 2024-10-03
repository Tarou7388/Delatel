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
      Complete los Datos
    </div>
    <div class="card-body">
      <form action="" id="frmSoporteMovil" autocomplete="off">

        <h5>Datos del Usuario</h5>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="input-group">
              <div class="form-floating">
                <input type="tel" class="form-control" maxlength="11" minlength="11" pattern="[0-11]+" id="txtNrodocumento" placeholder="Número de Documento" autofocus required>
                <label for="lblNrodocumento">Número de Documento</label>
              </div>
              <button class="input-group-text btn btn-secondary" type="button" id="btnNrodocumento"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCliente" placeholder="Cliente" disabled>
              <label for="lblCliente">Cliente</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <button id="btnModal" type="button" class="btn btn-primary w-100 py-3" data-bs-toggle="modal" data-bs-target="#exampleModal">Seleccionar</button>
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
                    <label for="lblBase">Base</label>
                  </div>
                </div>

                <div class="col md-6">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtIp" placeholder="IP" required>
                    <label for="lblIp">IP</label>
                  </div>
                </div>

                <div class="col md-6">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtSenial" placeholder="Señal" required>
                    <label for="lblSenial">Señal</label>
                  </div>
                </div>
              </div>

              <!-- Inicio de la Segunda Fila -->
              <div>
                <div class="col-md">
                  <div class="form-floating">
                    <textarea type="text" class="form-control" id="txtaEstadoInicial" placeholder="Estado Inicial" style="height: 100px" required></textarea>
                    <label for="lblEstadoInicial">Estado Inicial</label>
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
                    <label for="lblNuevaBase">Nueva Base</label>
                  </div>
                </div>

                <div class="col md-6">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtIp" placeholder="Nuevo IP">
                    <label for="lblIp">Nuevo IP</label>
                  </div>
                </div>

                <div class="col md-6">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtSenial" placeholder="Señal">
                    <label for="lblSenial">Señal</label>
                  </div>
                </div>
              </div> <!-- Fin de la Tercera Fila -->

              <!-- Cuarta Fila -->
              <div>
                <div class="col-md">
                  <div class="form-floating">
                    <textarea type="text" class="form-control" id="txtProcedimiento" style="height: 100px" placeholder="Procedimiento de Solución" required></textarea>
                    <label for="lblProcedimiento">Procedimiento de Solución</label>
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
                    <label for="lblPppoe">PPPoE</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtPotencia" placeholder="Potencia" required>
                    <label for="lblPotencia">Potencia</label>
                  </div>
                </div>

                <div class="col-md-4 form-check form-switch d-flex align-items-center ">
                  <input class="form-check-input ms-5" type="checkbox" id="chkCatv1">
                  <label class="form-check-label" for="chkCatv1">CATV</label>
                </div>

              </div>

              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtClave" placeholder="Clave" required>
                    <label for="lblClave">Clave</label>
                  </div>
                </div>

                <div class="col md-6">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtVlan" placeholder="Vlan" required>
                    <label for="lblVlan">VLAN</label>
                  </div>
                </div>

                <div class="col md-6">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtPotencia" placeholder="Potencia" required>
                    <label for="lblPotencia">Potencia</label>
                  </div>
                </div>

              </div>

              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtSsid" placeholder="SSID" required>
                    <label for="lblSsid">SSID</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPassword" placeholder="Password" required>
                    <label for="lblPassword">Password</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtOtros" placeholder="Otros" required>
                    <label for="lblOtros">Otros</label>
                  </div>
                </div>

              </div>

              <div>
                <div class="col-md">
                  <div class="form-floating">
                    <textarea type="text" class="form-control" id="txtaEstadoInicial" placeholder="Estado Inicial" required></textarea>
                    <label for="lblEstadoInicial">Estado Inicial</label>
                  </div>
                </div>
              </div>

              <hr>

              <h5>Cambios Técnicos de Gpon</h5>
              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPppoe" placeholder="PPPoE" required>
                    <label for="lblPppoe">PPPoE</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtPotencia" placeholder="Potencia" required>
                    <label for="lblPotencia">Potencia</label>
                  </div>
                </div>

                <div class="col-md-4 form-check form-switch d-flex align-items-center ">
                  <input class="form-check-input ms-5" type="checkbox" id="chkCatv">
                  <label class="form-check-label" for="chkCatv">CATV</label>
                </div>

              </div>

              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtClave" placeholder="Clave" required>
                    <label for="lblClave">Clave</label>
                  </div>
                </div>

                <div class="col md-6">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtVlan" placeholder="VLAN" required>
                    <label for="lblVlan">VLAN</label>
                  </div>
                </div>

                <div class="col md-6">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtPotencia" placeholder="Potencia" required>
                    <label for="lblPotencia">Potencia</label>
                  </div>
                </div>

              </div>

              <div class="row g-2 mb-2">

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtSsid" placeholder="SSID" required>
                    <label for="lblSsid">SSID</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPassword" placeholder="Password" required>
                    <label for="lblPassword">Password</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtOtros" placeholder="Otros" required>
                    <label for="lblOtros">Otros</label>
                  </div>
                </div>

              </div>

              <div>
                <div class="col-md">
                  <div class="form-floating">
                    <textarea type="text" class="form-control" id="txtaProcedimiento" placeholder="Procedimiento de Solución" required></textarea>
                    <label for="lblProcedimiento">Procedimiento de Solución</label>
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
                    <label for="lblPeriodo">Periodo</label>
                  </div>
                </div>

              </div>

              <div class="row g-2 mb-2">
                <div class="col md-6">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPotencia" placeholder="Potencia" required>
                    <label for="lblPotencia">Potencia</label>
                  </div>
                </div>

                <div class="col md-6">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtSintonizador" placeholder="Sintonizador">
                    <label for="lblSintonizador">Sintonizador</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="text" id="txtNumTriplexor" placeholder="N° Triplexor" class="form-control">
                      <label for="lblTriplexor">N° Triplexor</label>
                    </div>
                    <div class="form-floating">
                      <select class="form-select" id="slcTriplexor" aria-label="Selecciona una opción">
                        <option selected disabled>Seleccione</option>
                        <option value="1">No</option>
                        <option value="2">Activo</option>
                        <option value="3">Pasivo</option>
                      </select>
                      <label for="lblTriplexor">Triplexor</label>
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
                      <label for="lblSpliter">N° Spliter</label>
                    </div>
                    <div class="form-floating">
                      <select class="form-select" id="slcSpliter" aria-label="Selecciona una opción">
                        <option selected disabled>Seleccione</option>
                        <option value="1">1x3</option>
                        <option value="2">1x5</option>
                        <option value="3">1x8</option>
                      </select>
                      <label for="lblSpliter">Spliter</label>
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="txtCable" placeholder="Cable">
                      <label for="lblCable">Cable</label>
                    </div>
                    <div class="form-floating">
                      <input type="number" class="form-control" id="txtPrecioCable" placeholder="Precio del Cable" disabled>
                      <label for="lblPrecioCable">Precio del Cable</label>
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="number" class="form-control" id="txtConector" placeholder="Conectores">
                      <label for="lblConectores">Conectores</label>
                    </div>
                    <div class="form-floating">
                      <input type="number" class="form-control" id="txtPrecioConector" placeholder="Precio del Conector" disabled>
                      <label for="lblPrecioConector">Precio del Conector</label>
                    </div>
                  </div>
                </div>

              </div>

              <div>
                <div class="col-md">
                  <div class="form-floating">
                    <textarea type="text" class="form-control" id="txtaEstadoInicial" placeholder="Estado Inicial" required></textarea>
                    <label for="lblEstadoInicial">Estado Inicial</label>
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
                    <label>Periodo</label>
                  </div>
                </div>

              </div>

              <div class="row g-2 mb-2">
                <div class="col md-6">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPotencia" placeholder="Potencia" required>
                    <label for="lblPotencia">Potencia</label>
                  </div>
                </div>

                <div class="col md-6">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtSintonizador" placeholder="Sintonizador">
                    <label for="lblSintonizador">Sintonizador</label>
                  </div>
                </div>

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="text" id="txtNumTriplexor" class="form-control" placeholder="N° Triplexor">
                      <label for="lblTriplexor">N° Triplexor</label>
                    </div>
                    <div class="form-floating">
                      <select class="form-select" id="slcTriplexor" aria-label="Selecciona una opción">
                        <option selected disabled>Seleccione</option>
                        <option value="1">No</option>
                        <option value="2">Activo</option>
                        <option value="3">Pasivo</option>
                      </select>
                      <label for="lblTriplexor">Triplexor</label>
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
                      <label for="lblSpliter">N° Spliter</label>
                    </div>
                    <div class="form-floating">
                      <select class="form-select" id="slcSpliter" aria-label="Selecciona una opción">
                        <option selected disabled>Seleccione</option>
                        <option value="1">1x3</option>
                        <option value="2">1x5</option>
                        <option value="3">1x8</option>
                      </select>
                      <label for="lblSpliter">Spliter</label>
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="txtCable" placeholder="Cable">
                      <label for="lblCable">Cable</label>
                    </div>
                    <div class="form-floating">
                      <input type="number" class="form-control" id="txtPrecioCable" placeholder="Precio del Cable" disabled>
                      <label for="lblPrecioCable">Precio del Cable</label>
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="number" class="form-control" id="txtConector" placeholder="Conectores">
                      <label for="lblConectores">Conectores</label>
                    </div>
                    <div class="form-floating">
                      <input type="number" class="form-control" id="txtPrecioConector" placeholder="Precio del Conector" disabled>
                      <label for="lblPrecioConector">Precio del Conector</label>
                    </div>
                  </div>
                </div>

              </div>

              <div>
                <div class="col-md">
                  <div class="form-floating">
                    <textarea type="text" class="form-control" id="txtaProcedimiento" placeholder="Procedimiento de Solución"></textarea>
                    <label for="lblProcedimiento">Procedimiento de Solución</label>
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
            <button type="button" id="btnCodigoBarra" class="btn btn-warning">Verificar Código</button>
            <button type="submit" id="btnRegistrarSoporte" class="btn btn-primary">Registrar Soporte</button>
            <button type="reset" id="btnCancelar" class="btn btn-outline-secondary">Cancelar Proceso</button>
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