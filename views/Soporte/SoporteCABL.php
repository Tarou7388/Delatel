<?php require_once '../../header.php'; ?>

<div class="container-fluid px-4">
  <h1 class="mt-4">Soporte de Cable</h1>

  <div class="row g-3 mb-2" hidden> <!-- hidden  para posterior uso, si no, sera eliminado-->
    <div class="col-md">
      <div class="form-floating">
        <input type="text" class="form-control" id="txtNumFicha" placeholder="N°" disabled>
        <label for="txtNumFicha">N°</label>
      </div>
    </div>
    <div class="col-md">
      <div class="form-floating">
        <input type="date" class="form-control" id="txtFecha" placeholder="Fecha" disabled>
        <label for="txtFecha">Fecha</label>
      </div>
    </div>
  </div>

  <br>

  <div class="card mb-4">
    <div class="card-header">Complete los datos</div>
    <div class="card-body">
      <form id="form-cable" autocomplete="off">

        <h5>Datos del Cliente</h5>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" maxlength="12" minlength="8" id="txtNrodocumento" placeholder="Número Identificador" disabled>
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

        <hr>

        <h5>Parámetros Técnicos</h5>
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
        <div>
          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtPotencia" placeholder="Potencia" min="-50" max="-7" disabled required>
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
                <select class="form-select" id="slcTriplexor" aria-label="Selecciona una opción" required disabled>
                  <option selected disabled>Elige una opción</option>
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
                  <input type="text" id="txtNumSpliter" class="form-control" placeholder="Spliter" required disabled>
                  <label for="txtNumSpliter">Número Spliter</label>
                </div>
                <div class="form-floating">
                  <select class="form-select" id="slcSpliter" aria-label="Selecciona una opción" required disabled>
                    <option value="" selected disabled>Elige una opción</option>
                    <option value="1x3">1x3</option>
                    <option value="1x5">1x5</option>
                    <option value="1x8">1x8</option>
                  </select>
                  <label for="slcSpliter">Spliter</label>
                </div>
              </div>
            </div>
            <div class="col-md">
              <div class="input-group">
                <div class="form-floating flex-fill">
                  <input type="text" class="form-control" id="txtCable" placeholder="Cable" required disabled>
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
                  <input type="number" class="form-control" id="txtConector" placeholder="Conectores" required disabled>
                  <label for="txtConector">Conectores</label>
                </div>
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtPrecioConector" placeholder="Precio Conector" disabled required>
                  <label for="txtPrecioConector">Precio Conector</label>
                </div>
              </div>
            </div>
          </div>

          <hr>

          <div class="col-md">
            <div class="form-floating">
              <textarea class="form-control" id="txtaEstadoInicial" style="height: 100px" disabled required></textarea>
              <label for="txtaEstadoInicial">Estado Inicial</label>
            </div>
          </div>
        </div>

        <hr>

        <h5>Cambios Técnicos</h5>
        <div>
          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtPotenciaCambio" placeholder="Potencia" min="-50" max="-7" required>
                <label for="txtPotenciaCambio">Potencia</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtSintonizadorCambio" placeholder="Sintonizador" required min="0" max="999">
                <label for="txtSintonizadorCambio">Sintonizador</label>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <select class="form-select" id="slcTriplexorCambio" aria-label="Selecciona una opción" required>
                  <option value="" selected disabled>Elige una opción</option>
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
                  <input type="number" id="txtNumSpliterCambio" class="form-control" placeholder="Spliter" min="0" max="999" required>
                  <label for="txtNumSpliterCambio">Número Spliter</label>
                </div>
                <div class="form-floating">
                  <select class="form-select" id="slcSpliterCambio" aria-label="Selecciona una opción" required>
                    <option value="" selected disabled>Elige una opción</option>
                    <option value="1">1x3</option>
                    <option value="2">1x5</option>
                    <option value="3">1x8</option>
                  </select>
                  <label for="slcSpliterCambio">Spliter Cambio</label>
                </div>
              </div>
            </div>
            <div class="col-md">
              <div class="input-group">
                <div class="form-floating flex-fill">
                  <input type="number" class="form-control" id="txtCableCambio" placeholder="Cable" min="0" max="999" required>
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

          <hr>

          <div class="col-md">
            <div class="form-floating">
              <textarea class="form-control" id="txtaEstadoFinal" style="height: 100px" required></textarea>
              <label for="txtaEstadoFinal">Estado Final</label>
            </div>
          </div>
        </div>

        <hr>
      </form>
    </div>
  </div>
</div>

<?php require_once '../../footer.php'; ?>
<script src="../../js/SoporteCable.js" type="module"></script>