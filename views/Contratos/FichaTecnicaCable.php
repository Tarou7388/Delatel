<?php require_once "../../header.php"; ?>
<?php
$idContrato = $_GET['idContrato'];
?>

<link rel="stylesheet" href="../../css/fichaCable.css">

<!-- Modal de Sintonizador -->
<div class="modal fade" id="mdlSintotizador" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">
          <i class="fas fa-plus-circle"></i> Añadir Sintonizador
        </h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="mdlSintotizadorBody">
        <div class="mb-2">
          <div class="input-group">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCodigoBarraSintonizador" placeholder="Código Barra">
              <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              <label for="txtCodigoBarraSintonizador">Código de Barra <span class="required-asterisk" style="color: red;">*</span></label>
            </div>
            <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
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
            <input type="number" class="form-control" id="txtPrecioSintonizador" placeholder="Precio" disabled>
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
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button type="button" id="btnAñadirSintotizador" class="btn btn-primary">
          <i class="fas fa-check"></i> Añadir
        </button>
      </div>
    </div>
  </div>
</div>

<div class="container-fluid px-5">

  <div class="form-container mt-3">

    <h1 class="mt-4"><i class="fas fa-file-alt"></i> Formulario de Registro de Ficha de Cable</h1>
    <div class="row g-2 mb-2 justify-content-end">
      <div class="col-sm-1">
        <input type="text" class="form-control text-center" id="txtNumFicha" placeholder="N°" disabled>
      </div>
      <div class="col-sm-2">
        <input type="date" class="form-control text-center" id="txtFecha" placeholder="Fecha" disabled>
      </div>
    </div>

    <!-- Card: Cable -->
    <div class="conteiner">
      <div class="card mb-4">
        <div class="card-header">
          <h4 class="card-title">Cable</h4>
        </div>
        <div class="card-body">
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtUsuario" placeholder="Usuario" disabled>
                <label for="txtUsuario">Usuario</label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtPaquete" placeholder="Paquete" disabled>
                <label for="txtPaquete">Paquete</label>
              </div>
            </div>
          </div>
          <div class="row g-3 mb-3">
            <div class="col-md input-group">
              <span class="input-group-text">S/.</span>
              <div class="form-floating">
                <input type="number" class="form-control" id="txtPagoInst" value=30 min="0" placeholder="Pago Instalación">
                <label for="lblPago">Pago Instalación</label>
                <div class="invalid-feedback">Por favor, ingrese un valor válido.</div>
              </div>
              <span class="input-group-text">.00</span>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <input type="date" class="form-control" id="txtPeriodo" placeholder="Período">
                <label for="txtPeriodo">Período</label>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtPotenciaCable" placeholder="Potencia" min="-50" max="-7" value="-20">
                <div class="invalid-feedback">Por favor, ingrese un valor válido (-50 a -7).</div>
                <label for="txtPotenciaCable">Potencia <span class="required-asterisk" style="color: red;">*</span></label>
              </div>
            </div>
            <div class="col-12 col-md-6 d-flex">
              <div class="form-floating flex-grow-1 me-2">
                <input type="number" class="form-control" id="txtIdCaja" placeholder="Caja" disabled>
                <label for="lblSerieCaja">Caja</label>
              </div>
              <div class="form-floating flex-grow-1 me-2">
                <select class="form-select" id="slcFilaEntrada">
                  <option value="1">Fila 1</option>
                  <option value="2">Fila 2</option>
                </select>
                <label for="slcFilaEntrada">Fila Entrada <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback">Por favor, seleccione una opción válida.</div>
              </div>
              <div class="form-floating flex-grow-1">
                <input type="number" class="form-control" id="txtPuerto" placeholder="columnas" min="1" max="16" value="2">
                <label for="txtPuerto">Puerto <span class="required-asterisk" style="color: red;">*</span></label>
                <div class="invalid-feedback" id="columnaError">Por favor, ingrese un valor válido.</div>
              </div>
            </div>
          </div>

          <b> Cantidad de implementos</b>
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
                  <input type="number" class="form-control" min="0" id="txtCantConector" placeholder="Conector" value="1">
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
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <div class="input-group">
                <div class="form-floating">
                  <input type="number" id="txtSplitter" min="0" class="form-control" placeholder="Splitter" value="0">
                  <div class="invalid-feedback">Por favor, ingrese un valor válido (0 o más).</div>
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
                  <input type="number" class="form-control" min="0" id="txtCantCable" placeholder="Cable M." value="1">
                  <div class="invalid-feedback">Por favor, ingrese un valor válido (0 o más).</div>
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
</div>

<!-- Card: Otros -->
<div class="container-fluid px-5">
  <!-- Card: Otros -->
  <div class="conteiner">
    <div class="card mb-4">
      <div class="card-header">
        <h4 class="card-title">Otros</h4>
      </div>
      <div class="card-body">
        <h5>Costos</h5>

        <div class="row g-3 mb-3row g-3 mb-3">
          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" value=0 id="txtCantSintotizador" placeholder="Cantidad Sintotizador" disabled>
              <label for="txtCantSintotizador">Cantidad de Sintonizador</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" value=0 id="txtCostoAlquiler" placeholder="Costo de Alquiler" disabled>
              <label for="txtCostoAlquiler">Costo de Alquiler</label>
            </div>
          </div>
        </div>
        <div class="row g-3 mb-3row g-3 mb-3">
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" value=0 id="txtCostoCable" placeholder="Costo de Cable" disabled>
              <label for="txtCostoCable">Costo de Cable </label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" value=0 id="txtCostoConector" placeholder="Costo Conector" disabled>
              <label for="txtCostoConector">Costo Conector</label>
            </div>
          </div>
        </div>

        <h5> Medición en caja NAP</h5>

        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtGponNap" placeholder="GPON" min="-50" max="-7" value="-1">
              <div class="invalid-feedback">Por favor, ingrese un valor válido (-50 a -7).</div>
              <label for="txtGponNap">GPON <span class="required-asterisk" style="color: red;">*</span></label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtCatvNap" placeholder="CATV" min="-50" max="-7" value="-1">
              <div class="invalid-feedback">Por favor, ingrese un valor válido (-50 a -7).</div>
              <label for="txtCatvNap">CATV <span class="required-asterisk" style="color: red;">*</span></label>
            </div>
          </div>
        </div>

        <h5> Medición en interior de casa</h5>
        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtGponCasa" placeholder="GPON" min="-50" max="-7" value="-1">
              <div class="invalid-feedback">Por favor, ingrese un valor válido (-50 a -7).</div>
              <label for="txtGponCasa">GPON <span class="required-asterisk" style="color: red;">*</span></label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtCatvCasa" placeholder="CATV" min="-50" max="-7" value="-1">
              <div class="invalid-feedback">Por favor, ingrese un valor válido (-50 a -7).</div>
              <label for="txtCatvCasa">CATV <span class="required-asterisk" style="color: red;">*</span></label>
            </div>
          </div>
          <div class="col-md-12">
            <div class="form-floating">
              <textarea class="form-control" id="txtDetalle" placeholder="Detalle" rows="3"></textarea>
              <label for="txtDetalle">Detalle</label>
            </div>
          </div>
        </div>
        <!-- Botones -->
        <div class="row">
          <div class="col-12 text-center text-md-end mb-3 btn-container">
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
    </div>
  </div>
</div>

<script>
  const idContrato = <?= $idContrato ?>;
</script>
<script type="module" src="../../js/FichaTecnicaCable.js"></script>

<?php require_once "../../footer.php"; ?>