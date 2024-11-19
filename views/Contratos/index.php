<?php require_once '../../header.php'; ?>

<div class="modal fade" id="ModalMapa" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="myModalLabel">Mapa de Cobertura</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="input-group mb-3">
        <input type="text" id="CoordenadaModel" class="form-control" placeholder="Coordenada" aria-label="Coordenada">
        <button class="btn btn-outline-secondary" type="button" id="buscarBtn">Buscar</button>
      </div>
      <div class="modal-body">
        <div id="map" style="height: 700px;">

        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" id="btnGuardarModalMapa" data-dismiss="modal" disabled>Guardar cambios</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal de Actualización de Contrato -->
<div class="modal fade" id="modalEditarContrato" tabindex="-1" aria-labelledby="modalEditarContratoLabel" aria-hidden="true" data-bs-backdrop="static">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h6 class="modal-title" id="modalEditarContratoLabel">Editar Contrato</h6>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="form-editar-contrato">
          <input type="hidden" id="txtIdContratoActualizar" name="id_contrato">

          <div class="row mb-2">

            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtNombreActualizar" name="nombre" placeholder="Nombre de Cliente" disabled>
                <label for="txtNombreActualizar" class="form-label">Nombre de Cliente</label>
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtFechaInicioActualizar" name="Fecha" placeholder="Fecha de Inicio de Contrato" disabled>
                <label for="txtFechaInicioActualizar" class="form-label">Fecha de Inicio de Contrato</label>
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtMesesActualizar" placeholder="Meses" name="Meses">
                <label for="txtMesesActualizar" class="form-label">Fecha Fin (meses)</label>
                <span id="txtFechaFinActualizar" name="Fecha Fin"></span>
              </div>
            </div>


          </div>

          <div class="row mb-2">

            <div class="col-md-3">
              <div class="form-floating">
                <select id="slcTipoServicioActualizar" class="form-select" aria-label="Tipo Servicio" disabled>
                  <option value="0" disabled selected>Seleccione</option>
                </select>
                <label for="slcTipoServicioActualizar" class="form-label">Servicio</label>
              </div>
            </div>

            <div class="col-md-3">
              <div class="form-floating">
                <select class="form-select select2me" id="slcPaquetesActualizar" aria-label="Paquetes">
                  <option value="0" disabled selected>Seleccione</option>
                </select>
                <label for="slcPaquetesActualizar" class="form-label">Paquetes</label>
              </div>
            </div>

            <div class="col-md-3">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtPrecioActualizar" value="0" placeholder="Precio" disabled>
                <label for="txtPrecioActualizar" class="form-label">Precio</label>
              </div>
            </div>

            <div class="col-md-3">
              <div class="form-floating">
                <select class="form-select select2me" id="slcSectorActualizar" aria-label="Sectores" disabled>
                  <option value="0" disabled selected>Sectores</option>
                </select>
                <label for="slcSectorActualizar" class="form-label">Sectores</label>
              </div>
            </div>

          </div>

          <div class="row mb-2">

            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtDireccionActualizar" placeholder="Dirección de Servicio">
                <label for="txtDireccionActualizar" class="form-label">Dirección de Servicio</label>
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtReferenciaActualizar" placeholder="Referencia" name="referencia">
                <label for="txtReferenciaActualizar" class="form-label">Referencia</label>
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCoordenadaActualizar" placeholder="Coordenada" name="coordenada" disabled>
                <label for="txtCoordenadaActualizar" class="form-label">Coordenada</label>
              </div>
            </div>

          </div>

          <div class="row mb-2">
            <div class="col-md-12">
              <div class="form-floating">
                <textarea class="form-control" id="txtNotaActualizar" placeholder="Nota" name="nota"></textarea>
                <label for="txtNotaActualizar" class="form-label">Nota</label>
              </div>
            </div>
          </div>

          <div class="text-end mt-2">
            <button type="submit" class="btn btn-success" id="btnActualizar">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="container-fluid px-4">
  <h1 class="mt-4">Contratos</h1>

  <div class="card mb-4">
    <div class="card-header">
      <i class="fas fa-table me-1"></i> Complete los Datos
    </div>
    <div class="card-body">
      <form action="" class="formularioRegistrarContrato">
        <div class="row">

          <span class="text-end invisible" id="infoFecha">a</span>

          <div class="col-md-3">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtNumDoc" name="documento" placeholder="Número de Documento" required>
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
              <select class="form-select" id="slcTipoServicio" aria-label="Servicios">
                <option value="0" disabled selected>Seleccione</option>
              </select>
              <label for="slcServicios">Servicios</label>
            </div>
          </div>

          <div class="col-md-3">
            <div class="form-floating">
              <select class="form-select select2me" id="slcPaquetes" aria-label=Servicios>
                <option value="0" disabled selected>Seleccione</option>
              </select>
              <label for="slcPaquetes" class="form-label">Paquetes</label>
            </div>
          </div>

        </div>

        <div class="row mt-2">

          <div class="col-md-4">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtPrecio" value="0" placeholder="Precio" disabled>
              <label for="txtPrecio" class="form-label">Precio</label>
            </div>
          </div>

          <div class="col-md-4">
            <div class="form-floating">
              <select class="form-select select2me" id="slcSector" aria-label=Sectores>
                <option value="0" disabled selected>Seleccione</option>
              </select>
              <label for="slcSector" class="form-label">Sectores</label>
            </div>
          </div>

          <div class="col-md-4">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtDireccion" placeholder="Dirección de Servicio">
              <label for="txtDireccion" class="form-label">Dirección de Servicio</label>
            </div>
          </div>

        </div>

        <div class="row mt-2">

          <div class="col-md-4">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtReferencia" placeholder="Referencia" name="referencia">
              <label for="referencia" class="form-label">Referencia</label>
            </div>
          </div>

          <div class="col-md-4">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCoordenadasMapa" placeholder="Referencia" required disabled>
                <label for="txtCoordenadasMapa">Coordenadas</label>
              </div>
              <button class="btn btn-primary" type="button" id="btnBuscarCoordenadas" data-bs-toggle="modal" data-bs-target="#ModalMapa">
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>

          <div class="col-md-4">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtMeses" placeholder="Meses" name="Meses">
              <label for="txtMeses" class="form-label">Fecha Fin (meses)</label>
              <span id="txtFechaFin" name="Fecha Fin"></span>
            </div>
          </div>

        </div>

        <div class="row mt-2">

          <div class="col-md-12">
            <div class="form-floating">
              <textarea class="form-control" id="txtNota" placeholder="Observaciones" name="observacion"></textarea>
              <label for="txtObservacion" class="form-label">Observaciones</label>
            </div>
          </div>

        </div>


        <div class="col-12 text-center text-md-end mb-3 mt-3">
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
      <div class="table-responsive">
        <table id="listarContratos" class="table table-striped">
          <thead>
            <tr>
              <th class="text-center">Cliente</th>
              <th class="text-center">Número de Doc</th>
              <th class="text-center">Paquete</th>
              <th class="text-center">Precio</th>
              <th class="text-center">Servicio</th>
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
<script type="module" src="../../js/contratos.js"></script>