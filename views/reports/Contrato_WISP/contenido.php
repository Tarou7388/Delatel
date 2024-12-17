<?php
$HOST = "http://localhost/Delatel";
?>

<h3 class="text-center">CONTROL DE INSTALACIÓN SERVICIO WISP - COMPUIVAN</h3>

<!-- Información de Contrato y Fecha alineada a la derecha -->
<div class="container">
  <div style="text-align: right; font-family: Arial, sans-serif; font-size: 12px; margin-right: 25px;">
    <p><strong>N°:</strong> <?= $resultado[0]['id_contrato']; ?> &nbsp; <strong>Fecha:</strong> <?= $fechaActual; ?></p>
  </div>
</div>

<div>
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="9" class="text-center thead-cabecera"><strong>DATOS DEL USUARIO</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>CLIENTE:</strong></td>
        <td colspan="5" class="text-center"><?= $resultado[0]['NombreCliente']; ?></td>
        <td><strong>DNI:</strong></td>
        <td colspan="2" class="text-center"><?= $resultado[0]['NumeroDocumento']; ?></td>
      </tr>
      <tr>
        <td><strong>CELULAR:</strong></td>
        <td colspan="2" class="text-center"><?= $resultado[0]['Telefono']; ?></td>
        <td colspan="2"><strong>DIRECCIÓN:</strong></td>
        <td colspan="4" class="text-center"><?= $resultado[0]['DireccionContrato']; ?></td>
      </tr>
      <tr>
        <td><strong>ZONA:</strong></td>
        <td colspan="2" class="text-center"><?= $resultado[0]['Sector']; ?></td>
        <td><strong>DISTRITO:</strong></td>
        <td colspan="2" class="text-center"><?= $resultado[0]['Distrito']; ?></td>
        <td><strong>PROVINCIA:</strong></td>
        <td colspan="2" class="text-center"><?= $resultado[0]['Provincia']; ?></td>
      </tr>
      <tr>
        <td><strong>DPTO:</strong></td>
        <td class="text-center"><?= $resultado[0]['Departamento']; ?></td>
        <td colspan="2"><strong>PLAN CONTRATADO:</strong></td>
        <td colspan="3" class="text-center"><?= $resultado[0]['NombrePaquete']; ?></td>
        <td><strong>COSTO:</strong></td>
        <td class="text-center">S/. <?= $resultado[0]['PrecioPaquete']; ?></td>
      </tr>
    </tbody>
  </table>
</div>

<div>
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="6" class="text-center thead-cabecera"><strong>PARAMETROS TECNICOS</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>PERIODO:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['parametros']['periodo']) ?></td>
        <td><strong>SIGNAL STRENGTH</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['parametros']['signalstrength']) ?></td>
        <td><strong>FRECUENCIA:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['parametros']['frecuencia'][0]) ?></td>
      </tr>
      <tr>
        <td><strong>NOISE FLOOR:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['parametros']['noisefloor']) ?></td>
        <td><strong>TRANSMIT CCQ:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['parametros']['transmitccq']) ?></td>
        <td><strong>BASE:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['parametros']['base'][0]['nombre']) ?> (ID: <?= htmlspecialchars($fichaTecnica['parametros']['base'][0]['id']) ?>)</td>
      </tr>
      <tr>
        <td><strong>SUB-BASE:</strong></td>
        <td class="text-center" colspan="2"><?= htmlspecialchars($fichaTecnica['parametros']['subbase'][0]['nombre']) ?> (ID: <?= htmlspecialchars($fichaTecnica['parametros']['subbase'][0]['id']) ?>)</td>
        <td><strong>TX/RX RATE:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['parametros']['txrate']) ?></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['parametros']['rxrate']) ?></td>
      </tr>
    </tbody>
  </table>
</div>

