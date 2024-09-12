<?php
require_once '../models/Cliente.php';

$cliente = new Cliente();

if (isset($_GET["valor"])) {
  $valor = $_GET['valor'];
  if ($valor) {
      if (strlen($valor) == 8) {
          $resultado = $cliente->getByDni(["dni" => $valor]);
      } elseif (strlen($valor) > 8) {
          $resultado = $cliente->getByRuc(["ruc" => $valor]);
      } else {
          $resultado = ["error" => "Valor no válido"];
      }
  } else {
      // Parámetro no es numérico
      $resultado = ["error" => "Valor debe ser numérico"];
  }
  
  echo json_encode($resultado);
}


if (isset($_POST['operacion'])) {
  switch ($_POST['operacion']) {
    case 'add':
      $datos = [
        "idPersona"     => $_POST['idPersona'],
        "idempresa"     => $_POST['idempresa'],
        "direccion"     => $_POST['direccion'],
        "referencia"    => $_POST['referencia'],
        "iduser_create" => $_POST['iduser_create']
      ];
      $estado = $cliente->add($datos);
      echo json_encode(["Guardado" => $estado]);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $inputData = file_get_contents('php://input');
  $data = json_decode($inputData, true);

  if (isset($data['id_cliente'])) {
    $datos = [
      "idPersona"     => $data['idPersona'],
      "idempresa"     => $data['idempresa'],
      "direccion"     => $data['direccion'],
      "referencia"    => $data['referencia'],
      "iduser_update" => $data['iduser_update'],
      "id_cliente"    => $data['id_cliente'],
    ];

    $estado = $cliente->update($datos);
    echo json_encode(["Actualizado" => $estado]);
  } else {
    echo json_encode(["Actualizado" => false, "error" => "ID de cliente no encontrado"]);
  }
}
