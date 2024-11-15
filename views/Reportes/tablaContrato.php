<?php require_once '../../header.php'; ?>
<?php $host = $_ENV['HOST']; ?>
<!-- Modal -->
<div class="modal fade" id="detalleContrato" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="nombrePersona">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>


<div class="container-fluid px-4">
  <div class="form-container mt-4">
    <div class="card">
      <div class="card-header">
      <h5 id="nombreCliente"></h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table id="listarContratos" class="table mt-4">
            <thead>
              <tr>
                <th>Paquete</th>
                <th>Dirección</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Averias</th>
                <th>Detalles</th>
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
<script type="module" src="../../js/tablaContrato.js"></script>
</body>

</html>