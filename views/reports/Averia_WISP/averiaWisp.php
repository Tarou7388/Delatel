<h3 class="text-center">CONTROL DE AVERÍAS SERVICIO WISP - COMPUIVAN</h3>

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
        <td colspan="2"><?= $resultado[0]['SectorCliente'] ?? 'N/A'; ?></td>
        <td><strong>CONEXIÓN:</strong></td>
        <td colspan="2"><?= $resultado[0]['DireccionPersona'] ?? 'N/A'; ?></td>
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
        <td colspan="6" class="text-center thead-cabecera"><strong>PARAMETROS WIRELESS</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>BASE:</strong></td>
        <td><?= $resultado[0]['FichaAveria']['WISP']['parametros']['base'] ?? 'N/A'; ?></td>
        <td><strong>IP:</strong></td>
        <td><?= $resultado[0]['FichaAveria']['WISP']['parametros']['routers'][0]['lan'] ?? 'N/A'; ?></td>
        <td><strong>SEÑAL:</strong></td>
        <td><?= $resultado[0]['FichaAveria']['WISP']['parametros']['signalstrength'] ?? 'N/A'; ?></td>
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
        <td colspan="6" class="text-center thead-cabecera"><strong>CAMBIOS WIRELESS</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>N° BASE:</strong></td>
        <td><?= $resultado[0]['FichaAveria']['WISP']['cambios']['nuevabase'] ?? 'N/A'; ?></td>
        <td><strong>N° IP:</strong></td>
        <td><?= $resultado[0]['FichaAveria']['WISP']['cambios']['routers'][0]['lan'] ?? 'N/A'; ?></td>
        <td><strong>SEÑAL:</strong></td>
        <td><?= $resultado[0]['FichaAveria']['WISP']['cambios']['signalstrength'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td colspan="6" class="text-center thead-cabecera"><strong>PROCEDIMIENTO DE SOLUCIÓN</strong></td>
      </tr>
      <tr>
        <td colspan="6"><?= $resultado[0]['descripcion_solucion'] ?? 'N/A'; ?></td>
      </tr>
    </tbody>
  </table>
</div>

<div>
  <table class="tabla2">
    <tbody>
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