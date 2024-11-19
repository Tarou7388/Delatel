<?php require_once '../../header.php'; ?>

<div class="modal fade" id="ModalMapa" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-xl" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="myModalLabel">Título del Modal</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<div id="map" style="height: 700px;">

				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
				<button type="button" class="btn btn-primary" id="btnGuardarCoordenadas" data-dismiss="modal" disabled>Guardar cambios</button>
			</div>
		</div>
	</div>
</div>

<div class="container-fluid px-4">
	<div class="form-floating mb-3 mt-4">
		<select class="form-control" name="slchangeRegistro" id="slcChangeRegistro">
			<option value="" disabled selected>Seleccione</option>
			<option value="Persona" id="optPersona">Persona</option>
			<option value="Empresa" id="optEmpresa">Empresa</option>
		</select>
		<label for="lblCliente">Persona o Empresa</label>
	</div>
</div>

<div class="container-fluid px-4">
	<div class="card d-none" id="divEmpresaCard">
		<div class="card-header bg-secondary text-white">
			<h5 class="mb-0">Registrar Empresa</h5>
		</div>
		<div class="card-body">
			<p class="mb-4"><strong>Complete los Datos</strong></p>
			<form class="form-control" id="frmEmpresas">
				<div class="row mb-3">
					<div class="col-md-4">
						<div class="input-group">
							<div class="form-floating flex-fill">
								<input type="number" id="txtRuc" class="form-control" placeholder="R.U.C" require maxlength="11" required>
								<label for="txtRuc">RUC</label>
							</div>
							<button class="btn btn-primary" type="button" id="btnBuscarEmpresa"><i class="fa-solid fa-magnifying-glass"></i></button>
						</div>
					</div>
					<div class="col-md-4">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtRepresentanteLegal" name="representante_legal" placeholder="Representante Legal" required>
							<label for="txtRepresentanteLegal">Representante Legal</label>
						</div>
					</div>
					<div class="col-md-4">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtRazonSocial" name="razon_social" placeholder="Razón Social" required disabled>
							<label for="txtRazonSocial">Razón Social</label>
						</div>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-md-4">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtNombreComercial" name="nombre_comercial" placeholder="Nombre Comercial" required>
							<label for="txtNombreComercial">Nombre Comercial</label>
						</div>
					</div>
					<div class="col-md-4">
						<div class="form-floating">
							<select class="form-select" id="slcTipoServicioEmpresa" aria-label="Servicios" required>
								<option value="0" disabled selected>Seleccione</option>
							</select>
							<label for="slcTipoServicioEmpresa">Servicios</label>
						</div>
					</div>
					<div class="col-md-4">
						<div class="form-floating">
							<select class="form-select select2 select2me" id="slcPaqueteEmpresa" aria-label="Paquetes" required>
								<option value="0" disabled selected>Seleccione</option>
							</select>
							<label for="slcPaqueteEmpresa">Paquetes</label>
						</div>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-md-3">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtTelefono" name="telefono" maxlength="9" placeholder="Teléfono" required>
							<label for="txtTelefono">Teléfono</label>
						</div>
					</div>
					<div class="col-md-3">
						<div class="form-floating">
							<input type="email" class="form-control" id="txtEmail" name="email" placeholder="Email">
							<label for="txtEmail">Email</label>
						</div>
					</div>
					<div class="col-md-6">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtDireccion" name="direccion" placeholder="Dirección" required disabled>
							<label for="txtDireccion">Dirección</label>
						</div>
					</div>
				</div>
				<div class="row mb-3">
					
					<div class="col-md-6">
						<div class="form-floating">
							<input type="text" class="form-control" id="txtReferencia" name="referencia" placeholder="Referencia" required>
							<label for="txtReferencia">Referencia</label>
						</div>
					</div>
					<div class="col-md-6">
						<div class="input-group">
							<div class="form-floating">
								<input type="text" class="form-control" id="txtCoordenadas" placeholder="Referencia" required>
								<label for="txtCoordenadas">Coordenadas</label>
							</div>
							<button class="btn btn-primary" type="button" id="btnBuscarCoordenadasEmpresa" data-toggle="modal" data-target="#ModalMapa"><i class="fa-solid fa-magnifying-glass"></i></button>
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
							<select class="form-select" id="slcTipoDocumento" aria-label="Tipo de Documento" disabled>
								<option value="" disabled selected>Seleccione</option>
								<option value="DNI">DNI</option>
								<option value="CAR">Carnét de Extranjería</option>
							</select>
							<label for="slcTipoDocumento">Tipo de Documento</label>
						</div>
					</div>
					<div class="col-md-4">
						<div class="input-group">
							<div class="form-floating flex-fill">
								<input type="tel" id="txtNumDocumentoPersona" class="form-control" placeholder="Número de documento" required maxlength="10">
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
							<input type="email" class="form-control" id="txtEmailPersona" placeholder="Email">
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
						<div class="input-group">
							<div class="form-floating">
								<input type="text" class="form-control" id="txtCoordenadasPersona" placeholder="Referencia" required disabled>
								<label for="txtCoordenadasPersona">Coordenadas</label>
							</div>
							<button class="btn btn-primary" type="button" id="btnBuscarCoordenadas" data-toggle="modal" data-target="#ModalMapa"><i class="fa-solid fa-magnifying-glass"></i></button>
						</div>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-md-4">
						<div class="form-floating">
							<select class="form-select" id="slcNacionalidad" aria-label="Nacionalidad">
								<option value="" disabled selected>Seleccione</option>
								<option value="Venezolano">Venezolano</option>
								<option value="Colombiano">Colombiano</option>
								<option value="Argentino">Argentino</option>
							</select>
							<label for="slcNacionalidad">Nacionalidad</label>
						</div>
					</div>

					<div class="col-md-4">
						<div class="form-floating">
							<select class="form-select" id="slcTipoServicio" aria-label="Servicios">
								<option value="0" disabled selected>Seleccione</option>
							</select>
							<label for="slcTipoServicio">Servicios</label>
						</div>
					</div>

					<div class="col-md-4">
						<div class="form-floating">
							<select class="form-select select2 select2me" id="slcPaquetes" aria-label="Paquetes">
								<option value="0" disabled selected>Seleccione</option>
							</select>
							<label for="slcPaquetes">Paquetes</label>
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
<script type="module" src="../../js/Empresa.js"></script>
<script type="module" src="../../js/Persona.js"></script>