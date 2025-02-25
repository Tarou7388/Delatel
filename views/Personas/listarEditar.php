<?php require_once '../../header.php'; ?>

<link rel="stylesheet" href="../../css/diseñoGlobal.css">

<div class="modal fade" id="modalEditarPersona" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-bs-backdrop="static">
  <div class="modal-dialog modal-lg" role="document"> <!-- Cambiado a modal-lg -->
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="myModalLabel">Actualizar Datos de Persona</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <!-- Columna izquierda: Inputs -->
            <div class="col-md-6">
              <!-- Nombres y Apellidos -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <div class="mb-2">
                    <label for="txtNombresActualizar" class="form-label">Nombres</label>
                    <input type="text" class="form-control" id="txtNombresActualizar" placeholder="">
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="mb-2">
                    <label for="txtApellidosActualizar" class="form-label">Apellidos</label>
                    <input type="text" class="form-control" id="txtApellidosActualizar" placeholder="">
                  </div>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <!-- Dirección -->
                  <div class="mb-2">
                    <label for="txtDireccionActualizar" class="form-label">Dirección</label>
                    <input type="text" class="form-control" id="txtDireccionActualizar" placeholder="">
                  </div>
                </div>

                <div class="col-md-6">
                  <!-- Referencia -->
                  <div class="mb-2">
                    <label for="txtReferenciaActualizar" class="form-label">Referencia</label>
                    <input type="text" class="form-control" id="txtReferenciaActualizar" placeholder="">
                  </div>
                </div>
              </div>

              <!-- Coordenadas -->
              <div class="mb-2">
                <label for="CoordenadaModel" class="form-label">Coordenadas</label>
                <div class="input-group">
                  <input type="text" id="CoordenadaModel" class="form-control" placeholder="Coordenada" aria-label="Coordenada">
                  <button class="btn btn-outline-secondary" type="button" id="buscarBtn">Buscar</button>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <div class="mb-2">
                    <label for="txtTelefono" class="form-label">Teléfono</label>
                    <div class="input-group">
                      <span class="input-group-text" id="basic-addon1">+51</span>
                      <input type="text" id="txtTelefono" class="form-control" placeholder="Número de teléfono" aria-label="Número de teléfono">
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <!-- Nacionalidad -->
                  <div class="mb-2">
                    <label for="txtNacionalidadActualizar" class="form-label">Nacionalidad</label>
                    <input type="text" class="form-control" id="txtNacionalidadActualizar" placeholder="">
                  </div>
                </div>
              </div>

              <!-- Correo Electrónico -->
              <div class="mb-2">
                <label for="txtCorreoElectronico" class="form-label">Correo Electrónico</label>
                <div class="input-group">
                  <input type="email" class="form-control" id="txtCorreoElectronico" placeholder="a@a.com" aria-label="Correo Electrónico">
                </div>
              </div>
            </div>

            <!-- Columna derecha: Mapa -->
            <div class="col-md-6">
              <div id="map" style="height: 450px; width: 100%;"></div> <!-- Reducida la altura del mapa -->
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="submit" class="btn btn-primary" id="btnGuardarModalMapa" data-bs-dismiss="modal" disabled>Guardar cambios</button>
      </div>
    </div>
  </div>
</div>


<div class="container-fluid px-4">
  <div class="form-floating mb-3 mt-4">
    <select class="form-control" name="slchangeRegistro" id="slcChangeRegistro">
      <option value="Ambos" id="ambos" selected>Ambos</option>
      <option value="Persona" id="optPersona">Persona</option>
      <option value="Empresa" id="optEmpresa">Empresa</option>
    </select>
    <label for="lblCliente">Persona o Empresa</label>
  </div>
</div>

<div class="container-fluid px-4">
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