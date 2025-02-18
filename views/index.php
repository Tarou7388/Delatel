<?php require_once "../header.php"; ?>

<link rel="stylesheet" href="../css/diseñoGlobal.css" />

<div class="container-fluid">
  <h1 class="mt-4">Actividades</h1>

  <ol class="breadcrumb mb-4">
    <li class="breadcrumb-item active">Registro de Actividades para los Empleados</li>
  </ol>

  <div class="card mt-3">
    <div class="card-header">
      <i class="fas fa-table me-1"></i>
      Actividades
    </div>

    <div class="card-body" id="contenido">

    </div>
    <div class="card-footer">
      <label id="sectorNombre" hidden></label>
    </div>
  </div>
</div>
<?php require_once "../footer.php"; ?>
<script type="module" src="../js/Actividades.js"></script>
</body>

</html>