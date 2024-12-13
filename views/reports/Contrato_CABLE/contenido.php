<?php
$HOST = "http://localhost/Delatel";
?>

<h3 class="text-center">CONTROL DE INSTALACIÓN SERVICIO FTTH - DELAFIBER</h3>

<!-- Información de Contrato y Fecha alineada a la derecha -->
<div class="container">
  <div style="text-align: right; font-family: Arial, sans-serif; font-size: 12px;">
    <p><strong>N°:</strong> <?= $resultado[0]['id_contrato']; ?> &nbsp; <strong>Fecha:</strong> <?= $fechaActual; ?></p>
  </div>
</div>

<!-- Datos del Usuario -->
<div class="container">
  <table class="tabla2" style="width: 100%;">
    <thead>
      <tr>
        <td colspan="5" class="text-center thead-cabecera"><strong>DATOS DEL USUARIO</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>CLIENTE:</strong></td>
        <td colspan="2" class="text-center"><?= $resultado[0]['NombreCliente']; ?></td>
        <td><strong>DNI:</strong></td>
        <td class="text-center"><?= $resultado[0]['NumeroDocumento']; ?></td>
      </tr>
      <tr>
        <td><strong>DIRECCIÓN:</strong></td>
        <td colspan="2" class="text-center"><?= $resultado[0]['DireccionContrato']; ?></td>
        <td><strong>CELULAR:</strong></td>
        <td class="text-center"><?= $resultado[0]['Telefono']; ?></td>
      </tr>
      <tr>
        <td><strong>REFERENCIA:</strong></td>
        <td colspan="2" class="text-center"><?= $resultado[0]['Referencia']; ?></td>
        <td><strong>ZONA:</strong></td>
        <td class="text-center"><?= $resultado[0]['Sector']; ?></td>
      </tr>
      <tr>
        <td><strong>PLAN:</strong></td>
        <td colspan="2" class="text-center"><?= $resultado[0]['NombrePaquete']; ?></td>
        <td><strong>PRECIO:</strong></td>
        <td class="text-center">S./ <?= $resultado[0]['PrecioPaquete']; ?></td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Transmisión de Datos Digital -->
<div class="container">
  <table class="tabla2" style="width: 100%;">
    <thead>
      <tr>
        <td colspan="8" class="text-center thead-cabecera-3"><strong>TRANSMISIÓN DE DATOS DIGITAL</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td colspan="2"><strong>PAGO INST:</strong></td>
        <td class="text-center">S./ <?= htmlspecialchars($fichaTecnica['cable']['pagoinstalacion']); ?></td>
        <td colspan="2"><strong>SINTONIZADOR:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['sintonizadores'][0]['marcaModelo']); ?></td>
        <td class="text-center" colspan="2">CARG + CONTROL</td>
      </tr>
      <tr>
        <td><strong>TRIPLEXOR:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['triplexor']['requerido']); ?></td>
        <td><strong>PERIODO:</strong></td>
        <td colspan="2"><?= htmlspecialchars($fichaTecnica['cable']['periodo']); ?></td>
        <td><strong>SPLITTER:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['splitter'][0]['tipo']); ?></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['splitter'][0]['cantidad']); ?></td>
      </tr>
      <tr>
        <td colspan="2"><strong>CABLE:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['cable']['metrosadicionales']); ?></td>
        <td class="text-center">S./ <?= htmlspecialchars($fichaTecnica['cable']['cable']['preciometro']); ?></td>
        <td colspan="2"><strong>CONECTORES:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['conector']['numeroconector']); ?></td>
        <td class="text-center">S./ <?= htmlspecialchars($fichaTecnica['cable']['conector']['precio']); ?></td>
      </tr>
      <tr>
        <td class="text-center" rowspan="4"><strong>DETALLES:</strong></td>
        <td colspan="8" rowspan="4"></td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Equipos Adicionales Digitales - Otros -->
<div class="container">
  <table class="tabla2" style="width: 100%;">
    <thead>
      <tr>
        <td colspan="4" class="text-center thead-cabecera-3"><strong>EQUIPOS ADICIONALES DIGITALES - OTROS</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>SINTONIZADOR:</strong></td>
        <td><?= htmlspecialchars($fichaTecnica['cable']['sintonizadores'][0]['numero']); ?></td>
        <td colspan="2" class="text-center thead-cabecera-4"><strong>MEDICIÓN EN CAJA NAP</strong></td>
      </tr>
      <tr>
        <td><strong>COSTO ALQUILER:</strong></td>
        <td>S./ <?= htmlspecialchars($fichaTecnica['costo']['cableCosto']['costoAlquilerSintonizador']); ?></td>
        <td><strong>GPON:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['costo']['nap']['gpon']); ?></td>
      </tr>
      <tr>
        <td><strong>FORMA DE PAGO:</strong></td>
        <td>CONTADO / TRANSF / YAPE</td>
        <td><strong>CATV:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['costo']['nap']['catv']); ?></td>
      </tr>
      <tr>
        <td><strong>CABLE:</strong></td>
        <td>S./ <?= htmlspecialchars($fichaTecnica['cable']['cable']['metrosadicionales']); ?></td>
        <td colspan="2" class="text-center thead-cabecera-4"><strong>MEDICIÓN EN INTERIOR DE LA CASA</strong></td>
      </tr>
      <tr>
        <td><strong>CONECT:</strong></td>
        <td><?= htmlspecialchars($fichaTecnica['cable']['conector']['numeroconector']); ?></td>
        <td><strong>GPON:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['costo']['casa']['gpon']); ?></td>
      </tr>
      <tr>
        <td><strong>OTROS:</strong></td>
        <td class="text-center"></td>
        <td><strong>CATV</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['costo']['casa']['catv']); ?></td>
      </tr>
      <tr>
        <td class="text-center" rowspan="4"><strong>DETALLES:</strong></td>
        <td colspan="8" rowspan="4"></td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Comentado el código de detalles de costos, si es necesario activar -->
<!-- 
<div class="container">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="4" class="text-center thead-cabecera"><strong>DETALLES DE COSTOS</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center"><strong>PAGO SERVICIO:</strong></td>
        <td></td>
        <td rowspan="7" colspan="2"></td>
      </tr>
      <tr>
        <td class="text-center"><strong>PAGO DIGITAL:</strong></td>
        <td></td>
      </tr>
      <tr>
        <td class="text-center"><strong>INST. DIGITAL:</strong></td>
        <td></td>
      </tr>
      <tr>
        <td class="text-center"><strong>SINT. ADIC:</strong></td>
        <td></td>
      </tr>
      <tr>
        <td class="text-center"><strong>CABLE ADIC:</strong></td>
        <td></td>
      </tr>
      <tr>
        <td class="text-center"><strong>CONECT ADIC:</strong></td>
        <td></td>
      </tr>
      <tr>
        <td class="text-center"><strong>REPETIDOR:</strong></td>
        <td></td>
      </tr>
      <tr>
        <td class="text-center"><strong>TOTAL:</strong></td>
        <td></td>
        <td class="text-center"><strong>FORMA PAG</strong></td>
        <td class="text-center"><strong>CONTADO/TRANSF/YAPE</strong></td>
      </tr>
      <tr>
        <td class="text-center"><strong>TÉCNICO:</strong></td>
        <td></td>
        <td class="text-center"><strong>HORA:</strong></td>
        <td></td>
      </tr>
      <tr>
        <td colspan="5" class="text-center thead-cabecera-2"><strong>FICHA DE CONTROL INTERNO PARA TODOS LOS MODOS DE INSTALACIONES</strong></td>
      </tr>
    </tbody>
  </table>
</div>
-->