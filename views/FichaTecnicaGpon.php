<?php require_once "../header.php"; ?>

<div class="modal fade" id="mdlRepetidor" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Añadir Repetidor</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id=mdlRepetidorBody>
                <div class="mb-2">
                    <input type="text" class="form-control" id="txtSsidRepetidor" placeholder="SSID">
                </div>
                <div class="mb-2">
                    <input type="text" class="form-control" id="txtContraseniaRepetidor" placeholder="Contraseña">
                </div>
                <div class="mb-2">
                    <select class="form-control" id="slcMarcaModeloRepetidor" placeholder="Marca - Modelo">
                        <option value="0" selected disabled>Selecione</option>
                        <option value="1">Huawei - T23</option>
                        <option value="2">LG - N11</option>
                        <option value="3">Home - U78</option>
                    </select>
                </div>
                <div class="mb-2">
                    <input type="text" class="form-control" id="txtIpRepetidor" placeholder="IP">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" id=btnAñadirRepetidor class="btn btn-primary">Guardar</button>
            </div>
        </div>
    </div>
</div>

<div class="container">
    <div class="form-container">
        <h2 class="text-center">Registro</h2>

        <form>
            <div class="conteiner">
                <div class="card">
                    <div class="card-body">
                        <h6 class="text-center card-title">Fibra optica</h6>
                        <label class="form-label">Datos del servicio</label>
                        <div class="row g-3 mb-2">
                            <div class="col md-6">
                                <input type="text" class="form-control" id="txtUsuario" disabled=true placeholder="Usuario"> <!-- Crear de manera automatica -->
                            </div>
                            <div class="col md-6">
                                <input type="text" class="form-control" id="txtClaveAcceso" disabled=true placeholder="Clave de acceso"> <!-- Crear de manera automatica -->
                            </div>
                        </div>
                        <div class="row g-3 mb-2">
                            <div class="col md-9">
                                <input type="text" class="form-control" disabled=true id="txtPlan" placeholder="Plan">
                            </div>
                            <div class="col md-3">
                                <input type="number" class="form-control" id="txtPotencia" placeholder="Potencia">
                            </div>
                        </div>
                        <label class="form-label mt-2">Datos del Modén</label>
                        <div class="row g-3 mb-2">
                            <div class="col md-6">
                                <input type="text" class="form-control" id="txtSsdi" placeholder="SSDI">
                            </div>
                            <div class="col md-6">
                                <input type="text" class="form-control" id="txtSeguridad" placeholder="Contraseña">
                            </div>
                        </div>
                        <div class="mb-2">
                            <select class="form-control" id="slcMarcaModelo" placeholder="Marca - Modelo">
                                <option value="0" selected disabled>Selecione</option>
                                <option value="1">Huawei - T23</option>
                                <option value="2">LG - N11</option>
                                <option value="3">Home - U78</option>
                            </select>
                        </div>
                        <div class="row g-3 mb-2">
                            <div class="col md-6">
                                <select type="text" class="form-select" id="slcBanda" placeholder="Banda">
                                    <option value="2G">2G</option>
                                    <option value="5G" selected>5G</option>
                                </select>
                            </div>
                            <div class="col md-6">
                                <input type="number" class="form-control" id="txtAntenas" placeholder="Antena#">
                            </div>
                            <div class="col md-6 form-check form-switch d-flex align-items-center">
                                <input class="form-check-input" type="checkbox" id="chkCatv">
                                <label class="form-check-label" for="chkCatv">CATV</label>
                            </div>
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#mdlRepetidor">
                                Añadir Repetidor
                            </button>
                            <div id="cardContainer" class="container mt-4" hidden=true>
                                <div class="row" id="cardsRow">
                                    <!-- Aquí se añadirán las cards -->
                                </div>
                            </div>
                            <div class="mt-4">
                                <textarea type="text" class="form-control" id="txtAntenas" placeholder="Detalles"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="conteiner">
                <div class="card">
                    <div class="card-body">
                        <h6 class="text-center card-title">Cable</h6>
                    </div>
                </div>
            </div>







            <div class="mb-3">
                <label for="genero" class="form-label">Género</label>
                <select class="form-select" id="genero">
                    <option selected disabled>Selecciona tu género</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                    <option value="no-declarar">Prefiero no declarar</option>
                </select>
            </div>
            <div class="mb-2">
                <div class="input-group">
                    <input type="text" class="form-control" id="codigo-promocional" placeholder="Numero de documento">
                    <button class="btn btn-outline-primary" type="submit" id="btnBuscarDocumento">Aplicar</button>
                </div>
            </div>
            <div class="mb-3">
                <label for="pais" class="form-label">País</label>
                <select class="form-select" id="pais">
                    <option selected disabled>Selecciona tu país</option>
                    <option value="argentina">Argentina</option>
                    <option value="mexico">México</option>
                    <option value="colombia">Colombia</option>
                    <option value="españa">España</option>
                    <option value="peru">Perú</option>
                    <!-- Agrega más países según sea necesario -->
                </select>
            </div>
            <div class="mb-3">
                <label for="tipo-documento" class="form-label">Tipo de Documento</label>
                <select class="form-select" id="tipo-documento">
                    <option selected disabled>Selecciona el tipo de documento</option>
                    <option value="dni">DNI</option>
                    <option value="pasaporte">Pasaporte</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="numero-documento" class="form-label">Número de Documento</label>
                <input type="text" class="form-control" id="numero-documento" placeholder="Ingresa tu número de documento">
            </div>
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="terminos">
                <label class="form-check-label" for="terminos">Acepto los <a href="#">términos y condiciones</a></label>
            </div>
            <div class="d-grid">
                <button type="submit" class="btn btn-primary">Registrarse</button>
            </div>
        </form>
    </div>
</div>

<?php require_once "../footer.php"; ?>

<script src="../js/FichaTecnicaGpon.js"></script>
</body>

</html>