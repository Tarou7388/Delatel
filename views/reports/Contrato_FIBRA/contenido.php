<?php
// Unificar datos de instalación: soporte (nuevo) o contrato (antiguo)
$gpon = null;

if (isset($fichaTecnica['fibr']['cambiosgpon'])) {
    $gpon = $fichaTecnica['fibr']['cambiosgpon'];
} elseif (isset($fichaTecnica['fibraoptica'])) {
    $gpon = [
        'pppoe' => $fichaTecnica['fibraoptica']['usuario'],
        'clave' => $fichaTecnica['fibraoptica']['claveacceso'],
        'potencia' => $fichaTecnica['fibraoptica']['potencia'],
        'router' => $fichaTecnica['fibraoptica']['router'],
        'repetidores' => $fichaTecnica['fibraoptica']['repetidores'] ?? [],
        'catv' => $fichaTecnica['fibraoptica']['router']['catv'] ?? false,
    ];
}

$idCaja = $fichaTecnica['idcaja'] ?? 0;
$vlan = $fichaTecnica['vlan'] ?? '';
$puerto = $fichaTecnica['puerto'] ?? '';
$periodo = $fichaTecnica['periodo'] ?? '';
?>

<h3 class="text-center">CONTROL DE INSTALACIÓN SERVICIO FTTH - DELAFIBER</h3>

<div class="container">
  <div style="text-align: right; font-family: Arial, sans-serif; font-size: 12px; margin-right: 35px;">
    <p>
      <?php if (!empty($resultado) && isset($resultado[0])): ?>
        <strong>N°:</strong> <?= htmlspecialchars($resultado[0]['id_contrato']); ?> &nbsp;
        <strong>Fecha Actual:</strong> <?= htmlspecialchars(date('Y-m-d (H:i)', strtotime($resultado[0]['FechaFichaInstalacion'] ?? $periodo))); ?> &nbsp;
      <?php else: ?>
        <strong>Error:</strong> Datos del contrato no disponibles.
      <?php endif; ?>
    </p>
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
      <?php if (!empty($resultado) && isset($resultado[0])): ?>
        <tr>
          <td><strong>CLIENTE:</strong></td>
          <td><?= htmlspecialchars($resultado[0]['NombreCliente']); ?></td>
          <td><strong>DNI:</strong></td>
          <td><?= htmlspecialchars($resultado[0]['NumeroDocumento']); ?></td>
        </tr>
        <tr>
          <td><strong>DIRECCIÓN:</strong></td>
          <td><?= htmlspecialchars($resultado[0]['DireccionContrato']); ?></td>
          <td><strong>CELULAR:</strong></td>
          <td><?= htmlspecialchars($resultado[0]['Telefono']); ?></td>
        </tr>
        <tr>
          <td><strong>REFERENCIA:</strong></td>
          <td><?= htmlspecialchars($resultado[0]['Referencia']); ?></td>
          <td><strong>ZONA:</strong></td>
          <td><?= htmlspecialchars($resultado[0]['Sector']); ?></td>
        </tr>
        <tr>
          <td><strong>PLAN:</strong></td>
          <td><?= htmlspecialchars($resultado[0]['NombrePaquete']); ?></td>
          <td><strong>PRECIO:</strong></td>
          <td>S/. <?= htmlspecialchars($resultado[0]['PrecioPaquete']); ?></td>
        </tr>
      <?php else: ?>
        <tr>
          <td colspan="4" class="text-center">Datos del usuario no disponibles.</td>
        </tr>
      <?php endif; ?>
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
      <?php if (!empty($gpon)): ?>
        <tr>
          <td><strong>USUARIO:</strong></td>
          <td class="text-center"><?= htmlspecialchars($gpon['pppoe']); ?></td>
          <td><strong>MARCA:</strong></td>
          <td class="text-center"><?= htmlspecialchars($gpon['router']['marca']); ?></td>
        </tr>
        <tr>
          <td><strong>CLAVE:</strong></td>
          <td class="text-center"><?= htmlspecialchars($gpon['clave']); ?></td>
          <td><strong>BANDA:</strong></td>
          <td class="text-center"><?= htmlspecialchars(is_array($gpon['router']['banda']) ? implode(", ", $gpon['router']['banda']) : $gpon['router']['banda']); ?></td>
        </tr>
        <tr>
          <td><strong>VLAN:</strong></td>
          <td class="text-center"><?= htmlspecialchars($vlan); ?></td>
          <td><strong>N° ANTENA:</strong></td>
          <td class="text-center"><?= htmlspecialchars($gpon['router']['numeroantena']); ?></td>
        </tr>
        <tr>
          <td><strong>SSID:</strong></td>
          <td class="text-center"><?= htmlspecialchars($gpon['router']['ssid']); ?></td>
          <td><strong>CATV:</strong></td>
          <td class="text-center"><?= $gpon['router']['catv'] ? 'Sí' : 'No'; ?></td>
        </tr>
        <tr>
          <td><strong>SEGURIDAD:</strong></td>
          <td class="text-center"><?= htmlspecialchars($gpon['router']['seguridad']); ?></td>
          <td><strong>MAC:</strong></td>
          <td class="text-center"><?= htmlspecialchars($gpon['router']['codigobarra']); ?></td>
        </tr>
      <?php else: ?>
        <tr>
          <td colspan="4" class="text-center">Datos de conexión no disponibles.</td>
        </tr>
      <?php endif; ?>
    </tbody>
  </table>
