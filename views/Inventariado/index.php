<?php require_once '../../header.php'; ?>

<div class="container-fluid px-4">
	<h1 class="mt-4">Kardex</h1>

	<div class="card mb-4">
		<div class="card-header">
			<i class="fas fa-table me-1"></i> Complete los datos
		</div>
		<div class="card-body">
			<form action="" id="form-validaciones-kardex" autocomplete="off">
				<!-- primera fila -->
				<div class="row g-2 m-b2">

					<div class="col-md">
						<div class="input-group">
							<div class="form-floating">
								<select name="slcIdproducto" id="idproducto" class="form-select" required>
									<option value="" disabled selected>Seleccione</option>
								</select>
								<label for="slcIdproducto">Tipo Producto</label>
							</div>
						</div>
					</div>

					<div class="col-md">
						<div class="form-floating">
							<input type="number" class="form-control" id="txtStockactual" placeholder="Stock Actual" disabled>
							<label for="txtStockactual">Stock Actual</label>
						</div>
					</div>

					<div class="col-md">
						<div class="form-floating">
							<input type="date" class="form-control" id="txtfecha" placeholder="Fecha" disabled>
							<label for="txtfecha">Fecha</label>
						</div>
					</div>

				</div> <!-- ./primera fila -->

				<!-- segunda fila -->
				<div class="row g-2 mt-2">

					<div class="col-md">
						<div class="form-floating">
							<select name="slcTipomovimiento" id="slcTipomovimiento" class="form-select" required>
								<option value="" disabled selected>Seleccione</option>
								<option value="E">Entrada</option>
								<option value="S">Salida</option>
							</select>
							<label for="slcTipomovimiento">Tipo de Movimiento</label>
						</div>
					</div>

					<div class="col-md">
						<div class="form-floating">
							<input type="number" minlength="0" class="form-control" id="txtCantidad" placeholder="Cantidad" required>
							<label for="txtCantidad">Cantidad</label>
						</div>
					</div>

					<div class="col-md">
						<div class="form-floating">
							<input type="number" minlength="0" class="form-control" id="txtValorunitario" placeholder="Valor Unitario" step="0.01" required disabled>
							<label for="txtValorunitario">Valor Unitario</label>
						</div>
					</div>

				</div> <!-- ./segunda fila -->

				<!-- tercera fila -->
				<div class="row g-2 mt-2">
					<div class="col-md">
						<div class="form-floating">
							<select name="slcMotivo" id="slcMotivo" class="form-select" required>
								<option value="" disabled selected>Seleccione</option>
							</select>
							<label for="slcMotivo">Motivo</label>
						</div>
					</div>

					<div class="col-md">
						<div class="form-floating">
							<select name="slcAlmacen" id="slcAlmacen" class="form-select" required>
								<option value="" disabled selected>Seleccione</option>
							</select>
							<label for="slcAlmacen">Almacen</label>
						</div>
					</div>
				</div> <!-- ./tercera fila -->


				<!-- Botones -->
				<div class="text-end mt-2">
					<button type="submit" id="btnRegistrar" class="btn btn-success">Registrar</button>
					<button type="reset" id="btnCancelar" class="btn btn-secondary">Cancelar</button>
				</div>

			</form>
		</div>
	</div>
</div>

<div class="container-fluid px-4">
	<div class="card mb-4">
		<div class="card-header">
			<i class="fas fa-table me-1"></i> Gestionar Kardex
		</div>
		<div class="card-body">
			<div class="table-responsive">
				<table id="TbKardex" name="TbKardex" class="display">
					<thead>
						<tr>
							<th class="text-center">ID Producto</th>
							<th class="text-center">Almacen</th>
							<th class="text-center">Fecha</th>
							<th class="text-center">Tipo de Operación</th>
							<th class="text-center">Motivo</th>
							<th class="text-center">Cantidad</th>
							<th class="text-center">Saldo Total</th>
							<th class="text-center">Valor Único Histórico</th>
						</tr>
					</thead>
					<tbody>
	
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

<?php require_once "../../footer.php"; ?>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script type="module" src="../../js/kardexDatatable.js"></script>
<script type="module" src="../../js/Kardex.js"></script>


</body>

</html>