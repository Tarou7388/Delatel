<?php
require_once 'Conexion.php';

class Sector extends Conexion
{
  private $pdo;

  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  public function add($params = []) {

  }

  public function getAll() {
    
  }
}
