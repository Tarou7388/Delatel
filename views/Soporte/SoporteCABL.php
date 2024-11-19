<?php require_once '../../header.php'; ?>

<div class="container-fluid px-4">
  <h1 class="mt-4">Soporte de Cable</h1>

  <div class="row g-3 mb-2">
    <div class="row g-3 mb-2">
      <div class="col md-6">
        <input type="text" class="form-control" id="txtNumFicha" placeholder="N°" disabled>
      </div>
      <div class="col md-6">
        <input type="date" class="form-control" id="txtFecha" placeholder="Fecha" disabled>
      </div>
    </div>
  </div>

  <br>

  <div class="card mb-4">
    <div class="card-header">
      Complete los datos
    </div>
    <div class="card-body">
      <form action="" id="form-cable" autocomplete="off">

        <!-- Primera Fila -->
        <h5>Datos del Usuario</h5>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <label>Número Identificador</label>
            <div class="input-group">
              <input type="text" class="form-control" maxlength="12" minlength="8" id="txtNrodocumento" disabled required>
            </div>
          </div>

          <div class="col-md">
            <label>Cliente</label>
            <input type="text" class="form-control" id="txtCliente" disabled required>
          </div>

          <div class="col-md">
            <label>Plan</label>
            <input type="text" class="form-control" id="txtPlan" disabled required>
          </div>
        </div>
        <hr>

        <!-- Segunda Fila -->
        <h5>Parámetros Técnicos</h5>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <select class="form-select" id="slcPeriodo" aria-label="Elija una opción" required>
                <option value="" selected disabled>Elige una opción</option>
                <option value="1">Mensual</option>
                <option value="2">Contado</option>
              </select>
              <label for="slcPeriodo">Periodo</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtPotencia" placeholder="Potencia" required>
              <label>Potencia</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtSintonizador" placeholder="Sintonizador" required>
              <label>Sintonizador</label>
            </div>
          </div>
        </div>
        <hr>

        <!-- Tercera Fila -->
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="input-group">
              <div class="form-floating flex-fill">
                <input type="text" id="txtNumTriplexor" class="form-control" placeholder="Triplexor" required>
                <label>Triplexor</label>
              </div>
              <select class="form-select" id="slcTriplexor" aria-label="Selecciona una opción" required>
                <option selected disabled>Elige una opción</option>
                <option value="1">No</option>
                <option value="2">Activo</option>
                <option value="3">Pasivo</option>
              </select>
            </div>
          </div>

          <div class="col-md">
            <div class="input-group">
              <div class="form-floating flex-fill">
                <input type="text" id="txtNumSpliter" class="form-control" placeholder="Spliter" required>
                <label>Spliter</label>
              </div>
              <select class="form-select" id="slcSpliter" aria-label="Selecciona una opción" required>
                <option value="" selected disabled>Elige una opción</option>
                <option value="1">1x3</option>
                <option value="2">1x5</option>
                <option value="3">1x8</option>
              </select>
            </div>
          </div>

          <div class="col-md">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCable" placeholder="Cable" required>
                <label>Cable</label>
              </div>
              <input type="number" class="form-control" id="txtPrecioCable" disabled required>
            </div>
          </div>

          <div class="col-md">
            <div class="input-group">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtConector" placeholder="Conectores" required>
                <label>Conectores</label>
              </div>
              <input type="number" class="form-control" id="txtPrecioConector" disabled required>
            </div>
          </div>
        </div>
        <hr>

        <!-- Cuarta Fila -->
        <div class="col-md">
          <div class="form-floating">
            <textarea type="text" class="form-control" id="txtaEstadoInicial" style="height: 100px" disabled required></textarea>
            <label>Estado Inicial</label>
          </div>
        </div>
        <hr>

        <h5>Cambios Técnicos</h5>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <select class="form-select" id="slcPeriodoCambio" aria-label="Selecciona una opción" required>
                <option value=""  selected disabled>Elige una opción</option>
                <option value="1">Mensual</option>
                <option value="2">Contado</option>
              </select>
              <label>Periodo</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtPotenciaCambio" placeholder="Potencia" required>
              <label>Potencia</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtSintonizadorCambio" placeholder="Sintonizador" required>
              <label>Sintonizador</label>
            </div>
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" id="txtNumTriplexorCambio" class="form-control" placeholder="Triplexor" required>
                <label>Triplexor</label>
              </div>
              <select class="form-select" id="slcTriplexorCambio" aria-label="Selecciona una opción" required>
                <option value="" selected disabled>Elige una opción</option>
                <option value="1">No</option>
                <option value="2">Activo</option>
                <option value="3">Pasivo</option>
              </select>
            </div>
          </div>

          <div class="col-md">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" id="txtNumSpliterCambio" class="form-control" placeholder="Spliter" required>
                <label>Spliter</label>
              </div>
              <select class="form-select" id="slcSpliterCambio" aria-label="Selecciona una opción" required>
                <option  value="" selected disabled>Elige una opción</option>
                <option value="1">1x3</option>
                <option value="2">1x5</option>
                <option value="3">1x8</option>
              </select>
            </div>
          </div>

          <div class="col-md">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCableCambio" placeholder="Cable" required>
                <label>Cable</label>
              </div>
              <input type="number" class="form-control" id="txtPrecioCableCambio" disabled required>
            </div>
          </div>

          <div class="col-md">
            <div class="input-group">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtConectorCambio" placeholder="Conectores" required>
                <label>Conectores</label>
              </div>
              <input type="number" class="form-control" id="txtPrecioConectorCambio" disabled required>
            </div>
          </div>
        </div>

        <div class="col-md">
          <div class="form-floating">
            <textarea type="text" class="form-control" id="txtaProceSolucion" style="height: 100px" required></textarea>
            <label>Procedimiento de Solución</label>
          </div>
        </div>

      </form>

    </div>

  </div>
</div>

<script src="../../js/SoporteCable.js" type="module"></script>
<?php require_once "../../footer.php"; ?>