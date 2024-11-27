<?php
$HOST = "http://localhost/DELATEL";
?>

<img src="<?= $HOST ?>/image/headerInstalacionWisp.png" class="image-header" alt="">

<div>
  <table class="tabla2">
    <tbody>
      <tr>
        <td class="text-center">Troncal:</td>
        <td><?= $resultado[0]['id_contrato']; ?></td>
        <td class="text-center">Fecha:</td>
        <td> <?= $fechaActual; ?></td>
      </tr>
    </tbody>
  </table>
</div>
<br>
<div>
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="6" class="text-center thead-cabecera"><strong>DATOS DEL USUARIO</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center">NOMBRES:</td>
        <td colspan="2"><?= $resultado[0]['NombreCliente']; ?></td>
        <td class="text-center">DNI:</td>
        <td colspan="2"><?= $resultado[0]['NumeroDocumento']; ?></td>
      </tr>
      <tr>
        <td class="text-center">APELLIDOS:</td>
        <td colspan="2"></td>
        <td class="text-center">CELULAR:</td>
        <td colspan="2"><?= $resultado[0]['Telefono']; ?></td>
      </tr>
      <tr>
        <td class="text-center">DIRECCIÓN:</td>
        <td colspan="2"><?= $resultado[0]['DireccionContrato']; ?></td>
        <td class="text-center">ZONA:</td>
        <td colspan="2"><?= $resultado[0]['Sector']; ?></td>
      </tr>
      <tr>
        <td class="text-center">DISTRITO:</td>
        <td><?= $resultado[0]['Distrito']; ?></td>
        <td class="text-center">PROVINCIA:</td>
        <td><?= $resultado[0]['Provincia']; ?></td>
        <td class="text-center">DPTO:</td>
        <td><?= $resultado[0]['Departamento']; ?></td>
      </tr>
      <tr>
        <td class="text-center">PLAN CONTRATADO:</td>
        <td colspan="2"><?= $resultado[0]['NombrePaquete']; ?></td>
        <td class="text-center">COSTO:</td>
        <td colspan="2"><?= $resultado[0]['PrecioPaquete']; ?></td>
      </tr>
    </tbody>
  </table>
</div>

</div>

