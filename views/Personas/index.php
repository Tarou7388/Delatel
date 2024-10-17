<?php require_once '../../header.php'; ?>

<div class="container-fluid px-4">
	<h1 class="mt-4">Clientes</h1>

	<div class="form-floating">
		<select class="form-control" name="slchangeRegistro" id="slcChangeRegistro">
			<option value="" disabled selected>Seleccione el Tipo de Cliente</option>
			<option value="Persona" id="optPersona">Persona</option>
			<option value="Empresa" id="optEmpresa">Empresa</option>
		</select>
		<label for="lblCliente">Cliente</label>
	</div>
</div>

<!-- Modal para Empresa -->
<div class="modal fade" id="editEmpresaModal" tabindex="-1" aria-labelledby="editEmpresaModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="editEmpresaModalLabel">Editar Empresa</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<form id="editEmpresaForm">
					<input type="hidden" id="editCodigoEmpresa">
					<div class="mb-3">
						<div class="form-floating">
							<input type="text" class="form-control" id="txteditNombreEmpresa" placeholder="Nombre Comercial">
							<label for="txteditNombreEmpresa" class="form-label">Nombre Comercial</label>
						</div>
					</div>
					<div class="mb-3">
						<div class="form-floating">
							<input type="email" class="form-control" id="txteditEmailEmpresa" placeholder="Email">
							<label for="txteditEmailEmpresa" class="form-label">Email</label>
						</div>
					</div>
					<div class="mb-3">
						<div class="form-floating">
							<input type="text" class="form-control" id="txteditTelefonoEmpresa" placeholder="Teléfono">
							<label for="txteditTelefonoEmpresa" class="form-label">Teléfono</label>
						</div>
					</div>
					<div class="mb-3">
						<div class="form-floating">
							<input type="text" class="form-control" id="txteditDireccionEmpresa" placeholder="Dirección">
							<label for="txteditDireccionEmpresa" class="form-label">Dirección</label>
						</div>

					</div>
					<div class="mb-3">
						<div class="form-floating">
							<input type="text" class="form-control" id="txteditReferenciaEmpresa" placeholder="Referencia">
							<label for="txteditReferenciaEmpresa" class="form-label">Referencia</label>
						</div>
					</div>
					<div class="mb-3">
						<div class="form-floating">
							<input type="text" class="form-control" id="txteditCoordenadasEmpresa" placeholder="Coordenadas">
							<label for="txteditCoordenadasEmpresa" class="form-label">Coordenadas</label>
						</div>
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
				<button type="button" class="btn btn-success" id="btnsaveEmpresaChanges">Guardar cambios</button>
			</div>
		</div>
	</div>
</div>

<!-- Modal para Persona -->
<div class="modal fade" id="editPersonaModal" tabindex="-1" aria-labelledby="editPersonaModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="editPersonaModalLabel">Editar Persona</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<form id="editPersonaForm">
					<input type="hidden" id="editCodigoPersona">
					<div class="mb-3">
						<div class="form-floating">
							<input type="text" class="form-control" id="txteditNombrePersona" placeholder="Nombre">
							<label for="txteditNombrePersona" class="form-label">Nombre</label>
						</div>
					</div>
					<div class="mb-3">
						<div class="form-floating">
							<inputxtDirecciont type="text" class="form-control" id="txteditApellidosPersona" placeholder="Apellidos">
								<label for="txteditApellidosPersona" class="form-label">Apellidos</label>
						</div>
					</div>
					<div class="mb-3">
						<div class="form-floating">
							<input type="email" class="form-control" id="txteditEmailPersona" placeholder="Email">
							<label for="txteditEmailPersona" class="form-label">Email</label>
						</div>
					</div>
					<div class="mb-3">
						<div class="form-floating">
							<input type="text" class="form-control" id="txteditTelefonoPersona" placeholder="Teléfono">
							<label for="txteditTelefonoPersona" class="form-label">Teléfono</label>
						</div>
					</div>
					<div class="mb-3">
						<div class="form-floating">
							<input type="text" class="form-control" id="txteditDireccionPersona" placeholder="Dirección">
							<label for="txteditDireccionPersona" class="form-label">Dirección</label>
						</div>
					</div>
					<div class="mb-3">
						<div class="form-floating">
							<input type="text" class="form-control" id="txteditReferenciaPersona" placeholder="Referencia">
							<label for="txteditReferenciaPersona" class="form-label">Referencia</label>
						</div>
					</div>
					<div class="mb-3">
						<div class="form-floating">
							<input type="text" class="form-control" id="txteditCoordenadasPersona" placeholder="Coordenadas">
							<label for="txteditCoordenadasPersona" class="form-label">Coordenadas</label>
						</div>
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
				<button type="button" class="btn btn-success" id="savePersonaChanges">Guardar cambios</button>
			</div>
		</div>
	</div>
