<h3 class="text-center">CONTROL DE INSTALACIÓN SERVICIO FTTH - DELAFIBER</h3>

<div class="container">
  <div style="text-align: right; font-family: Arial, sans-serif; font-size: 12px; margin-right: 35px;">
    <p>
      <strong>N°:</strong> <?= !empty($resultado[0]['id_contrato']) ? htmlspecialchars($resultado[0]['id_contrato']) : 'N/A'; ?> &nbsp;
      <strong>Fecha Actual:</strong> <?= !empty($resultado[0]['FechaFichaInstalacion']) ? date('Y-m-d (H:i)', strtotime($resultado[0]['FechaFichaInstalacion'])) : 'N/A'; ?> &nbsp;
    </p>
  </div>
</div>

<!-- Datos del Usuario -->
<div class="container">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="5" class="text-center thead-cabecera"><strong>DATOS DEL USUARIO</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>CLIENTE:</strong></td>
        <td colspan="2"><?= !empty($resultado[0]['NombreCliente']) ? htmlspecialchars($resultado[0]['NombreCliente']) : 'N/A'; ?></td>
        <td><strong>DNI:</strong></td>
        <td class="text-center"><?= !empty($resultado[0]['NumeroDocumento']) ? htmlspecialchars($resultado[0]['NumeroDocumento']) : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>DIRECCIÓN:</strong></td>
        <td colspan="2"><?= !empty($resultado[0]['DireccionContrato']) ? htmlspecialchars($resultado[0]['DireccionContrato']) : 'N/A'; ?></td>
        <td><strong>CELULAR:</strong></td>
        <td class="text-center"><?= !empty($resultado[0]['Telefono']) ? htmlspecialchars($resultado[0]['Telefono']) : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>REFERENCIA:</strong></td>
        <td colspan="2"><?= !empty($resultado[0]['Referencia']) ? htmlspecialchars($resultado[0]['Referencia']) : 'N/A'; ?></td>
        <td><strong>ZONA:</strong></td>
        <td class="text-center"><?= !empty($resultado[0]['Sector']) ? htmlspecialchars($resultado[0]['Sector']) : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>PLAN:</strong></td>
        <td colspan="2"><?= !empty($resultado[0]['NombrePaquete']) ? htmlspecialchars($resultado[0]['NombrePaquete']) : 'N/A'; ?></td>
        <td><strong>PRECIO:</strong></td>
        <td class="text-center">S./ <?= !empty($resultado[0]['PrecioPaquete']) ? htmlspecialchars($resultado[0]['PrecioPaquete']) : 'N/A'; ?></td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Transmisión de Datos Digital -->
<div class="container">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="6" class="text-center thead-cabecera-3"><strong>TRANSMISIÓN DE DATOS DIGITAL</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>PAGO INST:</strong></td>
        <td class="text-center">S./ <?= !empty($fichaTecnica['cable']['pagoinstalacion']) ? htmlspecialchars($fichaTecnica['cable']['pagoinstalacion']) : 'N/A'; ?></td>
        <td><strong>TRIPLEXOR:</strong></td>
        <td class="text-center"><?= !empty($fichaTecnica['cable']['triplexor']['requerido']) ? htmlspecialchars($fichaTecnica['cable']['triplexor']['requerido']) : 'N/A'; ?></td>
        <td><strong>CARGADOR:</strong></td>
        <td class="text-center"><?= !empty($fichaTecnica['cable']['triplexor']['cargador']) ? htmlspecialchars($fichaTecnica['cable']['triplexor']['cargador']) : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>PERIODO:</strong></td>
        <td class="text-center"><?= !empty($fichaTecnica['cable']['periodo']) ? htmlspecialchars($fichaTecnica['cable']['periodo']) : 'N/A'; ?></td>
        <td><strong>SPLITTER:</strong></td>
        <td class="text-center">CANTIDAD: <?= htmlspecialchars($fichaTecnica['cable']['splitter'][0]['cantidad']); ?></td>
        <td><strong>TIPO:</strong></td>
        <td class="text-center"> <?= !empty($fichaTecnica['cable']['splitter'][0]['tipo']) ? htmlspecialchars($fichaTecnica['cable']['splitter'][0]['tipo']) : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>CABLE:</strong></td>
        <td class="text-center"><?= !empty($fichaTecnica['cable']['cable']['metrosadicionales']) ? htmlspecialchars($fichaTecnica['cable']['cable']['metrosadicionales']) : 'N/A'; ?> METROS</td>
        <td class="text-center">S./ <?= !empty($fichaTecnica['cable']['cable']['preciometro']) ? htmlspecialchars($fichaTecnica['cable']['cable']['preciometro']) : 'N/A'; ?></td>
        <td><strong>CONECTORES:</strong></td>
        <td class="text-center"><?= !empty($fichaTecnica['cable']['conector']['numeroconector']) ? htmlspecialchars($fichaTecnica['cable']['conector']['numeroconector']) : 'N/A'; ?></td>
        <td class="text-center">S./ <?= !empty($fichaTecnica['cable']['conector']['precio']) ? htmlspecialchars($fichaTecnica['cable']['conector']['precio']) : 'N/A'; ?></td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Equipos Adicionales Digitales - Otros -->
