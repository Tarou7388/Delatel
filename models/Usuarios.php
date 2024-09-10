<?php

require_once "Conexion.php";

class Usuario extends Conexion
{

  private $pdo;

  public function __CONSTRUCT()
  {
    $this->pdo = parent::getConexion();
  }

  public function login($data = [])
  {
    try {
      $consulta = $this->pdo->prepare("CALL spu_login_usuarios(?)");
      $consulta->execute(
        array($data['nombreUser'])
      );

      return $consulta->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
      die($e->getMessage());
    }
  }
  public function registrar($data = []):bool
  {
    try {
      $status=false;
      $consulta = $this->pdo->prepare("CALL spu_usuarios_registrar(?,?,?,?)");
      $status=$consulta->execute(
        array(
          $data['idPersona'],
          $data['nombreUser'],
          $data['pass'],
          $data["iduser_create"]
        )
      );
      return $status;
    } catch (Exception $e) {
      die($e->getMessage());
    }
  }
  public function getUser(){
    try{
      $consulta = $this->pdo->prepare("CALL vw_usuarios");
      $consulta->execute();
      return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(Exception $e){
      return $e->getMessage();
    }
  }
}
