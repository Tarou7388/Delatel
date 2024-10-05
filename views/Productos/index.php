<?php require_once "../../header.php" ?>

<div class="modal fade" id="modalEditarProducto" tabindex="-1" aria-labelledby="modalEditarProductoLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h6 class="modal-title" id="modalEditarProductoLabel">Editar Producto</h6>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="form-editar-producto">
          <input type="hidden" id="txtIdProducto" name="id_producto">

          <div class="form-floating">
            <input type="text" class="form-control" id="slcEditarTipoProducto" name="modelo" placeholder="Tipo Producto" disabled>
            <label for="slcEditarTipoProducto">Tipo Producto</label>
          </div>

          <div class="form-group">
            <div class="form-floating">
              <select class="form-control" id="slcEditarMarca" name="marca" required>
                <option value="" disabled selected>Seleccione Marca</option>
                <option value="Huawei">Huawei</option>
                <option value="Netgear">Netgear</option>
                <option value="ASUS">ASUS</option>
                <option value="TP-Link">TP-Link</option>
                <option value="D-Link">D-Link</option>
                <option value="Zyxel">Zyxel</option>
                <option value="Ubiquiti">Ubiquiti</option>
                <option value="Cisco">Cisco</option>
              </select>
              <label for="slcEditarMarca">Marca</label>
            </div>
          </div>

          <div class="form-group">
            <label for="txtEditarModelo">Modelo</label>
            <input type="text" class="form-control" id="txtEditarModelo" name="modelo" required>
          </div>

          <div class="row">
            <div class="form-group col-6">
              <label for="txtEditarPrecioActual">Precio</label>
              <input type="number" class="form-control" id="txtEditarPrecioActual" name="precio_actual" step="0.01" required>
            </div>
            <div class="form-group col-6">
              <label for="txtEditarCodigoBarras">Codigo Barras</label>
              <input type="text" class="form-control" id="txtEditarCodigoBarras" name="codigo_barra" required>
            </div>
          </div>
          <button type="submit" class="btn btn-success mt-3">Guardar Cambios</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- Formulario de Registro -->
<div class="container-fluid px-4">
  <h1 class="mt-4">Productos</h1>

  <div class="card mb-4">
    <div class="card-header">
      <i class="fas fa-table me-1"></i> Agregar un Nuevo Producto
    </div>
    <div class="card-body">
      <form action="" method="" id="form-productos">

        <div class="row g-2 mb-2">
        
          <div class="col-md">
            <div class="form-floating">
              <select class="form-select" id="slcTipoProducto" name="slcTipoProducto" required>
                <option value="" disabled selected>Seleccione Producto</option>
                <option value="Router">Router</option>
                <option value="Triplexor">Triplexor</option>
                <option value="Modem">Módem</option>
                <option value="Repetidor">Repetidor</option>
              </select>
              <label for="slcTipoProducto">Tipo Producto</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <select class="form-select" id="slcMarca" name="slcMarca" required>
                <option value="" disabled selected>Seleccione Marca</option>
                <option value="Huawei">Huawei</option>
                <option value="Netgear">Netgear</option>
                <option value="ASUS">ASUS</option>
                <option value="TP-Link">TP-Link</option>
                <option value="D-Link">D-Link</option>
                <option value="Zyxel">Zyxel</option>
                <option value="Ubiquiti">Ubiquiti</option>
                <option value="Cisco">Cisco</option>
              </select>
              <label for="slcMarca">Marca</label>
            </div>
          </div>
        </div>

        <div class="row g-3 mb-3">

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtModelo" name="txtModelo" placeholder="Modelo" required>
              <label for="txtModelo">Modelo</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtPrecioActual" name="txtPrecioActual" placeholder="Precio" step="0.01" required>
              <label for="txtPrecioActual">Precio</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCodigoBarras" name="txtCodigoBarras" placeholder="Código de Barras" required>
              <label for="txtCodigoBarras">Código de Barras</label>
            </div>
          </div>

        </div>
        <div class="text-end mt-2">
          <button type="submit" class="btn btn-success">Registrar</button>
          <button type="reset" class="btn btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Tabla de Registros -->
  <div class="card mt-4">
    <div class="card-header">
      <i class="fas fa-table me-1"></i> Administrar Productos
    </div>
    <div class="card-body">
      <table id="tblProductos" name="tblProductos" class="display">
        <thead>
          <tr>
            <th class="text-center">Marca</th>
            <th class="text-center">Tipo de Producto</th>
            <th class="text-center">Modelo</th>
            <th class="text-center">Precio Actual</th>
            <th class="text-center">Código de Barra</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</div>





<?php require_once "../../footer.php"; ?>

<script type="module" src="../../js/Productos.js"></script>
<script src="../../js/ProductosDatatable.js"></script>

</body>

</html>