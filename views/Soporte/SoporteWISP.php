<?php require_once '../../header.php'; ?>

<link rel="stylesheet" href="../../css/diseñoGlobal.css" />

<!-- Modal para Añadir Antena -->
<div class="modal fade" id="mdlAntena" tabindex="-1" aria-labelledby="exampleModalLabelAntena" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabelAntena">
          <i class="fas fa-plus-circle"></i> Añadir Antena
        </h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="mdlAntenaBody">
        <!-- Contenido del modal para añadir antena -->
        <div class="row g-2 mb-2">
          <div class="col-12">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCodigoBarrasAntena" placeholder="Código de Barras">
                <label for="txtCodigoBarrasAntena">Código de Barras <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              </div>
              <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
            </div>
          </div>
        </div>
        <div class="row g-2 mb-2">
          <div class="col-6">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtMarcaAntena" placeholder="Marca" disabled>
              <label for="txtMarcaAntena">Marca</label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
            </div>
          </div>
          <div class="col-6">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtModeloAntena" placeholder="Modelo" disabled>
              <label for="txtModeloAntena">Modelo</label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
            </div>
          </div>
        </div>
        <div class="row g-2 mb-2">
          <div class="col-6">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtSerieAntena" placeholder="Serie">
              <label for="txtSerieAntena">Serie <span class="required-asterisk" style="color: red;">*</span></label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
            </div>
          </div>
          <div class="col-6">
            <div class="form-floating">
              <select class="form-select" id="slcFrecuenciaAntena">
                <option value="" disabled selected>Seleccione una frecuencia</option>
                <option value="2.4GHz">2.4GHz</option>
                <option value="5GHz">5GHz</option>
              </select>
              <label for="slcFrecuenciaAntena">Frecuencia <span class="required-asterisk" style="color: red;">*</span></label>
              <div class="invalid-feedback">Por favor, seleccione una opción válida.</div>
            </div>
          </div>
        </div>
        <div class="row g-2 mb-2">
          <div class="col-12">
            <div class="form-floating">
              <textarea class="form-control" id="txtDescripcionAntena" placeholder="Descripción" style="height: 100px"></textarea>
              <label for="txtDescripcionAntena">Descripción</label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button type="button" id="btnAñadirAntena" class="btn btn-primary">
          <i class="fas fa-check"></i> Guardar
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Modal para Añadir Repetidor -->
<div class="modal fade" id="mdlRepetidor" tabindex="-1" aria-labelledby="exampleModalLabelRepetidor" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">
          <i class="fas fa-plus-circle"></i> Añadir Repetidor
        </h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="mdlRepetidorBody">
        <div class="row g-2 mb-2"> <!-- Ajuste de margen inferior -->
          <div class="col-6">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtSsidRepetidorModal" placeholder="SSID">
              <label for="lblSsid">SSID <span class="required-asterisk" style="color: red;">*</span></label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
            </div>
          </div>
          <div class="col-6">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtContraseniaRepetidorModal" placeholder="Contraseña">
              <label for="lblContraseniaRepetidor">Contraseña <span class="required-asterisk" style="color: red;">*</span></label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
            </div>
          </div>
        </div>
        <div class="row g-2 mb-2"> <!-- Ajuste de margen inferior -->
          <div class="col-6">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtSerieRepetidorModal" placeholder="Serie">
              <label for="lblSerieRepetidor">Serie <span class="required-asterisk" style="color: red;">*</span></label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
            </div>
          </div>
          <div class="col-6">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtIpRepetidorModal" placeholder="IP">
              <label for="lblIpRepetidor">IP <span class="required-asterisk" style="color: red;">*</span></label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
            </div>
          </div>
        </div>
        <div class="row g-2 mb-2"> <!-- Ajuste de margen inferior -->
          <div class="col-6">
            <div class="form-floating">
              <select class="form-select" id="slcCondicionRepetidor">
                <option value="venta">Venta</option>
                <option value="alquilado">Alquilado</option>
              </select>
              <label for="slcTipoRepetidor">Tipo <span class="required-asterisk" style="color: red;">*</span></label>
              <div class="invalid-feedback">Por favor, seleccione una opción válida.</div>
            </div>
          </div>
          <div class="col-6">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCodigoBarrasRepetidorModal" placeholder="Codigo de barras">
                <label for="lblCodigoBarrasRepetidor">Codigo de barras <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              </div>
              <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
            </div>
          </div>
        </div>
        <div class="row g-2 mb-2"> <!-- Ajuste de margen inferior -->
          <div class="col-6">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtMarcaRepetidorModal" placeholder="Marca" disabled>
              <label for="lblMarcaRepetidor">Marca <span class="required-asterisk" style="color: red;">*</span></label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
            </div>
          </div>
          <div class="col-6">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtModeloRepetidorModal" placeholder="Modelo" disabled>
              <label for="lblModeloRepetidor">Modelo <span class="required-asterisk" style="color: red;">*</span></label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
            </div>
          </div>
        </div>
        <div class="row g-2 mb-2"> <!-- Ajuste de margen inferior -->
          <div class="col-6">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtPrecioRepetidorModal" placeholder="Precio" disabled>
              <label for="lblPrecioRepetidor">Precio <span class="required-asterisk" style="color: red;">*</span></label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button type="button" id="btnAñadirRepetidor" class="btn btn-primary">
          <i class="fas fa-check"></i> Guardar
        </button>
      </div>
    </div>
  </div>
