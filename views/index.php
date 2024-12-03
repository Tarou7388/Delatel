<?php require_once "../header.php"; ?>

<!-- Modal -->
<div class="modal fade" id="detalleModal" tabindex="-1" aria-labelledby="detalleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="detalleModalLabel">Detalles del Contacto</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p><strong>ID:</strong> <span id="detalleId"></span></p>
        <p><strong>Nombre y Apellido:</strong> <span id="detalleNombre"></span></p>
        <!-- <p><strong>Telefono:</strong> <span id="detalleTelefono"></span></p> -->
        <p><strong>Email:</strong> <span id="detalleEmail"></span></p>
        <p><strong>Dirección:</strong> <span id="detalleDireccion"></span></p>
        <p><strong>Cuando Llamó:</strong> <span id="detalleFechaCreacion"></span></p>
        <p><strong>Fecha Limite:</strong> <span id="detalleFechaLimite"></span></p>
        <p><strong>Paquete:</strong> <span id="detallePaquete"></span></p>
        <p><strong>Precio:</strong> <span id="detallePrecio"></span></p>
        <p><strong>Nota:</strong> <span id="detalleNota"></span></p>
        <p><strong>Usuario Creador:</strong> <span id="detalleUsuarioCreador"></span></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

<div class="container-fluid px-4">
  <h1 class="mt-4">Actividades</h1>

  <ol class="breadcrumb mb-4">
    <li class="breadcrumb-item active">Registro de Actividades para los Empleados</li>
  </ol>

  <div class="card mt-3">
    <div class="card-header">
      <i class="fas fa-table me-1"></i>
      Registro de datos
    </div>

    <div class="card-body" id="contenido">

    </div>
  </div>
</div>
<?php require_once "../footer.php"; ?>
<script type="module" src="../js/Actividades.js"></script>
</body>

</html>