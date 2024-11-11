<?php require_once '../../header.php'; ?>
<?php $host = $_ENV['HOST']; ?>

<div class="container-fluid px-4">
  <h2 class="mt-4">Registro de Incidencias</h2>

  <!-- MODAL DE CONTRATOS -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Selecciona un Plan</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <ul class="list-group">
            <!-- AQUI SE CARGARAN LAS OPCIONES DE CONTRATOS -->
          </ul>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>

  <div class="row g-2 mb-2 align-items-center">
    <div class="col text-start">
      <a href="<?= $host; ?>views/Soporte/">Inicio</a> /
    </div>
    <div class="col text-end">
      <div class="d-flex flex-wrap justify-content-end align-items-center">
        <input type="date" class="form-control text-center" id="txtFecha" placeholder="Fecha" disabled style="max-width: 150px;">
      </div>
    </div>
  </div>

  <div class="card mb-4">
    <div class="card-header">
      <i class="fas fa-table me-1"></i> Complete los Datos de la Incidencia
    </div>
    <div class="card-body">
      <form id="form-Incidencia">
        <!-- Sección de Número de Documento -->
        <div class="row g-2 mb-2">
          <div class="col-12 col-md">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" maxlength="12" minlength="8" id="txtNrodocumento" placeholder="Número de Documento" autofocus required>
                <label for="txtNrodocumento">Número de Documento</label>
              </div>
              <button class="input-group-text btn btn-primary" type="button" id="btnNrodocumento">
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
              <button class="input-group-text btn btn-outline-info" type="button" id="btnBusquedaAvanzada">
                <i class="fas fa-ellipsis-h"></i>
              </button>
            </div>
          </div>

          <div class="col-12 col-md mt-2">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCliente" placeholder="Cliente" disabled required>
              <label for="txtCliente">Cliente</label>
            </div>
          </div>

          <!-- <div class="col-12 col-md mt-2">
            <div class="form-floating">
              <button id="btnModal" type="button" class="btn btn-info w-100 py-3" data-bs-toggle="modal" data-bs-target="#exampleModal">Seleccionar</button>
            </div>
          </div> -->

          <div class="col-12 col-md mt-2">
            <div class="form-floating">
              <select name="" id="slcContratos" class="form-control" required>
                <option disabled selected>Seleccione un Contrato</option>
              </select>
              <label for="slcContratos">Seleccione un Contrato</label>
            </div>
          </div>

          <!-- <div class="col-12 col-md mt-2">
            <div class="form-floating">
              <select class="form-select" id="slcPrioridad" required>
                <option disabled value="">Seleccione la Prioridad</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
                <option value="Incidencia">Incidencia</option>
              </select>
              <label for="slcPrioridad">Prioridad:</label>
            </div>
          </div> -->

        </div>

        <hr>

        <!-- Sección de Observaciones y Contrato -->
        <div class="row g-3 mb-3">
          <div class="col-12 col-md mt-2">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtContratoObservacion" placeholder="Contrato y Observacion" disabled required>
              <label for="txtContratoObservacion">Contrato y Observacion</label>
            </div>
          </div>
        </div>

        <!-- Sección de Descripción -->
        <div class="row g-3 mb-3">
          <div class="col">
            <div class="form-floating">
              <textarea class="form-control" id="txtDescripcion" rows="3" placeholder="Descripción de la incidencia" style="height: 100px" required></textarea>
              <label for="txtDescripcion">Descripción</label>
            </div>
          </div>
        </div>

        <!-- Sección de Solución -->
        <div class="row g-3 mb-3">
          <div class="col">
            <div class="form-floating">
              <textarea class="form-control" id="txtSolucion" rows="3" placeholder="Solución aplicada" style="height: 100px" required></textarea>
              <label for="txtSolucion">Solución</label>
            </div>
          </div>
        </div>

        <hr>

        <!-- Botones de acción -->
        <div class="container text-end">
          <button class="btn btn-secondary">Ficha Soporte</button>
          <button type="submit" class="btn btn-primary">Registrar</button>
          <a href="<?= $host; ?>views/Soporte/listarSoporte" class="btn btn-primary me-2">
            Listar Soporte <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </form>

    </div>
  </div>
</div>

<?php require_once "../../footer.php"; ?>

<script type="module" src="../../js/Soporte.js"></script>
</body>

</html>