<?php require_once '../../header.php'; ?>
<div class="container mt-2">
  <h2>Registrar Usuario</h2>
  <div class="card mt-3">
    <div class="card-header">
      <h4>Registrar Usuario</h4>
    </div>
    <div class="card-body">
      <form id="registerForm" action="registrar_usuario_action.php" method="POST">
        <div class="form-floating mb-3">
          <input type="text" id="txtApe" name="apellidos" class="form-control" required>
          <label for="txtApe">Apellidos</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" id="txtNombre" name="nombres" class="form-control" required>
          <label for="txtNombre">Nombres</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" id="txtTelPrincipal" name="telefono" class="form-control" required>
          <label for="txtTelPrincipal">Teléfono Principal</label>
        </div>
        <div class="form-floating mb-3">
          <input type="email" id="txtEmail" name="email" class="form-control" required>
          <label for="txtEmail">Correo Electrónico</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" id="txtUsuario" name="usuario" class="form-control" required>
          <label for="txtUsuario">Usuario</label>
        </div>
        <div class="form-floating mb-3">
          <input type="password" id="txtContrasena" name="contrasena" class="form-control" required>
          <label for="txtContrasena">Contraseña</label>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#confirmModal">Registrar</button>
          <a href="index.php" class="btn btn-danger">Cancelar</a>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- Modal de Confirmación -->
<div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmModalLabel">Confirmar Registro</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        ¿Está seguro de que desea registrar este usuario?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary" id="confirmRegister">Confirmar</button>
      </div>
    </div>
  </div>
</div>

<?php require_once "../../footer.php"; ?>

<script src="../../js/registrar.js" type="module"></script>

