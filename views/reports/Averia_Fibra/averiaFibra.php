<h3 class="text-center">CONTROL DE AVERÍAS SERVICIO FITH - DELAFIBER</h3>

<div class="container">
  <div style="text-align: right; font-family: Arial, sans-serif; font-size: 15px; margin-right: 70px;">
    <p><strong>N°:</strong> <?= $resultado[0]['id_contrato'] ?? 'N/A'; ?> &nbsp; <strong>Fecha:</strong> <?= $fechaActual; ?></p>
  </div>
</div>

<div style="margin-top: 20px;">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="6" class="text-center thead-cabecera"><strong>DATOS DEL USUARIO</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>CLIENTE:</strong></td>
        <td colspan="5"><?= $resultado[0]['NombreCliente'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>DNI:</strong></td>
        <td colspan="2"><?= $resultado[0]['NumeroDocumento'] ?? 'N/A'; ?></td>
        <td><strong>TELÉFONO:</strong></td>
        <td colspan="2"><?= $resultado[0]['Telefono'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>ZONA:</strong></td>
        <td colspan="2"><?= $resultado[0]['SectorCliente'] ?? 'N/A'; ?></td>
        <td><strong>CONEXIÓN:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['idcaja'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>PLAN:</strong></td>
        <td colspan="5"><?= $resultado[0]['paquete'] ?? 'N/A'; ?></td>
      </tr>
    </tbody>
  </table>
</div>

<div style="margin-top: 20px;">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="6" class="text-center thead-cabecera"><strong>PARÁMETROS TÉCNICOS</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>PPPoE:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['fibr']['parametrosgpon']['pppoe'] ?? 'N/A'; ?></td>
        <td><strong>POTENCIA:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['fibr']['parametrosgpon']['potencia'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>CATV:</strong></td>
        <td colspan="2"><?= isset($resultado[0]['FichaAveria']['fibr']['parametrosgpon']['router']['catv']) && $resultado[0]['FichaAveria']['fibr']['parametrosgpon']['router']['catv'] ? 'Sí' : 'No'; ?></td>
        <td><strong>CLAVE:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['fibr']['parametrosgpon']['clave'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>VLAN:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['fibr']['parametrosgpon']['vlan'] ?? 'N/A'; ?></td>
        <td><strong>POTENCIA:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['fibr']['parametrosgpon']['potencia'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>SSID:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['fibr']['parametrosgpon']['router']['ssid'] ?? 'N/A'; ?></td>
        <td><strong>PASSWORD:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['fibr']['parametrosgpon']['router']['seguridad'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td colspan="6" class="text-center thead-cabecera-2"><strong>ESTADO INICIAL</strong></td>
      </tr>
      <tr>
        <td colspan="6"><?= $resultado[0]['descripcion_problema'] ?? 'N/A'; ?></td>
      </tr>
    </tbody>
  </table>
</div>

<div style="margin-top: 20px;">
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="6" class="text-center thead-cabecera"><strong>CAMBIOS TÉCNICOS GPON</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>PPPoE:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['fibr']['cambiosgpon']['pppoe'] ?? 'N/A'; ?></td>
        <td><strong>POTENCIA:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['fibr']['cambiosgpon']['potencia'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>CATV:</strong></td>
        <td colspan="2"><?= isset($resultado[0]['FichaAveria']['fibr']['cambiosgpon']['router']['catv']) && $resultado[0]['FichaAveria']['fibr']['cambiosgpon']['router']['catv'] ? 'Sí' : 'No'; ?></td>
        <td><strong>CLAVE:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['fibr']['cambiosgpon']['clave'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>VLAN:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['fibr']['cambiosgpon']['vlan'] ?? 'N/A'; ?></td>
        <td><strong>POTENCIA:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['fibr']['cambiosgpon']['potencia'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>SSID:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['fibr']['cambiosgpon']['router']['ssid'] ?? 'N/A'; ?></td>
        <td><strong>PASSWORD:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['fibr']['cambiosgpon']['router']['seguridad'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td colspan="6" class="text-center thead-cabecera"><strong>PROCEDIMIENTO DE SOLUCIÓN</strong></td>
      </tr>
      <tr>
        <td colspan="6"><?= $resultado[0]['descripcion_solucion'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>TÉCNICO:</strong></td>
        <td colspan="5"><?= $resultado[0]['NombreTecnico'] ?? 'N/A'; ?></td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Repetidores -->
<?php
// Función para comparar repetidores
function repetidoresIguales($repetidor1, $repetidor2)
{
  $campos = ['ssid', 'contrasenia', 'marca', 'modelo', 'serie', 'ip'];
  foreach ($campos as $campo) {
    if (($repetidor1[$campo] ?? null) !== ($repetidor2[$campo] ?? null)) {
      return false;
    }
  }
  return true;
}

$repetidoresParametros = $resultado[0]['FichaAveria']['fibr']['parametrosgpon']['repetidores'] ?? [];
$repetidoresCambios = $resultado[0]['FichaAveria']['fibr']['cambiosgpon']['repetidores'] ?? [];
$repetidoresCambiados = [];
$repetidoresAgregados = [];
$repetidoresEliminados = [];

// Identificar cambios, agregados y eliminados
foreach ($repetidoresCambios as $repetidorCambio) {
  $encontrado = false;
  foreach ($repetidoresParametros as $repetidorParametro) {
    if ($repetidorCambio['numero'] == $repetidorParametro['numero']) {
      if (!repetidoresIguales($repetidorCambio, $repetidorParametro)) {
        $repetidoresCambiados[] = $repetidorCambio;
      }
      $encontrado = true;
      break;
    }
  }
  if (!$encontrado) {
    $repetidoresAgregados[] = $repetidorCambio;
  }
}

foreach ($repetidoresParametros as $repetidorParametro) {
  $encontrado = false;
  foreach ($repetidoresCambios as $repetidorCambio) {
    if ($repetidorCambio['numero'] == $repetidorParametro['numero']) {
      $encontrado = true;
      break;
    }
  }
  if (!$encontrado) {
    $repetidoresEliminados[] = $repetidorParametro;
  }
}
?>

<?php if (!empty($repetidoresCambiados)): ?>
  <div style="margin-top: 80px;">
    <table class="tabla2">
      <thead>
        <tr>
          <td colspan="6" class="text-center thead-cabecera"><strong>REPETIDORES CAMBIADOS</strong></td>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($repetidoresCambiados as $repetidorCambio): ?>
          <?php
          // Encontrar el repetidor correspondiente en los parámetros
          $repetidorOriginal = null;
          foreach ($repetidoresParametros as $repetidorParametro) {
            if ($repetidorParametro['numero'] === $repetidorCambio['numero']) {
              $repetidorOriginal = $repetidorParametro;
              break;
            }
          }
          ?>
          <?php if ($repetidorOriginal): ?>
            <tr>
              <td colspan="6" class="text-center thead-subcabecera">
                <strong>Repetidor Número: <?= $repetidorCambio['numero'] ?? 'N/A'; ?></strong>
              </td>
            </tr>
            <tr>
              <td><strong>Campos</strong></td>
              <td colspan="2" class="text-center"><strong>Antes del cambio</strong></td>
              <td colspan="3" class="text-center"><strong>Después del cambio</strong></td>
            </tr>
            <?php
            $campos = ['ssid', 'contrasenia', 'marca', 'modelo', 'serie', 'ip'];
            foreach ($campos as $campo):
              if (($repetidorOriginal[$campo] ?? null) !== ($repetidorCambio[$campo] ?? null)):
            ?>
                <tr>
                  <td><strong><?= strtoupper($campo); ?>:</strong></td>
                  <td colspan="2"><?= $repetidorOriginal[$campo] ?? 'N/A'; ?></td>
                  <td colspan="3"><?= $repetidorCambio[$campo] ?? 'N/A'; ?></td>
                </tr>
            <?php endif;
            endforeach; ?>
          <?php endif; ?>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
<?php endif; ?>

<?php if (!empty($repetidoresAgregados)): ?>
  <div style="margin-top: 80px;">
    <table class="tabla2">
      <?php foreach ($repetidoresAgregados as $repetidorAgregado): ?>
        <thead>
          <tr>
            <td colspan="6" class="text-center thead-cabecera"><strong>REPETIDORES AGREGADOS</strong></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>SSID:</strong></td>
            <td colspan="2"><?= $repetidorAgregado['ssid'] ?? 'N/A'; ?></td>
            <td><strong>CONTRASEÑA:</strong></td>
            <td colspan="2"><?= $repetidorAgregado['contrasenia'] ?? 'N/A'; ?></td>
          </tr>
          <tr>
            <td><strong>MARCA:</strong></td>
            <td colspan="2"><?= $repetidorAgregado['marca'] ?? 'N/A'; ?></td>
            <td><strong>MODELO:</strong></td>
            <td colspan="2"><?= $repetidorAgregado['modelo'] ?? 'N/A'; ?></td>
          </tr>
          <tr>
            <td><strong>SERIE:</strong></td>
            <td colspan="2"><?= $repetidorAgregado['serie'] ?? 'N/A'; ?></td>
            <td><strong>IP:</strong></td>
            <td colspan="2"><?= $repetidorAgregado['ip'] ?? 'N/A'; ?></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
  </div>
<?php endif; ?>

<?php if (!empty($repetidoresEliminados)): ?>
  <div style="margin-top: 80px;">
    <table class="tabla2">
      <?php foreach ($repetidoresEliminados as $repetidorEliminado): ?>
        <thead>
          <tr>
            <td colspan="6" class="text-center thead-cabecera"><strong>REPETIDORES ELIMINADOS</strong></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>SSID:</strong></td>
            <td colspan="2"><?= $repetidorEliminado['ssid'] ?? 'N/A'; ?></td>
            <td><strong>CONTRASEÑA:</strong></td>
            <td colspan="2"><?= $repetidorEliminado['contrasenia'] ?? 'N/A'; ?></td>
          </tr>
          <tr>
            <td><strong>MARCA:</strong></td>
            <td colspan="2"><?= $repetidorEliminado['marca'] ?? 'N/A'; ?></td>
            <td><strong>MODELO:</strong></td>
            <td colspan="2"><?= $repetidorEliminado['modelo'] ?? 'N/A'; ?></td>
          </tr>
          <tr>
            <td><strong>SERIE:</strong></td>
            <td colspan="2"><?= $repetidorEliminado['serie'] ?? 'N/A'; ?></td>
            <td><strong>IP:</strong></td>
            <td colspan="2"><?= $repetidorEliminado['ip'] ?? 'N/A'; ?></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
  </div>
<?php endif; ?>

<div>
  <table style="margin-top:150px; width: 100%;">
    <tbody>
      <tr>
        <td class="no-border">
          <span style="display: block;">__________________________</span>
          <span><strong>V°B° CLIENTE</strong></span>
        </td>
        <td class="no-border">
          <span style="display: block;">__________________________</span>
          <span><strong>TÉCNICO</strong></span>
        </td>
      </tr>
    </tbody>
  </table>
</div>