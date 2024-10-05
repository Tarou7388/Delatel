<?php require_once '../../header.php'; ?>

<div class="container-fluid px-4">
  <h1 class="mt-4">Contratos</h1>

  <div class="card mb-4">
    <div class="card-header">
      <i class="fas fa-table me-1"></i> Complete los Datos
    </div>
    <div class="card-body">
      <form action="" class="formularioRegistrarContrato">
        <div class="row">

          <div class="col-md-3">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtDni" name="documento" placeholder="Número de Documento" required>
                <label for="txtDni" class="form-label">Número de Documento</label>
              </div>
              <button class="btn btn-primary" id="btnBuscar" type="button"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
          </div>

          <div class="col-md-3">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtNombre" name="nombre" placeholder="Nombre de Cliente" required disabled>
              <label for="txtNombre" class="form-label">Nombre de Cliente</label>
            </div>
          </div>

          <div class="col-md-3">
            <div class="form-floating">
              <input type="date" class="form-control" id="txtFechaInicio" name="fechaInicio" required>
              <label for="txtFechaInicio" class="form-label">Fecha de inicio</label>
            </div>
          </div>

          <div class="col-md-3">
            <div class="form-floating">
              <input type="date" class="form-control" id="txtFechaFin" name="fechaFin" required>
              <label for="txtFechaFin" class="form-label">Fecha de fin</label>
            </div>
          </div>

        </div>
        <div class="row mt-2">

          <div class="col-md-3 mt-2">
            <select class="form-select select2" id="slcServicio">
              <option value="0" disabled selected>Servicios</option>
            </select>
          </div>


          <div class="col-md-3">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtPrecio" value="0" placeholder="Precio" disabled>
              <label for="txtPrecio" class="form-label">Precio</label>
            </div>
          </div>

          <div class="col-md-3">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtDireccion" placeholder="Dirección de Servicio">
              <label for="txtDireccion" class="form-label">Dirección de Servicio</label>
            </div>
          </div>

          <div class="col-md-3 mt-2">
            <select class="form-select" id="slcSector">
              <option value="0" disabled selected>Sectores</option>
            </select>
          </div>

        </div>
        <div class="row mt-2">

          <div class="col-md-3">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtReferencia" placeholder="Referencia" name="referencia">
              <label for="referencia" class="form-label">Referencia</label>
            </div>
          </div>

          <div class="col-md-3">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCoordenada" placeholder="Coordenada" name="coordenada">
              <label for="coordenada" class="form-label">Coordenada</label>
            </div>
          </div>

        </div>


        <div class="col-12 text-center text-md-end mb-3">
          <button class="btn btn-success" id="btnRegistrar">Registrar</button>
          <button class="btn btn-secondary" type="reset">Cancelar</button>
        </div>

      </form>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      <i class="fas fa-table me-1"></i> Listado de Contratos
    </div>
    <div class="card-body">
      <table id="listarContratos" class="table table-striped">
        <thead>
          <tr>
            <th class="text-center">Cliente</th>
            <th class="text-center">Número de Doc</th>
            <th class="text-center">Servicio</th>
            <th class="text-center">Dirección</th>
            <th class="text-center">Fecha de Inicio</th>
            <th class="text-center">Fecha de Fin</th>
            <th class="text-center">Acciones</th>
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
<?php require_once "../../footer.php"; ?>
<script type="module" src="../../js/contratos.js"></script>