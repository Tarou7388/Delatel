<?php require_once '../../header.php'; ?>
<?php $host = $_ENV['HOST']; ?>

<link rel="stylesheet" href="../../css/diseñoGlobal.css" />

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
          <i class="fas fa-users card-icon"></i>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="card bg-light mb-3">
        <div class="card-header">Ticket Contratos</div>
        <div class="card-body">
          <h2 id="contratos-pendientes" class="card-title"></h2>
          <p id="total-soportes" class="card-text"></p>
          <a href="<?= $host ?>views/Ticket/" class="btn btn-primary">Ver Contratos</a>
          <i class="fas fa-ticket-alt card-icon"></i>
        </div>
      </div>
    </div>
  </div>

  <!-- Tabla de Averías Pendientes -->
  <div class="card mt-3">
    <div class="card-header">
      Averías Pendientes
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-striped" id="tblSticketsAverias">
          <thead>
            <tr>
              <th class="text-center">ID</th>
              <th class="text-center">Soporte</th>
              <th class="text-center">Cliente</th>
              <th class="text-center">Problema</th>
              <th class="text-center">Fecha de Creación</th>
              <th class="text-center">Sector</th>
              <th class="text-center">Estado</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <?php require_once '../../footer.php'; ?>
  <script type="module" src="../../js/sticket.js"></script>

  <body>
  </body>