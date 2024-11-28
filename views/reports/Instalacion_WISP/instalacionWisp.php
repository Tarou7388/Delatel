<?php
$HOST = "http://localhost/DELATEL";
?>

<img src="<?= $HOST ?>/image/headerInstalacionWisp.png" class="image-header" alt="">
<br>
<div>
  <table class="tabla2">
    <tbody>
      <tr>
        <td class="text-center"><strong>Troncal:</strong></td>
        <td class="text-center"><?= $resultado[0]['id_contrato']; ?></td>
        <td class="text-center"><strong>Fecha:</strong></td>
        <td class="text-center"><?= $fechaActual; ?></td>
      </tr>
    </tbody>
  </table>
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
        <td class="text-center"><strong>CLIENTE:</strong></td>
        <td colspan="5" class="text-center"><?= $resultado[0]['NombreCliente']; ?></td>
        <td class="text-center"><strong>DNI:</strong></td>
        <td colspan="2" class="text-center"><?= $resultado[0]['NumeroDocumento']; ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>CELULAR:</strong></td>
        <td colspan="2" class="text-center"><?= $resultado[0]['Telefono']; ?></td>
        <td class="text-center" colspan="2"><strong>DIRECCIÓN:</strong></td>
        <td colspan="4" class="text-center"><?= $resultado[0]['DireccionContrato']; ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>ZONA:</strong></td>
        <td colspan="2" class="text-center"><?= $resultado[0]['Sector']; ?></td>
        <td class="text-center"><strong>DISTRITO:</strong></td>
        <td colspan="2" class="text-center"><?= $resultado[0]['Distrito']; ?></td>
        <td class="text-center"><strong>PROVINCIA:</strong></td>
        <td colspan="2" class="text-center"><?= $resultado[0]['Provincia']; ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>DPTO:</strong></td>
        <td class="text-center"><?= $resultado[0]['Departamento']; ?></td>
        <td class="text-center" colspan="2"><strong>PLAN CONTRATADO:</strong></td>
        <td colspan="3" class="text-center"><?= $resultado[0]['NombrePaquete']; ?></td>
        <td class="text-center"><strong>COSTO:</strong></td>
        <td class="text-center"><?= $resultado[0]['PrecioPaquete']; ?></td>
      </tr>
    </tbody>
  </table>
</div>

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
        <td class="text-center"><strong>EQUIPO:</strong></td>
        <td></td>
        <td class="text-center"><strong>SIGNAL STRENGTH</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['parametros']['signalStrength']) ?></td>
        <td class="text-center"><strong>FRECUENCIA:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['parametros']['frecuencia'][0]) ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>NOISE FLOOR:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['parametros']['noiseFloor']) ?></td>
        <td class="text-center"><strong>TRANSMIT CCQ:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['parametros']['transmiTccq']) ?></td>
        <td class="text-center"><strong>BASE:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['parametros']['base'][0]) ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>SUB-BASE:</strong></td>
        <td class="text-center" colspan="2"><?= htmlspecialchars($fichaTecnica['parametros']['subBase'][0]) ?></td>
        <td class="text-center"><strong>TX/RX RATE:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['parametros']['txRate']) ?></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['parametros']['rxRate']) ?></td>
      </tr>
    </tbody>
  </table>
</div>

<div>
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="2" class="text-center thead-cabecera"><strong>MODO ROUTER</strong></td>
        <td colspan="2" class="text-center thead-cabecera-2"><strong>CONF. WIRELESS</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center"><strong>WAN:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['wan']) ?></td>
        <td class="text-center"><strong>LAN:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['ConfiWireless']['lan']) ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>MASCARA:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['mascara']) ?></td>
        <td class="text-center"><strong>ACCESO:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['ConfiWireless']['acceso']) ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>PUERTA DE ENLACE:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['puertaEnlace']) ?></td>
        <td class="text-center"><strong>SSID:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['ConfiWireless']['ssid']) ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>DNS1:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['dns1']) ?></td>
        <td class="text-center"><strong>SEGURIDAD:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['ConfiWireless']['seguridad']) ?></td>
      </tr>
      <tr>
        <td class="text-center"><strong>DNS2:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['dns2']) ?></td>
        <td class="text-center"><strong>OTROS:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['ConfiWireless']['otros']) ?></td>
      </tr>
    </tbody>
  </table>
</div>