</div>

<br>

<!-- Contenido del registro -->

<div class="container-fluid px-4">
	<div class="card d-none" id="divEmpresaCard">
		<div class="card-header bg-secondary text-white">
			<h5 class="mb-0">Registrar Empresa</h5>
		</div>
		<div class="card-body">
			<p class="mb-4"><strong>Complete los Datos</strong></p>
			<form class="form-control" id="frmEmpresas">
				<div class="row mb-3">
					<div class="col-md-6">
						<div class="input-group">
							<div class="form-floating flex-fill">
								<input type="number" id="txtRuc" class="form-control" placeholder="R.U.C" require maxlength="11" required>
								<label for="txtRuc">RUC</label>
							</div>
							<button class="btn btn-primary" type="button" id="btnBuscarEmpresa"><i class="fa-solid fa-magnifying-glass"></i></button>
						</div>
					</div>
					<div class="col-md-6">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtRepresentanteLegal" name="representante_legal" placeholder="Representante Legal" required>
							<label for="txtRepresentanteLegal">Representante Legal</label>
						</div>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-md-6">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtRazonSocial" name="razon_social" placeholder="Razón Social" required disabled>
							<label for="txtRazonSocial">Razón Social</label>
						</div>
					</div>
					<div class="col-md-6">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtNombreComercial" name="nombre_comercial" placeholder="Nombre Comercial" required>
							<label for="txtNombreComercial">Nombre Comercial</label>
						</div>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-md 3">
						<div class="form-floating">
							<select class="form-select select2 select2me" id="slcServicioEmpresa" aria-label="Servicios">
								<option value="0" disabled selected>Seleciona</option>
							</select>
							<label for="slcServicio">Servicios</label>
						</div>
					</div>
					<div class="col-md-3">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtTelefono" name="telefono" maxlength="9" placeholder="Teléfono" required>
							<label for="txtTelefono">Teléfono</label>
						</div>
					</div>
					<div class="col-md-3">
						<div class="form-floating">
							<input type="email" class="form-control" id="txtEmail" name="email" placeholder="Email" required>
							<label for="txtEmail">Email</label>
						</div>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-md-4">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtDireccion" name="direccion" placeholder="Dirección" required disabled>
							<label for="txtDireccion">Dirección</label>
						</div>
					</div>
					<div class="col-md-4">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtReferencia" name="referencia" placeholder="Referencia" required>
							<label for="txtReferencia">Referencia</label>
						</div>
					</div>
					<div class="col-md-4">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtCoordenadas" placeholder="Referencia" required>
							<label for="txtCoordenadas">Coordenadas</label>
						</div>
					</div>
				</div>
				<div class="d-flex justify-content-end">
					<button type="submit" class="btn btn-primary me-2" id="btnRegistrarEmpresa">Registrar</button>
					<button type="reset" class="btn btn-secondary" id="btnCancelarEmpresa">Cancelar</button>
				</div>
			</form>
		</div>
	</div>
</div>

