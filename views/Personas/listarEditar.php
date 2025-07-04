<?php require_once '../../header.php'; ?>

<link rel="stylesheet" href="../../css/diseñoGlobal.css">

<div class="modal fade" id="modalEditarPersona" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-bs-backdrop="static">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="myModalLabel">Actualizar Datos de Cliente</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span>&times;</span>
        </button>
      </div>

      <form id="FormActualizarPersona">
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-md-6">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <div class="mb-2">
                      <label for="txtNombresActualizar" class="form-label">Nombres</label>
                      <input type="text" class="form-control" id="txtNombresActualizar" required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-2">
                      <label for="txtApellidosActualizar" class="form-label">Apellidos</label>
                      <input type="text" class="form-control" id="txtApellidosActualizar" required>
                    </div>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <div class="mb-2">
                      <label for="txtDireccionActualizar" class="form-label">Dirección</label>
                      <input type="text" class="form-control" id="txtDireccionActualizar" required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-2">
                      <label for="txtReferenciaActualizar" class="form-label">Referencia</label>
                      <input type="text" class="form-control" id="txtReferenciaActualizar">
                    </div>
                  </div>
                </div>

                <div class="mb-2">
                  <label for="CoordenadaModel" class="form-label">Coordenadas</label>
                  <div class="input-group">
                    <input type="text" id="CoordenadaModel" class="form-control" placeholder="Coordenada" required>
                    <button class="btn btn-outline-secondary" type="button" id="buscarCoordenada">Buscar</button>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <div class="mb-2">
                      <label for="txtTelefono" class="form-label">Teléfono</label>
                      <div class="input-group">
                        <span class="input-group-text">+51</span>
                        <input type="tel" id="txtTelefono" class="form-control" placeholder="Número de teléfono" required>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-2">
                  <label for="txtCorreoElectronico" class="form-label">Correo Electrónico</label>
                  <input type="email" class="form-control" id="txtCorreoElectronico" placeholder="a@a.com">
                </div>
              </div>

              <div class="col-md-6">
                <div id="map" style="height: 450px; width: 100%;"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="submit" class="btn btn-primary" id="btnGuardarModalCliente">Guardar cambios</button>
        </div>
      </form>
    </div>
  </div>
</div>

<div class="modal fade" id="modalEditarEmpresa" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-bs-backdrop="static">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="myModalLabel">Actualizar Datos de Empresa</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span>&times;</span>
        </button>
      </div>

      <form id="FormActualizarEmpresa">
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-md-6">

                <div class="mb-2">
                  <label for="txtRUC" class="form-label">RUC</label>
                  <input type="text" class="form-control" id="txtRUC" required disabled>
                </div>

                <div class="mb-2">
                  <label for="txtRazonSocial" class="form-label">Razón Social</label>
                  <input type="text" class="form-control" id="txtRazonSocial" required>
                </div>

                <div class="mb-2">
                  <label for="txtNombreComercial" class="form-label">Nombre Comercial</label>
                  <input type="text" class="form-control" id="txtNombreComercial" required>
                </div>

                <div class="mb-2">
                  <label for="txtTelefono" class="form-label">Teléfono</label>
                  <div class="input-group">
                    <span class="input-group-text">+51</span>
                    <input type="tel" class="form-control" id="txtTelefono" placeholder="Número de teléfono" required>
                  </div>
                </div>

                <div class="mb-2">
                  <label for="txtEmail" class="form-label">Correo Electrónico</label>
                  <input type="email" class="form-control" id="txtEmail" placeholder="a@a.com">
                </div>

                <div class="mb-2">
                  <label for="txtCoordenadas" class="form-label">Coordenadas</label>
                  <div class="input-group">
                    <input type="text" id="txtCoordenadas" class="form-control" placeholder="Coordenada" required>
                    <button class="btn btn-outline-secondary" type="button" id="buscarCoordenadaEmpresa">Buscar</button>
                  </div>
                </div>

                <div class="mb-2">
                  <label for="txtDireccionContacto" class="form-label">Dirección de Contacto</label>
                  <input type="text" class="form-control" id="txtDireccionContacto" required>
                </div>

              </div>

              <div class="col-md-6">
                <div id="mapEmpresa" style="height: 450px; width: 100%;"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="submit" class="btn btn-primary" id="btnGuardarModalEmpresa">Guardar cambios</button>
        </div>
      </form>
    </div>
  </div>
</div>

<div class="container-fluid px-4">
  <div class="form-floating mb-3 mt-4">
    <select class="form-control" name="slchangeRegistro" id="slchangeRegistro">
      <option value="Persona" id="optPersona" selected>Persona</option>
      <option value="Empresa" id="optEmpresa">Empresa</option>
    </select>
    <label for="lblCliente">Persona o Empresa</label>
  </div>
</div>

<div class="container-fluid px-4" id="contenedorEmpresas" style="display: none;">
  <div class="d-flex justify-content-between mt-3">
    <a href="./" class="btn btn-primary" id="btnRuta"><- Registrar Personas</a>
  </div>
  <table class="table table-striped" id="TbEmpresas">
    <thead>
      <tr>

      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
</div>


<div class="container-fluid px-4" id="contenedorPersonas">
  <div class="d-flex justify-content-between mt-3">
    <a href="./" class="btn btn-primary" id="btnRuta"><- Registrar Personas</a>
  </div>
  <table class="table table-striped" id="TbPersonas">
    <thead>
      <tr>
        <th>ID</th>
        <th>Tipo Documento</th>
        <th>Nro°</th>
        <th>Nombre Completo</th>
        <th>Telefono</th>
        <th>Nacionalidad</th>
      </tr>
    </thead>
    <tbody>
      <!-- Aquí puedes agregar las filas de la tabla con los datos correspondientes -->
    </tbody>
  </table>
</div>

<script type="module" src="./../../js/ListarPersonas.js"></script>

<?php require_once "../../footer.php"; ?>