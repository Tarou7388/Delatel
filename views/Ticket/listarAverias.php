<?php require_once '../../header.php'; ?>
<?php $host = $_ENV['HOST']; ?>


<style>
  /* Estilos generales */
  body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
  }

  /* Contenedor de las tarjetas */
  .row {
    display: flex;
    flex-wrap: wrap;
    margin: -10px;
  }

  /* Estilos de las tarjetas */
  .col-md-6 {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }

  @media (min-width: 768px) {
    .col-md-6 {
      width: 50%;
    }
  }

  .card {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  /* Tarjeta verde claro */
  .card.bg-light:nth-child(1) {
    background-color: #e6f3e6;
  }

  /* Tarjeta gris claro */
  .card.bg-light:nth-child(2) {
    background-color: #f0f0f0;
  }

  .card-header {
    padding: 15px 20px;
    border-bottom: 1px solid #e9ecef;
    font-weight: bold;
    color: #495057;
  }

  .card-body {
    padding: 20px;
    position: relative;
  }

  .card-title {
    font-size: 24px;
    margin: 0 0 10px 0;
    color: #212529;
  }

  .card-text {
    margin: 0 0 15px 0;
    color: #6c757d;
  }

  /* Estilos específicos */
  #clientes-online,
  #contratos-pendientes {
    margin: 0;
  }

  #total-registrados,
  #total-soportes {
    font-size: 14px;
  }

  .card-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 48px;
    color: #6c757d;
  }
</style>


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