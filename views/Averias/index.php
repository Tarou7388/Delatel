<?php require_once '../../header.php'; ?>
<?php $host = $_ENV['HOST']; ?>
<div class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Título del modal</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>El texto del cuerpo modal va aquí.</p>
      </div>
    </div>
  </div>
</div>
<div class="container-fluid px-4">
  <div class="form-container mt-4">
    <div class="card">
      <div class="card-header">
        <h3>Personas con Contratos</h3>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table id="listarClienteyContratos" class="table mt-4">
            <thead>
              <th class="text-center">#</th>
              <th class="text-center">Numero Documento</th>
              <th>Cliente</th>
              <th class="text-center">Contrato</th>
            </thead>
            <tbody>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
<?php require_once "../../footer.php"; ?>
<script type="module" src="../../js/Averias.js"></script>