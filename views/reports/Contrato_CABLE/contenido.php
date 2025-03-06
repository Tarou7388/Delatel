
<h3 class="text-center">CONTROL DE INSTALACIÓN SERVICIO FTTH - DELAFIBER</h3>

<div class="container">
  <div style="text-align: right; font-family: Arial, sans-serif; font-size: 12px; margin-right: 35px;">
    <p>
      <strong>N°:</strong> <?= $resultado[0]['id_contrato']; ?> &nbsp; 
      <strong>Fecha Actual:</strong> <?= date('Y-m-d (H:i)', strtotime($resultado[0]['FechaFichaInstalacion'])); ?> &nbsp; 
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
        <td colspan="2"><?= $resultado[0]['NombreCliente']; ?></td>
        <td><strong>DNI:</strong></td>
        <td class="text-center"><?= $resultado[0]['NumeroDocumento']; ?></td>
      </tr>
      <tr>
        <td><strong>DIRECCIÓN:</strong></td>
        <td colspan="2"><?= $resultado[0]['DireccionContrato']; ?></td>
        <td><strong>CELULAR:</strong></td>
        <td class="text-center"><?= $resultado[0]['Telefono']; ?></td>
      </tr>
      <tr>
        <td><strong>REFERENCIA:</strong></td>
        <td colspan="2"><?= $resultado[0]['Referencia']; ?></td>
        <td><strong>ZONA:</strong></td>
        <td class="text-center"><?= $resultado[0]['Sector']; ?></td>
      </tr>
      <tr>
        <td><strong>PLAN:</strong></td>
        <td colspan="2"><?= $resultado[0]['NombrePaquete']; ?></td>
        <td><strong>PRECIO:</strong></td>
        <td class="text-center">S./ <?= $resultado[0]['PrecioPaquete']; ?></td>
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
        <td class="text-center">S./ <?= htmlspecialchars($fichaTecnica['cable']['pagoinstalacion']); ?></td>
        <td><strong>TRIPLEXOR:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['triplexor']['requerido']); ?></td>
        <td><strong>CARGADOR:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['triplexor']['cargador']); ?></td>
      </tr>
      <tr>
        <td><strong>PERIODO:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['periodo']); ?></td>
        <td><strong>SPLITTER:</strong></td>
        <td class="text-center">CANTIDAD: <?= htmlspecialchars($fichaTecnica['cable']['splitter'][0]['cantidad']); ?></td>
        <td><strong>TIPO:</strong></td>
        <td class="text-center"> <?= htmlspecialchars($fichaTecnica['cable']['splitter'][0]['tipo']); ?></td>
      </tr>
      <tr>
        <td><strong>CABLE:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['cable']['metrosadicionales']); ?> METROS</td>
        <td class="text-center">S./ <?= htmlspecialchars($fichaTecnica['cable']['cable']['preciometro']); ?></td>
        <td><strong>CONECTORES:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['conector']['numeroconector']); ?></td>
        <td class="text-center">S./ <?= htmlspecialchars($fichaTecnica['cable']['conector']['precio']); ?></td>
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
        <td><?= !empty($fichaTecnica['costo']['cablecosto']['numerosintotizadores']) ? htmlspecialchars($fichaTecnica['costo']['cablecosto']['numerosintotizadores']) : 'No tiene'; ?></td>
        <td colspan="3" class="text-center thead-cabecera-4"><strong>MEDICIÓN EN CAJA NAP</strong></td>
      </tr>
      <tr>
        <td><strong>COSTO ALQUILER:</strong></td>
        <td><?= !empty($fichaTecnica['costo']['cablecosto']['costoalquilersintotizador']) ? 'S./ ' . htmlspecialchars($fichaTecnica['costo']['cablecosto']['costoalquilersintotizador']) : 'No tiene'; ?></td>
        <td colspan="2"><strong>CAJA GPON:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['costo']['nap']['gpon']); ?></td>
      </tr>
      <tr>
        <td><strong>FORMA DE PAGO:</strong></td>
        <td>CONTADO / TRANSF / YAPE</td>
        <td colspan="2"><strong>CAJA CATV:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['costo']['nap']['catv']); ?></td>
      </tr>
      <tr>
        <td><strong>COSTO CABLE:</strong></td>
        <td>S./ <?= htmlspecialchars($fichaTecnica['costo']['cablecosto']['costocable']); ?></td>
        <td colspan="3" class="text-center thead-cabecera-4"><strong>MEDICIÓN EN INTERIOR DE LA CASA</strong></td>
      </tr>
      <tr>
        <td><strong>COSTO CONECTOR:</strong></td>
        <td>S./ <?= htmlspecialchars($fichaTecnica['costo']['cablecosto']['costoconector']); ?></td>
        <td colspan="2"><strong>CASA GPON:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['costo']['casa']['gpon']); ?></td>
      </tr>
      <tr>
        <td><strong>CAJA:</strong></td>
        <td><?= !empty($fichaTecnica['idcaja']) ? 'Número ' . htmlspecialchars($fichaTecnica['idcaja']) : ''; ?></td>
        <td colspan="2"><strong>CASA CATV:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['costo']['casa']['catv']); ?></td>
      </tr>
      <tr>
        <td><strong>TECNICO:</strong></td>
        <td colspan="4"><?= $resultado[0]['NombreTecnicoFicha']; ?></td>
      </tr>
      <?php if (!empty($fichaTecnica['costo']['cablecosto']['detalle'])): ?>
        <tr>
          <td colspan="5" class="text-center"><strong>DETALLES:</strong></td>
        </tr>
        <tr>
          <td colspan="3"><?= htmlspecialchars($fichaTecnica['costo']['cablecosto']['detalle']); ?></td>
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
            <td class="text-center" colspan="1"><?= htmlspecialchars($sintonizador['numero']); ?></td>
            <td><strong>CÓDIGO DE BARRA:</strong></td>
            <td class="text-center" colspan="5"><?= htmlspecialchars($sintonizador['codigobarra']); ?></td>
          </tr>
          <tr>
            <td><strong>MARCA:</strong></td>
            <td class="text-center" colspan="2"><?= htmlspecialchars($sintonizador['marca']); ?></td>
            <td><strong>MODELO:</strong></td>
            <td class="text-center" colspan="4"><?= htmlspecialchars($sintonizador['modelo']); ?></td>
          </tr>
          <tr>
            <td><strong>SERIE:</strong></td>
            <td class="text-center" colspan="2"><?= htmlspecialchars($sintonizador['serie']); ?></td>
            <td><strong>PRECIO:</strong></td>
            <td class="text-center" colspan="4">S/. <?= htmlspecialchars($sintonizador['precio']); ?></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
  </table>
</div>
<?php endif; ?>