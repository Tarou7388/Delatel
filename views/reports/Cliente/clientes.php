<?php
$HOST = "http://localhost/Delatel/";
?>
<h3>CLIENTE: <?= $resultado[0]['nombre_cliente']; ?></h3>
<img src="<?= $HOST ?>/image/Logo_Empresa_Delatel.svg" class="image-header" alt="Logo Empresa">

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
      <td class="text-center"><strong>NRO. DOCUMENTO:</strong></td>
      <td class="cell-margin"><?= $resultado[0]['identificador_cliente']; ?></td>
    </tr>

    <tr>
      <td class="text-center"><strong>NACIONALIDAD:</strong></td>
      <td class="cell-margin"><?= $resultado[0]['nacionalidad']; ?></td>
    </tr>

    <tr>
      <td class="text-center"><strong>TIPO DOCUMENTO:</strong></td>
      <td class="cell-margin"><?= $resultado[0]['tipo_doc']; ?></td>
    </tr>

    <tr>
      <td class="text-center"><strong>TELEFONO:</strong></td>
      <td class="cell-margin"><?= $resultado[0]['telefono']; ?></td>
    </tr>

    <tr>
      <td class="text-center"><strong>EMAIL:</strong></td>
      <td class="cell-margin"><?= $resultado[0]['email']; ?></td>
    </tr>

    <tr>
      <td class="text-center"><strong>DIRECCIÓN:</strong></td>
      <td class="cell-margin"><?= $resultado[0]['direccion']; ?></td>
    </tr>

    <tr>
      <td class="text-center"><strong>REFERENCIA:</strong></td>
      <td class="cell-margin"><?= $resultado[0]['referencia']; ?></td>
    </tr>

    <tr>
      <td class="text-center"><strong>COORDERNADAS:</strong></td>
      <td class="cell-margin"><?= $resultado[0]['coordenadas']; ?></td>
    </tr>

  </tbody>
</table>


<p class="text-right"><strong>Reporte Generado el día:</strong> <?= $fechaActual; ?></p>