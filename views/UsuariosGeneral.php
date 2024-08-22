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
            <label for="lblTipoDoc" class="form-label">Tipo de Documento</label>
            <select name="" id="" class="form-select">
              <option value="0">DNI</option>
            </select>
          </div>
          <div class="col-md-4">
            <label for="" class="form-label">Numero de documento</label>
            <div class="input-group">
              <input type="number" id="txtNdoc" class="form-control" autocomplete="off">
              <button class="btn btn-primary" type="button" id="btnBuscar">Buscar</button>
            </div>
          </div>
          <div class="col-md-4">
            <label for="" class="form-label">Apellidos</label>
            <input type="text" id="txtApe" class="form-control" disabled>
          </div>
        </div>



        <div class="row">
          <div class="col-md-4">
            <label for="" class="form-label">Nombres</label>
            <input type="text" id="txtNombre" class="form-control" disabled >
          </div>
          <div class="col-md-4">
            <label for="" class="form-label">Telefono Principal</label>
            <input type="text" id="txtTelPrincipal" class="form-control" autocomplete="off">
          </div>
          <div class="col-md-4">
            <label for="" class="form-label">Correo</label>
            <input type="text" id="txtEmail" class="form-control" autocomplete="off">
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <label for="" class="form-label">Usuario</label>
            <input type="text" id="txtUsuario" class="form-control" autocomplete="off">
          </div>
          <div class="col-md-4">
            <label for="" class="form-label">Contraseña</label>
            <input type="password" id="txtContrasena" class="form-control" autocomplete="off">
          </div>
        </div>
        <div class="row mt-4">
          <div class="col">
            <button class="btn btn-primary">Registrar</button>
            <button class="btn btn-danger">Cancelar</button>
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
      <table id="listarUsuarios" class="table table-striped">
        <thead>
          <tr>
            <th>N°</th>
            <th>Nombre y Apellidos</th>
            <th>Nombre de usuario</th>
            <th>Cargo</th>
            <th>Fecha de inicio</th>
            <th>Fecha de baja</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <!-- <tr>
            <td>1</td>
            <td>usuario 1</td>
            <td>nombre 1</td>
            <td>tecnico</td>
            <td>01/01/24</td>
            <td>01/01/24</td>
            <td>
              <button class="btn btn-sm btn-primary">Editar</button>
              <button class="btn btn-sm btn-danger">Eliminar</button>
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>Usuario 2</td>
            <td>Nombre 2</td>
            <td>supervisor</td>
            <td>01/01/24</td>
            <td>01/01/24</td>
            <td>
              <button class="btn btn-sm btn-primary">Editar</button>
              <button class="btn btn-sm btn-danger">Eliminar</button>
            </td>
          </tr>
          Más filas de ejemplo -->
        </tbody>
      </table>
    </div>
  </div>
</div>
<script src="../js/datable-Usuarios.js"></script>
<?php require_once "../footer.php"; ?>