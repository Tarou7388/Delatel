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
                            <button type="submit" class="btn btn-primary" id="btnAccionAlmacen">Guardar</button>
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
                    <div class="table-responsive" style="height: 350px;">
                        <table class="table table-bordered" id="tablaAlmacenes" width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                </tr>
                            </thead>
                            <tbody>
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

    <section>
        <div class="row">
            <!-- Marca -->
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h4><i class="fas fa-tag me-1"></i> Marca</h4>
                    </div>
                    <div class="card-body">
                        <form action="" id="formMarca">
                            <div class="mb-3">
                                <div class="form-floating">
                                    <input type="text" class="form-control" id="txtMarca" name="txtMarca" placeholder="Marca" required>
                                    <label for="txtMarca">Marca</label>
                                </div>
                            </div>
                            <div class="d-grid gap-2 d-md-flex justify-content-md-start">
                                <button type="submit" class="btn btn-primary" id="btnAccionMarcas">Guardar</button>
                                <button type="reset" class="btn btn-secondary">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Tipo de producto -->
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h4><i class="fas fa-box me-1"></i> Tipo de producto</h4>
                    </div>
                    <div class="card-body">
                        <form action="" id="formTipoPro">
                            <div class="mb-3">
                                <div class="form-floating">
                                    <input type="text" class="form-control" id="txtTipoProducto" name="txtTipoProducto" placeholder="Tipo de producto" required>
                                    <label for="txtTipoProducto">Tipo de producto</label>
                                </div>
                            </div>
                            <div class="d-grid gap-2 d-md-flex justify-content-md-start">
                                <button type="submit" class="btn btn-primary" id="btnAccionTipoProducto">Guardar</button>
                                <button type="reset" class="btn btn-secondary">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Card para las tablas con altura máxima de 250px -->
        <div class="row">
            <!-- Marca Tabla -->
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h4><i class="fas fa-tag me-1"></i> Marca - Tabla</h4>
                    </div>
                    <div class="card-body" style="overflow-y: auto;">
                        <div class="table-responsive" style="height: 510px;">
                            <table class="table table-bordered table-sm" id="tablaMarca" width="100%" cellspacing="0" style="max-height: 250px; overflow-y: auto;">
                                <thead>
                                    <tr>
                                        <th>Marca</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Datos de la tabla -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tipo de Producto Tabla -->
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h4><i class="fas fa-box me-1"></i> Tipo de producto - Tabla</h4>
                    </div>
                    <div class="card-body" style="overflow-y: auto;">
                        <div class="table-responsive" style="height: 510px;">
                            <table class="table table-bordered table-sm" id="tablaTipoProducto" width="100%" cellspacing="0" style="max-height: 250px; overflow-y: auto;">
                                <thead>
                                    <tr>
                                        <th>Tipo de producto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Datos de la tabla -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>




</div>

<?php require_once "../../footer.php"; ?>
<script type="module" src="../../js/Almacenes.js"></script>
</body>

</html>