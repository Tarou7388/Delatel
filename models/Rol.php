<?php
require_once "Conexion.php";

class Roles extends Conexion{
  private $pdo;

  public function __construct()
  {
    $this -> pdo = parent::getConexion();
  }

  public function getAllRol(){
    $query  =$this->pdo->prepare("SELECT rol from tb_roles");
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }

  public function addRol($params=[]){
    try{
      $query = $this->pdo->prepare("CALL spu_registrar_roles(?)");
      $query->execute([
        $params['rol']
      ]);
    }
    catch(Exception $e){
      return $e->getMessage();
    }
  }
}