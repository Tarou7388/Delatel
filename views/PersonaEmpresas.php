<?php require_once '../header.php'; ?>


<div class="container-fluid px-4 mt-5">
    <select class="form-control" name="slchangeRegistro" id="slchangeRegistro">
        <option value="">Seleccionar</option>
        <option value="">Persona</option>
        <option value="">Empresa</option>
    </select>
</div>

<div class="container-fluid px-4 mt-5">
    <div class="card">
        <div class="card-header bg-secondary text-white">
            <h5 class="mb-0">Empresa</h5>
        </div>
        <div class="card-body">
            <p class="mb-4"><strong>Complete los Datos</strong></p>
            <form>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="numDocumento" class="form-label">Número de documento</label>
                        <input type="text" class="form-control" id="numDocumento">
                    </div>
                    <div class="col-md-6">
                        <label for="ruc" class="form-label">RUC</label>
                        <input type="text" class="form-control" id="ruc">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="nombres" class="form-label">Nombres</label>
                        <input type="text" class="form-control" id="nombres">
                    </div>
                    <div class="col-md-6">
                        <label for="apellidos" class="form-label">Apellidos</label>
                        <input type="text" class="form-control" id="apellidos">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="razonSocial" class="form-label">Razón Social</label>
                        <input type="text" class="form-control" id="razonSocial">
                    </div>
                    <div class="col-md-6">
                        <label for="nombreComercial" class="form-label">Nombre Comercial</label>
                        <input type="text" class="form-control" id="nombreComercial">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="direccion" class="form-label">Dirección</label>
                        <input type="text" class="form-control" id="direccion">
                    </div>
                    <div class="col-md-6">
                        <label for="referencia" class="form-label">Referencia</label>
                        <input type="text" class="form-control" id="referencia">
                    </div>
                </div>
                <div class="d-flex justify-content-end">
                    <button type="submit" class="btn btn-primary me-2">Registrar</button>
                    <button type="reset" class="btn btn-secondary">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
</div>


<div class="container-fluid px-4 mt-5">
    <div class="card">
        <div class="card-header bg-secondary text-white">
            <h5 class="mb-0">Persona Natural</h5>
        </div>
        <div class="card-body">
            <p class="mb-4"><strong>Complete los Datos</strong></p>
            <form>
                <div class="row mb-3">
                    <div class="col-md-4">
                        <label for="tipoDocumento" class="form-label">Tipo de Documento</label>
                        <select class="form-select" id="tipoDocumento">
                            <option selected>Seleccionar...</option>
                            <option value="DNI">DNI</option>
                            <option value="Pasaporte">Pasaporte</option>
                            <option value="Carné de Extranjería">Carné de Extranjería</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label for="numDocumento" class="form-label">Número de documento</label>
                        <input type="text" class="form-control" id="numDocumento">
                    </div>
                    <div class="col-md-4">
                        <label for="nombres" class="form-label">Nombres</label>
                        <input type="text" class="form-control" id="nombres">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-4">
                        <label for="apellidos" class="form-label">Apellidos</label>
                        <input type="text" class="form-control" id="apellidos">
                    </div>
                    <div class="col-md-4">
                        <label for="telefono" class="form-label">Teléfono</label>
                        <input type="text" class="form-control" id="telefono">
                    </div>
                    <div class="col-md-4">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="direccion" class="form-label">Dirección</label>
                        <input type="text" class="form-control" id="direccion">
                    </div>
                    <div class="col-md-6">
                        <label for="referencia" class="form-label">Referencia</label>
                        <input type="text" class="form-control" id="referencia">
                    </div>
                </div>
                <div class="d-flex justify-content-end">
                    <button type="submit" class="btn btn-primary me-2">Registrar</button>
                    <button type="reset" class="btn btn-secondary">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
</div>


<?php require_once "../footer.php"; ?>
<script type="module" src="../js/PersonaEmpresa.js"></script>

</body>

</html>