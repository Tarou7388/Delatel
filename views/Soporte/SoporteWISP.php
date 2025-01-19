<?php require_once '../../header.php'; ?>

<link rel="stylesheet" href="../../css/diseñoGlobal.css" />

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
            <button id="btnInformacion" class="btn btn-dark">Ver más</button>
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
                <label>Acceso (LAN)</label>
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

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterCodigoBarra" placeholder="Código de Barra" required disabled>
                <label>Código de Barra</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterMarca" placeholder="Marca" required disabled>
                <label>Marca</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterModelo" placeholder="Modelo" required disabled>
                <label>Modelo</label>
              </div>
            </div>
          </div>
        </div>
        <div id="parametrosContainer" style="display: none;">
          <!-- Aquí va el formulario de cambios de repetidor -->
          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorSsid" placeholder="SSID">
                <label>Repetidor SSID (Nombre)</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorIp" placeholder="IP">
                <label>IP (Lan)</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorAcceso" placeholder="Acceso">
                <label>Acceso (Lan)</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <select class="form-select" id="slcRepetidorCondicion">
                  <option value="" disabled selected>Seleccione una Condición</option>
                  <option value="venta">Venta</option>
                  <option value="alquilado">Alquilado</option>
                </select>
                <label>Condición</label>
              </div>
            </div>
            <div class="col-md-4">
              <div class="input-group">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtRepetidorCodigoBarra" placeholder="Código de Barra">
                  <label>Código de Barra</label>
                </div>
                <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorMarca" placeholder="Marca" disabled>
                <label>Marca</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorModelo" placeholder="Modelo" disabled>
                <label>Modelo</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorSerie" placeholder="Serie" disabled>
                <label>Serie</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorPrecio" placeholder="Precio" disabled>
                <label>Precio</label>
              </div>
            </div>
          </div>
        </div>
        <div id="parametrosContainer" style="display:none;">
          <!-- Contenido del modal para añadir antena -->
          <div class="row g-2 mb-2">
            <div class="col-12">
              <div class="input-group">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtAntenaMac" placeholder="Código de Barras">
                  <label for="txtAntenaMac">Código de Barras <span class="required-asterisk" style="color: red;">*</span></label>
                  <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
                </div>
                <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
              </div>
            </div>
          </div>
          <div class="row g-2 mb-2">
            <div class="col-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtAntenaMarca" placeholder="Marca" disabled>
                <label for="txtMarcaAntena">Marca</label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtAntenaModelo" placeholder="Modelo" disabled>
                <label for="txtAntenaModelo">Modelo</label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              </div>
            </div>
          </div>
          <div class="row g-2 mb-2">
            <div class="col-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtAntenaSerial" placeholder="Serie">
                <label for="txtAntenaSerial">Serie <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating">
                <select class="form-select" id="slcFrecuenciaAntena">
                  <option value="" disabled selected>Seleccione una frecuencia</option>
                  <option value="2.4GHZ">2.4GHz</option>
                  <option value="5GHZ">5GHz</option>
                </select>
                <label for="slcFrecuenciaAntena">Frecuencia <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, seleccione una opción válida.</div>
              </div>
            </div>
          </div>
          <div class="row g-2 mb-2">
            <div class="col-12">
              <div class="form-floating">
                <textarea class="form-control" id="txtAntenaDescripcion" placeholder="Descripción" style="height: 100px"></textarea>
                <label for="txtAntenaDescripcion">Descripción</label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenedor para la card de parámetros -->
        <div id="cardParametros" style="display: none;">
          <div class="card mt-4">
            <div class="card-body">
              <h5 class="card-title">Parámetros del Router</h5>
              <div class="row">
                <div class="col-6"><strong>Base:</strong> <span id="paramBase"></span></div>
                <div class="col-6"><strong>IP:</strong> <span id="paramIp"></span></div>
                <div class="col-6"><strong>Acceso:</strong> <span id="paramAcceso"></span></div>
                <div class="col-6"><strong>Señal:</strong> <span id="paramSenial"></span></div>
                <div class="col-6"><strong>Router SSID:</strong> <span id="paramRouterSsid"></span></div>
                <div class="col-6"><strong>Seguridad:</strong> <span id="paramRouterSeguridad"></span></div>
                <div class="col-6"><strong>Puerta de Enlace:</strong> <span id="paramRouterpuertaEnlace"></span></div>
                <div class="col-6"><strong>WAN:</strong> <span id="paramRouterWan"></span></div>
                <div class="col-6"><strong>Código de Barra:</strong> <span id="paramRouterCodigoBarra"></span></div>
                <div class="col-6"><strong>Marca:</strong> <span id="paramRouterMarca"></span></div>
                <div class="col-6"><strong>Modelo:</strong> <span id="paramRouterModelo"></span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenedor para la card de parámetros del repetidor -->
        <div id="cardParametrosRepetidor" style="display: none;">
          <div class="card mt-4">
            <div class="card-body">
              <h5 class="card-title">Parámetros del Repetidor</h5>
              <div class="row">
                <div class="col-6"><strong>SSID:</strong> <span id="paramRepetidorSsid"></span></div>
                <div class="col-6"><strong>IP:</strong> <span id="paramRepetidorIp"></span></div>
                <div class="col-6"><strong>Acceso:</strong> <span id="paramRepetidorAcceso"></span></div>
                <div class="col-6"><strong>Condición:</strong> <span id="paramRepetidorCondicion"></span></div>
                <div class="col-6"><strong>Código de Barra:</strong> <span id="paramRepetidorCodigoBarra"></span></div>
                <div class="col-6"><strong>Marca:</strong> <span id="paramRepetidorMarca"></span></div>
                <div class="col-6"><strong>Modelo:</strong> <span id="paramRepetidorModelo"></span></div>
                <div class="col-6"><strong>Serie:</strong> <span id="paramRepetidorSerie"></span></div>
                <div class="col-6"><strong>Precio:</strong> <span id="paramRepetidorPrecio"></span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenedor para la card de parámetros de Antena -->
        <div id="cardParametrosAntena" style="display: none;">
          <div class="card mt-4">
            <div class="card-body">
              <h5 class="card-title">Parámetros de la Antena</h5>
              <div class="row">
                <div class="col-6"><strong>Mac:</strong> <span id="paramAntenaMac"></span></div>
                <div class="col-6"><strong>Marca:</strong> <span id="paramAntenaMarca"></span></div>
                <div class="col-6"><strong>Modelo:</strong> <span id="paramAntenaModelo"></span></div>
                <div class="col-6"><strong>Serie:</strong> <span id="paramAntenaSerial"></span></div>
                <div class="col-6"><strong>Frecuencia:</strong> <span id="paramAntenaFrecuencia"></span></div>
                <div class="col-6"><strong>Descripción:</strong> <span id="paramAntenaDescripcion"></span></div>
              </div>
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
          </div>
        </div>

        <!-- Contenedor para el formulario de cambios de router -->
        <div id="formularioCambiosRouter" style="display: none;">
          <!-- Aquí va el formulario de cambios de router -->
          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtBaseNuevo" placeholder="Base" disabled>
                <label>Base</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtIpNuevo" placeholder="IP (Lan)">
                <label>IP (Lan) <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, complete el campo.</div>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtAccesoNuevo" placeholder="Acceso (Lan)">
                <label>Acceso (Lan) <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, complete el campo.</div>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtSenialNuevo" placeholder="Señal (ST)" min="-90" max="-20">
                <div class="invalid-feedback">Por favor, ingrese su valor válido (-90 a -20).</div>
                <label>Señal (ST) <span class="required-asterisk" style="color: red;">*</span></label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterCambioSsid" placeholder="SSID">
                <label>Router SSID (Nombre) <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, complete el campo.</div>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterCambioSeguridad" placeholder="SEguridad">
                <label>Seguridad (Clave) <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, complete el campo.</div>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterCambiopuertaEnlace" placeholder="Puerta de Enlace">
                <label>Puerta de Enlace <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, complete la Puerta de Enlace.</div>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterCambioWan" placeholder="Wan">
                <label>WAN <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, complete el campo.</div>
              </div>
            </div>

            <div class="col-md">
              <div class="input-group">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtRouterCambioCodigoBarra" placeholder="Código de Barra">
                  <label>Código de Barra <span class="required-asterisk" style="color: red;">*</span></label>
                  <div class="invalid-feedback">Por favor, complete el campo.</div>
                </div>
                <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterCambioMarca" placeholder="Marca" disabled>
                <label>Marca</label>
              </div>
            </div>

            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRouterCambioModelo" placeholder="Modelo" disabled>
                <label>Modelo</label>
              </div>
            </div>
          </div>
          <hr>
        </div>

        <!-- Contenedor para el formulario de cambios de repetidor -->
        <div id="formularioCambiosRepetidor" style="display: none;">
          <!-- Aquí va el formulario de cambios de repetidor -->
          <div class="row g-2 mb-2">
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorCambioSsid" placeholder="SSID">
                <label>Repetidor SSID (Nombre) <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, complete el campo.</div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorCambioIp" placeholder="IP">
                <label>IP (Lan) <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, complete el campo.</div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorCambioAcceso" placeholder="Acceso">
                <label>Acceso (Lan) <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, complete el campo.</div>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md-4">
              <div class="form-floating">
                <select class="form-select" id="slcRepetidorCambioCondicion">
                  <option value="" disabled selected>Seleccione una Condición</option>
                  <option value="venta">Venta</option>
                  <option value="alquilado">Alquilado</option>
                </select>
                <label>Condición <span class="required-asterisk" style="color: red;">*</span></label>
              </div>
            </div>

            <div class="col-md-4">
              <div class="input-group">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtRepetidorCambioCodigoBarra" placeholder="Código de Barra">
                  <label>Código de Barra <span class="required-asterisk" style="color: red;">*</span></label>
                  <div class="invalid-feedback">Por favor, complete el campo.</div>
                </div>
                <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorCambioSerie" placeholder="Serie">
                <label>Serie <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, complete el campo.</div>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorCambioMarca" placeholder="Marca" disabled>
                <label>Marca</label>
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorCambioModelo" placeholder="Modelo" disabled>
                <label>Modelo</label>
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRepetidorCambioPrecio" placeholder="Precio" disabled>
                <label>Precio</label>
              </div>
            </div>
          </div>
          <hr>
        </div>

        <!-- Contenedor para el formulario de cambios de Antena -->
        <div id="formularioCambiosAntena" style="display: none;">
          <div class="row g-2 mb-2">
            <div class="col-12">
              <div class="input-group">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtAntenaMacCambios" placeholder="Código de Barras">
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
                <input type="text" class="form-control" id="txtAntenaMarcaCambios" placeholder="Marca" disabled>
                <label for="txtMarcaAntena">Marca</label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtAntenaModeloCambios" placeholder="Modelo" disabled>
                <label for="txtModeloAntena">Modelo</label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              </div>
            </div>
          </div>
          <div class="row g-2 mb-2">
            <div class="col-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtAntenaSerialCambios" placeholder="Serie">
                <label for="txtSerieAntena">Serie <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating">
                <select class="form-select" id="slcFrecuenciaAntenaCambios">
                  <option value="" disabled selected>Seleccione una frecuencia</option>
                  <option value="2.4GHZ">2.4GHz</option>
                  <option value="5GHZ">5GHz</option>
                </select>
                <label for="slcFrecuenciaAntena">Frecuencia <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, seleccione una opción válida.</div>
              </div>
            </div>
          </div>
          <div class="row g-2 mb-2">
            <div class="col-12">
              <div class="form-floating">
                <textarea class="form-control" id="txtAntenaDescripcionCambios" placeholder="Descripción" style="height: 100px"></textarea>
                <label for="txtDescripcionAntena">Descripción <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              </div>
            </div>
          </div>

          <hr>
        </div>

        <div class="row g-2 mb-2"> <!-- Ajuste de margen inferior -->
          <div class="col-md">
            <div class="form-floating">
              <textarea type="text" class="form-control" id="txtaEstadoInicial" style="height: 100px" placeholder="Fecha" disabled></textarea>
              <label>Estado Inicial</label>
            </div>
          </div>
        </div>

        <div class="row g-2 mb-2"> <!-- Ajuste de margen inferior -->
          <div class="col-md">
            <div class="form-floating">
              <textarea type="text" class="form-control" id="txtaProceSolucion" style="height: 100px" placeholder="Fecha" required></textarea>
              <label>Procedimiento de Solución <span class="required-asterisk" style="color: red;">*</span></label>
              <div class="invalid-feedback">Por favor, complete el campo.</div>
            </div>
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