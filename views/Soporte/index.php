<?php require_once '../../header.php'; ?>
<?php $host = $_ENV['HOST']; ?>

<div class="container-fluid px-4">
  <h1 class="mt-4">Ficha de Control de Averías</h1>

  <!-- MODAL DE CONTRATOS -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Selecciona un Plan</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <ul class="list-group">
            <!-- AQUI SE CARGARAN LAS OPCIONES DE CONTRATOS -->
          </ul>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>

  <div class="row g-2 mb-2 align-items-center">
    <div class="col text-start">
      <a href="<?= $host; ?>views/Soporte/">Inicio</a> /
    </div>
    <div class="col text-end">
      <div class="d-flex flex-wrap justify-content-end align-items-center">
        <a href="<?= $host; ?>views/Soporte/listarSoporte" class="btn btn-primary me-2">
          Listar Soporte <i class="fa-solid fa-arrow-right"></i>
        </a>
        <input type="date" class="form-control text-center" id="txtFecha" placeholder="Fecha" disabled style="max-width: 150px;">
      </div>
    </div>
  </div>

  <div class="card mb-4">
    <div class="card-header">
      <i class="fas fa-table me-1"></i> Complete los Datos del Soporte
    </div>
    <div class="card-body">
      <!-- Sección de Número de Documento -->
      <div class="row g-2 mb-2">
        <div class="col-12 col-md">
          <div class="input-group">
            <div class="form-floating">
              <input type="tel" class="form-control" maxlength="11" minlength="11" pattern="[0-9]+" id="txtNrodocumento" placeholder="Número de Documento" autofocus required>
              <label for="txtNrodocumento">Número de Documento</label>
            </div>
            <button class="input-group-text btn btn-primary" type="button" id="btnNrodocumento">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>

        <div class="col-12 col-md mt-2">
          <div class="form-floating">
            <input type="text" class="form-control" id="txtCliente" placeholder="Cliente" disabled>
            <label for="txtCliente">Cliente</label>
          </div>
        </div>

        <div class="col-12 col-md mt-2">
          <div class="form-floating d-flex">
            <button id="btnModal" type="button" class="btn btn-info w-100" style="height: 100%;" data-bs-toggle="modal" data-bs-target="#exampleModal">Seleccionar</button>
          </div>
        </div>

        <div class="col-12 col-md mt-2">
          <div class="form-floating">
            <select class="form-select" id="slcPrioridad" required>
              <option selected disabled>Seleccione la Prioridad</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
              <option value="Incidencia">Incidencia</option>
            </select>
            <label for="slcPrioridad">Prioridad:</label>
          </div>
        </div>
      </div>

    <hr> 

    <!-- Sección de Observaciones y Contrato -->

    <div class="row g-3 mb-3">
      <div class="col-12 col-md mt-2">
        <div class="form-floating">
          <input type="text" class="form-control" id="NmContratoObservacion" placeholder="Contrato y Observacion" disabled>
          <label for="NmContratoObservacion">Contrato y Observacion</label>
        </div>
      </div>
    </div>


    <!-- Sección de Descripción -->
    <div class="row g-3 mb-3">
      <div class="col">
        <div class="form-floating">
          <textarea class="form-control" id="txtDescripcion" rows="3" placeholder="Descripción de la incidencia" style="height: 100px" required></textarea>
          <label for="txtDescripcion">Descripción</label>
        </div>
      </div>
    </div>

    <!-- Sección de Solución -->
    <div class="row g-3 mb-3">
      <div class="col">
        <div class="form-floating">
          <textarea class="form-control" id="txtSolucion" rows="3" placeholder="Solución aplicada" style="height: 100px" required></textarea>
          <label for="txtSolucion">Solución</label>
        </div>
      </div>
    </div>

    <hr>

    <!-- Botones de acción -->
    <div class="container text-end">
      <button class="btn btn-secondary">Ficha Soporte</button>
      <button class="btn btn-primary">Registrar</button>
    </div>
  </div>

  <div class="container">
    <nav class="mt-2">
      <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview">

        <!-- ***INCIO WISP FICHA *** -->
        <li class="nav-item menu-open" id="lstWisp" hidden>
          <!-- 
            ***
            ***INICIO WISP FICHA
            ***
            -->
          <form id="Form-FichaWisp">
            <!-- Inicio de Parametros de WISP -->
            <!-- Primera Fila -->
            <h5>Parámetros Wireless</h5>
            <div class="row g-2 mb-2">

              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtBaseWisp" placeholder="Base"> <!-- required -->
                  <label for="txtBaseWisp">Base</label>
                </div>
              </div>

              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtIpWisp" placeholder="IP"> <!-- required -->
                  <label for="txtIpWisp">IP</label>
                </div>
              </div>

              <div class="col-md">
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtSenialWisp" placeholder="Señal"> <!-- required -->
                  <label for="txtSenialWisp">Señal</label>
                </div>
              </div>
            </div>

            <!-- Inicio de la Segunda Fila -->
            <div>
              <div class="col-md">
                <div class="form-floating">
                  <textarea type="text" class="form-control" id="txtEstadoInicialWisp" placeholder="Estado Inicial" style="height: 100px"></textarea> <!-- required -->
                  <label for="txtEstadoInicialWisp">Estado Inicial</label>
                </div>
              </div>
            </div> <!-- Fin de Segunda Fila -->

            <br>

            <!-- Tercera Fila -->
            <h5>Cambios Wireless</h5>
            <div class="row g-2 mb-2">
              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosBaseWisp" placeholder="Nueva Base">
                  <label for="txtCambiosBaseWisp">Nueva Base</label>
                </div>
              </div>

              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosIpWisp" placeholder="Nuevo IP">
                  <label for="txtCambiosIpWisp">Nuevo IP</label>
                </div>
              </div>

              <div class="col-md">
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtCambiosSenialWisp" placeholder="Señal">
                  <label for="txtCambiosSenialWisp">Señal</label>
                </div>
              </div>
            </div> <!-- Fin de la Tercera Fila -->
            <!-- Cuarta Fila -->
            <div>
              <div class="col-md">
                <div class="form-floating">
                  <textarea type="text" class="form-control" id="txtProcedimientoWisp" style="height: 100px" placeholder="Procedimiento de Solución"></textarea> <!-- required -->
                  <label for="txtProcedimientoWisp">Procedimiento de Solución</label>
                </div>
              </div>
            </div> <!-- Fin de la Cuarta Fila -->

            <div class="col-md mt-4 text-end">
              <button type="submit" id="btnRegistrarSoporteWisp" class="btn btn-success mb-2 me-md-2">Registrar Soporte</button>
              <button type="reset" id="btnCancelar" class="btn btn-secondary mb-2">Cancelar Proceso</button>
            </div>
          </form>
        </li>
        <!-- ***FIN WISP FICHA *** -->

        <!-- ***INICIO GPON FICHA***-->
        <li class="nav-item menu-open" id="lstGpon" hidden>
          <form id="Form-FichaGpon">
            <h5>Parámetros de Gpon</h5>

            <div class="row g-2 mb-2">

              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtPppoeGpon" placeholder="PPPoE" required> <!-- required -->
                  <label for="txtPppoeGpon">PPPoE</label>
                </div>
              </div>

              <div class="col-md">
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtPotenciaGpon" placeholder="Potencia" min="-30" max="24" required> <!-- required -->
                  <label for="txtPotenciaGpon">Potencia</label>
                </div>
              </div>

              <div class="col-md-4 d-flex flex-column align-items-start justify-content-end">
                <label class="form-check-label mb-1" for="chkCatvGpon">CATV</label>
                <div class="form-check form-switch d-flex align-items-center">
                  <input class="form-check-input" type="checkbox" id="chkCatvGpon">
                  <span id="checkboxTextGpon" class="ms-2">No</span>
                </div>
              </div>

            </div>

            <div class="row g-2 mb-2">

              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtClaveGpon" placeholder="Clave" required> <!-- required -->
                  <label for="txtClaveGpon">Clave</label>
                </div>
              </div>

              <div class="col-md">
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtVlanGpon" placeholder="Vlan" required> <!-- required -->
                  <label for="txtVlanGpon">VLAN</label>
                </div>
              </div>

              <div class="col-md">
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtPotenciaGpon" placeholder="Potencia" min="-30" max="24" required> <!-- required -->
                  <label for="txtPotenciaGpon">Potencia</label>
                </div>
              </div>

            </div>

            <div class="row g-2 mb-2">

              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtSsidGpon" placeholder="SSID" required> <!-- required -->
                  <label for="txtSsidGpon">SSID</label>
                </div>
              </div>

              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtPasswordGpon" placeholder="Password" required> <!-- required -->
                  <label for="txtPasswordGpon">Password</label>
                </div>
              </div>

              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtOtrosGpon" placeholder="Otros" required> <!-- required -->
                  <label for="txtOtrosGpon">Otros</label>
                </div>
              </div>

            </div>

            <div>
              <div class="col-md">
                <div class="form-floating">
                  <textarea type="text" class="form-control" id="txtEstadoInicialGpon" placeholder="Estado Inicial" required></textarea> <!-- required -->
                  <label for="txtEstadoInicialGpon">Estado Inicial</label>
                </div>
              </div>
            </div>


            <hr>

            <h5>Cambios Técnicos de Gpon</h5>
            <div class="row g-2 mb-2">

              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosPppoeGpon" placeholder="PPPoE"> <!-- required -->
                  <label for="txtCambiosPppoeGpon">PPPoE</label>
                </div>
              </div>

              <div class="col-md">
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtCambiosPotenciaGpon" min="-30" max="24" placeholder="Potencia"> <!-- required -->
                  <label for="txtCambiosPotenciaGpon">Potencia</label>
                </div>
              </div>

              <div class="col-md-4 d-flex flex-column align-items-start justify-content-end">
                <label class="form-check-label mb-1" for="chkCambiosCatvGpon">CATV</label>
                <div class="form-check form-switch d-flex align-items-center">
                  <input class="form-check-input" type="checkbox" id="chkCambiosCatvGpon">
                  <span id="checkboxTextCambiosCatv" class="ms-2">No</span>
                </div>
              </div>

            </div>

            <div class="row g-2 mb-2">

              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosClaveGpon" placeholder="Clave"> <!-- required -->
                  <label for="txtCambiosClaveGpon">Clave</label>
                </div>
              </div>

              <div class="col-md">
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtCambiosVlanGpon" placeholder="VLAN"> <!-- required -->
                  <label for="txtCambiosVlanGpon">VLAN</label>
                </div>
              </div>

              <div class="col-md">
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtCambiosPotenciaGpon" min="-30" max="24" placeholder="Potencia"> <!-- required -->
                  <label for="txtCambiosPotenciaGpon">Potencia</label>
                </div>
              </div>

            </div>

            <div class="row g-2 mb-2">

              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosSsidGpon" placeholder="SSID"> <!-- required -->
                  <label for="txtCambiosSsidGpon">SSID</label>
                </div>
              </div>

              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosPasswordGpon" placeholder="Password"> <!-- required -->
                  <label for="txtCambiosPasswordGpon">Password</label>
                </div>
              </div>

              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosOtrosGpon" placeholder="Otros"> <!-- required -->
                  <label for="txtCambiosOtrosGpon">Otros</label>
                </div>
              </div>

            </div>

            <div>
              <div class="col-md">
                <div class="form-floating">
                  <textarea type="text" class="form-control" id="txtCambiosProcedimientoGpon" placeholder="Procedimiento de Solución"></textarea> <!-- required -->
                  <label for="txtCambiosProcedimientoGpon">Procedimiento de Solución</label>
                </div>
              </div>
            </div>

            <div class="col-md mt-4 text-end">
              <button type="submit" id="btnRegistrarSoporteGpon" class="btn btn-success mb-2 me-md-2">Registrar Soporte</button>
              <button type="reset" id="btnCancelar" class="btn btn-secondary mb-2">Cancelar Proceso</button>
            </div>
          </form>
          <hr>
        </li>
        <!--***FIN GPON FICHA***-->

        <!--***INICIO CABLE FICHA***-->
        <li class="nav-item menu-open" id="lstCable" hidden>
          <form id="Form-FichaCable">
            <h5>Parámetros Cable</h5>

            <div class="row g-2 mb-2">

              <div class="col-md">
                <div class="form-floating">
                  <select class="form-select" id="slcPeriodoCable" aria-label="Selecciona una opción">
                    <option selected disabled>Elige una opción</option>
                    <option value="1">Mensual</option>
                    <option value="2">Contado</option>
                  </select>
                  <label for="slcPeriodoCable">Periodo</label>
                </div>
              </div>

            </div>

            <div class="row g-2 mb-2">
              <div class="col md-6">
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtPotenciaCable" placeholder="Potencia" min="-50" max="-7"> <!-- required -->
                  <label for="txtPotenciaCable">Potencia</label>
                </div>
              </div>

              <div class="col md-6">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtSintonizadorCable" placeholder="Sintonizador"> <!-- required -->
                  <label for="txtSintonizadorCable">Sintonizador</label>
                </div>
              </div>

              <div class="col-md">
                <div class="input-group">
                  <div class="form-floating">
                    <input type="text" id="txtNumTriplexorCable" placeholder="N° Triplexor" class="form-control"> <!-- required -->
                    <label for="txtNumTriplexorCable">N° Triplexor</label>
                  </div>
                  <div class="form-floating">
                    <select class="form-select" id="slcTriplexorCable" aria-label="Selecciona una opción">
                      <option selected disabled>Seleccione</option>
                      <option value="1">No</option>
                      <option value="2">Activo</option>
                      <option value="3">Pasivo</option>
                    </select>
                    <label for="slcTriplexorCable">Triplexor</label>
                  </div>
                </div>
              </div>

            </div>


            <hr>

            <div class="row g-2 mb-2">

              <div class="col-md">
                <div class="input-group">
                  <div class="form-floating">
                    <input type="text" id="txtNumSpliterCable" class="form-control" placeholder="N° Spliter">
                    <label for="txtNumSpliterCable">N° Spliter</label>
                  </div>
                  <div class="form-floating">
                    <select class="form-select" id="slcSpliterCable" aria-label="Selecciona una opción">
                      <option selected disabled>Seleccione</option>
                      <option value="1">1x3</option>
                      <option value="2">1x5</option>
                      <option value="3">1x8</option>
                    </select>
                    <label for="slcSpliterCable">Spliter</label>
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
                    <input type="number" class="form-control" id="txtPrecioCable" placeholder="1.50" disabled>
                    <label for="txtPrecioCable">Precio del Cable</label>
                  </div>
                </div>
              </div>

              <div class="col-md">
                <div class="input-group">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtConectorCable" placeholder="Conectores">
                    <label for="txtConectorCable">Conectores</label>
                  </div>
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtPrecioConectorCable" placeholder="1.50" disabled>
                    <label for="txtPrecioConectorCable">Precio del Conector</label>
                  </div>
                </div>
              </div>

            </div>

            <div>
              <div class="col-md">
                <div class="form-floating">
                  <textarea type="text" class="form-control" id="txtEstadoInicialCable" placeholder="Estado Inicial"></textarea> <!-- required -->
                  <label for="txtEstadoInicialCable">Estado Inicial</label>
                </div>
              </div>
            </div>

            <hr>

            <h5>Cambios Técnicos de Cable</h5>
            <div class="row g-2 mb-2">

              <div class="col-md">
                <div class="form-floating">
                  <select class="form-select" id="slcCambiosPeriodoCable" aria-label="Selecciona una opción" required>
                    <option selected disabled>Elige una opción</option>
                    <option value="1">Mensual</option>
                    <option value="2">Contado</option>
                  </select>
                  <label for="slcCambiosPeriodoCable">Periodo</label>
                </div>
              </div>

            </div>

            <div class="row g-2 mb-2">
              <div class="col-md-6">
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtCambiosPotenciaCable" placeholder="Potencia" min="-50" max="-7" required>
                  <label for="txtCambiosPotenciaCable">Potencia</label>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosSintonizadorCable" placeholder="Sintonizador" required>
                  <label for="txtCambiosSintonizadorCable">Sintonizador</label>
                </div>
              </div>

              <div class="col-md">
                <div class="input-group">
                  <div class="form-floating">
                    <input type="text" id="txtCambiosNumTriplexorCable" class="form-control" placeholder="N° Triplexor" required>
                    <label for="txtCambiosNumTriplexorCable">N° Triplexor</label>
                  </div>
                  <div class="form-floating">
                    <select class="form-select" id="slcCambiosTriplexorCable" aria-label="Selecciona una opción" required>
                      <option selected disabled>Seleccione</option>
                      <option value="1">No</option>
                      <option value="2">Activo</option>
                      <option value="3">Pasivo</option>
                    </select>
                    <label for="slcCambiosTriplexorCable">Triplexor</label>
                  </div>
                </div>
              </div>
            </div>

            <hr>

            <div class="row g-2 mb-2">

              <div class="col-md">
                <div class="input-group">
                  <div class="form-floating">
                    <input type="text" id="txtCambiosNumSpliterCable" class="form-control" placeholder="N° Spliter" required>
                    <label for="txtCambiosNumSpliterCable">N° Spliter</label>
                  </div>
                  <div class="form-floating">
                    <select class="form-select" id="slcCambiosSpliterCable" aria-label="Selecciona una opción" required>
                      <option selected disabled>Seleccione</option>
                      <option value="1">1x3</option>
                      <option value="2">1x5</option>
                      <option value="3">1x8</option>
                    </select>
                    <label for="slcCambiosSpliterCable">Spliter</label>
                  </div>
                </div>
              </div>

              <div class="col-md">
                <div class="input-group">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtCambiosCable" placeholder="Cable" required>
                    <label for="txtCambiosCable">Cable</label>
                  </div>
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtCambiosPrecioCable" placeholder="Precio del Cable" disabled>
                    <label for="txtCambiosPrecioCable">Precio del Cable</label>
                  </div>
                </div>
              </div>

              <div class="col-md">
                <div class="input-group">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtCambiosConectorCable" placeholder="Conectores" required>
                    <label for="txtCambiosConectorCable">Conectores</label>
                  </div>
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtCambiosPrecioConectorCable" placeholder="Precio del Conector" disabled>
                    <label for="txtCambiosPrecioConectorCable">Precio del Conector</label>
                  </div>
                </div>
              </div>

            </div>

            <div>
              <div class="col-md">
                <div class="form-floating">
                  <textarea type="text" class="form-control" id="txtProcedimientoCable" placeholder="Procedimiento de Solución" required></textarea>
                  <label for="txtProcedimientoCable">Procedimiento de Solución</label>
                </div>
              </div>
            </div>

            <div class="col-md mt-4 text-end">
              <button type="submit" id="btnRegistrarSoporteCable" class="btn btn-success mb-2 me-md-2">Registrar Soporte</button>
              <button type="reset" id="btnCancelar" class="btn btn-secondary mb-2">Cancelar Proceso</button>
            </div>
          </form>
          <hr>

        </li>
        <!--***FIN CABLE FICHA***-->
        <hr>

      </ul>
    </nav>
  </div>
</div>
</div>
</div>
<?php require_once "../../footer.php"; ?>

<script type="module" src="../../js/soporteEscritorio.js"></script>
<script type="module" src="../../js/WispSoporte.js"></script>
<script type="module" src="../../js/GponSoporte.js"></script>
<script type="module" src="../../js/CableSoporte.js"></script>
</body>

</html>