<?php require_once "../../header.php"; ?>
<div class="modal fade" id="mdlRepetidor" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Añadir Repetidor</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="mdlRepetidorBody">
        <div class="mb-2">
          <input type="text" class="form-control" id="txtSsidRepetidor" placeholder="SSID">
        </div>
        <div class="mb-2">
          <input type="text" class="form-control" id="txtContraseniaRepetidor" placeholder="Contraseña">
        </div>
        <div class="mb-2">
          <div class="input-group">
            <input type="text" class="form-control" id="txtMarcaModeloRepetidor" placeholder="Marca - Modelo">
            <button class="btn btn-outline-primary" type="button" id="btnEscanearRepetidor">Escanear</button>
          </div>
        </div>
        <div class="mb-2">
          <input type="text" class="form-control" id="txtIpRepetidor" placeholder="IP">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" id="btnAñadirRepetidor" class="btn btn-primary">Guardar</button>
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
<div class="modal fade" id="mdlRepetidor" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Añadir Repetidor</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="mdlRepetidorBody">
        <div class="mb-2">
          <input type="text" class="form-control" id="txtSsidRepetidor" placeholder="SSID">
        </div>
        <div class="mb-2">
          <input type="text" class="form-control" id="txtContraseniaRepetidor" placeholder="Contraseña">
        </div>
        <div class="mb-2">
          <div class="input-group">
            <input type="text" class="form-control" id="txtMarcaModeloRepetidor" placeholder="Marca - Modelo">
            <button class="btn btn-outline-primary" type="button" id="btnEscanearRepetidor">Escanear</button>
          </div>
        </div>
        <div class="mb-2">
          <input type="text" class="form-control" id="txtIpRepetidor" placeholder="IP">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" id="btnAñadirRepetidor" class="btn btn-primary">Guardar</button>
      </div>
    </div>
  </div>
</div>




<?php require_once "../../footer.php"; ?>
