<?php require_once "../header.php"; ?>

<div class="container-fluid px-4">
    <h1 class="mt-4">Actividades</h1>

    <ol class="breadcrumb mb-4">
        <li class="breadcrumb-item active">Registro de Actividades para los Empleados</li>
    </ol>

    <div class="card mt-3">
        <div class="card-header">
            <i class="fas fa-table me-1"></i>
            Registro de datos
        </div>

        <div class="card-body">
            <div class="table-responsive">
                <table id="listarActividades" class="table table-striped">
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>Descripción de Actividad</th>
                            <th>Nombre de Usuario</th>
                            <th>Fecha de Inicio</th>
                            <th>Fecha de Fin</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Ayuda con Registro de Llamadas Soporte</td>
                            <td>Maria71</td>
                            <td>01/01/24</td>
                            <td>01/01/24</td>
                            <td>
                                <button class="btn btn-sm btn-primary"><i class="fa-solid fa-pen"></i></button>
                                <button class="btn btn-sm btn-danger"><i class="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Actualizar registro de cliente</td>
                            <td>Yazuri69</td>
                            <td>01/01/24</td>
                            <td>01/01/24</td>
                            <td>
                                <button class="btn btn-sm btn-primary"><i class="fa-solid fa-pen"></i></button>
                                <button class="btn btn-sm btn-danger"><i class="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                        <!-- Más filas de ejemplo -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<script src="../js/datable-Actividades.js"></script>
<?php require_once "../footer.php"; ?>

</body>

</html>