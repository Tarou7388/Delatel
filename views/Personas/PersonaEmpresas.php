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
                        <div class="input-group">
                            <div class="form-floating flex-fill">
                                <input type="number" id="txtRuc" class="form-control" placeholder="R.U.C" require>
                                <label for="txtRuc">RUC</label>
                            </div>
                            <button class="btn btn-primary" type="button" id="btnBuscarEmpresa"><i class="fa-solid fa-magnifying-glass"></i></button>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtRepresentanteLegal" name="representante_legal" placeholder="Representante Legal" require>
                            <label for="txtRepresentanteLegal">Representante Legal</label>
                        </div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtRazonSocial" name="razon_social" placeholder="Razón Social" require>
                            <label for="txtRazonSocial">Razón Social</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtNombreComercial" name="nombre_comercial" placeholder="Nombre Comercial" require>
                            <label for="txtNombreComercial">Nombre Comercial</label>
                        </div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtTelefono" name="telefono" maxlength="11" placeholder="Teléfono" require>
                            <label for="txtTelefono">Teléfono</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-floating">
                            <input type="email" class="form-control" id="txtEmail" name="email" placeholder="Email" require>
                            <label for="txtEmail">Email</label>
                        </div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-4">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtDireccion" name="direccion" placeholder="Dirección" require>
                            <label for="txtDireccion">Dirección</label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtReferencia" name="referencia" placeholder="Referencia" require>
                            <label for="txtReferencia">Referencia</label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtCoordenadas" placeholder="Referencia" require>
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
                                <option value="Pasaporte">Pasaporte</option>
                                <option value="Carné de Extranjería">Carné de Extranjería</option>
                            </select>
                            <label for="slcTipoDocumento">Tipo de Documento</label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="input-group">
                            <div class="form-floating flex-fill">
                                <input type="number" id="txtNumDocumentoPersona" class="form-control" placeholder="Número de documento" require>
                                <label for="txtNumDocumentoPersona">Número de documento</label>
                            </div>
                            <button class="btn btn-primary" type="button" id="btnBuscar"><i class="fa-solid fa-magnifying-glass"></i></button>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtTelefonoPersona" maxlength="11" placeholder="Teléfono" require>
                            <label for="txtTelefonoPersona">Teléfono</label>
                        </div>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-4">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtNombresPersona" placeholder="Nombres" disabled require>
                            <label for="txtNombresPersona">Nombres</label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtApellidosPersona" placeholder="Apellidos" disabled require>
                            <label for="txtApellidosPersona">Apellidos</label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-floating">
                            <input type="email" class="form-control" id="txtEmailPersona" placeholder="Email" require>
                            <label for="txtEmailPersona">Email</label>
                        </div>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-4">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtDireccionPersona" placeholder="Dirección" require>
                            <label for="txtDireccionPersona">Dirección</label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtReferenciaPersona" placeholder="Referencia" require>
                            <label for="txtReferenciaPersona">Referencia</label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="txtCoordenadasPersona" placeholder="Referencia" require>
                            <label for="txtCoordenadasPersona">Coordenadas</label>
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
                    <tr>
                        <th>N°</th>
                        <th>Nombres y Apellidos</th>
                        <th>Tipo Doc.</th>
                        <th>Numero de Doc.</th>
                        <th>Telefono</th>
                        <th>Email</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>persona 1</td>
                        <td>DNI</td>
                        <td>71592495</td>
                        <td>907520277</td>
                        <td>example@example.com</td>
                        <td>Activo</td>
                        <td>
                            <button class="btn btn-primary" title="Actualizar" data-bs-toggle="modal" data-bs-target="#updateModal">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                            <button class="btn btn-danger" title="Eliminar">
                                <i class="fas fa-trash-alt"></i> <!-- Font Awesome icon for delete -->
                            </button>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="updateModalLabel">Actualizar Cliente</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="updateForm">

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="saveChanges">Guardar cambios</button>
                </div>
            </div>
        </div>
    </div>

</div>






<?php require_once "../../footer.php"; ?>
<script type="module" src="../../js/Empresa.js"></script>
<script type="module" src="../../js/Persona.js"></script>

</body>

</html>