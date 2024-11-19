<?php

require_once '../models/Mufa.php';

$mufa = new Mufa();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  switch ($_GET['operacion']) {
    case 'listarMufas':
      $mufas = $mufa->listarMufas();
      echo json_encode($mufas);
      break;
  }
}