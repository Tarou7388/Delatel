<?php require_once "../../header.php"; ?>

<link rel="stylesheet" href="../../css/diseñoGlobal.css" />

<div class="modal fade" id="mdlPermisos" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Permisos</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="mdlBodyPermisos">
        <div class="container">
          <div class="card mt-2">
            <div class="card-body">
              <label for="nombre">Actividad Principal:</label>
              <div class="card-text" id="contenido">
                <select id="selectActividad" class="form-select mb-3">
                  <option value="Mapa" selected>Mapa</option>
                  <option value="Soporte">Tabla de soportes</option>
                  <option value="Contratos">Tabla de contratos</option>
                  <option value="Kardex">Ultimos registros de Kardex</option>
                  <option value="Fichas">Soportes y instalacion faltantes</option>
                  <option value="Contactos" selected>Lista de Contactos</option>
                </select>
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
                    <!-- Contenido dinámico de la tabla -->
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
  <h1 class="mt-4">Configuración de Roles y Permisos</h1>

  <div class="card mb-4">
    <div class="card-header">
      <i class="fas fa-table me-1"></i> Gestión de Roles: Agregar/Actualizar
    </div>
    <div class="card-body">
      <div class="d-flex justify-content-center">
        <div class="col-md-6 mb-3">
          <form id="frmRol">
            <div class="input-group w-200 mx-auto">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtRol" placeholder="Rol" required autocomplete="off">
                <label for="txtRol">Rol</label>
              </div>
              <button class="btn btn-success" type="submit" id="btnAgregar">Agregar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container-fluid px-4">
  <div class="card mb-4">
    <div class="card-header">
      <i class="fas fa-table me-1"></i> Gestión de Permisos de Rol
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table id="tablaRol" class="display">
          <thead>
            <tr>
              <th>Rol</th>
              <th>Permisos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="mostrar">
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
<?php require_once "../../footer.php"; ?>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script type="module" src="../../js/Rol.js"></script>
</body>

</html>