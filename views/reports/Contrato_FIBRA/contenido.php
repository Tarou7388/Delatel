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
        <td colspan="4" class="text-center thead-cabecera"><strong>CONEXIÓN FTTH - FIBRA OPTICA</strong></td>
      </tr>
      <tr>
        <td colspan="2" class="text-center thead-cabecera"><strong>MODO PPPoE</strong></td>
        <td colspan="2" class="text-center thead-cabecera-2"><strong>DETALLES EQUIPO</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center">USUARIO:</td>
        <td><?= htmlspecialchars($fichaTecnica['fibraOptica']['usuario']); ?></td>
        <td class="text-center">MARCA:</td>
        <td><?= htmlspecialchars($fichaTecnica['fibraOptica']['moden']['marca']); ?></td>
      </tr>
      <tr>
        <td class="text-center">CLAVE:</td>
        <td><?= htmlspecialchars($fichaTecnica['fibraOptica']['claveAcceso']); ?></td>
        <td class="text-center">BANDA:</td>
        <td><?= htmlspecialchars(implode(", ", $fichaTecnica['fibraOptica']['moden']['banda'])); ?></td>
      </tr>
      <tr>
        <td class="text-center">VLAN:</td>
        <td></td>
        <td class="text-center">ANTENA:</td>
        <td><?= htmlspecialchars($fichaTecnica['fibraOptica']['moden']['numeroantena']); ?></td>
      </tr>
      <tr>
        <td class="text-center">SSID:</td>
        <td><?= htmlspecialchars($fichaTecnica['fibraOptica']['moden']['ssid']); ?></td>
        <td class="text-center">CATV:</td>
        <td><?= $fichaTecnica['fibraOptica']['moden']['catv'] ? 'Sí' : 'No'; ?></td>
      </tr>
      <tr>
        <td class="text-center">SEGURIDAD:</td>
        <td><?= htmlspecialchars($fichaTecnica['fibraOptica']['moden']['seguridad']); ?></td>
        <td class="text-center">MAC:</td>
        <td></td>
      </tr>
      <tr>
        <td colspan="1" class="text-center">DETALLES: </td>
        <td colspan="3"><?= htmlspecialchars($fichaTecnica['fibraOptica']['detallesModen']); ?></td>
      </tr>
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
      <tr>
        <td class="text-center">REPETIDOR:</td>
        <td><?= htmlspecialchars($fichaTecnica['fibraOptica']['repetidores'][0]['numero']); ?></td>
        <td class="text-center">COSTO:</td>
        <td></td>
      </tr>
      <tr>
        <td class="text-center">MARCA:</td>
        <td><?= htmlspecialchars($fichaTecnica['fibraOptica']['repetidores'][0]['marca']); ?></td>
        <td rowspan="5" class="text-center">DETALLES:</td>
        <td rowspan="5"></td>
      </tr>
      <tr>
        <td class="text-center">CONDICION:</td>
        <td></td>
      </tr>
      <tr>
        <td class="text-center">IP:</td>
        <td><?= htmlspecialchars($fichaTecnica['fibraOptica']['repetidores'][0]['ip']); ?></td>
      </tr>
      <tr>
        <td class="text-center">SSID:</td>
        <td><?= htmlspecialchars($fichaTecnica['fibraOptica']['repetidores'][0]['ssid']); ?></td>
      </tr>
      <tr>
        <td class="text-center">CLAVE:</td>
        <td><?= htmlspecialchars($fichaTecnica['fibraOptica']['repetidores'][0]['contrasenia']); ?></td>
      </tr>
      <tr>
        <td colspan="1" class="text-center">NOTAS: </td>
        <td colspan="3"></td>
      </tr>
    </tbody>
  </table>
</div>