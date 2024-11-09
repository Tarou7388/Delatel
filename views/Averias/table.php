<?php require_once '../../header.php'; ?>
<?php $host = $_ENV['HOST']; ?>
<div class="container-fluid px-4">
  <div class="form-container mt-4">
    <div class="card">
      <div class="card-header">
        
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table id="listarContratos" class="table mt-4">
            <thead>
              <tr>
                <th>Paquete</th>
                <th>Dirección</th>
                <th>Referencia</th>
                <th>Sector</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>AVerias</th>
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
<script type="module" src="../../js/averiaContrato.js"></script>
</body>

</html>