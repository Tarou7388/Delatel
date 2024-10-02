<?php
require_once 'Conexion.php';

class Paquete extends Conexion
{
  private $pdo;

  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  public function add($params = [])
  {
    try {
      $consulta = $this->pdo->prepare("CALL spu_paquetes_registrar(?,?,?,?,?)");
      $consulta->execute(array(
        $params["id_servicio"],
        $params["precio"],
        $params["fecha_inicio"],
        $params["fecha_fin"],
        $params["iduser_create"]
      ));
      return $consulta->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
      die($e->getMessage());
    }
  }

  public function getAll() {
    try{
      $query = $this->pdo->prepare("SELECT * FROM view_paquetes_info");
      $query->execute();
      return $query->fetchAll(PDO::FETCH_ASSOC);
    }catch (Exception $e) {
      die($e->getMessage());
    }
  }
}