</div>

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

        <!-- Segunda Fila -->

        <div class="row g-2 mb-2">
          <div class="col-md-10">
            <label for="slcWireless">Tipo de Dispositivo</label>
            <select class="form-select" id="slcWireless">
              <option value="" disabled selected>Seleccione una opción</option>
            </select>
          </div>
          <div class="col-md-2 d-flex align-items-end">
            <button id="btnInformacion" class="btn btn-primary">Ver más</button>
          </div>
        </div>

        <div id="parametrosContainer" style="display:none">
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
                <input type="text" class="form-control" id="txtAcceso" placeholder="Fecha" required disabled>
                <label>Acceso(lan)</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtSenial" placeholder="Señal" required disabled>
                <div class="invalid-feedback">Por favor, ingrese su valor válido (-90 a -20).</div>
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

        </div>

        <!-- Contenedor para la card de parámetros -->
        <div id="cardParametros" style="display: none;">
          <div class="card mt-4">
            <div class="card-body">
              <h5 class="card-title">Parámetros del Router</h5>
              <p class="card-text">
                <!-- Aquí se mostrarán los datos de los parámetros -->
                <strong>Base:</strong> <span id="paramBase"></span><br>
                <strong>IP:</strong> <span id="paramIp"></span><br>
                <strong>Acceso:</strong> <span id="paramAcceso"></span><br>
                <strong>Señal:</strong> <span id="paramSenial"></span><br>
                <strong>Router SSID:</strong> <span id="paramRouterSsid"></span><br>
                <strong>Seguridad:</strong> <span id="paramRouterSeguridad"></span><br>
                <strong>Puerta de Enlace:</strong> <span id="paramRouterpuertaEnlace"></span><br>
                <strong>WAN:</strong> <span id="paramRouterWan"></span><br>
              </p>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <textarea type="text" class="form-control" id="txtaEstadoInicial" style="height: 100px" placeholder="Fecha" disabled></textarea>
                <label>Estado Inicial</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenedor para la card de parámetros del repetidor -->
        <div id="cardParametrosRepetidor" style="display: none;">
          <div class="card mt-4">
            <div class="card-body">
              <h5 class="card-title">Parámetros del Repetidor</h5>
              <p class="card-text">
                <!-- Aquí se mostrarán los datos de los parámetros del repetidor -->
                <strong>SSID:</strong> <span id="paramRepetidorSsid"></span><br>
                <strong>IP:</strong> <span id="paramRepetidorIp"></span><br>
                <strong>Acceso:</strong> <span id="paramRepetidorAcceso"></span><br>
                <strong>Condición:</strong> <span id="paramRepetidorCondicion"></span><br>
                <strong>Marca:</strong> <span id="paramRepetidorMarca"></span><br>
                <strong>Modelo:</strong> <span id="paramRepetidorModelo"></span><br>
                <strong>Serie:</strong> <span id="paramRepetidorSerie"></span><br>
                <strong>Precio:</strong> <span id="paramRepetidorPrecio"></span><br>
              </p>
            </div>
          </div>
        </div>

        <hr>

        <!-- Cambios Técnicos -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="mb-0">Cambios Wireless</h5>
          <div>
            <button type="button" class="btn btn-primary btn-md me-2" data-bs-toggle="modal" data-bs-target="#mdlRepetidor">
              <i class="fas fa-plus-circle"></i> Añadir Repetidor
            </button>
            <button type="button" class="btn btn-primary btn-md" data-bs-toggle="modal" data-bs-target="#mdlAntena">
              <i class="fas fa-plus-circle"></i> Añadir Antena
            </button>
          </div>
        </div>

        <!-- Contenedor para el formulario de cambios de router -->
        <div id="formularioCambiosRouter" style="display: none;">
          <!-- Aquí va el formulario de cambios de router -->
          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtBaseNuevo" placeholder="Fecha" disabled>
                <label>Base</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtIpNuevo" placeholder="Fecha">
                <label>IP (Lan)</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtAccesoNuevo" placeholder="Fecha">
                <label>Acceso (Lan)</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtSenialNuevo" placeholder="Fecha" min="-90" max="-20">
                <div class="invalid-feedback">Por favor, ingrese su valor válido (-90 a -20).</div>
                <label>Señal (ST)</label>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterCambioSsid" placeholder="Base">
                <label>Router SSID (Nombre)</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterCambioSeguridad" placeholder="IP">
                <label>Seguridad (Clave)</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterCambiopuertaEnlace" placeholder="Señal">
                <label>Puerta de Enlace</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterCambioWan" placeholder="Señal">
                <label>WAN</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenedor para el formulario de cambios de repetidor -->
        <div id="formularioCambiosRepetidor" style="display: none;">
          <!-- Aquí va el formulario de cambios de repetidor -->
          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorCambioSsid" placeholder="SSID">
                <label>Repetidor SSID (Nombre)</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorCambioIp" placeholder="IP">
                <label>IP (Lan)</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorCambioAcceso" placeholder="Acceso">
                <label>Acceso (Lan)</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <select class="form-select" id="slcRepetidorCambioCondicion">
                  <option value="venta">Venta</option>
                  <option value="alquilado">Alquilado</option>
                </select>
                <label>Condición</label>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorCambioMarca" placeholder="Marca" disabled>
                <label>Marca</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorCambioModelo" placeholder="Modelo" disabled>
                <label>Modelo</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorCambioSerie" placeholder="Serie" disabled>
                <label>Serie</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorCambioPrecio" placeholder="Precio" disabled>
                <label>Precio</label>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md">
          <div class="form-floating">
            <textarea type="text" class="form-control" id="txtaProceSolucion" style="height: 100px" placeholder="Fecha"></textarea>
            <label>Procedimiento de Solución</label>
          </div>
        </div> <!-- Fin de la Tercera Fila -->

        <!-- Checkbox de confirmación -->
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="chkConfirmacion">
          <label class="form-check-label" for="chkConfirmacion">
            Completar Campos
          </label>
        </div>

      </form>

    </div>
  </div>
</div>

<?php require_once "../../footer.php"; ?>

<script type="module" src="../../js/SoporteWisp.js"></script>
</body>

</html>