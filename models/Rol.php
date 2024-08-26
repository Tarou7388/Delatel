<?php
require_once "Conexion.php";

class Rol extends Conexion{
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
  public function getPermisos($data = []){
    try{
      $consulta = $this->pdo->prepare("CALL spu_listar_permisos(?)");
      $consulta->execute([
        $data['rol']
      ]);
      return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(Exception $e){
      return $e->getMessage();
    }
  }
}