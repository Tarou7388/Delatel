<?php

require_once 'Conexion.php';

class Mufa extends Conexion
{

  private $pdo;

  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  public function listarMufas()
  {
    $sql = "CALL spu_mufas_listar()";
    return $this->listarDatos($sql);
  }
}