<div>
  <table class="tabla2">
    <?php if (isset($fichaTecnica['venta'])): ?>
      <thead>
        <tr>
          <td colspan="7" class="text-center thead-cabecera"><strong>DETALLE EQUIPOS VENTA</strong></td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>COSTO ANTENA:</strong></td>
          <td class="text-center">S/. <?= htmlspecialchars($fichaTecnica['venta']['costoantena']) ?></td>
          <td colspan="2" class="text-center thead-cabecera-3"><strong>ANTENA</strong></td>
          <td colspan="3" class="text-center thead-cabecera-4"><strong>ROUTER</strong></td>
        </tr>
        <tr>
          <td><strong>COSTO ROUTER:</strong></td>
          <td class="text-center">S/. <?= htmlspecialchars($fichaTecnica['venta']['costorouter']) ?></td>
          <td><strong>MARCA:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['antena']['marca']) ?></td>
          <td><strong>MODELO:</strong></td>
          <td class="text-center" colspan="2"><?= htmlspecialchars($fichaTecnica['venta']['router']['modelo']) ?></td>
        </tr>
        <tr>
          <td><strong>SUBTOTAL:</strong></td>
          <td class="text-center">S/. <?= htmlspecialchars($fichaTecnica['venta']['subtotal']) ?></td>
          <td><strong>MODELO:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['antena']['modelo']) ?></td>
          <td><strong>MARCA:</strong></td>
          <td class="text-center" colspan="2"><?= htmlspecialchars($fichaTecnica['venta']['router']['marca']) ?></td>
        </tr>
        <tr>
          <td><strong>ADELANTO:</strong></td>
          <td class="text-center">S/. <?= htmlspecialchars($fichaTecnica['venta']['adelanto']) ?></td>
          <td><strong>MAC:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['antena']['mac']) ?></td>
          <td><strong>MAC:</strong></td>
          <td class="text-center" colspan="2"><?= htmlspecialchars($fichaTecnica['venta']['router']['mac']) ?></td>
        </tr>
        <tr>
          <td><strong>SALDO EQUIPOS:</strong></td>
          <td class="text-center">S/. <?= htmlspecialchars($fichaTecnica['venta']['saldoequipos']) ?></td>
          <td><strong>SERIAL:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['antena']['serial']) ?></td>
          <td><strong>SERIAL:</strong></td>
          <td class="text-center" colspan="2"><?= htmlspecialchars($fichaTecnica['venta']['router']['serial']) ?></td>
        </tr>
        <tr>
          <td><strong>MATERIAL ADICI:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['materialadicional']) ?></td>
          <td><strong>DESCRIPCIÓN:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['antena']['descripcion']) ?></td>
          <td><strong>DESCRIPCIÓN:</strong></td>
          <td class="text-center" colspan="2"><?= htmlspecialchars($fichaTecnica['venta']['router']['descripcion']) ?></td>
        </tr>
        <tr>
          <td class="text-center"><strong>CONDICIÓN PAG:</strong></td>
          <td class="text-center"><strong>ADELANTADO:</strong></td>
          <td class="text-center"><input type="checkbox" <?= $fichaTecnica['venta']['condicion']['adelantado'] ? 'checked' : '' ?> disabled></td>
          <td class="text-center" colspan="2"><strong>CUMPLIENDO EL MES:</strong></td>
          <td class="text-center" colspan="2"><input type="checkbox" <?= $fichaTecnica['venta']['condicion']['cumpliendo el mes'] ? 'checked' : '' ?> disabled></td>
        </tr>
        <tr>
          <td rowspan="6" class="text-center"><strong>DETALLES:</strong></td>
          <td rowspan="6" colspan="6"><?= htmlspecialchars($fichaTecnica['venta']['detalle']) ?></td>
        </tr>
      <?php endif; ?>
      </tbody>
  </table>
</div>

<div>
  <table class="tabla2">
    <?php if (isset($fichaTecnica['alquilado'])): ?>
      <thead>
        <tr>
          <td colspan="7" class="text-center thead-cabecera"><strong>DETALLE EQUIPOS ALQUILADOS / PRESTADOS</strong></td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>CONDICIÓN:</strong></td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['condicion']) ?></td>
          <td colspan="2" class="text-center thead-cabecera-3"><strong>ANTENA</strong></td>
          <td colspan="3" class="text-center thead-cabecera-4"><strong>ROUTER</strong></td>
        </tr>
        <tr>
          <td><strong>PERIODO:</strong></td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['periodo']) ?></td>
          <td><strong>MARCA:</strong></td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['antena']['marca']) ?></td>
          <td><strong>MARCA:</strong></td>
          <td colspan="2"><?= htmlspecialchars($fichaTecnica['alquilado']['router']['marca']) ?></td>
        </tr>
        <tr>
          <td><strong>F. INICIO:</strong></td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['fechaInicio']) ?></td>
          <td><strong>MODELO:</strong></td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['antena']['modelo']) ?></td>
          <td><strong>MODELO:</strong></td>
          <td colspan="2"><?= htmlspecialchars($fichaTecnica['alquilado']['router']['modelo']) ?></td>
        </tr>
        <tr>
          <td><strong>F. TERMINO:</strong></td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['fechafin']) ?></td>
          <td><strong>MAC:</strong></td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['antena']['mac']) ?></td>
          <td><strong>MAC:</strong></td>
          <td colspan="2"><?= htmlspecialchars($fichaTecnica['alquilado']['router']['mac']) ?></td>
        </tr>
        <tr>
          <td><strong>COSTO ALQUILER:</strong></td>
          <td>S/. <?= htmlspecialchars($fichaTecnica['alquilado']['costoalquiler']) ?></td>
          <td><strong>DESCRIPCIÓN:</strong></td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['antena']['descripcion']) ?></td>
          <td><strong>DESCRIPCIÓN:</strong></td>
          <td colspan="2"><?= htmlspecialchars($fichaTecnica['alquilado']['router']['descripcion']) ?></td>
        </tr>
        <tr>
          <td class="text-center"><strong>CONDICIÓN PAG:</strong></td>
          <td class="text-center"><strong>ADELANTADO:</strong></td>
          <td class="text-center"><input type="checkbox" <?= $fichaTecnica['alquilado']['condiciontiempo']['adelantado'] ? 'checked' : '' ?> disabled></td>
          <td class="text-center" colspan="2"><strong>CUMPLIENDO EL MES:</strong></td>
          <td class="text-center" colspan="2"><input type="checkbox" <?= $fichaTecnica['alquilado']['condiciontiempo']['cumpliendo el mes'] ? 'checked' : '' ?> disabled></td>
        </tr>
        <tr>
          <td rowspan="5"><strong>DETALLES:</strong></td>
          <td rowspan="5" colspan="6"><?= htmlspecialchars($fichaTecnica['alquilado']['detalle']) ?></td>
        </tr>
      <?php endif; ?>
      </tbody>
  </table>
