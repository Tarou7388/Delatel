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
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtRuc" name="ruc" maxlength="11" placeholder="RUC">
                            <label for="txtRuc">RUC</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtRepresentanteLegal" name="representante_legal" placeholder="Representante Legal">
                            <label for="txtRepresentanteLegal">Representante Legal</label>
                        </div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtRazonSocial" name="razon_social" placeholder="Razón Social">
                            <label for="txtRazonSocial">Razón Social</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtNombreComercial" name="nombre_comercial" placeholder="Nombre Comercial">
                            <label for="txtNombreComercial">Nombre Comercial</label>
                        </div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtTelefono" name="telefono" maxlength="11" placeholder="Teléfono">
                            <label for="txtTelefono">Teléfono</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="email" class="form-control" id="txtEmail" name="email" placeholder="Email">
                            <label for="txtEmail">Email</label>
                        </div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtDireccion" name="direccion" placeholder="Dirección">
                            <label for="txtDireccion">Dirección</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtReferencia" name="referencia" placeholder="Referencia">
                            <label for="txtReferencia">Referencia</label>
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
                        <div class="form-floating">
                            <select class="form-select" id="slcTipoDocumento" aria-label="Tipo de Documento">
                                <option selected>Seleccionar...</option>
                                <option value="DNI" id="optDNI">DNI</option>
                                <option value="Pasaporte" id="optPasaporte">Pasaporte</option>
                                <option value="Carné de Extranjería" id="optCarneExtranjeria">Carné de Extranjería</option>
                            </select>
                            <label for="slcTipoDocumento">Tipo de Documento</label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-floating">
                            <input type="number" id="txtNumDocumentoPersona" class="form-control" placeholder="Número de documento">
                            <label for="txtNumDocumentoPersona">Número de documento</label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtTelefonoPersona" maxlength="11" placeholder="Teléfono">
                            <label for="txtTelefonoPersona">Teléfono</label>
                        </div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-4">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtNombresPersona" placeholder="Nombres">
                            <label for="txtNombresPersona">Nombres</label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtApellidosPersona" placeholder="Apellidos">
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
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtDireccionPersona" name="direccion" placeholder="Dirección">
                            <label for="txtDireccionPersona">Dirección</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtReferenciaPersona" name="referencia" placeholder="Referencia">
                            <label for="txtReferenciaPersona">Referencia</label>
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-content-end mt-3">
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