<?php
require_once '../models/Cliente.php';

$cliente = new Cliente();

if (isset($_GET["valor"])) {
  $valor = $_GET['valor'];
  
  // Verificar si el parámetro es un número y tiene una longitud adecuada
  if ($valor) {
      if (strlen($valor) == 8) {
          // Asumir que el valor es un DNI
          $resultado = $cliente->getByPersona(["numDoc" => $valor]);
      } elseif (strlen($valor) > 8) {
          // Asumir que el valor es un RUC
          $resultado = $cliente->getByEmpresa(["numDoc" => $valor]);
      } else {
          // Parámetro no válido
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
        "iduser_create" => $_POST['iduser_create'],
        "coordenadas" => $_POST['coordenadas']
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
      "coordenadas"    => $data['coordenadas']
    ];

    $estado = $cliente->update($datos);
    echo json_encode(["Actualizado" => $estado]);
  } else {
    echo json_encode(["Actualizado" => false, "error" => "ID de cliente no encontrado"]);
  }
}
