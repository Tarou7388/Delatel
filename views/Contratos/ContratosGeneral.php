<?php require_once '../../header.php'; ?>
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
            <label for="txtDni" class="form-label">Número de documento</label>
            <div class="input-group">
              <input type="text" class="form-control" id="txtDni" name="documento" required>
              <button class="btn btn-outline-primary" type="button"><img src="../../image/lupaHTML.png"></button>
            </div>
          </div>
          <div class="col-md-3">
            <label for="txtNombre" class="form-label">Nombre de cliente</label>
            <input type="text" class="form-control" id="txtNombre" name="nombre" value="JESUS, MATTA RAMOS" required disabled>
          </div>
          <div class="col-md-3">
            <label for="txtFechaInicio" class="form-label">Fecha de inicio</label>
            <input type="date" class="form-control" id="txtFechaInicio" name="fechaInicio" required>
          </div>
          <div class="col-md-3">
            <label for="txtFechaFin" class="form-label">Fecha de fin</label>
            <input type="date" class="form-control" id="txtFechaFin" name="fechaFin" required>
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-md-3">
            <label for="slcServicio" class="form-label">Servicio</label>
            <select class="form-select" id="slcServicio">
              <option value="0" disabled selected>Selecione</option>
            </select>
          </div>
          <div class="col-md-3">
            <label for="txtPrecio" class="form-label">Precio</label>
            <input type="number" class="form-control" id="txtPrecio" value="2.5" disabled>
          </div>
          <div class="col-md-3">
            <label for="txtDireccion" class="form-label">Dirección de Servicio</label>
            <input type="text" class="form-control" id="txtDireccion">
          </div>
          <div class="col-md-3">
            <label for="slcSector" class="form-label">Sector</label>
            <select class="form-select" id="slcSector">
              <option value="0" disabled selected>Selecione</option>
            </select>
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-md-3">
            <label for="referencia" class="form-label">Referencia</label>
            <input type="text" class="form-control" id="txtReferencia" name="referencia">
          </div>
          <div class="col-md-3">
            <label for="coordenada" class="form-label">Coordenada</label>
            <input type="text" class="form-control" id="txtCoordenada" name="coordenada">
          </div>
        </div>
        <div class="row">
          <div class="col-md-3 mt-3">
            <button class="btn btn-primary" id="btnRegistrar">Registrar</button>
            <button class="btn btn-secondary" type="reset">Cancelar</button>
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
            <th>Numero de Doc</th>
            <th>Servicio</th>
            <th>Direccion</th>
            <th>Fecha de inicio</th>
            <th>Fecha de fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  </div>
</div>
<script type="module">
  const permisos = <?php echo json_encode($permisos); ?>;
  const user = <?php echo json_encode($_SESSION['login']); ?>
</script>
<script type="module" src="../../js/contratos.js"></script>
<?php require_once "../../footer.php"; ?>