<div>
  <table class="tabla2">
    <?php if (isset($fichaTecnica['venta'])): ?>
      <thead>
        <tr>
          <td colspan="6" class="text-center thead-cabecera"><strong>DETALLE EQUIPOS VENTA</strong></td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center"><strong>COSTO ANTENA:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['costoAntena']) ?></td>
          <td colspan="2" class="text-center thead-cabecera-3"><strong>ANTENA</strong></td>
          <td colspan="2" class="text-center thead-cabecera-4"><strong>ROUTER</strong></td>
        </tr>
        <tr>
          <td class="text-center"><strong>COSTO ROUTER:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['costoRouter']) ?></td>
          <td class="text-center"><strong>MARCA:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['antena']['marca']) ?></td>
          <td class="text-center"><strong>MODELO:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['router']['modelo']) ?></td>
        </tr>
        <tr>
          <td class="text-center"><strong>SUBTOTAL:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['subTotal']) ?></td>
          <td class="text-center"><strong>MODELO:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['antena']['modelo']) ?></td>
          <td class="text-center"><strong>MARCA:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['router']['marca']) ?></td>
        </tr>
        <tr>
          <td class="text-center"><strong>ADELANTO:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['adelanto']) ?></td>
          <td class="text-center"><strong>MAC:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['antena']['mac']) ?></td>
          <td class="text-center"><strong>MAC:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['router']['mac']) ?></td>
        </tr>
        <tr>
          <td class="text-center"><strong>SALDO EQUIPOS:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['saldoEquipos']) ?></td>
          <td class="text-center"><strong>SERIAL:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['antena']['serial']) ?></td>
          <td class="text-center"><strong>SERIAL:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['router']['serial']) ?></td>
        </tr>
        <tr>
          <td class="text-center"><strong>MATERIAL ADICI:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['materialAdicional']) ?></td>
          <td class="text-center"><strong>DESCRIPCIÓN:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['antena']['descripcion']) ?></td>
          <td class="text-center"><strong>DESCRIPCIÓN:</strong></td>
          <td class="text-center"><?= htmlspecialchars($fichaTecnica['venta']['router']['descripcion']) ?></td>
        </tr>
        <tr>
          <td class="text-center"><strong>CONDICIÓN PAG:</strong></td>
          <td class="text-center"><strong>ADELANTADO:</strong></td>
          <td class="text-center"><input type="checkbox" <?= $fichaTecnica['venta']['condicion']['Adelantado'] ? 'checked' : '' ?> disabled></td>
          <td class="text-center" colspan="2"><strong>CUMPLIENDO EL MES:</strong></td>
          <td class="text-center"><input type="checkbox" <?= $fichaTecnica['venta']['condicion']['Cumpliendo el mes'] ? 'checked' : '' ?> disabled></td>
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
          <td colspan="6" class="text-center thead-cabecera"><strong>DETALLE EQUIPOS ALQUILADOS / PRESTADOS</strong></td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center">CONDICIÓN:</td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['condicion']) ?></td>
          <td colspan="2" class="text-center thead-cabecera-3"><strong>ANTENA</strong></td>
          <td colspan="2" class="text-center thead-cabecera-4"><strong>ROUTER</strong></td>
        </tr>
        <tr>
          <td class="text-center">PERIODO:</td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['periodo']) ?></td>
          <td class="text-center">MARCA:</td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['antena']['marca']) ?></td>
          <td class="text-center">MARCA:</td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['router']['marca']) ?></td>
        </tr>
        <tr>
          <td class="text-center">F. INICIO:</td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['fechaInicio']) ?></td>
          <td class="text-center">MODELO:</td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['antena']['modelo']) ?></td>
          <td class="text-center">MODELO:</td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['router']['modelo']) ?></td>
        </tr>
        <tr>
          <td class="text-center">F. TERMINO:</td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['fechaFin']) ?></td>
          <td class="text-center">MAC:</td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['antena']['mac']) ?></td>
          <td class="text-center">MAC:</td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['router']['mac']) ?></td>
        </tr>
        <tr>
          <td class="text-center">COSTO ALQUILER:</td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['costoAlquiler']) ?></td>
          <td class="text-center">DESCRIPCIÓN:</td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['antena']['descripcion']) ?></td>
          <td class="text-center">DESCRIPCIÓN:</td>
          <td><?= htmlspecialchars($fichaTecnica['alquilado']['router']['descripcion']) ?></td>
        </tr>
        <tr>
          <td class="text-center">CONDICIÓN PAG:</td>
          <td class="text-center">ADELANTADO:</td>
          <td class="text-center"><input type="checkbox" <?= $fichaTecnica['alquilado']['condicionTiempo']['Adelantado'] ? 'checked' : '' ?> disabled></td>
          <td class="text-center" colspan="2">CUMPLIENDO EL MES:</td>
          <td class="text-center"><input type="checkbox" <?= $fichaTecnica['alquilado']['condicionTiempo']['Cumpliendo el mes'] ? 'checked' : '' ?> disabled></td>
        </tr>
        <tr>
          <td rowspan="5" class="text-center">DETALLES:</td>
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
        <td colspan="2" class="text-center"><strong>PAGO SERVICIO:</strong></td>
        <td colspan="1" class="text-center"><?= htmlspecialchars($fichaTecnica['deuda']['pagoServicio']) ?></td>
        <td colspan="2" class="text-center"><strong>SALDO PENDIENTE:</strong></td>
        <td colspan="1" class="text-center"><?= htmlspecialchars($fichaTecnica['deuda']['saldoPendiente']) ?></td>
        <td colspan="2" class="text-center"><strong>ADELANTO EQUIPO:</strong></td>
        <td colspan="1" class="text-center"><?= htmlspecialchars($fichaTecnica['deuda']['adelantoEquipo']) ?></td>
      </tr>
      <tr>
        <td colspan="2" class="text-center"><strong>COSTO DE ALQUILER:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['deuda']['costoAlquiler']) ?></td>
        <td colspan="2" class="text-center"><strong>MATERIAL ADICIONAL:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['deuda']['materialAdicional']) ?></td>
        <td colspan="2" class="text-center"><strong>TOTAL CANCELADO:</strong></td>
        <td class="text-center"><?= htmlspecialchars($fichaTecnica['deuda']['totalCancelado']) ?></td>
      </tr>
      <tr>
        <td colspan="9" class="text-center thead-cabecera-3"><strong>DETALLES:</strong></td>
      </tr>
      <tr>
        <td rowspan="6" colspan="9"><?= htmlspecialchars($fichaTecnica['deuda']['detalle']) ?></td>
      </tr>
      <!-- <tr>
        <td class="text-center">INSTALADOR:</td>
        <td colspan="3"></td>
        <td class="text-center">HORA:</td>
        <td colspan="2"></td>
      </tr> -->
    </tbody>
  </table>
</div>