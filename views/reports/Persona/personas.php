<?php
$HOST = "http://localhost/DELATEL/";
?>
<table>
  <colgroup>
    <col style="width: 50%;">
    <col style="width: 50%;">
  </colgroup>
  <thead>
    <tr>
      <th>Cliente</th>
      <th>Correo</th>
      <th>Telefono</th>
      <th>Direccion</th>
      <th>Coordenada</th>
      <th>Referencia</th>
    </tr>
  </thead>
  <tbody>
    <?php
    foreach ($resultado as $persona) {
    ?>
      <tr>
        <td><?php echo $persona['nombre']; ?></td>
        <td><?php echo $persona['apellido']; ?></td>
        <td><?php echo $persona['correo']; ?></td>
        <td><?php echo $persona['telefono']; ?></td>
        <td><?php echo $persona['fecha_nacimiento']; ?></td>
        <td><?php echo $persona['genero']; ?></td>
        <td><?php echo $persona['estado_civil']; ?></td>
        <td><?php echo $persona['departamento']; ?></td>
        <td><?php echo $persona['provincia']; ?></td>
        <td><?php echo $persona['distrito']; ?></td>
        <td><?php echo $persona['direccion']; ?></td>
        <td><?php echo $persona['referencia']; ?></td>
        <td><?php echo $persona['fecha_registro']; ?></td>
      </tr>
    <?php
    }
    ?>
  </tbody>
</table>