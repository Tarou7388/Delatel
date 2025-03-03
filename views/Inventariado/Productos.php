<?php require_once "../../header.php" ?>

<link rel="stylesheet" href="../../css/diseñoGlobal.css" />

<!-- Modal de Actualización -->
<div class="modal fade" id="modalEditarProducto" tabindex="-1" aria-labelledby="modalEditarProductoLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h6 class="modal-title" id="modalEditarProductoLabel">Editar Producto</h6>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="form-editar-producto">

          <div class="form-floating mb-2">
            <select class="form-select" id="slcEditarTipoProducto" name="marca" required>
              <option disabled selected>Seleccione Tipo Producto</option>
            </select>
            <label for="slcEditarTipoProducto">Tipo de Producto</label>
          </div>

          <div class="form-group">
            <div class="form-floating mb-2">
              <select class="form-select" id="slcEditarMarca" name="marca" required>
                <option disabled selected>Seleccione Marca</option>
              </select>
              <label for="slcEditarMarca">Marca</label>
            </div>
          </div>

          <div class="form-group">
            <div class="form-floating mb-2">
              <select class="form-select" id="slcUnidadEditarMedida" name="marca" required>
                <option disabled selected>Seleccionar Unidad</option>
              </select>
              <label for="slcUnidadEditarMedida">Unidad</label>
            </div>
          </div>

          <div class="form-floating mb-2">
            <input type="text" class="form-control" id="txtEditarModelo" name="modelo" placeholder="Modelo" required>
            <label for="txtEditarModelo">Modelo</label>
          </div>

          <div class="row">
            <div class="col-6">
              <div class="form-floating mb-2">
                <input type="number" class="form-control" id="txtEditarPrecioActual" placeholder="Precio" name="precio_actual" step="0.01" required>
                <label for="txtEditarPrecioActual">Precio</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-2">
                <input type="text" class="form-control" id="txtEditarCodigoBarras" placeholder="Código de Barras" name="codigo_barra" required>
                <label for="txtEditarCodigoBarras">Código Barras</label>
              </div>
            </div>
          </div>
          <div class="text-end mt-2">
            <button type="submit" class="btn btn-success">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
<!-- Modal de registrar tipo de productos -->
<div class="modal fade" id="RegistrarTipoProductoModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">Registrar Tipo de Productos</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form action="" id="formRegistrarTipoProductos">
          <div class="form-floating mb-2">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtTipoProductoModal" name="txtTipoProducto" placeholder="Tipo de Producto">
                <label for="txtTipoProducto">Tipo de Producto</label>
              </div>
              <button type="submit" class="btn btn-primary" id="btnRegistrarTipoProductoModal">Registrar</button>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal de marcas -->
<div class="modal fade" id="RegistrarMarcasModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">Registrar Marcas</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form action="" id="formRegistrarMarcas">
          <div class="form-floating mb-2">
            <div class="input-group">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtMarcaModal" name="txtMarca" placeholder="Marca">
                <label for="txtMarca">Marca</label>
              </div>
              <button type="submit" class="btn btn-primary" id="btnRegistrarMarcaModal">Registrar</button>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
            <div class="input-group">
              <div class="form-floating">
                <select class="form-select" id="slcTipoProducto" name="slcTipoProducto" required>
                  <option value="" disabled selected>Seleccione Producto</option>
                </select>
                <label for="slcTipoProducto">Tipo Producto</label>
              </div>
              <button class="btn btn-outline-primary" type="button" id="btnRegistrarProducto" data-bs-toggle="modal" data-bs-target="#RegistrarTipoProductoModal">Registrar</button>
            </div>
          </div>

          <div class="col-md">
            <div class="input-group">
              <div class="form-floating">
                <select class="form-select" id="slcMarca" name="slcMarca" required>
                  <option value="" disabled selected>Seleccione Marca</option>
                </select>
                <label for="slcMarca">Marca</label>
              </div>
              <button class="btn btn-outline-primary" type="button" id="btnRegistrarProducto" data-bs-toggle="modal" data-bs-target="#RegistrarMarcasModal">Registrar</button>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <select class="form-select" id="slcUnidadMedida" name="slcUnidadMedida" required>
                <option value="" disabled selected>Seleccione Unidad</option>
              </select>
              <label for="slcUnidadMedida">Unidades</label>
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
              <input type="text" class="form-control" id="txtPrecioActual" name="txtPrecioActual" placeholder="Precio" step="0.01" required>
              <label for="txtPrecioActual">Precio</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtCodigoBarras" name="txtCodigoBarras" placeholder="Código de Barras" required>
              <label for="txtCodigoBarras">MAC</label>
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
</div>

<div class="container-fluid px-4">
  <!-- Tabla de Registros -->
  <div class="card mt-3">
    <div class="card-header">
      <i class="fas fa-table me-1"></i> Administrar Productos
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table id="tblProductos" name="tblProductos" class="table table-striped">
          <thead>
            <tr>
              <th class="text-center">Marca</th>
              <th class="text-center">Tipo de Producto</th>
              <th class="text-center">Modelo</th>
              <th class="text-center">Unidad de Medida</th>
              <th class="text-center">Precio Actual</th>
              <th class="text-center">MAC</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<?php require_once "../../footer.php"; ?>

<script type="module" src="../../js/Productos.js"></script>
<script type="module" src="../../js/productosDatatable.js"></script>


</body>

</html>