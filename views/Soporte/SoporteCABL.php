<?php require_once '../../header.php'; ?>

<link rel="stylesheet" href="../../css/diseñoGlobal.css" />
<!-- Modal añadir -->
<div class="modal fade" id="modalSintonizador" tabindex="-1" aria-labelledby="modalSintonizadorLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalSintonizadorLabel">Detalles del Sintonizador</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formSintonizador">
          <div class="mb-3">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCodigoBarraSintonizador" placeholder="Ingrese el código de barra">
                <label for="txtCodigoBarra" class="form-label">Código de Barra</label>
              </div>
              <button class="btn btn-primary" id="btnBuscarSintonizador" type="button">Buscar</button>
            </div>
          </div>
          <div class="mb-3">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtMarcaSintonizador" placeholder="Ingrese la marca" disabled>
              <label for="txtMarca" class="form-label">Marca</label>
            </div>
          </div>
          <div class="mb-3">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtModeloSintonizador" placeholder="Ingrese el modelo" disabled>
              <label for="txtModelo" class="form-label">Modelo</label>
            </div>
          </div>
          <div class="mb-3">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtPrecioSintonizador" placeholder="Ingrese el precio" disabled>
              <label for="txtPrecio" class="form-label">Precio</label>
            </div>
          </div>
          <div class="mb-3">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtSerieSintonizador" placeholder="Ingrese la serie">
              <label for="txtSerie" class="form-label">Serie</label>
            </div>
          </div>
        </form>

        <div id="divSintonizadores" class="mt-3"></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" id="btnAgregarSintonizador">Añadir</button>
      </div>
    </div>
  </div>
</div>


<!-- modal listar -->
<div class="modal fade" id="modalListarSintonizadores" tabindex="-1" aria-labelledby="modalListarSintonizadoresLabel" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalListarSintonizadoresLabel">Lista de Sintonizadores</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div id="sintonizadoresContainer" class="row gy-3">
          <!-- Aquí se generarán los cards dinámicamente -->
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

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
                <label for="txtCliente" id="lblCliente">Cliente</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtPlan" placeholder="Plan" disabled>
                <label for="txtPlan" id="lblPlan">Plan</label>
              </div>
            </div>
          </div>
        </section>

        <hr>
        <!-- Parámetros Técnicos -->
        <h5>Parámetros Técnicos</h5>
        <section>
          <div class="row g-3 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <select id="slcCaja" class="form-select">
                  <option value="" disabled selected>Seleccione una opción</option>
                </select>
                <label for="slcCaja" id="lblCaja">Caja</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtPotencia" placeholder="Potencia" disabled required>
                <label for="txtPotencia" id="lblPotencia">Potencia</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtPuerto" placeholder="Potencia" disabled required>
                <label for="txtPuerto">Puerto</label>
              </div>
            </div>
            <div class="col-md">
              <div class="input-group">
                <div class="form-floating flex-grow-1">
                  <input type="text" class="form-control" id="txtSintonizador" placeholder="Sintonizador" disabled required>
                  <label for="txtSintonizador" id="lblSintonizador">Sintonizador</label>
                </div>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalListarSintonizadores" id="btnlistar">Listar</button>
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
                <label for="slcTriplexor" id="lblTriplexor">Triplexor</label>
              </div>
            </div>
            <div class="col-md">
              <div class="input-group">
                <div class="form-floating flex-fill">
                  <input type="text" id="txtNumSpliter" class="form-control" placeholder="Número Spliter" disabled required>
                  <label for="txtNumSpliter" id="lblNumSpliter">Número Spliter</label>
                </div>
                <div class="form-floating">
                  <select class="form-select" id="slcSpliter" required disabled>
                    <option value="" disabled selected>Elige una opción</option>
                    <option value="1x3">1x3</option>
                    <option value="1x5">1x5</option>
                    <option value="1x8">1x8</option>
                  </select>
                  <label for="slcSpliter" id="lblSpliter">Spliter</label>
                </div>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="input-group">
                <div class="form-floating flex-fill">
                  <input type="text" class="form-control" id="txtCable" placeholder="Cable" disabled required>
                  <label for="txtCable" id="lblCable">Cable</label>
                </div>
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtPrecioCable" placeholder="Precio Cable" disabled required>
                  <label for="txtPrecioCable" id="lblPrecioCable">Precio Cable</label>
                </div>
              </div>
            </div>
            <div class="col-md">
              <div class="input-group">
                <div class="form-floating flex-fill">
                  <input type="number" class="form-control" id="txtConector" placeholder="Conectores" disabled required>
                  <label for="txtConector" id="lblConector">Conectores</label>
                </div>
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtPrecioConector" placeholder="Precio Conector" disabled required>
                  <label for="txtPrecioConector" id="lblPrecioConector">Precio Conector</label>
                </div>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtNapGpon" placeholder="NAP GPON" min="-70" max="20" required disabled>
                <label for="txtNapGpon" id="lblnapgpon">NAP GPON</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtNapCatv" placeholder="NAP CATV" min="-70" max="20" required disabled>
                <label for="txtNapCatv" id="lblnapcatv">NAP CATV</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtCasaGpon" placeholder="Casa GPON" min="-70" max="20" required disabled>
                <label for="txtCasaGpon" id="lblcasagpon">Casa GPON</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtCasaCatv" placeholder="Casa CATV" min="-70" max="20" required disabled>
                <label for="txtCasaCatv" id="lblcasacatv">Casa CATV</label>
              </div>
            </div>
          </div>



          <div class="col-md">
            <div class="form-floating">
              <textarea class="form-control" id="txtaEstadoInicial" style="height: 100px" disabled required></textarea>
              <label for="txtaEstadoInicial" id="lblEstadoInicial">Estado Inicial</label>
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
                <input type="number" class="form-control" id="txtPuertoCambio" placeholder="Puerto" required>
                <label for="txtPuertoCambio">Puerto</label>
              </div>
            </div>
            <div class="col-md">
              <div class="input-group">
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtSintonizadorCambio" placeholder="Sintonizador" required min="0" max="999" disabled>
                  <div class="invalid-feedback">Sintonizador debe estar entre 0 y 999.</div>
                  <label for="txtSintonizadorCambio">Sintonizador</label>
                </div>
                <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalSintonizador">Añadir</button>
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

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtCambioNapGpon" placeholder="NAP GPON" min="-70" max="20" required>
                <label for="txtNapGpon">NAP GPON</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtCambioNapCatv" placeholder="NAP CATV" min="-70" max="20" required>
                <label for="txtNapCatv">NAP CATV</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtCambioCasaGpon" placeholder="Casa GPON" min="-70" max="20" required>
                <label for="txtCasaGpon">Casa GPON</label>
              </div>
            </div>
            <div class="col-md">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtCambioCasaCatv" placeholder="Casa CATV" min="-70" max="20" required>
                <label for="txtCasaCatv">Casa CATV</label>
              </div>
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-md">
              <div class="form-floating">
                <textarea class="form-control" id="txtDetalleCosto" style="height: 100px" required></textarea>
                <label for="txtDetalleCosto">Detalle</label>
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