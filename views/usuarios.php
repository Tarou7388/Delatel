<?php require_once '../header.php'; ?>
<div class="container mt-2">
  <h2>Usuarios</h2>
  <div class="card mt-3">
    <div class="card-header">
      <h4>Registrar Usuario</h4>
    </div>
    <div class="card-body">
      <form action="">
        <div class="row">
          <div class="col-md-4">
            <label for="" class="form-label">Numero de documento</label>
            <div class="input-group">
              <input type="number" id="nDoc" class="form-control">
              <button class="btn btn-primary" type="button" id="searchButton">Buscar</button>
            </div>
          </div>
          <div class="col-md-4">
            <label for="" class="form-label">Apellidos Paternos</label>
            <input type="text" id="apPaterno" class="form-control" disabled>
          </div>
          <div class="col-md-4">
            <label for="" class="form-label">Apellidos Maternos</label>
            <input type="text" id="apMaterno" class="form-control" disabled>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <label for="" class="form-label">Nombres</label>
            <input type="text" id="nombre" class="form-control" disabled>
          </div>
          <div class="col-md-4">
            <label for="" class="form-label">Telefono Principal</label>
            <input type="text" id="telPrincipal" class="form-control">
          </div>
          <div class="col-md-4">
            <label for="" class="form-label">Correo</label>
            <input type="text" id="email" class="form-control">
          </div>
        </div>
      </form>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      <h4>Listar usuarios</h4>
    </div>
    <div class="card-body">
      <table>
        
      </table>
    </div>
  </div>
</div>
<?php require_once "../footer.php"; ?>