</div>

<div>
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="7" class="text-center thead-cabecera">FICHAS DE CONTROL INTERNO PARA TODOS LOS MODOS DE INSTALACIONES</td>
        <td class="text-center"><strong>N°</strong></td>
        <td class="text-center"><?= htmlspecialchars($resultado[0]['id_contrato']); ?></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td colspan="2"><strong>PAGO SERVICIO:</strong></td>
        <td colspan="1" class="text-center">S/. <?= htmlspecialchars($fichaTecnica['deuda']['pagoservicio']) ?></td>
        <td colspan="2"><strong>SALDO PENDIENTE:</strong></td>
        <td colspan="1" class="text-center">S/. <?= htmlspecialchars($fichaTecnica['deuda']['saldopendiente']) ?></td>
        <td colspan="2"><strong>ADELANTO EQUIPO:</strong></td>
        <td colspan="1" class="text-center">S/. <?= htmlspecialchars($fichaTecnica['deuda']['adelantoequipo']) ?></td>
      </tr>
      <tr>
        <td colspan="2"><strong>COSTO DE ALQUILER:</strong></td>
        <td class="text-center">S/. <?= htmlspecialchars($fichaTecnica['deuda']['costoalquiler']) ?></td>
        <td colspan="2"><strong>MATERIAL ADICIONAL:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['deuda']['materialadicional']) ?></td>
        <td colspan="2"><strong>TOTAL CANCELADO:</strong></td>
        <td class="text-center">S/. <?= htmlspecialchars($fichaTecnica['deuda']['totalcancelado']) ?></td>
      </tr>
      <?php if (!empty($fichaTecnica['deuda']['detalle'])): ?>
      <tr>
        <td colspan="9" class="text-center thead-cabecera-3"><strong>DETALLES:</strong></td>
      </tr>
      <tr>
        <td colspan="9"><?= htmlspecialchars($fichaTecnica['deuda']['detalle']) ?></td>
      </tr>
      <?php endif; ?>
      <!-- <tr>
        <td class="text-center">INSTALADOR:</td>
        <td colspan="3"></td>
        <td class="text-center">HORA:</td>
        <td colspan="2"></td>
      </tr> -->
    </tbody>
  </table>
</div>
<br>
<br>
<br>
<br>
<br>
<!-- Aqui va los routers -->
<br>
<br>
<br>
<br>
<br>
<br>
<div>
  <table class="tabla2">
    <?php foreach ($fichaTecnica['parametros']['routers'] as $router): ?>
      <thead>
        <tr>
          <td colspan="4" class="text-center thead-cabecera"><strong>ROUTERS</strong></td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="2" class="text-center thead-cabecera"><strong>MODO ROUTER</strong></td>
          <td colspan="2" class="text-center thead-cabecera-2"><strong>CONF. WIRELESS</strong></td>
        </tr>
        <tr>
          <td><strong>WAN:</strong></td>
          <td class="text-center"><?= htmlspecialchars($router['wan']) ?></td>
          <td><strong>LAN:</strong></td>
          <td class="text-center"><?= htmlspecialchars($router['lan']) ?></td>
        </tr>
        <tr>
          <td><strong>MASCARA:</strong></td>
          <td class="text-center"><?= htmlspecialchars($router['mascara']) ?></td>
          <td><strong>ACCESO:</strong></td>
          <td class="text-center"><?= htmlspecialchars($router['acceso']) ?></td>
        </tr>
        <tr>
          <td><strong>PUERTA DE ENLACE:</strong></td>
          <td class="text-center"><?= htmlspecialchars($router['puertaenlace']) ?></td>
          <td><strong>SSID:</strong></td>
          <td class="text-center"><?= htmlspecialchars($router['ssid']) ?></td>
        </tr>
        <tr>
          <td><strong>DNS1:</strong></td>
          <td class="text-center"><?= htmlspecialchars($router['dns1']) ?></td>
          <td><strong>SEGURIDAD:</strong></td>
          <td class="text-center"><?= htmlspecialchars($router['seguridad']) ?></td>
        </tr>
        <tr>
          <td><strong>DNS2:</strong></td>
          <td class="text-center"><?= htmlspecialchars($router['dns2']) ?></td>
          <td><strong>OTROS:</strong></td>
          <td class="text-center"><?= htmlspecialchars($router['otros']) ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
  </table>
</div>