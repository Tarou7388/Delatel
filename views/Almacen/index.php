<?php require_once "../../header.php" ?>
<?php $host = $_ENV['HOST']; ?>

<div class="container-fluid px-4">
    <h1 class="mt-4">Almacenes</h1>

    <div class="row">
        <!-- Columna de la izquierda con 4 inputs y 2 botones -->
        <div class="col-md-6">
            <div class="card mb-4">
                <div class="card-header">
                    <i class="fas fa-warehouse me-1"></i> Almacén - Formulario
                </div>
                <div class="card-body">
                    <form>
                        <div class="mb-3">
                            <div class="form-floating">
                                <input type="text" class="form-control" id="input1" placeholder="Nombre del almacén">
                                <label for="input1">Nombre del almacén</label>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="form-floating">
                                <input type="text" class="form-control" id="input2" placeholder="Ubicación">
                                <label for="input2">Ubicación</label>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="form-floating">
                                <input type="text" class="form-control" id="input3" placeholder="Capacidad">
                                <label for="input3">Capacidad</label>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="form-floating">
                                <input type="text" class="form-control" id="input4" placeholder="Encargado">
                                <label for="input4">Encargado</label>
                            </div>
                        </div>

                        <!-- Botones -->
                        <div class="d-grid gap-2 d-md-flex justify-content-md-start">
                            <button type="submit" class="btn btn-primary">Guardar</button>
                            <button type="reset" class="btn btn-secondary">Limpiar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Columna de la derecha (vacía por ahora) -->
        <div class="col-md-6">
            <div class="card mb-4">
                <div class="card-header">
                    <i class="fas fa-info-circle me-1"></i> Información Adicional
                </div>
                <div class="card-body">
                    <!-- Aquí puedes agregar contenido adicional en el futuro -->
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once "../../footer.php"; ?>
</body>

</html>