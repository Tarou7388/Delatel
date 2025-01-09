<?php require_once '../../header.php'; ?>
<?php $host = $_ENV['HOST']; ?>

<link rel="stylesheet" href="../../css/diseñoGlobal.css" />

<div class="modal fade" id="detalleAveria" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="nombrePersona">Soporte</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <!-- Aquí se generarán dinámicamente los divs de las opciones -->
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
          <table id="listarAverias" class="table mt-4">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre Tecnico</th>
                <th>fecha y hora solicitud</th>
                <th>fecha y hora asistencia</th>
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
<script type="module" src="../../js/listarReporte.js"></script>
</body>

</html>