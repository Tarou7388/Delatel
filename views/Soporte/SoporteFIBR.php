<?php require_once '../../header.php'; ?>

<link rel="stylesheet" href="../../css/diseñoGlobal.css" />

<div class="modal fade" id="mdlRepetidor" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
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
                <label for="lblCodigoBarrasRepetidor">Codigo de Barra<span class="required-asterisk" style="color: red;">*</span></label>
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
  <h1 class="mt-4">Control de Averías Fibra</h1>

  <br>

  <div class="card mb-4">
    <div class="card-header">
      Complete los Datos
    </div>
    <div class="card-body">
      <form action="" id="frm-registro-fibr" autocomplete="off">

        <!-- Contenedor para los parámetros -->

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

        <!-- Segunda Fila -->

        <div class="">
          <div class="col-md-12"> <!-- Ajusta el ancho aquí -->
            <div class="form-floating">
              <select id="slcCaja" class="form-select">
                <option value="" disabled selected>Seleccione una opción</option>
              </select>
              <label for="slcCaja">Caja</label>
            </div>
          </div>

          <div id="parametrosContainer" style="display: none;">

            <div class="mt-3 mb-3">
              <h5> Datos del router </h5>
            </div>

            <!-- Primera Fila -->
            <div class="row g-3 mb-3 align-items-center">
              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtPppoe" placeholder="PPPoE" disabled>
                  <label for="txtPppoe">PPPoE</label>
                </div>
              </div>
              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtClave" placeholder="Clave" disabled>
                  <label for="txtClave">Clave</label>
                </div>
              </div>
              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtVlan" placeholder="VLAN" disabled>
                  <label for="txtVlan">VLAN</label>
                </div>
              </div>
              <div class="col-md d-flex align-items-center">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="chkCatv" checked disabled>
                  <label class="form-check-label ms-2" for="chkCatv">CATV</label>
                </div>
              </div>
            </div>

            <!-- Segunda Fila -->
            <div class="row g-3 mb-3 align-items-center">
              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtPotencia" placeholder="Potencia" disabled>
                  <label for="txtPotencia">Potencia</label>
                </div>
              </div>
              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtUsuarioRouter" placeholder="Usuario" disabled>
                  <label for="txtUsuarioRouter">Usuario del Router</label>
                </div>
              </div>
              <div class="col-md">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtContraseniaRouter" placeholder="Contraseña" disabled>
                  <label for="txtContraseniaRouter">Contraseña del Router</label>
                </div>
              </div>
            </div>

            <!-- Tercera Fila -->
            <div class="row g-3 mb-3 align-items-center">
              <div class="col-md-4">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtSsid" placeholder="SSID" disabled>
                  <label for="txtSsid">SSID</label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtPass" placeholder="Password" disabled>
                  <label for="txtPass">Password</label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtIpRouter" placeholder="IP" disabled>
                  <label for="txtIpRouter">IP</label>
                </div>
              </div>
            </div>

            <!-- Cuarta Fila -->
            <div class="row g-3 mb-3 align-items-center">
              <div class="col-md-4">
                <div class="input-group">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtCodigoBarraRouter" placeholder="Código de Barra" disabled>
                    <label for="txtCodigoBarraRouter">Código de Barra</label>
                  </div>
                  <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtMarcaRouter" placeholder="Marca" disabled>
                  <label for="txtMarcaRouter">Marca</label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtModeloRouter" placeholder="Modelo" disabled>
                  <label for="txtModeloRouter">Modelo</label>
                </div>
              </div>
            </div>

            <!-- Quinta Fila -->
            <div class="row g-3 mb-3 align-items-center">
              <div class="col-md-4">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtSerieRouter" placeholder="Serie" disabled>
                  <label for="txtSerieRouter">Serie</label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-floating">
                  <select class="form-select" id="slcBanda" disabled>
                    <option value="2G">2G</option>
                    <option value="5G" selected>5G</option>
                    <option value="2G,5G">5G-2G</option>
                  </select>
                  <label for="slcBanda">Banda</label>
                  <div class="invalid-feedback">Por favor, seleccione una opción válida.</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtAntenas" placeholder="Número de Antenas" min="2" max="10" value="2" disabled>
                  <label for="txtAntenas">N° de Antenas</label>
                  <div class="invalid-feedback">Por favor, ingrese un valor válido (2 a 10).</div>
                </div>
              </div>
            </div>

            <!-- repetidor -->
            <div class="repetidor-container">
              <div class="mt-3 mb-3">
                <h5> Datos del repetidor </h5>
              </div>

              <div class="row g-3 mb-3 align-items-center">
                <div class="col-mb-4">
                  <div class="form-floating">
                    <select id="slcRpetidor" class="form-select">
                      <option value="" disabled selected>Seleccione una opción</option>
                    </select>
                    <label for="slcRpetidor">Repetidor</label>
                  </div>
                </div>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-md-4">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtSSIDRepetidor" placeholder="SSID" disabled>
                    <label for="txtSsid">SSID</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtPassRepetidor" placeholder="Password" disabled>
                    <label for="txtPass">Password</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtIpRepetidor" placeholder="IP" disabled>
                    <label for="txtIpRepetidor">IP</label>
                  </div>
                </div>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-md-4">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="txtCodigoBarraRepetidor" placeholder="Código de Barra" disabled>
                      <label for="txtCodigoBarraRepetidor">Código de Barra</label>
                    </div>
                    <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtMarcaRepetidor" placeholder="Marca" disabled>
                    <label for="txtMarcaRepetidor">Marca</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtModeloRepetidor" placeholder="Modelo" disabled>
                    <label for="txtModeloRepetidor">Modelo</label>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <hr>

        <!-- Cambios Técnicos -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="mb-0">Cambios Técnicos de Fibra</h5>
          <button type="button" class="btn btn-primary btn-md" data-bs-toggle="modal" data-bs-target="#mdlRepetidor">
            <i class="fas fa-plus-circle"></i> Añadir Repetidor
          </button>
        </div>

        <div class="row mb-2">
          <div class="col-12 col-md-10 mb-2">
            <div class="form-floating">
              <select id="slcEquipo" class="form-select">
                <option value="" disabled selected>Seleccione el tipo de equipo</option>
              </select>
              <label for="slcEquipo">Tipo de Equipo</label>
            </div>
          </div>
          <div class="col-12 col-md-2">
            <div class="form-floating">
              <button id="btnInformacion" class="btn btn-dark w-100">Ver más</button>
            </div>
          </div>
        </div>

        <div id="cardContainer"></div>

        <hr>

        <div id="routerCambiosContainer" style="display: none;">
          <!-- Primera Fila -->
          <div class="row g-3 mb-3 align-items-center">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCambiosPppoe" placeholder="PPPoE" disabled>
                <label for="txtCambiosPppoe">PPPoE</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCambiosClave" placeholder="Clave" disabled>
                <label for="txtCambiosClave">Clave</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCambiosVlan" placeholder="VLAN">
                <label for="txtCambiosVlan">VLAN</label>
              </div>
            </div>
            <div class="col-md d-flex align-items-center">
              <div class="form-check form-switch tgl-default">
                <input class="form-check-input" type="checkbox" id="chkCambiosCatv" checked>
                <label class="form-check-label ms-2" for="chkCambiosCatv">CATV</label>
              </div>
            </div>
          </div>

          <!-- Segunda Fila -->
          <div class="row g-3 mb-3 align-items-center">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCambiosPotencia" name="txtCambiosPotencia" placeholder="Potencia" min="-30" max="40">
                <label for="txtCambiosPotencia">Potencia <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback"></div>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCambiosUsuarioRouter" name="txtCambiosUsuarioRouter" placeholder="Usuario">
                <label for="txtCambiosUsuarioRouter">Usuario del Router <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback"></div>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCambiosContraseniaRouter" name="txtCambiosContraseniaRouter" placeholder="Contraseña">
                <label for="txtCambiosContraseniaRouter">Contraseña del Router <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback"></div>
              </div>
            </div>
          </div>

          <!-- Tercera Fila -->
          <div class="row g-3 mb-3 align-items-center">
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCambiosSsid" placeholder="SSID" name="txtCambiosSsid">
                <label for="txtCambiosSsid">SSID <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback"></div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCambiosPass" placeholder="Password" name="txtCambiosPass">
                <label for="txtCambiosPass">Password <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback"></div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCambiosIpRouter" placeholder="IP" name="txtCambiosIpRouter">
                <label for="txtCambiosIpRouter">IP <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback"></div>
              </div>
            </div>
          </div>

          <!-- Cuarta Fila -->
          <div class="row g-3 mb-3 align-items-center">
            <div class="col-md-4">
              <div class="input-group">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosCodigoBarraRouter" placeholder="Código de Barra" name="txtCambiosCodigoBarraRouter">
                  <label for="txtCambiosCodigoBarraRouter">Código de Barra<span class="required-asterisk" style="color: red;">*</span></label>
                  <div class="invalid-feedback"></div>
                </div>
                <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCambiosMarcaRouter" placeholder="Marca" disabled>
                <label for="txtCambiosMarcaRouter">Marca</label>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCambiosModeloRouter" placeholder="Modelo" disabled>
                <label for="txtCambiosModeloRouter">Modelo</label>
              </div>
            </div>
          </div>

          <!-- Quinta Fila -->
          <div class="row g-3 mb-3 align-items-center">
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCambiosSerieRouter" placeholder="Serie" name="txtCambiosSerieRouter">
                <label for="txtCambiosSerieRouter">Serie</label>
                <div class="invalid-feedback"></div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <select class="form-select" id="slcCambiosBanda">
                  <option value="" selected disabled>Seleccione una Opción</option>
                  <option value="2G">2G</option>
                  <option value="5G">5G</option>
                  <option value="2G,5G">5G-2G</option>
                </select>
                <label for="slcCambiosBanda">Banda <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback"></div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtCambiosAntenas" placeholder="Número de Antenas" min="2" max="10" name="txtCambiosAntenas">
                <label for="txtCambiosAntenas">N° de Antenas <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- repetidor asignado -->
        <div id="repetidorCambiosContainer" style="display: none;">
          <div class="mt-3 mb-3">
            <h5> Datos del repetidor asignado </h5>
          </div>
          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCambiosSsidRepetidor" name="txtCambiosSsidRepetidor" placeholder="SSID">
                <label for="txtCambiosSsidRepetidor">SSID <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback"></div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCambiosPassRepetidor" name="txtCambiosPassRepetidor" placeholder="Password">
                <label for="txtCambiosPassRepetidor">Password <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback"></div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCambiosIpRepetidor" name="txtCambiosIpRepetidor" placeholder="IP">
                <label for="txtCambiosIpRepetidor">IP <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback"></div>
              </div>
            </div>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <div class="input-group">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCambiosCodigoBarraRepetidor" name="txtCambiosCodigoBarraRepetidor" placeholder="Código de Barra">
                  <label for="txtCambiosCodigoBarraRepetidor">Código de Barra <span class="required-asterisk" style="color: red;">*</span></label>
                  <div class="invalid-feedback"></div>
                </div>
                <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCambiosMarcaRepetidor" placeholder="Marca" name="txtCambiosMarcaRepetidor" disabled>
                <label for="txtCambiosMarcaRepetidor">Marca <span class="required-asterisk" style="color: red;">*</span></label>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCambiosModeloRepetidor" placeholder="Modelo" name="txtCambiosModeloRepetidor" disabled>
                <label for="txtCambiosModeloRepetidor">Modelo <span class="required-asterisk" style="color: red;">*</span></label>
              </div>
            </div>
          </div>
        </div>

        <hr>

        <div>
          <!-- Primera Fila -->
          <div class="">

            <!-- Cuarta Fila -->
            <div class="row g-3 mb-3">
              <div class="col-md-12">
                <div class="form-floating">
                  <textarea class="form-control" id="txtaEstadoInicial" style="height: 100px;" placeholder="Estado Inicial" disabled></textarea>
                  <label for="txtaEstadoInicial">Estado Inicial</label>
                </div>
              </div>

              <div class="col-md-12">
                <div class="form-floating">
                  <textarea class="form-control" id="txtaCambiosProceSolucion" style="height: 100px;" placeholder="Procedimiento de Solución" required></textarea>
                  <label for="txtaCambiosProceSolucion">Procedimiento de Solución <span class="required-asterisk" style="color: red;">*</span></label>
                  <div class="invalid-feedback">Este campo es obligatorio.</div>
                </div>
              </div>
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