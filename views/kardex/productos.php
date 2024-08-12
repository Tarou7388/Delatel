<?php require_once "../../header.php" ?>

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


<?php require_once "../../footer.php"; ?>

<script>
    document.addEventListener("DOMContentLoaded", () => {

        const valtip = document.getElementById("idtipoproducto");
        const valmr = document.getElementById("idmarca");

        function cargarProductos() {
            fetch(`../../controllers/Producto.controller.php?operacion=getAll`)
                .then(response => response.json())
                .then(data => {
                    const listaProductos = document.getElementById('lista-productos');
                    console.log(data);
                    listaProductos.innerHTML = '';
                    data.forEach((producto, index) => {
                        const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${producto.marcas}</td>
                        <td>${producto.tipoproducto}</td>
                        <td>${producto.descripcion}</td>
                        <td>${producto.modelo}</td>
                    </tr>
                `;
                        listaProductos.innerHTML += row;
                    });
                })
        };

        (() => {
            fetch(`../../controllers/Marca.controller.php?operacion=getAll`)
                .then(response => response.json())
                .then(data => {
                    const selectMarca = document.getElementById('idmarca');
                    data.forEach(marca => {
                        const option = document.createElement('option');
                        option.value = marca.idmarcas;
                        option.text = marca.marcas;
                        selectMarca.appendChild(option);
                    });
                })
        })();

        (() => {
            fetch(`../../controllers/Tipoproducto.controller.php?operacion=getAll`)
                .then(response => response.json())
                .then(data => {
                    const selectMarca = document.getElementById('idtipoproducto');
                    data.forEach(marca => {
                        const option = document.createElement('option');
                        option.value = marca.idtipoproducto;
                        option.text = marca.tipoproducto;
                        selectMarca.appendChild(option);
                    });
                })
        })();

        document.getElementById("form-productos").addEventListener("submit", (event) => {
            event.preventDefault();
            console.log(valtip.value);
            console.log(valmr.value);

            const params = new FormData();
            params.append('operacion', 'addpr');
            params.append('descripcion', document.querySelector("#descripcion").value);
            params.append('modelo', document.querySelector("#modelo").value);
            params.append('idtipoproducto', valtip.value);
            params.append('idmarca', valmr.value);

            fetch('../../controllers/Producto.controller.php', {
                    method: 'POST',
                    body: params
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    cargarProductos();
                })
        });

        cargarProductos();

    })
</script>

</body>

</html>