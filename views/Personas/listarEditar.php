<?php require_once '../../header.php'; ?>

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
              <div class="mb-3">
                <label for="txtNombresActualizar" class="form-label">Nombres</label>
                <input type="text" class="form-control" id="txtNombresActualizar" placeholder="">
              </div>
              <div class="mb-3">
                <label for="txtApellidosActualizar" class="form-label">Apellidos</label>
                <input type="text" class="form-control" id="txtApellidosActualizar" placeholder="">
              </div>
              <div class="mb-3">
                <label for="txtDireccionActualizar" class="form-label">Dirección</label>
                <input type="text" class="form-control" id="txtDireccionActualizar" placeholder="">
              </div>
              <div class="mb-3">
                <label for="CoordenadaModel" class="form-label">Coordenadas</label>
                <div class="input-group">
                  <input type="text" id="CoordenadaModel" class="form-control" placeholder="Coordenada" aria-label="Coordenada">
                  <button class="btn btn-outline-secondary" type="button" id="buscarBtn">Buscar</button>
                </div>
              </div>
              <div class="mb-3">
                <label for="txtNacionalidadActualizar" class="form-label">Nacionalidad</label>
                <input type="text" class="form-control" id="txtNacionalidadActualizar" placeholder="">
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
        <button type="button" class="btn btn-primary" id="btnGuardarModalMapa" data-bs-dismiss="modal" disabled>Guardar cambios</button>
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
  <table class="table table-striped" id="TbPersonas">
    <thead>
      <tr>
        <th>Nro Identificación</th>
        <th>Nombre y Apellidos</th>
        <th>Dirección</th>
        <th>Teléfono</th>
        <th>Dirección</th>
        <th>Coordenadas</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <!-- Aquí puedes agregar las filas de la tabla con los datos correspondientes -->
    </tbody>
  </table>
</div>

<script type="module" src="./../../js/ListarPersonas.js"></script>

<?php require_once "../../footer.php"; ?>