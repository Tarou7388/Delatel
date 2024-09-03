<?php require_once "../../header.php" ?>

<div class="container-fluid px-4">
    <h2 class="mb-4">Productos</h2>

    <div class="card">
        <div class="card-header">Agregar Producto</div>
        <div class="card-body">
            <form action="" method="" id="form-productos">
                <div class="form-group">
                    <label for="slcTipoProducto">Tipo Producto:</label>
                    <select class="form-control" id="slcTipoProducto" name="slcTipoProducto" required>
                        <option value="Router">Router</option>
                        <option value="Triplexor">Triplexor</option>
                        <option value="Modem">Módem</option>
                        <option value="Repetidor">Repetidor</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="slcMarca">Marca:</label>
                    <select class="form-control" id="slcMarca" name="slcMarca" required>
                        <option value="Huawei">Huawei</option>
                        <option value="Netgear">Netgear</option>
                        <option value="ASUS">ASUS</option>
                        <option value="TP-Link">TP-Link</option>
                        <option value="D-Link">D-Link</option>
                        <option value="Zyxel">Zyxel</option>
                        <option value="Ubiquiti">Ubiquiti</option>
                        <option value="Cisco">Cisco</option>
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
                <button type="submit" class="btn btn-primary mt-3">Agregar Producto</button>
            </form>
        </div>
    </div>
</div>

<div class="container-fluid d-flex justify-content-center py-4">
    <div class="card w-100" style="max-width: 90%;">
        <div class="card-header">Gestionar Productos</div>
        <div class="card-body">
            <table id="TbProductos" name="TbProductos" class="display">
                <thead>
                    <tr>
                        <th>Marca</th>
                        <th>Tipo de Producto</th>
                        <th>Modelo</th>
                        <th>Precio Actual</th>
                        <th>Código de Barra</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
</div>

<div class="modal fade" id="modalEditarProducto" tabindex="-1" aria-labelledby="modalEditarProductoLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalEditarProductoLabel">Editar Producto</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="form-editar-producto">
                    <input type="hidden" id="txtIdProducto" name="id_producto">

                    <div class="form-group">
                        <label for="slcEditarTipoProducto">Tipo Producto:</label>
                        <input type="text" class="form-control" id="slcEditarTipoProducto" name="modelo" disabled>
                    </div>

                    <div class="form-group">
                        <label for="slcEditarMarca">Marca:</label>
                        <select class="form-control" id="slcEditarMarca" name="marca" required>
                            <option value="Huawei">Huawei</option>
                            <option value="Netgear">Netgear</option>
                            <option value="ASUS">ASUS</option>
                            <option value="TP-Link">TP-Link</option>
                            <option value="D-Link">D-Link</option>
                            <option value="Zyxel">Zyxel</option>
                            <option value="Ubiquiti">Ubiquiti</option>
                            <option value="Cisco">Cisco</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="txtEditarModelo">Modelo:</label>
                        <input type="text" class="form-control" id="txtEditarModelo" name="modelo" required>
                    </div>

                    <div class="row">
                        <div class="form-group col-6">
                            <label for="txtEditarPrecioActual">Precio:</label>
                            <input type="number" class="form-control" id="txtEditarPrecioActual" name="precio_actual" step="0.01" required>
                        </div>
                        <div class="form-group col-6">
                            <label for="txtEditarCodigoBarras">Codigo Barras:</label>
                            <input type="text" class="form-control" id="txtEditarCodigoBarras" name="codigo_barra" required>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary mt-3">Guardar Cambios</button>
                </form>
            </div>
        </div>
    </div>
</div>

<?php require_once "../../footer.php"; ?>

<script type="module" src="../../js/Productos.js"></script>
<script src="../../js/ProductosDatatable.js"></script>

</body>

</html>