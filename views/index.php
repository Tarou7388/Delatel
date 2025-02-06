<?php require_once "../header.php"; ?>

<link rel="stylesheet" href="../css/diseñoGlobal.css" />

<!-- Modal Mapa -->
<div class="modal fade" id="ModalMapa" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-bs-backdrop="static">
  <div class="modal-dialog modal-lg" role="document"> <!-- Cambiado a modal-lg -->
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="myModalLabel">Dirección del Cliente</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div class="modal-body">
        <div id="map" style="height: 600px;"> <!-- Ajustar el alto del mapa si es necesario -->
          <!-- Contenido del mapa -->
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal de Contactos -->
<div class="modal fade" id="detalleModalContactos" tabindex="-1" aria-labelledby="detalleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="detalleModalLabel">Detalles del Contacto</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p><strong>ID:</strong> <span id="detalleId"></span></p>
        <p><strong>Nombre y Apellido:</strong> <span id="detalleNombre"></span></p>
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

<!-- Modal de Kardex -->
<div class="modal fade" id="detalleModalKardex" tabindex="-1" aria-labelledby="detalleModalKardexLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="detalleModalKardexLabel">Detalles del Kardex</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p><strong>ID:</strong> <span id="detalleIdKardex"></span></p>
        <p><strong>Creado por:</strong> <span id="detalleUsuario"></span> </p>
        <p><strong>Fecha:</strong> <span id="detalleFecha"></span></p>
        <p><strong>Marca:</strong> <span id="detalleMarca"></span></p>
        <p><strong>Tipo:</strong> <span id="detalleTipo"></span></p>
        <p><strong>Saldo:</strong> <span id="detalleSaldo"></span></p>
        <p><strong>Tipo Movimiento</strong> <span id="detalleTipoMovimiento"></span></p>
        <p><strong>Motivo:</strong> <span id="detalleMotivo"></span></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

<div class="container-fluid">
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