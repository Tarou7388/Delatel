<?php require_once '../../header.php'; ?>

<link rel="stylesheet" href="../../css/diseñoGlobal.css" />

<div class="container-fluid px-4">
  <h1 class="mt-4">Soporte de Cable</h1>
  <div class="card mb-4">
    <div class="card-header">Complete los datos</div>
    <div class="card-body">

      <form id="form-cable" autocomplete="off">

        <!-- Datos del Cliente -->
        <h5>Datos del Cliente</h5>
        <section>
          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtNrodocumento" placeholder="Número Identificador" maxlength="12" minlength="8" disabled>
                <label for="txtNrodocumento">Número Identificador</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCliente" placeholder="Cliente" disabled>
                <label for="txtCliente">Cliente</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtPlan" placeholder="Plan" disabled>
                <label for="txtPlan">Plan</label>
              </div>
            </div>
          </div>
        </section>

        <hr>

        <!-- Parámetros Técnicos -->
        <h5>Parámetros Técnicos</h5>
        <section>
          <div class="row g-3 mb-3 align-items-center">
            <div class="col-md">
              <div class="form-floating">
                <select id="slcCaja" class="form-select">
                  <option value="" disabled selected>Seleccione una opción</option>
                </select>
                <label for="slcCaja">Caja</label>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtPotencia" placeholder="Potencia" disabled required>
                <label for="txtPotencia">Potencia</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtSintonizador" placeholder="Sintonizador" disabled required>
                <label for="txtSintonizador">Sintonizador</label>
              </div>
            </div>
          </div>

          <hr>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <select class="form-select" id="slcTriplexor" required disabled>
                  <option value="" disabled selected>Elige una opción</option>
                  <option value="1">No lleva</option>
                  <option value="2">Activo</option>
                  <option value="3">Pasivo</option>
                </select>
                <label for="slcTriplexor">Triplexor</label>
              </div>
            </div>
            <div class="col-md">
              <div class="input-group">
                <div class="form-floating flex-fill">
                  <input type="text" id="txtNumSpliter" class="form-control" placeholder="Número Spliter" disabled required>
                  <label for="txtNumSpliter">Número Spliter</label>
                </div>
                <div class="form-floating">
                  <select class="form-select" id="slcSpliter" required disabled>
                    <option value="" disabled selected>Elige una opción</option>
                    <option value="1x3">1x3</option>
                    <option value="1x5">1x5</option>
                    <option value="1x8">1x8</option>
                  </select>
                  <label for="slcSpliter">Spliter</label>
                </div>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="input-group">
                <div class="form-floating flex-fill">
                  <input type="text" class="form-control" id="txtCable" placeholder="Cable" disabled required>
                  <label for="txtCable">Cable</label>
                </div>
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtPrecioCable" placeholder="Precio Cable" disabled required>
                  <label for="txtPrecioCable">Precio Cable</label>
                </div>
              </div>
            </div>
            <div class="col-md">
              <div class="input-group">
                <div class="form-floating flex-fill">
                  <input type="number" class="form-control" id="txtConector" placeholder="Conectores" disabled required>
                  <label for="txtConector">Conectores</label>
                </div>
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtPrecioConector" placeholder="Precio Conector" disabled required>
                  <label for="txtPrecioConector">Precio Conector</label>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <textarea class="form-control" id="txtaEstadoInicial" style="height: 100px" disabled required></textarea>
              <label for="txtaEstadoInicial">Estado Inicial</label>
            </div>
          </div>
        </section>

        <hr>

        <!-- Cambios Técnicos -->
        <h5>Cambios Técnicos</h5>
        <section>
          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtPotenciaCambio" placeholder="Potencia" max="-7" min="-50" required>
                <div class="invalid-feedback">Potencia debe estar entre -50 y -7.</div>
                <label for="txtPotenciaCambio">Potencia</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtSintonizadorCambio" placeholder="Sintonizador" required min="0" max="999">
                <div class="invalid-feedback">Sintonizador debe estar entre 0 y 999.</div>
                <label for="txtSintonizadorCambio">Sintonizador</label>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <select class="form-select" id="slcTriplexorCambio" required>
                  <option value="" disabled selected>Elige una opción</option>
                  <option value="1">No lleva</option>
                  <option value="2">Activo</option>
                  <option value="3">Pasivo</option>
                </select>
                <label for="slcTriplexorCambio">Triplexor Cambio</label>
              </div>
            </div>
            <div class="col-md">
              <div class="input-group">
                <div class="form-floating flex-fill">
                  <input type="number" id="txtNumSpliterCambio" class="form-control" placeholder="Número Spliter" required min="0" max="999">
                  <label for="txtNumSpliterCambio">Número Spliter</label>
                </div>
                <div class="form-floating">
                  <select class="form-select" id="slcSpliterCambio" required>
                    <option value="" disabled selected>Elige una opción</option>
                    <option value="1x3">1x3</option>
                    <option value="1x5">1x5</option>
                    <option value="1x8">1x8</option>
                  </select>
                  <label for="slcSpliterCambio">Spliter Cambio</label>
                </div>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="input-group">
                <div class="form-floating flex-fill">
                  <input type="number" class="form-control" id="txtCableCambio" placeholder="Cable" required min="0" max="999">
                  <label for="txtCableCambio">Cable</label>
                </div>
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtPrecioCableCambio" placeholder="Precio Cable" disabled required>
                  <label for="txtPrecioCableCambio">Precio Cable</label>
                </div>
              </div>
            </div>
            <div class="col-md">
              <div class="input-group">
                <div class="form-floating flex-fill">
                  <input type="number" class="form-control" id="txtConectorCambio" placeholder="Conectores" required>
                  <label for="txtConectorCambio">Conectores</label>
                </div>
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtPrecioConectorCambio" placeholder="Precio Conector" disabled required>
                  <label for="txtPrecioConectorCambio">Precio Conector</label>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <textarea class="form-control" id="txtaEstadoFinal" style="height: 100px" required></textarea>
              <label for="txtaEstadoFinal">Estado Final</label>
            </div>
          </div>

          <!-- Botón de Reporte -->
          <div class="row g-3 mb-3">
            <div class="col-md-12 text-end">
              <button type="submit" id="btnReporte" class="btn btn-primary">
                <i class="fas fa-file-alt"></i> Generar Reporte
              </button>
            </div>
          </div>
        </section>

      </form>

    </div>
  </div>
</div>

<?php require_once '../../footer.php'; ?>
<script src="../../js/SoporteCable.js" type="module"></script>