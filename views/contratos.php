<?php require_once '../header.php'; ?>
<div class="container">
  <div class="card mt-3">
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
            <input type="date" class="form-control" id="fecha-inicio" name="fecha-inicio" required>
          </div>
          <div class="col-md-3">
            <label for="fecha-fin" class="form-label">Fecha de fin</label>
            <input type="date" class="form-control" id="fecha-fin" name="fecha-fin" required>
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-md-3">
            <label for="servicio" class="form-label">Servicio</label>
            <select class="form-select" id="">
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
            <select name="" class="form-select" id=""></select>
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
      <table id="listarContratos">
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Row 1 Data 1</td>
            <td>Row 1 Data 2</td>
          </tr>
          <tr>
            <td>Row 2 Data 1</td>
            <td>Row 2 Data 2</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
<?php require_once "../footer.php"; ?>