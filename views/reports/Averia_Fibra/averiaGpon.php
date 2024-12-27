<?php
$HOST = "http://localhost/Delatel";
?>

<h3 class="text-center">CONTROL DE AVERÍAS SERVICIO FITH - DELAFIBER</h3>

<div class="container">
  <div style="text-align: right; font-family: Arial, sans-serif; font-size: 12px; margin-right: 35px;">
    <p><strong>N°:</strong> <?= $resultado[0]['id_contrato'] ?? 'N/A'; ?> &nbsp; <strong>Fecha:</strong> <?= $fechaActual; ?></p>
  </div>
</div>

<div>
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
        <td colspan="2">N/A</td>
        <td><strong>CONEXIÓN:</strong></td>
        <td colspan="2"><?= $resultado[0]['ficha_instalacion']['idcaja'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>PLAN:</strong></td>
        <td colspan="5"><?= $resultado[0]['paquete'] ?? 'N/A'; ?></td>
      </tr>
    </tbody>
  </table>
</div>

<div>
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

<div>
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

<div>
  <table style="margin-top:50px; width: 100%;">
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