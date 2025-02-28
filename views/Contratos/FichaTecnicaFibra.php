<?php require_once "../../header.php"; ?>
<?php
$idContrato = $_GET['idContrato'];
?>

<link rel="stylesheet" href="../../css/fichaFibra.css">


<div class="modal fade" id="mdlRepetidor" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">
          <i class="fas fa-plus-circle"></i> Añadir Repetidor
        </h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formRepetidor">
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
              <div class="input-group">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtCodigoBarrasRepetidor" placeholder="Codigo de barras">
                  <label for="lblCodigoBarrasRepetidor">Codigo de barras <span class="required-asterisk" style="color: red;">*</span></label>
                  <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
                </div>
                <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
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

    <h1 class="mt-4"><i class="fas fa-file-alt"></i> Formulario de Registro de Ficha de Fibra</h1>

    <div class="row g-2 mb-2 d-flex justify-content-between align-items-center">
      <h4 style="font-size: 20px;" class="col-auto">Cliente: <label id="txtnombreCliente"></label> </h4>
      <div class="col-auto d-flex gap-2">
        <input type="text" class="form-control text-center" id="txtNumFicha" placeholder="N°" disabled>
        <input type="date" class="form-control text-center" id="txtFecha" placeholder="Fecha" disabled>
      </div>
    </div>

    <form>
      <div class="conteiner">
        <div class="card mb-4">
          <div class="card-header">
            <h4 class="card-title">Fibra Óptica</h4>
          </div>
          <div class="card-body">
            <h5>Datos del Servicio</h5>

            <div class="row g-2 mb-2">
              <div class="col-12 col-md-4">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtUsuario" placeholder="Usuario" disabled=true>
                  <label for="lblUsuario">Usuario </label>
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

            <div class="row g-2 mb-2">
              <div class="col-12 col-md-4">
                <div class="form-floating">
                  <input type="date" class="form-control" id="txtPeriodo" placeholder="Periodo">
                  <label for="txtPeriodo">Periodo</label>
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtVlan" placeholder="VLAN" min="1" max="4094" value="0001">
                  <label for="lblVlan">VLAN <span class="required-asterisk" style="color: red;">*</span></label>
                  <div class="invalid-feedback">Por favor, ingrese un valor válido (1 a 4094).</div>
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtPotenciaFibra" placeholder="Potencia" min="-30" max="24" value="-20">
                  <label for="lblPotenciaFibra">Potencia <span class="required-asterisk" style="color: red;">*</span></label>
                  <div class="invalid-feedback">Por favor, ingrese un valor válido (-30 a 24).</div>
                </div>
              </div>
              <div class="col-12 col-md-6 d-flex">
                <div class="form-floating flex-grow-1 me-2">
                  <input type="text" class="form-control" id="txtIdCaja" placeholder="Caja" disabled>
                  <label for="lblSerieCaja">Caja</label>
                </div>
                <div class="form-floating flex-grow-1">
                  <input type="number" class="form-control" id="txtPuerto" placeholder="columnas" min="1" max="16" value="0">
                  <label for="txtPuerto">Puerto <span class="required-asterisk" style="color: red;">*</span></label>
                  <div class="invalid-feedback" id="columnaError">Por favor, ingrese un valor válido.</div>
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
                <div class="col-12 col-md-4">
                  <div class="input-group">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="txtCodigoBarra" placeholder="Código de Barras">
                      <label for="txtCodigoBarra">Código de Barras <span class="required-asterisk" style="color: red;">*</span></label>
                      <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
                    </div>
                    <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
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
              <button type="button" class="btn btn-primary btn-md" data-bs-toggle="modal" data-bs-target="#mdlRepetidor" id="abrirmodalRepetidor">
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
                <textarea type="text" class="form-control" id="txtDetalles" placeholder="Detalles"></textarea>
                <label for="lblDetalle">Detalles</label>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="row">
        <div class="col-12 text-center text-md-end mb-3 btn-container d-grid gap-2 d-md-flex justify-content-md-end">
          <!-- <button type="button" id="btnReporte" class="btn btn-info px-4 py-2">
              <i class="fas fa-file-alt"></i> Generar Reporte
            </button> -->
          <button type="button" id="btnGuardar" class="btn btn-success px-4 py-2">
            <i class="fas fa-save"></i> Guardar
          </button>
          <button type="button" id="btnCancelar" class="btn btn-outline-secondary px-4 py-2">
            <i class="fas fa-times"></i> Cancelar
          </button>
        </div>
      </div>
  </div>
  </form>
</div>
</div>
<script>
  const idContrato = <?= $idContrato ?>;
</script>
<script type="module" src="../../js/FichaTecnicaFibra.js"></script>

<?php require_once "../../footer.php"; ?>