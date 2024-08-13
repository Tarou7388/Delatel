<?php require_once "../header.php"; ?>

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
                                <input type="text" class="form-control" id="lblUsuario" disabled=true placeholder="Usuario"> <!-- Crear de manera automatica -->
                            </div>
                            <div class="col md-6">
                                <input type="text" class="form-control" id="lblClaveAcceso" disabled=true placeholder="Clave de acceso"> <!-- Crear de manera automatica -->
                            </div>
                        </div>
                        <div class="col md-6">
                            <input type="number" class="form-control" id="lblPotencia" placeholder="Potencia">
                        </div>
                        <label class="form-label mt-2">Datos del Modén</label>
                        <div class="row g-3 mb-2">
                            <div class="col md-6">
                                <input type="text" class="form-control" id="lblSSDI" placeholder="SSDI">
                            </div>
                            <div class="col md-6">
                                <input type="text" class="form-control" id="lblSeguridad" placeholder="Contraseña">
                            </div>
                        </div>
                        <div class="mb-2">
                            <select class="form-control" id="slcProducto" placeholder="Marca - Modelo">
                                <option value="0" selected disabled>Selecione</option>
                                <option value="1">Huawei - T23</option>
                                <option value="1">Huawei - T24</option>
                                <option value="1">Huawei - T25</option>
                                <option value="1">Huawei - T26</option>
                                <option value="1">Huawei - T27</option>
                                <option value="1">LG - N11</option>
                                <option value="1">Home - U78</option>
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
                                <input type="number" class="form-control" id="lblAntenas" placeholder="Antena#">
                            </div>
                            <div class="col md-6 form-check form-switch d-flex align-items-center">
                                <input class="form-check-input" type="checkbox" id="chkCatv">
                                <label class="form-check-label" for="chkCatv">CATV</label>
                            </div>
                            <button class="btn btn-outline-primary" type="Button" id="btnAniadir">Añadir</button>
                        </div>
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
</body>

</html>