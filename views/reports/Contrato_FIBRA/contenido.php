<?php
$HOST = "http://localhost/Delatel";
?>

<h3 class="text-center">CONTROL DE INSTALACIÓN SERVICIO FTTH - DELAFIBER</h3>

<!-- Información de Contrato y Fecha alineada a la derecha -->
<div class="container">
  <div style="text-align: right; font-family: Arial, sans-serif; font-size: 12px; margin-right: 35px;">
    <p><strong>N°:</strong> <?= $resultado[0]['id_contrato']; ?> &nbsp; <strong>Fecha:</strong> <?= $fechaActual; ?></p>
  </div>
</div>

<div class="container">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="4" class="text-center thead-cabecera"><strong>DATOS DEL USUARIO</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>CLIENTE:</strong></td>
        <td class="text-center"><?= $resultado[0]['NombreCliente']; ?></td>
        <td><strong>DNI:</strong></td>
        <td class="text-center"><?= $resultado[0]['NumeroDocumento']; ?></td>
      </tr>
      <tr>
        <td><strong>DIRECCIÓN:</strong></td>
        <td class="text-center"><?= $resultado[0]['DireccionContrato']; ?></td>
        <td><strong>CELULAR:</strong></td>
        <td class="text-center"><?= $resultado[0]['Telefono']; ?></td>
      </tr>
      <tr>
        <td><strong>REFERENCIA:</strong></td>
        <td class="text-center"><?= $resultado[0]['Referencia']; ?></td>
        <td><strong>ZONA:</strong></td>
        <td class="text-center"><?= $resultado[0]['Sector']; ?></td>
      </tr>
      <tr>
        <td><strong>PLAN:</strong></td>
        <td class="text-center"><?= $resultado[0]['NombrePaquete']; ?></td>
        <td><strong>PRECIO:</strong></td>
        <td class="text-center">S/. <?= $resultado[0]['PrecioPaquete']; ?></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="container">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="4" class="text-center thead-cabecera"><strong>CONEXIÓN FTTH - FIBRA ÓPTICA</strong></td>
      </tr>
      <tr>
        <td colspan="2" class="text-center thead-cabecera"><strong>MODO PPPoE</strong></td>
        <td colspan="2" class="text-center thead-cabecera-2"><strong>DETALLES EQUIPO</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>USUARIO:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraoptica']['usuario']); ?></td>
        <td><strong>MARCA:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraoptica']['router']['marca']); ?></td>
      </tr>
      <tr>
        <td><strong>CLAVE:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraoptica']['claveacceso']); ?></td>
        <td><strong>BANDA:</strong></td>
        <td class="text-center"><?= htmlspecialchars(implode(", ", $fichaTecnica['fibraoptica']['router']['banda'])); ?></td>
      </tr>
      <tr>
        <td><strong>VLAN:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraoptica']['vlan']); ?></td>
        <td><strong>N° ANTENA:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraoptica']['router']['numeroantena']); ?></td>
      </tr>
      <tr>
        <td><strong>SSID:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraoptica']['router']['ssid']); ?></td>
        <td><strong>CATV:</strong></td>
        <td class="text-center"><?= $fichaTecnica['fibraoptica']['router']['catv'] ? 'Sí' : 'No'; ?></td>
      </tr>
      <tr>
        <td><strong>SEGURIDAD:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraoptica']['router']['seguridad']); ?></td>
        <td><strong>MAC:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraoptica']['router']['codigobarra']) ?></td>
      <?php if (!empty($fichaTecnica['fibraoptica']['detalles'])): ?>
        <tr>
          <td colspan="4" class="text-center"><strong>DETALLES:</strong></td>
        </tr>
        <tr>
          <td colspan="4"><?= htmlspecialchars($fichaTecnica['fibraoptica']['detalles']); ?></td>
        </tr>
      <?php endif; ?>
    </tbody>
  </table>
</div>

<div class="container">
  <table class="tabla2">
    <?php if (!empty($fichaTecnica['fibraoptica']['repetidores'])): ?>
      <?php foreach ($fichaTecnica['fibraoptica']['repetidores'] as $repetidor): ?>
        <thead>
          <tr>
            <td colspan="6" class="text-center thead-cabecera"><strong>EQUIPOS ADICIONALES WIFI</strong></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>REPETIDOR:</strong></td>
            <td class="text-center"><?= htmlspecialchars($repetidor['numero']); ?></td>
            <td><strong>COSTO:</strong></td>
            <td class="text-center">S/. <?= htmlspecialchars($repetidor['precio']); ?></td>
            <td><strong>MARCA:</strong></td>
            <td class="text-center"><?= htmlspecialchars($repetidor['marca']); ?></td>
          </tr>
          <tr>
            <td><strong>CONDICIÓN:</strong></td>
            <td class="text-center" colspan="2"><?= htmlspecialchars($repetidor['condicion']); ?></td>
            <td><strong>IP:</strong></td>
            <td class="text-center" colspan="2"><?= htmlspecialchars($repetidor['ip']); ?></td>
          </tr>
          <tr>
            <td><strong>SSID:</strong></td>
            <td class="text-center" colspan="2"><?= htmlspecialchars($repetidor['ssid']); ?></td>
            <td><strong>CLAVE:</strong></td>
            <td class="text-center" colspan="2"><?= htmlspecialchars($repetidor['contrasenia']); ?></td>
          </tr>
        <?php endforeach; ?>
      <?php endif; ?>
        </tbody>
  </table>
</div>