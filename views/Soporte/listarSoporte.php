<?php require_once '../../header.php'; ?>


<!-- Modal Structure -->
<div class="modal fade" id="soporteModal" tabindex="-1" aria-labelledby="soporteModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="soporteModalLabel">Detalles del Soporte</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="container text-justify"><strong>Se encontraron varios servicios, seleccione el que se hara mantenimiento:</strong></div>
      <div class="modal-body">
        <!-- Body vacía para añadir contenido dinámico -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>


<div class="container-fluid px-4">
  <h1 class="mt-4">Fichas a Completar</h1>

  <div class="row g-2 mb-2 align-items-center">
    <div class="col-12 col-md-6 text-start mb-4">
      <div class="mb-2 d-inline">
        <a href="<?= $host; ?>views/Soporte/">Inicio</a> /
      </div>
    </div>
    <div class="col-12 col-md-6 text-md-end text-start mb-4">
      <div class="d-inline">
        <a href="<?= $host; ?>views/Soporte/" class="btn btn-primary me-2">
          <i class="fa-solid fa-arrow-left"></i> Registrar Soporte
        </a>
        <input type="date" class="form-control text-center d-inline" id="txtFecha" placeholder="Fecha" disabled style="width: auto;">
      </div>
    </div>
  </div>

  <div class="card mb-4">
    <div class="card-header">
      <h4><i class="fas fa-table me-1"></i> Listado de Fichas a terminar</h4>
      <div class="form-floating mb-3">
        <select class="form-control" name="slcPrioridad" id="slcPrioridad">
          <option value="" selected>Seleccione la Prioridad</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
        <label for="slcPrioridad">Prioridad</label>
      </div>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table id="tblSoporteIncompleto" class="table table-striped table-bordered display nowrap">
          <thead>
            <tr>
              <th class="text-center">Prioridad</th>
              <th class="text-center">Tipo Soporte</th>
              <th class="text-center">Nombre Cliente</th>
              <th class="text-center">Dirección</th>
              <th class="text-center">Hora de solicitud</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<?php require_once "../../footer.php"; ?>
</body>

<script type="module" src="../../js/ListarSoporte.js"></script>

</html>