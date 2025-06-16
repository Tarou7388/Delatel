<?php require_once '../../header.php'; ?>
<link rel="stylesheet" href="../../css/contratos.css">
<link rel="stylesheet" href="../../css/diseñoGlobal.css" />

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

          <div class="col-12 col-md-4 mb-2 mt-2">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtNumDoc" name="documento" placeholder="Número de Documento" required>
                <label for="txtDni" class="form-label">Número de Documento</label>
              </div>
              <button class="btn btn-primary" id="btnBuscar" type="button"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
          </div>

          <div class="col-12 col-md-4 mb-2 mt-2">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtNombre" name="nombre" placeholder="Nombre de Cliente" required disabled>
              <label for="txtNombre" class="form-label">Nombre de Cliente</label>
            </div>
          </div>

          <div class="col-12 col-md-4 mb-2 mt-2">
            <div class="form-floating">
              <select class="form-select" id="slcTipoServicio" aria-label="Servicios">
                <option value="0" disabled selected>Seleccione</option>
              </select>
              <label for="slcServicios">Servicios</label>
            </div>
          </div>

        </div>

        <div class="row">

          <div class="col-12 col-md-4 mb-2 mt-2">
            <div class="form-floating">
              <select class="form-select select2me" id="slcPaquetes" aria-label=Servicios>
                <option value="0" disabled selected>Seleccione</option>
              </select>
              <label for="slcPaquetes" class="form-label">Paquetes</label>
            </div>
          </div>

          <div class="col-12 col-md-4 mb-2 mt-2">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtPrecio" value="0" placeholder="Precio" disabled>
              <label for="txtPrecio" class="form-label">Precio</label>
            </div>
          </div>

          <div class="col-12 col-md-4 mb-2 mt-2">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtCoordenadasMapa" placeholder="Referencia" required disabled>
                <label for="txtCoordenadasMapa">Coordenadas</label>
              </div>
              <button class="btn btn-primary" type="button" id="btnBuscarCoordenadas" data-bs-toggle="modal" data-bs-target="#ModalMapa" disabled>
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>

        </div>

        <div class="row">

          <div class="col-12 col-md-4 mb-2 mt-2">
            <div class="form-floating" id="divSector">
              <select class="form-select select2me" id="slcSector" aria-label=Sectores disabled required>
                <option value="0" disabled selected>Seleccione</option>
              </select>
              <label for="slcSector" class="form-label">Sector - Caja</label>
            </div>
          </div>

          <div class="col-12 col-md-4 mb-2 mt-2">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtDireccion" placeholder="Dirección de Servicio">
              <label for="txtDireccion" class="form-label">Dirección de Servicio</label>
            </div>
          </div>

          <div class="col-12 col-md-4 mb-2 mt-2">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtReferencia" placeholder="Referencia" name="referencia">
              <label for="referencia" class="form-label">Referencia</label>
            </div>
          </div>

        </div>

        <div class="row">

          <div class="col-md-12 mt-2">
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
        <table id="listarContratos" class="table table-striped table-responsive-sm">
          <thead>
            <tr>
              <th class="text-center d-none d-sm-table-cell">ID</th>
              <th class="text-center">Cliente</th>
              <th class="text-center d-none d-sm-table-cell">Número de Doc</th>
              <th class="text-center d-none d-sm-table-cell">Paquete</th>
              <th class="text-center d-none d-sm-table-cell">Precio</th>
              <th class="text-center">Servicio</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <!-- Contenido generado por JS -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>


<!-- Modal Información del Contrato -->
<div class="modal fade" id="ModalContrato" tabindex="-1" aria-labelledby="myModalLabel" data-bs-backdrop="static">
  <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="myModalLabel">Información del Contrato</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
            <div class="col-12 col-md-7 mb-3 mb-md-0" id="mdlftLogs">
            <!-- Contenido de la sección izquierda -->
            </div>
            <div class="col-12 col-md-5" id="mdrgtLogs">
            <!-- Contenido de la sección derecha -->
            </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="ModalMapa" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-bs-backdrop="static">
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="myModalLabel">Mapa de Cobertura</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span>&times;</span>
        </button>
      </div>
      <div class="input-group mb-3" id="inputGroupCoordenada">
        <input type="text" id="CoordenadaModel" class="form-control" placeholder="Coordenada" aria-label="Coordenada">
        <button class="btn btn-outline-secondary" type="button" id="buscarCoordenada">Buscar</button>
      </div>
      <div class="modal-body">
        <div id="map" style="height: 600px;">

        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" id="btnGuardarModalMapa" data-bs-dismiss="modal" disabled>Guardar cambios</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal de Actualización de Contrato -->
