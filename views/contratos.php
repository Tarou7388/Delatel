<?php require_once '../header.php'; ?>
<div class="container">
  <h2 class="mt-3">Contratos</h2>
  <div class="card mt-5">
    <div class="card-header">
      <h4>Registrar contratos</h4>
    </div>
    <div class="card-body">
      <form action="" class="formularioRegistrarContrato">
        <div class="row">
          <div class="col-md-3">
            <label for="documento" class="form-label">Número de documento</label>
            <input type="text" class="form-control" id="documento" name="documento" required>
          </div>
          <div class="col-md-3">
            <label for="nombre" class="form-label">Nombre de cliente</label>
            <input type="text" class="form-control" id="nombre" name="nombre" required>
          </div>
          <div class="col-md-3">
            <label for="fecha-inicio" class="form-label">Fecha de inicio</label>
            <input type="date" class="form-control" id="fechaInicio" name="fechaInicio" required>
          </div>
          <div class="col-md-3">
            <label for="fecha-fin" class="form-label">Fecha de fin</label>
            <input type="date" class="form-control" id="fechaFin" name="fechaFin" required>
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-md-3">
            <label for="servicio" class="form-label">Servicio</label>
            <select class="form-select" id="servicio">
              <option value="">Elije un valor</option>
            </select>
          </div>
          <div class="col-md-3">
            <label for="" class="form-label">Precio</label>
            <input type="text" class="form-control" id="precio">
          </div>
          <div class="col-md-3">
            <label for="" class="form-label">Dirección de Servicio</label>
            <input type="text" class="form-control" id="direccion">
          </div>
          <div class="col-md-3">
            <label for="" class="form-label">Sector</label>
            <select name="" class="form-select" id="sector"></select>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3 mt-3">
            <button class="btn btn-primary">Registrar</button>
            <button class="btn btn-secondary">Cancelar</button>
          </div>
        </div>
      </form>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      <h4>Listar contratos</h4>
    </div>
    <div class="card-body">
    <table id="listarContratos" class="table table-striped">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Contrato</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cliente 1</td>
            <td>Contrato 1</td>
            <td>
              <button class="btn btn-sm btn-primary">Editar</button>
              <button class="btn btn-sm btn-danger">Eliminar</button>
            </td>
          </tr>
          <tr>
            <td>Cliente 2</td>
            <td>Contrato 2</td>
            <td>
              <button class="btn btn-sm btn-primary">Editar</button>
              <button class="btn btn-sm btn-danger">Eliminar</button>
            </td>
          </tr>
          <!-- Más filas de ejemplo -->
        </tbody>
      </table>
    </div>
  </div>
</div>
<script src="../js/datatables-simple-demo.js">
</script>
<?php require_once "../footer.php"; ?>