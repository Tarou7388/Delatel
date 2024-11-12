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
      <form action="" id="form-registro-wisp" autocomplete="off">

        <!-- Primera Fila -->
        <h5>Datos del Cliente</h5>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating flex-fill">
              <input type="tel" class="form-control" maxlength="11" minlength="11" pattern="[0-11]+" id="txtNrodocumento" placeholder="Numero Identificador" disabled autofocus required>
              <label>Número Identificador</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCliente" placeholder="Cliente" disabled>
              <label>Cliente</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtPlan" placeholder="Plan" disabled>
              <label>Plan</label>
            </div>
          </div>

        </div> <!-- Fin de la Primera Fila -->

        <hr>

        <!-- Segunda fila -->
        <h5>Parámetros Técnicos</h5>
        <div class="row g-2 mb-2">

          <div class="col-md">
            <div class="form-floating">
              <select class="form-select" id="slcPeriodo" aria-label="Elija una opción">
                <option selected disabled>Elige una opción</option>
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
              <input type="text" class="form-control" id="txtSintonizador" placeholder="Sintonizazdor">
              <label>Sintonizador</label>
            </div>
          </div>

        </div> <!-- Fin de Segunda Fila -->

        <hr>

        <!-- Tercera Fila -->
        <div class="row g-2 mb-2">

          <div class="col-md">
            <div class="input-group">
              <div class="form-floating flex-fill">
                <input type="text" id="txtNumTriplexor" class="form-control" placeholder="Triplexor">
                <label>Triplexor</label>
              </div>
              <select class="form-select" id="slcTriplexor" aria-label="Selecciona una opción">
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
                <input type="text" id="txtNumSpliter" class="form-control" placeholder="Spliter">
                <label>Spliter</label>
              </div>
              <select class="form-select" id="slcSpliter" aria-label="Selecciona una opción">
                <option selected disabled>Elige una opción</option>
                <option value="1">1x3</option>
                <option value="2">1x5</option>
                <option value="3">1x8</option>
              </select>
            </div>
          </div>

          <div class="col-md">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCable" placeholder="Cable">
                <label>Cable</label>
              </div>
              <input type="number" class="form-control" id="txtPrecioCable" disabled>
            </div>
          </div>

          <div class="col-md">

            <div class="input-group">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtConector" placeholder="Conectores">
                <label>Conectores</label>
              </div>
              <input type="number" class="form-control" id="txtPrecioConector" disabled>
            </div>
          </div> <!-- Fin de Tercera Fila -->

        </div>

        <!-- Cuarta Fila -->
        <div>
          <div class="col-md">
            <div class="form-floating">
              <textarea type="text" class="form-control" id="txtaEstadoInicial" style="height: 100px" required></textarea>
              <label>Estado Inicial</label>
            </div>
          </div>
        </div>

        <hr>

        <h5>Cambios Técnicos</h5>
        <div class="row g-2 mb-2">

          <div class="col-md">
            <div class="form-floating">
              <select class="form-select" id="slcPeriodo" aria-label="Selecciona una opción">
                <option selected disabled>Elige una opción</option>
                <option value="1">Mensual</option>
                <option value="2">Contado</option>
              </select>
              <label>Periodo</label>
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
              <input type="text" class="form-control" id="txtSintonizador" placeholder="Sintonizador">
              <label>Sintonizador</label>
            </div>
          </div>

        </div> <!-- Fin de Segunda Fila -->

        <hr>

        <!-- Tercera Fila -->
        <div class="row g-2 mb-2">

          <div class="col-md">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" id="txtNumTriplexor" class="form-control" placeholder="Triplexor">
                <label>Triplexor</label>
              </div>
              <select class="form-select" id="slcTriplexor" aria-label="Selecciona una opción">
                <option selected disabled>Elige una opción</option>
                <option value="1">No</option>
                <option value="2">Activo</option>
                <option value="3">Pasivo</option>
              </select>
            </div>
          </div>

          <div class="col-md">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" id="txtNumSpliter" class="form-control" placeholder="Sliter">
                <label>Spliter</label>
              </div>
              <select class="form-select" id="slcSpliter" aria-label="Selecciona una opción">
                <option selected disabled>Elige una opción</option>
                <option value="1">1x3</option>
                <option value="2">1x5</option>
                <option value="3">1x8</option>
              </select>
            </div>
          </div>

          <div class="col-md">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCable" placeholder="Cable">
                <label>Cable</label>
              </div>
              <input type="number" class="form-control" id="txtPrecioCable" disabled>
            </div>
          </div>

          <div class="col-md">
            <div class="input-group">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtConector" placeholder="Conectores">
                <label>Conectores</label>
              </div>
              <input type="number" class="form-control" id="txtPrecioConector" disabled>
            </div>
          </div> <!-- Fin de Tercera Fila -->

        </div>

        <!-- Cuarta Fila -->
        <div>
          <div class="col-md">
            <div class="form-floating">
              <textarea type="text" class="form-control" id="txtaProceSolucion" style="height: 100px" required></textarea>
              <label>Procedimiento de Solución</label>
            </div>
          </div>
        </div>

      </form>
    </div>

  </div>
</div>

<script src="../../js/averiaCable.js" type="module"></script>
<?php require_once "../../footer.php"; ?>