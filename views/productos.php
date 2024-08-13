<?php require_once "../header.php" ?>

<div class="container-fluid px-4">
    <h2 class="mb-4">Productos</h2>
    <!-- Formulario para agregar producto -->
    <div class="card">
        <div class="card-header">Agregar Producto</div>
        <div class="card-body">
            <form action="" method="" id="form-productos">
                <div class="form-group">
                    <label for="Nproducto">Nombre de producto:</label>
                    <input type="text" class="form-control" id="Nproducto" name="Nproducto" required>
                </div>
                <div class="form-group">
                    <label for="tipoproducto">Tipo de Producto:</label>
                    <select class="form-control" id="idtipoproducto" name="idtipoproducto">
                        <!-- Aquí se cargarán las opciones de tipo de producto -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="idmarca">Marca:</label>
                    <select class="form-control" id="idmarca" name="idmarca">
                        <!-- Aquí se cargarán las opciones de marca -->
                    </select>
                </div>
                <div class="form-group col-3">
                    <label for="Precio">Precio:</label>
                    <input type="number" class="form-control" id="Precio" name="Precio" required>
                </div>
                <button type="submit" class="btn btn-primary mt-3">Agregar Producto</button>
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
                        <th>Marca</th>
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