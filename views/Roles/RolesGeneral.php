<?php require_once "../../header.php"; ?>

<div class="modal fade" id="mdlPermisos" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Permisos</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="mdlBodyPermisos">
        <div class="container">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">
                Permisos
              </h5>
              <div class="card-text">
                <table class="table" id="tablaPermisos">
                  <thead>
                    <tr>
                      <th scope="col">Módulos</th>
                      <th scope="col"><input type="checkbox" class="form-check-input" id="chkLeer">Leer</th>
                      <th scope="col"><input type="checkbox" class="form-check-input" id="chkCrear">Crear</th>
                      <th scope="col"><input type="checkbox" class="form-check-input" id="chkActualizar">Actualizar</th>
                      <th scope="col"><input type="checkbox" class="form-check-input" id="chkEliminar">Eliminar</th>
                    </tr>
                  </thead>
                  <tbody id="cardBodyTabla">

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" id="btnCambiosPermisos" class="btn btn-primary">Guardar cambios</button>
      </div>
    </div>
  </div>
</div>

<div class="container-fluid px-4">
  <h2 class="mt-4 text-center">Roles y Permisos </h2>
  <div class="container-fluid d-flex justify-content-center py-4">
    <div class="card w-100" style="max-width: 90%;">
      <div class="card-header text-center">Agregar Rol</div>
      <div class="card-body">
        <div class="d-flex justify-content-center">
          <div class="col-md-6 mb-3">
              <form id="frmRol">
                <label for="nombreRol">Nombre de Rol</label>
                <div class="input-group w-200 mx-auto">
                  <input type="text" class="form-control" id="nombreRol" name="rol" required autocomplete="off">
                  <button class="btn btn-primary" type="submit" id="btnAgregar">Agregar</button>
                  <button class="btn btn-warning" type="submit" id="btnActualizar">Actualizar</button>
                </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container-fluid d-flex justify-content-center py-4">
    <div class="card w-100" style="max-width: 90%;">
      <div class="card-header">Gestionar Permisos de Rol</div>
      <div class="card-body">
        <table id="tablaRol" class="display">
          <thead>
            <tr>
              <th>Rol</th>
              <th>Permisos</th>
              <th>Actualizar</th>
              <th>Inhabilitar</th>
            </tr>
          </thead>
          <tbody id="mostrar">
            
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
<script type="module" src="../../js/Rol.js"></script>
<?php require_once "../../footer.php"; ?>
</body>
</html>