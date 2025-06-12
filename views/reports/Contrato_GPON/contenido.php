<h3 class="text-center">CONTROL DE INSTALACIÓN SERVICIO FTTH - DELAFIBER</h3>

<div class="container">
  <div style="text-align: right; font-family: Arial, sans-serif; font-size: 12px; margin-right: 35px;">
    <p>
      <strong>N°:</strong> <?= $resultado[0]['id_contrato']; ?> &nbsp;
      <strong>Fecha Actual:</strong> <?= date('Y-m-d (H:i)', strtotime($resultado[0]['FechaFichaInstalacion'])); ?> &nbsp;
    </p>
  </div>
</div>

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
        <td class="text-center"><?= !empty($resultado[0]['PrecioPaquete']) ? htmlspecialchars($resultado[0]['PrecioPaquete']) : 'N/A'; ?></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="container">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="4" class="text-center thead-cabecera"><strong>CONEXIÓN FTTH - FIBRA OPTICA</strong></td>
      </tr>
      <tr>
        <td colspan="2" class="text-center thead-cabecera"><strong>MODO PPPoE</strong></td>
        <td colspan="2" class="text-center thead-cabecera-2"><strong>DETALLES EQUIPO</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>USUARIO:</strong></td>
        <td class="text-center">
          <?= !empty($fichaTecnica['fibraoptica']['usuario']) ? htmlspecialchars($fichaTecnica['fibraoptica']['usuario']) : (!empty($fichaTecnica['fibraoptica']['pppoe']) ? htmlspecialchars($fichaTecnica['fibraoptica']['pppoe']) : 'N/A'); ?>
        </td>
        <td><strong>MARCA:</strong></td>
        <td class="text-center"><?= !empty($fichaTecnica['fibraoptica']['router']['marca']) ? htmlspecialchars($fichaTecnica['fibraoptica']['router']['marca']) : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>CLAVE:</strong></td>
        <td class="text-center">
          <?= !empty($fichaTecnica['fibraoptica']['claveacceso']) ? htmlspecialchars($fichaTecnica['fibraoptica']['claveacceso']) : (!empty($fichaTecnica['fibraoptica']['clave']) ? htmlspecialchars($fichaTecnica['fibraoptica']['clave']) : 'N/A'); ?>
        </td>
        <td><strong>BANDA:</strong></td>
        <td class="text-center">
          <?php
          $banda = $fichaTecnica['fibraoptica']['router']['banda'] ?? null;
          if (is_array($banda)) {
            echo htmlspecialchars(implode(", ", $banda));
          } elseif (is_string($banda)) {
            echo htmlspecialchars($banda);
          } else {
            echo 'N/A';
          }
          ?>
        </td>
      </tr>
      <tr>
        <td><strong>VLAN:</strong></td>
        <td class="text-center">
          <?=
          !empty($fichaTecnica['vlan']) ?
            htmlspecialchars($fichaTecnica['vlan']) : (!empty($fichaTecnica['fibraoptica']['vlan']) ?
              htmlspecialchars($fichaTecnica['fibraoptica']['vlan']) :
              'N/A'
            );
          ?>
        </td>
        <td><strong>N° ANTENA:</strong></td>
        <td class="text-center"><?= !empty($fichaTecnica['fibraoptica']['router']['numeroantena']) ? htmlspecialchars($fichaTecnica['fibraoptica']['router']['numeroantena']) : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>SSID:</strong></td>
        <td class="text-center"><?= !empty($fichaTecnica['fibraoptica']['router']['ssid']) ? htmlspecialchars($fichaTecnica['fibraoptica']['router']['ssid']) : 'N/A'; ?></td>
        <td><strong>CATV:</strong></td>
        <td class="text-center"><?= isset($fichaTecnica['fibraoptica']['router']['catv']) ? ($fichaTecnica['fibraoptica']['router']['catv'] ? 'Sí' : 'No') : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>SEGURIDAD:</strong></td>
        <td class="text-center"><?= !empty($fichaTecnica['fibraoptica']['router']['seguridad']) ? htmlspecialchars($fichaTecnica['fibraoptica']['router']['seguridad']) : 'N/A'; ?></td>
        <td><strong>MAC:</strong></td>
        <td class="text-center"><?= !empty($fichaTecnica['fibraoptica']['router']['codigobarra']) ? htmlspecialchars($fichaTecnica['fibraoptica']['router']['codigobarra']) : 'N/A'; ?></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="container">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="4" class="text-center thead-cabecera"><strong>DETALLES TÉCNICOS</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>IP:</strong></td>
        <td class="text-center"><?= !empty($fichaTecnica['fibraoptica']['router']['ip']) ? htmlspecialchars($fichaTecnica['fibraoptica']['router']['ip']) : 'N/A'; ?></td>
        <td><strong>POTENCIA:</strong></td>
        <td class="text-center"><?= isset($fichaTecnica['fibraoptica']['potencia']) ? htmlspecialchars($fichaTecnica['fibraoptica']['potencia']) : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>USUARIO:</strong></td>
        <td class="text-center"><?= !empty($fichaTecnica['fibraoptica']['router']['ingresouserrouter']) ? htmlspecialchars($fichaTecnica['fibraoptica']['router']['ingresouserrouter']) : 'N/A'; ?></td>
        <td><strong>CLAVE DE ACCESO:</strong></td>
        <td class="text-center"><?= !empty($fichaTecnica['fibraoptica']['router']['ingresopass']) ? htmlspecialchars($fichaTecnica['fibraoptica']['router']['ingresopass']) : 'N/A'; ?></td>
      </tr>
      <?php
      $detalles = '';
      if (isset($fichaTecnica['fibraoptica']['detalles'])) {
        $detalles = $fichaTecnica['fibraoptica']['detalles'];
      } elseif (isset($fichaTecnica['fibraoptica']['detalle'])) {
        $detalles = $fichaTecnica['fibraoptica']['detalle'];
      }
      ?>
      <?php if (!empty($detalles)): ?>
        <tr>
          <td colspan="4" class="text-center"><strong>DETALLES:</strong></td>
        </tr>
        <tr>
          <td colspan="4"><?= htmlspecialchars($detalles); ?></td>
        </tr>
      <?php endif; ?>
    </tbody>
  </table>
