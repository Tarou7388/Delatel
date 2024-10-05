<?php require_once "./header.php"; ?>

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
                        <!-- En Construcción... -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<script src="../js/datatables-simple-demo.js"></script>
<?php require_once "./footer.php"; ?>

<script>
    $(document).ready(function() {
        $('#listarActividades').DataTable({
            "paging": false,
            "searching": true,
            "info": false,
            "lengthChange": false
        });
    });
</script>
</body>

</html>