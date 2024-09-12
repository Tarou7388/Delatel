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
            <div class="input-group">
              <div class="form-floating flex-fill">
                <input type="tel" class="form-control" maxlength="11" minlength="11" pattern="[0-11]+" id="txtNrodocumento" placeholder="Numero Identificador" autofocus required>
                <label>Número Identificador</label>
              </div>
              <button class="input-group-text btn btn-secondary" type="button" id="btnNrodocumento"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCliente" placeholder="Cliente">
              <label>Cliente</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtPlan" placeholder="Plan">
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
                <input type="text" id="txtNumSpliter" class="form-control">
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
            <label>Cable</label>
            <div class="input-group">
              <input type="text" class="form-control" id="txtCable">
              <input type="number" class="form-control" id="txtPrecioCable" disabled>
            </div>
          </div>

          <div class="col-md">
            <label>Conectores</label>
            <div class="input-group">
              <input type="number" class="form-control" id="txtConector">
              <input type="number" class="form-control" id="txtPrecioConector" disabled>
            </div>
          </div> <!-- Fin de Tercera Fila -->

        </div>

        <!-- Cuarta Fila -->
        <div>
          <div class="col-md">
            <label>Estado Inicial</label>
            <textarea type="text" class="form-control" id="txtaEstadoInicial" style="height: 100px" required></textarea>
          </div>
        </div>

        <hr>

        <h5>Cambios Técnicos</h5>
        <div class="row g-2 mb-2">

          <div class="col-md">
            <label>Periodo</label>
            <select class="form-select" id="slcPeriodo" aria-label="Selecciona una opción">
              <option selected disabled>Elige una opción</option>
              <option value="1">Mensual</option>
              <option value="2">Contado</option>
            </select>
          </div>

          <div class="col-md">
            <label>Potencia</label>
            <input type="text" class="form-control" id="txtPotencia" required>
          </div>

          <div class="col-md">
            <label>Sintonizador</label>
            <input type="text" class="form-control" id="txtSintonizador">
          </div>

        </div> <!-- Fin de Segunda Fila -->

        <hr>

        <!-- Tercera Fila -->
        <div class="row g-2 mb-2">

          <div class="col-md">
            <label>Triplexor</label>
            <div class="input-group">
              <input type="text" id="txtNumTriplexor" class="form-control">
              <select class="form-select" id="slcTriplexor" aria-label="Selecciona una opción">
                <option selected disabled>Elige una opción</option>
                <option value="1">No</option>
                <option value="2">Activo</option>
                <option value="3">Pasivo</option>
              </select>
            </div>
          </div>

          <div class="col-md">
            <label>Spliter</label>
            <div class="input-group">
              <input type="text" id="txtNumSpliter" class="form-control">
              <select class="form-select" id="slcSpliter" aria-label="Selecciona una opción">
                <option selected disabled>Elige una opción</option>
                <option value="1">1x3</option>
                <option value="2">1x5</option>
                <option value="3">1x8</option>
              </select>
            </div>
          </div>

          <div class="col-md">
            <label>Cable</label>
            <div class="input-group">
              <input type="text" class="form-control" id="txtCable">
              <input type="number" class="form-control" id="txtPrecioCable" disabled>
            </div>
          </div>

          <div class="col-md">
            <label>Conectores</label>
            <div class="input-group">
              <input type="number" class="form-control" id="txtConector">
              <input type="number" class="form-control" id="txtPrecioConector" disabled>
            </div>
          </div> <!-- Fin de Tercera Fila -->

        </div>

        <!-- Cuarta Fila -->
        <div>
          <div class="col-md">
            <label>Procedimiento de Solución</label>
            <textarea type="text" class="form-control" id="txtaProceSolucion" style="height: 100px" required></textarea>
          </div>
        </div>

        <hr>

        <!-- Botones -->
        <div class="row">
          <div class="col-12 text-center text-md-end mb-3">
            <button type="button" id="btnCodigoBarra" class="btn btn-warning btn-sm me-2 mb-2 mb-md-0">Verificar Código</button>
            <button type="submit" id="btnRegistrarSoporte" class="btn btn-primary btn-sm me-2 mb-2 mb-md-0">Registrar Soporte</button>
            <button type="reset" id="btnCancelar" class="btn btn-secondary btn-sm mb-2 mb-md-0">Cancelar Proceso</button>
          </div>
        </div>

      </form>
    </div>

  </div>
</div>

<?php require_once "../../footer.php"; ?>