</div>

<div class="container">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="6" class="text-center thead-cabecera-3"><strong>TRASMISIÓN DE DATOS DIGITAL</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>PLAN:</strong></td>
        <td colspan="3"><?= !empty($resultado[0]['NombrePaquete']) ? htmlspecialchars($resultado[0]['NombrePaquete']) : 'N/A'; ?></td>
        <td><strong>POTENCIA CABLE:</strong></td>
        <td class="text-center"><?= isset($fichaTecnica['cable']['potencia']) ? htmlspecialchars($fichaTecnica['cable']['potencia']) : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>PAGO INST:</strong></td>
        <td class="text-center">S./ <?= isset($fichaTecnica['cable']['costo']['pagoinstalacion']) ? htmlspecialchars($fichaTecnica['cable']['costo']['pagoinstalacion']) : 'N/A'; ?></td>
        <td><strong>TRIPLEXOR:</strong></td>
        <td class="text-center">
          <?php
          $valor = isset($fichaTecnica['cable']['triplexor']['requerido']) ? trim(strtolower($fichaTecnica['cable']['triplexor']['requerido'])) : '';
          if ($valor === '' && isset($fichaTecnica['cable']['triplexor'])) {
            $valor = trim(strtolower($fichaTecnica['cable']['triplexor']));
          }
          echo ($valor === 'false' || $valor === '') ? 'No tiene' : htmlspecialchars($fichaTecnica['cable']['triplexor']['requerido'] ?? $fichaTecnica['cable']['triplexor']);
          ?>
        </td>
        <td><strong>CARGADOR:</strong></td>
        <td class="text-center">
          <?php
          $valor = isset($fichaTecnica['cable']['triplexor']['cargador']) ? trim(strtolower($fichaTecnica['cable']['triplexor']['cargador'])) : '';
          echo ($valor === 'false' || $valor === '') ? 'No tiene' : htmlspecialchars($fichaTecnica['cable']['triplexor']['cargador'] ?? '');
          ?>
        </td>
      </tr>
      <tr>
        <td><strong>PERIODO:</strong></td>
        <td class="text-center"><?= !empty($fichaTecnica['periodo']) ? htmlspecialchars($fichaTecnica['periodo']) : 'N/A'; ?></td>
        <td><strong>SPLITTER:</strong></td>
        <td class="text-center">CANTIDAD: <?= isset($fichaTecnica['cable']['splitter'][0]['cantidad']) ? htmlspecialchars($fichaTecnica['cable']['splitter'][0]['cantidad']) : 'N/A'; ?></td>
        <td><strong>TIPO:</strong></td>
        <td class="text-center"> <?= isset($fichaTecnica['cable']['splitter'][0]['tipo']) ? htmlspecialchars($fichaTecnica['cable']['splitter'][0]['tipo']) : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>CABLE:</strong></td>
        <td class="text-center"><?= isset($fichaTecnica['cable']['cable']['metrosadicionales']) ? htmlspecialchars($fichaTecnica['cable']['cable']['metrosadicionales']) : 'N/A'; ?> METROS</td>
        <td class="text-center">S./ <?= isset($fichaTecnica['cable']['cable']['preciometro']) ? htmlspecialchars($fichaTecnica['cable']['cable']['preciometro']) : 'N/A'; ?></td>
        <td><strong>CONECTORES:</strong></td>
        <td class="text-center"><?= isset($fichaTecnica['cable']['conector']['numeroconector']) ? htmlspecialchars($fichaTecnica['cable']['conector']['numeroconector']) : 'N/A'; ?></td>
        <td class="text-center">S./ <?= isset($fichaTecnica['cable']['conector']['precio']) ? htmlspecialchars($fichaTecnica['cable']['conector']['precio']) : 'N/A'; ?></td>
      </tr>
    </tbody>
  </table>
