<?php require_once '../../header.php'; ?>
<div class="container mt-2">
  <h2>Registrar Usuario</h2>
  <div class="card mt-3">
    <div class="card-header">
      <h4>Registrar Usuario</h4>
    </div>
    <div class="card-body">
      <form id="registerForm" action="registrar_usuario_action.php" method="POST">
        <div class="row mb-3">
          <div class="col-md-4">
            <div class="input-group">
              <div class="form-floating flex-fill">
                <input type="number" id="txtNumDocumentoPersona" class="form-control" placeholder="Número de documento" required max="20999999999">
                <label for="txtNumDocumentoPersona">Número de documento</label>
              </div>
              <button class="btn btn-primary" type="button" id="btnBuscar"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-floating">
              <select id="slcNacionalidad" name="nacionalidad" class="form-select" disabled>
                <option value="" disabled selected>Seleccione Nacionalidad</option>
              </select>
              <label for="slcNacionalidad">Nacionalidad</label>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-floating">
              <select id="slcDocumento" name="documento" class="form-select" disabled>
                <option value="" disabled selected>Seleccione Documento</option>
                <option value="DNI">DNI</option>
                <option value="PAS">Pasaporte</option>
                <option value="CAR">Carnét de Extranjería</option>
              </select>
              <label for="slcDocumento">Documento</label>
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <div class="form-floating">
              <input type="text" id="txtNombre" name="nombres" class="form-control" disabled>
              <label for="txtNombre">Nombre</label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input type="text" id="txtApe" name="apellidos" class="form-control" disabled>
              <label for="txtApe">Apellido</label>
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <div class="form-floating">
              <input type="text" id="txtUsuario" name="usuario" class="form-control" required>
              <label for="txtUsuario">Nombre de Usuario</label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <select id="slcRol" name="rol" class="form-select" required>
                <option value="" disabled selected>Seleccione un rol</option>
              </select>
              <label for="slcRol">Rol</label>
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <div class="form-floating">
              <input type="email" id="txtEmail" name="email" class="form-control" required>
              <label for="txtEmail">Correo Electrónico</label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input type="password" id="txtContrasena" name="contrasena" class="form-control" required>
              <label for="txtContrasena">Contraseña</label>
            </div>
          </div>
        </div>

        <div class="text-end">
          <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#confirmModal">Registrar</button>
          <a href="index.php" class="btn btn-danger">Cancelar</a>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- Modal de Confirmación -->
<div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmModalLabel">Confirmar Registro</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        ¿Está seguro de que desea registrar este usuario?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary" id="confirmRegister">Confirmar</button>
      </div>
    </div>
  </div>
</div>

<?php require_once "../../footer.php"; ?>

<script src="../../js/RegistrarUsuario.js" type="module"></script>