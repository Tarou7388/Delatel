<?php require_once '../../header.php'; ?>

<div class="container-fluid px-4 mt-5">
    <select class="form-control" name="slchangeRegistro" id="slcChangeRegistro">
        <option value="Persona" id="optPersona">Persona</option>
        <option value="Empresa" id="optEmpresa">Empresa</option>
    </select>
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
                        <label for="editNombreEmpresa" class="form-label">Nombre Comercial</label>
                        <input type="text" class="form-control" id="editNombreEmpresa">
                    </div>
                    <div class="mb-3">
                        <label for="editEmailEmpresa" class="form-label">Email</label>
                        <input type="email" class="form-control" id="editEmailEmpresa">
                    </div>
                    <div class="mb-3">
                        <label for="editTelefonoEmpresa" class="form-label">Teléfono</label>
                        <input type="text" class="form-control" id="editTelefonoEmpresa">
                    </div>
                    <div class="mb-3">
                        <label for="editDireccionEmpresa" class="form-label">Dirección</label>
                        <input type="text" class="form-control" id="editDireccionEmpresa">
                    </div>
                    <div class="mb-3">
                        <label for="editReferenciaEmpresa" class="form-label">Referencia</label>
                        <input type="text" class="form-control" id="editReferenciaEmpresa">
                    </div>
                    <div class="mb-3">
                        <label for="editCoordenadasEmpresa" class="form-label">Coordenadas</label>
                        <input type="text" class="form-control" id="editCoordenadasEmpresa">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="saveEmpresaChanges">Guardar cambios</button>
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
                        <label for="editNombrePersona" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="editNombrePersona">
                    </div>
                    <div class="mb-3">
                        <label for="editApellidosPersona" class="form-label">Apellidos</label>
                        <input type="text" class="form-control" id="editApellidosPersona">
                    </div>
                    <div class="mb-3">
                        <label for="editEmailPersona" class="form-label">Email</label>
                        <input type="email" class="form-control" id="editEmailPersona">
                    </div>
                    <div class="mb-3">
                        <label for="editTelefonoPersona" class="form-label">Teléfono</label>
                        <input type="text" class="form-control" id="editTelefonoPersona">
                    </div>
                    <div class="mb-3">
                        <label for="editDireccionPersona" class="form-label">Dirección</label>
                        <input type="text" class="form-control" id="editDireccionPersona">
                    </div>
                    <div class="mb-3">
                        <label for="editReferenciaPersona" class="form-label">Referencia</label>
                        <input type="text" class="form-control" id="editReferenciaPersona">
                    </div>
                    <div class="mb-3">
                        <label for="editCoordenadasPersona" class="form-label">Coordenadas</label>
                        <input type="text" class="form-control" id="editCoordenadasPersona">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="savePersonaChanges">Guardar cambios</button>
            </div>
        </div>
    </div>
</div>


<!-- Contenido del registro -->

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
                            <input type="text" class="form-control" id="txtRazonSocial" name="razon_social" placeholder="Razón Social" required>
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
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtTelefono" name="telefono" maxlength="9" placeholder="Teléfono" required>
                            <label for="txtTelefono">Teléfono</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="email" class="form-control" id="txtEmail" name="email" placeholder="Email" required>
                            <label for="txtEmail">Email</label>
                        </div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-4">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtDireccion" name="direccion" placeholder="Dirección" required>
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
                                <option value="DNI">DNI</option>
                                <option value="PAS">Pasaporte</option>
                                <option value="CAR">Carné de Extranjería</option>
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
                            <button class="btn btn-primary" type="button" id="btnBuscar"><i class="fa-solid fa-magnifying-glass"></i></button>
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
                </div>

                <div class="d-flex justify-content-end mt-3">
                    <button type="submit" class="btn btn-primary me-2" id="btnRegistrarPersona">Registrar</button>
                    <button type="reset" class="btn btn-secondary" id="btnCancelarPersona">Cancelar</button>
                </div>
            </form>
        </div>

    </div>


    <div class="card mt-5">
        <div class="card-header">
            <h4>Listar Clientes</h4>
        </div>
        <div class="card-body">
            <table id="listarCliente" class="table table-striped mt-4">
                <thead>
                    <th>Nombre cliente</th>
                    <th>N° identificador</th>
                    <th>Emailr</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Referencia</th>
                    <th>Coordenadas</th>
                    <th>Acciones</th>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>

</div>






<?php require_once "../../footer.php"; ?>
<script type="module" src="../../js/ListarClientes.js"></script>
<script type="module" src="../../js/Empresa.js"></script>
<script type="module" src="../../js/Persona.js"></script>


</body>

</html>