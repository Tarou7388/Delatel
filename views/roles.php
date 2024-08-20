<?php require_once "../header.php"; ?>

<div class="container-fluid px-4">
  <h2 class="mt-4">Roles y Permisos </h2>

  <div class="container-fluid d-flex justify-content-center py-4">
    <div class="card w-100" style="max-width: 90%;">
      <div class="card-header">Agregar Rol</div>
      <div class="card-body">
        <div class="col-md-2 mb-3">
          <div class="form-group">
            <form action="">
              <label for="nombreRol">Nombre de Rol</label>
              <div class="input-group">
                <input type="text" class="form-control" id="nombreRol" name="nombreRol" required>
                <button class="btn btn-primary" type="button">Agregar</button>
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
            <tr>
              <td>Rol 1</td>
              <td><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Ver permisos</button></td>
            </tr>
            <tr>
              <td>Rol 2</td>
              <td><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Ver permisos</button></td>
            </tr>
            <tr>
              <td>Rol 3</td>
              <td><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Ver permisos</button></td>
            </tr>
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


<script>
  $(document).ready(function() {
    $('#myTable').DataTable({
      "paging": false,
      "searching": false,
      "info": false,
      "lengthChange": false
    });
  });
</script>

</html>