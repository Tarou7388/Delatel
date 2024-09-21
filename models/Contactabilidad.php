<?php
require_once 'Conexion.php';

class Contactabilidad extends Conexion
{
  private $pdo;

  public function __CONSTRUCT()
  {
    $this->pdo = parent::getConexion();
  }

  public function getPlanes(){
    try{
      $query = $this->pdo->prepare("SELECT * FROM view_paquetes_info");
      $query->execute();
      return $query->fetchAll(PDO::FETCH_ASSOC);
    }catch(Exception $e){
      die($e->getMessage());
    }
  }
}
