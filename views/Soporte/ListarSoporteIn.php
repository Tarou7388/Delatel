<?php require_once '../../header.php'; ?>
<div class="container-fluid px-4">
  <h1 class="mt-4">Fichas a Completar</h1>

  <div class="card mb-4">
    <div class="card-header">
      <H4><i class="fas fa-table me-1"></i> Listado de Fichas a terminar</H4>
    </div>
    <div class="card-body">
      <table id="tblSoporteIncompleto" class="display">
        <thead>
          <tr>
            <th class="text-center">prioridad</th>
            <th class="text-center">tipo_soporte</th>
            <th class="text-center">nombre_cliente</th>
            <th class="text-center">Tecnico Cargo</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>

</div>


<?php require_once "../../footer.php"; ?>
</body>

<script type="module" src="../../js/ListarSoporte.js"></script>

</html>