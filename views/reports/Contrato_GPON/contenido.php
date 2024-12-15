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
        <td><strong>USUARIO:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraOptica']['usuario']); ?></td>
        <td><strong>MARCA:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraOptica']['moden']['marca']); ?></td>
      </tr>
      <tr>
        <td><strong>CLAVE:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraOptica']['claveacceso']); ?></td>
        <td><strong>BANDA:</strong></td>
        <td class="text-center"><?= htmlspecialchars(implode(", ", $fichaTecnica['fibraOptica']['moden']['banda'])); ?></td>
      </tr>
      <tr>
        <td><strong>VLAN:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraOptica']['vlan']); ?></td>
        <td><strong>N° ANTENA:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraOptica']['moden']['numeroantena']); ?></td>
      </tr>
      <tr>
        <td><strong>SSID:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraOptica']['moden']['ssid']); ?></td>
        <td><strong>CATV:</strong></td>
        <td class="text-center"><?= $fichaTecnica['fibraOptica']['moden']['catv'] ? 'Sí' : 'No'; ?></td>
      </tr>
      <tr>
        <td><strong>SEGURIDAD:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraOptica']['moden']['seguridad']); ?></td>
        <td><strong>MAC:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraOptica']['moden']['codigoBarra']) ?></td>
        <?php if (!empty($fichaTecnica['fibraOptica']['detalles'])): ?>
      <tr>
        <td colspan="4" class="text-center"><strong>DETALLES:</strong></td>
      </tr>
      <tr>
        <td colspan="4"><?= htmlspecialchars($fichaTecnica['fibraOptica']['detalles']); ?></td>
      </tr>
    <?php endif; ?>
    </tbody>
  </table>
</div>

<div class="container">
  <table class="tabla2">
    <?php if (!empty($fichaTecnica['fibraOptica']['repetidores'])): ?>
      <?php foreach ($fichaTecnica['fibraOptica']['repetidores'] as $repetidor): ?>
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
        <td colspan="5"><?= htmlspecialchars($fichaTecnica['cable']['planCable']); ?></td>
      </tr>
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
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['fibraOptica']['periodo']); ?></td>
        <td><strong>SPLITTER:</strong></td>
        <td class="text-center">CANTIDAD: <?= htmlspecialchars($fichaTecnica['cable']['splitter'][0]['cantidad']); ?></td>
        <td><strong>TIPO:</strong></td>
        <td class="text-center"> <?= htmlspecialchars($fichaTecnica['cable']['splitter'][0]['tipo']); ?></td>
      </tr>
      <tr>
        <td><strong>CABLE:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['cable']['metrosadicionales']); ?></td>
        <td class="text-center">S./ <?= htmlspecialchars($fichaTecnica['cable']['cable']['preciometro']); ?></td>
        <td><strong>CONECTORES:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['cable']['conector']['numeroconector']); ?></td>
        <td class="text-center">S./ <?= htmlspecialchars($fichaTecnica['cable']['conector']['precio']); ?></td>
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
        <td><?= !empty($fichaTecnica['costo']['cableCosto']['numerosintotizadores']) ? htmlspecialchars($fichaTecnica['costo']['cableCosto']['numerosintotizadores']) : 'No tiene'; ?></td>
        <td colspan="3" class="text-center thead-cabecera-4"><strong>MEDICIÓN EN CAJA NAP</strong></td>
      </tr>
      <tr>
        <td><strong>COSTO ALQUILER:</strong></td>
        <td><?= !empty($fichaTecnica['costo']['cableCosto']['costoAlquilerSintotizador']) ? 'S./ ' . htmlspecialchars($fichaTecnica['costo']['cableCosto']['costoAlquilerSintotizador']) : 'No tiene'; ?></td>
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
        <td>S./ <?= htmlspecialchars($fichaTecnica['costo']['cableCosto']['costoCable']); ?></td>
        <td colspan="3" class="text-center thead-cabecera-4"><strong>MEDICIÓN EN INTERIOR DE LA CASA</strong></td>
      </tr>
      <tr>
        <td><strong>COSTO CONECTOR:</strong></td>
        <td>S./ <?= htmlspecialchars($fichaTecnica['costo']['cableCosto']['costoConector']); ?></td>
        <td colspan="2"><strong>CASA GPON:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['costo']['casa']['gpon']); ?></td>
      </tr>
      <tr>
        <td><strong>CAJA:</strong></td>
        <td>Número <?= htmlspecialchars($fichaTecnica['idCaja']); ?></td>
        <td colspan="2"><strong>CASA CATV:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['costo']['casa']['catv']); ?></td>
      </tr>
      <?php if (!empty($fichaTecnica['costo']['cableCosto']['detalle'])): ?>
        <tr>
          <td colspan="5" class="text-center"><strong>DETALLES:</strong></td>
        </tr>
        <tr>
          <td colspan="5"><?= htmlspecialchars($fichaTecnica['costo']['cableCosto']['detalle']); ?></td>
        </tr>
      <?php endif; ?>
    </tbody>
  </table>
</div>

<br>
<br>
<br>
<br>
<?php if (!empty($fichaTecnica['fibraOptica']['repetidores'])): ?>
  <div class="container">
    <table class="tabla2">
      <thead>
        <tr>
          <td colspan="4" class="text-center thead-cabecera"><strong>REPETIDORES</strong></td>
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
            <td rowspan="5" class="text-center"><?= htmlspecialchars($fichaTecnica['fibraOptica']['detalles']); ?></td>
          </tr>
          <tr>
            <td class="text-center"><strong>CONDICIÓN:</strong></td>
            <td class="text-center"><?= htmlspecialchars($repetidor['condicion']); ?></td>
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
<?php endif; ?>
<br>
<br>
<br>
<br>
<br>
<?php if (!empty($fichaTecnica['cable']['sintonizadores'])): ?>
  <div class="container">
    <table class="tabla2">
      <thead>
        <tr>
          <td colspan="8" class="text-center"><strong>SINTONIZADORES</strong></td>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($fichaTecnica['cable']['sintonizadores'] as $sintonizador): ?>
          <tr>
            <td><strong>SINTONIZADOR:</strong></td>
            <td class="text-center" colspan="1"><?= htmlspecialchars($sintonizador['numero']); ?></td>
            <td><strong>CÓDIGO DE BARRA:</strong></td>
            <td class="text-center" colspan="5"><?= htmlspecialchars($sintonizador['codigoBarra']); ?></td>
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
            <td class="text-center" colspan="4"><?= htmlspecialchars($sintonizador['precio']); ?></td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
<?php endif; ?>
