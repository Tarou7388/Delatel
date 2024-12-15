<?php
$HOST = "http://localhost/Delatel/";
?>
<h3 style="text-align: right; margin-right: 400px;">CLIENTE: <?= $resultado[0]['nombre_cliente']; ?></h3>
<img src="<?= $HOST ?>/image/Logo_Empresa_Delatel.svg" class="image-header" alt="Logo Empresa" style="margin-left: 650px;">

<table class="tabla">
  <colgroup>
    <col style="width: 50%;">
    <col style="width: 50%;">
  </colgroup>
  <tbody>
    <tr>
      <td colspan="1" class="thead-cabecera text-center"><strong>DATOS</strong></td>
    </tr>
    <tr>
      <td><strong>NRO. DOCUMENTO:</strong></td>
      <td class="cell-margin"><?= $resultado[0]['identificador_cliente']; ?></td>
    </tr>

    <tr>
      <td><strong>NACIONALIDAD:</strong></td>
      <td class="cell-margin"><?= $resultado[0]['nacionalidad']; ?></td>
    </tr>

    <tr>
      <td><strong>TIPO DOCUMENTO:</strong></td>
      <td class="cell-margin"><?= $resultado[0]['tipo_doc']; ?></td>
    </tr>

    <tr>
      <td><strong>TELEFONO:</strong></td>
      <td class="cell-margin"><?= $resultado[0]['telefono']; ?></td>
    </tr>

    <tr>
      <td><strong>EMAIL:</strong></td>
      <td class="cell-margin"><?= $resultado[0]['email']; ?></td>
    </tr>

    <tr>
      <td><strong>DIRECCIÓN:</strong></td>
      <td class="cell-margin"><?= $resultado[0]['direccion']; ?></td>
    </tr>

    <tr>
      <td><strong>REFERENCIA:</strong></td>
      <td class="cell-margin"><?= $resultado[0]['referencia']; ?></td>
    </tr>

    <tr>
      <td><strong>COORDERNADAS:</strong></td>
      <td class="cell-margin"><?= $resultado[0]['coordenadas']; ?></td>
    </tr>

  </tbody>
</table>


<p style="text-align: left; margin-left: 450px;" ><strong>Reporte Generado el día:</strong> <?= $fechaActual; ?></p>