<div>
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="5" class="text-center thead-cabecera"><strong>PARAMETROS TECNICOS</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center">EQUIPO:</td>
        <td></td>
        <td class="text-center">SIGNAL STRENGTH:</td>
        <td colspan="2"><?= htmlspecialchars($fichaTecnica['parametros']['signalStrength']) ?></td>
      </tr>
      <tr>
        <td class="text-center">FRECUENCIA:</td>
        <td><?= htmlspecialchars($fichaTecnica['parametros']['frecuencia'][0]) ?></td>
        <td class="text-center">NOISE FLOOR:</td>
        <td colspan="2"><?= htmlspecialchars($fichaTecnica['parametros']['noiseFloor']) ?></td>
      </tr>
      <tr>
        <td class="text-center">BASE:</td>
        <td><?= htmlspecialchars($fichaTecnica['parametros']['base'][0]) ?></td>
        <td class="text-center">TRANSMIT CCQ:</td>
        <td colspan="2"><?= htmlspecialchars($fichaTecnica['parametros']['transmiTccq']) ?></td>
      </tr>
      <tr>
        <td class="text-center">SUB-BASE:</td>
        <td><?= htmlspecialchars($fichaTecnica['parametros']['subBase'][0]) ?></td>
        <td class="text-center">TX/RX RATE:</td>
        <td><?= htmlspecialchars($fichaTecnica['parametros']['txRate']) ?></td>
        <td><?= htmlspecialchars($fichaTecnica['parametros']['rxRate']) ?></td>
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
        <td class="text-center">WAN:</td>
        <td><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['wan']) ?></td>
        <td class="text-center">LAN:</td>
        <td><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['ConfiWireless']['lan']) ?></td>
      </tr>
      <tr>
        <td class="text-center">MASCARA:</td>
        <td><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['mascara']) ?></td>
        <td class="text-center">ACCESO:</td>
        <td><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['ConfiWireless']['acceso']) ?></td>
      </tr>
      <tr>
        <td class="text-center">PUERTA DE ENLACE:</td>
        <td><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['puertaEnlace']) ?></td>
        <td class="text-center">SSID:</td>
        <td><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['ConfiWireless']['ssid']) ?></td>
      </tr>
      <tr>
        <td class="text-center">DNS1:</td>
        <td><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['dns1']) ?></td>
        <td class="text-center">SEGURIDAD:</td>
        <td><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['ConfiWireless']['seguridad']) ?></td>
      </tr>
      <tr>
        <td class="text-center">DNS2:</td>
        <td><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['dns2']) ?></td>
        <td class="text-center">OTROS:</td>
        <td><?= htmlspecialchars($fichaTecnica['ConfiRouter'][0]['ConfiRouter']['ConfiWireless']['otros']) ?></td>
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
          <td class="text-center">COSTO ANTENA:</td>
          <td><?= htmlspecialchars($fichaTecnica['venta']['costoAntena']) ?></td>
          <td colspan="2" class="text-center thead-cabecera-3"><strong>ANTENA</strong></td>
          <td colspan="2" class="text-center thead-cabecera-4"><strong>ROUTER</strong></td>
        </tr>
        <tr>
          <td class="text-center">COSTO ROUTER:</td>
          <td><?= htmlspecialchars($fichaTecnica['venta']['costoRouter']) ?></td>
          <td class="text-center">MARCA:</td>
          <td><?= htmlspecialchars($fichaTecnica['venta']['antena']['marca']) ?></td>
          <td class="text-center">MODELO:</td>
          <td><?= htmlspecialchars($fichaTecnica['venta']['router']['modelo']) ?></td>
        </tr>
        <tr>
          <td class="text-center">SUBTOTAL:</td>
          <td><?= htmlspecialchars($fichaTecnica['venta']['subtotal']) ?></td>
          <td class="text-center">MODELO:</td>
          <td><?= htmlspecialchars($fichaTecnica['venta']['antena']['modelo']) ?></td>
          <td class="text-center">MARCA:</td>
          <td><?= htmlspecialchars($fichaTecnica['venta']['router']['marca']) ?></td>
        </tr>
        <tr>
          <td class="text-center">ADELANTO:</td>
          <td><?= htmlspecialchars($fichaTecnica['venta']['adelanto']) ?></td>
          <td class="text-center">MAC:</td>
          <td><?= htmlspecialchars($fichaTecnica['venta']['antena']['mac']) ?></td>
          <td class="text-center">MAC:</td>
          <td><?= htmlspecialchars($fichaTecnica['venta']['router']['mac']) ?></td>
        </tr>
        <tr>
          <td class="text-center">SALDO EQUIPOS:</td>
          <td><?= htmlspecialchars($fichaTecnica['venta']['saldoEquipos']) ?></td>
          <td class="text-center">DESCRIPCIÓN:</td>
          <td><?= htmlspecialchars($fichaTecnica['venta']['antena']['descripcion']) ?></td>
          <td class="text-center">DESCRIPCIÓN:</td>
          <td><?= htmlspecialchars($fichaTecnica['venta']['router']['descripcion']) ?></td>
        </tr>
        <tr>
          <td class="text-center">MATERIAL ADICIONAL:</td>
          <td><?= htmlspecialchars($fichaTecnica['venta']['materialAdicional']) ?></td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td class="text-center">CONDICIÓN PAG:</td>
          <td><?= htmlspecialchars($fichaTecnica['venta']['condicionPag']) ?></td>
          <td class="text-center">ADELANTADO:</td>
          <td><?= htmlspecialchars($fichaTecnica['venta']['adelantado']) ?></td>
          <td class="text-center">CUMPLIENDO EL MES:</td>
          <td><?= htmlspecialchars($fichaTecnica['venta']['cumpliendoElMes']) ?></td>
        </tr>
        <tr>
          <td rowspan="5" class="text-center">DETALLES:</td>
          <td rowspan="5" colspan="6"><?= htmlspecialchars($fichaTecnica['venta']['detalles']) ?></td>
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
          <td></td>
          <td class="text-center">ADELANTADO:</td>
          <td class="text-center"><?= $fichaTecnica['alquilado']['condicionTiempo']['Adelantado'] ? 'X' : '' ?></td>
          <td class="text-center">CUMPLIENDO EL MES:</td>
          <td class="text-center"><?= $fichaTecnica['alquilado']['condicionTiempo']['Cumpliendo el mes'] ? 'X' : '' ?></td>
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
        <td colspan="3" class="text-center thead-cabecera">FICHAS DE CONTROL INTERNO PARA TODOS LOS MODOS DE INSTALACIONES</td>
        <td class="text-center">N°</td>
        <td><?= htmlspecialchars($resultado[0]['id_contrato']); ?></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center">PAGO SERVICIO:</td>
        <td><?= htmlspecialchars($fichaTecnica['deuda']['pagoServicio']) ?></td>
        <td class="text-center">SALDO PEND:</td>
        <td><?= htmlspecialchars($fichaTecnica['deuda']['saldoPendiente']) ?></td>
        <td></td>
      </tr>
      <tr>
        <td class="text-center">ADELANTO EQU:</td>
        <td><?= htmlspecialchars($fichaTecnica['deuda']['adelantoEquipo']) ?></td>
        <td colspan="3" class="text-center">DETALLES:</td>
      </tr>
      <tr>
        <td class="text-center">COSTO DE ALQ:</td>
        <td><?= htmlspecialchars($fichaTecnica['deuda']['costoAlquiler']) ?></td>
        <td rowspan="3" colspan="3"><?= htmlspecialchars($fichaTecnica['deuda']['detalle']) ?></td>
      </tr>
      <tr>
        <td class="text-center">MATE ADIC:</td>
        <td><?= htmlspecialchars($fichaTecnica['deuda']['materialAdicional']) ?></td>
      </tr>
      <tr>
        <td class="text-center">TOTAL CANCEL:</td>
        <td><?= htmlspecialchars($fichaTecnica['deuda']['totalCancelado']) ?></td>
      </tr>
      <tr>
        <td class="text-center">INSTALADOR:</td>
        <td colspan="2"></td>
        <td class="text-center">HORA:</td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>