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
          <i class="fas fa-table me-1"></i>
          Registro de datos
        </div>

        <div class="card-body" id="contenido">
          <div id="map" style="height: 700px;"></div>
        </div>
      </div>
    </div>

    <div class="col-md-2">
      <div class="card mt-3">
        <div class="card-header">
          <i class="fas fa-list me-1"></i>
          Opciones de visualización
        </div>

        <div class="card-body">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="chkSectores" checked>
            <label class="form-check-label" for="chkSectores">
              Sectores
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="chkMufas" checked>
            <label class="form-check-label" for="chkMufas">
              Mufas
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="chkCajas" checked>
            <label class="form-check-label" for="chkCajas">
              Cajas
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="chkCables" checked>
            <label class="form-check-label" for="chkCables">
              Cables
            </label>
          </div>
          <button class="btn btn-primary mt-3 w-100" id="btnActualizar">Actualizar</button>
        </div>
      </div>
      <div class="card mt-3">
        <div class="card-header">
          <i class="fas fa-plus me-1"></i>
          Agregar Nueva Entrada
        </div>
        <div class="card-body">
          <button class="btn btn-success w-100 mb-2" data-bs-toggle="modal" id="modalAgregarCaja" data-bs-target="#modalAgregar" disabled>Nueva Caja</button>
          <button class="btn btn-success w-100" data-bs-toggle="modal" id="modalAgregarMufa" data-bs-target="#modalAgregarMufa2" disabled>Nueva Mufa</button>
        </div>
      </div>
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
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="nombreCaja" name="nombre" placeholder="Nombre" required>
            <label for="nombre">Nombre</label>
          </div>
          <div class="form-floating mb-3">
            <textarea class="form-control" id="descripcionCaja" name="descripcion" placeholder="Descripción" rows="3" required></textarea>
            <label for="descripcion">Descripción</label>
          </div>
          <div class="form-floating mb-3">
            <select class="form-select" id="numEntradasCaja" name="numEntradas" required>
              <option value="8">8</option>
              <option value="16">16</option>
            </select>
            <label for="numEntradas">Número de Entradas</label>
          </div>
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="direccionCaja" name="direccion" placeholder="Dirección" required>
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