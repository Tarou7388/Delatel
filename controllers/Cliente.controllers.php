<?php
require_once '../models/Cliente.php';

$cliente = new Cliente();

if (isset($_GET['operacion'])) {
  switch ($_GET['operacion']) {
    case 'getByDoc':
      $valor = $_GET['numDoc'];
      if ($valor) {
        if (strlen($valor) == 9 || strlen($valor) == 8) {
          $resultado = $cliente->getByPersona(["numDoc" => $valor]);
        } elseif (strlen($valor) == 11) {
          $resultado = $cliente->getByEmpresa(["numDoc" => $valor]);
        } else {
          $resultado = ["error" => "Valor no válido"];
        }
      } else {
        $resultado = ["error" => "Valor debe ser numérico"];
      }
      echo json_encode($resultado);
      break;
    case 'getAll':
      $resultado = $cliente->getAll();
      echo json_encode($resultado);
      break;
  }
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

  if (isset($data['identificador'])) {
    $datos = [
      "identificador"   => $data['identificador'],
      "nombre"         => $data['nombre'],
      "apellidos"      => $data['apellidos'],
      "email"          => $data['email'],
      "telefono"       => $data['telefono'],
      "direccion"      => $data['direccion'],
      "referencia"     => $data['referencia'],
      "coordenadas"    => $data['coordenadas'],
      "iduser_update"  => $data['iduser_update']
    ];

    $estado = $cliente->update($datos);
    echo json_encode(["Actualizado" => $estado]);
  } else {
    echo json_encode(["Actualizado" => false, "error" => "ID de cliente no encontrado"]);
  }
}
