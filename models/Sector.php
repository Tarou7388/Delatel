<?php
require_once 'Conexion.php';

class Sector extends Conexion
{
  private $pdo;

  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  public function add($params = [])
  {
    try {
      $consulta = $this->pdo->prepare("CALL spu_sectores_registrar(?,?,?)");
      $consulta->execute(array(
        $params["id_distrito"],
        $params["sector"],
        $params["iduser_create"]
      ));
      return $consulta->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
      die($e->getMessage());
    }
  }

  public function getAll() {}
}
