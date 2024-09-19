<?php require_once '../../header.php'; ?>

<div class="container-fluid d-flex justify-content-center py-4">
    <div class="card w-100" style="max-width: 90%;">
        <div class="card-header">Gestionar Usuarios</div>
        <div class="card-body">
            <table id="listarUsuarios" name="listarUsuarios" class="display">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Usuarios</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
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
          <input type="hidden" id="userId" name="userId">
          <div class="form-floating mb-3">
            <input type="text" id="txtNombre" name="nombre" class="form-control" required>
            <label for="txtNombre">Nombre</label>
          </div>
          <div class="form-floating mb-3">
            <input type="text" id="txtUsuario" name="usuario" class="form-control" required>
            <label for="txtUsuario">Usuario</label>
          </div>
          <div class="form-floating mb-3">
            <select id="txtRol" name="rol" class="form-select" required>
              <option value="">Seleccione un rol</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
            </select>
            <label for="txtRol">Rol</label>
          </div>
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