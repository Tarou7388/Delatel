<?php require_once "../header.php"; ?>

<div class="container">
    <div class="form-container">
        <h2 class="text-center">Registro</h2>

        <form>
            <label class="form-label">Fibra optica</label>
            <div class="row g-3 mb-2">
                <div class="col md-6">
                    <input type="text" class="form-control" id="lblUsuario" placeholder="Usuario">
                </div>
                <div class="col md-6">
                    <input type="text" class="form-control" id="lblClaveAcceso" placeholder="Clave de acceso">
                </div>
            </div>
            <div class="row g-3 mb-2">
                <div class="col md-6">
                    <input type="text" class="form-control" id="lblSSDI" placeholder="SSDI">
                </div>
                <div class="col md-6">
                    <input type="text" class="form-control" id="lblIp" placeholder="IP">
                </div>
            </div>
            <div class="mb-2">
                <textarea class="form-control" id="confirm-password" placeholder="Señal" rows="3"></textarea>
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