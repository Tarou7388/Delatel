<?php require_once "../../header.php"; ?>
<?php $host = $_ENV['HOST']; ?>

<div class="container-fluid px-4">
  <h1 class="mt-4">Actividades</h1>
  <ol class="breadcrumb mb-4">
    <li class="breadcrumb-item active">Gestion de mapa</li>
  </ol>
  <div class="row">
    <div class="col-md-10">
      <div class="card mt-3">
        <div class="card-header">
          <i class="fas fa-table me-1"></i> Registro de datos
        </div>
        <div class="card-body" id="contenido">
          <div id="map" style="height: 700px;"></div>
        </div>
      </div>
    </div>
    <div class="col-md-2">
  <div class="card mb-3">
    <div class="card-header">Opciones</div>
    <div class="card-body">
      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" id="chkSectores" checked>
        <label class="form-check-label" for="chkSectores">Sectores</label>
      </div>
      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" id="chkMufas" checked>
        <label class="form-check-label" for="chkMufas">Mufas</label>
      </div>
      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" id="chkCajas" checked>
        <label class="form-check-label" for="chkCajas">Cajas</label>
      </div>
      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" id="chkCables" checked>
        <label class="form-check-label" for="chkCables">Cables</label>
      </div>
      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" id="chkAntenas" checked>
        <label class="form-check-label" for="chkAntenas">Antenas</label>
      </div>
      <button class="btn btn-primary w-100" id="btnActualizar">Actualizar</button>
    </div>
  </div>

  <div class="card mb-3">
    <div class="card-header">Agregar</div>
    <div class="card-body">
      <button class="btn btn-success w-100 mb-2" id="btnActualizarPrincipal" disabled>Principal</button>
      <button class="btn btn-success w-100 mb-2" id="modalAgregarCaja" data-bs-toggle="modal" data-bs-target="#modalAgregar" disabled>Caja</button>
      <button class="btn btn-success w-100 mb-2" id="modalAgregarMufa" data-bs-toggle="modal" data-bs-target="#modalAgregarMufa2" disabled>Mufa</button>
      <button class="btn btn-success w-100 mb-2" id="modalAgregarSector" data-bs-toggle="modal" data-bs-target="#modalAgregarSector2" disabled>Sector</button>
      <button class="btn btn-success w-100 mb-2" id="modalAgregarAntena" data-bs-toggle="modal" data-bs-target="#modalAgregarAntena2" disabled>Antena</button>
    </div>
  </div>

  <div class="card mb-3">
    <div class="card-header">Eliminar</div>
    <div class="card-body">
      <button class="btn btn-danger w-100 mb-2" id="btnEliminarCaja" disabled>Caja</button>
      <button class="btn btn-danger w-100 mb-2" id="btnEliminarMufa" disabled>Mufa</button>
      <button class="btn btn-danger w-100 mb-2" id="btnEliminarSector" disabled>Sector</button>
      <button class="btn btn-danger w-100 mb-2" id="btnEliminarAntena" disabled>Antena</button>
    </div>
  </div>
</div>

<?php require_once "../../footer.php"; ?>
<script type="module" src="<?= $host ?>js/MapaGestion.js"></script>
</body>

</html>
<!-- Modal -->
<div class="modal fade" id="modalAgregar" tabindex="-1" aria-labelledby="modalAgregarLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalAgregarLabel">Agregar Nueva Caja</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formAgregarCaja">
          <div class="mb-3">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="nombreCaja" name="nombre" placeholder="Nombre" required>
                <label for="nombreCaja">Nombre</label>
              </div>
              <span class="input-group-text" id="codigoNombre">-08</span>
            </div>
          </div>
          <div class="form-floating mb-3">
            <textarea class="form-control" id="descripcionCaja" name="descripcion" placeholder="Descripción" rows="3" required></textarea>
            <label for="descripcionCaja">Descripción</label>
          </div>
          <div class="form-floating mb-3">
            <select class="form-select" id="numEntradasCaja" name="numEntradas" required>
              <option value="8">8</option>
              <option value="16">16</option>
            </select>
            <label for="numEntradasCaja">Número de Entradas</label>
          </div>
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="direccionCaja" name="direccion" placeholder="Dirección" required>
            <label for="direccionCaja">Dirección</label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="modalAgregarMufa2" tabindex="-1" aria-labelledby="modalAgregarMufaLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalAgregarMufaLabel">Agregar Nueva Mufa</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="formAgregarMufa">
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="nombreMufa" name="nombre" placeholder="Nombre" required>
            <label for="nombre">Nombre</label>
          </div>
          <div class="form-floating mb-3">
            <textarea class="form-control" id="descripcionMufa" name="descripcion" placeholder="Descripción" rows="3" required></textarea>
            <label for="descripcion">Descripción</label>
          </div>
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="direccionMufa" name="direccion" placeholder="Dirección" required>
            <label for="direccion">Dirección</label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="modalAgregarSector2" tabindex="-1" aria-labelledby="modalAgregarSectorLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalAgregarSectorLabel">Agregar Nuevo Sector</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="formAgregarSector">
        <form id="formAgregarSector">
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="nombreSector" name="nombre" placeholder="Nombre" required>
            <label for="nombre">Nombre</label>
          </div>
          <div class="form-floating mb-3">
            <textarea class="form-control" id="descripcionSector" name="descripcion" placeholder="Descripción" rows="3" required></textarea>
            <label for="descripcion">Descripción</label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="modalAgregarAntena2" tabindex="-1" aria-labelledby="modalAgregarAntenaLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalAgregarAntenaLabel">Agregar Nueva Antena</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="formAgregarAntena">
        <form id="formAgregarAntena">
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="nombreAntena" name="nombre" placeholder="Nombre" required>
            <label for="nombre">Nombre</label>
          </div>
          <div class="form-floating mb-3">
            <textarea class="form-control" id="descripcionAntena" name="descripcion" placeholder="Descripción" rows="3" required></textarea>
            <label for="descripcion">Descripción</label>
          </div>
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="direccionAntena" name="direccion" placeholder="Dirección" required>
            <label for="direccion">Dirección</label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>