<?php require_once "../../header.php"; ?>
<link rel="stylesheet" href="../../css/gpon.css">


<div class="modal fade" id="mdlSintotizador" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Añadir Sintotizador</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="mdlSintotizadorBody">
        <!-- Aquí se agregarán las cartas -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" id="btnAñadirSintotizador" class="btn btn-primary">Añadir</button>
      </div>
    </div>
  </div>
</div>

<div class="container">
  <div class="form-container mt-3">
    <h2 class="text-center">Registro</h2>
    <form>
      <div class="conteiner">
        <div class="card">
          <div class="card-body">
            <h6 class="text-center card-title">Fibra optica</h6>
            <label class="form-label">Datos del servicio</label>
            <div class="row g-3 mb-2">
              <div class="col md-6">
                <input type="text" class="form-control" id="txtUsuario" placeholder="Usuario"> <!-- Crear de manera automatica -->
              </div>
              <div class="col md-6">
                <input type="text" class="form-control" id="txtClaveAcceso" placeholder="Clave de acceso"> <!-- Crear de manera automatica -->
              </div>
            </div>
            <div class="row g-3 mb-2">
              <div class="col md-9">
                <input type="text" class="form-control" disabled=true id="txtPlan" placeholder="Plan">
              </div>
              <div class="col md-3">
                <input type="number" class="form-control" id="txtPotenciaFibra" placeholder="Potencia">
              </div>
            </div>
            <label class="form-label mt-2">Datos del Modén</label>
            <div class="row g-3 mb-2">
              <div class="col md-6">
                <input type="text" class="form-control" id="txtSsdi" placeholder="SSDI">
              </div>
              <div class="col md-6">
                <input type="text" class="form-control" id="txtSeguridad" placeholder="Contraseña">
              </div>
            </div>
            <div class="mb-2">
              <div class="input-group">
                <input type="text" class="form-control" id="txtMarcaModelo" placeholder="Marca - Modelo">
                <button class="btn btn-outline-primary" type="submit" id="btnEscanearModen">Escanear</button>
              </div>
            </div>
            <div class="row g-3 mb-2">
              <div class="col md-6">
                <select type="text" class="form-select" id="slcBanda" placeholder="Banda">
                  <option value="2G">2G</option>
                  <option value="5G" selected>5G</option>
                </select>
              </div>
              <div class="col md-6">
                <input type="number" class="form-control" id="txtAntenas" placeholder="Antena#">
              </div>
              <div class="col md-6 form-check form-switch d-flex align-items-center">
                <input class="form-check-input" type="checkbox" id="chkCatv">
                <label class="form-check-label" for="chkCatv">CATV</label>
              </div>
              <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#mdlRepetidor">
                Añadir Repetidor
              </button>
              <div id="cardContainer" class="container mt-4" hidden=true>
                <div class="row" id="cardsRow">
                  <!-- Aquí se añadirán las cards -->
                </div>
              </div>
              <div class="mt-4">
                <textarea type="text" class="form-control" id="txtaDetallesModen" placeholder="Detalles"></textarea>
              </div>
            </div>
            <div class="mt-4">
              <button class="btn btn-primary btn-sm" id="btnGuardar">Guardar</button>
              <button class="btn btn-secondary btn-sm" id="btnCancelar">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
<div class="container mt-4">
  <!-- Card: Cable -->
  <div class="card mx-auto" style="max-width: 900px;">
    <div class="card-body">
      <h6 class="text-center card-title">Cable</h6>
      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <input type="text" class="form-control" id="txtPlanCable" disabled placeholder="Plan">
        </div>
        <div class="col-md-6">
          <input type="text" class="form-control" id="txtPagoInst" disabled placeholder="Pago Instalación">
        </div>
      </div>
      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <input type="text" class="form-control" id="txtPeriodo" disabled placeholder="Período">
        </div>
        <div class="col-md-6">
          <input type="number" class="form-control" id="txtPotenciaCable" placeholder="Potencia">
        </div>
      </div>
      <label class="form-label mt-2">Cantidad de implementos</label>
      <div class="mb-3">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#mdlSintotizador">
          Añadir Sintotizador
        </button>
      </div>
      <div class="row g-3 mb-3">
        <div class="form-floating col-md-6">
          <select class="form-select" id="slcTriplexor">
            <option value="1" selected>No Lleva</option>
            <option value="2">Pasivo</option>
            <option value="3">Activo</option>
          </select>
          <label for="slcTriplexor">Triplexor</label>
        </div>
        <div class="col-md-6">
          <div class="d-flex">
            <div class="form-floating me-2 flex-fill">
              <input type="number" class="form-control" id="txtCantConector">
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
            <input type="number" id="txtSpliter" class="form-control" placeholder="Spliter">
            <select class="form-select" id="slcSpliter" aria-label="Selecciona una opción">
              <option selected disabled>Elige una opción</option>
              <option value="1">1x3</option>
              <option value="2">1x5</option>
              <option value="3">1x8</option>
            </select>
          </div>
        </div>
        <div class="col-md-6">
          <div class="input-group">
            <input type="number" class="form-control" id="txtCantCable" placeholder="Cable M.">
            <input type="number" class="form-control" id="txtPrecioCable" value="1.10" disabled>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container mt-4">
  <!-- Card: Otros -->
  <div class="card mx-auto" style="max-width: 900px;">
    <div class="card-body">
      <h6 class="text-center card-title">Otros</h6>
      <label class="form-label mt-2">Costos</label>
      <div class="row g-3 mb-3">
        <div class="col-md-6 form-floating">
          <input type="text" class="form-control" id="txtCantSintotizador" disabled>
          <label for="txtCantSintotizador">Cantidad Sintotizador</label>
        </div>
        <div class="col-md-6 form-floating">
          <input type="number" class="form-control" id="txtCostoAlquiler" disabled>
          <label for="txtCostoAlquiler">Costo Alquiler</label>
        </div>
      </div>
      <div class="row g-3 mb-3">
        <div class="col-md-6 form-floating">
          <input type="number" class="form-control" id="txtCostoCable" disabled>
          <label for="txtCostoCable">Costo Cable</label>
        </div>
        <div class="col-md-6 form-floating">
          <input type="number" class="form-control" id="txtCostoConector" disabled>
          <label for="txtCostoConector">Costo Conector</label>
        </div>
      </div>
      <label class="form-label mt-2">Medición en caja NAP</label>
      <div class="row g-3 mb-3">
        <div class="col-md-6 form-floating">
          <input type="number" class="form-control" id="txtGponNap">
          <label for="txtGponNap">GPON</label>
        </div>
        <div class="col-md-6 form-floating">
          <input type="number" class="form-control" id="txtCatvNap">
          <label for="txtCatvNap">CATV</label>
        </div>
      </div>
      <label class="form-label mt-2">Medición en interior de casa</label>
      <div class="row g-3 mb-3">
        <div class="col-md-6 form-floating">
          <input type="number" class="form-control" id="txtGponCasa">
          <label for="txtGponCasa">GPON</label>
        </div>
        <div class="col-md-6 form-floating">
          <input type="number" class="form-control" id="txtCatvCasa">
          <label for="txtCatvCasa">CATV</label>
        </div>
      </div>
      <!-- Botones -->
      <div class="row">
        <div class="col-12 text-center text-md-end mb-3">
          <button type="button" id="btnGuardar" class="btn btn-primary btn-sm">Guardar</button>
          <button type="button" id="btnCancelar" class="btn btn-secondary btn-sm">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</div>
<script src="../../js/FichaTecnicaGpon.js"></script>

<?php require_once "../../footer.php"; ?>


</body>

</html>