</div>

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
        <td><?= isset($fichaTecnica['costo']['cablecosto']['numerosintotizadores']) ? htmlspecialchars($fichaTecnica['costo']['cablecosto']['numerosintotizadores']) : 'No tiene'; ?></td>
        <td colspan="3" class="text-center thead-cabecera-4"><strong>MEDICIÓN EN CAJA NAP</strong></td>
      </tr>
      <tr>
        <td><strong>COSTO ALQUILER:</strong></td>
        <td><?= isset($fichaTecnica['costo']['cablecosto']['costoalquilersintotizadortotal']) ? 'S./ ' . htmlspecialchars($fichaTecnica['costo']['cablecosto']['costoalquilersintotizadortotal']) : 'No tiene'; ?></td>
        <td colspan="2"><strong>CAJA GPON:</strong></td>
        <td class="text-center"><?= isset($fichaTecnica['costo']['nap']['gpon']) ? htmlspecialchars($fichaTecnica['costo']['nap']['gpon']) : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>FORMA DE PAGO:</strong></td>
        <td>CONTADO / TRANSF / YAPE</td>
        <td colspan="2"><strong>CAJA CATV:</strong></td>
        <td class="text-center"><?= isset($fichaTecnica['costo']['nap']['catv']) ? htmlspecialchars($fichaTecnica['costo']['nap']['catv']) : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>COSTO CABLE:</strong></td>
        <td>S./ <?= isset($fichaTecnica['costo']['cablecosto']['costocable']) ? htmlspecialchars($fichaTecnica['costo']['cablecosto']['costocable']) : 'N/A'; ?></td>
        <td colspan="3" class="text-center thead-cabecera-4"><strong>MEDICIÓN EN INTERIOR DE LA CASA</strong></td>
      </tr>
      <tr>
        <td><strong>COSTO CONECTOR:</strong></td>
        <td>S./ <?= isset($fichaTecnica['costo']['cablecosto']['costoconector']) ? htmlspecialchars($fichaTecnica['costo']['cablecosto']['costoconector']) : 'N/A'; ?></td>
        <td colspan="2"><strong>CASA GPON:</strong></td>
        <td class="text-center"><?= isset($fichaTecnica['costo']['casa']['gpon']) ? htmlspecialchars($fichaTecnica['costo']['casa']['gpon']) : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>CAJA:</strong></td>
        <td class="text-center">
          <?php
          echo htmlspecialchars($nombrecaja) . "(" . htmlspecialchars($fichaTecnica['idcaja']) . ") - P:" . htmlspecialchars($fichaTecnica['puerto']);
          ?>
        </td>
        <td colspan="2"><strong>CASA CATV:</strong></td>
        <td class="text-center"><?= isset($fichaTecnica['costo']['casa']['catv']) ? htmlspecialchars($fichaTecnica['costo']['casa']['catv']) : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>TECNICO:</strong></td>
        <td colspan="4"><?= !empty($resultado[0]['NombreTecnicoFicha']) ? htmlspecialchars($resultado[0]['NombreTecnicoFicha']) : 'N/A'; ?></td>
      </tr>
      <?php
      $detalleCosto = '';
      if (isset($fichaTecnica['costo']['cablecosto']['detalle'])) {
        $detalleCosto = $fichaTecnica['costo']['cablecosto']['detalle'];
      }
      ?>
      <?php if (!empty($detalleCosto)): ?>
        <tr>
          <td colspan="5" class="text-center"><strong>DETALLES:</strong></td>
        </tr>
        <tr>
          <td colspan="5"><?= htmlspecialchars($detalleCosto); ?></td>
        </tr>
      <?php endif; ?>
    </tbody>
  </table>
