<?php require_once "../../header.php"; ?>
<?php
$idContrato = $_GET['idContrato'];
?>

<link rel="stylesheet" href="../../css/fichaCable.css">

<!-- Modal de Sintotizador -->
<div class="modal fade" id="mdlSintotizador" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">
          <i class="fas fa-plus-circle"></i> Añadir Sintotizador
        </h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="mdlSintotizadorBody">
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
              </div>
              <span class="input-group-text">.00</span>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtPeriodo" disabled placeholder="Período">
                <label for="txtPeriodo">Período</label>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtPotenciaCable" placeholder="Potencia" min="-50" max="-7">
                <label for="txtPotenciaCable">Potencia</label>
              </div>
            </div>
          </div>
          <b> Cantidad de implementos</b>
          <div class="mb-3">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#mdlSintotizador">
              <i class="fas fa-plus-circle"></i> Añadir Sintotizador
            </button>
          </div>
          <div class="row g-3 mb-3">
            <div class="form-floating col-md-6">
              <select class="form-select" id="slcTriplexor">
                <option value="false, false" selected>No Lleva</option>
                <option value="true,false">Pasivo</option>
                <option value="true, true">Activo</option>
              </select>
              <label for="slcTriplexor">Triplexor</label>
            </div>
            <div class="col-md-6">
              <div class="d-flex">
                <div class="form-floating me-2 flex-fill">
                  <input type="number" class="form-control" id="txtCantConector" placeholder="Conector">
                  <label for="txtCantConector">Conector</label>
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
                  <input type="number" id="txtSpliter" class="form-control" placeholder="Spliter">
                  <label for="txtSpliter">Spliter</label>
                </div>
                <div class="form-floating">
                  <select class="form-select" id="slcSpliter" aria-label="Selecciona una opción">
                    <option selected disabled>Elige una opción</option>
                    <option value="1x3">1x3</option>
                    <option value="1x5">1x5</option>
                    <option value="1x8">1x8</option>
                  </select>
                  <label for="slcSpliter">Tipo</label>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="input-group">
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtCantCable" placeholder="Cable M.">
                  <label for="txtCantCable">Cable M.</label>
                </div>
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtPrecioCable" value="1.10" disabled>
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
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" value=0 id="txtCantSintotizador" placeholder="Cantidad Sintotizador" disabled>
              <label for="txtCantSintotizador">Cantidad de Sintotizador</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" value=0 id="txtCostoAlquiler" placeholder="Costo de Alquiler" disabled>
              <label for="txtCostoAlquiler">Costo de Alquiler</label>
            </div>
          </div>
        </div>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" value=0 id="txtCostoCable" placeholder="Costo de Cable" disabled>
              <label for="txtCostoCable">Costo de Cable</label>
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
              <input type="number" class="form-control" id="txtGponNap" placeholder="GPON" min="-50" max="-7">
              <label for="txtGponNap">GPON</label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtCatvNap" placeholder="CATV" min="-50" max="-7">
              <label for="txtCatvNap">CATV</label>
            </div>
          </div>

        </div>
        <h5> Medición en interior de casa</h5>
        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtGponCasa" placeholder="GPON" min="-50" max="-7">
              <label for="txtGponCasa">GPON</label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtCatvCasa" placeholder="CATV" min="-50" max="-7">
              <label for="txtCatvCasa">CATV</label>
            </div>
          </div>
        </div>
        <!-- Botones -->
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
<script type="module" src="../../js/FichaTecnicaCable.js"></script>

<?php require_once "../../footer.php"; ?>