<div class="container">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="5" class="text-center thead-cabecera-3"><strong>EQUIPOS ADICIONALES DIGITALES - OTROS</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>CANTIDAD SINTONIZADOR:</strong></td>
        <td><?= isset($fichaTecnica['costo']['cablecosto']['numerosintotizadores']) && $fichaTecnica['costo']['cablecosto']['numerosintotizadores'] !== '' ? htmlspecialchars($fichaTecnica['costo']['cablecosto']['numerosintotizadores']) : 'No tiene'; ?></td>
        <td colspan="3" class="text-center thead-cabecera-4"><strong>MEDICIÓN EN CAJA NAP</strong></td>
      </tr>
      <tr>
        <td><strong>COSTO ALQUILER:</strong></td>
        <td><?= isset($fichaTecnica['costo']['cablecosto']['costoalquilersintotizador']) && $fichaTecnica['costo']['cablecosto']['costoalquilersintotizador'] !== '' ? 'S./ ' . htmlspecialchars($fichaTecnica['costo']['cablecosto']['costoalquilersintotizador']) : 'No tiene'; ?></td>
        <td colspan="2"><strong>CAJA GPON:</strong></td>
        <td class="text-center"><?= isset($fichaTecnica['costo']['nap']['gpon']) && $fichaTecnica['costo']['nap']['gpon'] !== '' ? htmlspecialchars($fichaTecnica['costo']['nap']['gpon']) : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>FORMA DE PAGO:</strong></td>
        <td>CONTADO / TRANSF / YAPE</td>
        <td colspan="2"><strong>CAJA CATV:</strong></td>
        <td class="text-center"><?= isset($fichaTecnica['costo']['nap']['catv']) && $fichaTecnica['costo']['nap']['catv'] !== '' ? htmlspecialchars($fichaTecnica['costo']['nap']['catv']) : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>COSTO CABLE:</strong></td>
        <td>S./ <?= isset($fichaTecnica['costo']['cablecosto']['costocable']) ? htmlspecialchars($fichaTecnica['costo']['cablecosto']['costocable']) : '0.00'; ?></td>
        <td colspan="3" class="text-center thead-cabecera-4"><strong>MEDICIÓN EN INTERIOR DE LA CASA</strong></td>
      </tr>
      <tr>
        <td><strong>COSTO CONECTOR:</strong></td>
        <td>S./ <?= isset($fichaTecnica['costo']['cablecosto']['costoconector']) ? htmlspecialchars($fichaTecnica['costo']['cablecosto']['costoconector']) : '0.00'; ?></td>
        <td colspan="2"><strong>CASA GPON:</strong></td>
        <td class="text-center"><?= isset($fichaTecnica['costo']['casa']['gpon']) && $fichaTecnica['costo']['casa']['gpon'] !== '' ? htmlspecialchars($fichaTecnica['costo']['casa']['gpon']) : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>CAJA:</strong></td>
        <td class="text-center">
          <?= isset($nombrecaja) ? htmlspecialchars($nombrecaja) : 'Sin caja'; ?>
          (<?= isset($fichaTecnica['idcaja']) ? htmlspecialchars($fichaTecnica['idcaja']) : '0'; ?>) - 
          (<?= isset($fichaTecnica['puerto']) ? htmlspecialchars($fichaTecnica['puerto']) : '0'; ?>)
        </td>
        <td colspan="2"><strong>CASA CATV:</strong></td>
        <td class="text-center"><?= isset($fichaTecnica['costo']['casa']['catv']) && $fichaTecnica['costo']['casa']['catv'] !== '' ? htmlspecialchars($fichaTecnica['costo']['casa']['catv']) : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>TECNICO:</strong></td>
        <td colspan="4"><?= isset($resultado[0]['NombreTecnicoFicha']) && $resultado[0]['NombreTecnicoFicha'] !== '' ? htmlspecialchars($resultado[0]['NombreTecnicoFicha']) : 'N/A'; ?></td>
      </tr>
      <?php if (!empty(trim($fichaTecnica['costo']['cablecosto']['detalle']))): ?>
        <tr>
          <td colspan="5" class="text-center"><strong>DETALLES:</strong></td>
        </tr>
        <tr>
          <td colspan="5"><?= htmlspecialchars($fichaTecnica['costo']['cablecosto']['detalle']); ?></td>
        </tr>
      <?php endif; ?>
    </tbody>
  </table>
</div>


<div class="container">
  <table class="tabla2">
    <?php if (!empty($fichaTecnica['cable']['sintonizadores'])): ?>
      <?php foreach ($fichaTecnica['cable']['sintonizadores'] as $sintonizador): ?>
        <thead>
          <tr>
            <td colspan="8" class="text-center"><strong>SINTONIZADORES</strong></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>SINTONIZADOR:</strong></td>
            <td class="text-center" colspan="1"><?= !empty($sintonizador['numero']) ? htmlspecialchars($sintonizador['numero']) : 'N/A'; ?></td>
            <td><strong>CÓDIGO DE BARRA:</strong></td>
            <td class="text-center" colspan="5"><?= !empty($sintonizador['codigobarra']) ? htmlspecialchars($sintonizador['codigobarra']) : 'N/A'; ?></td>
          </tr>
          <tr>
            <td><strong>MARCA:</strong></td>
            <td class="text-center" colspan="2"><?= !empty($sintonizador['marca']) ? htmlspecialchars($sintonizador['marca']) : 'N/A'; ?></td>
            <td><strong>MODELO:</strong></td>
            <td class="text-center" colspan="4"><?= !empty($sintonizador['modelo']) ? htmlspecialchars($sintonizador['modelo']) : 'N/A'; ?></td>
          </tr>
          <tr>
            <td><strong>SERIE:</strong></td>
            <td class="text-center" colspan="2"><?= !empty($sintonizador['serie']) ? htmlspecialchars($sintonizador['serie']) : 'N/A'; ?></td>
            <td><strong>PRECIO:</strong></td>
            <td class="text-center" colspan="4">S/. <?= !empty($sintonizador['precio']) ? htmlspecialchars($sintonizador['precio']) : 'N/A'; ?></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
  </table>
</div>
<?php endif; ?>