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

          <label for="slcTipoServicio" class="form-label">Tipo de Servicio:</label>
          <div class="form-floating mb-2">
            <select class="js-example-basic-multiple form-select" name="states[]" id="slcTipoServicio" multiple="multiple" style="width: 100%;" required>
            </select>
          </div>

          <div id="serviciosContainer"></div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" id="btnCancelarRegistrar" data-bs-dismiss="modal">Cancelar</button>
        <button type="submit" id="btnRegistrar" class="btn btn-success">Registrar</button>
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
        <form action="" id="frmActualizarPaquete">
          <input type="hidden" id="txtIdPaquete" name="id_paquete">

          <div class="form-floating mb-2">
            <input type="text" class="form-control" id="txtPaqueteActualizar" name="paquete" placeholder="Paquete" required>
            <label for="txtPaqueteActualizar">Paquete</label>
          </div>

          <div class="form-floating mb-2">
            <input type="number" class="form-control" id="txtPrecioActualizar" name="precio" min="10" placeholder="Precio" required>
            <label for="txtPrecioActualizar">Precio</label>
          </div>

          <label for="slcTipoServicioActualizar" class="form-label">Tipo de Servicio</label>
          <div class="form-floating mb-2">
            <select class="js-example-basic-multiple form-select" name="states[]" id="slcTipoServicioActualizar" multiple="multiple" style="width: 100%;" required>
            </select>
          </div>

          <div id="serviciosContainerActualizar"></div>

        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="submit" id="btnActualizar" class="btn btn-success">Actualizar</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Para Servicios -->
<div class="modal fade" id="modalServicio" tabindex="-1" aria-labelledby="modalServicio" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Servicios</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="frmServicios" class="mb-4">
          <div class="mb-3 d-flex align-items-center">
            <input type="text" id="txtNombreServicio" class="form-control me-2" placeholder="Nombre del servicio" required>
            <input type="text" id="txtTipoServicio" class="form-control me-2 w-25" maxlength="4" placeholder="Tipo de servicio" required>
            <button type="button" id="btnRegistrarServicio" class="btn btn-success">Agregar</button>
          </div>
        </form>
        <table class="table">
          <thead>
            <tr>
              <th>Nombre del Servicio</th>
              <th>Tipo</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody id="listaServicios">

          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>


<!-- Tabla de Listar -->
<div class="container-fluid px-4">
  <h1 class="mt-4">Configuración de Paquetes y Servicios</h1>

  <div class="card mt-3">
    <div class="card-header d-flex justify-content-between align-items-center">
      <div>
        <i class="fas fa-table me-1"></i> Gestionar Paquetes
      </div>
      <div>
        <button type="button" class="btn btn-primary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#modalAgregarPaquete">
          Nuevo Paquete
        </button>
        <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalServicio">
          Servicio
        </button>
      </div>
    </div>

    <div class="card-body">
      <div class="table-responsive">
        <table id="tablaPaquetes" class="display">
          <thead>
            <tr>
              <th class="text-center">Paquete</th>
              <th class="text-center">Precio</th>
              <th class="text-center">Tipo de Servicio</th>
              <th class="text-center">Servicios</th>
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
<script type="module" src="../../js/servicios.js"></script>
</body>

</html>