<div class="modal fade" id="modalEditarContrato" tabindex="-1" aria-labelledby="modalEditarContratoLabel" data-bs-backdrop="static">
  <div class="modal-dialog modal-xl" style="max-width: 1200px;">
    <div class="modal-content">
      <div class="modal-header">
        <h6 class="modal-title" id="modalEditarContratoLabel">Editar Contrato</h6>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row g-3">
          <!-- Formulario a la izquierda -->
          <div class="col-12 col-lg-7">
            <form id="form-editar-contrato">
              <input type="hidden" id="txtIdContratoActualizar" name="id_contrato">

              <div class="row mb-2">
                <div class="col-12 col-md-6">
                  <div class="form-floating mb-2">
                    <input type="text" class="form-control" id="txtNombreActualizar" name="nombre" placeholder="Nombre de Cliente" disabled>
                    <label for="txtNombreActualizar" class="form-label">Nombre de Cliente</label>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-floating mb-2">
                    <input type="date" class="form-control" id="txtFechaInicioActualizar" name="Fecha" placeholder="Fecha de Inicio de Contrato">
                    <label for="txtFechaInicioActualizar" class="form-label">Fecha de Inicio de Contrato</label>
                  </div>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-12 col-md-6">
                  <div class="form-floating mb-2">
                    <select class="form-select" id="slcTipoServicioActualizar" aria-label="Servicios" data-placeholder="Seleccione una opción" disabled>
                      <option value="" disabled selected>Seleccione</option>
                      <option value="1">CABL (Cable)</option>
                      <option value="2">WISP (Wireless Internet Service Provider)</option>
                      <option value="3">FIBR (Fibra Óptica)</option>
                      <option value="duos">FIBRA + CABLE (GPON)</option>
                    </select>
                    <label for="slcTipoServicioActualizar" class="form-label">Servicio</label>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-floating mb-2">
                    <select class="form-select select2me" id="slcPaquetesActualizar" aria-label="Paquetes">
                      <option value="0" disabled selected>Seleccione</option>
                    </select>
                    <label for="slcPaquetesActualizar" class="form-label">Paquetes</label>
                  </div>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-12 col-md-6">
                  <div class="form-floating mb-2">
                    <input type="number" class="form-control" id="txtPrecioActualizar" value="0" placeholder="Precio" disabled>
                    <label for="txtPrecioActualizar" class="form-label">Precio</label>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="input-group mb-2">
                    <div class="form-floating flex-grow-1">
                      <input type="text" id="txtCoordenadaActualizar" class="form-control" placeholder="Coordenada" aria-label="Coordenada">
                      <label for="txtCoordenadaActualizar">Coordenada</label>
                    </div>
                    <button class="btn btn-outline-secondary ms-2" type="button" id="buscarCoordenadaActualizar">Buscar</button>
                  </div>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-12 col-md-6">
                  <div class="form-floating mb-2">
                    <select class="form-select select2me" id="slcSectorActualizar" aria-label="Sectores">
                      <option value="0" disabled selected>Sectores</option>
                    </select>
                    <label for="slcSectorActualizar" class="form-label">Sectores</label>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-floating mb-2">
                    <input type="text" class="form-control" id="txtDireccionActualizar" placeholder="Dirección de Servicio">
                    <label for="txtDireccionActualizar" class="form-label">Dirección de Servicio</label>
                  </div>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-12 col-md-6">
                  <div class="form-floating mb-2">
                    <input type="text" class="form-control" id="txtReferenciaActualizar" placeholder="Referencia" name="referencia">
                    <label for="txtReferenciaActualizar" class="form-label">Referencia</label>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-floating mb-2">
                    <textarea class="form-control" id="txtNotaActualizar" placeholder="Nota" name="nota" style="height: 58px;"></textarea>
                    <label for="txtNotaActualizar" class="form-label">Nota</label>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-end mt-3">
                <button type="button" class="btn btn-success" id="btnActualizar">Guardar Cambios</button>
              </div>
            </form>
          </div>
          <!-- Mapa a la derecha -->
          <div class="col-12 col-lg-5 d-flex align-items-start justify-content-center">
            <div class="w-100">
              <div id="mapActualizar" style="height: 480px; min-height: 300px; border-radius: 8px; border: 1px solid #ddd; width: 100%;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<script type="module">
  const user = <?php echo json_encode($_SESSION['login']); ?>;
</script>
<?php require_once "../../footer.php"; ?>
<script type="module" src="../../js/contratos.js"></script>