<?php require_once "../header.php" ?>

<div class="container-fluid px-4">
    <h2 class="mb-4">Productos</h2>
    <!-- Formulario para agregar producto -->
    <div class="card">
        <div class="card-header">Agregar Producto</div>
        <div class="card-body">
            <form action="" method="" id="form-productos">
                
                <div class="form-group">
                    <label for="slcTipoProducto">Tipo Producto:</label>
                    <select class="form-control" id="slcTipoProducto" name="slcTipoProducto" required>
                        <option value="Router">Router</option>
                        <option value="Triplexor">Triplexor</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="slcMarca">Marca:</label>
                    <select class="form-control" id="slcMarca" name="slcMarca" required>
                        <option value="Huawei">Huawei</option>
                        <option value="Netgear">Netgear</option>
                        <option value="ASUS">ASUS</option>
                        <option value="SérieECOFLEX10">Série ECOFLEX10.</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="txtModelo">Modelo:</label>
                    <input type="text" class="form-control" id="txtModelo" name="txtModelo" required>
                </div>

                <div class="row">
                    <div class="form-group col-3">
                        <label for="txtPrecioActual">Precio:</label>
                        <input type="number" class="form-control" id="txtPrecioActual" name="txtPrecioActual" step="0.01" required>
                    </div>
                    <div class="form-group col-3">
                        <label for="txtCodigoBarras">Codigo Barras:</label>
                        <input type="text" class="form-control" id="txtCodigoBarras" name="txtCodigoBarras" required>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary mt-3">Agregar Codigo</button>
            </form>
        </div>
    </div>
</div>

<!-- Tabla de productos 
<div class="container mt-5">
    <div class="card mt-5">
        <div class="card-header">Lista de Productos</div>
        <div class="card-body">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>slcMarca</th>
                        <th>Tipo de Producto</th>
                        <th>Descripción</th>
                        <th>Modelo</th>
                    </tr>
                </thead>
                <tbody id="lista-productos">
                  Aquí se cargarán los productos 
                </tbody>
            </table>
        </div>
    </div>

</div>
-->


<?php require_once "../footer.php"; ?>

<script src="../js/Productos.js"></script>

</body>

</html>