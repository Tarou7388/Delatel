<?php require_once '../../header.php'; ?>

<div class="container-fluid px-4 mt-5">
    <select class="form-control" name="slchangeRegistro" id="slcChangeRegistro">
        <option value="Persona" id="optPersona">Persona</option>
        <option value="Empresa" id="optEmpresa">Empresa</option>
    </select>
</div>

<div class="container-fluid px-4 mt-5">
    <div class="card d-none" id="divEmpresaCard">
        <div class="card-header bg-secondary text-white">
            <h5 class="mb-0">Empresa</h5>
        </div>
        <div class="card-body">
            <p class="mb-4"><strong>Complete los Datos</strong></p>
            <form class="form-control" id="frmEmpresas">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="txtRuc" class="form-label">RUC</label>
                        <input type="text" class="form-control" id="txtRuc" name="ruc" maxlength="11">
                    </div>
                    <div class="col-md-6">
                        <label for="txtRepresentanteLegal" class="form-label">Representante Legal</label>
                        <input type="text" class="form-control" id="txtRepresentanteLegal" name="representante_legal">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="txtRazonSocial" class="form-label">Razón Social</label>
                        <input type="text" class="form-control" id="txtRazonSocial" name="razon_social">
                    </div>
                    <div class="col-md-6">
                        <label for="txtNombreComercial" class="form-label">Nombre Comercial</label>
                        <input type="text" class="form-control" id="txtNombreComercial" name="nombre_comercial">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="txtTelefono" class="form-label">Teléfono</label>
                        <input type="text" class="form-control" id="txtTelefono" name="telefono" maxlength="11">
                    </div>
                    <div class="col-md-6">
                        <label for="txtEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="txtEmail" name="email">
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


<div class="container-fluid px-4 mt-5">
    <div class="card d-none" id="divPersonaCard">
        <div class="card-header bg-secondary text-white">
            <h5 class="mb-0">Persona Natural</h5>
        </div>
        <div class="card-body">
            <p class="mb-4"><strong>Complete los Datos</strong></p>
            <form class="form-control" id="frmPersonas">
                <div class="row mb-3">
                    <div class="col-md-4">
                        <label for="slcTipoDocumento" class="form-label">Tipo de Documento</label>
                        <select class="form-select" id="slcTipoDocumento">
                            <option selected id="">Seleccionar...</option>
                            <option value="DNI" id="optDNI">DNI</option>
                            <option value="Pasaporte" id="optPasaporte">Pasaporte</option>
                            <option value="Carné de Extranjería" id="optCarneExtranjeria">Carné de Extranjería</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label for="txtNumDocumentoPersona" class="form-label">Número de documento</label>
                        <input type="text" class="form-control" id="txtNumDocumentoPersona">
                    </div>
                    <div class="col-md-4">
                        <label for="txtNombresPersona" class="form-label">Nombres</label>
                        <input type="text" class="form-control" id="txtNombresPersona">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-4">
                        <label for="txtApellidosPersona" class="form-label">Apellidos</label>
                        <input type="text" class="form-control" id="txtApellidosPersona">
                    </div>
                    <div class="col-md-4">
                        <label for="txtTelefono" class="form-label">Teléfono</label>
                        <input type="text" class="form-control" id="txtTelefonoPersona" maxlength="11">
                    </div>
                    <div class="col-md-4">
                        <label for="txtEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="txtEmailPersona">
                    </div>
                </div>
                <div class="d-flex justify-content-end">
                    <button type="submit" class="btn btn-primary me-2" id="btnRegistrarPersona">Registrar</button>
                    <button type="reset" class="btn btn-secondary" id="btnCancelarPersona">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once "../../footer.php"; ?>
<script type="module" src="../../js/Empresa.js"></script>
<script type="module" src="../../js/Persona.js"></script>

</body>

</html>