</div>
<br>
<br>
<br>
<br>

<!-- Detalles de Costo -->
<div class="container">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="8" class="text-center thead-cabecera-3"><strong>DETALLES DE COSTO</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>PAGO SERVICIO:</strong></td>
        <td colspan="2"></td>
        <td rowspan="8" colspan="5" class="text-center" style="vertical-align: top;">
        </td>
      </tr>
      <tr>
        <td><strong>PAGO DIGITAL:</strong></td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td><strong>INST. DIGITAL:</strong></td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td><strong>SINT. ADIC:</strong></td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td><strong>CABLE ADIC:</strong></td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td><strong>CONECT ADIC:</strong></td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td><strong>SUBTOTAL:</strong></td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td><strong>ABONO:</strong></td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td><strong>SALDO:</strong></td>
        <td colspan="2"></td>
        <td><strong>FORMA PAG:</strong></td>
        <td colspan="4"></td>
      </tr>
    </tbody>
  </table>
</div>

<?php
$repetidores = [];
if (isset($fichaTecnica['fibraoptica']['repetidores']) && is_array($fichaTecnica['fibraoptica']['repetidores']) && count($fichaTecnica['fibraoptica']['repetidores']) > 0) {
  $repetidores = $fichaTecnica['fibraoptica']['repetidores'];
}
?>
<?php if (!empty($repetidores)): ?>
  <div class="container">
    <table class="tabla2">
      <thead>
        <tr>
          <td colspan="4" class="text-center thead-cabecera"><strong>REPETIDORES</strong></td>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($repetidores as $repetidor): ?>
          <tr>
            <td class="text-center"><strong>REPETIDOR:</strong></td>
            <td class="text-center"><?= !empty($repetidor['numero']) ? htmlspecialchars($repetidor['numero']) : 'N/A'; ?></td>
            <td class="text-center"><strong>COSTO:</strong></td>
            <td class="text-center">S/.<?= !empty($repetidor['precio']) ? htmlspecialchars($repetidor['precio']) : 'N/A'; ?></td>
          </tr>
          <tr>
            <td class="text-center"><strong>MARCA:</strong></td>
            <td class="text-center"><?= !empty($repetidor['marca']) ? htmlspecialchars($repetidor['marca']) : 'N/A'; ?></td>
            <td rowspan="5" class="text-center"><strong>DETALLES:</strong></td>
            <td rowspan="5" class="text-center"><?= !empty($detalles) ? htmlspecialchars($detalles) : 'N/A'; ?></td>
          </tr>
          <tr>
            <td class="text-center"><strong>CONDICIÓN:</strong></td>
            <td class="text-center"><?= !empty($repetidor['condicion']) ? htmlspecialchars($repetidor['condicion']) : 'N/A'; ?></td>
          </tr>
          <tr>
            <td class="text-center"><strong>IP:</strong></td>
            <td class="text-center"><?= !empty($repetidor['ip']) ? htmlspecialchars($repetidor['ip']) : 'N/A'; ?></td>
          </tr>
          <tr>
            <td class="text-center"><strong>SSID:</strong></td>
            <td class="text-center"><?= !empty($repetidor['ssid']) ? htmlspecialchars($repetidor['ssid']) : 'N/A'; ?></td>
          </tr>
          <tr>
            <td class="text-center"><strong>CLAVE:</strong></td>
            <td class="text-center"><?= !empty($repetidor['contrasenia']) ? htmlspecialchars($repetidor['contrasenia']) : 'N/A'; ?></td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
<?php endif; ?>
<br>
<br>
<br>
<br>
<br>
<?php
$sintonizadores = [];
if (isset($fichaTecnica['cable']['sintonizadores']) && is_array($fichaTecnica['cable']['sintonizadores']) && count($fichaTecnica['cable']['sintonizadores']) > 0) {
  $sintonizadores = $fichaTecnica['cable']['sintonizadores'];
}
?>
<?php if (!empty($sintonizadores)): ?>
  <div class="container">
    <table class="tabla2">
      <thead>
        <tr>
          <td colspan="8" class="text-center"><strong>SINTONIZADORES</strong></td>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($sintonizadores as $sintonizador): ?>
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