<?php require_once "../header.php"; ?>

<div class="container-fluid px-4">
    <h1 class="mt-4">Control Roles</h1>

    <div class="card">
        <div class="card-header">Gestionar Roles y Permisos</div>
        <div class="card-body">
            <form>
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <div class="form-group">
                            <label for="nombreRol">Nombre del Rol:</label>
                            <input type="text" class="form-control" id="nombreRol" name="nombreRol" required>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <div class="form-group">
                            <label for="permisosRol">Permisos del Rol:</label>
                            <select id="permisosRol" class="form-control" required>
                                <option value="">Permisos</option>
                                <option value="1">Permiso 1</option>
                                <option value="2">Permiso 2</option>
                                <option value="3">Permiso 3</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">Agregar</button>
                            <button type="button" class="btn btn-secondary">Instalar</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <table id="myTable" class="display">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Edad</th>
                <th>Ciudad</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Ana</td>
                <td>29</td>
                <td>Madrid</td>
            </tr>
            <tr>
                <td>Juan</td>
                <td>35</td>
                <td>Barcelona</td>
            </tr>
            <tr>
                <td>Laura</td>
                <td>24</td>
                <td>Sevilla</td>
            </tr>
        </tbody>
    </table>
</div>



<?php require_once "../footer.php"; ?>
</body>


<script>
    $(document).ready(function() {
        $('#myTable').DataTable(); // Inicialización correcta de DataTable
    });
</script>

</html>