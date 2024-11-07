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
                <th>Dirección</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Paquete</th>
                <th>Referencia</th>
                <th>Sector</th>
                <th>Tipo de Servicio</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

<?php require_once "../../footer.php"; ?>
<script type="module" src="../../js/Averias.js"></script>
</body>

</html>