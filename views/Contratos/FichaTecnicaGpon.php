<?php require_once "../../header.php"; ?>
<?php
$idContrato = $_GET['idContrato'];
?>
<link rel="stylesheet" href="../../css/gpon.css">

<div class="modal fade" id="mdlSintotizador" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered w-50">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Añadir Sintotizador</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="mdlSintotizadorBody">
        <!-- Aquí se agregarán las cartas -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" id="btnAñadirSintotizador" class="btn btn-primary">Añadir</button>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="mdlRepetidor" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered w-50">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Añadir Repetidor</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="mdlRepetidorBody">
        <div class="mb-2">
          <div class="form-floating">
            <input type="text" class="form-control" id="txtSsidRepetidor" placeholder="SSID">
            <label for="lblSsid">SSID</label>
          </div>
        </div>
        <div class="mb-2">
          <div class="form-floating">
            <input type="text" class="form-control" id="txtContraseniaRepetidor" placeholder="Contraseña">
            <label for="lblContraseña">Contraseña</label>
          </div>
        </div>
        <div class="mb-2">
          <div class="input-group">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtMarcaModeloRepetidor" placeholder="Marca - Modelo">
              <label for="lblMarcaModeloRepetidor">Marca - Modelo</label>
            </div>
            <button class="btn btn-outline-primary" type="button" id="btnEscanearRepetidor">Escanear</button>
          </div>
        </div>
        <div class="mb-2">
          <div class="form-floating">
            <input type="text" class="form-control" id="txtSerieRepetidor" placeholder="Serie">
            <label for="lblSerie">Serie</label>
          </div>
        </div>
        <div class="mb-2">
          <div class="form-floating">
            <input type="text" class="form-control" id="txtIpRepetidor" placeholder="IP">
            <label for="lblIpRepetidor">IP</label>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" id="btnAñadirRepetidor" class="btn btn-primary">Guardar</button>
      </div>
    </div>
  </div>
</div>

<div class="container-fluid px-4">

  <div class="form-container mt-3">

    <h1 class="mt-4">Formulario de Registro de Ficha Técnica GPON</h1>

    <div class="row g-2 mb-2 justify-content-end">
      <div class="col-sm-1">
        <input type="text" class="form-control" id="txtNumFicha" placeholder="N°" disabled>
      </div>
      <div class="col-sm-2">
        <input type="date" class="form-control text-center" id="txtFecha" placeholder="Fecha" disabled>
      </div>
    </div>

    <form>
      <div class="conteiner">
        <div class="card mb-4">
          <div class="card-header">
            <h6 class="card-title">Fibra Óptica</h6>
          </div>
          <div class="card-body">
            <label class="form-label">Datos del servicio</label>

            <div class="row g-3 mb-2">
              <div class="col md-6">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtUsuario" placeholder="Usuario" disabled=true>
                  <label for="lblUsuario">Usuario</label>
                </div>
              </div>
              <div class="col md-6">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtClaveAcceso" disabled=true placeholder="Clave de acceso"> <!-- Crear de manera automatica -->
                  <label for="lblClaveAcceso">Clave de Acceso</label>
                </div>
              </div>
            </div>
            <div class="row g-3 mb-2">
              <div class="col md-9">
                <div class="form-floating">
                  <input type="text" class="form-control" disabled=true id="txtPlan" placeholder="Plan">
                  <label for="lblPlan">Plan</label>
                </div>
              </div>
              <div class="col md-3">
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtPotenciaFibra" placeholder="Potencia">
                  <label for="lblPotenciaFibra">Potencia</label>
                </div>
              </div>
            </div>
            <label class="form-label mt-2">Datos del Modén</label>
            <div class="row g-3 mb-2">
              <div class="col md-6">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtSsdi" placeholder="SSDI">
                  <label for="lblSsdi">SSDI</label>
                </div>
              </div>
              <div class="col md-6">
                <div class="form-floating">
                  <input type="text" class="form-control" id="txtSeguridad" placeholder="Contraseña">
                  <label for="lblSeguridad">Seguridad</label>
                </div>
              </div>
            </div>
            <div class="mb-2">
              <div class="input-group">
                <div class="form-floating flex-fill">
                  <input type="text" class="form-control" id="txtMarcaModelo" placeholder="Marca - Modelo">
                  <label for="lblMarcaModelo">Marca - Modelo</label>
                </div>
                <button class="btn btn-outline-primary" type="button" id="btnEscanearModen">Escanear</button>
              </div>
            </div>
            <div class="mb-2">
              <div class="form-floating">
                <input type="text" class="form-control" id="txtSerieModen" placeholder="Serie">
                <label for="lblSerie">Serie</label>
              </div>
            </div>
            <div class="row g-3 mb-2">
              <div class="col md-6">
                <div class="form-floating">
                  <select type="text" class="form-select" id="slcBanda" placeholder="Banda">
                    <option value="2G">2G</option>
                    <option value="5G" selected>5G</option>
                    <option value="2G,5G">5G-2G</option>
                  </select>
                  <label for="">Banda</label>
                </div>
              </div>
              <div class="col md-6">
                <div class="form-floating">
                  <input type="number" class="form-control" id="txtAntenas" placeholder="Antena#">
                  <label for="lblAntena">N°Antena</label>
                </div>
              </div>
              <div class="col md-6 form-check form-switch d-flex align-items-center">
                <input class="form-check-input" type="checkbox" id="chkCatv">
                <label class="form-check-label" for="chkCatv">CATV</label>
              </div>
              <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#mdlRepetidor">
                Añadir Repetidor
              </button>
              <div id="cardContainer" class="container mt-4" hidden=true>
                <div class="row" id="cardsRow">
                  <!-- Aquí se añadirán las cards -->
                </div>
                <button class="btn btn-danger" type="button" id="eliminarRepetidor">Eliminar</button>
              </div>
              <div class="mt-4">
                <div class="form-floating">
                  <textarea type="text" class="form-control" id="txtaDetallesModen" placeholder="Detalles"></textarea>
                  <label for="lblDetalle">Detalles</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>


