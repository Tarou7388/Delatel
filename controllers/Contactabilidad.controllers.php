<?php
require_once '../models/Contactabilidad.php';

$contactabilidad = new Contactabilidad();

if($_SERVER['REQUEST_METHOD']==='GET'){
  switch($_GET['operacion']){
    case 'getPlanes':
      echo json_encode($contactabilidad->getPlanes());
      break;
    case 'getPersonas':
      echo json_encode($contactabilidad->getPersonas());
      break;
  }
}