<?php require_once '../header.php'; ?>

<div class="container-fluid px-4">
    <h1 class="mt-4">Kardex</h1>
    <ol class="breadcrumb mb-4">
        <li class="breadcrumb-item active">Tipos de Movimientos</li>
    </ol>
    <div class="card mb-4">
        <div class="card-header">
            Complete los datos
        </div>
        <div class="card-body">
            <form action="" id="form-validaciones-kardex" autocomplete="off">
                <!-- primera fila -->
                <div class="row g-2 m-b2">

                    <div class="col-md">
                        <div class="input-group">
                            <div class="form-floating">
                                <select name="slcIdproducto" id="idproducto" class="form-select" required>
                                    <option value="">Seleccione</option>
                                </select>
                                <label for="slcIdproducto">Tipo Producto</label>
                            </div>
                        </div>
                    </div>

                    <div class="col-md">
                        <div class="form-floating">
                            <input type="number" class="form-control" id="txtStockactual" disabled>
                            <label for="txtStockactual">Stock Actual</label>
                        </div>
                    </div>

                    <div class="col-md">
                        <div class="form-floating">
                            <input type="date" class="form-control" id="txtfecha" disabled>
                            <label for="txtfecha">Fecha</label>
                        </div>
                    </div>

                </div> <!-- ./primera fila -->

                <!-- segunda fila -->
                <div class="row g-2 mt-2">

                    <div class="col-md">
                        <div class="form-floating">
                            <select name="slcTipomovimiento" id="slcTipomovimiento" class="form-select" required>
                                <option value="">Seleccione</option>
                                <option value="ENTRADA">Entrada</option>
                                <option value="SALIDA">Salida</option>
                            </select>
                            <label for="slcTipomovimiento">Tipo de Movimiento</label>
                        </div>
                    </div>

                    <div class="col-md">
                        <div class="form-floating">
                            <input type="number" minlength="0" class="form-control" id="txtCantidad" required>
                            <label for="txtCantidad">Cantidad</label>
                        </div>
                    </div>

                    <div class="col-md">
                        <div class="form-floating">
                            <input type="number" minlength="0" class="form-control" id="txtValorunitario" step="0.01" required disabled>
                            <label for="txtValorunitario">Valor Unitario</label>
                        </div>
                    </div>

                </div> <!-- ./segunda fila -->

                <!-- tercera fila -->
                <div class="row g-2 mt-2">
                    <div class="col-md">
                        <div class="form-floating">
                        <select name="txtaMotivo" id="txtaMotivo" class="form-select" required>
                                <option value="">Seleccione</option>
                                <option value="Nuevas Adquisiciones">Nuevas Adquisiciones</option>
                                <option value="Ventas">Ventas</option>
                                <option value="Daños">Daños</option>
                            </select>
                            <label for="txtaMotivo">Motivo</label>
                        </div>
                    </div>
                </div> <!-- ./tercera fila -->

                <!-- Botones -->
                <div class="text-end mt-2">
                    <button type="submit" id="btnRegistrar" class="btn btn-primary btn-sm">Actualizar Kardex</button>
                    <button type="reset" id="btnCancelar" class="btn btn-secondary btn-sm">Cancelar Proceso</button>
                </div>

            </form>
        </div>
    </div>
</div>

<div class="container-fluid d-flex justify-content-center py-4">
    <div class="card w-100" style="max-width: 90%;">
        <div class="card-header">Gestionar Kardex</div>
        <div class="card-body">
            <table id="TbKardex" name="TbKardex" class="display">
                <thead>
                    <tr>
                        <th>ID Producto</th>
                        <th>Fecha</th>
                        <th>Tipo de Operación</th>
                        <th>Motivo</th>
                        <th>Cantidad</th>
                        <th>Saldo Total</th>
                        <th>Valor Único Histórico</th>
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once "../footer.php"; ?>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="../js/Kardex.js"></script>
<script src="../js/kardexDatatable.js"></script>

</body>

</html>