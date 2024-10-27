<?php require_once '../../header.php'; ?>

<!-- Modal Para Agregar -->
<div class="modal fade" id="modalAgregarPaquete" tabindex="-1" aria-labelledby="modalAgregarPaqueteLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Nuevo Paquete</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form action="" id="frmRegistrarPaquete">

          <div class="form-floating mb-2">
            <input type="text" class="form-control" id="txtPaquete" placeholder="Paquete" required>
            <label for="txtPaquete">Paquete</label>
          </div>

          <div class="form-floating mb-2">
            <input type="number" class="form-control" id="txtPrecio" placeholder="Precio" min="10" required>
            <label for="txtPrecio">Precio</label>
          </div>

          <div class="form-group">
            <div class="form-floating mb-2">
              <select class="form-select" name="TipoServicio" id="slcTipoServicio" required>
                <option value=""></option>
              </select>
              <label for="slcTipoServicio">Tipo de Servicio</label>
            </div>
          </div>

          <div class="row mb-2">
            <div class="col">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtDuracion1" name="duracion1" min=3 required>
                <label for="txtDuracion1" class="form-label">Duración (Meses)</label>
              </div>
            </div>
            <div class="col">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtDuracion2" name="duracion2" min=3 required>
                <label for="txtDuracion2" class="form-label">Duración (Meses)</label>
              </div>
            </div>
          </div>


        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="submit" id="btnRegistrar" class="btn btn-primary">Registrar</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Para Actualizar -->
<div class="modal fade" id="modalActualizarPaquete" tabindex="-1" aria-labelledby="modalActualizarPaqueteLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Actualizar Paquete</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form action="" id="frmRegistrarPaquete">
          <input type="hidden" id="txtIdPaquete" name="id_paquete">

          <div class="form-floating mb-2">
            <input type="text" class="form-control" id="txtPaqueteActualizar" name="paquete" placeholder="Paquete" required>
            <label for="txtPaqueteActualizar">Paquete</label>
          </div>

          <div class="form-floating mb-2">
            <input type="number" class="form-control" id="txtPrecioActualizar" name="precio" min="10" placeholder="Precio" required>
            <label for="txtPrecioActualizar">Precio</label>
          </div>

          <div class="form-group">
            <div class="form-floating mb-2">
              <select class="form-select" id="slcTipoServicioActualizar" name="tipo_servicio" required>
                <option value=""></option>
              </select>
              <label for="slcTipoServicioActualizar">Tipo de Servicio</label>
            </div>
          </div>

          <div class="row mb-2">
            <div class="col">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtDuracion1Actualizar" name="duracion1" min=3 required>
                <label for="txtDuracion1Actualizar" class="form-label">Duración (Meses)</label>
              </div>
            </div>
            <div class="col">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtDuracion2Actualizar" name="duracion2" min=3 required>
                <label for="txtDuracion2Actualizar" class="form-label">Duración (Meses)</label>
              </div>
            </div>
          </div>

        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="submit" id="btnActualizar" class="btn btn-primary">Actualizar</button>
      </div>
    </div>
  </div>
</div>

<!-- Tabla de Listar -->
<div class="container-fluid px-4">
  <h1 class="mt-4">Configuración de Paquetes y Servicios</h1>

  <div class="card mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
      <div>
        <i class="fas fa-table me-1"></i> Gestionar Paquetes
      </div>
      <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalAgregarPaquete">
        Nuevo Paquete
      </button>
    </div>

    <div class="card-body">
      <div class="table-responsive">
        <table id="tablaPaquetes" class="display">
          <thead>
            <tr>
              <th class="text-center">Paquete</th>
              <th class="text-center">Precio</th>
              <th class="text-center">Tipo de Servicio</th>
              <th class="text-center">Duración</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>

          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
<script type="module">
  const user = <?php echo json_encode($_SESSION['login']); ?>;
</script>
<?php require_once "../../footer.php"; ?>
<script type="module" src="../../js/paquetes.js"></script>
</body>

</html>