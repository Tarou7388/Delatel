<?php require_once '../../header.php'; ?>
<?php $host = $_ENV['HOST']; ?>

<link rel="stylesheet" href="../../css/diseñoGlobal.css" />

<div class="container-fluid px-4">
  <h2 class="mt-4">Registro de Incidencias</h2>

  <!-- Modal de Busqueda Avanzada -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Busqueda Avanzada</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="searchForm">
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="txtnombrebAvz" name="nombre" placeholder="Nombre">
              <label for="nombre">Nombre</label>
            </div>
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="txtapellidobAvz" name="apellido" placeholder="Apellido">
              <label for="apellido">Apellido</label>
            </div>
            <div class="container">
              <ul class="list-group mt-3" id="listMulticontratos">
                <!-- Aquí se cargarán las si hay más de uno que coincida -->
              </ul>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary" id="btnBusquedaAvanzada">Buscar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Breadcumbs -->
  <div class="row g-2 mb-2 align-items-center">
    <div class="col text-start">
      <a href="<?= $host; ?>views/Soporte/">Inicio</a> /
    </div>
    <div class="col text-end">
      <div class="d-flex flex-wrap justify-content-end align-items-center">
        <input type="date" class="form-control text-center" id="txtFecha" placeholder="Fecha" disabled style="max-width: 150px;">
      </div>
    </div>
  </div>

  <!-- Formulario de Registro de Incidencias -->
  <div class="card mb-4">
    <div class="card-header">
      <i class="fas fa-table me-1"></i> Complete los Datos de la Incidencia
    </div>
    <div class="card-body">
      <form id="form-Incidencia">
        <!-- Row for Documento, Cliente, Contrato, and Prioridad -->
        <div class="row g-2 mb-3">
          <!-- Número de Documento -->
          <div class="col-12 col-md-3">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" maxlength="12" minlength="8" id="txtNrodocumento" placeholder="Número de Documento" autofocus required>
                <label for="txtNrodocumento"> <span style="color: red;">*</span> Número Identificador</label>
              </div>
              <button class="input-group-text btn btn-primary" type="button" id="btnNrodocumento">
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
              <button class="input-group-text btn btn-outline-info" type="button" id="ModeloAbrir">
                <i class="fas fa-ellipsis-h"></i>
              </button>
            </div>
          </div>

          <!-- Cliente -->
          <div class="col-12 col-md-3">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCliente" placeholder="Cliente" disabled required>
              <label for="txtCliente"><span style="color: red;">*</span> Cliente</label>
            </div>
          </div>

          <!-- Contrato -->
          <div class="col-12 col-md-3">
            <div class="form-floating">
              <select id="slcContratos" class="form-select" required>
                <option value="" disabled selected>Seleccione un Contrato</option>
              </select>
              <label for="slcContratos">
                <span style="color: red;">*</span> Seleccione un Contrato
              </label>
            </div>
          </div>

          <!-- Prioridad -->
          <div class="col-12 col-md-3">
            <div class="form-floating">
              <select id="slcPrioridad" class="form-select" required>
                <option value="Incidencia">Incidencia</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
              <label for="slcPrioridad">
                <span style="color: red;">*</span> Prioridad
              </label>
            </div>
          </div>
        </div>

        <hr>

        <!-- Observaciones y Contrato -->
        <div class="row g-3 mb-3">
          <div class="col-12">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtContratoObservacion" placeholder="Contrato y Observacion" disabled required>
              <label for="txtContratoObservacion"> <span style="color: red;">*</span> Contrato y Observacion</label>
            </div>
          </div>
        </div>

        <!-- Descripción -->
        <div class="row g-3 mb-3">
          <div class="col-12">
            <div class="form-floating">
              <textarea class="form-control" id="txtDescripcion" rows="3" placeholder="Descripción de la incidencia" style="height: 100px" required aria-required="true"></textarea>
              <label for="txtDescripcion">
                <span style="color: red;">*</span> Descripción
              </label>
            </div>
          </div>
        </div>

        <!-- Solución -->
        <div class="row g-3 mb-3">
          <div class="col-12">
            <div class="form-floating">
              <textarea class="form-control" id="txtSolucion" rows="3" placeholder="Solución aplicada" style="height: 100px"></textarea>
              <label for="txtSolucion">Proceso</label>
            </div>
          </div>
        </div>

        <!-- Solucionado Switch (hidden) -->
        <div class="row g-3 mb-3" hidden>
          <div class="col-12">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="chkSolucionado">
              <label class="form-check-label" for="chkSolucionado">Solucionado</label>
            </div>
          </div>
        </div>

        <hr>

        <!-- Botones de Acción -->
        <div class="text-end">
          <button type="submit" class="btn btn-success">Registrar</button>
          <a href="<?= $host; ?>views/Soporte/listarSoporte" class="btn btn-primary">
            Listar Soporte <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </form>
    </div>
  </div>
</div>

<?php require_once "../../footer.php"; ?>

<script type="module" src="../../js/Soporte.js"></script>
</body>

</html>