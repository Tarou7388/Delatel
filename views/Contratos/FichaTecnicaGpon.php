<?php require_once "../../header.php"; ?>
<?php
$idContrato = $_GET['idContrato'];
?>
<link rel="stylesheet" href="../../css/gpon.css">

<!-- Modal de Sintotizador -->
<div class="modal fade" id="mdlSintotizador" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">
          <i class="fas fa-plus-circle"></i> Añadir Sintonizador
        </h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formSintonizador" autocomplete="off">
        <div class="modal-body" id="mdlSintotizadorBody">
          <div class="mb-2">
            <div class="form-floating">
              <select class="form-select select2me" id="slcCodigoBarraSintonizador" style="width: 100%;">
              </select>
              <label for="slcCodigoBarraSintonizador">Sintonizador</label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
            </div>
          </div>
          <div class="mb-2">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtMarcaSintonizador" placeholder="Marca" disabled>
              <label for="txtMarcaSintonizador">Marca</label>
            </div>
          </div>
          <div class="mb-2">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtModeloSintonizador" placeholder="Modelo" disabled>
              <label for="txtModeloSintonizador">Modelo</label>
            </div>
          </div>
          <div class="mb-2">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtPrecioSintonizador" placeholder="Precio" disabled>
              <label for="txtPrecioSintonizador">Precio</label>
            </div>
          </div>
          <div class="mb-2">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtSerieSintonizador" placeholder="Serie">
              <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              <label for="txtSerieSintonizador">Serie <span class="required-asterisk" style="color: red;">*</span></label>
            </div>
          </div>
          <!-- Aquí se agregarán las cartas -->
        </div>
        <div class="modal-footer">
          <button type="reset" class="btn btn-secondary" data-bs-dismiss="modal">
            <i class="fas fa-times"></i> Cancelar
          </button>
          <button type="button" id="btnAñadirSintotizador" class="btn btn-primary">
            <i class="fas fa-check"></i> Añadir
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- Modal de Repetidor -->
<div class="modal fade" id="mdlRepetidor" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">
          <i class="fas fa-plus-circle"></i> Añadir Repetidor
        </h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formRepetidor" autocomplete="off">
        <div class="modal-body" id="mdlRepetidorBody">
          <div class="row g-2 mb-2">
            <div class="col-12 col-md-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtSsidRepetidor" placeholder="SSID">
                <label for="lblSsid">SSID <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtContraseniaRepetidor" placeholder="Contraseña">
                <label for="lblContraseniaRepetidor">Contraseña <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              </div>
            </div>
          </div>
          <div class="row g-2 mb-2">
            <div class="col-12 col-md-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtSerieRepetidor" placeholder="Serie">
                <label for="lblSerieRepetidor">Serie <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtIpRepetidor" placeholder="IP" value="192.168">
                <label for="lblIpRepetidor">IP <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              </div>
            </div>
          </div>
          <div class="row g-2 mb-2">
            <div class="col-12 col-md-6">
              <div class="form-floating">
                <select class="form-select" id="slcCondicionRepetidor">
                  <option value="venta">Venta</option>
                  <option value="alquilado">Alquilado</option>
                </select>
                <label for="slcTipoRepetidor">Tipo <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, seleccione una opción válida.</div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-floating" id="divSector">
                <select class="form-select select2me" id="slcCodigoBarrasRepetidor" aria-label=Repetidores required>
                </select>
                <label for="slcCodigoBarrasRepetidor" class="form-label">Repetidor</label>
              </div>
            </div>
          </div>
          <div class="row g-2 mb-2">
            <div class="col-12 col-md-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtMarcaRepetidor" placeholder="Marca" disabled>
                <label for="lblMarcaRepetidor">Marca <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtModeloRepetidor" placeholder="Modelo" disabled>
                <label for="lblModeloRepetidor">Modelo <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              </div>
            </div>
          </div>
          <div class="row g-2 mb-2">
            <div class="col-12 col-md-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtPrecioRepetidor" placeholder="Precio" disabled>
                <label for="lblPrecioRepetidor">Precio <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="reset" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            <i class="fas fa-times"></i> Cancelar
          </button>
          <button type="button" id="btnAñadirRepetidor" class="btn btn-primary">
            <i class="fas fa-check"></i> Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<div class="container-fluid px-5">
  <div class="form-container mt-3">

    <h1 class="mt-4"><i class="fas fa-file-alt"></i> Formulario de Registro de Ficha Técnica Gpon</h1>

    <div class="row g-2 mb-2 d-flex justify-content-between align-items-center">
      <h4 style="font-size: 20px;" class="col-auto">Cliente: <label id="txtnombreCliente"></label> </h4>
      <div class="col-auto d-flex gap-2">
        <input type="text" class="form-control text-center" id="txtNumFicha" placeholder="N°" disabled>
        <input type="date" class="form-control text-center" id="txtFecha" placeholder="Fecha" disabled>
      </div>
    </div>

    <div class="conteiner">
      <div class="card mb-4">
        <div class="card-header">
          <h4 class="card-title">Fibra Óptica</h4>
        </div>
        <div class="card-body">
          <h6>Datos del servicio</h6>

          <div class="row g-2 mb-2">
            <div class="col-12 col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtUsuario" placeholder="Usuario" disabled=true>
                <label for="lblUsuario">Usuario</label>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtClaveAcceso" disabled=true placeholder="Clave de acceso">
                <label for="lblClaveAcceso">Clave de Acceso</label>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" disabled=true id="txtPlan" placeholder="Plan">
                <label for="lblPlan">Plan</label>
              </div>
            </div>
          </div>

          <div class="row g-3 mb-2">
            <div class="col-12 col-md-4">
              <div class="form-floating">
                <input type="date" class="form-control" id="txtPeriodo" placeholder="Periodo">
                <label for="txtPeriodo">Periodo</label>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtVlan" placeholder="Vlan" min="1" max="4094" value="1">
                <label for="lblVlan">VLAN <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido (1 a 4094).</div>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtPotenciaFibra" placeholder="Potencia" min="-30" max="24" value="-30">
                <label for="lblPotenciaFibra">Potencia <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido (-30 a 24).</div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="row g-2">
                <div class="col-12 col-md-4">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtIdCaja" placeholder="Caja" disabled>
                    <label for="lblSerieCaja">Caja</label>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtPuerto" placeholder="columnas" min="1" max="16" value="1">
                    <label for="txtPuerto">Puerto <span class="required-asterisk" style="color: red;">*</span></label>
                    <div class="invalid-feedback" id="columnaError">Por favor, ingrese un valor válido.</div>
                  </div>
                </div>
              </div>
            </div>
            <section name="Datos del Router">
              <h5> Datos del Router</h5>
              <!-- Fila: Información básica -->
              <div class="row g-2 mb-3">
                <div class="col-12 col-md-4">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtSsid" placeholder="SSID">
                    <label for="txtSsid">SSID <span class="required-asterisk" style="color: red;">*</span></label>
                    <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtSeguridad" placeholder="Contraseña">
                    <label for="txtSeguridad">Seguridad <span class="required-asterisk" style="color: red;">*</span></label>
                    <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtIp" placeholder="IP" value="192.168">
                    <label for="txtIp">IP <span class="required-asterisk" style="color: red;">*</span></label>
                    <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
                  </div>
                </div>
              </div>

              <!-- Fila: Información del dispositivo -->
              <div class="row g-2 mb-3">
                <div class="col-12 col-md-4 mb-2 mt-2">
                  <div class="form-floating" id="divSector">
                    <select class="form-select select2me" id="slcCodigoBarraRouterOnt" aria-label=Sectores required>

                    </select>
                    <label for="slcCodigoBarraRouterOnt" class="form-label">Router/ONT</label>
                  </div>
                </div>

                <div class="col-12 col-md-4">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtMarca" placeholder="Marca" disabled>
                    <label for="txtMarca">Marca <span class="required-asterisk" style="color: red;">*</span></label>
                    <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtModelo" placeholder="Modelo" disabled>
                    <label for="txtModelo">Modelo <span class="required-asterisk" style="color: red;">*</span></label>
                    <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
                  </div>
                </div>
              </div>

              <!-- Fila: Configuración técnica -->
              <div class="row g-2 mb-3 align-items-center">
                <div class="col-12 col-md-3">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtSerie" placeholder="Serie">
                    <label for="txtSerie">Serie <span class="required-asterisk" style="color: red;">*</span></label>
                    <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
                  </div>
                </div>
                <div class="col-12 col-md-3">
                  <div class="form-floating">
                    <select class="form-select" id="slcBanda" required>
                      <option value="2G">2G</option>
                      <option value="5G" selected>5G</option>
                      <option value="2G,5G">5G-2G</option>
                    </select>
                    <label for="slcBanda">Banda <span class="required-asterisk" style="color: red;">*</span></label>
                    <div class="invalid-feedback">Por favor, seleccione una opción válida.</div>
                  </div>
                </div>
                <div class="col-12 col-md-3">
                  <div class="form-floating">
                    <input type="number" class="form-control" id="txtAntenas" placeholder="Número de Antenas" min="2" max="10" value="2">
                    <label for="txtAntenas">N° de Antenas <span class="required-asterisk" style="color: red;">*</span></label>
                    <div class="invalid-feedback">Por favor, ingrese un valor válido (2 a 10).</div>
                  </div>
                </div>
                <div class="col-12 col-md-3 d-flex align-items-center">
                  <div class="form-check form-switch me-3">
                    <input class="form-check-input" type="checkbox" id="chkCatv" checked>
                    <label class="form-check-label" for="chkCatv">CATV</label>
                  </div>
                  <p class="card-status mb-0" id="statusText">Estado: No seleccionado</p>
                </div>
              </div>

              <h5> Datos de Ingreso</h5>
              <div class="row g-2 mb-3 align-items-center">
                <div class="col-12 col-md-6">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtUsuarioRouter" placeholder="Usuario del Router">
                    <label for="txtUsuarioRouter">Usuario del Router <span class="required-asterisk" style="color: red;">*</span></label>
                    <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="txtSeguridadRouter" placeholder="Contraseña del Router">
                    <label for="txtSeguridadRouter">Contraseña del Router <span class="required-asterisk" style="color: red;">*</span></label>
                    <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
                  </div>
                </div>
              </div>
            </section>



            <div class="col-12 text-start">
              <button type="button" class="btn btn-primary btn-md" data-bs-toggle="modal" data-bs-target="#mdlRepetidor">
                <i class="fas fa-plus-circle"></i> Añadir Repetidor
              </button>
            </div>
            <div id="cardContainer" class="container mt-4" hidden=true>
              <div class="row" id="cardsRow">
                <!-- Aquí se añadirán las cards -->
              </div>
              <button class="btn btn-danger" type="button" id="eliminarRepetidor">
                <i class="fas fa-trash"></i> Eliminar
              </button>
            </div>
            <div class="mt-4">
              <div class="form-floating">
                <textarea type="text" class="form-control" id="txtDetalleRouter" placeholder="Detalles"></textarea>
                <label for="txtDetalleRouter">Detalles <span class="required-asterisk" style="color: red;">*</span></label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container-fluid px-5" id="contenidoCable">
  <!-- Card: Cable -->
  <div class="conteiner">
    <div class="card mb-4">
      <div class="card-header">
        <h4 class="card-title">Cable</h4>
      </div>
      <div class="card-body">
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtPlanCable" disabled placeholder="Plan">
              <label for="txtPlanCable">Plan</label>
            </div>
          </div>
          <div class="col-md input-group">
            <span class="input-group-text">S/.</span>
            <div class="form-floating">
              <input type="number" class="form-control" id="txtPagoInst" value=30 min="0" placeholder="Pago Instalación">
              <label for="lblPago">Pago Instalación</label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
            </div>
            <span class="input-group-text">.00</span>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtPotenciaCable" placeholder="Potencia" min="-50" max="-7" value="-5">
              <label for="txtPotenciaCable">Potencia <span class="required-asterisk" style="color: red;">*</span></label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido (-50 a -7).</div>
            </div>
          </div>
        </div>
        <h6> Cantidad de implementos</h6>
        <div class="mb-3">
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#mdlSintotizador">
            <i class="fas fa-plus-circle"></i> Añadir Sintonizador
          </button>
        </div>
        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <div class="form-floating">
              <select class="form-select" id="slcTriplexor">
                <option value="false, false" selected>No Lleva</option>
                <option value="true,false">Pasivo</option>
                <option value="true, true">Activo</option>
              </select>
              <label for="slcTriplexor">Triplexor</label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="input-group">
              <div class="form-floating">
                <input type="number" class="form-control" min="0" id="txtCantConector" placeholder="Conector" value="0">
                <div class="invalid-feedback">Por favor, ingrese un valor válido (0 o más).</div>
                <label for="txtCantConector">Conector <span class="required-asterisk" style="color: red;">*</span></label>
              </div>
              <div class="form-floating flex-fill">
                <input type="number" class="form-control" id="txtPrecioConector" value="1.50" disabled>
                <label for="txtPrecioConector">Precio</label>
              </div>
            </div>
          </div>
        </div>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="input-group">
              <div class="form-floating">
                <input type="number" id="txtSplitter" min="0" class="form-control" placeholder="Splitter" value="0">
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
                <label for="txtSplitter">Splitter <span class="required-asterisk" style="color: red;">*</span></label>
              </div>
              <div class="form-floating">
                <select class="form-select" id="slcSplitter" aria-label="Selecciona una opción">
                  <option value="1x3">1x3</option>
                  <option value="1x5">1x5</option>
                  <option value="1x8">1x8</option>
                </select>
                <label for="slcSplitter">Tipo</label>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="input-group">
              <div class="form-floating">
                <input type="number" class="form-control" min="0" id="txtCantCable" placeholder="Cable M." value="0">
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
                <label for="txtCantCable">Cable M. <span class="required-asterisk" style="color: red;">*</span></label>
              </div>
              <div class="form-floating">
                <input type="number" class="form-control" id="txtPrecioCable" value="1.30" disabled>
                <label for="txtPrecioCable">Precio del Cable</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container-fluid px-5" id="contenidoCable">
  <!-- Card: Otros -->
  <div class="conteiner">
    <div class="card mb-4">
      <div class="card-header">
        <h4 class="card-title">Otros</h4>
      </div>
      <div class="card-body">
        <h6>Costos</h6>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" min="0" max="9999" value=0 id="txtPagoAdelantado" placeholder="Pago">
              <label for="lblPagoAdelantado">Pago <span class="required-asterisk" style="color: red;">*</span></label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido (0 a 9999).</div>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" value=0 id="txtCantSintotizador" placeholder="Cantidad Sintonizador" disabled>
              <label for="lblCantSintotizador">Cantidad de Sintonizador</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" value=0 id="txtCostoAlquiler" placeholder="Costo de Aquiler" disabled>
              <label for="lblCostoAlquiler">Costo de Alquiler</label>
            </div>
          </div>
        </div>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" value=0 id="txtCostoCable" placeholder="Costo de Cable" disabled>
              <label for="lblCostoCable">Costo de Cable</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" value=0 id="txtCostoConector" placeholder="Costo de Conector" disabled>
              <label for="lblCostoConector">Costo de Conector</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" min="0" max="9999" value=0 id="txtDescuento" placeholder="Descuento">
              <label for="lblDescuento">Descuento <span class="required-asterisk" style="color: red;">*</span></label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
            </div>
          </div>
        </div>
        <h6> Medición en caja NAP</h6>
        <div class="row g-2 mb-2">

          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtGponNap" placeholder="GPON" min="-50" max="-7" value="-3">
              <label for="lblGponNap">GPON <span class="required-asterisk" style="color: red;">*</span></label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido (-50 a -7).</div>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtCatvNap" placeholder="CATV" min="-50" max="-7" value="-3">
              <label for="lblCatvNap">CATV <span class="required-asterisk" style="color: red;">*</span></label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido (-50 a -7).</div>
            </div>
          </div>

        </div>
        <h6> Medición en interior de casa</h6>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtGponCasa" placeholder="GPON" min="-50" max="-7" value="-3">
              <label for="lblGponCasa">GPON <span class="required-asterisk" style="color: red;">*</span></label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido (-50 a -7).</div>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtCatvCasa" placeholder="CATV" min="-50" max="-7" value="-3">
              <label for="lblCatvCasa">CATV <span class="required-asterisk" style="color: red;">*</span></label>
              <div class="invalid-feedback">Por favor, ingrese un valor válido (-50 a -7).</div>
            </div>
          </div>
          <div class="col-md-12">
            <div class="form-floating">
              <textarea class="form-control" id="txtDetalleCable" placeholder="Detalle" rows="3"></textarea>
              <label for="txtDetalleCable">Detalle <span class="required-asterisk" style="color: red;">*</span></label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 text-center text-md-end mb-3 btn-container">
            <button type="button" id="btnGuardar" class="btn btn-success px-4 py-2">
              <i class="fas fa-save"></i> Guardar
            </button>
            <button type="button" id="btnCancelar" class="btn btn-outline-secondary px-4 py-2">
              <i class="fas fa-times"></i> Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  const idContrato = <?= $idContrato ?>;
</script>
<script type="module" src="../../js/FichaTecnicaGpon.js"></script>

</body>

</html>

<?php require_once "../../footer.php"; ?>