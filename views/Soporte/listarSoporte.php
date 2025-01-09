<?php require_once '../../header.php'; ?>

<link rel="stylesheet" href="../../css/contratos.css">
<link rel="stylesheet" href="../../css/diseñoGlobal.css" />

<!-- Modal Structure -->
<div class="modal fade" id="soporteModal" tabindex="-1" aria-labelledby="soporteModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="soporteModalLabel">Detalles del Soporte</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="container text-justify"><strong>Se encontraron 2 o más servicios, seleccione al que se hara mantenimiento:</strong></div>
      <div class="modal-body">
        <!-- Body vacía para añadir contenido dinámico -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Mapa -->
<div class="modal fade" id="ModalMapa" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="myModalLabel">Mapa de Cobertura</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="input-group mb-3">
        <input type="text" id="CoordenadaModel" class="form-control" placeholder="Coordenada" aria-label="Coordenada">
        <button class="btn btn-outline-secondary" type="button" id="buscarBtn">Buscar</button>
      </div>
      <div class="modal-body">
        <div id="map" style="height: 700px;">

        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" id="btnGuardarModalMapa" data-dismiss="modal" disabled>Guardar cambios</button>
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
              <th class="text-center d-none d-sm-table-cell">Prioridad</th>
              <th class="text-center d-none d-sm-table-cell">Tipo Soporte</th>
              <th class="text-center d-none d-sm-table-cell">Servicios</th>
              <th class="text-center">Nombre Cliente</th>
              <th class="text-center d-none d-sm-table-cell">Dirección</th>
              <th class="text-center d-none d-sm-table-cell">Hora de solicitud</th>
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