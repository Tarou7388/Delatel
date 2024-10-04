<?php
require_once '../models/Cliente.php';

$cliente = new Cliente();

if (isset($_GET['operacion'])) {
  switch ($_GET['operacion']) {
    case 'buscarClienteDoc':
      $valor = $_GET['numDoc'];
      if ($valor) {
        if (strlen($valor) == 9 || strlen($valor) == 8) {
          $resultado = $cliente->buscarClienteNumdoc(["numDoc" => $valor]);
        } elseif (strlen($valor) == 11) {
          $resultado = $cliente->buscarCLienteRuc(["numDoc" => $valor]);
        } else {
          $resultado = ["error" => "Valor no válido"];
        }
      } else {
        $resultado = ["error" => "Valor debe ser numérico"];
      }
      echo json_encode($resultado);
      break;
    case 'getAll':
      $resultado = $cliente->listarClientes();
      echo json_encode($resultado);
      break;
  }
}

if (isset($_POST['operacion'])) {
  switch ($_POST['operacion']) {
    case 'registrarCliente':
      $datos = [
        "idPersona"     => $_POST['idPersona'],
        "idEmpresa"     => $_POST['idEmpresa'],
        "direccion"     => $_POST['direccion'],
        "referencia"    => $_POST['referencia'],
        "idUsuario"     => $_POST['idUsuario'],
        "coordenadas"   => $_POST['coordenadas']
      ];
      $estado = $cliente->registrarCliente($datos);
      echo json_encode(["Guardado" => $estado]);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = $datos['operacion'];

  switch ($operacion) {
    case 'actualizarCliente':
      $datos = [
        "identificador"   => $datos['identificador'],
        "nombre"          => $datos['nombre'],
        "apellidos"       => $datos['apellidos'],
        "email"           => $datos['email'],
        "telefono"        => $datos['telefono'],
        "direccion"       => $datos['direccion'],
        "referencia"      => $datos['referencia'],
        "coordenadas"     => $datos['coordenadas'],
        "idUsuario"       => $datos['idUsuario']
      ];

      $estado = $cliente->actualizarClienteNumdoc($datos);
      echo json_encode(["Actualizado" => $estado]);
      break;
    case 'eliminarCliente':
      $datosDelete = [
        "idCliente"   => $datos['idCliente'],
        "idUsuario" => $datos['idUsuario']
      ];

      $estado = $cliente->eliminarClienteNumdoc($datosDelete);
      echo json_encode(["Eliminado" => $estado]);
      break;
  }
}
