<?php require_once '../../header.php'; ?>
<?php $host = $_ENV['HOST']; ?>

<div class="container-fluid px-4">
  <h1 class="mt-4">Usuarios</h1>

  <div class="card mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
      <div>
        <i class="fas fa-table me-1"></i> Gestionar Usuarios
      </div>
      <a href="<?= $host ?>views/Usuarios/registrar.php" class="btn btn-primary">Registrar Usuario</a>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table id="tblUsuarios" class="display">
          <thead>
            <tr>
              <th class="text-center">Nombre</th>
              <th class="text-center">Usuarios</th>
              <th class="text-center">Rol</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<!-- Modal -->
<div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editModalLabel">Actualizar Usuario</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="editForm" action="actualizar_usuario_action.php" method="POST">

          <div class="form-floating mb-3">
            <input type="text" id="txtNombre" name="nombre" class="form-control" placeholder="Nombre" required>
            <label for="txtNombre">Nombre</label>
          </div>

          <div class="form-floating mb-3">
            <input type="text" id="txtUsuario" name="usuario" class="form-control" placeholder="Usuario" required>
            <label for="txtUsuario">Usuario</label>
          </div>

          <div class="form-floating mb-3">
            <select id="slcRol" name="rol" class="form-select" required>
            </select>
            <label for="slcRol">Rol</label>
          </div>

          <div class="form-floating mb-3">
            <input type="text" id="txtPassword" name="usuario" class="form-control" placeholder="******" required>
            <label for="txtPassword">Clave Nueva</label>
          </div>

          <!-- NO SE USARA          <div class="form-floating mb-3">
            <input type="text" id="txtPassword" name="usuario" class="form-control" placeholder="Usuario" required>
            <label for="txtPassword">Clave</label>
          </div> -->

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-primary">Actualizar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<?php require_once "../../footer.php"; ?>

<script src="../../js/usuario.js" type="module"></script>