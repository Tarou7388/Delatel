<?php require_once '../../header.php'; ?>

<!-- Modal Para Agregar -->
<div class="modal fade" id="modalAgregarPaquete" tabindex="-1" aria-labelledby="modalAgregarPaqueteLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Agregar Nuevo Paquete</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form action="" id="frmRegistrarPaquete">

          <div class="form-floating mb-2">
            <input type="text" class="form-control" id="txtPaquete" placeholder="Paquete" required>
            <label for="txtPaquete">Paquete</label>
          </div>

          <div class="form-floating mb-2">
            <input type="text" class="form-control" id="txtPrecio" placeholder="Precio" required>
            <label for="txtPrecio">Precio</label>
          </div>

          <div class="form-group">
            <div class="form-floating mb-2">
              <select class="form-select" name="TipoServicio" id="slcTipoServicio" required>
                <option value="" disabled selected>Seleccione un Servicio</option>
                <option value=""></option>
              </select>
              <label for="slcTipoServicio">Tipo de Servicio</label>
            </div>
          </div>

          <div class="form-floating mb-2">
            <input type="date" class="form-control" id="txtFechaInicio" name="fechaInicio" required>
            <label for="txtFechaInicio">Fecha de Inicio</label>
          </div>


          <div class="form-floating mb-2">
            <input type="number" class="form-control" id="txtFechaFin" name="fechaFin" max=24 min=3 required>
            <label for="txtFechaFinActualizar" class="form-label">Fecha de Fin (Meses)</label>
            <span id="mensajeFechaFin" class="invisible"></span>
          </div>


        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="submit" class="btn btn-primary">Registrar</button>
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

          <div class="form-floating mb-2">
            <input type="text" class="form-control" id="txtPaquete" placeholder="Paquete" required>
            <label for="txtPaquete">Paquete</label>
          </div>

          <div class="form-floating mb-2">
            <input type="text" class="form-control" id="txtPrecio" placeholder="Precio" required>
            <label for="txtPrecio">Precio</label>
          </div>

          <div class="form-group">
            <div class="form-floating mb-2">
              <select class="form-select" name="TipoServicio" id="slcTipoServicio" required>
                <option value="" disabled selected>Seleccione un Servicio</option>
                <option value=""></option>
              </select>
              <label for="slcTipoServicio">Tipo de Servicio</label>
            </div>
          </div>

          <div class="form-floating mb-2">
            <input type="date" class="form-control" id="txtFechaInicio" name="fechaInicio" required>
            <label for="txtFechaInicio">Fecha de Inicio</label>
          </div>


          <div class="form-floating mb-2">
            <input type="number" class="form-control" id="txtFechaFin" name="fechaFin" max=24 min=3 required>
            <label for="txtFechaFinActualizar" class="form-label">Fecha de Fin (Meses)</label>
            <span id="mensajeFechaFin" class="invisible"></span>
          </div>


        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="submit" class="btn btn-primary">Registrar</button>
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
              <th class="text-center">Fecha de Inicio</th>
              <th class="text-center">Fecha de Fin</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
            <tbody id="cargarDatos">
            <tr>
              <td class="text-center">Paquete de Prueba</td>
              <td class="text-center">$100</td>
              <td class="text-center">Servicio de Prueba</td>
              <td class="text-center">2023-01-01</td>
              <td class="text-center">2023-12-31</td>
            </tr>
            </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
<?php require_once "../../footer.php"; ?>
<script type="module" src="../../js/paquetes.js"></script>
</body>

</html>