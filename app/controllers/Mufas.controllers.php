<?php

require_once '../models/Mufa.php';

$mufa = new Mufa();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  switch ($_GET['operacion']) {
    case 'listarMufas':
      $mufas = $mufa->listarMufas();
      echo json_encode($mufas);
      break;
    case 'mufaUso':
      $array = [
        'idMufa' => $_GET['idMufa']
      ];
      $respuesta = $mufa->mufaUso($array);
      echo json_encode($respuesta);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  switch ($_POST['operacion']) {
    case 'registrarMufa':
      $array = [
        'nombre' => $_POST['nombre'],
        'descripcion' => $_POST['descripcion'],
        'coordenadas' => $_POST['coordenadas'],
        'direccion' => $_POST['direccion'],
        'id_usuario' => $_POST['id_usuario']
      ];
      $respuesta = $mufa->registrarMufa($array);
      echo json_encode($respuesta);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  switch ($datos['operacion']) {
    case 'eliminarMufa':
      $array = [
        'idMufa' => $datos['idMufa'],
        'idUsuario' => $datos['idUsuario']
      ];
      $respuesta = $mufa->eliminarMufa($array);
      echo json_encode($respuesta);
      break;
  }
}