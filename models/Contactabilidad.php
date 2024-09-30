<?php
require_once 'Conexion.php';

class Contactabilidad extends Conexion
{
  private $pdo;

  public function __CONSTRUCT()
  {
    $this->pdo = parent::getConexion();
  }

  public function add($params = []){
    try{
      $status = false;
      $query = "CALL spu_contactabilidad_registrar(?,?,?,?,?,?)";
      $cmd = $this->pdo->prepare($query);
      $status = $cmd->execute(
        array(
          $params['idPersona'],
          $params['idPaquete'],
          $params['direccion'],
          $params['nota'],
          $params['idUsuario'],
          $params['fechaLimite']
        )
      );
      return $status;
    } catch (Exception $e){
      die($e->getMessage());
    }
  }

  public function getPersonas(){
    try{
      $query = $this->pdo->prepare("SELECT * FROM vw_contactabilidad_listar");
      $query->execute();
      return $query->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(Exception $e){
      die($e->getMessage());
    }
  }
}
