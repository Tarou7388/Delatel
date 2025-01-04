<?php require_once '../../header.php'; ?>
<?php $host = $_ENV['HOST']; ?>

<div class="container-fluid px-4">

  <!-- Sección de Resumen -->
  <div class="row mt-4">
    <div class="col-md-6">
      <div class="card bg-light mb-3">
        <div class="card-header">Clientes</div>
        <div class="card-body">
          <h2 id="clientes-online" class="card-title"></h2>
          <p id="total-registrados" class="card-text"></p>
          <a href="<?= $host ?>views/Reportes/" class="btn btn-primary">Ver clientes</a>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="card bg-light mb-3">
        <div class="card-header">Ticket Soporte</div>
        <div class="card-body">
          <h2 id="tickets-soporte" class="card-title">28</h2>
          <p id="total-abiertos" class="card-text">Total Abiertos: 59</p>
          <a href="#" class="btn btn-primary">Ver tickets</a>
        </div>
      </div>
    </div>
  </div>

  <!-- Tabla de Contratos Pendientes -->
  <div class="card mt-3">
    <div class="card-header">
      Contratos Pendientes
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-striped" id="tblStickets">
          <thead>
            <tr>
              <th class="text-center">ID</th>
              <th class="text-center">Cliente</th>
              <th class="text-center">Paquete</th>
              <th class="text-center">Zona</th>
              <th class="text-center">Fecha de Creación</th>
              <th class="text-center">Técnico</th>
              <th class="text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<?php require_once '../../footer.php'; ?>
<script type="module" src="../../js/sticket.js"></script>
</body>

</html>