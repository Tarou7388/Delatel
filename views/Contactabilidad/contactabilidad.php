<?php require_once '../../header.php'; ?>
<div class="container">
  <div class="card mt-4">
    <div class="card-header">
      <h2>Contactabilidad</h2>
    </div>
    <div class="card-body">
      <form action="" class="form-control" id="frmContactabilidad">
        <div class="row mb-2 mt-3">
          <div class="col-md-2 mb-3 mt-2">
            <div class="form-floating">
              <select name="" id="slcTipoDoc" class="form-select">
                <option value="DNI">DNI</option>
                <option value="PAS">Pasaporte</option>
                <option value="CAR">Carnét de Extranjería</option>
              </select>
              <label for="">Tipo de Documento</label>
            </div>
          </div>
          <div class="col-md-4 mb-3 mt-2">
            <div class="input-group">
              <div class="form-floating flex-fill">
                <input type="number" class="form-control" id="txtDniContactabilidad" placeholder="DNI">
                <label for="lblDniContactabilidad">DNI</label>
              </div>
              <button class="btn btn-primary" type="button" id="btnBuscarDni"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
          </div>
          <div class="col-md-3 mb-3 mt-2">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtNombreContactabilidad" placeholder="Nombre">
              <label for="lblNombreContactabilidad">Nombre</label>
            </div>
          </div>
          <div class="col-md-3 mb-3 mt-2">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtApellidosContactabilidad" placeholder="Apellidos">
              <label for="lblApellidosContactabilidad">Apellidos</label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 mb-3">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtNumeroContactabilidad" placeholder="Número de Celular">
              <label for="lblCelularContactabilidad">Número de Celular</label>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-floating">
              <input type="email" class="form-control" id="txtEmailContactabilidad" placeholder="Email">
              <label for="">Correo electronico</label>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtDireccionContactabilidad" placeholder="Dirección">
                <label for="">Dirección de servicio</label>
              </div>
              <button class="btn btn-primary" type="button"> <i class="fa-solid fa-magnifying-glass"></i> </button>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-3">
            <div class="form-floating">
              <select name="" id="slcPlanes" class="form-select"></select>
              <label for="">Planes</label>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtPrecioContactabilidad" placeholder="Precio" disabled>
              <label for="">Precio</label>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <div class="input-group">
                <div class="form-floating">
                  <input type="datetime-local" class="form-control" id="txtFechaContactabilidad" name="fecha" required>
                  <label for="fecha">Fecha</label>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-floating">
              <input type="text" id="txtDireccionActual" class="form-control" placeholder="Dirección">
              <label for="">Dirección actual</label>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <div class="form-floating">
              <textarea name="" id="txtDetalles" class="form-control" placeholder="Detalles"></textarea>
              <label for="">Detalles</label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col text-end">
            <button type="submit" class="btn btn-primary"> Guardar</button>
            <button type="reset" class="btn btn-secondary"> Cancelar</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
<?php require_once "../../footer.php"; ?>
<script type="module" src="../../js/Contactabilidad.js"></script>