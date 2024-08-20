<?php require_once '../header.php'; ?>
<div class="container">
  <div class="card mt-5">
    <div class="card-header">
      <h4>Listar Clientes</h4>
    </div>
    <div class="card-body">
      <label for="">Buscar Cliente</label>
      <div class="input-group mt-2">
        <input type="number" placeholder="Número de identificador" class="form-control" id="txtNrodocumento" autofocus required>
        <button class="input-group-text btn btn-secondary" type="button" id="btnNrodocumento"><i class="fa-solid fa-magnifying-glass"></i></button>
      </div>
      <table id="listarCliente" class="table table-striped mt-4">
        <thead>
          <tr>
            <th>N°</th>
            <th>Cliente</th>
            <th>Contratos</th>
            <th>Tarifario</th>
            <th>Dirección</th>
            <th>Referencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>persona 1</td>
            <td>contrato 1</td>
            <td>tarifario 1</td>
            <td>direccion 1</td>
            <td>referencia 1</td>
            <td><button class="btn btn-primary">editar</button></td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>

</div>
<script src="../js/clientes-datatable.js"></script>
<?php require_once '../footer.php'; ?>