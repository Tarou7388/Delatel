<?php

use App\Controllers\Herramientas;

require_once '../models/Empresa.php';
require_once '../models/Persona.php';
require_once '../models/Cliente.php';
require_once './Herramientas.php';

$persona = new Persona();
$empresa = new Empresa();
$cliente = new Cliente();

if (isset($_GET['operacion'])) {
  switch ($_GET['operacion']) {
    case 'buscarClienteDoc':
      $valor = Herramientas::sanitizarEntrada($_GET['valor']);
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
    case 'buscarClienteExistencia':
      $nroDoc = Herramientas::sanitizarEntrada($_GET['nroDoc']);
      if (strlen($nroDoc) == 8 || strlen($nroDoc) == 9) {
        $resultado = $persona->buscarPersonaClienteDni(["nroDoc" => $_GET['nroDoc']]);
      } else if (strlen($nroDoc) == 11) {
        $resultado = $empresa->buscarEmpresaClienteRuc(["ruc" => $_GET['nroDoc']]);
      } else {
        $resultado = ["error" => "Valor no válido"];
      }
      echo json_encode($resultado);
      break;
    case 'listarClientes':
      $resultado = $cliente->listarClientes();
      echo json_encode($resultado);
      break;
    case 'buscarPorNombreApellido':
      $datos = Herramientas::sanitizarEntrada([
        "nombres" => $_GET['nombres'],
        "apellidos" => $_GET['apellidos']
      ]);
      $resultado = $cliente->buscarNombreyApellido($datos);
      echo json_encode($resultado);
      break;
  }
}

if (isset($_POST['operacion'])) {
  switch ($_POST['operacion']) {
    case 'registrarCliente':
      $idPersona = null;
      $idEmpresa = null;
      if (isset($_POST['idEmpresa']) && $_POST['idEmpresa'] != '') {
        $idEmpresa = $_POST['idEmpresa'];
        $idPersona = null;
      }
      if (isset($_POST['idPersona']) && $_POST['idPersona'] != '') {
        $idPersona = $_POST['idPersona'];
        $idEmpresa = null;
      }

      $datos = [
        "idPersona"     => $idPersona,
        "idEmpresa"     => $idEmpresa,
        "direccion"     => $_POST['direccion'],
        "referencia"    => $_POST['referencia'],
        "idUsuario"     => $_POST['idUsuario'],
        "coordenadas"   => $_POST['coordenadas']
      ];
      $respuesta = $cliente->registrarCliente($datos);
      echo json_encode($respuesta);
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
        "apellidos"   => Herramientas::formatearFecha($datos['apellidos']),
        "nombres"          => Herramientas::sanitizarEntrada($datos['nombres']),
        "telefono"       => Herramientas::sanitizarEntrada($datos['telefono']),
        "email"           => Herramientas::sanitizarEntrada($datos['email']),
        "direccion"        => Herramientas::sanitizarEntrada($datos['direccion']),
        "referencia"       => Herramientas::sanitizarEntrada($datos['referencia']),
        "coordenadas"      => Herramientas::sanitizarEntrada($datos['coordenadas']),
        "idUserUpdate"     => $datos['idUserUpdate'],
        "idPersona"       => Herramientas::sanitizarEntrada($datos['idPersona'])
      ];

      $estado = $cliente->actualizarClienteNumdoc($datos);
      echo json_encode(["Actualizado" => $estado]);
      break;
    case 'eliminarCliente':
      $datosDelete = [
        "idCliente"   => Herramientas::sanitizarEntrada($datos['idCliente']),
        "idUsuario" => Herramientas::sanitizarEntrada($datos['idUsuario'])
      ];

      $estado = $cliente->eliminarClienteNumdoc($datosDelete);
      echo json_encode(["Eliminado" => $estado]);
      break;
  }
}
