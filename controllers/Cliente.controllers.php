<?php
require_once '../models/Cliente.php';

$cliente = new Cliente();

if(isset($_GET["operacion"])){
  switch($_GET['operacion']){
    case 'getByDoc':
      $resultado = $cliente->getByDoc(["doc" => $_GET['doc']]);
      echo json_encode($resultado);
      break;
  }
}

if (isset($_POST['operacion'])) {
  switch ($_POST['operacion']) {
    case 'add':
      $datos = [
        "idPersona"             => $_POST['idPersona'],
        "idempresa"             => $_POST['idempresa'],
        "direccion"             => $_POST['direccion'],
        "referencia"            => $_POST['referencia'],
        "iduser_create"         => $_POST['iduser_create']
      ];
      $estado = $producto->add($datos);
      echo json_encode(["Guardado" => $estado]);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $inputData = file_get_contents('php://input');
  $data = json_decode($inputData, true);

  if (isset($data['id_cliente'])) {
    $datos = [
      "idPersona"             => $data['idPersona'],
      "idempresa"             => $data['idempresa'],
      "direccion"             => $data['direccion'],
      "referencia"            => $data['referencia'],
      "iduser_create"         => $data['iduser_create'],
      "id_cliente"            => $data['id_cliente'],
    ];

    $estado = $producto->updateProducto($datos);
    echo json_encode(["Actualizado" => $estado]);
  } else {
    echo json_encode(["Actualizado" => false, "error" => "ID de producto no encontrado"]);
  }
}