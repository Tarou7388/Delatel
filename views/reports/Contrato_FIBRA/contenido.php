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
        <td colspan="4" class="text-center thead-cabecera"><strong>DATOS DEL USUARIO</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center"><strong>CLIENTE:</strong></td>
        <td class="text-center"><?= $resultado[0]['NombreCliente']; ?></td>
        <td class="text-center"><strong>DNI:</strong></td>
        <td class="text-center"><?= $resultado[0]['NumeroDocumento']; ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>DIRECCION:</strong></td>
        <td class="text-center"><?= $resultado[0]['DireccionContrato']; ?></td>
        <td class="text-center"><strong>CELULAR:</strong></td>
        <td class="text-center"><?= $resultado[0]['Telefono']; ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>REFERENCIA:</strong></td>
        <td class="text-center"><?= $resultado[0]['Referencia']; ?></td>
        <td class="text-center"><strong>ZONA:</strong></td>
        <td class="text-center"><?= $resultado[0]['Sector']; ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>PLAN:</strong></td>
        <td class="text-center"><?= $resultado[0]['NombrePaquete']; ?></td>
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
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraOptica']['usuario']); ?></td>
        <td class="text-center"><strong>MARCA:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraOptica']['moden']['marca']); ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>CLAVE:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraOptica']['claveAcceso']); ?></td>
        <td class="text-center"><strong>BANDA:</strong></td>
        <td class="text-center"><?= htmlspecialchars(implode(", ", $fichaTecnica['fibraOptica']['moden']['banda'])); ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>VLAN:</strong></td>
        <td class="text-center"></td>
        <td class="text-center"><strong>ANTENA:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraOptica']['moden']['numeroantena']); ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>SSID:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraOptica']['moden']['ssid']); ?></td>
        <td class="text-center"><strong>CATV:</strong></td>
        <td class="text-center"><?= $fichaTecnica['fibraOptica']['moden']['catv'] ? 'Sí' : 'No'; ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>SEGURIDAD:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraOptica']['moden']['seguridad']); ?></td>
        <td class="text-center"><strong>MAC:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraOptica']['moden']['codigoBarra']) ?></td>
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
      <?php foreach ($fichaTecnica['fibraOptica']['repetidores'] as $repetidor): ?>
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
          <td rowspan="5" class="text-center"><?= htmlspecialchars($fichaTecnica['fibraOptica']['detallesModen']); ?></td>
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