<div class="container-fluid px-4">
	<div class="card d-none" id="divPersonaCard">
		<div class="card-header bg-secondary text-white">
			<h5 class="mb-0">Registrar Persona</h5>
		</div>
		<div class="card-body">
			<p class="mb-4"><strong>Complete los Datos</strong></p>
			<form class="form-control" id="frmPersonas">
				<div class="row mb-3">
					<div class="col-md-4">
						<div class="form-floating">
							<select class="form-select" id="slcTipoDocumento" aria-label="Tipo de Documento">
								<option selected>Seleccionar...</option>
								<option value="DNI">DNI</option>
								<option value="PAS">Pasaporte</option>
								<option value="CAR">Carnét de Extranjería</option>
							</select>
							<label for="slcTipoDocumento">Tipo de Documento</label>
						</div>
					</div>
					<div class="col-md-4">
						<div class="input-group">
							<div class="form-floating flex-fill">
								<input type="number" id="txtNumDocumentoPersona" class="form-control" placeholder="Número de documento" required max="20999999999">
								<label for="txtNumDocumentoPersona">Número de documento</label>
							</div>
							<button class="btn btn-primary" type="button" id="btnBuscar" disabled><i class="fa-solid fa-magnifying-glass"></i></button>
						</div>
					</div>
					<div class="col-md-4">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtTelefonoPersona" maxlength="9" placeholder="Teléfono" required>
							<label for="txtTelefonoPersona">Teléfono</label>
						</div>
					</div>
				</div>

				<div class="row mb-3">
					<div class="col-md-4">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtNombresPersona" placeholder="Nombres" disabled required>
							<label for="txtNombresPersona">Nombres</label>
						</div>
					</div>
					<div class="col-md-4">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtApellidosPersona" placeholder="Apellidos" disabled required>
							<label for="txtApellidosPersona">Apellidos</label>
						</div>
					</div>
					<div class="col-md-4">
						<div class="form-floating">
							<input type="email" class="form-control" id="txtEmailPersona" placeholder="Email" required>
							<label for="txtEmailPersona">Email</label>
						</div>
					</div>
				</div>

				<div class="row mb-3">
					<div class="col-md-4">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtDireccionPersona" placeholder="Dirección" required>
							<label for="txtDireccionPersona">Dirección</label>
						</div>
					</div>
					<div class="col-md-4">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtReferenciaPersona" placeholder="Referencia" required>
							<label for="txtReferenciaPersona">Referencia</label>
						</div>
					</div>
					<div class="col-md-4">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtCoordenadasPersona" placeholder="Referencia" required>
							<label for="txtCoordenadasPersona">Coordenadas</label>
						</div>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-md-4">
						<div class="form-floating">
							<select class="form-select" id="slcNacionalidad" aria-label="Nacionalidad">
								<option selected>Seleccionar Nacionalidad</option>
								<option value="Venezolano">Venezolano</option>
								<option value="Colombiano">Colombiano</option>
								<option value="Argentino">Argentino</option>
							</select>
							<label for="slcNacionalidad">Nacionalidad</label>
						</div>
					</div>
					<div class="col-md-4">
						<div class="form-floating">
							<select class="form-select select2 select2me" id="slcServicio" aria-label="Servicios">
								<option value="0" disabled selected>Seleciona</option>
							</select>
							<label for="slcServicio">Servicios</label>
						</div>
					</div>
				</div>

				<div class="d-flex justify-content-end mt-3">
					<button type="submit" class="btn btn-success me-2" id="btnRegistrarPersona">Registrar</button>
					<button type="reset" class="btn btn-secondary" id="btnCancelarPersona">Cancelar</button>
				</div>
			</form>
		</div>

	</div>
</div>

<?php require_once "../../footer.php"; ?>
<script type="module" src="../../js/ListarClientes.js"></script>
<script type="module" src="../../js/Empresa.js"></script>
<script type="module" src="../../js/Persona.js"></script>