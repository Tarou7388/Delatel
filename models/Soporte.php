<?php
require_once 'Conexion.php';

class Soporte extends Conexion
{
  private $pdo;

  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  public function addSoporte($params = []): bool
  {
    try {
      $status = false;
      $query = $this->pdo->prepare("CALL spu_registrar_fichasoporte(?)");
      $Json = json_encode($params['wisp']);
      $status = $query->execute([$Json]);
      return $status;
    } catch (Exception $e) {
      return $e->getMessage();
    }
  }
}
