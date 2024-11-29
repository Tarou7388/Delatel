<?php
$HOST = "http://localhost/Delatel";
?>

<img src="<?= $HOST ?>/image/headerInstalacionGpon.png" class="image-header" alt="">
<div class="container">
  <table class="tabla2">
    <tbody>
      <tr>
        <td class="text-center"><strong>N°:</strong></td>
        <td class="text-center"><?= $resultado[0]['id_contrato']; ?></td>
        <td class="text-center"><strong>Fecha:</strong></td>
        <td class="text-center"><?= $fechaActual; ?></td>
      </tr>
    </tbody>
  </table>
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="5" class="text-center thead-cabecera"><strong>DATOS DEL USUARIO</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center"><strong>CLIENTE:</strong></td>
        <td colspan="2" class="text-center"><?= $resultado[0]['NombreCliente']; ?></td>
        <td class="text-center"><strong>DNI:</strong></td>
        <td class="text-center"><?= $resultado[0]['NumeroDocumento']; ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>DIRECCION:</strong></td>
        <td class="text-center" colspan="2"><?= $resultado[0]['DireccionContrato']; ?></td>
        <td class="text-center"><strong>CELULAR:</strong></td>
        <td class="text-center"><?= $resultado[0]['Telefono']; ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>REFERENCIA:</strong></td>
        <td colspan="2" class="text-center"><?= $resultado[0]['Referencia']; ?></td>
        <td class="text-center"><strong>ZONA:</strong></td>
        <td class="text-center"><?= $resultado[0]['Sector']; ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>PLAN:</strong></td>
        <td class="text-center" colspan="2"><?= $resultado[0]['NombrePaquete']; ?></td>
        <td class="text-center"><strong>PRECIO:</strong></td>
        <td class="text-center"><?= $resultado[0]['PrecioPaquete']; ?></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="container">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="8" class="text-center thead-cabecera-3"><strong>TRASMISIÓN DE DATOS DIGITAL</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center"><strong>PLAN:</strong></td>
        <td colspan="9"><?= $resultado[0]['NombrePaquete']; ?></td>
      </tr>
      <tr>
        <td class="text-center" colspan="2"><strong>PAGO INST:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['pagoinstalacion']); ?></td>
        <td class="text-center" colspan="2"><strong>SINTONIZADOR:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['sintonizadores'][0]['marcaModelo']); ?></td>
        <td class="text-center" colspan="2">CARG + CONTROL</td>
      </tr>
      <tr>
        <td class="text-center" ><strong>TRIPLEXOR:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['triplexor']['requerido']); ?></td>
        <td class="text-center"><strong>PERIODO:</strong></td>
        <td colspan="2"></td>
        <td class="text-center"><strong>SPLITER:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['spliter'][0]['tipo']); ?></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['spliter'][0]['cantidad']); ?></td>
      </tr>
      <tr>
        <!-- <td class="text-center"><strong>TV ADICIONAL:</strong></td>
        <td></td> -->
        <td class="text-center" colspan="2"><strong>CABLE:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['cable']['metrosadicionales']); ?></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['cable']['preciometro']); ?></td>
        <td class="text-center" colspan="2"><strong>CONECTORES:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['conector']['numeroconector']); ?></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['conector']['precio']); ?></td>
      </tr>
      <!-- <tr>
        <td class="text-center"><strong>COSTO:</strong></td>
        <td></td>

      </tr> -->
      <tr>
        <!-- <td class="text-center"><strong>PAGO DIGITAL:</strong></td>
        <td></td> -->
        <td class="text-center" rowspan="4"><strong>DETALLES:</strong></td>
        <td colspan="8" rowspan="4"></td>
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
        <td class="text-center"><strong>SINTONIZADOR:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['sintonizadores'][0]['numero']); ?></td>
        <td colspan="2" class="text-center thead-cabecera-4"><strong>MEDICIÓN EN CAJA NAP</strong></td>
      </tr>
      <tr>
        <td class="text-center"><strong>COSTO ALQUILER:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['costo']['cableCosto']['costoAlquilerSintotizador']); ?></td>
        <td class="text-center"><strong>GPON:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['costo']['nap']['gpon']); ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>FORMA DE PAGO:</strong></td>
        <td>CONTADO / TRANF / YAPE</td>
        <td class="text-center"><strong>CATV</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['costo']['nap']['catv']); ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>CABLE:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['cable']['metrosadicionales']); ?></td>
        <td colspan="2" class="text-center thead-cabecera-4"><strong>MEDICIÓN EN INTERIOR DE LA CASA</strong></td>
      </tr>
      <tr>
        <td class="text-center"><strong>CONECT:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['conector']['numeroconector']); ?></td>
        <td class="text-center"><strong>GPON:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['costo']['casa']['gpon']); ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>OTROS:</strong></td>
        <td class="text-center"></td>
        <td class="text-center"><strong>CATV</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['costo']['casa']['catv']); ?></td>
      </tr>
      <!-- <tr>
        <td colspan="4" class="text-center thead-cabecera-4"><strong>CONEXIÓN PLANTA EXTERNA</strong></td>
      </tr>
      <tr>
        <td class="text-center"><strong>PUERTO:</strong></td>
        <td></td>
        <td class="text-center"><strong>CAJA:</strong></td>
        <td></td>
      </tr> -->
      <tr>
        <td colspan="1"  rowspan="4" class="text-center"><strong>DETALLES:</strong></td>
        <td colspan="3" rowspan="4"></td>
      </tr>
    </tbody>
  </table>
</div>

<!-- <div class="container">
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
        <td class="text-center"><strong>CONTADO/TRANF/YAPE</strong></td>
      </tr>
      <tr>
        <td class="text-center"><strong>TECNICO:</strong></td>
        <td></td>
        <td class="text-center"><strong>HORA:</strong></td>
        <td></td>
      </tr>
      <tr>
        <td colspan="5" class="text-center thead-cabecera-2"><strong>FICHA DE CONTROL INTERNO PARA TODOS LOS MODOS DE INSTALACIONES</strong></td>
      </tr>
    </tbody>
  </table>
</div> -->