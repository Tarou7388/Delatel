<?php
$HOST = "http://localhost/Delatel";
?>

<img src="<?= $HOST ?>/image/headerInstalacionGpon.png" class="image-header" alt="">
<div class="container">
  <table class="tabla2">
    <tbody>
      <tr>
        <td class="text-center">N°:</td>
        <td><?= $resultado[0]['id_contrato']; ?></td>
        <td class="text-center">Fecha:</td>
        <td><?= $fechaActual; ?></td>
      </tr>
    </tbody>
  </table>
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="4" class="text-center thead-cabecera"><strong>DATOS DEL USUARIO</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center">CLIENTE:</td>
        <td><?= $resultado[0]['NombreCliente']; ?></td>
        <td class="text-center">DNI:</td>
        <td><?= $resultado[0]['NumeroDocumento']; ?></td>
      </tr>
      <tr>
        <td class="text-center">DIRECCION:</td>
        <td><?= $resultado[0]['DireccionContrato']; ?></td>
        <td class="text-center">CELULAR:</td>
        <td><?= $resultado[0]['Telefono']; ?></td>
      </tr>
      <tr>
        <td class="text-center">REFERENCIA:</td>
        <td><?= $resultado[0]['Referencia']; ?></td>
        <td class="text-center">ZONA:</td>
        <td><?= $resultado[0]['Sector']; ?></td>
      </tr>
      <tr>
        <td class="text-center">PLAN:</td>
        <td><?= $resultado[0]['NombrePaquete']; ?></td>
        <td class="text-center">PRECIO:</td>
        <td><?= $resultado[0]['PrecioPaquete']; ?></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="container">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="7" class="text-center thead-cabecera-3"><strong>TRASMISIÓN DE DATOS DIGITAL</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center">PLAN:</td>
        <td><?= $resultado[0]['NombrePaquete']; ?></td>
        <td class="text-center">SINTONIZADOR:</td>
        <td colspan="2"><?= htmlspecialchars($fichaTecnica['cable']['sintonizadores'][0]['marcaModelo']); ?></td>
        <td colspan="2"><?= htmlspecialchars($fichaTecnica['cable']['sintonizadores'][1]['marcaModelo']); ?></td>
      </tr>
      <tr>
        <td class="text-center">PAGO INST:</td>
        <td><?= htmlspecialchars($fichaTecnica['cable']['pagoinstalacion']); ?></td>
        <td class="text-center">TRIPLEXOR:</td>
        <td colspan="2"><?= htmlspecialchars($fichaTecnica['cable']['triplexor']['requerido']); ?></td>
        <td colspan="2"><?= htmlspecialchars($fichaTecnica['cable']['triplexor']['cargador']); ?></td>
      </tr>
      <tr>
        <td class="text-center">PERIODO:</td>
        <td></td>
        <td class="text-center">SPLITER:</td>
        <td colspan="2"><?= htmlspecialchars($fichaTecnica['cable']['spliter'][0]['tipo']); ?></td>
        <td colspan="2"><?= htmlspecialchars($fichaTecnica['cable']['spliter'][0]['cantidad']); ?></td>
      </tr>
      <tr>
        <td class="text-center">TV ADICIONAL:</td>
        <td></td>
        <td class="text-center">CABLE:</td>
        <td colspan="2"><?= htmlspecialchars($fichaTecnica['cable']['cable']['metrosadicionales']); ?></td>
        <td colspan="2"><?= htmlspecialchars($fichaTecnica['cable']['cable']['preciometro']); ?></td>
      </tr>
      <tr>
        <td class="text-center">COSTO:</td>
        <td></td>
        <td class="text-center">CONECTORES:</td>
        <td colspan="2"><?= htmlspecialchars($fichaTecnica['cable']['conector']['numeroconector']); ?></td>
        <td colspan="2"><?= htmlspecialchars($fichaTecnica['cable']['conector']['precio']); ?></td>
      </tr>
      <tr>
        <td class="text-center">PAGO DIGITAL:</td>
        <td></td>
        <td class="text-center">DETALLES: </td>
        <td colspan="4"></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="container">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="4" class="text-center thead-cabecera-3"><strong>EQUIPOS ADICIONALES DIGITALES - OTROS</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center">SINTONIZADOR:</td>
        <td><?= htmlspecialchars($fichaTecnica['cable']['sintonizadores'][0]['numero']); ?></td>
        <td colspan="2" class="text-center thead-cabecera-4"><strong>MEDICIÓN EN CAJA NAP</strong></td>
      </tr>
      <tr>
        <td class="text-center">COSTO ALQUILER:</td>
        <td><?= htmlspecialchars($fichaTecnica['costo']['cableCosto']['costoAlquilerSintotizador']); ?></td>
        <td class="text-center">GPON:</td>
        <td><?= htmlspecialchars($fichaTecnica['costo']['nap']['gpon']); ?></td>
      </tr>
      <tr>
        <td class="text-center">FORMA DE PAGO:</td>
        <td></td>
        <td class="text-center">CATV</td>
        <td><?= htmlspecialchars($fichaTecnica['costo']['nap']['catv']); ?></td>
      </tr>
      <tr>
        <td class="text-center">CABLE:</td>
        <td><?= htmlspecialchars($fichaTecnica['cable']['cable']['metrosadicionales']); ?></td>
        <td colspan="2" class="text-center thead-cabecera-4"><strong>MEDICIÓN EN INTERIOR DE LA CASA</strong></td>
      </tr>
      <tr>
        <td class="text-center">CONECT:</td>
        <td><?= htmlspecialchars($fichaTecnica['cable']['conector']['numeroconector']); ?></td>
        <td class="text-center">GPON:</td>
        <td><?= htmlspecialchars($fichaTecnica['costo']['casa']['gpon']); ?></td>
      </tr>
      <tr>
        <td class="text-center">OTROS:</td>
        <td></td>
        <td class="text-center">CATV</td>
        <td><?= htmlspecialchars($fichaTecnica['costo']['casa']['catv']); ?></td>
      </tr>
      <tr>
        <td colspan="4" class="text-center thead-cabecera-4"><strong>CONEXIÓN PLANTA EXTERNA</strong></td>
      </tr>
      <tr>
        <td class="text-center">PUERTO:</td>
        <td></td>
        <td class="text-center">CAJA:</td>
        <td></td>
      </tr>
      <tr>
        <td colspan="1" class="text-center">DETALLES: </td>
        <td colspan="3"></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="container">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="4" class="text-center thead-cabecera"><strong>DETALLES DE COSTOS</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center">PAGO SERVICIO:</td>
        <td></td>
        <td rowspan="7" colspan="2"></td>
      </tr>
      <tr>
        <td class="text-center">PAGO DIGITAL:</td>
        <td></td>
      </tr>
      <tr>
        <td class="text-center">INST. DIGITAL:</td>
        <td></td>
      </tr>
      <tr>
        <td class="text-center">SINT. ADIC:</td>
        <td></td>
      </tr>
      <tr>
        <td class="text-center">CABLE ADIC:</td>
        <td></td>
      </tr>
      <tr>
        <td class="text-center">CONECT ADIC:</td>
        <td></td>
      </tr>
      <tr>
        <td class="text-center">REPETIDOR:</td>
        <td></td>
      </tr>
      <tr>
        <td class="text-center">TOTAL:</td>
        <td></td>
        <td class="text-center">FORMA PAG</td>
        <td class="text-center">CONTADO/TRANF/YAPE</td>
      </tr>
      <tr>
        <td class="text-center">TECNICO:</td>
        <td></td>
        <td class="text-center">HORA:</td>
        <td></td>
      </tr>
      <tr>
        <td colspan="3" class="text-center thead-cabecera-2"><strong>FICHA DE CONTROL INTERNO PARA TODOS LOS MODOS DE INSTALACIONES</strong></td>
        <td class="text-center">N°</td>
      </tr>
    </tbody>
  </table>
</div>