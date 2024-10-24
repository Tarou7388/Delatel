<?php require_once '../../header.php'; ?>
<?php $host = $_ENV['HOST']; ?>


<div class="container-fluid px-4">
  <h1 class="mt-4">Registro de Incidencia</h1>
  <div class="row mb-4 align-items-center">
    <div class="col text-start">
      <a href="<?= $host; ?>views/Soporte/">Inicio</a> /
    </div>
    <div class="col text-end">
      <div class="d-flex justify-content-end align-items-center">
        <a href="<?= $host; ?>views/Soporte/registroSoporte" class="btn btn-primary me-2">
          Registrar Soporte <i class="fa-solid fa-arrow-right"></i>
        </a>
        <input type="date" class="form-control text-center" id="txtFecha" placeholder="Fecha" disabled style="width: auto;">
      </div>
    </div>
  </div>


  <div class="card mb-4">
    <div class="card-header">
      <i class="fas fa-table me-1"></i> Complete los Datos del Soporte
    </div>


    <div class="card-body">
      <!-- Formulario de registro de incidencia -->
      <form id="formRegistroIncidencia" class="bg-light p-4 rounded shadow-sm">
        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <div class="input-group">
              <div class="form-floating flex-grow-1">
                <input type="text" class="form-control" maxlength="11" minlength="8" id="txtNrodocumento" placeholder="Número de Documento" required>
                <label for="txtNrodocumento">Número de Documento</label>
              </div>
              <button class="btn btn-outline-primary" type="button" id="btnNrodocumento">
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCliente" placeholder="Nombre del Cliente" required>
              <label for="txtCliente">Nombre del Cliente</label>
            </div>
          </div>
        </div>

        <div class="row g-3 mb-3">
          <div class="col">
            <div class="form-floating">
              <textarea class="form-control" id="txtDescripcion" rows="3" placeholder="Descripción de la incidencia" style="height: 100px" required></textarea>
              <label for="txtDescripcion">Descripción</label>
            </div>
          </div>
        </div>

        <div class="row g-3 mb-3">
          <div class="col">
            <div class="form-floating">
              <textarea class="form-control" id="txtSolucion" rows="3" placeholder="Solución aplicada" style="height: 100px" required></textarea>
              <label for="txtSolucion">Solución</label>
            </div>
          </div>
        </div>

        <div class="row g-3">
          <div class="col text-end">
            <button type="submit" class="btn btn-success px-5">
              <i class="fa-solid fa-check"></i> Registrar Incidencia
            </button>
          </div>
        </div>
      </form>
    </div>

    <?php require_once "../../footer.php"; ?>

    <script type="module" src="../../js/Incidencias.js"></script>
    </body>

    </html>