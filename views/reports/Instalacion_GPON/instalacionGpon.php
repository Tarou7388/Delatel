<?php
$HOST = "http://localhost/Delatel";
?>

<img src="<?= $HOST ?>/image/headerInstalacionGpon.png" class="image-header" alt="">
<div class="container">
  <table class="tabla2">
    <tbody>
      <tr>
        <td class="text-center">N°:</td>
        <td class="text-center"><?= $resultado[0]['id_contrato']; ?></td>
        <td class="text-center">Fecha:</td>
        <td class="text-center"><?= $fechaActual; ?></td>
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
        <td class="text-center"><?= $resultado[0]['NombreCliente']; ?></td>
        <td class="text-center">DNI:</td>
        <td class="text-center"><?= $resultado[0]['NumeroDocumento']; ?></td>
      </tr>
      <tr>
        <td class="text-center">DIRECCION:</td>
        <td class="text-center"><?= $resultado[0]['DireccionContrato']; ?></td>
        <td class="text-center">CELULAR:</td>
        <td class="text-center"><?= $resultado[0]['Telefono']; ?></td>
      </tr>
      <tr>
        <td class="text-center">REFERENCIA:</td>
        <td class="text-center"><?= $resultado[0]['Referencia']; ?></td>
        <td class="text-center">ZONA:</td>
        <td class="text-center"><?= $resultado[0]['Sector']; ?></td>
      </tr>
      <tr>
        <td class="text-center">PLAN:</td>
        <td class="text-center"><?= $resultado[0]['NombrePaquete']; ?></td>
        <td class="text-center">PRECIO:</td>
        <td class="text-center"><?= $resultado[0]['PrecioPaquete']; ?></td>
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
        <td class="text-center"><strong>USUARIO:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraoptica']['usuario']); ?></td>
        <td class="text-center"><strong>MARCA:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraoptica']['moden']['marca']); ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>CLAVE:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraoptica']['claveacceso']); ?></td>
        <td class="text-center"><strong>BANDA:</strong></td>
        <td class="text-center"><?= htmlspecialchars(implode(", ", $fichaTecnica['fibraoptica']['moden']['banda'])); ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>VLAN:</strong></td>
        <td class="text-center"></td>
        <td class="text-center"><strong>ANTENA:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraoptica']['moden']['numeroantena']); ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>SSID:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraoptica']['moden']['ssid']); ?></td>
        <td class="text-center"><strong>CATV:</strong></td>
        <td class="text-center"><?= $fichaTecnica['fibraoptica']['moden']['catv'] ? 'Sí' : 'No'; ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>SEGURIDAD:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraoptica']['moden']['seguridad']); ?></td>
        <td class="text-center"><strong>MAC:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraoptica']['moden']['codigoBarra']) ?></td>
      </tr>
      <!--  <tr>
        <td colspan="1" class="text-center">DETALLES: </td>
        <td colspan="3"></td>
      </tr> -->
    </tbody>
  </table>
</div>

<div class="container">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="4" class="text-center thead-cabecera"><strong>EQUIPOS ADICIONALES WIFI</strong></td>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($fichaTecnica['fibraoptica']['repetidores'] as $repetidor): ?>
        <tr>
          <td class="text-center"><strong>REPETIDOR:</strong></td>
          <td class="text-center"><?= htmlspecialchars($repetidor['numero']); ?></td>
          <td class="text-center"><strong>COSTO:</strong></td>
          <td class="text-center"><?= htmlspecialchars($repetidor['precio']); ?></td>
        </tr>
        <tr>
          <td class="text-center"><strong>MARCA:</strong></td>
          <td class="text-center"><?= htmlspecialchars($repetidor['marca']); ?></td>
          <td rowspan="5" class="text-center"><strong>DETALLES:</strong></td>
          <td rowspan="5" class="text-center"><?= htmlspecialchars($fichaTecnica['fibraoptica']['detalles']); ?></td>
        </tr>
        <tr>
          <td class="text-center"><strong>CONDICION:</strong></td>
          <td class="text-center"></td>
        </tr>
        <tr>
          <td class="text-center"><strong>IP:</strong></td>
          <td class="text-center"><?= htmlspecialchars($repetidor['ip']); ?></td>
        </tr>
        <tr>
          <td class="text-center"><strong>SSID:</strong></td>
          <td class="text-center"><?= htmlspecialchars($repetidor['ssid']); ?></td>
        </tr>
        <tr>
          <td class="text-center"><strong>CLAVE:</strong></td>
          <td class="text-center"><?= htmlspecialchars($repetidor['contrasenia']); ?></td>
        </tr>
      <?php endforeach; ?>
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