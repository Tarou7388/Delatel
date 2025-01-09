<?php require_once '../../header.php'; ?>

<link rel="stylesheet" href="../../css/diseñoGlobal.css" />

<div class="container-fluid px-4">
	<h1 class="mt-4">Registrar Nuevo Usuario</h1>

	<div class="card mb-4">
		<div class="card-header d-flex justify-content-between align-items-center">
			<div>
				<i class="fas fa-table me-1"></i> Gestionar Usuarios
			</div>
			<a href="<?= $host ?>views/Usuarios/" class="btn btn-primary">Listado de Usuario</a>
		</div>
		<div class="card-body">


			<form id="registerForm" action="" method="POST">
				<div class="row mb-3">
					<div class="col-md-4 mt-2">
						<div class="input-group">
							<div class="form-floating flex-fill">
								<input type="text" id="txtNumDocumentoPersona" class="form-control" placeholder="Número de documento">
								<label for="txtNumDocumentoPersona">Número de documento</label>
							</div>
							<button class="btn btn-primary" type="button" id="btnBuscar">
								<i class="fa-solid fa-magnifying-glass"></i>
							</button>
						</div>
					</div>
					<div class="col-md-4 mt-2">
						<div class="form-floating">
							<select id="slcNacionalidad" name="nacionalidad" class="form-select" disabled>
								<option value="" disabled selected>Seleccione Nacionalidad</option>
							</select>
							<label for="slcNacionalidad">Nacionalidad</label>
						</div>
					</div>
					<div class="col-md-4 mt-2">
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
					<div class="col-md-4 mt-2">
						<div class="form-floating">
							<input type="text" id="txtNombre" name="nombres" class="form-control" placeholder="Nombres" disabled>
							<label for="txtNombre">Nombres</label>
						</div>
					</div>
					<div class="col-md-4 mt-2">
						<div class="form-floating">
							<input type="text" id="txtApe" name="apellidos" class="form-control" placeholder="Apellidos" disabled>
							<label for="txtApe">Apellidos</label>
						</div>
					</div>
					<div class="col-md-4 mt-2">
						<div class="form-floating">
							<input type="text" id="txtTelefono" name="txtTelefono" placeholder="Teléfono" class="form-control" maxlength="9" minlength="9" required disabled>
							<label for="txtTelefono">Teléfono</label>
						</div>
					</div>
				</div>

				<div class="row mb-3">
					<div class="col-md-6">
						<div class="form-floating">
							<input type="text" id="txtUsuario" name="usuario" class="form-control" placeholder="Nombre de Usuario" required>
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
							<input type="email" id="txtEmail" name="email" class="form-control" placeholder="Correo Electrónico" required disabled>
							<label for="txtEmail">Correo Electrónico</label>
						</div>
					</div>
					<div class="col-md-6">
						<div class="form-floating">
							<input type="password" id="txtContrasenia" name="contrasena" class="form-control" placeholder="Contraseña" required>
							<label for="txtContrasenia">Contraseña</label>
						</div>
						<div id="ulRequisitos" hidden>
							<ul>
								<li>Requisito 8 caracteres mínimo</li>
								<li>Al menos 1 número</li>
								<li>Al menos 1 letra minúscula</li>
								<li>Al menos 1 carácter especial</li>
								<li>Al menos 1 letra mayúscula</li>
							</ul>
						</div>
					</div>
				</div>

				<div class="text-end">
					<button type="submit" class="btn btn-success">Registrar</button>
					<a href="<?= $host ?>views/Usuarios/" class="btn btn-secondary">Cancelar</a>
				</div>
			</form>


		</div>
	</div>
</div>
<script src="../../js/RegistrarUsuario.js" type="module"></script>
<?php require_once "../../footer.php"; ?>