<div class="container-fluid px-4" id="contenidoCable">
  <!-- Card: Cable -->
  <div class="conteiner">
    <div class="card mb-4">
      <div class="card-header">
        <h6 class="card-title">Cable</h6>
      </div>
      <div class="card-body">
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" id="txtPlanCable" disabled placeholder="Plan">
              <label for="lblPlanCable">Plan</label>
            </div>
          </div>
          <div class="col-md input-group">
            <span class="input-group-text">S/.</span>
            <div class="form-floating">
              <input type="number" class="form-control" id="txtPagoInst" value=30 min="0" placeholder="Pago Instalación">
              <label for="lblPago">Pago Instalación</label>
            </div>
            <span class="input-group-text">.00</span>
          </div>
        </div>
        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtPotenciaCable" placeholder="Potencia">
              <label for="lblPotenciaCable">Potencia</label>
            </div>
          </div>
        </div>
        <label class="form-label mt-2">Cantidad de implementos</label>
        <div class="mb-3">
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#mdlSintotizador">
            Añadir Sintotizador
          </button>
        </div>
        <div class="row g-3 mb-3">
          <div class="form-floating col-md-6">
            <select class="form-select" id="slcTriplexor">
              <option value="false,false" selected>No Lleva</option>
              <option value="true,false">Pasivo</option>
              <option value="true,true">Activo</option>
            </select>
            <label for="slcTriplexor">Triplexor</label>
          </div>
          <div class="col-md-6">
            <div class="d-flex">
              <div class="form-floating me-2 flex-fill">
                <input type="number" class="form-control" id="txtCantConector" placeholder="Conector">
                <label for="txtCantConector">Conector</label>
              </div>
              <div class="form-floating flex-fill">
                <input type="number" class="form-control" id="txtPrecioConector" value="1.50" disabled>
                <label for="txtPrecioConector">Precio</label>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="input-group">
              <div class="form-floating">
                <input type="number" id="txtSpliter" class="form-control" placeholder="Spliter">
                <label for="lblSpliter">Spliter</label>
              </div>
              <select class="form-select" id="slcSpliter" aria-label="Selecciona una opción">
                <option selected disabled>Elige una opción</option>
                <option value="1x3">1x3</option>
                <option value="1x5">1x5</option>
                <option value="1x8">1x8</option>
              </select>
            </div>
          </div>
          <div class="col-md">
            <div class="input-group">
              <div class="form-floating">
                <input type="number" class="form-control" id="txtCantCable" placeholder="Cable M.">
                <label for="lblCable">Cable M.</label>
              </div>
              <div class="form-floating">
                <input type="number" class="form-control" id="txtPrecioCable" value="1.10" placeholder="Precio del Cable" disabled>
                <label for="lblPrecioCable">Precio del Cable</label>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<div class="container-fluid px-4" id="contenidoCable">
  <!-- Card: Otros -->
  <div class="conteiner">
    <div class="card mb-4">
      <div class="card-header">
        <h6 class="card-title">Otros:</h6>
      </div>
      <div class="card-body">
        <label class="form-label mt-2">Costos</label>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" value=0 id="txtPagoAdelantado" placeholder="Pago">
              <label for="lblPagoAdelantado">Pago</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" value=0 id="txtCantSintotizador" placeholder="Cantidad Sintonizador" disabled>
              <label for="lblCantSintotizador">Cantidad Sintotizador</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" value=0 id="txtCostoAlquiler" placeholder="Costo de Aquiler" disabled>
              <label for="lblCostoAlquiler">Costo de Alquiler</label>
            </div>
          </div>
        </div>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" value=0 id="txtCostoCable" placeholder="Costo de Cable" disabled>
              <label for="lblCostoCable">Costo de Cable</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" value=0 id="txtCostoConector" placeholder="Costo de Conector" disabled>
              <label for="lblCostoConector">Costo de Conector</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="text" class="form-control" value=0 id="txtDescuento" placeholder="Descuento">
              <label for="lblDescuento">Descuento</label>
            </div>
          </div>
        </div>
        <label class="form-label mt-2">Medición en caja NAP</label>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtGponNap" placeholder="GPON">
              <label for="lblGponNap">GPON</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtCatvNap" placeholder="CATV">
              <label for="lblCatvNap">CATV</label>
            </div>
          </div>
        </div>
        <label class="form-label mt-2">Medición en interior de casa</label>
        <div class="row g-2 mb-2">
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtGponCasa" placeholder="GPON">
              <label for="lblGponCasa">GPON</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input type="number" class="form-control" id="txtCatvCasa" placeholder="CATV">
              <label for="lblCatvCasa">CATV</label>
            </div>
          </div>
        </div>
        <!-- Botones -->
        <div class="row">
          <div class="col-12 text-center text-md-end mb-3">
            <button type="button" id="btnGuardar" class="btn btn-primary btn-sm">Guardar</button>
            <button type="button" id="btnCancelar" class="btn btn-outline-secondary btn-sm">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<?php require_once "../../footer.php"; ?>
<script>
  const idContrato = <?= $idContrato ?>;
</script>
<script type="module" src="../../js/FichaTecnicaGpon.js"></script>

</body>

</html>