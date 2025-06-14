<?php require_once '../../header.php'; ?>
<?php $host = $_ENV['HOST']; ?>

<link rel="stylesheet" href="../../css/diseñoGlobal.css" />

<style>
    @media (max-width: 767.98px) {
        .d-none {
            display: none !important;
        }
    }

    @media (min-width: 768px) {
        .d-md-table-cell {
            display: table-cell !important;
        }
    }
</style>

<div class="container-fluid px-4">
    <h2 class="mt-4">Control de Pendientes de Soporte</h2>
    <div class="container-fluid px-4">

        <!-- Tabla de Contratos Pendientes -->
        <div class="card mt-3">
            <div class="card-header">
                Contratos Pendientes
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped" id="tblGestionPendientes">
                        <thead>
                            <tr>
                                <th class="text-center">Cliente</th>
                                <th class="text-center d-none d-md-table-cell">DNI</th>
                                <th class="text-center d-none d-md-table-cell">Fecha programada</th>
                                <th class="text-center d-none d-md-table-cell">Fecha Completada</th>
                                <th class="text-center d-none d-md-table-cell">Fecha de Creación</th>
                                <th class="text-center d-none d-md-table-cell">Prioridad</th>
                                <th class="text-center">Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once "../../footer.php"; ?>
</body>
<script src="../../js/soporteJs/ControlSoporte.js" type="module"></script>

</html>