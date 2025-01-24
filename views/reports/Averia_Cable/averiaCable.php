<h3 class="text-center">CONTROL DE AVERÍAS SERVICIO CABLE - DELAFIBER</h3>

<div class="container">
  <div style="text-align: right; font-family: Arial, sans-serif; font-size: 12px; margin-right: 35px;">
    <p><strong>N°:</strong> <?= $resultado[0]['id_contrato'] ?? 'N/A'; ?> &nbsp; <strong>Fecha:</strong> <?= $fechaActual; ?></p>
  </div>
</div>

<div>
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="6" class="text-center"><strong>DATOS DEL USUARIO</strong></td>
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

<div>
  <table class="tabla2">
    <thead>
      <tr>
        <td colspan="6" class="text-center"><strong>PARÁMETROS TÉCNICOS CABLE</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>POTENCIA:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['cabl']['parametroscable']['potencia'] ?? 'N/A'; ?></td>
        <td><strong>SINTONIZADOR:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['cabl']['parametroscable']['sintonizador'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>TRIPLEXOR:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['cabl']['parametroscable']['triplexor'] ?? 'N/A'; ?></td>
        <td><strong>SPLITTER:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['cabl']['parametroscable']['splitter'][0]['cantidad'] ?? 'N/A'; ?> x <?= $resultado[0]['FichaAveria']['cabl']['parametroscable']['splitter'][0]['tipo'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>CONECTOR:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['cabl']['parametroscable']['conector']['numeroconector'] ?? 'N/A'; ?> x <?= $resultado[0]['FichaAveria']['cabl']['parametroscable']['conector']['precio'] ?? 'N/A'; ?></td>
        <td><strong>CABLE:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['cabl']['parametroscable']['cable']['metrosadicionales'] ?? 'N/A'; ?> m x <?= $resultado[0]['FichaAveria']['cabl']['parametroscable']['cable']['preciometro'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td colspan="6" class="text-center"><strong>ESTADO INICIAL</strong></td>
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
        <td colspan="6" class="text-center"><strong>CAMBIOS CABLE</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>POTENCIA:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['cabl']['cambioscable']['potencia'] ?? 'N/A'; ?></td>
        <td><strong>SINTONIZADOR:</strong></td>
        <td colspan="2"><?= !empty($resultado[0]['FichaAveria']['cabl']['cambioscable']['sintonizadores']) ? count($resultado[0]['FichaAveria']['cabl']['cambioscable']['sintonizadores']) . ' sintonizadores' : 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>TRIPLEXOR:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['cabl']['cambioscable']['triplexor'] ?? 'N/A'; ?></td>
        <td><strong>SPLITTER:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['cabl']['cambioscable']['splitter'][0]['cantidad'] ?? 'N/A'; ?> x <?= $resultado[0]['FichaAveria']['cabl']['cambioscable']['splitter'][0]['tipo'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td><strong>CONECTOR:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['cabl']['cambioscable']['conector']['numeroconector'] ?? 'N/A'; ?> x <?= $resultado[0]['FichaAveria']['cabl']['cambioscable']['conector']['precio'] ?? 'N/A'; ?></td>
        <td><strong>CABLE:</strong></td>
        <td colspan="2"><?= $resultado[0]['FichaAveria']['cabl']['cambioscable']['cable']['metrosadicionales'] ?? 'N/A'; ?> m x <?= $resultado[0]['FichaAveria']['cabl']['cambioscable']['cable']['preciometro'] ?? 'N/A'; ?></td>
      </tr>
      <tr>
        <td colspan="6" class="text-center"><strong>PROCEDIMIENTO DE SOLUCIÓN</strong></td>
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

<?php if (!empty($resultado[0]['FichaAveria']['cabl']['parametroscable']['sintonizadores'])): ?>
  <div>
    <table class="tabla2">
      <thead>
        <tr>
          <td colspan="5" class="text-center"><strong>DETALLES DE SINTONIZADORES</strong></td>
        </tr>
        <tr>
          <td><strong>CÓDIGO DE BARRA</strong></td>
          <td><strong>MARCA</strong></td>
          <td><strong>MODELO</strong></td>
          <td><strong>PRECIO</strong></td>
          <td><strong>SERIE</strong></td>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($resultado[0]['FichaAveria']['cabl']['parametroscable']['sintonizadores'] as $sintonizador): ?>
          <tr>
            <td><?= $sintonizador['codigoBarra'] ?? 'N/A'; ?></td>
            <td><?= $sintonizador['marca'] ?? 'N/A'; ?></td>
            <td><?= $sintonizador['modelo'] ?? 'N/A'; ?></td>
            <td><?= $sintonizador['precio'] ?? 'N/A'; ?></td>
            <td><?= $sintonizador['serie'] ?? 'N/A'; ?></td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
<?php endif; ?>

<?php if (!empty($resultado[0]['FichaAveria']['cabl']['cambioscable']['sintonizadores'])): ?>
  <div>
    <table class="tabla2" style="margin-top: 20px;">
      <thead>
        <tr>
          <td colspan="5" class="text-center"><strong>CAMBIOS DE SINTONIZADORES</strong></td>
        </tr>
        <tr>
          <td><strong>CÓDIGO DE BARRA</strong></td>
          <td><strong>MARCA</strong></td>
          <td><strong>MODELO</strong></td>
          <td><strong>PRECIO</strong></td>
          <td><strong>SERIE</strong></td>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($resultado[0]['FichaAveria']['cabl']['cambioscable']['sintonizadores'] as $cambio): ?>
          <tr>
            <td><?= $cambio['codigoBarra'] ?? 'N/A'; ?></td>
            <td><?= $cambio['marca'] ?? 'N/A'; ?></td>
            <td><?= $cambio['modelo'] ?? 'N/A'; ?></td>
            <td><?= $cambio['precio'] ?? 'N/A'; ?></td>
            <td><?= $cambio['serie'] ?? 'N/A'; ?></td>
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