<?php require_once '../../header.php'; ?>
<div class="container">
  <div class="card mt-4">
    <div class="card-header">
      <h2>Contactabilidad</h2>
    </div>
    <div class="card-body">
      <form action="" class="form-control" id="frmContactabilidad">
        <div class="row mt-1 mb-2">
          <div class="col-md-4 mb-3 mt-3">
            <div class="input-group">
              <div class="form-floating flex-fill">
                <input type="number" class="form-control" id="txtDniContactabilidad" placeholder="DNI">
                <label for="lblDniContactabilidad">DNI</label>
              </div>
              <button class="btn btn-primary" type="button" id="btnBuscar"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
          </div>
          <div class="col-md-4 mb-3 mt-3">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtNombreContactabilidad" placeholder="Nombre">
              <label for="lblNombreContactabilidad">Nombre</label>
            </div>
          </div>
          <div class="col-md-4 mb-3 mt-3">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtApellidosContactabilidad" placeholder="Apellidos">
              <label for="lblApellidosContactabilidad">Apellidos</label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-5">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtNumeroContactabilidad" placeholder="Número de Celular">
              <label for="lblCelularContactabilidad">Numero de Celular</label>
            </div>
          </div>
          <div class="col-md-7">
            <div class="form-floating">
              <input type="email" class="form-control" id="txtEmailContactabilidad" placeholder="Email">
              <label for="">Correo electronico</label>
            </div>
          </div>
        </div>
      </form>



      datos completos
      dni
      dirección y ubicación en tiempo actual
    </div>
  </div>
</div>
<?php require_once "../../footer.php"; ?>