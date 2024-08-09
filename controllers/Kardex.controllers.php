<?php
require_once "../models/Kardex.php";

$kardex = new Kardex();

if (isset($_POST['operacion'])) {
  switch ($_POST['operacion']) {
      case 'addmv':
          $datos = [
              "idcolaborador"     => $_POST['idcolaborador'],
              "idproducto"        => $_POST['idproducto'],
              "tipomovimiento"    => $_POST['tipomovimiento'],
              "cantidad"          => $_POST['cantidad'],
          ];
          $resultado = $kardex->add($datos);
          echo json_encode($resultado); //Este valor retorna la vista como JSON
          break;
  }
}

if (isset($_GET['operacion'])) {

  switch ($_GET['operacion']) {
      case 'getbyname':
          $kardexs = $kardex->getall(['producto' => $_GET['producto']]);
          echo json_encode($kardexs);
          break;
  }
}
