<?php require_once '../../header.php'; ?>
<?php $host = $_ENV['HOST']; ?>
<div class="modal" tabindex="-1" id="modalContratos">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Contratos del Cliente</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
      </div>
      <div class="modal-body">
        <p id="detallesContrato">Cargando contratos...</p>
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
              <tr>
                <th class="text-center">#</th>
                <th class="text-center">Cliente</th>
                <th class="text-center">Numero Documento</th>
                <th class="text-center">Contrato</th>
              </tr>
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