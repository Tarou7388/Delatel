<?php require_once "../../header.php" ?>
<?php $host = $_ENV['HOST']; ?>

<div class="container-fluid px-4">
  <h1 class="mt-4">Actividades</h1>

  <ol class="breadcrumb mb-4">
    <li class="breadcrumb-item active">Gestion de mapa</li>
  </ol>

  <div class="card mt-3">
    <div class="card-header">
      <i class="fas fa-table me-1"></i>
      Registro de datos
    </div>

    <div class="card-body" id="contenido">
      <div id="map" style="height: 700px;"></div>
    </div>
  </div>
</div>

<?php require_once "../../footer.php"; ?>
<script type="module" src="<?= $host ?>js/MapaGestion.js"></script>
</body>

</html>