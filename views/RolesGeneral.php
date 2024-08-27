<?php require_once "../header.php"; ?>

<div class="container-fluid px-4">
  <h2 class="mt-4">Roles y Permisos </h2>

  <div class="container-fluid d-flex justify-content-center py-4">
    <div class="card w-100" style="max-width: 90%;">
      <div class="card-header">Agregar Rol</div>
      <div class="card-body">
        <div class="col-md-2 mb-3">
          <div class="form-group">
            <!-- Cambiado el formulario para que tenga un id -->
            <form id="frmRol">
              <label for="nombreRol">Nombre de Rol</label>
              <div class="input-group">
                <!-- Asegúrate de que el input tenga el atributo name correcto -->
                <input type="text" class="form-control" id="nombreRol" name="rol" required autocomplete="off">
                <!-- Cambiado el botón para que no envíe el formulario tradicionalmente -->
                <button class="btn btn-primary" type="submit">Agregar</button>
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
        <table id="myTable" class="display">
          <thead>
            <tr>
              <th>Rol</th>
              <th>Permisos</th>
            </tr>
          </thead>
          <tbody>
            
          </tbody>
        </table>
      </div>

    </div>
  </div>
</div>
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary">Eliminar</button>
        <button type="button" class="btn btn-primary">Guardar</button>
      </div>
    </div>
  </div>
</div>
<?php require_once "../footer.php"; ?>
</body>
<script src="../js/Rol.js"></script>

</html>