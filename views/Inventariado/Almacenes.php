<?php require_once "../../header.php"; ?>
<?php $host = $_ENV['HOST']; ?>

<link rel="stylesheet" href="../../css/diseñoGlobal.css" />

<div class="container-fluid px-4">
    <h1 class="mt-4">Almacenes</h1>

    <div class="row">
        <!-- Columna del formulario y tabla -->
        <div class="col-md-6">
            <div class="card mb-4">
                <div class="card-header">
                    <i class="fas fa-warehouse me-1"></i> Almacén - Formulario
                </div>
                <div class="card-body">
                    <form id="formAlmacen" method="POST" action="guardar_almacen.php">
                        <!-- Nombre del almacén -->
                        <div class="mb-3">
                            <div class="form-floating">
                                <input type="text" class="form-control" id="txtNombreAlmacen" name="txtNombreAlmacen" placeholder="Nombre del almacén" required>
                                <label for="txtNombreAlmacen">Nombre del almacén</label>
                            </div>
                        </div>

                        <!-- Ubicación -->
                        <div class="mb-3">
                            <div class="form-floating">
                                <input type="text" class="form-control" id="txtUbicación" name="txtUbicación" placeholder="Ubicación" required>
                                <label for="txtUbicación">Ubicación</label>
                            </div>
                        </div>

                        <!-- Coordenada -->
                        <div class="mb-3">
                            <div class="form-floating">
                                <input type="text" class="form-control" id="CoordenadaModel" name="CoordenadaModel" placeholder="CoordenadaModel" required>
                                <label for="CoordenadaModel">Coordenada</label>
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

            <!-- Tabla de almacenes -->
            <div class="card mb-4">
                <div class="card-header">
                    <i class="fas fa-table me-1"></i> Lista de Almacenes
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Ubicación</th>
                                    <th>Coordenadas</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Almacén 1</td>
                                    <td>Ubicación 1</td>
                                    <td>-13.417793, -76.132671</td>
                                </tr>
                                <tr>
                                    <td>Almacén 2</td>
                                    <td>Ubicación 2</td>
                                    <td>-13.418000, -76.133000</td>
                                </tr>
                                <!-- Puedes agregar más filas dinámicamente desde PHP o JavaScript -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Columna del mapa -->
        <div class="col-md-6">
            <div class="card mb-4">
                <div class="card-header">
                    <i class="fas fa-map-marked-alt me-1"></i> Mapa de Almacenes
                </div>
                <div class="card-body">
                    <div id="map" style="height: 520px; width: 100%;"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once "../../footer.php"; ?>
<script type="module" src="../../js/Almacenes.js"></script>
</body>

</html>