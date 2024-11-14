<?php require_once '../../header.php'; ?>
<?php $host = $_ENV['HOST']; ?>
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
<script type="module" src="../../js/listarAverias.js"></script>
</body>

</html>