</div>

<div class="container">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="4" class="text-center thead-cabecera"><strong>DETALLES TÉCNICOS</strong></td>
      </tr>
    </thead>
    <tbody>
      <?php if (!empty($gpon)): ?>
        <tr>
          <td><strong>IP:</strong></td>
          <td class="text-center"><?= htmlspecialchars($gpon['router']['ip']); ?></td>
          <td><strong>POTENCIA:</strong></td>
          <td class="text-center"><?= htmlspecialchars($gpon['potencia']); ?></td>
        </tr>
        <tr>
          <td><strong>USUARIO:</strong></td>
          <td class="text-center"><?= htmlspecialchars($gpon['router']['ingresouserrouter']); ?></td>
          <td><strong>CLAVE DE ACCESO:</strong></td>
          <td class="text-center"><?= htmlspecialchars($gpon['router']['ingresopass']); ?></td>
        </tr>
        <tr>
          <td><strong>CAJA:</strong></td>
          <td class="text-center"><?= htmlspecialchars($nombrecaja) . " ($idCaja)"; ?></td>
          <td><strong>PUERTO:</strong></td>
          <td class="text-center"><?= htmlspecialchars($puerto); ?></td>
        </tr>
        <?php if (!empty($gpon['detalles'] ?? '')): ?>
          <tr>
            <td colspan="4" class="text-center"><strong>DETALLES:</strong></td>
          </tr>
          <tr>
            <td colspan="4"><?= htmlspecialchars($gpon['detalles']); ?></td>
          </tr>
        <?php endif; ?>
        <tr>
          <td><strong>TECNICO:</strong></td>
          <td colspan="3"><?= htmlspecialchars($resultado[0]['NombreTecnicoFicha'] ?? ''); ?></td>
        </tr>
      <?php else: ?>
        <tr>
          <td colspan="4" class="text-center">Detalles técnicos no disponibles.</td>
        </tr>
      <?php endif; ?>
    </tbody>
  </table>
</div>

<div class="container">
  <table class="tabla2">
    <?php if (!empty($gpon['repetidores'])): ?>
      <?php foreach ($gpon['repetidores'] as $repetidor): ?>
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
      <?php else: ?>
        <tr>
          <td colspan="6" class="text-center">No Hay Repetidores Adicionales.</td>
        </tr>
      <?php endif; ?>
    </tbody>
  </table>
</div>

<br>

<div class="container">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="8" class="text-center thead-cabecera-3"><strong>DETALLES DE COSTO</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>PAGO SERVICIO:</strong></td>
        <td colspan="2"></td>
        <td rowspan="6" colspan="5" class="text-center" style="vertical-align: top;"></td>
      </tr>
      <tr>
        <td><strong>PAGO DIGITAL:</strong></td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td><strong>INST. DIGITAL:</strong></td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td><strong>SINT. ADIC:</strong></td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td><strong>CABLE ADIC:</strong></td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td><strong>CONECT ADIC:</strong></td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td><strong>TOTAL:</strong></td>
        <td colspan="2"></td>
        <td><strong>FORMA PAG:</strong></td>
        <td colspan="4"></td>
      </tr>
    </tbody>
  </table>
</div>
