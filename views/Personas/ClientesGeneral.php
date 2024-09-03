<?php require_once '../../header.php'; ?>
<div class="container">
  <div class="card mt-3">
    <div class="card-header">
      <h4>Registrar Cliente</h4>
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
              <input type="number" id="nDoc" class="form-control">
              <button class="btn btn-primary" type="button" id="btnBuscar">Buscar</button>
            </div>
          </div>
          <div class="col-md-4">
            <label for="" class="form-label">Apellidos</label>
            <input type="text" id="txtPaterno" class="form-control" disabled>
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
  <div class="card mt-5">
    <div class="card-header">
      <h4>Listar Clientes</h4>
    </div>
    <div class="card-body">
      <table id="listarCliente" class="table table-striped mt-4">
        <thead>
          <tr>
            <th>N°</th>
            <th>Nombres y Apellidos</th>
            <th>Tipo Doc.</th>
            <th>Numero de Doc.</th>
            <th>Telefono</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>persona 1</td>
            <td>DNI</td>
            <td>71592495</td>
            <td>907520277</td>
            <td>example@example.com</td>
            <td>Activo</td>
            <td>
              <button class="btn btn-primary" title="Actualizar" data-bs-toggle="modal" data-bs-target="#updateModal">
                <i class="fas fa-sync-alt"></i>
              </button>
              <button class="btn btn-danger" title="Eliminar">
                <i class="fas fa-trash-alt"></i> <!-- Font Awesome icon for delete -->
              </button>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="updateModalLabel">Actualizar Cliente</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="updateForm">
            
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary" id="saveChanges">Guardar cambios</button>
        </div>
      </div>
    </div>
  </div>


</div>
<script src="../../js/clientes.js"></script>
<?php require_once '../../footer.php'; ?>